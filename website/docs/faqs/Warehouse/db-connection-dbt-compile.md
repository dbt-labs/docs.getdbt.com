---
title: Why does dbt compile need a data platform connection?
description: "`dbt compile` needs a data platform connection because the work it does depends on the current state of your warehouse"
sidebar_label: "Why does dbt compile need a data platform connection?"
id: db-connection-dbt-compile
---

The [`dbt compile`](reference/commands/compile) command is a really important step in the dbt workflow. `compile` is similar to `run` except `compile` doesn't materialize the model's compiled SQL into an existing table. So, up until the point of materialization, `compile` and `run` are similar because they both require a data platform connection, run queries, and have an [`execute` variable](/reference/dbt-jinja-functions/execute) set to `True`.

Something to note is that `compile` doesn't mean `parse` &mdash;`parse` validates your written `YAML`, configured tags, and so on.

To generate the compiled SQL for many models, dbt needs to run introspective queries, (when dbt needs to run SQL in order to pull data back and do something with it) against the data platform. These introspective queries include populating the [relation cache](/guides/advanced/creating-new-materializations#update-the-relation-cache), resolving [macros](/docs/build/jinja-macros#macros), and checking if models are [incremental](/docs/build/incremental-models). Without a database connection, dbt can't perform these introspective queries and won't be able to generate the compiled SQL needed for the next steps in the dbt workflow.

You can [`parse`](/reference/commands/parse) a project and use [`list`](/reference/commands/list) resources in the project, without an internet or data platform connection. You do need a connection profile (`profiles.yml` if using the CLI) because there are configurations in the project that depend on the contents of that profile for configuration, such as using [`{{target}}`](/reference/dbt-jinja-functions/target) for conditional configs. Starting in v1.5, `dbt parse` will also (over)write `manifest.json` by default. 

However, something to note is that the written-out manifest won't include compiled SQL.

In short, `dbt compile` needs a data platform connection to gather the information it needs (including from introspective queries) to prepare the SQL for every model in your project.

