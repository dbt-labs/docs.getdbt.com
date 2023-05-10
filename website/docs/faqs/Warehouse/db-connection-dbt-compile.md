---
title: Why does dbt compile need a data platform connection?
description: "`dbt compile` needs a data platform connection because the work it does depends on the current state of your warehouse"
sidebar_label: "Why does dbt compile need a data platform connection?"
id: db-connection-dbt-compile
---

The [`dbt compile` command](/reference/commands/compile) generates executable SQL from source, `model`, `test`, and `analysis` files. 

`dbt compile` is similar to `dbt run` except that it doesn't materialize the model's compiled SQL into an existing table. So, up until the point of materialization, `dbt compile` and `dbt run` are similar because they both require a data platform connection, run queries, and have an [`execute` variable](/reference/dbt-jinja-functions/execute) set to `True`. There are a few things to note:

- It isn't necessary to execute `dbt compile` before `dbt run`
- In dbt, `compile` doesn't mean `parse`. This is because `parse` validates your written `YAML`, configured tags, and so on.

To generate the compiled SQL for many models, dbt needs to run introspective queries, (which is when dbt needs to run SQL in order to pull data back and do something with it) against the data platform.

These introspective queries include:

- populating the [relation cache](/guides/advanced/creating-new-materializations#update-the-relation-cache). Catching speeds up the quick metadata checks, including whether an incremental model already exists in the data platform. 
- resolving [macros](/docs/build/jinja-macros#macros), such as `run_query` or `dbt_utils.get_column_values` that you're using to template out your SQL. This is because dbt needs to run those queries during model SQL compilation. 
- and checking if models are [incremental](/docs/build/incremental-models). 

Without a data platform connection, dbt can't perform these introspective queries and won't be able to generate the compiled SQL needed for the next steps in the dbt workflow.

You can [`parse`](/reference/commands/parse) a project and use the [`list`](/reference/commands/list) resources in the project, without an internet or data platform connection. 

However, to configure a project you do need a [connection profile](/docs/core/connection-profiles) (`profiles.yml` if using the CLI). You need this file because the project's configuration depends on its contents. For example, you may need to use [`{{target}}`](/reference/dbt-jinja-functions/target) for conditional configs or know what platform you're running against so that you can choose the right flavor of SQL. 

Parsing a project is also sufficient to produce a [manifest](/reference/artifacts/manifest-json).  However, keep in mind that the written-out manifest won't include compiled SQL.


So to summarize, `dbt compile` needs a data platform connection to gather the info it needs (including from introspective queries) to prepare the SQL for every model in your project.
