---
id: sl-getting-started
title: Get started with MetricFlow
description: "Learn how to create your first semantic model and metric."
sidebar_label: Get started with MetricFlow
tags: [Metrics, Semantic Layer]
meta:
  api_name: dbt Semantic Layer API
---

This getting started page recommends a workflow to help you get started creating your first metrics. Here are the following steps you'll take:

Use this guide to fully experience the power of a universal dbt Semantic Layer. Here are the following steps you'll take:

- [Create a semantic model](#create-a-semantic-model) with MetricFlow
- [Define metrics](#define-metrics) with MetricFlow
- [Test metrics](#test-metrics) with the MetricFlow
- [Run a production job](#run-a-production-job) in dbt Cloud
- [Set up dbt Semantic Layer](#set-up-dbt-semantic-layer) in dbt Cloud
- [Connect and query API](#connect-and-query-api) with dbt Cloud
- [Test and query with the CLI](#test-and-query-with-the-cli) 
  * For Developer plans or dbt Core users only

## Prerequisites

- Have an understanding of key concepts in [MetricFlow](/docs/build/about-metricflow), which powers the revamped dbt Semantic Layer.
- Have both your production and development environments running dbt version 1.6 or higher 
- Use Snowflake, BigQuery, Databricks, and Redshift data platform
- A successful run in the environment where your Semantic Layer is configured
  * Note &mdash; Deployment environment is currently supported (_development experience coming soon_)
- To query with dbt Cloud:
  * Have a dbt Cloud Team or Enterprise [multi-tenant](/docs/cloud/about-cloud/regions-ip-addresses) deployment, hosted in North America
  * Set up the [dbt Semantic Layer](/docs/use-dbt-semantic-layer/dbt-sl) and the [Semantic Layer API](/docs/dbt-cloud-apis/sl-api-overview) in the integrated tool to import metric definitions.
- To query locally:
  * dbt Core or Developer accounts must manually install the [MetricFlow CLI](/docs/build/metricflow-cli) to test or query their metrics. After installing the package, make sure you run at least one model. <br />


:::tip 
New to dbt or metrics? Try our [Jaffle shop example project](https://github.com/dbt-labs/jaffle-sl-template) to help you get started!
:::

## Install MetricFlow

Before you begin, install the [MetricFlow CLI](/docs/build/metricflow-cli) as an extension of a dbt adapter from PyPI. The MetricFlow CLI is compatible with Python versions 3.8, 3.9, 3.10 and 3.11

Use pip install `metricflow` and your [dbt adapter](/docs/supported-data-platforms):

- Create or activate your virtual environment. `python -m venv venv`
- `pip install "dbt-metricflow[your_adapter_name]"`
  * You must specify `[your_adapter_name]`. For example, run `pip install "dbt-metricflow[snowflake]"` if you use a Snowflake adapter.
 
Currently, the supported adapters are Snowflake and Postgres (BigQuery, Databricks, and Redshift coming soon). 

## Create a semantic model

Before you begin, we recommend you learn about more about [MetricFlow](/docs/build/about-metricflow) and its key concepts. There are two main objects: 

- [Semantic models](/docs/build/semantic-models) &mdash; Nodes in your semantic graph, connected via entities as edges. MetricFlow takes semantic models defined in YAML configuration files as inputs and creates a semantic graph that you can use to query metrics. 
- [Metrics](/docs/build/metrics-overview) &mdash; Can be defined in the same YAML files as your semantic models, or split into separate YAML files into any other subdirectories (provided that these subdirectories are also within the same dbt project repo).

This step will guide you through setting up your semantic models, which consist of [entities](/docs/build/entities), [dimensions](/docs/build/dimensions), and [measures](/docs/build/measures),  in your editor of choice.

1. Name your semantic model, fill in appropriate metadata, and map it to a model in your dbt project. 

```yaml
semantic_models:
  - name: transactions
    description: |
    This table captures every transaction starting July 02, 2014. Each row represents one transaction
    model: ref('fact_transactions')
  ```

2. Define your entities. These are the keys in your table that MetricFlow will use to join other semantic models. These are usually columns like `customer_id`, `transaction_id`, and so on.

```yaml
entities:
  - name: transaction
    type: primary
    expr: id_transaction
  - name: customer
    type: foreign
    expr: id_customer
  ```

3. Define your dimensions and measures. dimensions are properties of the records in your table that are non-aggregatable. They provide categorical or time-based context to enrich metrics. Measures are the building block for creating metrics. They are numerical columns that MetricFlow aggregates to create metrics.

```yaml
measures:
  - name: transaction_amount_usd
    description: The total USD value of the transaction.
    agg: sum
dimensions:
  - name: is_large
    type: categorical
    expr: case when transaction_amount_usd >= 30 then true else false end
```

:::tip
If you're familiar with writing SQL, you can think of dimensions as the columns you would group by and measures as the columns you would aggregate.
```sql
select
  metric_time_day,  -- time
  country,  -- categorical dimension
  sum(revenue_usd) -- measure
from
  snowflake.fact_transactions  -- sql table
group by metric_time_day, country  -- dimensions
  ```
:::

## Define metrics

Now that you've created your first semantic model, it's time to define your first metric. MetricFlow supports different metric types like [simple](/docs/build/simple), [ratio](/docs/build/ratio), [cumulative](/docs/build/cumulative), and [derived](/docs/build/derived). 

1. You can define metrics in the same YAML files as your semantic models, or create a new file.

2. The example metric we'll create is a simple metric that refers directly to a measure, based on the `transaction_amount_usd` measure, which will be implemented as a `sum()` function in SQL.

```yaml
metrics:
  - name: transaction_amount_usd
    type: simple
    type_params: null
    measure: transaction_amount_usd
```
 
3. Save your code and make sure you test your metrics before committing them to your repository.

To continue building out your metrics based on your organization's needs, refer to the [Build your metrics](/docs/build/build-metrics-intro) for detailed info on how to define different metric types and semantic models.

## Test metrics 

:::note
For public beta, you can't yet test metrics using the dbt Cloud IDE (support coming soon). To test metrics, you must install the [MetricFlow CLI](/docs/build/metricflow-cli).
  * dbt Core or Developer plan users can skip to [Test and query with the CLI](#test-and-query-with-the-cli) for detailed steps. 
:::

1. To test your metrics, make sure you have the MetricFlow CLI installed and up to date.
2. Run `mf --help` to confirm you have MetricFlow installed and view the available commands.
3. Run `mf validate-configs` to validate the changes before committing them

## Run a production job

Once you’ve defined metrics in your dbt project, you can perform a job run in your deployment environment to materialize your metrics. The deployment environment is only supported for the dbt Semantic Layer at this moment. 

1. Go to **Deploy** in the navigation header
2. Select **Jobs** to re-run the job with the most recent code in the deployment environment.
3. Your metric should appear as a red node in the dbt Cloud IDE and dbt directed acyclic graphs (DAG).

<Lightbox src="/img/docs/dbt-cloud/semantic-layer/metrics_red_nodes.png" width="85%" title="DAG with metrics appearing as a red node" />

## Set up dbt Semantic Layer

import SlSetUp from '/snippets/_new-sl-setup.md';  

<SlSetUp/>

## Connect and query API

Before you begin, you must have a dbt Cloud Team or Enterprise [multi-tenant](/docs/cloud/about-cloud/regions-ip-addresses) deployment, hosted in North America.

To connect and query your metrics using the dbt Semantic Layer and its API:

1. <span>Refer to the  <a href="https://docs.getdbt.com/docs/dbt-cloud-apis/sl-api-overview" target="_self">{frontMatter.meta.api_name}</a></span> to learn how to integrate with the JDBC. 
2. Once you've connected to the API, you should then set up and query metrics in your downstream tool of choice.

Refer to [Available integrations](/docs/use-dbt-semantic-layer/avail-sl-integrations) for more info.

## Test and query with the CLI

Before you begin, dbt Core or Developer plan users must first install the [MetricFlow CLI](/docs/build/metricflow-cli). 

**Test using the CLI:**

1. Make sure you have the MetricFlow CLI installed and up to date.
2. Run `mf --help` to confirm you have MetricFlow installed and view the available commands.
3. Run `mf validate-configs` to validate the changes before committing them

**Query using the CLI:**

1. Run `mf query --metrics <metric_name> --group-by <dimension_name>` to manually query the metrics and dimensions.
2. Verify that the metric values are what you expect. You can view the generated SQL if you type `--explain` in the CLI.
3. Commit and merge the code changes that contain the metric definitions.

## Related docs

- [Get started with the dbt Semantic Layer](/docs/use-dbt-semantic-layer/quickstart-sl)
- [The dbt Semantic Layer: what’s next](https://www.getdbt.com/blog/dbt-semantic-layer-whats-next/) blog post
- [About MetricFlow](/docs/build/about-metricflow)
