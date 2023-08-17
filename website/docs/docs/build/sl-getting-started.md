---
id: sl-getting-started
title: Get started with MetricFlow
description: "Learn how to create your first semantic model and metric."
sidebar_label: Get started with MetricFlow
tags: [Metrics, Semantic Layer]
meta:
  api_name: dbt Semantic Layer API
---

import InstallMetricFlow from '/snippets/_sl-install-metricflow.md';
import CreateModel from '/snippets/_sl-create-semanticmodel.md';
import DefineMetrics from '/snippets/_sl-define-metrics.md';
import ConfigMetric from '/snippets/_sl-configure-metricflow.md';
import TestQuery from '/snippets/_sl-test-and-query-metrics.md';

This getting started page presents a sample workflow to help you create your first metrics in dbt Cloud or the command line (CLI). It uses the [Jaffle shop example project](https://github.com/dbt-labs/jaffle-sl-template) as the project data source and is available for you to use. If you prefer, you can create semantic models and metrics for your own dbt project.

This guide will cover the following sections and steps:

- [Create a semantic model](#create-a-semantic-model) using MetricFlow
- [Define metrics](#define-metrics) using MetricFlow
- [Test and query metrics locally](#test-and-query-metrics) using MetricFlow
- [Run a production job](#run-a-production-job) in dbt Cloud
- [Set up dbt Semantic Layer](#set-up-dbt-semantic-layer) in dbt Cloud
- [Connect to and query the API](#connect-and-query-api) with dbt Cloud

To fully experience the power of a universal [dbt Semantic Layer](/docs/use-dbt-semantic-layer/dbt-sl), you'll need a dbt Cloud [Team or Enterprise](https://www.getdbt.com/pricing/) account. 

## Prerequisites

- Have an understanding of key concepts in [MetricFlow](/docs/build/about-metricflow), which powers the revamped dbt Semantic Layer.
- Have both your production and development environments running dbt version 1.6 or higher. Refer to [upgrade in dbt Cloud](/docs/dbt-versions/upgrade-core-in-cloud) for more info.
- Use Snowflake, BigQuery, Databricks, Postgres (CLI only), or Redshift. (dbt Cloud Postgres support coming soon)
-  Create a successful run in the environment where you configure the Semantic Layer. 
   - **Note:** Semantic Layer currently supports the Deployment environment. (_development experience coming soon_)
- Set up the [Semantic Layer API](/docs/dbt-cloud-apis/sl-api-overview) in the integrated tool to import metric definitions. 
  - **Note:** dbt Core or Developer accounts can only query data manually using the [MetricFlow CLI](/docs/build/metricflow-cli) and SQL. To dynamically query metrics using external tools, you must have a dbt Cloud [Team or Enterprise](https://www.getdbt.com/pricing/) account with access to the Semantic Layer API.<br />
- Understand [MetricFlow's](/docs/build/about-metricflow) key concepts, which powers the revamped dbt Semantic Layer.

:::tip 
New to dbt or metrics? Try our [Jaffle shop example project](https://github.com/dbt-labs/jaffle-sl-template) to help you get started!
:::

## Create a semantic model

<CreateModel />

## Define metrics

<DefineMetrics />

## Configure the MetricFlow time spine model

<ConfigMetric />

## Test and query metrics

<TestQuery />

## Run a production job

Before you begin, you must have a dbt Cloud Team or Enterprise [multi-tenant](/docs/cloud/about-cloud/regions-ip-addresses) deployment, hosted in North America (cloud.getdbt.com login).

Once you’ve defined metrics in your dbt project, you can perform a job run in your dbt Cloud deployment environment to materialize your metrics. Only the deployment environment is supported for the dbt Semantic Layer at this moment. 

1. Go to **Deploy** in the menu bar
2. Select **Jobs** to re-run the job with the most recent code in the deployment environment.
3. Your metric should appear as a red node in the dbt Cloud IDE and dbt directed acyclic graphs (DAG).

<Lightbox src="/img/docs/dbt-cloud/semantic-layer/metrics_red_nodes.png" width="85%" title="DAG with metrics appearing as a red node" />

## Set up dbt Semantic Layer

import SlSetUp from '/snippets/_new-sl-setup.md';  

<SlSetUp/>

## Connect and query API

You can query your metrics in a JDBC-enabled tool or use existing first-class integrations with the dbt Semantic Layer. 

Before you begin, you must have a dbt Cloud Team or Enterprise [multi-tenant](/docs/cloud/about-cloud/regions-ip-addresses) deployment, hosted in North America (cloud.getdbt.com login). 

- <span>To learn how to use the JDBC API and what tools you can query it with, refer to the  <a href="https://docs.getdbt.com/docs/dbt-cloud-apis/sl-api-overview" target="_self">{frontMatter.meta.api_name}</a></span>.<br />

    * To authenticate, you need to [generate a service token](/docs/dbt-cloud-apis/service-tokens) with Semantic Layer Only and Metadata Only permissions.
    * Refer to the [SQL query syntax](/docs/dbt-cloud-apis/sl-jdbc#querying-the-api-for-metric-metadata) to query metrics using the API.  

- To learn more about the sophisticated integrations that connect to the dbt Semantic Layer, refer to [Available integrations](/docs/use-dbt-semantic-layer/avail-sl-integrations) for more info.

## FAQs

If you're encountering some issues when defining your metrics or setting up the dbt Semantic Layer, check out a list of answers to some of the questions or problems you may be experiencing.
    
<details>
  <summary>How do I migrate from the legacy Semantic Layer to the new one?</summary>
  <div>
    <div>If you're using the legacy Semantic Layer, we highly recommend you <a href="https://docs.getdbt.com/docs/dbt-versions/upgrade-core-in-cloud">upgrade your dbt version </a> to dbt v1.6 or higher to use the new dbt Semantic Layer. Refer to the dedicated <a href="https://docs.getdbt.com/guides/migration/sl-migration"> migration guide</a> for more info.</div>
  </div>
</details>
<details>
<summary>How are you storing my data?</summary>
User data passes through the Semantic Layer on its way back from the warehouse. dbt Labs ensures security by authenticating through the customer's data warehouse. Currently, we don't cache data for the long term, but it might temporarily stay in the system for up to 10 minutes, usually less. In the future, we'll introduce a caching feature that allows us to cache data on our infrastructure for up to 24 hours.
</details>
<details>
<summary>Is the dbt Semantic Layer open source?</summary>
The dbt Semantic Layer is proprietary, however, some components of the dbt Semantic Layer are open source, like dbt-core and MetricFlow. <br /><br />The universal dbt Semantic Layer is available to all Team and Enterprise Plans during public beta. Users on dbt Cloud Developer plans or dbt Core users can use MetricFlow to only define and test metrics locally.</details>

## Next steps

Review the following documents to learn more and get started:

- [About MetricFlow](/docs/build/about-metricflow)
- [Build your metrics](/docs/build/build-metrics-intro)
- [Get started with the dbt Semantic Layer](/docs/use-dbt-semantic-layer/quickstart-sl)
- [Available integrations](/docs/use-dbt-semantic-layer/avail-sl-integrations)
