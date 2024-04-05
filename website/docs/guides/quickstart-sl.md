---
title: "Get started with the dbt Semantic Layer"
id: quickstart-sl
description: "Use this guide to build and define metrics, set up the dbt Semantic Layer, and query them using the Semantic Layer APIs."
sidebar_label: "Get started with the dbt Semantic Layer"
tags: [Semantic Layer]
meta:
  api_name: dbt Semantic Layer APIs
icon: 'guides'
hide_table_of_contents: true
tags: ['Semantic Layer','Metrics']
keywords: ['dbt Semantic Layer','Metrics','dbt Cloud']
level: 'Intermediate'
recently_updated: true
---

import CreateModel from '/snippets/_sl-create-semanticmodel.md';
import DefineMetrics from '/snippets/_sl-define-metrics.md';
import ConfigMetric from '/snippets/_sl-configure-metricflow.md';
import TestQuery from '/snippets/_sl-test-and-query-metrics.md';
import ConnectQueryAPI from '/snippets/_sl-connect-and-query-api.md';
import RunProdJob from '/snippets/_sl-run-prod-job.md';

<VersionBlock lastVersion="1.5">

import DeprecationNotice from '/snippets/_sl-deprecation-notice.md';

<DeprecationNotice />
 
 </VersionBlock>

The dbt Semantic Layer, powered by [MetricFlow](/docs/build/about-metricflow), simplifies defining and using critical business metrics. It centralizes metric definitions, eliminates duplicate coding, and ensures consistent self-service access to metrics in downstream tools.

MetricFlow, a powerful component of the dbt Semantic Layer, simplifies the creation and management of company metrics. It offers flexible abstractions, SQL query generation, and enables fast retrieval of metric datasets from a data platform.

## Introduction 
In this quickstart guide, you'll learn how to configure the Semantic Layer in dbt Cloud project, with Snowflake as your data warehouse. It will show you how to:

- Create a new Snowflake worksheet.
- Load sample data into your Snowflake account.
- Connect dbt Cloud to Snowflake.
- Build out an example dbt Cloud project
- Create a semantic model in dbt Cloud using MetricFlow
- Define metrics in dbt using MetricFlow
- Test and query metrics with MetricFlow
- Run a production job in dbt Cloud
- Set up dbt Semantic Layer in dbt Cloud
- Connect and query API with dbt Cloud


MetricFlow allows you to define metrics in your dbt project and query them whether in dbt Cloud or dbt Core with [MetricFlow commands](/docs/build/metricflow-commands).

However, to experience the power of the universal [dbt Semantic Layer](/docs/use-dbt-semantic-layer/dbt-sl) and query those metrics in downstream tools, you'll need a dbt Cloud [Team or Enterprise](https://www.getdbt.com/pricing/) account.

import SLCourses from '/snippets/_sl-course.md';

<SLCourses/>

## Prerequisites

- You have a [dbt Cloud](https://www.getdbt.com/signup/) Team or Enterprise account
  - Suitable for both Multi-tenant and Single-tenant deployment. Note, Single-tenant accounts should contact their account representative for necessary setup and enablement.
- You have both your production and development environments running [dbt version 1.6 or higher](/docs/dbt-versions/upgrade-dbt-version-in-cloud) or[ Keep on latest version](/docs/dbt-versions/upgrade-dbt-version-in-cloud#keep-on-latest-version).
- You have a [trial Snowflake account.](https://signup.snowflake.com/)
  - Select the Enterprise edition: During trial account creation, make sure to choose the Enterprise Snowflake edition so you have ACCOUNTADMIN access. For a full implementation, you should consider organizational questions when choosing a cloud provider. For more information, see [Introduction to Cloud Platforms](https://docs.snowflake.com/en/user-guide/intro-cloud-platforms) in the Snowflake docs.
  - Choose a cloud provider and region: Before proceeding, you will need to select a cloud provider. For this setup, all cloud providers and regions will work so choose whichever you’d like.
- Have a basic understanding of SQL and dbt (meaning you either used dbt before or completed the [dbt Fundamentals](https://courses.getdbt.com/collections) course).

## Create a new Snowflake worksheet

1. Log in to your trial Snowflake account.
2. In the Snowflake user interface (UI), click **+ Worksheet** in the upper right corner.
3. Select **SQL Worksheet** to create a new worksheet.

ADD IMAGE HERE

## Set up your Snowflake Environment
The data used here is stored as CSV files in a public S3 bucket and the following steps will guide you through how to prepare your Snowflake account for that data and upload it.

1. Create a new virtual warehouse, two new databases (one for raw data, the other for future dbt development), and two new schemas (one for jaffle_shop data, the other for stripe data).

To do this, run the following SQL commands one by one. Type them into the Editor of your new Snowflake SQL worksheet to set up your environment. 

## Create a semantic model

<CreateModel />

## Define metrics

<DefineMetrics />

## Test and query metrics

<TestQuery />

## Run a production job


<RunProdJob/>


<details>

<summary>What’s happening internally?</summary>
- Merging the code into your main branch allows dbt Cloud to pull those changes and builds the definition in the manifest produced by the run. <br />
- Re-running the job in the deployment environment helps materialize the models, which the metrics depend on, in the data platform. It also makes sure that the manifest is up to date.<br />
- The Semantic Layer APIs pulls in the most recent manifest and allows your integration information to extract metadata from it.
</details>

## Set up dbt Semantic Layer

import SlSetUp from '/snippets/_new-sl-setup.md';  

<SlSetUp/>


## Connect and query API

<ConnectQueryAPI/>

## Next steps

- [dbt Semantic Layer FAQs](/docs/use-dbt-semantic-layer/sl-faqs)
- [Set up dbt Semantic Layer](/docs/use-dbt-semantic-layer/setup-sl)
- [Available integrations](/docs/use-dbt-semantic-layer/avail-sl-integrations)
- Demo on [how to define and query metrics with MetricFlow](https://www.loom.com/share/60a76f6034b0441788d73638808e92ac?sid=861a94ac-25eb-4fd8-a310-58e159950f5a)
- [Billing](/docs/cloud/billing)
