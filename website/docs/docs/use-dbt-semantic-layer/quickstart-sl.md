---
title: "Get started with the dbt Semantic Layer"
id: quickstart-sl
description: "Use this guide to build and define metrics, set up the dbt Semantic Layer, and query them using the Semantic Layer APIs."
sidebar_label: "Get started with the dbt Semantic Layer"
tags: [Semantic Layer]
meta:
  api_name: dbt Semantic Layer APIs
---


import CreateModel from '/snippets/_sl-create-semanticmodel.md';
import DefineMetrics from '/snippets/_sl-define-metrics.md';
import ConfigMetric from '/snippets/_sl-configure-metricflow.md';
import TestQuery from '/snippets/_sl-test-and-query-metrics.md';
import ConnectQueryAPI from '/snippets/_sl-connect-and-query-api.md';
import RunProdJob from '/snippets/_sl-run-prod-job.md';


The dbt Semantic Layer, powered by [MetricFlow](/docs/build/about-metricflow), simplifies defining and using critical business metrics. It centralizes metric definitions, eliminates duplicate coding, and ensures consistent self-service access to metrics in downstream tools. 

MetricFlow, a powerful component of the dbt Semantic Layer, simplifies the creation and management of company metrics. It offers flexible abstractions, SQL query generation, and enables fast retrieval of metric datasets from a data platform.

Use this guide to fully experience the power of the universal dbt Semantic Layer. Here are the following steps you'll take:

- [Create a semantic model](#create-a-semantic-model) in dbt Cloud using MetricFlow
- [Define metrics](#define-metrics) in dbt using MetricFlow
- [Test and query metrics](#test-and-query-metrics) with MetricFlow 
- [Run a production job](#run-a-production-job) in dbt Cloud
- [Set up dbt Semantic Layer](#setup) in dbt Cloud 
- [Connect and query API](#connect-and-query-api) with dbt Cloud

MetricFlow allows you to define metrics in your dbt project and query them whether in dbt Cloud or dbt Core with [MetricFlow commands](/docs/build/metricflow-commands).

However, to experience the power of the universal [dbt Semantic Layer](/docs/use-dbt-semantic-layer/dbt-sl) and query those metrics in downstream tools, you'll need a dbt Cloud [Team or Enterprise](https://www.getdbt.com/pricing/) account. 

## Prerequisites

import SetUp from '/snippets/_v2-sl-prerequisites.md';

<SetUp />

:::tip 
New to dbt or metrics? Try our [Jaffle shop example project](https://github.com/dbt-labs/jaffle-sl-template) to help you get started!
:::

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


## FAQs

If you're encountering some issues when defining your metrics or setting up the dbt Semantic Layer, check out a list of answers to some of the questions or problems you may be experiencing.
    
import SlFaqs from '/snippets/_sl-faqs.md';

<SlFaqs/>


## Next steps
- [Set up dbt Semantic Layer](/docs/use-dbt-semantic-layer/setup-dbt-sl)
- [Available integrations](/docs/use-dbt-semantic-layer/avail-sl-integrations)
- Demo on [how to define and query metrics with MetricFlow](https://www.loom.com/share/60a76f6034b0441788d73638808e92ac?sid=861a94ac-25eb-4fd8-a310-58e159950f5a)
- [Billing](/docs/cloud/billing)
