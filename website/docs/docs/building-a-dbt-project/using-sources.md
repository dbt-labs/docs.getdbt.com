---
title: "Sources"
id: "using-sources"
---

## Overview

Sources make it possible to name and describe your source data tables. Sources are useful for

1. selecting from source tables in your [base models](best-practices#limit-dependencies-on-raw-data)
2. testing your assumptions about your source data
3. calculating the freshness of your source data

Sources can be defined in [schema.yml files](declaring-properties) alongside model definitions. For information about testing sources, check out the docs on [testing](testing) in dbt.

## Defining sources

Sources are defined in `schema.yml` files. If you're not already familiar with these files, be sure to check out [the documentation on schema.yml files](declaring-properties) before proceeding. Use a `sources` block to define sources:

<File name='schema.yml'>

```yaml

# This example defines a source called `source_1` containing one table
# called `table_1`. This is a minimal example of a source definition.

version: 2

sources:
  - name: source_1
    tables:
      - name: table_1
      - name: table_2

  - name: source_2
    tables:
      - name: table_1
```

</File>

Once a source has been defined, it can be referenced from a model using the [source()](source) function.

<File name='my_model.sql'>

```sql
/*
    The source function accepts two arguments:
      1. The name of the source
      2. The name of the table in that source
*/

select * from {{ source('source_1', 'table_1') }}

/*
	This is compiled to:

    select * from "target_database"."source_1"."table_1"

*/
```

</File>

## Configuring Sources

### Overriding source database, schema, and identifier

By default, dbt will use the `name` of the specified source and table to construct a table name for the source table. The database, schema, and identifier for any given source can be overridden in the `schema.yml` file. This is useful if your source data table names are unduly long or confusing.

<File name='schema.yml'>

```yaml

# This source entry describes the table:
#   "raw"."public"."Orders_"
#
# It can be referenced with:
#  {{ source('ecommerce', 'orders') }}

version: 2

sources:
  - name: ecommerce
    database: raw  # Tell dbt to look for the source in the "raw" database
    schema: public # You wouldn't put your source data in public, would you?
    tables:
      - name: orders
        identifier: Orders_ # To alias table names to account for strange casing or naming of tables
```

</File>

### Overriding quoting

By default, dbt will not quote the database, schema, or identifier for the source tables that you've specified. To force dbt to quote one of these values, use the `quoting:` config. This config can be specified for all tables in a source, or for a specific source table. Quoting configs defined for a specific source table override the quoting configs specified for the top-level source.

<File name='schema.yml'>

```yaml
version: 2

sources:
  - name: ecommerce
    # Set default quoting configs for the `ecommerce` source
    quoting:
      database: false
      schema: false
      identifier: false

    tables:
      - name: order_item
      - name: order
        # This overrides the `ecommerce` quoting config
        quoting:
          identifier: true
```

</File>

## Complete example

<File name='models/ecommerce/sources.yml'>

```yaml
version: 2

sources:
  - name: ecommerce
    database: raw
    schema: public
    loader: emr # informational only (free text)
    loaded_at_field: _loaded_at # configure for all sources

    # meta fields are rendered in auto-generated documentation
    meta:
      contains_pii: true
      owner: "@alice"

    # Add tags to this source
    tags:
      - ecom
      - pii

    quoting:
      database: false
      schema: false
      identifier: false

    tables:
      - name: orders
        identifier: Orders_
        loaded_at_field: updated_at # override source defaults
        columns:
          - name: id
            tests:
              - unique

          - name: price_in_usd
            tests:
              - not_null

      - name: Users
        quoting:
          identifier: true # override source defaults
        columns:
            tests:
              - unique
```

</File>

## Selecting sources

Sources can be "selected" in dbt runs with the `--models` flag. While sources themselves cannot be run, it is frequently useful to run all of the models that depend on a source, eg. after that source has finished loading. Sources can be selected by using the `source:` selector coupled with:

1. the name of the source
2. the name of the source and a table, dot-separated

```
Run all of the models downstream of a source
$ dbt run --model source:ecommerce+

Run all of the models downstream of a specific source table
$ dbt run --model source:ecommerce.orders+
```

## Snapshotting source data freshness

With a couple of extra configs, dbt can optionally snapshot the "freshness" of the data in your source tables. This is useful for understanding if your data pipelines are in a healthy state, and is a critical component of defining SLAs for your warehouse.

To configure sources to snapshot freshness information, add a `freshness` block to your source and `loaded_at_field` to your table declaration:

<File name='schema.yml'>

```yaml

version: 2

sources:
  - name: snowplow
    database: raw
    loader: emr # optional, informational only

    freshness:
      warn_after: {count: 12, period: hour}
      error_after: {count: 24, period: hour}

    tables:
      - name: event
        loaded_at_field: collector_tstamp # required for freshness snapshotting
```

</File>

In the `freshness` block, one or both of `warn_after` and `error_after` can be provided. If neither is provided, then dbt will not calculate freshness snapshots for the tables in this source.

Additionally, the `loaded_at_field` is required to calculate freshness for a table. If a `loaded_at_field` is not provided, then dbt will not calculate freshness for the table.

These configs are applied hierarchically, so `freshness` and `loaded_at` field values specified for a `source` will flow through to all of the `tables` defined in that source. This is useful when all of the tables in a source have the same `loaded_at_field`, as the config can just be specified once in the top-level source definition.

### Freshness declarations

The `freshness:` block can accept one or both of `warn_after` and `error_after`. Each of these fields requires the specification of a `count` and a `period`. The `count` can be any positive integer, and the `period` can be one of `minute`, `hour`, or `day`.

The following example shows a source schema configured with a `freshness` specification. The second table, `web_page` overrides `freshness` to `null`, indicating that it will not participate in freshness tests.

<File name='models/sources.yml'>

```yaml

version: 2

sources:
  - name: snowplow
    database: raw
    loader: emr

    freshness:
      warn_after: {count: 12, period: hour}
      error_after: {count: 24, period: hour}

    loaded_at_field: event_time

    tables:
      - name: event

      - name: web_page
        freshness: null
```

</File>

### Filtering sources
If your source tables are configured to require partition filters, you can use the `filter` config on the `freshness` block to add a filter to the freshness query that dbt runs. You can use the built-in [datetime module](modules) to dynamically generate a freshness filter. This filter *only* applies to dbt's source freshness queries - it will not impact other uses of the source table.

<File name='models/sources.yml'>

```yaml

version: 2

sources:
  - name: snowplow
    database: raw
    loader: emr

    freshness:
      warn_after: {count: 12, period: hour}
      error_after: {count: 24, period: hour}

      # Filter in the freshness query
      filter: event_time > '2019-01-01'

    loaded_at_field: event_time

    tables:
      - name: event
```

</File>

### Snapshotting freshness

To snapshot freshness information for your sources, use the `dbt source snapshot-freshness` command:

```
$ dbt source snapshot-freshness [--select [source_1, ...]]
```

Use the `--select` flag to snapshot freshness for specific sources. Eg:

```
# Snapshot freshness for all Snowplow tables:
$ dbt source snapshot-freshness --select snowplow

# Snapshot freshness for a particular source table:
$ dbt source snapshot-freshness --select snowplow.event

# Snapshot freshness for multiple particular source tables:
$ dbt source snapshot-freshness --select snowplow.event snowplow.web_page
```

See the [sources reference](source) for more information on the `dbt source snapshot-freshness` command.

### Output

The `snapshot-freshness` command will output a pass/warning/error status for each table selected in the freshness snapshot. Additionally, dbt will write the freshness results to a file in the `target/` directory called `sources.json` by default. To override this destination, use the `-o` flag to the `snapshot-freshness` command.

<Lightbox src="/img/docs/building-a-dbt-project/85ff277-Screen_Shot_2019-02-14_at_7.53.27_PM.png" title=""/>
