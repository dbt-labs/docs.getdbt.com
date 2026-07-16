---
title: "About execute variable"
sidebar_label: "execute"
id: "execute"
description: "Use `execute` to return True when dbt is in 'execute' mode."
---

`execute` is a Jinja variable that returns True when dbt is in "execute" mode.

When you execute a `dbt compile` or `dbt run` command, dbt:

1. Reads all of the files in your project and generates a [manifest](/reference/artifacts/manifest-json) comprised of models, tests, and other graph nodes present in your project. During this phase, dbt uses the [`ref`](/reference/dbt-jinja-functions/ref) and [`source`](/reference/dbt-jinja-functions/source) statements it finds to generate the DAG for your project. **No SQL is run during this phase**, and `execute == False`.
2. Compiles (and runs) each node (eg. building models, or running tests). **SQL is run during this phase**, and `execute == True`.

Any Jinja that relies on a result being returned from the database will error during the parse phase. For example, this SQL will return an error:

<File name='models/order_payment_methods.sql'>

```sql
1   {% set payment_method_query %}
2   select distinct
3   payment_method
4   from {{ ref('raw_payments') }}
5   order by 1
6   {% endset %}
7
8   {% set results = run_query(payment_method_query) %}
9
10  {# Return the first column #}
11  {% set payment_methods = results.columns[0].values() %}

```

</File>

The error returned by dbt will look as follows:
```
Encountered an error:
Compilation Error in model order_payment_methods (models/order_payment_methods.sql)
  'None' has no attribute 'table'

```
This is because line #11 in the earlier code example (`{% set payment_methods = results.columns[0].values() %}`) assumes that a <Term id="table" /> has been returned, when, during the parse phase, this query hasn't been run.

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

## Parsing vs execution

Parsing in Jinja is when dbt:

- Reads your project files.
- Identifies [`ref`](/reference/dbt-jinja-functions/ref) and [`source`](/reference/dbt-jinja-functions/source).
- Identifies macro definitions.
- Builds the dependency graph (DAG).

It doesn't run any SQL &mdash; `execute == False`.

Execution is when dbt actually runs SQL and builds models &mdash; `execute == True`.

During execution, dbt:

- Renders full Jinja templates into SQL.
- Resolves all instances of `ref()` and `source()` to their corresponding table or view names.
- Runs the SQL in your models during commands like ([`dbt run`](/reference/commands/run)), ([`dbt test`](/reference/commands/test)), [`dbt seed`](/reference/commands/seed, or [`dbt snapshot`](/reference/commands/snapshot).
- Creates or updates tables/views in the warehouse.
- Applies any materializations (incremental, table, view, ephemeral).

`execute` impacts the values of `ref()` and `source()`, and won't work as expected inside of a [`sql_header`](/reference/resource-configs/sql_header#usage).

This is because in the initial parse of the project, dbt identifies every use of `ref()` and `source()` to build the DAG, but doesn’t resolve them to actual database identifiers. Instead, it replaces each with a placeholder value to ensure the SQL compiles cleanly during parsing.

## Examples

Macros like [`log()`](/reference/dbt-jinja-functions/log) and [`exceptions.warn()`](/reference/dbt-jinja-functions/exceptions#warn) are still evaluated at parse time, during dbt's "first-pass" Jinja render to extract `ref`, `source` and `config`. As a result, dbt will also run any logging or warning messages during this process.

Even though nothing is being executed yet, dbt still runs those log lines while parsing. This can be confusing &mdash; it looks like dbt is doing something real but it’s just parsing.

```
$ dbt run
15:42:01  Running with dbt=1.10.2
15:42:01  I'm running a query now.  <------ this one is misleading!!!! no query is actually being run
15:42:01  Found 1 model, 0 tests, 0 snapshots, 0 macros, 0 operations, 0 seed files, 0 sources, 0 exposures, 0 metrics
15:42:01
15:42:01  Concurrency: 8 threads (target='dev')
15:42:01
15:42:01  1 of 1 START table model analytics.my_model .................................. [RUN]
15:42:01  I'm running a query now
15:42:02  1 of 1 OK created table model analytics.my_model ............................. [OK in 0.36s]
```

### Logging fully-qualified relation names

Let's assume you have a relation named `relation` obtained using something like `{% set relation = ref('my_model') %}` or `{% set relation = source('source_name', 'table_name') %}` &mdash; this will lead to unexpected or confusing behavior during parsing:

```jinja

{%- if load_relation(relation) is none -%}
    {{ log("Relation is missing: " ~ relation, True) }}
{% endif %}

```

To prevent this, add the `execute` flag to make sure the check only runs when dbt is actually running the code &mdash; not just when it's preparing it.

Use the command `do exceptions.warn` to emit a warning during model execution without failing the run.

```jinja

{%- if execute and load_relation(relation) is none -%}
    {% [do exceptions.warn](/reference/dbt-jinja-functions/exceptions#warn)("Relation is missing: " ~ relation) %}
    {{ log("Relation is missing: " ~ relation, info=True) }}
{%- endif -%}


```