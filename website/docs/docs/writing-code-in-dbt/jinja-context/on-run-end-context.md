---
title: "on-run-end Context"
id: "on-run-end-context"
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

The `database_schemas` context variable can be used to reference the databases _and_ schemas that dbt has built models into during a run of dbt. This variable is similar to the `schemas` variable, and should be used if a dbt run builds resources into multiple different database.

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
The `results` variable contains a list of [Result objects](class-reference#result-objects) with one element per resource that executed in the dbt job.

Example usage:

<File name='macros/log_results.sql'>

```sql
{% macro log_results(results) %}

  {{ log("========== Begin Summary ==========", info=True) }}
  {% for res in results -%}
    {% set line -%}
        node: {{ res.node.unique_id }}; status: {{ res.status }} (error: {{ res.error }})
    {%- endset %}

    {{ log(line, info=True) }}
  {% endfor %}
  {{ log("========== End Summary ==========", info=True) }}

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
11:27:52 | Concurrency: 8 threads (target='dev')
11:27:52 |
11:27:52 | 1 of 2 START view model demo_schema.abc.............................. [RUN]
11:27:52 | 2 of 2 START table model demo_schema.def............................. [RUN]
11:27:52 | 2 of 2 ERROR creating table model demo_schema.def.................... [ERROR in 0.08s]
11:27:52 | 1 of 2 OK created view model demo_schema.abc......................... [CREATE VIEW in 0.10s]

========== Begin Summary ==========
node: model.my_project.def; status: ERROR (error: Database Error in model def (models/def.sql)
  division by zero
  compiled SQL at target/compiled/my_project/def.sql)
node: model.my_project.abc; status: CREATE VIEW (error: None)
========== End Summary ==========

11:27:52 |
11:27:52 | Finished running 1 table models, 1 view models in 0.26s.
```

## Advanced Usage

Objects of the Results class have the following properties:
```
{
    'error': {
        'type': ['string', 'null'],
        'description': 'The error string, or None if there was no error',
    },
    'skip': {
        'type': 'boolean',
        'description': 'True if this node was skipped',
    },
    'fail': {
        'type': ['boolean', 'null'],
        'description': 'On tests, true if the test failed',
    },
    'status': {
        'type': ['string', 'null', 'number', 'boolean'],
        'description': 'The status result of the node execution',
    },
    'execution_time': {
        'type': 'number',
        'description': 'The execution time, in seconds',
    },
    'node': COMPILE_RESULT_NODE_CONTRACT,
}
```

Additionally, Result objects have a `serialize()` method which can be used to convert the object into a Python dictionary.
