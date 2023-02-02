---
title: "Webhooks for your jobs"
description: "Get notifications about your dbt jobs with webhooks."
---

With dbt Cloud, you can create outbound webhooks to send events (notifications) about your dbt jobs to your other systems. Your other systems can listen for these events to further automate your workflows or to help trigger automation flows you have set up.

A webhook is an HTTP-based callback function that allows event-driven communication between two different web applications. This allows you to get the latest information on your dbt jobs in real time. Without it, you would need to make API calls repeatedly to check if there are any updates that you need to account for (polling). Because of this, webhooks are also called _push APIs_ or _reverse APIs_ and are often used for infrastructure development.

dbt Cloud sends a JSON payload to the endpoint URL you specify when your webhook is triggered. You can send a Slack notification, open a PagerDuty incident when a dbt job fails, and more. 

You can create webhooks for these events:

- `job.run.started` &mdash; Run started.
- `job.run.completed` &mdash; Run completed. This can be a run that has failed or succeeded.
- `job.run.errored` &mdash; Run errored.

:::tip Join our private beta!

Access to webhooks in dbt Cloud is currently limited to beta users. If you want to try it out, please [sign up](https://docs.google.com/forms/u/1/d/e/1FAIpQLScmSH5GhFKq1L0vp1nhzF4zapIEtFX4ViRoUiTbTEqkScgqTA/viewform) for the private beta. After you sign up, a Product Manager from dbt Labs will email you in the next few days if they decide to include you in the private beta.
:::

## Create a webhook
From your **Account Settings** in dbt Cloud (using the gear menu in the top right corner), click **Create New Webhook** in the **Webhooks** section. For a new webhook: 

- **Name** &mdash; Enter a name for your outbound webhook.
- **Description** &mdash; Enter a short description of the webhook.
- **Events** &mdash; Choose the event you want to trigger this webhook. You can subscribe to more than one event.
- **Jobs** &mdash; Specify the job(s) you want the webhook to trigger on if you want. By default, dbt Cloud configures your webhook at the account level.
- **Endpoint** &mdash; Enter the endpoint URL you want to send the event(s) to.

When done, click **Save.** dbt Cloud retries sending each event five times. dbt Cloud keeps a log of each webhook delivery for 30 days. Every webhook has its own **Recent Deliveries** section, which lists whether a delivery was successful or failed at a glance. 

dbt Cloud provides a secret token that you can use to [check for the authenticity of a webhook](#validate-a-webhook). It’s strongly recommended that you perform this check on your server to protect yourself from fake (spoofed) requests.

## Validate a webhook

You can use the secret token provided by dbt Cloud to validate that webhooks received by your endpoint were actually sent by dbt Cloud. Official webhooks will include the `Authorization` header that contains a SHA256 hash of the request body and uses the secret token as a key. 

An example for verifying the authenticity of the webhook in Python:

```python
auth_header = request.headers.get('authorization', None)
app_secret = os.environ['MY_DBT_CLOUD_AUTH_TOKEN'].encode('utf-8')
signature = hmac.new(app_secret, request_body, hashlib.sha256).hexdigest()
return signature == auth_header

```

## Examples of JSON payloads

An example of a webhook payload for a run that's started:

```json
{
  "accountId": 1,
  "eventId": "wev_2L6Z3l8uPedXKPq9D2nWbPIip7Z",
  "timestamp": "2023-01-31T19:28:15.742843678Z",
  "eventType": "job.run.started",
  "webhookName": "test",
  "data": {
    "jobId": "123",
    "jobName": "Daily Job (dbt build)",
    "runId": "12345",
    "environmentId": "1234",
    "environmentName": "Production",
    "dbtVersion": "1.0.0",
    "projectName": "Snowflake Github Demo",
    "runReason": "Kicked off from UI by test@test.com",
    "runStartedAt": "2023-01-31T19:28:07Z",
    "runStatus": "Running",
    "runStatusMessage": "None"
  }
}
```

An example of a webhook payload for a completed run:

```json
{
  "accountId": 1,
  "eventId": "wev_2L6ZDoilyiWzKkSA59Gmc2d7FDD",
  "timestamp": "2023-01-31T19:29:35.789265936Z",
  "eventType": "job.run.completed",
  "webhookName": "test",
  "data": {
    "jobId": "123",
    "jobName": "Daily Job (dbt build)",
    "runId": "12345",
    "environmentId": "1234",
    "environmentName": "Production",
    "dbtVersion": "1.0.0",
    "projectName": "Snowflake Github Demo",
    "runReason": "",
    "runStartedAt": "2023-01-31T19:28:07Z",
    "runFinishedAt": "2023-01-31T19:29:32Z",
    "runStatus": "Success",
    "runStatusMessage": "None"
  }
}
```

An example of a webhook payload for an errored run: 

```json
{
  "accountId": 1,
  "eventId": "wev_2L6m5BggBw9uPNuSmtg4MUiW4Re",
  "timestamp": "2023-01-31T21:15:20.419714619Z",
  "eventType": "job.run.errored",
  "webhookName": "test",
  "data": {
    "jobId": "123",
    "jobName": "dbt Vault",
    "runId": "12345",
    "environmentId": "1234",
    "environmentName": "dbt Vault Demo",
    "dbtVersion": "1.0.0",
    "projectName": "Snowflake Github Demo",
    "runReason": "Kicked off from UI by test@test.com",
    "runStartedAt": "2023-01-31T21:14:41Z",
    "runErroredAt": "2023-01-31T21:15:20Z",
    "runStatus": "Errored",
    "runStatusMessage": "None"
  }
}
```

## Related docs 
- [dbt Cloud CI job](/docs/deploy/cloud-ci-job)