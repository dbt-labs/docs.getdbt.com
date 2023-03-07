---
title: "Webhooks for your jobs"
description: "Get real-time notifications about your dbt jobs with webhooks."
---

With dbt Cloud, you can create outbound webhooks to send events (notifications) about your dbt jobs to your other systems. Your other systems can listen for (subscribe to) these events to further automate your workflows or to help trigger automation flows you have set up.

A webhook is an HTTP-based callback function that allows event-driven communication between two different web applications. This allows you to get the latest information on your dbt jobs in real time. Without it, you would need to make API calls repeatedly to check if there are any updates that you need to account for (polling). Because of this, webhooks are also called _push APIs_ or _reverse APIs_ and are often used for infrastructure development.

dbt Cloud sends a JSON payload to your application's endpoint URL when your webhook is triggered. You can send a [Slack](/guides/orchestration/webhooks/zapier-slack) or [Microsoft Teams](/guides/orchestration/webhooks/zapier-ms-teams) notification, [open a PagerDuty incident](/guides/orchestration/webhooks/serverless-pagerduty) when a dbt job fails, [and more](/guides/orchestration/webhooks). 

You can create webhooks for these events from the [dbt Cloud web-based UI](#create-a-webhook-subscription) and by using the [dbt Cloud API](#api-for-webhooks):

- `job.run.started` &mdash; Run started.
- `job.run.completed` &mdash; Run completed. This can be a run that has failed or succeeded.
- `job.run.errored` &mdash; Run errored.

dbt Cloud retries sending each event five times. dbt Cloud keeps a log of each webhook delivery for 30 days. Every webhook has its own **Recent Deliveries** section, which lists whether a delivery was successful or failed at a glance. 

## Prerequisites
- You have a dbt Cloud account that is on the [Team or Enterprise plan](https://www.getdbt.com/pricing/). 

## Create a webhook subscription {#create-a-webhook-subscription}
From your **Account Settings** in dbt Cloud (using the gear menu in the top right corner), click **Create New Webhook** in the **Webhooks** section. You can find the appropriate dbt Cloud access URL for your region and plan with [Regions & IP addresses](/docs/deploy/regions-ip-addresses).

To configure your new webhook: 

- **Name** &mdash; Enter a name for your outbound webhook.
- **Description** &mdash; Enter a description of the webhook.
- **Events** &mdash; Choose the event you want to trigger this webhook. You can subscribe to more than one event.
- **Jobs** &mdash; Specify the job(s) you want the webhook to trigger on. Or, you can leave this field empty for the webhook to trigger on all jobs in your account. By default, dbt Cloud configures your webhook at the account level. 
- **Endpoint** &mdash; Enter your application's endpoint URL, where dbt Cloud can send the event(s) to.

When done, click **Save**. dbt Cloud provides a secret token that you can use to [check for the authenticity of a webhook](#validate-a-webhook). It’s strongly recommended that you perform this check on your server to protect yourself from fake (spoofed) requests.

### Understanding the difference between `job.run.completed` and `job.run.errored` {#completed-errored-event-difference}
The `job.run.errored` event is a subset of `job.run.completed` events - if you subscribe to both, you will receive two notifications when a job has an error. However, they are triggered at different times. The `job.run.completed` event will only fire once the metadata and artifacts for the run have been ingested and are available from the dbt Cloud Admin and Metadata APIs. By contrast, the `job.run.errored` event fires immediately, without a guarantee that those processes have completed. 

Because of this, if your integration will depend on data from the Admin API (such as accessing the logs from the run) or Metadata API (accessing model-by-model statuses), it's recommended that you use the `job.run.completed` event and filter on the `runStatus` or `runStatusCode`. If your integration does not depend on additional data or improved delivery performance is more important for your use case, use `job.run.errored` and build your integration with awareness that calls to the API might not return data for a short period at first. 

## Validate a webhook

You can use the secret token provided by dbt Cloud to validate that webhooks received by your endpoint were actually sent by dbt Cloud. Official webhooks will include the `Authorization` header that contains a SHA256 hash of the request body and uses the secret token as a key. 

An example for verifying the authenticity of the webhook in Python:

```python
auth_header = request.headers.get('authorization', None)
app_secret = os.environ['MY_DBT_CLOUD_AUTH_TOKEN'].encode('utf-8')
signature = hmac.new(app_secret, request_body, hashlib.sha256).hexdigest()
return signature == auth_header

```

## Inspect HTTP requests 
When working with webhooks, it’s good practice to use tools like [RequestBin](https://requestbin.com/) and [Requestly](https://requestly.io/). These tools allow you to inspect your HTML requests, response payloads, and response headers so you can debug and test webhooks before incorporating them into your systems. 

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
    "projectId": "167194",
    "runStatus": "Running",
    "runStatusCode": 3,
    "runStatusMessage": "None",
    "runReason": "Kicked off from UI by test@test.com",
    "runStartedAt": "2023-01-31T19:28:07Z"
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
    "projectId": "167194",
    "runStatus": "Success",
    "runStatusCode": 10,
    "runStatusMessage": "None",
    "runReason": "Kicked off from UI by test@test.com",
    "runStartedAt": "2023-01-31T19:28:07Z",
    "runFinishedAt": "2023-01-31T19:29:32Z"
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
    "projectId": "167194",
    "runStatus": "Errored",
    "runStatusCode": 20,
    "runStatusMessage": "None",
    "runReason": "Kicked off from UI by test@test.com",
    "runStartedAt": "2023-01-31T21:14:41Z",
    "runErroredAt": "2023-01-31T21:15:20Z"
  }
}
```

## API for webhooks {#api-for-webhooks}
You can use the dbt Cloud API to create new webhooks that you want to subscribe to, get detailed information about your webhooks, and to manage the webhooks that are associated with your account. The following sections describe the API endpoints you can use for this. 

:::info Access URLs
dbt Cloud is hosted in multiple regions in the world and each region has a different access URL. People on Enterprise plans can choose to have their account hosted in any one of these regions. This section uses `cloud.getdbt.com` (which is for North America) as part of the endpoint but your access URL might be different. For a complete list of available dbt Cloud access URLs, refer to [Regions & IP addresses](/docs/deploy/regions-ip-addresses).   
:::

### List all webhook subscriptions
List all webhooks that are available from a specific dbt Cloud account.

#### Request 
```shell
GET https://cloud.getdbt.com/api/v3/accounts/{account_id}/webhooks/subscriptions
```

#### Path parameters
| Name       | Description                          |
|------------|--------------------------------------|
| `account_id` | The dbt Cloud account the webhooks are associated with. |

#### Response sample
```json
{
    "data": [
        {
            "id": "wsu_12345abcde",
            "account_identifier": "act_12345abcde",
            "name": "Webhook for jobs",
            "description": "A webhook for when jobs are started",
            "job_ids": [
                "123",
                "321"
            ],
            "event_types": [
                "job.run.started"
            ],
            "client_url": "https://test.com",
            "active": true,
            "created_at": "1675735768491774",
            "updated_at": "1675787482826757",
            "account_id": "123",
            "http_status_code": "0"
        },
        {
            "id": "wsu_12345abcde",
            "account_identifier": "act_12345abcde",
            "name": "Notication Webhook",
            "description": "Webhook used to trigger notifications in Slack",
            "job_ids": [],
            "event_types": [
                "job.run.completed",
                "job.run.started",
                "job.run.errored"
            ],
            "client_url": "https://test.com",
            "active": true,
            "created_at": "1674645300282836",
            "updated_at": "1675786085557224",
            "http_status_code": "410",
            "dispatched_at": "1675786085548538",
            "account_id": "123"
        }
    ],
    "status": {
        "code": 200
    },
    "extra": {
        "pagination": {
            "total_count": 2,
            "count": 2
        },
        "filters": {
            "offset": 0,
            "limit": 10
        }
    }
}
```

#### Response schema 
| Name | Description | Possible Values |
| --- | --- | --- |
| `data` | List of available webhooks for the specified dbt Cloud account ID. |  |
| `id` | The webhook ID. |  |
| `account_identifier` | The unique identifier for _your_ dbt Cloud account. |  |
| `name` | Name of the outbound webhook. |  |
| `description` | Description of the webhook. |  |
| `job_ids` | The specific jobs the webhook is set to trigger for. When the list is empty, the webhook is set to trigger for all jobs in your account; by default, dbt Cloud configures webhooks at the account level. | <ul><li>Empty list</li> <li>List of job IDs</li></ul> |
| `event_types` | The event type(s) the webhook is set to trigger on. | One or more of these: <ul><li>`job.run.started`</li> <li>`job.run.completed`</li><li>`job.run.errored`</li></ul> |
| `client_url` | The endpoint URL for an application where dbt Cloud can send event(s) to. |  |
| `active` | A Boolean value indicating whether the webhook is active or not. | One of these: <ul><li>`true`</li><li>`false`</li></ul> |
| `created_at` | Timestamp of when the webhook was created. |  |
| `updated_at` | Timestamp of when the webhook was last updated. |  |
| `http_status_code` | The latest HTTP status of the webhook. | Can be any [HTTP response status code](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status). If the value is `0`, that means the webhook has never been triggered. |
| `dispatched_at` | Timestamp of when the webhook was last dispatched to the specified endpoint URL. |  |
| `account_id` | The dbt Cloud account ID. |  |

### Get details about a webhook
Get detailed information about a specific webhook. 

#### Request
```shell
GET https://cloud.getdbt.com/api/v3/accounts/{account_id}/webhooks/subscription/{webhook_id}
```
#### Path parameters
| Name       | Description                          |
|------------|--------------------------------------|
| `account_id` | The dbt Cloud account the webhook is associated with. |
| `webhook_id` | The webhook you want detailed information on. |

#### Response sample
```json
{
    "data": {
        "id": "wsu_12345abcde",
        "account_identifier": "act_12345abcde",
        "name": "Webhook for jobs",
        "description": "A webhook for when jobs are started",
        "event_types": [
            "job.run.started"
        ],
        "client_url": "https://test.com",
        "active": true,
        "created_at": "1675789619690830",
        "updated_at": "1675793192536729",
        "dispatched_at": "1675793192533160",
        "account_id": "123",
        "job_ids": [],
        "http_status_code": "0"
    },
    "status": {
        "code": 200
    }
}
```

#### Response schema
| Name | Description | Possible Values |
| --- | --- | --- |
| `id` | The webhook ID. |  |
| `account_identifier` | The unique identifier for _your_ dbt Cloud account. |  |
| `name` | Name of the outbound webhook. |  |
| `description` | Complete description of the webhook. |  |
| `event_types` | The event type the webhook is set to trigger on. | One or more of these: <ul><li>`job.run.started`</li> <li>`job.run.completed`</li><li>`job.run.errored`</li></ul> |
| `client_url` | The endpoint URL for an application where dbt Cloud can send event(s) to. |  |
| `active` | A Boolean value indicating whether the webhook is active or not. | One of these: <ul><li>`true`</li><li>`false`</li></ul> |
| `created_at` | Timestamp of when the webhook was created. |  |
| `updated_at` | Timestamp of when the webhook was last updated. |  |
| `dispatched_at` | Timestamp of when the webhook was last dispatched to the specified endpoint URL. |  |
| `account_id` | The dbt Cloud account ID. |  |
| `job_ids` | The specific jobs the webhook is set to trigger for. When the list is empty, the webhook is set to trigger for all jobs in your account; by default, dbt Cloud configures webhooks at the account level. | One of these: <ul><li>Empty list</li> <li>List of job IDs</li></ul> |
| `http_status_code` | The latest HTTP status of the webhook. | Can be any [HTTP response status code](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status). If the value is `0`, that means the webhook has never been triggered. |

### Create a new webhook subscription
Create a new outbound webhook and specify the endpoint URL that will be subscribing (listening) to the webhook's events.

#### Request sample

```shell
POST https://cloud.getdbt.com/api/v3/accounts/{account_id}/webhooks/subscriptions
```

```json
{
	"event_types": [
			"job.run.started"
	],
	"name": "Webhook for jobs",
	"client_url": "https://test.com",
	"active": true,
	"description": "A webhook for when jobs are started",
	"job_ids": [
			123,
			321
	]
}
```

#### Path parameters
| Name | Description |
| --- | --- |
| `account_id` | The dbt Cloud account the webhook is associated with. |

#### Request parameters
| Name | Description | Possible Values |
| --- | --- | --- |
| `event_types` | Enter the event you want to trigger this webhook. You can subscribe to more than one event. | One or more of these: <ul><li>`job.run.started`</li> <li>`job.run.completed`</li><li>`job.run.errored`</li></ul> |
| `name` | Enter the name of your webhook. |  |
| `client_url` | Enter your application's endpoint URL, where dbt Cloud can send the event(s) to.|  |
| `active` | Enter a Boolean value to indicate whether your webhook is active or not. | One of these: <ul><li>`true`</li><li>`false`</li></ul> |
| `description` | Enter a description of your webhook. |  |
| `job_ids` | Enter the specific jobs you want the webhook to trigger on or you can leave this parameter as an empty list. If this is an empty list, the webhook is set to trigger for all jobs in your account; by default, dbt Cloud configures webhooks at the account level. | One of these: <ul><li>Empty list</li> <li>List of job IDs</li></ul> |

#### Response sample
```json
{
    "data": {
        "id": "wsu_12345abcde",
        "account_identifier": "act_12345abcde",
        "name": "Webhook for jobs",
        "description": "A webhook for when jobs are started",
        "job_ids": [
            "123",
						"321"
        ],
        "event_types": [
            "job.run.started"
        ],
        "client_url": "https://test.com",
        "hmac_secret": "12345abcde",
        "active": true,
        "created_at": "1675795644808877",
        "updated_at": "1675795644808877",
        "account_id": "123",
        "http_status_code": "0"
    },
    "status": {
        "code": 201
    }
}
```

#### Response schema
| Name | Description | Possible Values |
| --- | --- | --- |
| `id` | The webhook ID. |  |
| `account_identifier` | The unique identifier for _your_ dbt Cloud account. |  |
| `name` | Name of the outbound webhook. |  |
| `description` | Complete description of the webhook. |  |
| `job_ids` | The specific jobs the webhook is set to trigger for. When the list is empty, the webhook is set to trigger for all jobs in your account; by default, dbt Cloud configures webhooks at the account level. | One of these: <ul><li>Empty list</li> <li>List of job IDs</li></ul> |
| `event_types` | The event type the webhook is set to trigger on. | One or more of these: <ul><li>`job.run.started`</li> <li>`job.run.completed`</li><li>`job.run.errored`</li></ul> |
| `client_url` | The endpoint URL for an application where dbt Cloud can send event(s) to. |  |
| `hmac_secret` | The secret key for your new webhook. You can use this key to [validate the authenticity of this webhook](#validate-a-webhook). |  |
| `active` | A Boolean value indicating whether the webhook is active or not. | One of these: <ul><li>`true`</li><li>`false`</li></ul> |
| `created_at` | Timestamp of when the webhook was created. |  |
| `updated_at` | Timestamp of when the webhook was last updated. |  |
| `account_id` | The dbt Cloud account ID. |  |
| `http_status_code` | The latest HTTP status of the webhook. | Can be any [HTTP response status code](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status). If the value is `0`, that means the webhook has never been triggered. |

### Update a webhook
Update the configuration details for a specific webhook. 

#### Request sample
```shell
PUT https://cloud.getdbt.com/api/v3/accounts/{account_id}/webhooks/subscription/{webhook_id}
```

```json
{
	"event_types": [
			"job.run.started"
	],
	"name": "Webhook for jobs",
	"client_url": "https://test.com",
	"active": true,
	"description": "A webhook for when jobs are started",
	"job_ids": [
			123,
			321
	]
}
```

#### Path parameters
| Name       | Description                          |
|------------|--------------------------------------|
| `account_id` | The dbt Cloud account the webhook is associated with. |
| `webhook_id` | The webhook you want to update. |

#### Request parameters
| Name | Description | Possible Values |
|------|-------------|-----------------|
| `event_types` | Update the event type the webhook is set to trigger on. You can subscribe to more than one. | One or more of these: <ul><li>`job.run.started`</li> <li>`job.run.completed`</li><li>`job.run.errored`</li></ul> |
| `name` | Change the name of your webhook. |  |
| `client_url` | Update the endpoint URL for an application where dbt Cloud can send event(s) to. |  |
| `active` | Change the Boolean value indicating whether the webhook is active or not. | One of these: <ul><li>`true`</li><li>`false`</li></ul> |
| `description` | Update the webhook's description. |  |
| `job_ids` | Change which jobs you want the webhook to trigger for. Or, you can use an empty list to trigger it for all jobs in your account. | One of these: <ul><li>Empty list</li> <li>List of job IDs</li></ul> |

#### Response sample
```json
{
    "data": {
        "id": "wsu_12345abcde",
        "account_identifier": "act_12345abcde",
        "name": "Webhook for jobs",
        "description": "A webhook for when jobs are started",
        "job_ids": [
            "123"
        ],
        "event_types": [
            "job.run.started"
        ],
        "client_url": "https://test.com",
        "active": true,
        "created_at": "1675798888416144",
        "updated_at": "1675804719037018",
        "http_status_code": "200",
        "account_id": "123"
    },
    "status": {
        "code": 200
    }
}
```

#### Response schema
| Name | Description | Possible Values |
| --- | --- | --- |
| `id` | The webhook ID. |  |
| `account_identifier` | The unique identifier for _your_ dbt Cloud account. |  |
| `name` | Name of the outbound webhook. |  |
| `description` | Complete description of the webhook. |  |
| `job_ids` | The specific jobs the webhook is set to trigger for. When the list is empty, the webhook is set to trigger for all jobs in your account; by default, dbt Cloud configures webhooks at the account level. | One of these: <ul><li>Empty list</li> <li>List of job IDs</li></ul> |
| `event_types` | The event type the webhook is set to trigger on. | One or more of these: <ul><li>`job.run.started`</li> <li>`job.run.completed`</li><li>`job.run.errored`</li></ul> |
| `client_url` | The endpoint URL for an application where dbt Cloud can send event(s) to. |  |
| `active` | A Boolean value indicating whether the webhook is active or not. | One of these: <ul><li>`true`</li><li>`false`</li></ul> |
| `created_at` | Timestamp of when the webhook was created. |  |
| `updated_at` | Timestamp of when the webhook was last updated. |  |
| `http_status_code` | The latest HTTP status of the webhook. | Can be any [HTTP response status code](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status). If the value is `0`, that means the webhook has never been triggered. |
| `account_id` | The dbt Cloud account ID. |  |


### Test a webhook
Test a specific webhook. 

#### Request
```shell
GET https://cloud.getdbt.com/api/v3/accounts/{account_id}/webhooks/subscription/{webhook_id}/test
```

#### Path parameters
| Name       | Description                          |
|------------|--------------------------------------|
| `account_id` | The dbt Cloud account the webhook is associated with. |
| `webhook_id` | The webhook you want to test.  |

#### Response sample
```json
{
    "data": {
        "verification_error": null,
        "verification_status_code": "200"
    },
    "status": {
        "code": 200
    }
}
```

### Delete a webhook
Delete a specific webhook. 

#### Request
```shell
DELETE https://cloud.getdbt.com/api/v3/accounts/{account_id}/webhooks/subscription/{webhook_id}
```

#### Path parameters
| Name       | Description                          |
|------------|--------------------------------------|
| `account_id` | The dbt Cloud account the webhook is associated with. |
| `webhook_id` | The webhook you want to delete. |

#### Response sample

```json
{
    "data": {
        "id": "wsu_12345abcde"
    },
    "status": {
        "code": 200,
        "is_success": true
    }
}
```

## Related docs 
- [dbt Cloud CI job](/docs/deploy/cloud-ci-job)
