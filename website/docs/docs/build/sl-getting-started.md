---
id: sl-getting-started
title: Getting started
description: "Learn how to create your first semantic model and metric."
sidebar_label: Getting started
tags: [Metrics, Semantic Layer]
---

This getting started page recommends a workflow to help you get started creating your first metrics. Here are the following steps you'll take:

- [Create a semantic model](#create-a-semantic-model)
- [Create your metric](#create-your-metric)
- [Test and upload your metric](#test-and-upload-your-metric)

## Prerequisites

- You use dbt Core with the [command line (CLI)](/docs/core/about-the-cli) and have a dbt project set up.
    * **Note**:  Support for dbt Cloud and integrations coming soon.
- You must have an understanding of key concepts in MetricFlow (which powers the revamped dbt Semantic Layer) like [measures](/docs/build/measures), [group_by](/docs/build/group_by), and [entities](/docs/build/entities) before creating your first metric. Refer to [About MetricFlow](/docs/build/metricflow-core-concepts) to learn more.
- Your dbt environment must be on [dbt version 1.6](/docs/dbt-versions/core) or higher
- You have a git repository set up and your git provider has write access enabled.
- You have a dbt project connected to a [supported data platform](/docs/supported-data-platforms) (Snowflake, BigQuery, Databricks, Redshift, Postgres, and DuckDB). 
- You have a development [environment](/docs/collaborate/environments/dbt-core-environments) and development credentials set up
- You have installed the [MetricFlow CLI package](https://github.com/dbt-labs/metricflow)

:::tip 
New to dbt or metrics? Try our [Jaffle shop example project](https://github.com/dbt-labs/jaffle-sl-template) to help you get started!
:::

## Create a semantic model

In MetricFlow, which powers the dbt Semantic Layer, there are two main objects: [semantic models](/docs/build/semantic-models) and [metrics](/docs/build/metrics-overview). You can think of semantic models as nodes in your semantic graph, connected via entities as edges. MetricFlow takes semantic models defined in YAML configuration files as inputs and creates a semantic graph that you can use to query metrics. 

This step will guide you through setting up your semantic models, which consist of [entities](/docs/build/entities), [group_by](/docs/build/group_by), and [measures](/docs/build/measures).

1. Name your semantic model, fill in appropriate metadata, and map it to a model in your dbt project. 

```yaml
semantic_models:
  name: transactions
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

3. Define your group_by and measures. group_by are properties of the records in your table that are non-aggregatable. They provide categorical or time-based context to enrich metrics. Measures are the building block for creating metrics. They are numerical columns that MetricFlow aggregates to create metrics.

```yaml
measures:
    - name: transaction_amount_usd
      description: The total USD value of the transaction.
      agg: sum
  group_by:
    - name: is_large
      type: categorical
      expr: case when transaction_amount_usd >= 30 then true else false end
```

:::tip
If you're familiar with writing SQL, you can think of group_by as the columns you would group by and measures as the columns you would aggregate.
```sql
select
  , metric_time_day --time
  , country -- categorical dimesion
  , sum(revenue_usd) --measure
from
  snowflake.fact_transactions -- sql table
  ```
:::

## Create your metric

Now that you've created your first semantic model, it's time to define your first metric. MetricFlow supports different metric types like [measure proxy](/docs/build/measure-proxy), [ratio](/docs/build/ratio), [cumulative](/docs/build/cumulative), and [derived](/docs/build/derived). You can define metrics in the same YAML files as your semantic models, or create a new file.

The example metric we'll create is a measure proxy, a metric that refers directly to a measure, based on the `transaction_amount_usd` measure, which will be implemented as a `sum()` function in SQL.

```yaml
---
metric:
  name: transaction_amount_usd
  type: simple
  type_params:
    measure: transaction_amount_usd
```

Interact and test your metric using the CLI before committing it to your MetricFlow repository.

## Test and query your metrics

Follow these steps to test and query your metrics using MetricFlow:

1. Make sure you have the `metricflow` and [dbt adapter](/docs/supported-data-platforms) installed in the CLI as you're installing MetricFlow as an extension of the dbt adapter. Currently, the supported adapters are Snowflake, BigQuery, Databricks, Redshift.
    * When you install the adapter, add `[metricflow]` at the end of the command. For example, if your adapter is Snowflake, you'll run `pip install dbt-snowflake[metricflow]`
2. Run `mf version` to see your CLI version. If you do not have the CLI installed run `pip install --upgrade metricflow`
3. Save your files and run `mf validate-configs` to validate the changes before committing them
4. Run `mf query --metrics <metric_name> --dimensions <dimension_name>` to query the metrics and dimensions you want to see in the CLI.
5. Verify that the metric values are what you expect. You can view the generated SQL if you enter `--explain` in the CLI. 
6. Then commit your changes to push them to your git repo.

<!--## Troubleshooting

ANY COMMON TROUBLESHOOTING QUESTIONS?-->

## Related docs

- [The dbt Semantic Layer: what’s next](https://www.getdbt.com/blog/dbt-semantic-layer-whats-next/) blog post
- [About MetricFlow](/docs/build/metricflow-core-concepts)
- [Semantic models](/docs/build/semantic-models)
- [Metrics](/docs/build/metrics-overview)
