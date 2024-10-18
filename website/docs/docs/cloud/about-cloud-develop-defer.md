---
title: Using defer in dbt Cloud
id: about-cloud-develop-defer
description: "Learn how to leverage defer to prod when developing with dbt Cloud."
sidebar_label: "Using defer in dbt Cloud"
pagination_next: "docs/cloud/cloud-cli-installation"
---


[Defer](/reference/node-selection/defer) is a powerful feature that allows developers to only build and run and test models they've edited without having to first run and build all the models that come before them (upstream parents). dbt powers this by using a production manifest for comparison, and resolves the `{{ ref() }}` function with upstream production artifacts. 

Both the dbt Cloud IDE and the dbt Cloud CLI enable users to natively defer to production metadata directly in their development workflows. 

<Lightbox src src="/img/docs/reference/defer-diagram.png" width="50%" title="Use 'defer' to modify end-of-pipeline models by pointing to production models, instead of running everything upstream." />

By default, dbt follows these rules:

- dbt uses the production locations of parent models to resolve `{{ ref() }}` functions, based on metadata from the production environment.
- If a development version of a deferred model exists, dbt preferentially uses the development database location when resolving the reference.
- Passing the [`--favor-state`](/reference/node-selection/defer#favor-state) flag overrides the default behavior and _always_ resolve refs using production metadata, regardless of the presence of a development relation.

For a clean slate, it's a good practice to drop the development schema at the start and end of your development cycle.

If you require additional controls over production data, create a [Staging environment](/docs/deploy/deploy-environments#staging-environment) and dbt will use that, rather than the Production environment, to resolve `{{ ref() }}` functions.

## Required setup

- You must select the **[Production environment](/docs/deploy/deploy-environments#set-as-production-environment)** checkbox in the **Environment Settings** page. 
  - This can be set for one deployment environment per dbt Cloud project.
- You must have a successful job run first.

When using defer, it compares artifacts from the most recent successful production job, excluding CI jobs.

### Defer in the dbt Cloud IDE

To enable defer in the dbt Cloud IDE, toggle the **Defer to production** button on the command bar. Once enabled, dbt Cloud will:

1. Pull down the most recent manifest from the Production environment for comparison
2. Pass the `--defer` flag to the command (for any command that accepts the flag)

For example, if you were to start developing on a new branch with [nothing in your development schema](/reference/node-selection/defer#usage), edit a single model, and run `dbt build -s state:modified` &mdash;  only the edited model would run. Any `{{ ref() }}` functions will point to the production location of the referenced models.

<Lightbox src="/img/docs/dbt-cloud/defer-toggle.jpg" width="100%" title="Select the 'Defer to production' toggle on the bottom right of the command bar to enable defer in the dbt Cloud IDE."/>

### Defer in dbt Cloud CLI

One key difference between using `--defer` in the dbt Cloud CLI and the dbt Cloud IDE is that `--defer` is *automatically* enabled in the dbt Cloud CLI for all invocations, compared with production artifacts. You can disable it with the `--no-defer` flag.

The dbt Cloud CLI offers additional flexibility by letting you choose the source environment for deferral artifacts. You can manually set a `defer-env-id` key in either your `dbt_project.yml` or `dbt_cloud.yml` file. By default, the dbt Cloud CLI will prefer metadata from the project's "Staging" environment (if defined), otherwise "Production."

<File name="dbt_cloud.yml">

```yml
context:
  active-host: ...
  active-project: ...
  defer-env-id: '123456'
```

</File>


<File name="dbt_project.yml"> 

```yml
dbt-cloud:
  defer-env-id: '123456'
```

</File>
