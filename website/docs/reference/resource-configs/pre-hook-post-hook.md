---
title: pre-hook & post-hook
description: "Configure hooks to execute SQL before (pre) and after (post) a model is run in dbt."
resource_types: [models, seeds, snapshots]
datatype: sql-statement | [sql-statement]
---

<Tabs
  defaultValue="models"
  values={[
    { label: 'Models', value: 'models', },
    { label: 'Seeds', value: 'seeds', },
    { label: 'Snapshots', value: 'snapshots', },
  ]
}>

<TabItem value="models">

<Snippet path="post-and-pre-hooks-sql-statement" /> 

<File name='dbt_project.yml'>

```yml

models:
  [<resource-path>](/reference/resource-configs/resource-path):
    +pre-hook: SQL-statement | [SQL-statement]
    +post-hook: SQL-statement | [SQL-statement]

```

</File>

<File name='models/<model_name>.sql'>

```sql

{{ config(
    pre_hook="SQL-statement" | ["SQL-statement"],
    post_hook="SQL-statement" | ["SQL-statement"],
) }}

select ...

```


</File>

<File name='models/properties.yml'>

```yml
models:
  - name: [<model_name>]
    config:
      [pre_hook](/reference/resource-configs/pre-hook-post-hook): <sql-statement> | [<sql-statement>]
      [post_hook](/reference/resource-configs/pre-hook-post-hook): <sql-statement> | [<sql-statement>]
```

</File>

</TabItem>

<TabItem value="seeds">

<Snippet path="post-and-pre-hooks-sql-statement" /> 

<File name='dbt_project.yml'>

```yml

seeds:
  [<resource-path>](/reference/resource-configs/resource-path):
    +pre-hook: SQL-statement | [SQL-statement]
    +post-hook: SQL-statement | [SQL-statement]

```

</File>

<File name='seeds/properties.yml'>

```yml
seeds:
  - name: [<seed_name>]
    config:
      [pre_hook](/reference/resource-configs/pre-hook-post-hook): <sql-statement> | [<sql-statement>]
      [post_hook](/reference/resource-configs/pre-hook-post-hook): <sql-statement> | [<sql-statement>]
```

</File>

</TabItem>

<TabItem value="snapshots">

<Snippet path="post-and-pre-hooks-sql-statement" /> 

<File name='dbt_project.yml'>

```yml

snapshots:
  [<resource-path>](/reference/resource-configs/resource-path):
    +pre-hook: SQL-statement | [SQL-statement]
    +post-hook: SQL-statement | [SQL-statement]

```

</File>

<File name='snapshots/snapshot.yml'>

```yml
snapshots:
  - name: [<snapshot_name>]
    [config](/reference/resource-properties/config):
      [pre_hook](/reference/resource-configs/pre-hook-post-hook): <sql-statement> | [<sql-statement>]
      [post_hook](/reference/resource-configs/pre-hook-post-hook): <sql-statement> | [<sql-statement>]
```

</File>

</TabItem>

</Tabs>

## Definition
A SQL statement (or list of SQL statements) to be run before or after a model, seed, or snapshot is built.

