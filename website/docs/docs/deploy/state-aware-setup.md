---
title: "Setting up state-aware orchestration"
sidebar_label: "Setting up state-aware"
description: "Set up state-aware orchestration to automatically determine which models to build by detecting changes in code or data every time a job runs." 
id: "state-aware-setup"
tags: ['scheduler']
---

# Setting up state-aware orchestration <Lifecycle status="beta,managed,managed_plus" />

<IntroText>

Set up state-aware orchestration to automatically determine which models to build by detecting changes in code or data and only building the changed models each time a job is run.

</IntroText>

import FusionBeta from '/snippets/_fusion-beta-callout.md';

<FusionBeta />

## Prerequisites

To use state-aware orchestration, make sure you meet these prerequisites:

- You must have a <Constant name="cloud" /> [Enterprise and Enterprise+ accounts](https://www.getdbt.com/signup/) and a [Developer seat license](/docs/cloud/manage-access/seats-and-users).
- You have updated the environment that will run state-aware orchestration to the dbt Fusion engine. For more information, refer to [Upgrading to dbt Fusion engine](/docs/dbt-versions/core-upgrade/upgrading-to-fusion).
- You must have a dbt project connected to a [data platform](/docs/cloud/connect-data-platform/about-connections).
- You must have [access permission](/docs/cloud/manage-access/about-user-access) to view, create, modify, or run jobs.
- You must set up a [deployment environment](/docs/deploy/deploy-environments). 
- (Optional) To customize behavior, you have configured your model or source data with [advanced configurations](#advanced-configurations).

:::info

State-aware orchestration is available for SQL models only. Python models are not supported.

:::

## Default settings

By default, for an Enterprise-tier account upgraded to the dbt Fusion engine, any newly created job will automatically be state-aware. Out of the box, without custom configurations, when you run a job, the job will only build models when either the code has changed, or there’s any new data in a source.

## Create a job

New jobs are state aware by default. If you have existing jobs, you need to unselect **Force node selection** in your job settings to make them state aware.

To create a state-aware job:

1. From your deployment environment page, click **Create job** and select **Deploy job**.
2. Options in the **Job settings** section:
    - **Job name**: Specify the name, for example, `Daily build`.
    - (Optional) **Description**: Provide a description of what the job does (for example, what the job consumes and what the job produces). 
    - **Environment**: By default, it’s set to the deployment environment you created the state-aware job from.
3. Options in the **Execution settings** and **Triggers** sections:
   
   **Note:** New jobs are state aware by default. For existing jobs, you need to uncheck **Force-node selection** under "execution settings" in the Job settings page.

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/example-triggers-section.png" width="90%" title="Example of Triggers on the Deploy Job page"/>

- **Execution settings** section:
     - **Commands**: By default, it includes the `dbt build` command. Click **Add command** to add more [commands](/docs/deploy/job-commands) that you want to be invoked when the job runs.
     - **Generate docs on run**: Enable this option if you want to [generate project docs](/docs/build/documentation) when this deploy job runs.
     - **Force node selection**: Enable this option only if you want to rebuild nodes every with every job run and to ignore data freshness. Disable (uncheck the box) to allow state-aware orchestration.
- **Triggers** section:
    - **Run on schedule**: Run the deploy job on a set schedule.
      - **Timing**: Specify whether to [schedule](#schedule-days) the deploy job using **Intervals** that run the job every specified number of hours, **Specific hours** that run the job at specific times of day, or **Cron schedule** that run the job specified using [cron syntax](#cron-schedule).
      - **Days of the week**: By default, it’s set to every day when **Intervals** or **Specific hours** is chosen for **Timing**.
    - **Run when another job finishes**: Run the deploy job when another _upstream_ deploy [job completes](#trigger-on-job-completion).  
        - **Project**: Specify the parent project that has that upstream deploy job. 
        - **Job**: Specify the upstream deploy job. 
        - **Completes on**: Select the job run status(es) that will [enqueue](/docs/deploy/job-scheduler#scheduler-queue) the deploy job.  

6. (Optional) Options in the **Advanced settings** section: 
    - **Environment variables**: Define [environment variables](/docs/build/environment-variables) to customize the behavior of your project when the deploy job runs.
    - **Target name**: Define the [target name](/docs/build/custom-target-names) to customize the behavior of your project when the deploy job runs. Environment variables and target names are often used interchangeably. 
    - **Run timeout**: Cancel the deploy job if the run time exceeds the timeout value. 
    - **Compare changes against**: By default, it’s set to **No deferral**. Select either **Environment** or **This Job** to let <Constant name="cloud" /> know what it should compare the changes against.  

You can see which models dbt builds in the run summary logs. Models that weren't rebuilt during the run will show **reusing** in the logs alongside the reason that dbt was able to skip building the model (and saving you unnecessary compute!)

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/SAO_logs_view.png" width="90%" title="Example logs for state-aware orchestration"/>

## Delete a job

import DeleteJob from '/snippets/_delete-job.md';

<DeleteJob/>

## Advanced configurations

By default, we use the warehouse metadata to check if sources (or upstream models in the case of Mesh) are fresh. For more advanced use cases, dbt provides other options that enable you to specify what gets run by state-aware orchestration. 

You can customize with:
- `loaded_at_field`: Specify a specific column to use from the data.
- `loaded_at_query`: Define a custom freshness condition in SQL to account for partial loading or streaming data.
:::note 
You can either define `loaded_at_field` or `loaded_at_query` but not both.
:::
You can also customize with:
- `updates_on`: Change the default from any to all so it doesn’t build unless all upstreams have fresh data reducing compute even more.
- `Build_after`: Don’t build a model more often than every x period to reduce build frequency when you need data less often than sources refresh.

To learn more about model freshness and build after, refer to [model `freshness` config](/reference/resource-configs/freshness). To learn more about source and upstream model freshness configs, refer to [resource `freshness` config](/reference/resource-properties/freshness)

## Customizing behavior

You can optionally configure state-aware orchestration when you want to fine-tune orchestration behavior for these reasons:

- **Defining source freshness:**

  By default, dbt uses metadata from the data warehouse. You can instead:
  * Specify a custom column and dbt will go to that column in the table instead
  * Specify a custom SQL statement to define what freshness means

  Not all source freshness is equal — especially with partial ingestion pipelines. You may want to delay a model build until your sources have received a larger volume of data or until a specific time window has passed.

  You can define what "fresh" means on a source-by-source basis using a custom freshness query. This lets you:
  - Add a time difference to account for late-arriving data
  - Delay freshness detection until a threshold is reached (for example, number of records or hours of data)

- **Reducing model build frequency**

  Some models don’t need to be rebuilt every time their source data is updated. To control this:
  - Set a refresh interval on models, folders, or the project to define how often they should be rebuilt at most
  - This helps avoid overbuilding and reduces costs by only running what's really needed

- **Changing the default from `any` to `all`**

  Based on what a model depends on upstream, you may want to wait until all upstream models have been refreshed rather than going as soon as there is any new data.
  - Change what orchestration waits on from any to all for models, folders, or the project to wait until all upstream models have new data
  - This helps avoid overbuilding and reduces costs by building models once everything has been refreshed

  To configure and customize behavior, you can do so in the following places using the `build_after` config:
  - `dbt_project.yml` at the project level in YAML
  - `model/properties.yml` at the model level in YAML
  - `model/model.sql` at the model level in SQL
These configurations are powerful because you can define a sensible default at the project level or for specific model folders, and override it for individual models or model groups that require more frequent updates.
## Example

Let's use an example to illustrate how to customize our project so a model and its parent model are rebuilt only if they haven't been refreshed in the past 4 hours &mdash; even if a job runs more frequently than that.

A Jaffle shop has recently expanded globally and wanted to make savings. To reduce spend, they found out about <Constant name="cloud" />'s state-aware orchestration and want to rebuild models only when needed. Maggie &mdash; the analytics engineer &mdash; wants to configure her dbt `jaffle_shop` project to only rebuild certain models if they haven't been refreshed in the last 4 hours, even if a job runs more often than that. 

To do this, she uses the model `freshness` config. This config helps state-aware orchestration decide _when_ a model should be rebuilt. 

Note that for every `freshness` config, you're required to either set values for both `count` and `period`, or set `freshness: null`. This requirement applies to all `freshness` types: `freshness.warn_after`, `freshness.error_after`, and `freshness.build_after`.

Refer to the following samples for using the `freshness` config in the model file, in the project file, and in the `config` block of the `model.sql` file:

<Tabs>
<TabItem value="project" label="Model YAML">

<File name="models/model.yml">

```yaml
models:
  - name: dim_wizards
    config:
      freshness: 
        build_after:
          count: 4         # how long to wait before rebuilding
          period: hour     # unit of time
          updates_on: all  # only rebuild if all upstream dependencies have new data
  - name: dim_worlds
    config:
      freshness:
        build_after:
          count: 4
          period: hour
          updates_on: all
```
</File>

</TabItem>
<TabItem value="yml" label="Project file">

<File name="dbt_project.yml">
  
```yaml
models:
  [<resource-path>](/reference/resource-configs/resource-path):
    [+](/reference/resource-configs/plus-prefix)[freshness](/reference/resource-properties/freshness):
      build_after: 
        count: 4
        period: hour
        updates_on: all 
```
</File>

</TabItem>
<TabItem value="sql" label="Config block">

<File name="models/<filename>.sql">
  
```jinja
{{
    config(
        freshness={
            "build_after": {
                "count": 4,
                "period": "hour",
                "updates_on": "all"
            }
        }
    )
}}
```

</File>
</TabItem>
</Tabs>

With this config, dbt:

- Checks if there's new data in the upstream sources
- Checks when `dim_wizards` and `dim_worlds` were last built

If any new data is available _and_ at least 4 hours have passed, <Constant name="cloud" /> rebuilds the models.



### Differences between `all` and `any`

- Since Maggie configured `updates_on: all`, this means _both_ models must have new upstream data to trigger a rebuild. If only one model has fresh data and the other doesn't, nothing is built -- which will massively reduce unnecessary compute costs and save time.

- If Maggie wanted these models to rebuild more often (for example, if _any_ upstream source has new data), she would then use `updates_on: any` instead:

<File name="models/model.yml">

```yaml
    freshness:
      build_after:
        count: 1
        period: hour
        updates_on: any
```
</File>

This way, if either `dim_wizards` or `dim_worlds` has fresh upstream data and enough time passed, dbt rebuilds the models. This method helps when the need for fresher data outweighs the costs. 

## Related docs

- [State-aware orchestration configuration](/docs/deploy/state-aware-about)
- [Artifacts](/docs/deploy/artifacts)
- [Continuous integration (CI) jobs](/docs/deploy/ci-jobs)
- [`freshness`](/reference/resource-configs/freshness)
