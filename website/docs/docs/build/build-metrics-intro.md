---
title: "Build your metrics"
id: build-metrics-intro
description: "Learn about MetricFlow and build your metrics with semantic models"
sidebar_label: Build your metrics
tags: [Metrics, Semantic Layer, Governance]
hide_table_of_contents: true
pagination_next: "guides/sl-snowflake-qs"
pagination_prev: null
---

Use MetricFlow in dbt to centrally define your metrics. As a key component of the [<Constant name="semantic_layer" />](/docs/use-dbt-semantic-layer/dbt-sl), MetricFlow is responsible for SQL query construction and defining specifications for dbt semantic models and metrics. It uses familiar constructs like semantic models and metrics to avoid duplicative coding, optimize your development workflow, ensure data governance for company metrics, and guarantee consistency for data consumers.

<Lightbox src="/img/docs/dbt-cloud/semantic-layer/sl-concept.png" width="50%" title="This diagram shows how the dbt Semantic Layer works with your data stack." />

MetricFlow allows you to:
- Intuitively define metrics in your dbt project
- Develop from your preferred environment, whether that's the [<Constant name="cloud" /> CLI](/docs/cloud/cloud-cli-installation), [<Constant name="cloud_ide" />](/docs/cloud/studio-ide/develop-in-studio), or [<Constant name="core" />](/docs/core/installation-overview)
- Use [MetricFlow commands](/docs/build/metricflow-commands) to query and test those metrics in your development environment 
- Harness the true magic of the universal <Constant name="semantic_layer" /> and dynamically query these metrics in downstream tools (Available for <Constant name="cloud" /> [Starter, Enterprise, or Enterprise+](https://www.getdbt.com/pricing/) accounts only).

<div className="grid--3-col">

 <Card
    title="Quickstart for the dbt Semantic Layer"
    body="Use this guide to build and define metrics, set up the dbt Semantic Layer, and query them using downstream tools."
    link="/guides/sl-snowflake-qs"
    icon="dbt-bit"/>

<Card
    title="About MetricFlow"
    body="Understand MetricFlow's core concepts, how to use joins, how to save commonly used queries, and what commands are available."
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
    title="Advanced topics"
    body="Learn about advanced topics for dbt Semantic Layer and MetricFlow, such as data modeling workflows, and more."
    link="/docs/build/advanced-topics"
    icon="dbt-bit"/>

  <Card
    title="About the dbt Semantic Layer"
    body="Introducing the dbt Semantic Layer, the universal process that allows data teams to centrally define and query metrics"
    link="/docs/use-dbt-semantic-layer/dbt-sl"
    icon="dbt-bit"/>

  <Card
    title="Available integrations"
    body="Discover the diverse range of partners that seamlessly integrate with the powerful dbt Semantic Layer, allowing you to query and unlock valuable insights from your data ecosystem."
    link="/docs/cloud-integrations/avail-sl-integrations"
    icon="dbt-bit"/>

</div> <br />

## Related docs

- [Quickstart guide with the <Constant name="semantic_layer" />](/guides/sl-snowflake-qs)
- [The <Constant name="semantic_layer" />: what's next](https://www.getdbt.com/blog/dbt-semantic-layer-whats-next/) blog
- [<Constant name="semantic_layer" /> on-demand course](https://learn.getdbt.com/courses/semantic-layer)
- [<Constant name="semantic_layer" /> FAQs](/docs/use-dbt-semantic-layer/sl-faqs)
