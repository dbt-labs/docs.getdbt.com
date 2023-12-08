---
title: "Deploy jobs"
description: "Learn how to create and schedule deploy jobs in dbt Cloud for the scheduler to run. When you run with dbt Cloud, you get built-in observability, logging, and alerting." 
tags: [scheduler]
---

You can use deploy jobs to build production data assets. Deploy jobs make it easy to run dbt commands against a project in your cloud data platform, triggered either by schedule or events. Each job run in dbt Cloud will have an entry in the job's run history and a detailed run overview, which provides you with:

- Job trigger type
- Commit SHA
- Environment name
- Sources and documentation info, if applicable
- Job run details, including run timing, [model timing data](#model-timing), and [artifacts](/docs/deploy/artifacts)
- Detailed run steps with logs and their run step statuses

You can create a deploy job and configure it to run on [scheduled days and times](#schedule-days) or enter a [custom cron schedule](#custom-cron-schedules). 


## Prerequisites

- You must have a dbt Cloud account and [Developer seat license](/docs/cloud/manage-access/seats-and-users). If you don't, you can [sign up](https://www.getdbt.com/signup/) for a [free account](https://www.getdbt.com/pricing/). 
- You must have a dbt project connected to a [data platform](/docs/cloud/connect-data-platform/about-connections).
- You must have [access permission](/docs/cloud/manage-access/about-user-access) to view, create, modify, or run jobs.
- You must set up a [deployment environment](/docs/deploy/deploy-environments). 

## Create and schedule jobs {#create-and-schedule-jobs}

1. On your deployment environment page, click **Create Job** > **Deploy Job** to create a new deploy job. 
2. Options in the **Job Description** section:
    - **Job Name** &mdash; Specify the name for the deploy job. For example, `Daily build`.
    - **Environment** &mdash;  By default, it’s set to the deployment environment you created the deploy job from.
3. Options in the **Execution Settings** section:
    - **Commands** &mdash; By default, it includes the `dbt build` command. Click **Add command** to add more [commands](/docs/deploy/job-commands) that you want to be invoked when the job runs.
    - **Generate docs on run** &mdash; Enable this option if you want to [generate project docs](/docs/collaborate/build-and-view-your-docs) when this deploy job runs.
    - **Run source freshness** &mdash; Enable this option to invoke the `dbt source freshness` command before running the deploy job. Refer to [Source freshness](/docs/deploy/source-freshness) for more details.
4. Options in the **Schedule** section:
    - **Run on schedule** &mdash; Enable this option to run the deploy job on a set schedule.
    - **Timing** &mdash; Specify whether to [schedule](#schedule-days) the deploy job using **Frequency** that runs the job at specific times of day, **Specific Intervals** that runs the job every specified number of hours, or **Cron Schedule** that runs the job specified using [cron syntax](#custom-cron-schedule).
    - **Days of the Week** &mdash; By default, it’s set to every day when **Frequency** or **Specific Intervals** is chosen for **Timing**.

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/create-deploy-job.png" width="90%" title="Example of Deploy Job page in dbt Cloud UI"/>

5. (optional) Options in the **Advanced Settings** section: 
    - **Environment Variables** &mdash; Define [environment variables](/docs/build/environment-variables) to customize the behavior of your project when the deploy job runs.
    - **Target Name** &mdash; Define the [target name](/docs/build/custom-target-names) to customize the behavior of your project when the deploy job runs. Environment variables and target names are often used interchangeably. 
    - **Run Timeout** &mdash; Cancel the deploy job if the run time exceeds the timeout value. 
    - **Compare changes against** &mdash; By default, it’s set to **No deferral**. Select either **Environment** or **This Job** to let dbt Cloud know what it should compare the changes against.  

    :::info
    Older versions of dbt Cloud only allow you to defer to a specific job instead of an environment. Deferral to a job compares state against the project code that was run in the deferred job's last successful run. While deferral to an environment is more efficient as dbt Cloud will compare against the project representation (which is stored in the `manifest.json`) of the last successful deploy job run that executed in the deferred environment. By considering _all_ deploy jobs that run in the deferred environment, dbt Cloud will get a more accurate, latest project representation state.
    :::

    - **dbt Version** &mdash; By default, it’s set to inherit the [dbt version](/docs/dbt-versions/core) from the environment. dbt Labs strongly recommends that you don't change the default setting. This option to change the version at the job level is useful only when you upgrade a project to the next dbt version; otherwise, mismatched versions between the environment and job can lead to confusing behavior. 
    - **Threads** &mdash; By default, it’s set to 4 [threads](/docs/core/connect-data-platform/connection-profiles#understanding-threads). Increase the thread count to increase model execution concurrency.

    <Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/deploy-job-adv-settings.png" width="90%" title="Example of Advanced Settings on Deploy Job page"/>

### Schedule days

To set your job's schedule, use the **Schedule Days** option to choose specific days of the week, and select customized hours or intervals.

Under **Timing**, you can either use customizable hours for jobs that need to run frequently throughout the day or exact intervals for jobs that need to run at specific times:

- **Every n hours** &mdash; Use this option to set how often your job runs, in hours. Enter a number between 1 and 23 to represent the interval between job runs. For example, if you set it to "every 2 hours", the job will run every 2 hours from midnight UTC. This option is useful if you need to run jobs multiple times per day at regular intervals.

- **At exact intervals** &mdash; Use this option to set specific times when your job should run. You can enter a comma-separated list of hours (in UTC) when you want the job to run. For example, if you set it to `0,12,23,` the job will run at midnight, noon, and 11 PM UTC. This option is useful if you want your jobs to run at specific times of day and don't need them to run more frequently than once a day.

:::info

dbt Cloud uses [Coordinated Universal Time](https://en.wikipedia.org/wiki/Coordinated_Universal_Time) (UTC) and does not account for translations to your specific timezone or take into consideration daylight savings time. For example:

- 0 means 12am (midnight) UTC
- 12 means 12pm (afternoon) UTC
- 23 means 11pm UTC

:::

### Custom cron schedule

To fully customize the scheduling of your job, choose the **Custom cron schedule** option and use the cron syntax. With this syntax, you can specify the minute, hour, day of the month, month, and day of the week, allowing you to set up complex schedules like running a job on the first Monday of each month.


<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/job-schedule.png" title="Schedule your dbt job"/>

Use tools such as [crontab.guru](https://crontab.guru/) to generate the correct cron syntax. This tool allows you to input cron snippets and returns their plain English translations.

Refer to the following example snippets:


- `0 * * * *`: Every hour, at minute 0.
- `*/5 * * * *`: Every 5 minutes.
- `5 4 * * *`: At exactly 4:05 AM UTC.
- `30 */4 * * *`: At minute 30 past every 4th hour (e.g. 4:30AM, 8:30AM, 12:30PM, etc., all UTC).
- `0 0 */2 * *`: At midnight UTC every other day.
- `0 0 * * 1`: At midnight UTC every Monday.
- `0 0 L * *`: At 12:00 AM, on the last day of the month.
- `0 0 L 1,2,3,4,5,6,8,9,10,11,12 *`: At 12:00 AM, on the last day of the month, only in January, February, March, April, May, June, August, September, October, November, and December.
- `0 0 L 7 *`: At 12:00 AM, on the last day of the month, only in July.
- `0 0 L * FRI,SAT`: At 12:00 AM, on the last day of the month, and on Friday and Saturday.
- `0 12 L * *`: At 12:00 PM, on the last day of the month.
- `0 7 L * 5`: At 07:00 AM, on the last day of the month, and on Friday.
- `30 14 L * *`: At 02:30 PM, on the last day of the month.

## Related docs

- [Artifacts](/docs/deploy/artifacts)
- [Continuous integration (CI) jobs](/docs/deploy/ci-jobs)
- [Webhooks](/docs/deploy/webhooks)
