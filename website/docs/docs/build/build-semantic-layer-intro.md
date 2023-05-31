---
title: "Build your Semantic Layer"
id: build-semantic-layer-intro
description: "Learn about MetricFlow and build your Semantic Layer with Semantic models and Metrics"
sidebar_label: Build your Semantic Layer
tags: [Metrics, Semantic Layer, Governance]
hide_table_of_contents: true
---

Build your semantic layer seamlessly using the dbt Semantic Layer, powered by MetricFlow. Use constructs like semantic models and metrics to avoid repetition and optimize your development workflow.

These sections explain how you can use the dbt Semantic Layer to define your metrics and [semantic graph](/docs/build/metricflow-core-concepts#semantic-graph), as well as provide data governance over how company metrics are defined and managed. 

A few things to note before you begin:

- The Semantic Layer supports Snowflake, BigQuery, Databricks, Redshift, Postgres, and DuckDB.
- You can define metrics in YAML and query them with the [command line (CLI)](/docs/core/about-the-cli) on dbt Core version 1.6 beta, using the [new Semantic Layer specifications](https://github.com/dbt-labs/dbt-core/discussions/7456).
  * Note: dbt Cloud support coming soon.
- dbt Labs is working with [integration](https://www.getdbt.com/product/semantic-layer-integrations) partners to release a beta of integrations and we're working to introduce other consumption methods like Python and JDBC. <br /><br />

<div className="grid--4-col">


<Card
    title="Quickstart"
    body="Learn how to create a semantic model, a metric, and test and upload your metric using the Semantic Layer powered by MetricFlow."
    link="/docs/build/sl-getting-started"
    icon="rocket"/>

<Card
    title="About MetricFlow"
    body="Understand MetricFlow's core concepts, key principles, and how to use this powerful tool."
    link="/docs/build/metricflow-core-concepts"
    icon="rocket"/>

  <Card
    title="Semantic model"
    body="Use Semantic models as the basis for defining data. They act as nodes in the semantic graph, with entities connecting them."
    link="/docs/build/semantic-models"
    icon="rocket"/>

  <Card
    title="Metrics"
    body="Metrics are functions that take in various parameters (such as measures, constraints) to define new quantitative indicators."
    link="/docs/build/metrics-overview"
    icon="rocket"/>   

</div> <br />


## Related docs

- [The dbt Semantic Layer: what's next](https://www.getdbt.com/blog/dbt-semantic-layer-whats-next/) blog



