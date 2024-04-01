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

import SLCourses from '/snippets/_sl-course.md';

<SLCourses/>

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


## Next steps

- [dbt Semantic Layer FAQs](/docs/use-dbt-semantic-layer/sl-faqs)
- [About MetricFlow](/docs/build/about-metricflow)
- [Build your metrics](/docs/build/build-metrics-intro)
- [Available integrations](/docs/use-dbt-semantic-layer/avail-sl-integrations)
- Demo on [how to define and query metrics with MetricFlow](https://www.loom.com/share/60a76f6034b0441788d73638808e92ac?sid=861a94ac-25eb-4fd8-a310-58e159950f5a)
- [Billing](/docs/cloud/billing)

<!--
## FAQs

If you're encountering some issues when defining your metrics or setting up the dbt Semantic Layer, check out a list of answers to some of the questions or problems you may be experiencing.
import SlFaqs from '/snippets/_sl-faqs.md';

<SlFaqs/>
-->
