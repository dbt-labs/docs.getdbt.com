---
title: "Files with Jinja support"
id: "files-with-jinja-support"
sidebar: "Files with Jinja support"
description: "Read this guide to understand the files that support Jinja expressions and/or custom Jinja macros."
pagination_previous: "reference/define-configs"
pagination_next: null
---

<IntroText>

This document provides an overview of the files in dbt that support [Jinja](/reference/dbt-jinja-functions) expressions and custom macros. It also covers built-in macros and includes various file types such as [`dbt_project.yml`](/reference/dbt_project.yml), [`profiles.yml`](/docs/core/connect-data-platform/profiles.yml), [`packages.yml`](/docs/build/packages#how-do-i-add-a-package-to-my-project), [`selectors.yml`](/reference/node-selection/yaml-selectors), [`_properties.yml`](/reference/configs-and-properties#example), and [`.sql`](/docs/build/sql-models)/[`.py`](/docs/build/python-models) files for different resource types.

</IntroText>

## dbt [built-in macros](/reference/dbt-jinja-functions)

Jinja in dbt lets you use built-in macros like [`ref()`](/reference/dbt-jinja-functions/ref), [`source()`](/reference/dbt-jinja-functions/source), and [`config()`](/reference/dbt-jinja-functions/config) directly in your SQL models.

You can call these macros using the `{{ macro_name() }}` syntax, enabling dynamic SQL, reusable logic, and dbt-specific functions within your project.

The Jinja [`env_var`](/reference/dbt-jinja-functions/env_var) function lets you access environment variables in dbt wherever Jinja is processed, like `profiles.yml`, `dbt_project.yml`, and model SQL files.

You can use it as: 

- `{{ env_var('VAR_NAME') }}`
- To support optional default: `{{ env_var('VAR_NAME', 'default') }}`
- Always quote the Jinja string.

## [Bring-your-own](/docs/build/jinja-macros#macros)

Jinja in dbt supports custom macros, which are reusable code blocks similar to functions.

- Define macros in [.sql](https://docs.getdbt.com/docs/build/python-models) files in your macros directory using `{% macro macro_name(args) %} ... {% endmacro %}`.
- Call macros in models with `{{ macro_name(args) }}` to inject dynamic SQL.

## Generic Jinja expressions, statements, and comments

dbt models also leverages Jinja. Have a look at our document on [Jinja and macros](/docs/build/jinja-macros#jinja) for more information.

## Jinja in common types of dbt files:

Jinja is a versatile templating language used extensively in dbt for dynamic SQL and configuration. That said, not every dbt file type supports Jinja. Here’s an overview of the common file types and their compatibility with Jinja:

| File Type | Supports Jinja | Notes | Example |                                                                             
|-----------|----------------|-------|---------|
|`.sql`     | ✅ |This is where Jinja is most commonly used in dbt. Jinja allows dynamic SQL generation, macros, control structures (`if`, `for`), variables, etc.| See query example below.|
|`.py`| ✅|Python models in dbt can use Jinja in comments or docstrings to inject dynamic content (like `{{ var('some_value') }}`).| See example below.|
|[`dbt_project.yml`](/reference/dbt_project.yml)| ❌ |Configuration file for dbt project settings. It must remain static and fully valid [YAML](/best-practices/how-we-style/5-how-we-style-our-yaml), therefore, no dynamic Jinja is allowed.|
|[`profiles.yml`](/docs/core/connect-data-platform/profiles.yml)| ❌ |Defines connection credentials for dbt. Must be valid YAML; no Jinja is processed.|         
|[`packages.yml`](/docs/build/packages#how-do-i-add-a-package-to-my-project)| ❌ |Used to manage [package dependencies](/docs/mesh/govern/project-dependencies#about-packagesyml-and-dependenciesyml). Jinja is not interpreted here.|         
|[`selectors.yml`](/reference/node-selection/yaml-selectors)| ❌ |Defines selector logic for dbt runs. Jinja is not supported.|         
|[`properties.yml`](/reference/configs-and-properties)| ❌ |Defines schema, column descriptions, and tests. Jinja isn't supported here.|         

### Examples

#### .sql

```sql
select * from {{ ref('my_table') }} 
where date = '{{ execution_date }}'
```
This query shows all rows from the dbt model `my_table` where the date column matches the value of the `execution_date` variable.

- `{{ ref('my_table') }}` is a Jinja macro that tells dbt to resolve the correct schema + table name for the model, `my_table`. It ensures proper dependency tracking and cross-database compatibility.
- `{{ execution_date }}` is a Jinja variable (passed in a `--vars argument`, environment variable, or your orchestrator) that holds the target date you want to filter on.
- `where date = {{ execution_date }}` is SQL condition that filters rows where the date column equals the value of `execution_date`.

#### .py

```python
def model(dbt, session):
    dbt.config(materialized="table")
    # {{ config(alias='my_model') }}
    df = session.sql("SELECT * FROM {{ ref('my_table') }}")
    return df
```

This example shows how a dbt Python model that fetches all rows from `my_table` and materializes them as a new table.

After running dbt build, this will create a table (named the same as the file, unless overridden by an alias) with the same contents as my_table.

If `{{ ref('my_table') }}` resolves to `analytics.my_table`, and you're using Snowflake or Spark, the compiled SQL inside the `session.sql(...)` call becomes:

`df = session.sql("SELECT * FROM analytics.my_table")`

Then, dbt creates a new table (for example `my_python_model`) containing that data.

Python models are available in dbt when using Databricks, Snowflake, or BigQuery (limited).

The Jinja `{{ ref(...) }}` is still used in Python models and is rendered before the Python code runs.
