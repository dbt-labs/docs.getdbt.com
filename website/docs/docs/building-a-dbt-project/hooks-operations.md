---
title: "Hooks & Operations"
id: "hooks-operations"
---

## Related documentation
* [pre-hook & post-hook](pre-hook-post-hook)
* [on-run-start & on-run-end](on-run-start-on-run-end)
* [`run-operation` command](run-operation)

## Assumed knowledge
* [Project configurations](reference/dbt_project.yml.md)
* [Model configurations](model-configs)
* [Macros](jinja-macros#macros)

## Getting started

Effective database administration sometimes requires additional SQL statements to be run, for example:
- Granting privileges on an <Term id="table" /> / view
- Creating UDFs
- Vacuuming tables on Redshift
- Creating partitions in Redshift Spectrum external tables
- Resuming/pausing/resizing warehouses in Snowflake
- Refreshing a pipe in Snowflake
- Create a share on Snowflake
- Cloning a database on Snowflake

dbt provides two different interfaces for you to version control and execute these statements as part of your dbt project — hooks and operations.

### Hooks
Hooks are snippets of SQL that are executed at different times:
  * `pre-hook`: executed _before_ a model, seed or snapshot is built.
  * `post-hook`: executed _after_ a model, seed or snapshot is built.
  * `on-run-start`: executed at the _start_ of `dbt run`, `dbt seed` or `dbt snapshot`
  * `on-run-end`: executed at the _end_ of `dbt run`, `dbt seed` or `dbt snapshot`

Hooks are defined in your `dbt_project.yml` file. Pre- and post-hooks can also be defined in a `config` block.

Here's a minimal example of using hooks to grant privileges. You can find more information in the reference sections for [`on-run-start` and `on-run-end` hooks](on-run-start-on-run-end) and [`pre-hook`s and `post-hook`s](pre-hook-post-hook).

<File name='dbt_project.yml'>

```yml
on-run-end:
  - "grant usage on {{ target.schema }} to role reporter"

models:
  +post-hook:
    - "grant select on {{ this }} to role reporter"

```

</File>

You can also apply the `post-hook` to individual models using a `config` block:

<File name='models/<model_name>.sql'>

```sql
{{ config(
    post_hook=[
      "grant select on {{ this }} to role reporter"
    ]
) }}

select ...

```

</File>

:::tip Calling a macro in a hook

You can also use a [macro](jinja-macros#macros) to bundle up hook logic. Check out some of the examples in the reference sections for [on-run-start and on-run-end hooks](on-run-start-on-run-end) and [pre- and post-hooks](pre-hook-post-hook),

:::

### Operations
Operations are [macros](jinja-macros#macros) that you can run using the [`run-operation` command](run-operation) command. As such, operations aren't actually a separate resource in your dbt project — they are just a convenient way to invoke a macro without needing to run a model.

:::info Explicitly execute the SQL in an operation
Unlike hooks, you need to explicitly execute a query within a macro, by using either a [statement block](statement-blocks) or a helper macro like the [run_query macro](run_query) macro. Otherwise, dbt will return the query as a string without executing it.
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

Full usage docs can for the `run-operation` command can be found [here](run-operation).


## Additional examples
These examples from the community highlight some of the use-cases for hooks and operations!

* [In-depth discussion of granting privileges using hooks and operations](https://discourse.getdbt.com/t/the-exact-grant-statements-we-use-in-a-dbt-project/430)
* [Staging external tables](https://github.com/dbt-labs/dbt-external-tables)
* [Performing a zero copy clone on Snowflake to reset a dev environment](https://discourse.getdbt.com/t/creating-a-dev-environment-quickly-on-snowflake/1151/2)
* [Running `vacuum` and `analyze` on a Redshift warehouse](https://github.com/dbt-labs/redshift/tree/0.2.3/#redshift_maintenance_operation-source)
* [Creating a Snowflake share](https://discourse.getdbt.com/t/how-drizly-is-improving-collaboration-with-external-partners-using-dbt-snowflake-shares/1110)
* [Unloading files to S3 on Redshift](https://github.com/dbt-labs/redshift/tree/0.2.3/#unload_table-source)
* [Creating audit events for model timing](https://github.com/dbt-labs/dbt-event-logging)
* [Creating UDFs](https://discourse.getdbt.com/t/using-dbt-to-manage-user-defined-functions/18)
