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
    pre-hook: <string> | [<string>]
    post-hook: <string> | [<string>]

```

</File>

<File name='models/<model_name>.sql'>

```sql

{{ config(
    pre_hook="<string>" | ["<string>"],
    post_hook="<string>" | ["<string>"],
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
    pre-hook: <string> | [<string>]
    post-hook: <string> | [<string>]

```

</File>

</TabItem>

<TabItem value="snapshots">

<File name='dbt_project.yml'>

```yml

snapshots:
  [<resource-path>](resource-path):
    pre-hook: <string> | [<string>]
    post-hook: <string> | [<string>]

```

</File>

<File name='snapshots/<filename>.sql'>

```sql
{% snapshot snapshot_name %}
{{ config(
    pre_hook="<string>" | ["<string>"],
    post_hook="<string>" | ["<string>"],
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

* `v0.12.2`: The `post_hook` alias for config blocks was introduced. Prior to this, users needed to use the [alternative config syntax]() to apply pre- and post-hooks.

</Changelog>


## Examples
### Grant select privileges on a seed

<File name='dbt_project.yml'>

```yml

seeds:
  post-hook: "grant select on {{ this }} to group reporter"

```

</File>

### Grant multiple select privileges on a seed

<File name='dbt_project.yml'>

```yml

seeds:
  post-hook:
    - "grant select on {{ this }} to group reporter"
    - "grant select on {{ this }} to group transformer"

```

</File>

### Call a macro to grant select privileges on a seed

<File name='dbt_project.yml'>

```yml

seeds:
  post-hook: "{{ grant_select(this) }}"

```

</File>

## Usage notes
### Hooks are cumulative

### Transaction behavior


### Execution ordering
Multiple instances of any hook may be defined. In this case, dbt will run each hook using the following ordering:

- Hooks from dependent packages will be run before hooks in the active package.
- Hooks defined within the model itself will be run before hooks defined in `dbt_project.yml`.
- Hooks within a given context will be run in the order in which they are defined.
