---
title: pre-hook & post-hook
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

<File name='dbt_project.yml'>

```yml

models:
  [<resource-path>](resource-path):
    +pre-hook: <sql-statement> | [<sql-statement>]
    +post-hook: <sql-statement> | [<sql-statement>]

```

</File>

<File name='models/<model_name>.sql'>

```sql

{{ config(
    pre_hook="<sql-statement>" | ["<sql-statement>"],
    post_hook="<sql-statement>" | ["<sql-statement>"],
) }}

select ...

```


</File>

</TabItem>

<TabItem value="seeds">

<File name='dbt_project.yml'>

```yml

seeds:
  [<resource-path>](resource-path):
    +pre-hook: <sql-statement> | [<sql-statement>]
    +post-hook: <sql-statement> | [<sql-statement>]

```

</File>

</TabItem>

<TabItem value="snapshots">

<File name='dbt_project.yml'>

```yml

snapshots:
  [<resource-path>](resource-path):
    +pre-hook: <sql-statement> | [<sql-statement>]
    +post-hook: <sql-statement> | [<sql-statement>]

```

</File>

<File name='snapshots/<filename>.sql'>

```sql
{% snapshot snapshot_name %}
{{ config(
    pre_hook="<sql-statement>" | ["<sql-statement>"],
    post_hook="<sql-statement>" | ["<sql-statement>"],
) }}

select ...

{% end_snapshot %}

```

</File>

</TabItem>

</Tabs>

## Definition
A SQL statement (or list of SQL statements) to be run before or after a model, seed or snapshot is built.

Pre- and post-hooks can also call macros that return SQL statements.

<Changelog>

* `v0.12.2`: The `post_hook` alias for config blocks was introduced. Prior to this, users needed to use the alternative config syntax to apply pre- and post-hooks.

</Changelog>


## Examples
### Grant privileges on a model

<File name='dbt_project.yml'>

```yml

models:
  +post-hook: "grant select on {{ this }} to group reporter"

```

</File>

### Grant multiple privileges on a model

<File name='dbt_project.yml'>

```yml

models:
  +post-hook:
    - "grant select on {{ this }} to group reporter"
    - "grant select on {{ this }} to group transformer"

```

</File>

### Call a macro to grant privileges on a model

<File name='dbt_project.yml'>

```yml

model:
  +post-hook: "{{ grant_select(this) }}"

```

</File>


### Grant privileges on a directory of models

<File name='dbt_project.yml'>

```yml

model:
  jaffle_shop: # this is the project name
    marts:
      marketing:
        # this will be applied to all models in marts/marketing/
        +post-hook: "{{ grant_select(this) }}"

```

</File>

### Additional examples
We've compiled some more in-depth examples [here](hooks-operations#additional-examples).

## Usage notes
### Hooks are cumulative
If you define hooks in both your `dbt_project.yml` and in the `config` block of a model, both sets of hooks will be applied to your model.

### Execution ordering
If multiple instances of any hooks are defined, dbt will run each hook using the following ordering:
1. Hooks from dependent packages will be run before hooks in the active package.
2. Hooks defined within the model itself will be run before hooks defined in `dbt_project.yml`.
3. Hooks within a given context will be run in the order in which they are defined.


### Transaction behavior
If you're using an adapter that makes use of transactions (namely Postgres or Redshift), it's worth noting that by default hooks are executed inside of the same transaction as your model being created.

There may be occasions where you need to run these hooks _outside_ of a transaction, for example:
* You want to run a `VACUUM` in a `post-hook`, however this cannot be executed within a transaction ([Redshift docs](https://docs.aws.amazon.com/redshift/latest/dg/r_VACUUM_command.html#r_VACUUM_usage_notes))
* You want to insert a record into an audit <Term id="table" /> at the start of a run, and do not want that statement rolled back if the model creation fails.

To achieve this, you can use one of the following syntaxes:

#### Config block: use the `before_begin` and `after_commit` helper macros

<File name='models/<modelname>.sql'>

```sql
{{
  config(
    pre_hook=before_begin("<sql-statement>"),
    post_hook=after_commit("<sql-statement>")
  )
}}

select ...

```

</File>

#### Config block: use a dictionary
<File name='models/<modelname>.sql'>

```sql
{{
  config(
    pre_hook={
      "sql": "<sql-statement>",
      "transaction": False
    },
    post_hook={
      "sql": "<sql-statement>",
      "transaction": False
    }
  )
}}

select ...

```

</File>

#### `dbt_project.yml`: Use a dictionary

<File name='dbt_project.yml'>

```yml

models:
  +pre-hook:
    sql: "<sql-statement>"
    transaction: false
  +post-hook:
    sql: "<sql-statement>"
    transaction: false


```

</File>
