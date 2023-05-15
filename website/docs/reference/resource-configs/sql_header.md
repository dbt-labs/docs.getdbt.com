---
resource_types: [models]
description: "Sql_header - Read this in-depth guide to learn about configurations in dbt."
datatype: "string"
---

<Tabs
  defaultValue="models"
  values={[
    { label: 'Models', value: 'models', },
    { label: 'Seeds', value: 'seeds', },
    { label: 'Snapshots', value: 'snapshots', },
  ]
}>
<TabItem value="models">

<File name='models/<modelname>.sql'>

```sql
{{ config(
  sql_header="<sql-statement>"
) }}

select ...


```

</File>

<File name='dbt_project.yml'>

```yml
[config-version](/reference/project-configs/config-version): 2

models:
  [<resource-path>](/reference/resource-configs/resource-path):
    +sql_header: <sql-statement>

```

</File>

</TabItem>


<TabItem value="seeds">

This config is not implemented for seeds

</TabItem>

<TabItem value="snapshots">

<File name='snapshots/<filename>.sql'>

```sql
{% snapshot [snapshot_name](snapshot_name) %}

{{ config(
  sql_header="<sql-statement>"
) }}

select ...

{% endsnapshot %}

```

</File>

<File name='dbt_project.yml'>

```yml
snapshots:
  [<resource-path>](/reference/resource-configs/resource-path):
    +sql_header: <sql-statement>

```

</File>

</TabItem>

</Tabs>


## Definition
An optional configuration to inject SQL above the `create table as` and `create view as` statements that dbt executes when building models and snapshots.

`sql_header`s can be set using the config, or by `call`-ing the `set_sql_header` macro (example below).

## Comparison to pre-hooks
[Pre-hooks](/reference/resource-configs/pre-hook-post-hook) also provide an opportunity to execute SQL before model creation, as a _preceding_ query. In comparison, SQL in a `sql_header` is run in the same _query_ as the `create table|view as` statement.

As a result, this makes it more useful for [Snowflake session parameters](https://docs.snowflake.com/en/sql-reference/parameters.html) and [BigQuery Temporary UDFs](https://cloud.google.com/bigquery/docs/reference/standard-sql/user-defined-functions#sql-udf-examples).

## Examples

### Set Snowflake session parameters for a particular model
This uses the config block syntax:
<File name='models/my_model.sql'>

```sql
{{ config(
  sql_header="alter session set timezone = 'Australia/Sydney';"
) }}

select * from {{ ref('other_model') }}
```

</File>

### Set Snowflake session parameters for all models

<File name='dbt_project.yml'>

```yml
config-version: 2

models:
  +sql_header: "alter session set timezone = 'Australia/Sydney';"
```

</File>

### Create a BigQuery Temporary UDF

This example calls the `set_sql_header` macro. This macro is a convenience wrapper which you may choose to use if you have a multi-line SQL statement to inject. You do not need to use the `sql_header` configuration key in this case.

<File name='models/my_model.sql'>

```sql
-- Supply a SQL header:
{% call set_sql_header(config) %}
  CREATE TEMPORARY FUNCTION yes_no_to_boolean(answer STRING)
  RETURNS BOOLEAN AS (
    CASE
    WHEN LOWER(answer) = 'yes' THEN True
    WHEN LOWER(answer) = 'no' THEN False
    ELSE NULL
    END
  );
{%- endcall %}

-- Supply your model code:


select yes_no_to_boolean(yes_no) from {{ ref('other_model') }}
```

</File>
