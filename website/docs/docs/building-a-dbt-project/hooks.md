---
title: "Hooks"
id: "hooks"
---

## Overview

Hooks are user-specified SQL commands that can be executed at certain times during a run. In practice, this can be useful when performing a large number of tasks such as running grant statements, adding indices, logging, and performing table maintenance operations.

dbt supports hooks on six specific events:

- at the beginning of a run
- at the end of a run
- before a model runs
- after a model runs
- before a seed runs
- after a seed runs

All hooks types are supported on:
 - Postgres
 - Redshift
 - BigQuery
 - Snowflake

## Configuring hooks

Hooks are configured in `dbt_project.yml` as such:

```yaml
# run hooks
on-run-start:
    - "create table if not exists audit (model text, state text, time timestamp)"
on-run-end:
    - 'grant usage on schema "{{ target.schema }}" to db_reader'
    - 'grant select on all tables in schema "{{ target.schema }}" to db_reader'

# model hooks
models:
    project-name:
        pre-hook: "-- some prehook sql here"
        post-hook: "grant select on {{ this }} to db_reader"

# seed hooks
seeds:
    project-name:
        pre-hook: "-- some prehook sql here"
        post-hook: "grant select on {{ this }} to db_reader""
```

Model-level hook configuration applies, like all configuration, to the scope in which it is defined in the model hierarchy. Model hooks can also be configured within a given model as shown below. Note that the `pre-hook` and `post-hook` keywords both contain `-` characters making them invalid identifiers. Instead, use the keys `pre_hook` and `post_hook` to specific hooks inside of a model `config` block:

<Callout type="info" title="New in dbt v0.12.2">

The `pre_hook` and `post_hook` aliases are new in dbt v0.12.2. If you're using a previous version of dbt, you can use the "dict" syntax when calling config.

</Callout>



```sql
-- For a single hook, use a string
{{
  config(
    post_hook="grant select on {{ this }} to db_reader"
  )
}}

-- For multiple hooks, use a list of strings
{{
  config(
    post_hook=[
      "grant usage on {{ this.schema }} to db_reader",
      "grant select on {{ this }} to db_reader"
    ]
  )
}}"
```

Hooks are extremely powerful, allowing analysts to perform tasks such as inserting records into audit tables, executing `GRANT` statements, and running `VACUUM` commands, among others. 

### Using hooks to grant

Because many dbt model configurations result in dbt dropping and then recreating database objects with every `dbt run`, it's important to ensure that appropriate users have access to `SELECT` from these models. Hooks address this: the following configurations will run a `GRANT` statement for every model and seed in the project:

```yaml
models:
    project-name:
        post-hook: "grant select on {{this}} to looker_user"

seeds:
    project-name:
        post-hook: "grant select on {{this}} to looker_user""
```

Alternately, configure this as a post-run hook:

```yaml
on-run-end:
    - 'grant usage on schema "{{ target.schema }}" to db_reader'
    - 'grant select on all tables in schema "{{ target.schema }}" to db_reader'"
```

### Using hooks to create an audit table

Here's an example of how to use hooks to insert records into an audit table for every model before and after it is built.

```yaml
models:
  project-name:
    pre-hook: "insert into _dbt.audit (event_name, event_timestamp, event_schema, event_model) values ( 'starting model deployment', getdate(), '{{this.schema}}', '{{this.name}}')"
    post-hook: "insert into _dbt.audit (event_name, event_timestamp, event_schema, event_model) values ( 'completed model deployment', getdate(), '{{this.schema}}', '{{this.name}}')""
```

### Using hooks to vacuum

Incremental models can be configured to both insert new records and update existing records. In practice, updating existing records functions as a delete and insert. In Amazon Redshift, this will, over time, result in a poorly-optimized table. To address this, developers can include a post-hook to perform a vacuum command. 

Importantly, Redshift (and Postgres) require that `vacuum` and `analyze` run outside of a transaction. To indicate that a hook should run outside of a transaction, either 1) use the long-form hook interface or 2) use the `after_commit` shortcut:

```sql
{{
  config(
    post_hook=[
      after_commit("vacuum {{this.schema}}.{{this.name}}"),
      {"sql": "vacuum {{this.schema}}.{{this.name}}", "transaction": False}
     ]
  )
}}

select ..."
```

It's possible to use this strategy to perform other database maintenance tasks on dbt models such as `analyze`.

## Multiple hooks and execution ordering

Multiple instances of any hook may be defined. In this case, dbt will run each hook using the following ordering:

- Hooks from dependent packages will be run before hooks in the active package.
- Hooks defined within the model itself will be run before hooks defined in `dbt_project.yml`.
- Hooks within a given context will be run in the order in which they are defined.