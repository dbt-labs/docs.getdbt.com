---
title: "Configuring BigQuery and GCP Private Service Connect"
id: gcp-bigquery
description: "Configuring GCP Private Service Connect for BigQuery."
sidebar_label: "BigQuery"
---

# Configuring BigQuery Private Service Connect <Lifecycle status="managed_plus" />

import SetUpPages from '/snippets/_available-tiers-enterprise-plus.md';
import PrivateLinkCreateConnection from '/snippets/_privatelink-create-connection.md';
import CloudProviders from '/snippets/_private-connection-across-providers.md';

<SetUpPages />

The following steps walk you through the setup of a GCP BigQuery [Private Service Connect](https://cloud.google.com/vpc/docs/private-service-connect) (PSC) endpoint in a <Constant name="dbt" /> multi-tenant environment.

<CloudProviders type='BigQuery' />

## Enabling dbt for GCP Private Service Connect

To enable dbt to privately connect to your BigQuery project via PSC, the regional PSC endpoint needs be enabled for your dbt account. Using the following template, submit a request to [dbt Support](mailto:support@getdbt.com):

<Expandable alt_header="Support request email template" is_open={true}>

```text
Subject: New Multi-Tenant GCP PSC Request

- Type: BigQuery
- dbt platform account URL:
- BigQuery project region:
- dbt GCP multi-tenant environment:
```

</Expandable>

import PrivateLinkSLA from '/snippets/_private-connection-SLA.md';

<PrivateLinkSLA />

## (Optional) Generate BigQuery credentials
You may already have credentials set up for your datasets. If not, you can follow the steps in our [BigQuery quickstart guide](/guides/bigquery?step=4) to generate credentials. 

## Create connection in dbt

Once dbt Support completes the configuration, you can start creating new connections using PSC: 

<PrivateLinkCreateConnection
  platform="BigQuery"
/>
