---
id: sl-getting-started
title: Get started with MetricFlow
description: "Learn how to create your first semantic model and metric."
sidebar_label: Get started with MetricFlow
tags: [Metrics, Semantic Layer]
meta:
  api_name: dbt Semantic Layer API
---

This getting started page presents a sample workflow to help you create your first metrics. It uses the [Jaffle shop example project](https://github.com/dbt-labs/jaffle-sl-template) as the project data source and is available for you to use. If you prefer, you can create semantic models and metrics for your own dbt project.

To fully experience the power of a universal dbt Semantic Layer, take the following steps:

- [Create a semantic model](#create-a-semantic-model) with MetricFlow
- [Define metrics](#define-metrics) with MetricFlow
- [Test and query metrics](#test-and-query-metrics) with MetricFlow
- [Run a production job](#run-a-production-job) in dbt Cloud
- [Set up dbt Semantic Layer](#set-up-dbt-semantic-layer) in dbt Cloud
- [Connect to and query the API](#connect-and-query-api) with dbt Cloud

## Prerequisites

- Have an understanding of key concepts in [MetricFlow](/docs/build/about-metricflow), which powers the revamped dbt Semantic Layer.
- Have both your production and development environments running dbt version 1.6 or higher. Refer to [upgrade in dbt Cloud](/docs/dbt-versions/upgrade-core-in-cloud) for more info.
- Use Snowflake, BigQuery, Databricks, or Redshift data platform
- A successful run in the environment where your Semantic Layer is configured
- To query with dbt Cloud:
  * Have a dbt Cloud Team or Enterprise [multi-tenant](/docs/cloud/about-cloud/regions-ip-addresses) deployment, hosted in North America (Other regions coming soon)
  * Set up the [dbt Semantic Layer](/docs/use-dbt-semantic-layer/dbt-sl) and the [Semantic Layer API](/docs/dbt-cloud-apis/sl-api-overview) in the integrated tool to import metric definitions.
- To query locally:
  * dbt Core or Developer accounts must manually install the [MetricFlow CLI](/docs/build/metricflow-cli) to test or query their metrics. After installing the package, make sure you run at least one model. <br />


:::tip 
New to dbt or metrics? Try our [Jaffle shop example project](https://github.com/dbt-labs/jaffle-sl-template) to help you get started!
:::

## Install MetricFlow

Before you begin, install the [MetricFlow CLI](/docs/build/metricflow-cli) as an extension of a dbt adapter from PyPI. The MetricFlow CLI is compatible with Python versions 3.8, 3.9, 3.10 and 3.11

Use pip install `metricflow` and your [dbt adapter](/docs/supported-data-platforms):

- Create or activate your virtual environment. `python -m venv venv` or `source your-venv/bin/activate`
- Run `pip install "dbt-metricflow[your_adapter_name]"`
  * You must specify `[your_adapter_name]`. For example, run `pip install "dbt-metricflow[snowflake]"` if you use a Snowflake adapter.
 
## Create a semantic model

The following steps will walk you through setting up semantic models in your dbt project, which consist of [entities](/docs/build/entities), [dimensions](/docs/build/dimensions), and [measures](/docs/build/measures).  

We highly recommend you read the overview of what a [semantic model](https://docs.getdbt.com/docs/build/semantic-models) is before getting started. If you're working in the [Jaffle shop example](https://github.com/dbt-labs/jaffle-sl-template), delete the `orders.yml` config or delete the .yml extension so it's ignored during parsing. **We'll be rebuilding it step by step in this example.** 

If you're following the guide in your own project, pick a model that you want to build a semantic manifest from and fill in the config values accordingly. 

1. Create a new yml config file for the orders model, such as `orders.yml`. 

It's best practice to create semantic models in the `/models/semantic_models` directory in your project. Semantic models are nested under the `semantic_models` key. First, fill in the name and appropriate metadata, map it to a model in your dbt project, and specify model defaults. For now, `default_agg_time_dimension` is the only supported default. 

```yaml
semantic_models:
  #The name of the semantic model.
  - name: orders
    defaults:
      agg_time_dimension: ordered_at
    description: |
      Order fact table. This table is at the order grain with one row per order. 
    #The name of the dbt model and schema
    model: ref('orders')
  ```

2. Define your entities. These are the keys in your table that MetricFlow will use to join other semantic models. These are usually columns like `customer_id`, `order_id`, and so on.

```yaml
  #Entities. These usually correspond to keys in the table.
    entities:
      - name: order_id
        type: primary
      - name: location
        type: foreign
        expr: location_id
      - name: customer
        type: foreign
        expr: customer_id
  ```

3. Define your dimensions and measures. Dimensions are properties of the records in your table that are non-aggregatable. They provide categorical or time-based context to enrich metrics. Measures are the building block for creating metrics. They are numerical columns that MetricFlow aggregates to create metrics.

```yaml
    #Measures. These are the aggregations on the columns in the table.
    measures: 
      - name: order_total
        description: The total revenue for each order.
        agg: sum
      - name: order_count
        expr: 1
        agg: sum
      - name: tax_paid
        description: The total tax paid on each order. 
        agg: sum
      - name: customers_with_orders
        description: Distinct count of customers placing orders
        agg: count_distinct
        expr: customer_id
      - name: locations_with_orders
        description: Distinct count of locations with order
        expr: location_id
        agg: count_distinct
      - name: order_cost
        description: The cost for each order item. Cost is calculated as a sum of the supply cost for each order item. 
        agg: sum
  #Dimensions. Either categorical or time. These add additional context to metrics. The typical querying pattern is Metric by Dimension.  
    dimensions:
      - name: ordered_at
        type: time
        type_params:
          time_granularity: day 
      - name: order_total_dim
        type: categorical
        expr: order_total
      - name: is_food_order
        type: categorical
      - name: is_drink_order
        type: categorical  
```

Putting it all together, a complete semantic model configurations based on the order model would look like the following example:

```yaml
semantic_models:
  #The name of the semantic model.
  - name: orders
    defaults:
      agg_time_dimension: ordered_at
    description: |
      Order fact table. This table is at the order grain with one row per order. 
    #The name of the dbt model and schema
    model: ref('orders')
    #Entities. These usually corespond to keys in the table.
    entities:
      - name: order_id
        type: primary
      - name: location
        type: foreign
        expr: location_id
      - name: customer
        type: foreign
        expr: customer_id
    #Measures. These are the aggregations on the columns in the table.
    measures: 
      - name: order_total
        description: The total revenue for each order.
        agg: sum
      - name: order_count
        expr: 1
        agg: sum
      - name: tax_paid
        description: The total tax paid on each order. 
        agg: sum
      - name: customers_with_orders
        description: Distinct count of customers placing orders
        agg: count_distinct
        expr: customer_id
      - name: locations_with_orders
        description: Distinct count of locations with order
        expr: location_id
        agg: count_distinct
      - name: order_cost
        description: The cost for each order item. Cost is calculated as a sum of the supply cost for each order item. 
        agg: sum
    #Dimensions. Either categorical or time. These add additional context to metrics. The typical querying pattern is Metric by Dimension.  
    dimensions:
      - name: ordered_at
        type: time
        type_params:
          time_granularity: day 
      - name: order_total_dim
        type: categorical
        expr: order_total
      - name: is_food_order
        type: categorical
      - name: is_drink_order
        type: categorical  
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

Now that you've created your first semantic model, it's time to define your first metric! MetricFlow supports different metric types like [simple](/docs/build/simple), [ratio](/docs/build/ratio), [cumulative](/docs/build/cumulative), and [derived](/docs/build/derived). It's recommended that you read the [metrics overview docs](/docs/build/metrics-overview) before getting started. 

1. You can define metrics in the same YAML files as your semantic models or create a new file. If you want to create your metrics in a new file, create another directory called `/models/metrics`. The file structure for metrics can become more complex from here if you need to further organize your metrics, for example, by data source or business line. 

2. The example metric we'll create is a simple metric that refers directly to the the `order_total` measure, which will be implemented as a `sum()` function in SQL. Again, if you're working in the Jaffle shop sandbox, we recommend deleting the original `orders.yml` file, or removing the .yml extension so it's ignored during parsing. We'll be rebuilding the `order_total` metric from scratch. If you're working in your own project, create a simple metric like the one below using one of the measures you created in the previous step. 

```yaml
metrics:
  - name: order_total
    description: Sum of total order amonunt. Includes tax + revenue.
    type: simple
    label: Order Total
    type_params:
      measure: order_total
```
 
3. Save your code, and in the next section, you'll validate your configs before committing them to your repository.

To continue building out your metrics based on your organization's needs, refer to the [Build your metrics](/docs/build/build-metrics-intro) for detailed info on how to define different metric types and semantic models.

## Configure the MetricFlow time spine model

MetricFlow requires a time spine for certain metric types and join resolution patterns, like cumulative metrics. You will have to create this model in your dbt project. [This article](/docs/build/metricflow-time-spine) explains how to add the `metricflow_time_spine` model to your project.

## Test and query metrics

This section will explain how you can test and query metrics locally. Before you begin, refer to [MetricFlow CLI](/docs/build/metricflow-cli) for instructions on installing it and a reference for the CLI commands.

:::tip
- dbt Cloud Team or Enterprise &mdash; For public beta, querying metrics in the dbt Cloud IDE isn't yet supported (Coming soon). You'll still be able to run semantic validation on your metrics in the IDE to ensure they are defined correctly. You can also use the MetricFlow CLI to test and query metrics locally. Alternatively, you can test using SQL client tools like DataGrip, DBeaver, or RazorSQL.

- dbt Core or Developer plan &mdash; Users can only test and query metrics manually using the CLI, but won't be able to use the dbt Semantic Layer to dynamically query metrics.
:::

**Query and commit your metrics using the CLI:**

MetricFlow needs a semantic_manifest.json in order to build a semantic graph. To generate a semantic_manifest.json artifact run `dbt parse`. This will create the file in your `/target` directory. If you're working from the Jaffle shop example, run `dbt seed && dbt run` before preceding to ensure the data exists in your warehouse. 

1. Make sure you have the MetricFlow CLI installed and up to date.
2. Run `mf --help` to confirm you have MetricFlow installed and view the available commands.
3. Run `mf query --metrics <metric_name> --group-by <dimension_name>` to query the metrics and dimensions. For example, `mf query --metrics order_total --group-by metric_time`
4. Verify that the metric values are what you expect. To further understand how the metric is being generated, you can view the generated SQL if you type `--explain` in the CLI.
5. Run `mf validate-configs` to run validation on your semantic models and metrics. 
6. Commit and merge the code changes that contain the metric definitions.

## Run a production job

Before you begin, you must have a dbt Cloud Team or Enterprise [multi-tenant](/docs/cloud/about-cloud/regions-ip-addresses) deployment, hosted in North America.

Once you’ve defined metrics in your dbt project, you can perform a job run in your dbt Cloud deployment environment to materialize your metrics. Only the deployment environment is supported for the dbt Semantic Layer at this moment. 

1. Go to **Deploy** in the menu bar
2. Select **Jobs** to re-run the job with the most recent code in the deployment environment.
3. Your metric should appear as a red node in the dbt Cloud IDE and dbt directed acyclic graphs (DAG).

<Lightbox src="/img/docs/dbt-cloud/semantic-layer/metrics_red_nodes.png" width="85%" title="DAG with metrics appearing as a red node" />

## Set up dbt Semantic Layer

import SlSetUp from '/snippets/_new-sl-setup.md';  

<SlSetUp/>

## Connect and query API

You must have a dbt Cloud Team or Enterprise [multi-tenant](/docs/cloud/about-cloud/regions-ip-addresses) deployment, hosted in North America. You can query your metrics in a JDBC-enabled tool or use existing first-class integrations with the dbt Semantic Layer.

To connect and query your metrics using the dbt Semantic Layer and its API:

1. <span>Refer to the  <a href="https://docs.getdbt.com/docs/dbt-cloud-apis/sl-api-overview" target="_self">{frontMatter.meta.api_name}</a></span> to learn how to integrate with the JDBC. 
2. Once you've connected to the API, you should then set up and query metrics in your downstream tool of choice.

Refer to [Available integrations](/docs/use-dbt-semantic-layer/avail-sl-integrations) for more info.

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

## Related docs

- [Get started with the dbt Semantic Layer](/docs/use-dbt-semantic-layer/quickstart-sl)
- [The dbt Semantic Layer: what’s next](https://www.getdbt.com/blog/dbt-semantic-layer-whats-next/) blog post
- [About MetricFlow](/docs/build/about-metricflow)
