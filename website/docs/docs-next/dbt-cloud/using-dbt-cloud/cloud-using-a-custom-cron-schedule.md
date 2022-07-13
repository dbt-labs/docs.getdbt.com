---
title: "Custom cron schedules"
id: "cloud-using-a-custom-cron-schedule"
description: "You can use cron syntax to specify when you want to run a job."
---

### Overview
In dbt Cloud, you can use "cron" syntax to specify when you'd like your job to run. Cron syntax is very expressive, and allows you to completely customize your run schedule.

If you need help coming up with the right cron syntax, we recommend using a tool like crontab.guru. There, you can enter cron snippets and see what they mean in plain english. You can also find some example snippets below.

### Examples

- `0 * * * *`: Every hour, at minute 0
- `*/5 * * * *`: Every 5 minutes
- `5 4 * * *`: At exactly 4:05 AM UTC
- `30 */4 * * *`: At minute 30 past every 4th hour (e.g. 4:30AM, 8:30AM, 12:30PM, etc., all UTC)
- `0 0 */2 * *`: At midnight UTC every other day
- `0 0 * * 1`: At midnight UTC every Monday.

A custom cron schedule can be specified in the Triggers section of the Job Settings page.

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/d43d5e6-job-schedule.gif" title="Select 'custom cron schedule' to supply a cron schedule for your dbt job."/>
