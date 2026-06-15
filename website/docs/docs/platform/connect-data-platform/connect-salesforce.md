---
title: "Connect Salesforce Data 360"
id: connect-salesforce
description: "Configure Salesforce Data 360 connection."
sidebar_label: "Connect Salesforce Data 360"
---

# Connect Salesforce Data 360 <Lifecycle status="beta"/> <ProductCard text="Fusion compatible" />

The <Constant name="fusion_engine" /> in <Constant name="dbt_platform" /> supports connecting to Salesforce Data 360.

import SalesforcePrereqs from '/snippets/_salesforce-data-cloud-prereqs.md';

<SalesforcePrereqs />

## Connection fields

To connect to Salesforce Data 360, configure the connection settings and provide your credentials.

### Connection

Configure the following fields to set up your Salesforce Data 360 connection:

| Field | Description | Example |
| ----- | ----------- | ------- |
| Connection name | A name for your Salesforce Data 360 connection. | |
| Auth method | The authentication method used to connect to Salesforce Data 360. JWT is the only supported method. | JWT Bearer Flow (default) |
| Login URL | The Salesforce instance URL. | `https://login.salesforce.com` (default) |
| Database | (Optional) The Salesforce Data 360 database to connect to. | |
| Data Transform Run Timeout | (Optional) The timeout duration (in milliseconds) for data transformation runs. | |

### Credentials

Enter the following credentials to authenticate with Salesforce Data 360:

<SimpleTable>
| Field | Description | Example |
| ----- | ----------- | ------- |
| Username | Your Salesforce Data 360 username. | user.name@example.com |
| Client ID | The `Consumer Key` of the Salesforce Data 360 app. | |
| Private Key | The private key for JWT bearer flow authentication. | |
</SimpleTable>

- For **Username**, use your Salesforce account username. Authentication will only succeed if that username has one of the profiles or permission sets added to the external client app in [step 9](#creating-the-external-client-app).
- For **Client ID**, get the Consumer Key from your external client app in Salesforce. Go to **Settings** > **OAuth Settings** > **Consumer Key and Secret**. Copy the **Consumer Key** and paste to the **Client ID** field.
- The **Private Key** is the `server.key` file created in [Generating a private key and certificate](#generating-a-private-key-and-certificate).

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

