---
title: "Create Datadog events from dbt Cloud results"
id: serverless-datadog
description: Configure a serverless app to add dbt Cloud events to Datadog logs.
hoverSnippet: Learn how to configure a serverless app to add dbt Cloud events to Datadog logs.
# time_to_complete: '30 minutes' commenting out until we test
icon: 'guides'
hide_table_of_contents: true
tags: ['Webhooks']
level: 'Advanced'
recently_updated: true
---

<div style={{maxWidth: '900px'}}>

## Introduction

This guide will teach you how to build and host a basic Python app which will add dbt Cloud job events to Datadog. To do this, when a dbt Cloud job completes it will create a log entry for each node that was run, containing all information about the node provided by the [Discovery API](/docs/dbt-cloud-apis/discovery-schema-job-models).

In this example, we will use [fly.io](https://fly.io) for hosting/running the service. fly.io is a platform for running full stack apps without provisioning servers etc. This level of usage should comfortably fit inside of the Free tier. You can also use an alternative tool such as [AWS Lambda](https://adem.sh/blog/tutorial-fastapi-aws-lambda-serverless) or [Google Cloud Run](https://github.com/sekR4/FastAPI-on-Google-Cloud-Run).

### Prerequisites

This guide assumes some familiarity with:
- [dbt Cloud Webhooks](/docs/deploy/webhooks)
- CLI apps
- Deploying code to a serverless code runner like fly.io or AWS Lambda

## Clone the `dbt-cloud-webhooks-datadog` repo

[This repository](https://github.com/dpguthrie/dbt-cloud-webhooks-datadog) contains the sample code for validating a webhook and creating logs in Datadog.


## Install `flyctl` and sign up for fly.io

Follow the directions for your OS in the [fly.io docs](https://fly.io/docs/hands-on/install-flyctl/), then from your command line, run the following commands:

Switch to the directory containing the repo you cloned in step 1:

    ```shell
    #example: replace with your actual path
    cd ~/Documents/GitHub/dbt-cloud-webhooks-datadog
    ```

Sign up for fly.io:
    ```shell
    flyctl auth signup
    ```

Your console should show `successfully logged in as YOUR_EMAIL` when you're done, but if it doesn't then sign in to fly.io from your command line:
    ```shell
    flyctl auth login
    ```

## Launch your fly.io app

Launching your app publishes it to the web and makes it ready to catch webhook events:
    ```shell
    flyctl launch
    ```

1. You will see a message saying that an existing `fly.toml` file was found. Type `y` to copy its configuration to your new app.

2. Choose an app name of your choosing, such as `YOUR_COMPANY-dbt-cloud-webhook-datadog`, or leave blank and one will be generated for you. Note that your name can only contain numbers, lowercase letters and dashes.

3. Choose a deployment region, and take note of the hostname that is generated (normally `APP_NAME.fly.dev`).

4. When asked if you would like to set up Postgresql or Redis databases, type `n` for each.

5. Type `y` when asked if you would like to deploy now.

<details>
<summary>Sample output from the setup wizard:</summary>
<code>
joel@Joel-Labes dbt-cloud-webhooks-datadog % flyctl launch<br/>
An existing fly.toml file was found for app dbt-cloud-webhooks-datadog<br/>
? Would you like to copy its configuration to the new app? Yes<br/>
Creating app in /Users/joel/Documents/GitHub/dbt-cloud-webhooks-datadog<br/>
Scanning source code<br/>
Detected a Dockerfile app<br/>
? Choose an app name (leave blank to generate one): demo-dbt-cloud-webhook-datadog<br/>
automatically selected personal organization: Joel Labes<br/>
Some regions require a paid plan (fra, maa).<br/>
See https://fly.io/plans to set up a plan.<br/>
? Choose a region for deployment:  [Use arrows to move, type to filter]<br/>
? Choose a region for deployment: Sydney, Australia (syd)<br/>
Created app dbtlabs-dbt-cloud-webhook-datadog in organization personal<br/>
Admin URL: https://fly.io/apps/demo-dbt-cloud-webhook-datadog<br/>
Hostname: demo-dbt-cloud-webhook-datadog.fly.dev<br/>
? Would you like to set up a Postgresql database now? No<br/>
? Would you like to set up an Upstash Redis database now? No<br/>
Wrote config file fly.toml<br/>
? Would you like to deploy now? Yes
</code>
</details>

### 4. Create a Datadog API Key
[Create an API Key for your Datadog account](https://docs.datadoghq.com/account_management/api-app-keys/) and make note of it and your Datadog site (e.g. `datadoghq.com`) for later.

## Configure a new webhook in dbt Cloud

1. See [Create a webhook subscription](/docs/deploy/webhooks#create-a-webhook-subscription) for full instructions. Your event should be **Run completed**.
2. Set the webhook URL to the host name you created earlier (`APP_NAME.fly.dev`).
3. Make note of the Webhook Secret Key for later.

*Do not test the endpoint*; it won't work until you have stored the auth keys (next step)

## Store secrets

The application requires four secrets to be set, using these names:
- `DBT_CLOUD_SERVICE_TOKEN`: a dbt Cloud [personal access token](https://docs.getdbt.com/docs/dbt-cloud-apis/user-tokens) or [service account token](https://docs.getdbt.com/docs/dbt-cloud-apis/service-tokens) with at least the `Metdata Only` permission.
- `DBT_CLOUD_AUTH_TOKEN`: the Secret Key for the dbt Cloud webhook you created earlier.
- `DD_API_KEY`: the API key you created earlier.
- `DD_SITE`: The Datadog site for your organisation, e.g. `datadoghq.com`.

Set these secrets as follows, replacing `abc123` etc with actual values:
    ```shell
    flyctl secrets set DBT_CLOUD_SERVICE_TOKEN=abc123 DBT_CLOUD_AUTH_TOKEN=def456 DD_API_KEY=ghi789 DD_SITE=datadoghq.com
    ```

## Deploy your app

After you set your secrets, fly.io will redeploy your application. When it has completed successfully, go back to the dbt Cloud webhook settings and click **Test Endpoint**.

</div>