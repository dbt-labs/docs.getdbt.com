---
id: sl-getting-started
title: Get started with MetricFlow
description: "Learn how to create your first semantic model and metric."
sidebar_label: Get started with MetricFlow
tags: [Metrics, Semantic Layer]
meta:
  api_name: dbt Semantic Layer APIs
---

import CreateModel from '/snippets/_sl-create-semanticmodel.md';
import DefineMetrics from '/snippets/_sl-define-metrics.md';
import ConfigMetric from '/snippets/_sl-configure-metricflow.md';
import TestQuery from '/snippets/_sl-test-and-query-metrics.md';
import ConnectQueryAPI from '/snippets/_sl-connect-and-query-api.md';
import RunProdJob from '/snippets/_sl-run-prod-job.md';

This getting started page presents a sample workflow to help you create your first metrics in dbt Cloud or the command line interface (CLI). It uses the [Jaffle shop example project](https://github.com/dbt-labs/jaffle-sl-template) as the project data source and is available for you to use. 

If you prefer, you can create semantic models and metrics for your own dbt project. This page will guide you on how to:

- [Create a semantic model](#create-a-semantic-model) using MetricFlow
- [Define metrics](#define-metrics) using MetricFlow
- [Test and query metrics](#test-and-query-metrics) using MetricFlow
- [Run a production job](#run-a-production-job) in dbt Cloud
- [Set up dbt Semantic Layer](#set-up-dbt-semantic-layer) in dbt Cloud
- [Connect to and query the API](#connect-and-query-api) with dbt Cloud

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

## Configure the MetricFlow time spine model

<ConfigMetric />

## Test and query metrics

<TestQuery />

## Run a production job

<RunProdJob/>

## Set up dbt Semantic Layer

import SlSetUp from '/snippets/_new-sl-setup.md';  

<SlSetUp/>

## Connect and query API

<ConnectQueryAPI/>

## FAQs

If you're encountering some issues when defining your metrics or setting up the dbt Semantic Layer, check out a list of answers to some of the questions or problems you may be experiencing.
    
<details>
  <summary>How do I migrate from the legacy Semantic Layer to the new one?</summary>
  <div>
    <div>If you're using the legacy Semantic Layer, we highly recommend you <a href="https://docs.getdbt.com/docs/dbt-versions/upgrade-core-in-cloud">upgrade your dbt version </a> to dbt v1.6 or higher to use the new dbt Semantic Layer. Refer to the dedicated <a href="https://docs.getdbt.com/guides/sl-migration"> migration guide</a> for more info.</div>
  </div>
</details>
<details>
<summary>How are you storing my data?</summary>
User data passes through the Semantic Layer on its way back from the warehouse. dbt Labs ensures security by authenticating through the customer's data warehouse. Currently, we don't cache data for the long term, but it might temporarily stay in the system for up to 10 minutes, usually less. In the future, we'll introduce a caching feature that allows us to cache data on our infrastructure for up to 24 hours.
</details>
<details>
<summary>Is the dbt Semantic Layer open source?</summary>
The dbt Semantic Layer is proprietary, however, some components of the dbt Semantic Layer are open source, like dbt-core and MetricFlow. <br /><br />dbt Cloud Developer or dbt Core users can define metrics in their project, including a local dbt Core project, using the dbt Cloud IDE or the MetricFlow CLI.  However, to experience the universal dbt Semantic Layer and access those metrics using the API or downstream tools, users will must be on a dbt Cloud <a href="https://www.getdbt.com/pricing/">Team or Enterprise plan.</a></details>

## Next steps

- [About MetricFlow](/docs/build/about-metricflow)
- [Build your metrics](/docs/build/build-metrics-intro)
- [Get started with the dbt Semantic Layer](/docs/use-dbt-semantic-layer/quickstart-sl)
- [Available integrations](/docs/use-dbt-semantic-layer/avail-sl-integrations)
- Demo on [how to define and query metrics with MetricFlow](https://www.loom.com/share/60a76f6034b0441788d73638808e92ac?sid=861a94ac-25eb-4fd8-a310-58e159950f5a)
