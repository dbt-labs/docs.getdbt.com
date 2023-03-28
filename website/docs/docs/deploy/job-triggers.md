---
title: "Job triggers"
id: "job-triggers"
description: "You can configure when and how dbt should run your job"
---

In dbt Cloud, you can use the options under **Triggers** to configure when and how dbt should [run your job](/docs/deploy/job-triggers#schedule-job):

- **Schedule** tab &mdash; Use the **Run on schedule** toggle to configure your job to run on either [scheduled days](#schedule-days) or [custom cron-powered schedule](#custom-cron-schedule)
- **Continuous Integration (CI)** tab &mdash; Configure [continuous integration](/docs/deploy/cloud-ci-job) to run when someone opens a new pull request in your dbt repository
- **API** tab &mdash; Use the [API](/docs/dbt-cloud-apis/admin-cloud-api) to trigger a job or send events to other systems

<Lightbox src ="/img/docs/dbt-cloud/using-dbt-cloud/triggers.jpg" width="85%" title="Configuring your job triggers"/>

## Schedule jobs

To schedule your job to run at specific days, times, and intervals:
1. Go to the specific job settings, click **Edit**, then go to the **Triggers** section
2. Go to the **Schedule** tab, and toggle **Run on schedule**
3. Use either the [scheduled days](#schedule-days) or the [custom cron-powered schedule](#custom-cron-schedule) method to customize your desired days, times, and intervals.

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

To fully customize the scheduling of your job, choose the **Custom cron schedule** option and use the "cron" syntax. With this syntax, you can specify the minute, hour, day of the month, month, and day of the week, allowing you to set up complex schedules like running a job on the first Monday of each month.


<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/job-schedule.png" title="Schedule your dbt job"/>

Use tools such as [crontab.guru](https://crontab.guru/) to generate the correct cron syntax. This tool allows you to input cron snippets and returns their plain English translations.

Refer to the following example snippets:


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