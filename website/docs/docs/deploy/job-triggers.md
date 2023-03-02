---
title: "Job triggers"
id: "job-triggers"
description: "You can use cron syntax to specify when you want to run a job."
---

In dbt Cloud, you can configure when and how dbt should trigger your job run. 

- **Schedule** tab &mdash; Use the **Run on schedule** toggle to configure your job to run on scheduled days and time, or enter a [custom cron schedule](#cron)
- **Continuous Integration** tab &mdash; Configure [continuous integration (CI)](/docs/deploy/cloud-ci-job) to run when someone opens a new pull request in your dbt repository
- **API** tab &mdash; Use the [API](/docs/dbt-cloud-apis/overview) to trigger a job or send events to other systems

<Lightbox src ="/img/docs/dbt-cloud/using-dbt-cloud/triggers.jpg" title="Configuring your job triggers"/>

## Schedule

To configure your job to run on particular day(s) and time, you can toggle the **Run on schedule** toggle and customize the days, time, and intervals you want your job to run.

Under **Timing**, you can configure your job to run either at customizable hours hours or exact intervals. 

If you've selected to run your job at exact intervals, dbt Cloud uses [coordinated universal time](https://en.wikipedia.org/wiki/Coordinated_Universal_Time). For examples:

- 0 means 12am (midnight) UTC
- 12 means 12pm (afternoon) UTC
- 23 means 11pm UTC

## Cron

Cron syntax is very expressive, and allows you to completely customize your run schedule.

If you need help coming up with the right cron syntax, we recommend using a tool like `crontab.guru`. There, you can enter cron snippets and see what they mean in plain English. You can also find some example snippets below.

### Examples

- `0 * * * *`: Every hour, at minute 0
- `*/5 * * * *`: Every 5 minutes
- `5 4 * * *`: At exactly 4:05 AM UTC
- `30 */4 * * *`: At minute 30 past every 4th hour (e.g. 4:30AM, 8:30AM, 12:30PM, etc., all UTC)
- `0 0 */2 * *`: At midnight UTC every other day
- `0 0 * * 1`: At midnight UTC every Monday.

A custom cron schedule can be specified in the Job Settings page when you edit a job:

1. Select a job.
2. Click **Settings**.
3. Click **Edit**.
4. In the Triggers section, activate the **Run on schedule** option.
5. Select **Enter custom cron schedule**.
6. Enter the custom cron syntax for the schedule you want.

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/job-schedule.png" title="Schedule your dbt job"/>

THE BELOW IS JUST COPIED OVER TEXT - WILL AMEND SOON!

6. Select **Save**, then click **Run Now** to run your job. Click the run and watch its progress under "Run history." 

## Related docs


- [Webhooks for your jobs](/docs/deploy/webhooks)
- [Source freshness](/docs/deploy/source-freshness)
- [Artifacts](/docs/deploy/artifacts)
- [Build and view your docs with dbt Cloud](/docs/collaborate/build-and-view-your-docs)
