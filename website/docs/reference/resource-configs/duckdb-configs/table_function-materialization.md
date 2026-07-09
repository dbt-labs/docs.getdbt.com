---
title: "table_function materialization"
sidebar_label: "table_function materialization"
description: "Use the table_function materialization to create parameterized views with DuckDB's table function and table macro feature."
---

<VersionBlock lastVersion="1.99">

`dbt-duckdb` provides a custom `table_function` materialization to use DuckDB's [Table Function / Table Macro](https://duckdb.org/docs/sql/statements/create_macro.html) feature to provide parameterized views.

Benefits of using `table_function`:
- Late binding means the underlying table can change (have new columns added) and the function does not need to be recreated, unlike views.
- Parameters can force filter pushdown.
- Functions can provide advanced features like dynamic SQL.

Example `table_function` creation with zero parameters:

```sql
{{
    config(
        materialized='table_function'
    )
}}
select * from {{ ref("example_table") }}
```

Example invocation (parentheses are required even with zero parameters):

```sql
select * from {{ ref("my_table_function") }}()
```

Example `table_function` with two parameters:

```sql
{{
    config(
        materialized='table_function',
        parameters=['where_a', 'where_b']
    )
}}
select *
from {{ ref("example_table") }}
where 1=1
    and a = where_a
    and b = where_b
```

Example invocation with parameters:

```sql
select * from {{ ref("my_table_function_with_parameters") }}(1, 2)
```

</VersionBlock>
