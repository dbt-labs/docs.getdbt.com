---
title: "Webhooks"
description: "Get notifications about your dbt jobs with webhooks."
---

With dbt Cloud, you can set up outbound webhooks to send events (notifications) about your dbt jobs to your other systems. You can listen to these events on your other systems to further automate your workflows or to help trigger automation flows you have set up. 

A webhook is an HTTP-based callback function that allows event-driven communication between two different web applications. This allows you to get the latest information on your data in real time. Without it, you would need to make API calls repeatedly to check if there are any data updates that you need to account for (polling). Because of this, webhooks are also called _push APIs_ or _reverse APIs_ and often used for infrastructure development. 

Currently, dbt Labs installs webhooks at the account level, not at the project or job level; though, we might add support for that in the future. When a webhook is triggered, dbt Cloud sends a JSON payload to the URL you specified. You can send a Slack notification, open a PagerDuty incident when a dbt job fails, and more. You can set up webhooks for these events:

- `job.run.started` &mdash; Run is started.
- `job.run.canceled` &mdash; Run is canceled.
- `job.run.completed` &mdash; Run is completed. This can be a run that has failed, errored, or succeeded.

## Create a webhook
To create a webhook, you simply navigate to a dedicated UI in account settings. There, you can:

- Add the name of your webhook
- Select which events should be part of the webhook (multi-select available) 
- Specify the endpoint to which you will send the webhook

You will also be given a secret token for authentication. If you wish to secure your webhooks, you will need to set up your secret token on your server.

We will retry sending each webhook event five times. Every webhook has its own **Recent Deliveries** section, which lists, at a glance, whether a delivery was successful or failed. You can also identify when each delivery was attempted. dbt Cloud keeps a log of each webhook delivery for 30 days.

## Examples of JSON payloads

An example of a webhook payload for a run that's started:

```json
{
    "account_id": 123,
    "event_id": "231321foisdjfiods",
    "timestamp": "2022-05-02 12:42:31", 
    "event_type": "job.run.started",
    "data": {
       "run_reason": "job_scheduled",
       "job_id": "2",
       "job_name": "test-job",
       "run_id": "109281092812",
       "environment_id": "121221",
       "environment_name": "development",
       "run_started_at": "2022-05-02 10:41:31",
       "webhook_name": "My Account Run Events Webhook",
       "dbt_version": "1.0.0",
       "project_name": "My New Project"
    }
}

```

An example of a webhook payload for a run that's been canceled:

```json
{
    "account_id": 123,
    "event_id": "231321foisdjfiods",
    "timestamp": "2022-05-02 12:42:31", 
    "event_type": "job.run.canceled",
    "data": {
       "run_reason": "job_scheduled",
       "job_id": "2",
       "job_name": "test-job",
       "run_id": "109281092812",
       "environment_id": "121221",
       "environment_name": "development",
       "run_started_at": "2022-05-02 10:41:31",
       "run_canceled_at": "2022-05-02 10:42:31",
       "webhook_name": "My Account Run Events Webhook",
       "dbt_version": "1.0.0",
       "project_name": "My New Project"
    }
}
```

An example of a webhook payload for a run that's been completed:

```json
{
    "account_id": 123,
    "event_id": "231321foisdjfiods",
    "timestamp": "2022-05-02 12:42:31", 
    "event_type": "job.run.completed",
    "data": {
       "run_reason": "job_scheduled",
       "job_id": "2",
       "job_name": "test-job",
       "run_id": "109281092812",
       "environment_id": "121221",
       "environment_name": "development",
       "run_started_at": "2022-05-02 10:41:31",
       "run_finished_at": "2022-05-02 10:42:31",
       "run_status": "complete",
       "webhook_name": "My Account Run Events Webhook",
       "dbt_version": "1.0.0",
       "project_name": "My New Project"
    }
}

```

## Related docs 
- [dbt Cloud CI job](/docs/deploy/cloud-ci-job)