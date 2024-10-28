<File name='models/<filename>.yml'>

```yaml

version: 2

sources:
  - name: <source_name>
    freshness:
      warn_after:
        [count](#count): <positive_integer>
        [period](#period): minute | hour | day
      error_after:
        [count](#count): <positive_integer>
        [period](#period): minute | hour | day
      [filter](#filter): <boolean_sql_expression>
    [loaded_at_field](#loaded_at_field): <column_name_or_expression>

    tables:
      - name: <table_name>
        freshness:
          warn_after:
            [count](#count): <positive_integer>
            [period](#period): minute | hour | day
          error_after:
            [count](#count): <positive_integer>
            [period](#period): minute | hour | day
          [filter](#filter): <boolean_sql_expression>
        [loaded_at_field](#loaded_at_field): <column_name_or_expression>
        ...
```

</File>

## Definition
A freshness block is used to define the acceptable amount of time between the most recent record, and now, for a <Term id="table" /> to be considered "fresh".

In the `freshness` block, one or both of `warn_after` and `error_after` can be provided. If neither is provided, then dbt will not calculate freshness snapshots for the tables in this source.

In most cases, the `loaded_at_field` is required. Some adapters support calculating source freshness from the warehouse metadata tables and can exclude the `loaded_at_field`.

If a source has a `freshness:` block, dbt will attempt to calculate freshness for that source:
- If a `loaded_at_field` is provided, dbt will calculate freshness via a select query (behavior prior to v1.7).
- If a `loaded_at_field` is _not_ provided, dbt will calculate freshness via warehouse metadata tables when possible (new in v1.7 on supported adapters).

Currently, calculating freshness from warehouse metadata tables is supported on the following adapters:
- [Snowflake](/reference/resource-configs/snowflake-configs)
- [Redshift](/reference/resource-configs/redshift-configs)
- [BigQuery](/reference/resource-configs/bigquery-configs) (Supported in [`dbt-bigquery`](https://github.com/dbt-labs/dbt-bigquery) version 1.7.3 or higher)

Support is coming soon to the [Spark](/reference/resource-configs/spark-configs) adapter.

Freshness blocks are applied hierarchically:
- a `freshness` and `loaded_at_field` property added to a source will be applied to all tables defined in that source
- a `freshness` and `loaded_at_field` property added to a source _table_ will override any properties applied to the source.

This is useful when all of the tables in a source have the same `loaded_at_field`, as is often the case.

To exclude a source from freshness calculations, you have two options:
- Don't add a `freshness:` block.
- Explicitly set `freshness: null`.

## loaded_at_field

Optional on adapters that support pulling freshness from warehouse metadata tables, required otherwise.
<br/><br/>A column name (or expression) that returns a timestamp indicating freshness.

If using a date field, you may have to cast it to a timestamp:
```yml
loaded_at_field: "completed_date::timestamp"
```

Or, depending on your SQL variant:
```yml
loaded_at_field: "CAST(completed_date AS TIMESTAMP)"
```

If using a non-UTC timestamp, cast it to UTC first:

```yml
loaded_at_field: "convert_timezone('Australia/Sydney', 'UTC', created_at_local)"
```

## count
(Required)

A positive integer for the number of periods where a data source is still considered "fresh".

## period
(Required)

The time period used in the freshness calculation. One of `minute`, `hour` or `day`

## filter
(optional)

Add a where clause to the query run by `dbt source freshness` in order to limit data scanned.

This filter *only* applies to dbt's source freshness queries - it will not impact other uses of the source table.

This is particularly useful if:
- You are using BigQuery and your source tables are [partitioned tables](https://cloud.google.com/bigquery/docs/partitioned-tables)
- You are using Snowflake, Databricks, or Spark with large tables, and this results in a performance benefit


## Examples

### Complete example
<File name='models/<filename>.yml'>

```yaml

version: 2

sources:
  - name: jaffle_shop
    database: raw

    freshness: # default freshness
      warn_after: {count: 12, period: hour}
      error_after: {count: 24, period: hour}

    loaded_at_field: _etl_loaded_at

    tables:
      - name: customers # this will use the freshness defined above

      - name: orders
        freshness: # make this a little more strict
          warn_after: {count: 6, period: hour}
          error_after: {count: 12, period: hour}
          # Apply a where clause in the freshness query
          filter: datediff('day', _etl_loaded_at, current_timestamp) < 2


      - name: product_skus
        freshness: # do not check freshness for this table
```

</File>

When running `dbt source freshness`, the following query will be run:

<Tabs
  defaultValue="compiled"
  values={[
    { label: 'Compiled SQL', value: 'compiled', },
    { label: 'Jinja SQL', value: 'jinja', },
  ]
}>
<TabItem value="compiled">

```sql
select
  max(_etl_loaded_at) as max_loaded_at,
  convert_timezone('UTC', current_timestamp()) as snapshotted_at
from raw.jaffle_shop.orders

where datediff('day', _etl_loaded_at, current_timestamp) < 2

```

</TabItem>

<TabItem value="jinja">

```sql
select
  max({{ loaded_at_field }}) as max_loaded_at,
  {{ current_timestamp() }} as snapshotted_at
from {{ source }}
{% if filter %}
where {{ filter }}
{% endif %}
```

_[Source code](https://github.com/dbt-labs/dbt-core/blob/HEAD/core/dbt/include/global_project/macros/adapters/common.sql#L262)_

</TabItem>

</Tabs>
