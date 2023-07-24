---
id: sl-getting-started
title: Get started with MetricFlow
description: "Learn how to create your first semantic model and metric."
sidebar_label: Get started with MetricFlow
tags: [Metrics, Semantic Layer]
---

This getting started page recommends a workflow to help you get started creating your first metrics. Here are the following steps you'll take:

- [Create a semantic model](#create-a-semantic-model)
- [Create your metrics](#create-your-metrics)
- [Test and query your metrics](#test-and-query-your-metrics)

## Prerequisites

- Use the [command line (CLI)](/docs/core/about-the-cli) and have a dbt project and repository set up. 
  * Note: Support for dbt Cloud and integrations coming soon.
- Your dbt production environment must be on [dbt Core v1.6](/docs/dbt-versions/core) or higher. Support for the development environment coming soon.
- Have a dbt project connected to Snowflake or Postgres. 
  * Note: Support for BigQuery, Databricks, and Redshift coming soon.
- Have an understanding of key concepts in [MetricFlow](/docs/build/about-metricflow), which powers the revamped dbt Semantic Layer.
- Recommended &mdash; Install the [MetricFlow CLI](/docs/build/metricflow-cli) to query and test your metrics.

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

MetricFlow, which powers the dbt Semantic Layer, has two main objects: [semantic models](/docs/build/semantic-models) and [metrics](/docs/build/metrics-overview). You can think of semantic models as nodes in your semantic graph, connected via entities as edges. MetricFlow takes semantic models defined in YAML configuration files as inputs and creates a semantic graph that you can use to query metrics. 

This step will guide you through setting up your semantic models, which consists of [entities](/docs/build/entities), [dimensions](/docs/build/dimensions), and [measures](/docs/build/measures).

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

## Create your metrics

Now that you've created your first semantic model, it's time to define your first metric. MetricFlow supports different metric types like [simple](/docs/build/simple), [ratio](/docs/build/ratio), [cumulative](/docs/build/cumulative), and [derived](/docs/build/derived). You can define metrics in the same YAML files as your semantic models, or create a new file.

The example metric we'll create is a simple metric that refers directly to a measure, based on the `transaction_amount_usd` measure, which will be implemented as a `sum()` function in SQL.

```yaml
metrics:
  - name: transaction_amount_usd
    type: simple
    type_params: null
    measure: transaction_amount_usd
```

Interact and test your metric using the CLI before committing it to your MetricFlow repository.

## Test and query your metrics

Follow these steps to test and query your metrics using MetricFlow:

1. If you haven't done so already, make sure you [install MetricFlow](#install-metricflow). Refer to [MetricFlow CLI](/docs/build/metricflow-cli) for more info on commands and how to install the CLI.

2. Run `mf --help` to confirm you have MetricFlow installed, and to see the available commands. If you don't have the CLI installed, run `pip install --upgrade "dbt-metricflow[your_adapter_name]"`.  For example, if you have a Snowflake adapter, run `pip install --upgrade "dbt-metricflow[snowflake]"`.

3. Save your files and run `mf validate-configs` to validate the changes before committing them

4. Run `mf query --metrics <metric_name> --group-by <dimension_name>` to query the metrics and dimensions you want to see in the CLI.

5. Verify that the metric values are what you expect. You can view the generated SQL if you enter `--explain` in the CLI. 

6. Then commit your changes to push them to your git repo.

<!--## Troubleshooting

ANY COMMON TROUBLESHOOTING QUESTIONS?-->

## Related docs

- [The dbt Semantic Layer: what’s next](https://www.getdbt.com/blog/dbt-semantic-layer-whats-next/) blog post
- [About MetricFlow](/docs/build/about-metricflow)
- [Semantic models](/docs/build/semantic-models)
- [Metrics](/docs/build/metrics-overview)
- [MetricFlow CLI](/docs/build/metricflow-cli)
