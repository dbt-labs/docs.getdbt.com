---
resource_types: [models]
datatype: "string"
---
:::caution Heads up!
These docs are a work in progress.

:::

<!----
To-do:
- use the reference doc structure for this article
- check if SQL headers apply to models only
--->


### Overview

dbt supports the specification of SQL headers: arbitrary SQL snippets that are injected above `create table as` and `create view as` statements that dbt executes.

One possible use-case for SQL headers is the specification of [BigQuery Temporary UDFs](https://cloud.google.com/bigquery/docs/reference/standard-sql/user-defined-functions#sql-udf-examples). SQL headers are logically similar to model pre-hooks, with the notable difference being that they run in the same *query* as the `create table|view as` statement.

### Usage

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


The `set_sql_header` macro a convenience method for setting the `sql_header` model config. This config can also be supplied manually:

<File name='models/my_model.sql'>

```sql

{{ config(sql_header="-- my very cool comment") }}

select * from {{ ref('other_model') }}
```

</File>
