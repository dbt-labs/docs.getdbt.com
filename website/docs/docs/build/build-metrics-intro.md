---
title: "Build your metrics"
id: build-metrics-intro
description: "Learn about MetricFlow and build your metrics with semantic models"
sidebar_label: Build your metrics
tags: [Metrics, Semantic Layer, Governance]
hide_table_of_contents: true
---

Use MetricFlow in dbt to centrally define your metrics. As a key component of the [dbt Semantic Layer](/docs/use-dbt-semantic-layer/dbt-sl), MetricFlow is responsible for SQL query construction and defining specifications for dbt semantic models and metrics. It uses familiar constructs like semantic models and metrics to avoid duplicative coding, optimize your development workflow, ensure data governance for company metrics, and guarantee consistency for data consumers.

MetricFlow allows you to define metrics in your dbt project whether in dbt Cloud or dbt Core:
- For dbt Cloud users:
  - Define metrics in the [dbt Cloud IDE](/docs/cloud/dbt-cloud-ide/develop-in-the-cloud) or with the [dbt Cloud CLI](/docs/cloud/cloud-cli-installation) using the commands in [MetricFlow dbt Cloud](/docs/build/metricflow-cloud).
  
- For dbt Core users:
  - You can define metrics using commands in [MetricFlow dbt Core](/docs/build/metricflow-cli).

However, to experience the power of the universal [dbt Semantic Layer](/docs/use-dbt-semantic-layer/dbt-sl) and query those metrics in downstream tools, you'll need a dbt Cloud [Team or Enterprise](https://www.getdbt.com/pricing/) account. 

<div className="grid--3-col">

<Card
    title="About MetricFlow"
    body="Understand MetricFlow's core concepts, key principles, and how to use this powerful tool."
    link="/docs/build/about-metricflow"
    icon="dbt-bit"/>

  <Card
    title="Semantic model"
    body="Use semantic models as the basis for defining data. They act as nodes in the semantic graph, with entities connecting them."
    link="/docs/build/semantic-models"
    icon="dbt-bit"/>

  <Card
    title="Metrics"
    body="Define metrics through the powerful combination of measures, constraints, or functions, effortlessly organized in either YAML files or separate files."
    link="/docs/build/metrics-overview"
    icon="dbt-bit"/>

  <Card
    title="About the dbt Semantic Layer"
    body="Introducing the dbt Semantic Layer, the universal process that allows data teams to centrally define and query metrics"
    link="/docs/use-dbt-semantic-layer/dbt-sl"
    icon="dbt-bit"/>

 <Card
    title="Get started with the dbt Semantic Layer"
    body="Use this guide to build and define metrics, set up the dbt Semantic Layer, and query them using the Semantic Layer API"
    link="/docs/use-dbt-semantic-layer/quickstart-sl"
    icon="dbt-bit"/>

  <Card
    title="Available integrations"
    body="Discover the diverse range of partners that seamlessly integrate with the powerful dbt Semantic Layer, allowing you to query and unlock valuable insights from your data ecosystem."
    link="/docs/use-dbt-semantic-layer/avail-sl-integrations"
    icon="dbt-bit"/>


</div> <br />


## Related docs

- [The dbt Semantic Layer: what's next](https://www.getdbt.com/blog/dbt-semantic-layer-whats-next/) blog
- [Get started with MetricFlow](/docs/build/sl-getting-started)


