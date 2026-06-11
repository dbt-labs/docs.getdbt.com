---
title: "Connect Salesforce Data 360"
id: connect-salesforce
description: "Configure Salesforce Data 360 connection."
sidebar_label: "Connect Salesforce Data 360"
---

# Connect Salesforce Data 360 <Lifecycle status="beta"/> <ProductCard text="Fusion compatible" />

The <Constant name="fusion_engine" /> in <Constant name="dbt_platform" /> supports connecting to Salesforce Data 360.

## Prerequisites

Before connecting dbt to Salesforce Data 360, you need the following:

- A Data 360 instance
- [An external client app that dbt connects to for the Data 360 instance](https://help.salesforce.com/s/articleView?id=xcloud.create_a_local_external_client_app.htm&type=5), with [OAuth configured](https://help.salesforce.com/s/articleView?id=xcloud.configure_external_client_app_oauth_settings.htm&type=5). OAuth scopes must include:
  - `api` — To manage user data via APIs.
  - `refresh_token`, `offline_access` — To perform requests at any time, even when the user is offline or tokens have expired.
  - `cdp_query_api` — To execute ANSI SQL queries on Data 360 data.
- [A private key and the `server.key` file](https://developer.salesforce.com/docs/atlas.en-us.252.0.sfdx_dev.meta/sfdx_dev/sfdx_dev_auth_key_and_cert.htm)
- `Data Cloud Architect` and `Data Cloud User`  permissions

## Connection fields

To connect to Salesforce Data 360, configure the connection settings and provide your credentials.

### Connection

Configure the following fields to set up your Salesforce Data 360 connection:

| Field | Description | Example |
| ----- | ----------- | ------- |
| Connection name | A name for your Salesforce Data 360 connection. | |
| Auth method | The authentication method used to connect to Salesforce Data 360. JSON Web Token (JWT) is the only supported method. | JWT Bearer Flow (default) |
| Login URL | The Salesforce instance URL. | `https://login.salesforce.com` (default) |
| Database | (Optional) The Salesforce Data 360 database to connect to. | |
| Data Transform Run Timeout | (Optional) The timeout duration (in milliseconds) for data transformation runs. | |

### Credentials

Enter the following credentials to authenticate with Salesforce Data 360:

| Field | Description | Example |
| ----- | ----------- | ------- |
| Username | Your Salesforce Data 360 username. | user.name@example.com |
| Client ID | The `Consumer Key` of the Salesforce Data 360 app. | |
| Private Key | The private key for JWT bearer flow authentication. | |

## Authentication method

Salesforce Data 360 supports JWT bearer authentication only. JWT bearer flow is a machine-to-machine authentication method that uses a private key file and Consumer Key (Client ID) to authenticate without requiring user interaction.

## Configuration

To learn how to optimize performance with data platform-specific configurations in <Constant name="dbt_platform" />, refer to [Salesforce Data 360 configurations](/reference/resource-configs/data-cloud-configs).

## Limitations

The following dbt features are not yet supported for Salesforce Data 360 connections in <Constant name="dbt_platform" />:

- [Seeds](/docs/build/seeds)
    - As a workaround, log in to Salesforce and upload the CSV file manually.
- [Catalog](/docs/explore/explore-projects)
- [Semantic Layer](/docs/use-dbt-semantic-layer/dbt-sl)

