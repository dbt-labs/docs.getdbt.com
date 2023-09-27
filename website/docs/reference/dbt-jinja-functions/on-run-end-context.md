---
title: "About on-run-end context variable"
sidebar_label: "on-run-end context"
id: "on-run-end-context"
description: "Use these variables in the context for `on-run-end` hooks."
---


:::caution Caution

These variables are only available in the context for `on-run-end` hooks. They will evaluate to `none` if used outside of an `on-run-end` hook!

:::

## schemas

The `schemas` context variable can be used to reference the schemas that dbt has built models into during a run of dbt. This variable can be used to grant usage on these schemas to certain users at the end of a dbt run.

Example:

<File name='dbt_project.yml'>

```sql

on-run-end:
 - "{% for schema in schemas %}grant usage on schema {{ schema }} to db_reader;{% endfor %}"


```

</File>

In practice, it might not be a bad idea to put this code into a macro:

<File name='macros/grants.sql'>

```jinja2

{% macro grant_usage_to_schemas(schemas, user) %}
  {% for schema in schemas %}
    grant usage on schema {{ schema }} to {{ user }};
  {% endfor %}
{% endmacro %}


```

</File>



<File name='dbt_project.yml'>

```yaml

on-run-end:
 - "{{ grant_usage_to_schemas(schemas, 'user') }}"


```

</File>

## database_schemas

The `database_schemas` context variable can be used to reference the databases _and_ schemas that dbt has built models into during a run of dbt. This variable is similar to the `schemas` variable, and should be used if a dbt run builds resources into multiple different databases.

Example:

<File name='macros/grants.sql'>

```jinja2

{% macro grant_usage_to_schemas(database_schemas, user) %}
  {% for (database, schema) in database_schemas %}
    grant usage on {{ database }}.{{ schema }} to {{ user }};
  {% endfor %}
{% endmacro %}


```

</File>



<File name='dbt_project.yml'>

```yaml

on-run-end:
 - "{{ grant_usage_to_schemas(database_schemas, user) }}"


```

</File>



## Results

The `results` variable contains a list of [Result objects](/reference/dbt-classes#result-objects) with one element per resource that executed in the dbt job. The Result object provides access within the Jinja on-run-end context to the information that will populate the [run results JSON artifact](/reference/artifacts/run-results-json).

Example usage:

<File name='macros/log_results.sql'>

```sql
{% macro log_results(results) %}

  {% if execute %}
  {{ log("========== Begin Summary ==========", info=True) }}
  {% for res in results -%}
    {% set line -%}
        node: {{ res.node.unique_id }}; status: {{ res.status }} (message: {{ res.message }})
    {%- endset %}

    {{ log(line, info=True) }}
  {% endfor %}
  {{ log("========== End Summary ==========", info=True) }}
  {% endif %}

{% endmacro %}
```

</File>



<File name='dbt_project.yml'>

```yaml

on-run-end: "{{ log_results(results) }}"
```

</File>

Results:
```
12:48:17 | Concurrency: 1 threads (target='dev')
12:48:17 |
12:48:17 | 1 of 2 START view model dbt_jcohen.abc............................... [RUN]
12:48:17 | 1 of 2 OK created view model dbt_jcohen.abc.......................... [CREATE VIEW in 0.11s]
12:48:17 | 2 of 2 START table model dbt_jcohen.def.............................. [RUN]
12:48:17 | 2 of 2 ERROR creating table model dbt_jcohen.def..................... [ERROR in 0.09s]
12:48:17 |
12:48:17 | Running 1 on-run-end hook
========== Begin Summary ==========
node: model.testy.abc; status: success (message: CREATE VIEW)
node: model.testy.def; status: error (message: Database Error in model def (models/def.sql)
  division by zero
  compiled SQL at target/run/testy/models/def.sql)
========== End Summary ==========
12:48:17 | 1 of 1 START hook: testy.on-run-end.0................................ [RUN]
12:48:17 | 1 of 1 OK hook: testy.on-run-end.0................................... [OK in 0.00s]
12:48:17 |
12:48:17 |
12:48:17 | Finished running 1 view model, 1 table model, 1 hook in 1.94s.
```
