---
title: "Hooks and operations"
description: "Read this tutorial to learn how to use hooks and operations when building in dbt."
id: "hooks-operations"
---

import OnRunCommands from '/snippets/_onrunstart-onrunend-commands.md';

## Related documentation
* [pre-hook & post-hook](/reference/resource-configs/pre-hook-post-hook)
* [on-run-start & on-run-end](/reference/project-configs/on-run-start-on-run-end)
* [`run-operation` command](/reference/commands/run-operation)

### Assumed knowledge
* [Project configurations](/reference/dbt_project.yml.md)
* [Model configurations](/reference/model-configs)
* [Macros](/docs/build/jinja-macros#macros)

## Getting started with hooks and operations

Effective database administration sometimes requires additional SQL statements to be run, for example:
- Creating UDFs
- Managing row- or column-level permissions
- Vacuuming tables on Redshift
- Creating partitions in Redshift Spectrum external tables
- Resuming/pausing/resizing warehouses in Snowflake
- Refreshing a pipe in Snowflake
- Create a share on Snowflake
- Cloning a database on Snowflake

dbt provides hooks and operations so you can version control and execute these statements as part of your dbt project.

## About hooks

Hooks are snippets of SQL that are executed at different times:
  * `pre-hook`: executed _before_ a model, seed or snapshot is built.
  * `post-hook`: executed _after_ a model, seed or snapshot is built.
  * `on-run-start`: executed at the _start_ of <OnRunCommands/>
  * `on-run-end`: executed at the _end_ of <OnRunCommands/>

Hooks are a more-advanced capability that enable you to run custom SQL, and leverage database-specific actions, beyond what dbt makes available out-of-the-box with standard materializations and configurations.

<Snippet path="hooks-to-grants" />

<VersionBlock firstVersion="1.2">

If (and only if) you can't leverage the [`grants` resource-config](/reference/resource-configs/grants), you can use `post-hook` to perform more advanced workflows:

* Need to apply `grants` in a more complex way, which the dbt Core v1.2 `grants` config does not (yet) support.
* Need to perform post-processing that dbt does not support out-of-the-box. For example, `analyze table`, `alter table set property`, `alter table ... add row access policy`, etc.

### Examples using hooks

You can use hooks to trigger actions at certain times when running an operation or building a model, seed, or snapshot.

For more information about when hooks can be triggered, see reference sections for [`on-run-start` and `on-run-end` hooks](/reference/project-configs/on-run-start-on-run-end) and [`pre-hook`s and `post-hook`s](/reference/resource-configs/pre-hook-post-hook).

You can use hooks to provide database-specific functionality not available out-of-the-box with dbt. For example, you can use a `config` block to run an `ALTER TABLE` statement right after building an individual model using a `post-hook`:

<File name='models/<model_name>.sql'>

```sql
{{ config(
    post_hook=[
      "alter table {{ this }} ..."
    ]
) }}
```

</File>


</VersionBlock>

### Calling a macro in a hook

You can also use a [macro](/docs/build/jinja-macros#macros) to bundle up hook logic. Check out some of the examples in the reference sections for [on-run-start and on-run-end hooks](/reference/project-configs/on-run-start-on-run-end) and [pre- and post-hooks](/reference/resource-configs/pre-hook-post-hook).

## About operations

Operations are [macros](/docs/build/jinja-macros#macros) that you can run using the [`run-operation`](/reference/commands/run-operation) command. As such, operations aren't actually a separate resource in your dbt project — they are just a convenient way to invoke a macro without needing to run a model.

:::info Explicitly execute the SQL in an operation
Unlike hooks, you need to explicitly execute a query within a macro, by using either a [statement block](/reference/dbt-jinja-functions/statement-blocks) or a helper macro like the [run_query](/reference/dbt-jinja-functions/run_query) macro. Otherwise, dbt will return the query as a string without executing it.
:::

This macro performs a similar action as the above hooks:

<File name='macros/grant_select.sql'>

```sql
{% macro grant_select(role) %}
{% set sql %}
    grant usage on schema {{ target.schema }} to role {{ role }};
    grant select on all tables in schema {{ target.schema }} to role {{ role }};
    grant select on all views in schema {{ target.schema }} to role {{ role }};
{% endset %}

{% do run_query(sql) %}
{% do log("Privileges granted", info=True) %}
{% endmacro %}

```

</File>

To invoke this macro as an operation, execute `dbt run-operation grant_select --args '{role: reporter}'`.

```
$ dbt run-operation grant_select --args '{role: reporter}'
Running with dbt=0.16.1
Privileges granted

```

Full usage docs for the `run-operation` command can be found [here](/reference/commands/run-operation).


## Additional examples

These examples from the community highlight some of the use-cases for hooks and operations!

* [In-depth discussion of granting privileges using hooks and operations, for dbt Core versions prior to 1.2](https://discourse.getdbt.com/t/the-exact-grant-statements-we-use-in-a-dbt-project/430)
* [Staging external tables](https://github.com/dbt-labs/dbt-external-tables)
* [Performing a zero copy clone on Snowflake to reset a dev environment](https://discourse.getdbt.com/t/creating-a-dev-environment-quickly-on-snowflake/1151/2)
* [Running `vacuum` and `analyze` on a Redshift warehouse](https://github.com/dbt-labs/redshift/tree/0.2.3/#redshift_maintenance_operation-source)
* [Creating a Snowflake share](https://discourse.getdbt.com/t/how-drizly-is-improving-collaboration-with-external-partners-using-dbt-snowflake-shares/1110)
* [Unloading files to S3 on Redshift](https://github.com/dbt-labs/redshift/tree/0.2.3/#unload_table-source)
* [Creating audit events for model timing](https://github.com/dbt-labs/dbt-event-logging)
* [Creating UDFs](https://discourse.getdbt.com/t/using-dbt-to-manage-user-defined-functions/18)
