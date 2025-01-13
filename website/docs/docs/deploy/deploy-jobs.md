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
- Job run details, including run timing, [model timing data](/docs/deploy/run-visibility#model-timing), and [artifacts](/docs/deploy/artifacts)
- Detailed run steps with logs and their run step statuses

You can create a deploy job and configure it to run on [scheduled days and times](#schedule-days), enter a [custom cron schedule](#cron-schedule), or [trigger the job after another job completes](#trigger-on-job-completion).


## Prerequisites

- You must have a [dbt Cloud account](https://www.getdbt.com/signup/) and [Developer seat license](/docs/cloud/manage-access/seats-and-users).
    - For the [Trigger on job completion](#trigger-on-job-completion) feature, your dbt Cloud account must be on the [Team or Enterprise plan](https://www.getdbt.com/pricing/).
- You must have a dbt project connected to a [data platform](/docs/cloud/connect-data-platform/about-connections).
- You must have [access permission](/docs/cloud/manage-access/about-user-access) to view, create, modify, or run jobs.
- You must set up a [deployment environment](/docs/deploy/deploy-environments). 

## Create and schedule jobs {#create-and-schedule-jobs}

1. On your deployment environment page, click **Create job** > **Deploy job** to create a new deploy job. 
2. Options in the **Job settings** section:
    - **Job name** &mdash; Specify the name for the deploy job. For example, `Daily build`.
    - (Optional) **Description** &mdash; Provide a description of what the job does (for example, what the job consumes and what the job produces). 
    - **Environment** &mdash;  By default, it’s set to the deployment environment you created the deploy job from.
3. Options in the **Execution settings** section:
    - **Commands** &mdash; By default, it includes the `dbt build` command. Click **Add command** to add more [commands](/docs/deploy/job-commands) that you want to be invoked when the job runs.
    - **Generate docs on run** &mdash; Enable this option if you want to [generate project docs](/docs/collaborate/build-and-view-your-docs) when this deploy job runs.
    - **Run source freshness** &mdash; Enable this option to invoke the `dbt source freshness` command before running the deploy job. Refer to [Source freshness](/docs/deploy/source-freshness) for more details.
4. Options in the **Triggers** section:
    - **Run on schedule** &mdash; Run the deploy job on a set schedule.
        - **Timing** &mdash; Specify whether to [schedule](#schedule-days) the deploy job using **Intervals** that run the job every specified number of hours, **Specific hours** that run the job at specific times of day, or **Cron schedule** that run the job specified using [cron syntax](#cron-schedule).
        - **Days of the week** &mdash; By default, it’s set to every day when **Intervals** or **Specific hours** is chosen for **Timing**.
    - **Run when another job finishes** &mdash; Run the deploy job when another _upstream_ deploy [job completes](#trigger-on-job-completion).  
        - **Project** &mdash; Specify the parent project that has that upstream deploy job. 
        - **Job** &mdash; Specify the upstream deploy job. 
        - **Completes on** &mdash; Select the job run status(es) that will [enqueue](/docs/deploy/job-scheduler#scheduler-queue) the deploy job.  

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/example-triggers-section.png" width="90%" title="Example of Triggers on the Deploy Job page"/>

5. (Optional) Options in the **Advanced settings** section: 
    - **Environment variables** &mdash; Define [environment variables](/docs/build/environment-variables) to customize the behavior of your project when the deploy job runs.
    - **Target name** &mdash; Define the [target name](/docs/build/custom-target-names) to customize the behavior of your project when the deploy job runs. Environment variables and target names are often used interchangeably. 
    - **Run timeout** &mdash; Cancel the deploy job if the run time exceeds the timeout value. 
    - **Compare changes against** &mdash; By default, it’s set to **No deferral**. Select either **Environment** or **This Job** to let dbt Cloud know what it should compare the changes against.  

    :::info
    Older versions of dbt Cloud only allow you to defer to a specific job instead of an environment. Deferral to a job compares state against the project code that was run in the deferred job's last successful run. While deferral to an environment is more efficient as dbt Cloud will compare against the project representation (which is stored in the `manifest.json`) of the last successful deploy job run that executed in the deferred environment. By considering _all_ deploy jobs that run in the deferred environment, dbt Cloud will get a more accurate, latest project representation state.
    :::

    - **dbt version** &mdash; By default, it’s set to inherit the [dbt version](/docs/dbt-versions/core) from the environment. dbt Labs strongly recommends that you don't change the default setting. This option to change the version at the job level is useful only when you upgrade a project to the next dbt version; otherwise, mismatched versions between the environment and job can lead to confusing behavior. 
    - **Threads** &mdash; By default, it’s set to 4 [threads](/docs/core/connect-data-platform/connection-profiles#understanding-threads). Increase the thread count to increase model execution concurrency.

    <Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/deploy-job-adv-settings.png" width="90%" title="Example of Advanced Settings on the Deploy Job page"/>

### Schedule days

To set your job's schedule, use the **Run on schedule** option to choose specific days of the week, and select customized hours or intervals.

Under **Timing**, you can either use regular intervals for jobs that need to run frequently throughout the day or customizable hours for jobs that need to run at specific times:

- **Intervals** &mdash; Use this option to set how often your job runs, in hours. For example, if you choose **Every 2 hours**, the job will run every 2 hours from midnight UTC. This doesn't mean that it will run at exactly midnight UTC. However, subsequent runs will always be run with the same amount of time between them. For example, if the previous scheduled pipeline ran at 00:04 UTC, the next run will be at 02:04 UTC. This option is useful if you need to run jobs multiple times per day at regular intervals.

- **Specific hours** &mdash; Use this option to set specific times when your job should run. You can enter a comma-separated list of hours (in UTC) when you want the job to run. For example, if you set it to `0,12,23,` the job will run at midnight, noon, and 11 PM UTC. Job runs will always be consistent between both hours and days, so if your job runs at 00:05, 12:05, and 23:05 UTC, it will run at these same hours each day. This option is useful if you want your jobs to run at specific times of day and don't need them to run more frequently than once a day.


:::info

dbt Cloud uses [Coordinated Universal Time](https://en.wikipedia.org/wiki/Coordinated_Universal_Time) (UTC) and does not account for translations to your specific timezone or take into consideration daylight savings time. For example:

- 0 means 12am (midnight) UTC
- 12 means 12pm (afternoon) UTC
- 23 means 11pm UTC

:::

### Cron schedule

To fully customize the scheduling of your job, choose the **Cron schedule** option and use cron syntax. With this syntax, you can specify the minute, hour, day of the month, month, and day of the week, allowing you to set up complex schedules like running a job on the first Monday of each month.

**Cron frequency**

To enhance performance, job scheduling frequencies vary by dbt Cloud plan:

- Developer plans: dbt Cloud sets a minimum interval of every 10 minutes for scheduling jobs. This means scheduling jobs to run more frequently, or at less than 10 minute intervals, is not supported.
- Team and Enterprise plans: No restrictions on job execution frequency.

**Examples**

Use tools such as [crontab.guru](https://crontab.guru/) to generate the correct cron syntax. This tool allows you to input cron snippets and return their plain English translations. The dbt Cloud job scheduler supports using `L` to schedule jobs on the last day of the month.

Examples of cron job schedules:

- `0 * * * *`: Every hour, at minute 0.
- `*/5 * * * *`: Every 5 minutes. (Not available on Developer plans)
- `5 4 * * *`: At exactly 4:05 AM UTC.
- `30 */4 * * *`: At minute 30 past every 4th hour (such as 4:30 AM, 8:30 AM, 12:30 PM, and so on, all UTC).
- `0 0 */2 * *`: At 12:00 AM (midnight) UTC every other day.
- `0 0 * * 1`: At midnight UTC every Monday.
- `0 0 L * *`: At 12:00 AM (midnight), on the last day of the month.
- `0 0 L 1,2,3,4,5,6,8,9,10,11,12 *`: At 12:00 AM, on the last day of the month, only in January, February, March, April, May, June, August, September, October, November, and December.
- `0 0 L 7 *`: At 12:00 AM, on the last day of the month, only in July.
- `0 0 L * FRI,SAT`: At 12:00 AM, on the last day of the month, and on Friday and Saturday.
- `0 12 L * *`: At 12:00 PM (afternoon), on the last day of the month.
- `0 7 L * 5`: At 07:00 AM, on the last day of the month, and on Friday.
- `30 14 L * *`: At 02:30 PM, on the last day of the month.

### Trigger on job completion  <Lifecycle status="team,enterprise" />

To _chain_ deploy jobs together:
1. In the **Triggers** section, enable the **Run when another job finishes** option.
2. Select the project that has the deploy job you want to run after completion.
3. Specify the upstream (parent) job that, when completed, will trigger your job.
   - You can also use the [Create Job API](/dbt-cloud/api-v2#/operations/Create%20Job) to do this.
4. In the **Completes on** option, select the job run status(es) that will [enqueue](/docs/deploy/job-scheduler#scheduler-queue) the deploy job.

<Lightbox src="/img/docs/deploy/deploy-job-completion.jpg" width="100%" title="Example of Trigger on job completion on the Deploy job page"/>

5. You can set up a configuration where an upstream job triggers multiple downstream (child) jobs and jobs in other projects. You must have proper [permissions](/docs/cloud/manage-access/enterprise-permissions#project-role-permissions) to the project and job to configure the trigger. 

If another job triggers your job to run, you can find a link to the upstream job in the [run details section](/docs/deploy/run-visibility#job-run-details).

## Delete a job

import DeleteJob from '/snippets/_delete-job.md';

<DeleteJob/>

## Related docs

- [Artifacts](/docs/deploy/artifacts)
- [Continuous integration (CI) jobs](/docs/deploy/ci-jobs)
- [Webhooks](/docs/deploy/webhooks)
