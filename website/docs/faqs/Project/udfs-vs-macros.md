---
title: When should I use a UDF instead of a macro?
description: "Guidance on choosing between UDFs and macros"
sidebar_label: 'UDFs or macros'
id: udfs-vs-macros
---

Both user-defined functions (UDFs) and macros let you reuse logic across your dbt project, but they work in fundamentally different ways. Here's when to use each:

## Use UDFs when:

<Expandable alt_header="You need logic accessible outside dbt">

UDFs are created in your warehouse and can be used by BI tools, data science notebooks, SQL clients, or any other tool that connects to your warehouse. Macros only work within dbt.

</Expandable>

<Expandable alt_header="You want to standardize warehouse-native functions">

UDFs let you create reusable warehouse functions for data validation, custom formatting, or business-specific calculations that need to be consistent across all your data tools. Once created, they become part of your warehouse's function catalog.

</Expandable>

<Expandable alt_header="You want dbt to manage the function lifecycle">

dbt manages UDFs as part of your DAG execution, ensuring they're created before models that reference them. You can version control UDF definitions alongside your models, test changes in development environments, and deploy them together through CI/CD pipelines.

</Expandable>

<Expandable alt_header="Jinja compiles at creation time, not on each function call">

You can use Jinja (loops, conditionals, macros, `ref`, `source`, `var`) inside a UDF configuration.  dbt resolves that Jinja **when the UDF is created**, and the resulting SQL body is what gets stored in your warehouse.

Jinja influences the function when it’s created, whereas arguments influence it when it runs in the warehouse:

- :white_check_mark: **Allowed:** Jinja that depends on project or build-time state — for example, `var(“can_do_things”)`, static `ref(‘orders’)`, or environment-specific logic. These are all evaluated once at creation time.  
- :x: **Not allowed:** Jinja that depends on **function arguments** passed at runtime. The compiler can’t see those, so dynamic `ref(ref_name)` or conditional Jinja based on argument values won’t work.

</Expandable>

## Use macros when:

<Expandable alt_header="You need to generate SQL at compile time">

Macros generate SQL dynamically **before** it's sent to the warehouse (at compile time). This is essential for:
- Building different SQL for different warehouses
- Generating repetitive SQL patterns (like creating dozens of similar columns)
- Creating entire model definitions or DDL statements
- Dynamically referencing models based on project structure

UDFs execute **at query runtime** in the warehouse. While they can use Jinja templating in their definitions, they don't generate new SQL queries—they're pre-defined functions that get called by your SQL.

:::note Expanding UDFs
Currently, only SQL UDFs are supported. Python, Java, and Scala UDFs are planned for future releases. Once Python UDFs are available, they'll support conditionals and looping within the function logic itself (using Python syntax), but they'll still execute at runtime, not at compile time like macros.
:::

</Expandable>

<Expandable alt_header="You want to generate DDL or DML statements">

Macros can create entire model definitions, tests, or any SQL statement. UDFs are limited to returning values or tables.

</Expandable>

<Expandable alt_header="You need to adapt SQL across different warehouses">

Macros can use Jinja conditional logic to generate warehouse-specific SQL (see [cross-database macros](/reference/dbt-jinja-functions/cross-database-macros)), making your dbt project portable across platforms.

UDFs are warehouse-specific objects. Even though UDFs can include Jinja templating in their definitions, each warehouse has different syntax for creating functions, different supported data types, and different SQL dialects. You would need to define separate UDF files for each warehouse you support.

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
