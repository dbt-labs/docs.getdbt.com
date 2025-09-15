---
title: "Configuring BigQuery and GCP Private Service Connect (beta)"
id: bigquery-psc
description: "Configuring GCP Private Service Connect for BigQuery (beta)"
sidebar_label: "GCP Private Service Connect for BigQuery (beta)"
---

# Configuring BigQuery Private Service Connect <Lifecycle status="beta, managed_plus" />

import SetUpPages from '/snippets/_available-tiers-private-connection.md';
import CloudProviders from '/snippets/_private-connection-across-providers.md';

<SetUpPages />

The following steps walk you through the setup of a GCP BigQuery [Private Service Connect](https://cloud.google.com/vpc/docs/private-service-connect) (PSC) endpoint in a <Constant name="cloud" /> multi-tenant environment.

<CloudProviders type='BigQuery' />

## Configure GCP Private Service Connect

To enable dbt to privately connect to your BigQuery project via PSC, the regional PSC endpoint needs be enabled for your dbt account. Using the following template, submit a request to [dbt Support](/docs/dbt-support#dbt-cloud-support):

```
Subject: New Multi-Tenant GCP PSC Request
- Type: BigQuery
- BigQuery project region: 
- dbt GCP multi-tenant environment:
```

import PrivateLinkSLA from '/snippets/_private-connection-SLA.md';

<PrivateLinkSLA />

## Create the connection in dbt

Once the dbt Support team completes the configuration, you can start creating new connections using PSC: 

1. Navigate to **Account settings** > **Connections**.
2. In the **Connections** page, select **BigQuery**. Click **Edit**.
3. You will see two radio buttons: **Default Endpoint** and **PrivateLink Endpoint**. Select **PrivateLink Endpoint**. 
4. Select the private endpoint from the dropdown (this will automatically populate the API endpoint field).
5. Configure any remaining data platform details.
6. Save the connection and test in either a project job or Studio session.
