---
title: "Job triggers"
id: "job-triggers"
description: "You can use cron syntax to specify when you want to run a job."
---

### Overview

In dbt Cloud, you can use "cron" syntax to specify when you'd like your job to run. Cron syntax is very expressive, and allows you to completely customize your run schedule.

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
