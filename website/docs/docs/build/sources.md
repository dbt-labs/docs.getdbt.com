---
title: "Add sources to your DAG"
sidebar_label: "Sources"
description: "Define data source tables when developing in dbt."
id: "sources"
search_weight: "heavy"
---

## Related reference docs
* [Source properties](/reference/source-properties)
* [Source configurations](/reference/source-configs)
* [`{{ source() }}` Jinja function](/reference/dbt-jinja-functions/source)
* [`source freshness` command](/reference/commands/source)

## Using sources
Sources make it possible to name and describe the data loaded into your warehouse by your Extract and Load tools. By declaring these tables as sources in dbt, you can then
- select from source tables in your models using the [`{{ source() }}` function,](/reference/dbt-jinja-functions/source) helping define the lineage of your data
- test your assumptions about your source data
- calculate the freshness of your source data

### Declaring a source

Sources are defined in `.yml` files nested under a `sources:` key.

<File name='models/<filename>.yml'>

```yaml

sources:
  - name: jaffle_shop
    database: raw  
    schema: jaffle_shop  
    tables:
      - name: orders
      - name: customers

  - name: stripe
    tables:
      - name: payments
```

</File>

*By default, `schema` will be the same as `name`. Add `schema` only if you want to use a source name that differs from the existing schema.

If you're not already familiar with these files, be sure to check out [the documentation on properties.yml files](/reference/configs-and-properties) before proceeding.

### Selecting from a source

Once a source has been defined, it can be referenced from a model using the [`{{ source()}}` function](/reference/dbt-jinja-functions/source).


<File name='models/orders.sql'>

```sql
select
  ...

from {{ source('jaffle_shop', 'orders') }}

left join {{ source('jaffle_shop', 'customers') }} using (customer_id)

```

</File>

dbt will compile this to the full <Term id="table" /> name:

<File name='target/compiled/jaffle_shop/models/my_model.sql'>

```sql

select
  ...

from raw.jaffle_shop.orders

left join raw.jaffle_shop.customers using (customer_id)

```

</File>

Using the `{{ source () }}` function also creates a dependency between the model and the source table.

<Lightbox src="/img/docs/building-a-dbt-project/sources-dag.png" title="The source function tells dbt a model is dependent on a source "/>

### Testing and documenting sources
You can also:
- Add data tests to sources
- Add descriptions to sources, that get rendered as part of your documentation site

These should be familiar concepts if you've already added data tests and descriptions to your models (if not check out the guides on [testing](/docs/build/data-tests) and [documentation](/docs/build/documentation)).

<File name='models/<filename>.yml'>

```yaml

sources:
  - name: jaffle_shop
    description: This is a replica of the Postgres database used by our app
    tables:
      - name: orders
        database: raw
        description: >
          One record per order. Includes cancelled and deleted orders.
        columns:
          - name: id
            description: Primary key of the orders table
            data_tests:
              - unique
              - not_null
          - name: status
            description: Note that the status can change over time

      - name: ...

  - name: ...
```

</File>

You can find more details on the available properties for sources in the [reference section](/reference/source-properties).

### FAQs
<FAQ path="Project/source-has-bad-name" />
<FAQ path="Project/source-in-different-database" />
<FAQ path="Models/source-quotes" />
<FAQ path="Tests/testing-sources" />
<FAQ path="Runs/running-models-downstream-of-source" />

## Source data freshness
With a couple of extra configs, dbt can optionally capture the "freshness" of the data in your source tables. This is useful for understanding if your data pipelines are in a healthy state, and is a critical component of defining SLAs for your warehouse.

### Declaring source freshness
To configure source freshness information, add a `freshness` block to your source and `loaded_at_field` to your table declaration:

<File name='models/<filename>.yml'>

```yaml

sources:
  - name: jaffle_shop
    database: raw
    config: 
      freshness: # default freshness
        # changed to config in v1.9
        warn_after: {count: 12, period: hour}
        error_after: {count: 24, period: hour}
      loaded_at_field: _etl_loaded_at # changed to config in v1.10

    tables:
      - name: orders
        config:
          freshness: # make this a little more strict
            warn_after: {count: 6, period: hour}
            error_after: {count: 12, period: hour}

      - name: customers # this inherits the default freshness defined in the jaffle_shop source block at the beginning


      - name: product_skus
        config:
          freshness: null # do not check freshness for this table
```

</File>

In the `freshness` block, one or both of `warn_after` and `error_after` can be provided. If neither is provided, then dbt will not calculate freshness for the tables in this source.

Additionally, the `loaded_at_field` is required to calculate freshness for a table (except for cases where dbt can leverage warehouse metadata to calculate freshness). If a `loaded_at_field`, or viable alternative, is not provided, then dbt will not calculate freshness for the table.

These configs are applied hierarchically, so `freshness` and `loaded_at_field` values specified for a `source` will flow through to all of the `tables` defined in that source. This is useful when all of the tables in a source have the same `loaded_at_field`, as the config can just be specified once in the top-level source definition.

### Checking source freshness
To obtain freshness information for your sources, use the `dbt source freshness` command ([reference docs](/reference/commands/source)):

```
$ dbt source freshness
```

Behind the scenes, dbt uses the freshness properties to construct a `select` query, shown below. You can find this query in the [query logs](/faqs/Runs/checking-logs).

```sql
select
  max(_etl_loaded_at) as max_loaded_at,
  convert_timezone('UTC', current_timestamp()) as calculated_at
from raw.jaffle_shop.orders

```

The results of this query are used to determine whether the source is fresh or not:

<Lightbox src="/img/docs/building-a-dbt-project/snapshot-freshness.png" title="Uh oh! Not everything is as fresh as we'd like!"/>

### Build models based on source freshness

Our best practice recommendation is to use [data source freshness](/docs/build/sources#declaring-source-freshness). This will allow settings to be transfered into a `.yml` file where source freshness is defined on [model level](/reference/resource-properties/freshness).

To build models based on source freshness in dbt:

1. Run `dbt source freshness` to check the freshness of your sources.
2. Use the `dbt build --select source_status:fresher+` command to build and test models downstream of fresher sources.

Using these commands in order makes sure models update with the latest data. This eliminates wasted compute cycles on unchanged data and builds models _only_ when necessary. 

Set [source freshness snapshots](/docs/deploy/source-freshness#enabling-source-freshness-snapshots) to 30 minutes to check for source freshness, then run a job which rebuilds every hour to rebuild model. This setup retrieves all the models and rebuild them in one attempt if their source freshness has expired. For more information, refer to [Source freshness snapshot frequency](/docs/deploy/source-freshness#source-freshness-snapshot-frequency).

### Filter

Some databases can have tables where a filter over certain columns are required, in order prevent a full scan of the table, which could be costly. In order to do a freshness check on such tables a `filter` argument can be added to the configuration, for example, `filter: _etl_loaded_at >= date_sub(current_date(), interval 1 day)`. For the example above, the resulting query would look like

```sql
select
  max(_etl_loaded_at) as max_loaded_at,
  convert_timezone('UTC', current_timestamp()) as calculated_at
from raw.jaffle_shop.orders
where _etl_loaded_at >= date_sub(current_date(), interval 1 day)
```

### FAQs
<FAQ path="Project/exclude-table-from-freshness" />
<FAQ path="Snapshots/snapshotting-freshness-for-one-source" />
<FAQ path="Project/dbt-source-freshness" />
