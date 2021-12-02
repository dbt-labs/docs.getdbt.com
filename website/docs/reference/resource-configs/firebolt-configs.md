---
title: "Firebolt configurations"
id: "firebolt-configs"
---

### Setup Recommendations

#### `quote_columns`

To prevent a warning, you should add a configuration as below to your `dbt_project.yml`. For more info, see the [relevant dbt docs page](https://docs.getdbt.com/reference/resource-configs/quote_columns).

```yml
seeds:
  +quote_columns: false  #or `true` if you have csv column headers with spaces
```

#### Supporting Concurrent Development

In dbt, database schemas are used to compartmentalize developer environments so that concurrent development does not cause table name collisions. Firebolt, however, does not currently support database schemas (it is on the roadmap). To work around this, we recommend that you add the following macro to your project. This macro will take the `schema` field of your `profiles.yml` file and use it as a table name prefix.

```sql
-- macros/generate_alias_name.sql
{% macro generate_alias_name(custom_alias_name=none, node=none) -%}
    {%- if custom_alias_name is none -%}
        {{ node.schema }}__{{ node.name }}
    {%- else -%}
        {{ node.schema }}__{{ custom_alias_name | trim }}
    {%- endif -%}
{%- endmacro %}
```

For an example of how this works, let’s say Shahar and Eric are both working on the same project.

In her `.dbt/profiles.yml`, Sharar sets `schema=sh`, whereas Eric sets `schema=er` in his. When each runs the `customers` model, the models will land in the database as tables named `sh_customers` and `er_customers`, respectively. When running dbt in production, you would use yet another `profiles.yml` with nothing set in the `schema` field (or any string of your choice).

## Feature Support

The table below shows which dbt and Firebolt features are supported by the adapter. dbt-firebolt is under active development and will be gradually unlocking more features over time.

| Feature                      | Supported          |
|------------------------------|--------------------|
| Table materializations       | :white_check_mark: |
| Ephemeral materializations   | :white_check_mark: |
| View materializations        | :white_check_mark: |
| Incremental materializations | :x: |
| Seeds                        | :white_check_mark: |
| Tests                        | :white_check_mark: |
| Documentation                | :white_check_mark: |
| Snapshots                    | :x: |
| Custom schemas               | :x: (see [workaround](https://github.com/firebolt-db/dbt-firebolt#supporting-concurrent-development)) |
| Custom databases             | :x: |
| Source freshness             | :white_check_mark: |
| External tables              | :white_check_mark: |
| Primary indexes              | :white_check_mark: |
| Aggregating indexes          | :white_check_mark: |
| Join indexes                 | :white_check_mark: |
| Partitioned tables           | :x: |

## Using dbt-firebolt

### Model Configuration for Fact Tables

A dbt model can be created as a Firebolt fact table and configured using the following syntax:

Project file syntax
```yml
models:
  <resource-path>:
    +materialized: table
    +table_type: fact
    +primary_index: [ <column-name>, ... ]
    +indexes:
      - type: aggregating
        key_column: [ <column-name>, ... ]
        aggregation: [ <agg-sql>, ... ]
      ...
```

Property file syntax
```yml
models:
  - name: <model-name>
    config:
      materialized: table
      table_type: fact
      primary_index: [ <column-name>, ... ]
      indexes:
        - type: aggregating | join
          key_column: [ <column-name>, ... ]
          aggregation: [ <agg-sql>, ... ]
        ...
```

Config block syntax
```
{{ config(
    materialized = "table"
    table_type = "fact"
    primary_index = [ "<column-name>", ... ],
    indexes = [
      {
        type = "aggregating"
        key_column = [ "<column-name>", ... ],
        aggregation = [ "<agg-sql>", ... ],
      },
      ...
    ]
) }}
```

#### Fact Table Configurations

| Configuration     | Description                                                                               |
|-------------------|-------------------------------------------------------------------------------------------|
| `materialized`    | How the model will be materialized into Firebolt. Must be `table` to create a fact table. |
| `table_type`      | Whether the materialized table will be a [fact or dimension](https://docs.firebolt.io/concepts/working-with-tables#fact-and-dimension-tables) table. |
| `primary_index`   | Sets the primary index for the fact table using the inputted list of column names from the model. Required for fact tables. |
| `indexes`         | A list of aggregating indexes to create on the fact table. |
| `type`            | Specifies whether the index is an aggregating index or join index. Join indexes only apply to dimension tables, so for fact tables set to `aggregating`. |
| `key_column`      | Sets the grouping of the aggregating index using the inputted list of column names from the model. |
| `aggregation`     | Sets the aggregations on the aggregating index using the inputted list of SQL agg expressions. |

#### Example of a Fact Table With an Aggregating Index (Config Block Syntax)

```
{{ config(
    materialized = "table",
    table_type = "fact",
    primary_index = "id",
    indexes = [
      {
        type: "aggregating",
        key_column: "order_id",
        aggregation: ["COUNT(DISTINCT status)", "AVG(customer_id)"]
      }
    ]
) }}
```

### Model Configuration for Dimension Tables

A dbt model can be created as a Firebolt dimension table and configured using the following syntax:

Project file syntax
```yml
models:
  <resource-path>:
    +materialized: table
    +table_type: dimension
    +indexes:
      - type: join
        join_column: <column-name>
        dimension_column: [ <column-name>, ... ]
      ...
```

Property file syntax
```yml
models:
  - name: <model-name>
    config:
      materialized: table
      table_type: dimension
      indexes:
        - type: join
          join_column: <column-name>
          dimension_column: [ <column-name>, ... ]
        ...
```

Config block syntax
```
{{ config(
    materialized = "table"
    table_type = "dimension",
    indexes = [
      {
        type = "join",
        join_column = "<column-name>",
        dimension_column: [ "<column-name>", ... ]
      },
      ...
    ]
) }}
```

#### Dimension Table Configurations

| Configuration      | Description                                                                               |
|--------------------|-------------------------------------------------------------------------------------------|
| `materialized`     | How the model will be materialized into Firebolt. Must be `table` to create a dimension table. |
| `table_type`       | Whether the materialized table will be a [fact or dimension](https://docs.firebolt.io/concepts/working-with-tables#fact-and-dimension-tables) table. |
| `indexes`          | A list of join indexes to create on the dimension table. |
| `type`             | Specifies whether the index is an aggregating index or join index. Aggregating indexes only apply to fact tables, so for dimension tables set to `join`. |
| `join_column`      | Sets the join key of the join index using the inputted column name from the model. |
| `dimension_column` | Sets the columns to be loaded into memory on the join index using the inputted list of column names from the mode. |

#### Example of a Dimension Table With a Join Index (Config Block Syntax)

```
{{ config(
    materialized = "table",
    table_type = "dimension",
    indexes = [
      {
        type: "join",
        join_column: "order_id",
        dimension_column: ["customer_id", "status"]
      }
    ]
) }}
```

### How Aggregating Indexes and Join Indexes Are Named

In dbt-firebolt, you do not provide names for aggregating indexes and join indexes; they are named programmatically. dbt will generate index names using the following convention:
```
<table-name>__<key-column>__<index-type>_<unix-timestamp-at-execution>
```

For example, a join index could be named `my_users__id__join_1633504263` and an aggregating index could be named `my_orders__order_date__aggregating_1633504263`.

### Managing Ingestion via External Tables

`dbt-firebolt` supports dbt's [external tables feature](https://docs.getdbt.com/reference/resource-properties/external), which allows dbt to manage the table ingestion process from S3 into Firebolt. This is an optional feature but can be highly convenient depending on your use case.

More information on using external tables including properly configuring IAM can be found in the Firebolt [documentation](https://docs.firebolt.io/sql-reference/commands/ddl-commands#create-external-table).

#### Installation of External Tables Package

To install and use `dbt-external-tables` with Firebolt, you must:

1. Add this package to your packages.yml:
    ```yml
    packages:
    - package: dbt-labs/dbt_external_tables
        version: <version>
    ```
2. Add these fields to your `dbt_project.yml`: 
    ```yml
    dispatch:
      - macro_namespace: dbt_external_tables
        search_order: ['dbt', 'dbt_external_tables']
    ```
3. Pull in the `packages.yml` dependencies by calling `dbt deps`.

#### Using External Tables

To use external tables, you must define a table as `external` in your `dbt_project.yml` file. Every external table must contain the fields `url`, `type`, and `object_pattern`. Note that the Firebolt external table specification requires fewer fields than what is specified in the dbt documentation.

In addition to specifying the columns, an external table may specify partitions. Partitions are not columns and they cannot have the same name as columns. To avoid yaml parsing errors, remember to encase string literals (such as the `url` and `object_pattern` values) in single quotation marks.

#### dbt_project.yml Syntax For an External Table

```yml
sources:
  - name: firebolt_external
    schema: "{{ target.schema }}"
    loader: S3

    tables:
      - name: <table-name>
        external:
          url: 's3://<bucket_name>/'
          object_pattern: '<regex>'
          type: '<type>'
          credentials:
            internal_role_arn: arn:aws:iam::id:<role>/<bucket-name>
            external_role_id: <external-id>
          object_pattern: '<regex>'
          compression: '<compression-type>'
          partitions:
            - name: <partition-name>
              data_type: <partition-type>
              regex: '<partition-definition-regex>'
          columns:
            - name: <column-name>
              data_type: <type>
```
