---
title: "Build your Semantic Layer"
id: build-semantic-layer-intro
description: "Learn about MetricFlow and build your Semantic Layer with Semantic models and Metrics"
sidebar_label: Build your Semantic Layer
tags: [Metrics, Semantic Layer]
hide_table_of_contents: true
---

Seamlessly build your semantic layer using [semantic models](/docs/build/semantic-models) and [metrics](/docs/build/metrics-overview), avoid repetition, and  optimize your workflow with concepts you're already familiar with using dbt metrics, powered by **MetricFlow**. 

These sections explain how you can use MetricFlow to define your metrics and [semantic graph](/docs/build/metricflow-core-concepts#semantic-graph), as well as provide data governance over how company metrics are defined and managed. Supported adapters are Snowflake, BigQuery, Databricks, Redshift, Postgres, and DuckDB.

### Define and query

- Currently for the dbt Core v1.6 beta, you can can define metrics in the [command line (CLI)](/docs/core/about-the-cli) using the [dbt and MetricFlow spec](https://github.com/dbt-labs/dbt-core/discussions/7456), and query them using the CLI. 
  * Note: dbt Cloud support coming soon.
- dbt Labs are working with [integration](https://www.getdbt.com/product/semantic-layer-integrations) partners to release a beta of integrations and we're working to introduce other consumption methods like Python and JDBC. 


<div className="grid--2-col">


<Card
    title="Quickstart"
    body="Learn how to create a semantic model, metric, and test and upload your metric using MetricFlow."
    link="/docs/build/sl-getting-started"
    icon="rocket"/>

<Card
    title="About MetricFlow"
    body="Understand MetricFlow's core concepts, key principles, and how to use this powerful tool."
    link="/docs/build/metricflow-core-concepts"
    icon="rocket"/>

  <Card
    title="Semantic model"
    body="Use Semantic models in the dbt Semantic Layer as the basis for defining data. They act as nodes in the semantic graph, with entities connecting them."
    link="/docs/build/semantic-models"
    icon="rocket"/>

  <Card
    title="Metrics"
    body="Metrics are functions that take in various parameters (such as measures, constraints, or further mathematical functions) to define new quantitative indicators."
    link="/docs/build/metrics-overview"
    icon="rocket"/>   

</div> <br />


## Related docs

- [The dbt Semantic Layer: what's next](https://www.getdbt.com/blog/dbt-semantic-layer-whats-next/) blog



