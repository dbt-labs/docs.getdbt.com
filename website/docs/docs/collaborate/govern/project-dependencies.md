---
title: "Project dependencies"
id: project-dependencies
sidebar_label: "Project dependencies"
description: "Reference public models across dbt projects"
---

:::info Cross-project `ref`
This is a feature of dbt Cloud Enterprise.
:::

dbt Core v1.6 introduces a notion of `dependencies` between dbt projects. You might already be familiar with installing other projects as [packages](/docs/build/packages), whereby you pull down another project's source code and treat it as your own.

There is a new kind of `project` dependency. Both dependencies can be defined in `dependencies.yml`:
```yml
packages:
  - package: dbt-labs/dbt_utils
    version: 1.1.1

projects:
  - name: jaffle_finance
```

The first is familiar: you want to use macros from the `dbt_utils` package, so you pull it down as source code. You can then call any macro from the package as if it were a macro defined in your project.

The second is new. Unlike installing a package, the models in the `jaffle_finance` project will not be pulled down as source code, or selected to run during `dbt run`. Instead, dbt Cloud will provide `dbt-core` with expect stateful input that enables it to resolve references to public models in the `jaffle_finance` project—and _only_ the public models.

Models referenced from a `project`-type dependency must use [two-argument `ref`](/reference/dbt-jinja-functions/ref#two-argument-variant), including the project name. Only public models can be accessed in this way.

It is equally possible to install the `jaffle_finance` project as a `package` dependency. This will pull down its full source code, and require dbt to parse all its contents. dbt will expect you to configure and run those models as your own. This can be a useful pattern to achieve certain types of unified deployments in production, or to make a coordinated change across multiple projects in development. It can add significant complexity and latency, however, when working within the narrower scope of a single project.