Pre- and post-hooks can also call macros that return SQL statements. If your macro depends on values available only at execution time, such as using model configurations or `ref()` calls to other resources as inputs, you will need to [wrap your macro call in an extra set of curly braces](/best-practices/dont-nest-your-curlies#an-exception).

### Why would I use hooks?

dbt aims to provide all the boilerplate SQL you need (DDL, DML, and DCL) via out-of-the-box functionality, which you can configure quickly and concisely. In some cases, there may be SQL that you want or need to run, specific to functionality in your data platform, which dbt does not (yet) offer as a built-in feature. In those cases, you can write the exact SQL you need, using dbt's compilation context, and pass it into a `pre-` or `post-` hook to run before or after your model, seed, or snapshot.

import SQLCompilationError from '/snippets/_render-method.md';

<SQLCompilationError />

## Examples

### [Redshift] Unload one model to S3

<File name='model.sql'>

```sql
{{ config(
  post_hook = "unload ('select from {{ this }}') to 's3:/bucket_name/{{ this }}"
) }}

select ...
```

</File>

See: [Redshift docs on `UNLOAD`](https://docs.aws.amazon.com/redshift/latest/dg/r_UNLOAD.html)

### [Apache Spark] Analyze tables after creation

<File name='dbt_project.yml'>

```yml

models:
  jaffle_shop: # this is the project name
    marts:
      finance:
        +post-hook:
          # this can be a list
          - "analyze table {{ this }} compute statistics for all columns"
          # or call a macro instead
          - "{{ analyze_table() }}"
```

See: [Apache Spark docs on `ANALYZE TABLE`](https://spark.apache.org/docs/latest/sql-ref-syntax-aux-analyze-table.html)

</File>

### Additional examples
We've compiled some more in-depth examples [here](/docs/build/hooks-operations#additional-examples).

## Late-rendering hooks

dbt renders every model file twice:

1. **Parse phase:**  dbt reads the file to extract dependencies, resolve configs, and build the DAG. At this point, some context variables aren't fully resolved yet — for example, `{{ this }}` uses placeholder values, `{% if execute %}` is `False`, and a model's final schema (including any [custom schema](/docs/build/custom-schemas)) isn't known.
2. **Execution phase:** dbt actually runs the model. The full execution context is available: `{{ this }}` resolves to the correct `database.schema.relation`, `{% if execute %}` is `True`, and `ref()` / `source()` return fully-qualified relation objects.

Hook strings are stored after parse time and re-rendered at execution time. This means:

- A hook value written as a plain Jinja expression (no quotes around it) is evaluated at parse time, before the execution context is ready.
- A hook value written as a quoted string containing Jinja is stored and re-rendered at execution time, when all context variables are available.

This distinction is what the term "late-rendering" refers to. Wrapping Jinja inside a quoted string so that dbt defers its evaluation to execution time.

:::info Nested curlies are allowed, and required, in hooks

Hooks are [the one exception](/best-practices/dont-nest-your-curlies#an-exception) to dbt's rule against nesting curly braces. For example:

```sql
{{ config(post_hook="grant select on {{ this }} to role reporter") }}
```

The inner `{{ this }}` is inside a quoted string and will be re-rendered at execution time with the correct relation identifier.

:::

### When do you need late-rendering?

Use late-rendering (quoted Jinja strings) inside hooks whenever you want to reference any of the following:

| Use case | Requires late-rendering? | Notes |
|---|---|---|
| `{{ this }}` (correct schema/database) | ✅ Yes | At parse time, `this` uses placeholder values |
| `{{ this.type }}` (table vs. view) | ✅ Yes | Only known after the model is created |
| `{{ ref('other_model') }}` | ✅ Yes | Relation may not exist yet at parse time |
| `{{ source('src', 'tbl') }}` | ✅ Yes | Same as `ref()` |
| Calling a macro that uses the above | ✅ Yes | The macro must be invoked inside a quoted string |
| Variables set with `{% if execute %}` | ✅ Yes | `execute` is `False` during parse phase |
| Static SQL with no dbt context | ❌ No | Plain SQL always works without special syntax |

### Examples

#### Use `{{ this }}` with a custom schema

At parse time, `{{ this }}` resolves using placeholder values and does not reflect any [custom schema](/docs/build/custom-schemas) configuration. To get the correct fully-qualified identifier at execution time, wrap it in a quoted string:

<Tabs>
<TabItem value="correct" label="✅ Correct">

<File name='models/my_model.sql'>

```sql
{{
  config(
    schema='staging',
    post_hook="delete from {{ this }} where updated_at < '2020-01-01'"
  )
}}

select ...
```

</File>

</TabItem>
<TabItem value="incorrect" label="❌ Incorrect">

<File name='models/my_model.sql'>

```sql
-- Do not do this! `this` is evaluated at parse time and will not
-- reflect the custom schema config.
{% set post_hook_sql %}
  delete from {{ this }} where updated_at < '2020-01-01'
{% endset %}

{{
  config(
    schema='staging',
    post_hook=post_hook_sql
  )
}}

select ...
```

</File>

</TabItem>
</Tabs>

The same quoted-string approach works in `dbt_project.yml`:

```yaml
# dbt_project.yml
models:
  my_project:
    staging:
      +post-hook: "delete from {{ this }} where updated_at < '2020-01-01'"
```

#### Use `{{ this.type }}` after model creation

`this.type` reflects whether the model was created as a `table` or `view`. This is only known _after_ the model finishes building, making it a post-hook only pattern:

<File name='models/my_model.sql'>

```sql
{{
  config(
    post_hook="insert into audit_log (relation, type) values ('{{ this }}', '{{ this.type }}')"
  )
}}

select ...
```

</File>

#### Call a macro from a hook

Macros invoked in hooks must also be wrapped in a quoted string so they are re-rendered at execution time with the full execution context. The macro itself can then reference `{{ this }}` directly:

<File name='macros/audit.sql'>

```sql
{% macro log_model_run() %}
  insert into audit_log (relation, run_at)
  values ('{{ this }}', current_timestamp)
{% endmacro %}
```

</File>

<Tabs>
<TabItem value="correct" label="✅ Correct">

<File name='models/my_model.sql'>

```sql
-- The macro call is inside a quoted string — re-rendered at execution time.
{{ config(post_hook="{{ log_model_run() }}") }}

select ...
```

</File>

Or from `dbt_project.yml`:

```yaml
models:
  +post-hook: "{{ log_model_run() }}"
```

</TabItem>
<TabItem value="incorrect" label="❌ Incorrect">

<File name='models/my_model.sql'>

```sql
-- Do not do this! The macro is evaluated at parse time, so `this`
-- inside the macro will be a placeholder with the wrong schema.
{{ config(post_hook=log_model_run()) }}

select ...
```

</File>

</TabItem>
</Tabs>

:::caution Passing `this` as an argument to a macro

Be careful when passing `{{ this }}` as an argument to a macro in a hook. Even with late-rendering, the `this` object passed as an argument is resolved at the point the surrounding hook string is rendered, which may still produce unexpected results if the macro uses `this` in contexts that require the finalized relation (for example, `get_column_values`).

To avoid this, let the macro reference `{{ this }}` directly from the Jinja context inside its body, rather than receiving it as a parameter:

```sql
{# ✅ Recommended: macro reads `this` from context internally #}
{{ config(post_hook="{{ my_grant_macro() }}") }}

{# ❌ Avoid: passing `this` as an argument — may not resolve as expected #}
{{ config(post_hook="{{ my_grant_macro(this) }}") }}
```

:::

#### Use `ref()` or `source()` inside a hook

If a hook needs to reference another relation, wrap the `ref()` or `source()` call in a quoted string so it is re-rendered at execution time:

<File name='models/my_model.sql'>

```sql
{{
  config(
    post_hook="insert into {{ ref('audit_table') }} select '{{ this }}', current_timestamp"
  )
}}

select ...
```

</File>

:::tip Alternative: use `.render()` for source refreshes

When using the `--empty` flag (which skips relation processing for optimization), use the `.render()` method to explicitly force evaluation of a `source()` call in a hook:

```sql
{{ config(
    pre_hook=["alter external table {{ source('sys', 'events').render() }} refresh"]
) }}
```

:::

#### Use variables set with `{% if execute %}`

Hooks are re-rendered independently from the model body, so they don't automatically inherit variables set inside a `{% if execute %}` block in the model. To use an execution-phase variable in a hook, include the conditional logic inside the hook string itself:

<File name='models/my_model.sql'>

```sql
{{
  config(
    pre_hook=[
      """
      {% if execute %}
        {% set val = 111 %}
      {% else %}
        {% set val = 999 %}
      {% endif %}
      SELECT {{ val }} AS pre_hook_value
      """
    ]
  )
}}

select ...
```

</File>

### Parse-time vs. execution-time rendering

| Hook syntax | Rendered at | Result |
|---|---|---|
| `post_hook="{{ this }}"` | Execution time ✅ | Correct fully-qualified relation |
| `post_hook="{{ ref('model') }}"` | Execution time ✅ | Correct relation identifier |
| `post_hook="{{ my_macro() }}"` | Execution time ✅ | Macro runs with full context |
| `post_hook=this \| string` | Parse time ❌ | Placeholder values, wrong schema |
| `post_hook=my_macro()` | Parse time ❌ | Macro runs before execution context |
| `post_hook="static SQL"` | Execution time ✅ | Works fine — no Jinja to resolve |

## Usage notes
### Hooks are cumulative
If you define hooks in both your `dbt_project.yml` and in the `config` block of a model, both sets of hooks will be applied to your model.

### Execution ordering
If multiple instances of any hooks are defined, dbt will run each hook using the following ordering:
1. Hooks from dependent packages will be run before hooks in the active package.
2. Hooks defined within the model itself will be run after hooks defined in `dbt_project.yml`.
3. Hooks within a given context will be run in the order in which they are defined.


### Transaction behavior
If you're using an adapter that uses transactions (namely Postgres or Redshift), it's worth noting that by default hooks are executed inside of the same transaction as your model being created.

There may be occasions where you need to run these hooks _outside_ of a transaction, for example:
* You want to run a `VACUUM` in a `post-hook`, however, this cannot be executed within a transaction ([Redshift docs](https://docs.aws.amazon.com/redshift/latest/dg/r_VACUUM_command.html#r_VACUUM_usage_notes))
* You want to insert a record into an audit <Term id="table" /> at the start of a run and do not want that statement rolled back if the model creation fails.

To achieve this behavior, you can use one of the following syntaxes:
  - Important note: Do not use this syntax if you are using a database where dbt does not support transactions. This includes databases like Snowflake, BigQuery, and Spark or Databricks.

<Tabs>
<TabItem value="beforebegin" label="Use before_begin and after_commit">

#### Config block: use the `before_begin` and `after_commit` helper macros

<File name='models/<modelname>.sql'>

```sql
{{
  config(
    pre_hook=before_begin("SQL-statement"),
    post_hook=after_commit("SQL-statement")
  )
}}

select ...

```

</File>
</TabItem>

<TabItem value="dictionary" label="Use a dictionary">

#### Config block: use a dictionary
<File name='models/<modelname>.sql'>

```sql
{{
  config(
    pre_hook={
      "sql": "SQL-statement",
      "transaction": False
    },
    post_hook={
      "sql": "SQL-statement",
      "transaction": False
    }
  )
}}

select ...

```

</File>

</TabItem>

<TabItem value="dbt_project.yml" label="Use dbt_project.yml">

#### `dbt_project.yml`: Use a dictionary

<File name='dbt_project.yml'>

```yml

models:
  +pre-hook:
    sql: "SQL-statement"
    transaction: false
  +post-hook:
    sql: "SQL-statement"
    transaction: false


```

</File>
</TabItem>
</Tabs>
