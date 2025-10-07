---
title: When should I use a UDF instead of a macro?
description: "Guidance on choosing between UDFs and macros"
sidebar_label: 'UDFs vs macros'
id: udfs-vs-macros
---

Both user-defined functions (UDFs) and macros let you reuse logic across your dbt project, but they work in fundamentally different ways. Here's when to use each:

## Use UDFs when:

<Expandable alt_header="You need logic accessible outside dbt">

UDFs are created in your warehouse and can be used by BI tools, data science notebooks, SQL clients, or any other tool that connects to your warehouse. Macros only work within dbt.

</Expandable>

<Expandable alt_header="You want better performance for complex operations">

UDFs are compiled and optimized by your warehouse's query engine, which can provide better performance for compute-intensive operations compared to Jinja macros that generate SQL text.

</Expandable>

<Expandable alt_header="You need to standardize warehouse-native functions">

UDFs let you create reusable warehouse functions for data validation, custom formatting, or business-specific calculations that need to be consistent across all your data tools.

</Expandable>

<Expandable alt_header="Your logic is SQL-based and doesn't need Jinja templating">

If your reusable logic is pure SQL without needing dynamic SQL generation, a UDF is cleaner and more portable.

</Expandable>

## Use macros when:

<Expandable alt_header="You need to generate SQL dynamically">

Macros excel at generating SQL based on conditions, looping through lists, or building queries programmatically. UDFs can't do this.

</Expandable>

<Expandable alt_header="You want to generate DDL or DML statements">

Macros can create entire model definitions, tests, or any SQL statement. UDFs are limited to returning values or tables.

</Expandable>

<Expandable alt_header="You need to adapt SQL across different warehouses">

Macros can use Jinja logic to generate warehouse-specific SQL, making your dbt project portable across platforms. UDFs are warehouse-specific.

</Expandable>

<Expandable alt_header="Your logic needs access to dbt context">

Macros can access dbt's context variables like `{{ ref() }}`, `{{ source() }}`, environment variables, and project configurations. UDFs cannot.

</Expandable>

<Expandable alt_header="You want to avoid creating warehouse objects">

Macros don't create anything in your warehouse; they just generate SQL at compile time. UDFs create actual function objects in your warehouse that need to be managed.

</Expandable>

## Can I use both together?

Yes! You can use a macro to call a UDF, combining the benefits of both. For example:

```sql
{%- macro clean_and_validate_email(column_name) -%}
  {{ function('validate_email') }}(
    LOWER(TRIM({{ column_name }}))
  )
{%- endmacro -%}
```

This approach uses a macro for dynamic SQL generation (the `column_name` parameter) while leveraging a UDF for the main validation logic that can be reused outside dbt.

## Related documentation

- [User-defined functions](/docs/build/udfs)
- [Jinja macros](/docs/build/jinja-macros)

