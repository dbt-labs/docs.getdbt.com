---
title: "Build your metrics"
id: build-metrics-intro
description: "Learn about MetricFlow and build your metrics with semantic models"
sidebar_label: Build your metrics
tags: [Metrics, Semantic Layer, Governance]
hide_table_of_contents: true
---


Define your metrics centrally in dbt using MetricFlow, which powers the dbt Semantic Layer. Use constructs like semantic models and metric to avoid repetition and optimize your development workflow. 

MetricFlow is a key component of the [dbt Semantic Layer](/docs/use-dbt-semantic-layer/dbt-semantic-layer). It handles SQL query construction and defines the specification for dbt semantic models and metrics. To fully experience the dbt Semantic Layer, including the ability to query dbt metrics via external integrations, you'll need a [dbt Cloud Team or Enterprise account](https://www.getdbt.com/pricing/).


This section explains how to use MetricFlow for defining metrics and [semantic graph](/docs/build/metricflow-core-concepts#semantic-graph), and ensuring data governance for company metrics. Before you start, keep the following considerations in mind:

- For dbt Core version 1.6 beta, you can define metrics in YAML and query them with the [command line (CLI)](/docs/core/about-the-cli) sing the [new metric specifications](https://github.com/dbt-labs/dbt-core/discussions/7456).
  * **Note**: Support for dbt Cloud and querying via external integrations coming soon.


- MetricFlow supports Snowflake, BigQuery, Databricks, Redshift, Postgres, and DuckDB.

- dbt Labs is working with [integration partners](https://www.getdbt.com/product/semantic-layer-integrations) to develop updated integrations for the new Semantic Layer, powered by MetricFlow, in addition to introducing other consumption methods like Python and JDBC. <br /><br />

<div className="grid--4-col">


<Card
    title="Get started"
    body="Learn how to create a semantic model, a metric, and test and upload your metric using MetricFlow."
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
    body="Define metrics through the powerful combination of measures, constraints, or functions, effortlessly organized in either YAML files or separate files."
    link="/docs/build/metrics-overview"
    icon="rocket"/>   

</div> <br />


## Related docs

- [The dbt Semantic Layer: what's next](https://www.getdbt.com/blog/dbt-semantic-layer-whats-next/) blog



