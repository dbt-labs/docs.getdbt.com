---
title: "About execute variable"
sidebar_label: "execute"
id: "execute"
description: "Use `execute` to return True when dbt is in 'execute' mode."
---

`execute` is a Jinja variable that returns True when dbt is in "execute" mode.

When you execute a `dbt compile` or `dbt run` command, dbt:

1. Reads all of the files in your project and generates a "manifest" comprised of models, tests, and other graph nodes present in your project. During this phase, dbt uses the `ref` statements it finds to  generate the DAG for your project. **No SQL is run during this phase**, and `execute == False`.
2. Compiles (and runs) each node (eg. building models, or running tests). **SQL is run during this phase**, and `execute == True`.

Any Jinja that relies on a result being returned from the database will error during the parse phase. For example, this SQL will return an error:

<File name='models/order_payment_methods.sql'>

```sql
{% set payment_method_query %}
select distinct
payment_method
from {{ ref('raw_payments') }}
order by 1
{% endset %}

{% set results = run_query(payment_method_query) %}

{# Return the first column #}
{% set payment_methods = results.columns[0].values() %}

```

</File>

The error returned by dbt will look as follows:
```
Encountered an error:
Compilation Error in model order_payment_methods (models/order_payment_methods.sql)
  'None' has no attribute 'table'

```
This is because Line #11 assumes that a <Term id="table" /> has been returned, when, during the parse phase, this query hasn't been run.

To work around this, wrap any problematic Jinja in an `{% if execute %}` statement:

<File name='models/order_payment_methods.sql'>

```sql
{% set payment_method_query %}
select distinct
payment_method
from {{ ref('raw_payments') }}
order by 1
{% endset %}

{% set results = run_query(payment_method_query) %}

{% if execute %}
{# Return the first column #}
{% set payment_methods = results.columns[0].values() %}
{% else %}
{% set payment_methods = [] %}
{% endif %}
```

</File>
