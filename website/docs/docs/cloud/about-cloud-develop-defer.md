---
title: Using defer in dbt Cloud
id: about-cloud-develop-defer
description: "Learn how to leverage defer to prod when developing with dbt Cloud."
sidebar_label: "Using defer in dbt Cloud"
pagination_next: "docs/cloud/cloud-cli-installation"
---


[Defer](/reference/node-selection/defer) is a powerful feature that allows developers to only build and run and test models they've edited without having to first run and build these models' upstream parents. This is powered by having a production manifest to compare to, and dbt will resolve the `{{ ref() }}` function with upstream production artifacts.

Both the dbt Cloud IDE and the dbt Cloud CLI allow users to natively defer to production metadata directly in their development workflows, dramatically reducing development time and warehouse spend by preventing unecessary model builds. 

## Required setup

Set your production environment using the [production environment checkbox](/docs/deploy/deploy-environments#set-as-production-environment-beta) in the environment settings page. This can be set for one deployment environment per dbt Cloud project. When using defer, the artifacts from the latest successful, non-CI job execution in the production environment will be compared to.

### Defer in the dbt Cloud IDE

Defer in the IDE is as simple as toggling the `Defer to production` switch on the command bar! When enabled, dbt Cloud will:

1. Pull down the most recent manifest from the Production environment for comparison
2. Pass the `--defer` flag to the command (for any command that accepts the flag)

For example, if you were to start developing with on a new branch with [nothing in your development schema](/reference/node-selection/defer#usage), make an edit to a single model, and run `dbt build -s state:modified` you would see *just* that model run, with any ` {{ ref() }}` functions resolve to the production location of the reffed models!

### Defer in dbt Cloud CLI

One key difference between using `--defer` in the Cloud CLI vs the IDE is that defer is *automatically on by default for all invocations*, using artifacts from your production evironment to compare. You can pass the `--no-defer` flag to your dbt command to disable this behavior. This flag is unique to the dbt Cloud CLI only.

Cloud CLI offers additional flexibility for declaring which environment is used as the source of deferral artifacts. You can set a `defer-env-id` key in either your `dbt_project.yml` file or your `dbt_cloud.yml` file.

```yml
dever-env-id: '123456'
```

```yml
# in dbt_project.yml
dbt_cloud:
  dever-env-id: '123456'
```
