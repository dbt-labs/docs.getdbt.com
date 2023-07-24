---
title: "Job settings"
description: "Learn how to create and schedule jobs in dbt Cloud for the scheduler to run. Jobs help you build observability into transformation workflows with the in-app scheduling, logging, and alerting." 
tags: [scheduler]
---

Jobs make it easy to run dbt commands against a project in your cloud data platform, triggered either by schedule or events. Each job run in dbt Cloud will have a run history, run status, and a run overview, which provides you with:

- Job trigger type
- Commit SHA
- Environment name
- Sources and documentation info 
- Job run details, including run timing, [model timing data](#model-timing), and [artifacts](/docs/deploy/artifacts)
- Detailed run steps with logs and their statuses

You can create a job and configure it to run on [scheduled days and times](/docs/deploy/job-triggers#schedule-days) or enter a [custom cron schedule](/docs/deploy/job-triggers#custom-cron-schedules). 

## Prerequisites

- You must have a dbt Cloud account and [Developer seat license](/docs/cloud/manage-access/seats-and-users). If you don't, you can [sign up](https://www.getdbt.com/signup/) for a [free account](https://www.getdbt.com/pricing/). 
- You must have a dbt project connected to a [data platform](/docs/cloud/connect-data-platform/about-connections).
- You must [create and schedule a dbt Cloud job](#create-and-schedule-jobs).
- You must have [access permission](/docs/cloud/manage-access/about-user-access) to view, create, modify, or run jobs.
- You must set up a [deployment environment](/docs/deploy/deploy-environments). 

## Create and schedule jobs {#create-and-schedule-jobs}

1. Create a new job by clicking **Deploy** in the header, click **Jobs** and then **Create job**.
1. Provide a job name, for example "Hourly Customer Job". 
1. Under **Environment**, add the following:
    * **Environment** &mdash; Link to an existing deployment environment.
    * **dbt Version** &mdash; Select the dbt [version](/docs/dbt-versions/core). dbt Labs recommends inheriting the version from the environment settings.
    * **Target Name** &mdash; Define the [target name](/docs/build/custom-target-names) for any dbt cloud job to correspond to settings in your project.
    * **Threads** &mdash; The default value is 4 [threads](/docs/core/connect-data-platform/connection-profiles#understanding-threads). Increase the thread count to increase model execution concurrency. 

1. Define [environment variables](/docs/build/environment-variables) if you want to customize the behavior of your project.

<Lightbox src ="/img/docs/dbt-cloud/using-dbt-cloud/create-new-job.jpg" width="85%" title="Configuring your environment job settings"/>

5. Under **Execution Settings**, you can configure the fields needed to execute your job:

    * **Run Timeout** &mdash; Configure the number of seconds a run will execute before dbt Cloud cancels it. Setting this to 0 means it'll never time out runs for that job.   
    * **Defer to a previous run state** &mdash; Select a production job you want to defer to. This enables dbt Cloud to examine the artifacts from the most recent, successful run of that deferred job, enabling state comparison and rewiring of upstream dependencies to any model that doesn’t exist in the current run's schema. 
    * **Generate docs on run** checkbox &mdash; Configure the job to automatically [generate project docs](/docs/collaborate/build-and-view-your-docs) each time this job runs.
    * **Run on source freshness** checkbox &mdash;  Configure [dbt source freshness](/docs/deploy/source-freshness) as the first step of the job without breaking subsequent steps.
    * **Commands** &mdash; Add or remove [job commands](/docs/deploy/job-commands), which are specific tasks you set in your dbt Cloud jobs.

<Lightbox src ="/img/docs/dbt-cloud/using-dbt-cloud/execution-settings.jpg" width="85%" title="Configuring your execution job settings"/>

6. Under the **Triggers** section, you can configure when and how dbt will trigger the job. Refer to [job triggers](/docs/deploy/job-triggers) for more details.

    * **Schedule** tab &mdash; Use the **Run on schedule** toggle to configure your job to run on [scheduled](/docs/deploy/job-triggers#schedule-days) days and time, or enter a [custom cron schedule](/docs/deploy/job-triggers#custom-cron-schedules).
    * **Continuous Integration** tab &mdash; Configure [continuous integration (CI)](/docs/deploy/continuous-integration) to run when someone opens a new pull request in your dbt repository.
    * **API** tab &mdash; Use the [dbt API](/docs/dbt-cloud-apis/overview) to trigger a job.

<Lightbox src ="/img/docs/dbt-cloud/using-dbt-cloud/triggers.jpg" width="85%" title="Configuring your job triggers"/>

7. Select **Save**, then click **Run Now** to run your job. Click the run and watch its progress under **Run history**.

### Schedule days

You can schedule which days of the week and specify customized hours or intervals to run your deploy job with the option **Exact intervals** or **Intervals**. 

- **Exact Intervals** &mdash; Use this option to set specific times when your job should run. You can enter a comma-separated list of hours (in UTC) when you want the job to run. For example, if you set it to `0,12,23,` the job will run at midnight, noon, and 11 PM UTC. This option is useful if you want your jobs to run at specific times of day and don't need them to run more frequently than once a day.

- **Intervals** &mdash; Use this option to set how often your job runs, in hours. Enter a number between 1 and 23 to represent the interval between job runs. For example, if you set it to **Every 2 hours**, the job will run every 2 hours from midnight UTC. This option is useful if you need to run jobs multiple times per day at regular intervals.


:::info

dbt Cloud uses [Coordinated Universal Time](https://en.wikipedia.org/wiki/Coordinated_Universal_Time) (UTC) and does not account for translations to your specific timezone or take into consideration daylight savings time. For example:

- 0 means 12am (midnight) UTC
- 12 means 12pm (afternoon) UTC
- 23 means 11pm UTC

:::

### Custom cron schedule

You can fully customize the scheduling of your job with the **Enter custom cron schedule** option. Using cron syntax, you can specify the minute, hour, day of the month, month, and day of the week, allowing you to set up complex schedules like running a job on the first Monday of each month.

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/job-schedule.png" title="Schedule your dbt job"/>

Use tools such as [crontab.guru](https://crontab.guru/) to generate the correct cron syntax. This tool allows you to input cron snippets and returns their plain English translations.

Some examples are:

- `0 * * * *`: Every hour, at minute 0
- `*/5 * * * *`: Every 5 minutes
- `5 4 * * *`: At exactly 4:05 AM UTC
- `30 */4 * * *`: At minute 30 past every 4th hour (e.g. 4:30AM, 8:30AM, 12:30PM, etc., all UTC)
- `0 0 */2 * *`: At midnight UTC every other day
- `0 0 * * 1`: At midnight UTC every Monday.


## Related docs

- [Artifacts](/docs/deploy/artifacts)
- [Build and view your docs with dbt Cloud](/docs/collaborate/build-and-view-your-docs)
- [Source freshness](/docs/deploy/source-freshness)
- [Job commands](/docs/deploy/job-commands)
- [Webhooks for your jobs](/docs/deploy/webhooks)