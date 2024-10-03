---
title: pre-hook & post-hook
description: "Pre-hook and Post-hook - Read this in-depth guide to learn about configurations in dbt."
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

<VersionBlock lastVersion="1.8">

<File name='snapshots/<filename>.sql'>

```sql
{% snapshot snapshot_name %}
{{ config(
    pre_hook="SQL-statement" | ["SQL-statement"],
    post_hook="SQL-statement" | ["SQL-statement"],
) }}

select ...

{% end_snapshot %}

```

</File>
</VersionBlock>

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

## Examples

<Snippet path="hooks-to-grants" />

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
