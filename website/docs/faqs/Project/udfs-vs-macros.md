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



</Expandable>


If your reusable logic is pure SQL without needing dynamic SQL generation, a UDF is cleaner and more portable.

</Expandable>

## Use macros when:

<Expandable alt_header="You need to generate SQL dynamically">

Macros excel at generating SQL based on conditions, looping through lists, or building queries programmatically. UDFs can't do this.

Traditional SQL UDFs are limited to SQL expressions and don’t support looping or conditionals. However, Python UDFs do support conditionals, looping, and more complex logic, including operations that aren't possible to express in Jinja.

Just like macros, UDFs can also incorporate Jinja when needed.

</Expandable>

<Expandable alt_header="You want to generate DDL or DML statements">

Macros can create entire model definitions, tests, or any SQL statement. UDFs are limited to returning values or tables.

</Expandable>

<Expandable alt_header="You need to adapt SQL across different warehouses">

Macros and UDFs both support Jinja logic:
- Macros can use Jinja conditional logic to generate SQL that's dependent on which warehouse you're using (see [cross-database macros](/reference/dbt-jinja-functions/cross-database-macros)), making your dbt project portable across platforms. UDFs are warehouse-specific.
- UDFs can also include Jinja, but they're warehouse-specific. This means you must define them separately for each platform and specify the correct argument `data_types` according to that warehouse’s syntax.

</Expandable>

<Expandable alt_header="Your logic needs access to dbt context">

Both macros and UDFs can use Jinja, which means they can access dbt context variables like `{{ ref() }},` `{{ source() }}`, environment variables, and project configurations. You can even call a macro from within a UDF (and vice versa) to combine dynamic SQL generation with runtime execution.

However, the difference between the two is _when_ the logic runs:
- Macros run at compile time, generating SQL before it’s sent to the warehouse.
- UDFs run inside the warehouse at query time.

</Expandable>

<Expandable alt_header="You want to avoid creating warehouse objects">

Macros don't create anything in your warehouse; they just generate SQL at compile time. UDFs create actual function objects in your warehouse that need to be managed.

</Expandable>

## Can I use both together?

Yes! You can use a macro to call a UDF or call a macro from within a UDF, combining the benefits of both. So the following example shows how to use a macro to define default values for arguments alongside your logic, for your UDF

```sql
{% macro cents_to_dollars(column_name, scale=2) %}
  {{ function('cents_to_dollars') }}({{ column_name }}, {{scale}})
{% endmacro %}
```

## Related documentation

- [User-defined functions](/docs/build/udfs)
- [Jinja macros](/docs/build/jinja-macros)

