---
title: "dbt Semantic Layer architecture"
id: sl-architecture
description: "dbt Semantic Layer product architecture and related questions."
sidebar_label: "Semantic Layer architecture"
tags: [Semantic Layer]
---

The <Constant name="semantic_layer" /> allows you to define metrics and use various interfaces to query them. The <Constant name="semantic_layer" /> does the heavy lifting to find where the queried data exists in your data platform and generates the SQL to make the request (including performing joins). 

<DocCarousel slidesPerView={1} autoHeight={true}>
<Lightbox src="/img/docs/dbt-cloud/semantic-layer/sl-concept.png" width="80%" title="This diagram shows how the dbt Semantic Layer works with your data stack." />
<Lightbox src="/img/docs/dbt-cloud/semantic-layer/sl-architecture.jpg" width="85%" title="The diagram displays how your data flows using the dbt Semantic Layer and the variety of integration tools it supports."/>
</DocCarousel>

## Components

The <Constant name="semantic_layer" /> includes the following components:

| Components | Information | <Constant name="core" /> users | Developer plans |  Starter plans | Enterprise-tier plans | License |
| --- | --- | :---: | :---: | :---: | :---: | :---: |
| **[MetricFlow](/docs/build/about-metricflow)** | MetricFlow in dbt allows users to centrally define their semantic models and metrics with YAML specifications. | ✅ | ✅ | ✅ |  ✅  | [Apache 2.0 license](https://github.com/dbt-labs/metricflow/blob/main/LICENSE)|
| **dbt Semantic interfaces**| A configuration spec for defining metrics, dimensions, how they link to each other, and how to query them. The [dbt-semantic-interfaces](https://github.com/dbt-labs/dbt-semantic-interfaces) is available under Apache 2.0. | ❌ | ❌ | ✅ | ✅ | Proprietary, Cloud (Starter & Enterprise)|
| **Service layer** | Coordinates query requests and dispatching the relevant metric query to the target query engine. This is provided through <Constant name="cloud" /> and is available to all users on dbt version 1.6 or later. The service layer includes a Gateway service for executing SQL against the data platform. | ❌ | ❌ | ✅ | ✅ | Proprietary, Cloud (Starter, Enterprise, Enterprise+)|
| **[<Constant name="semantic_layer" /> APIs](/docs/dbt-cloud-apis/sl-api-overview)** | The interfaces allow users to submit metric queries using GraphQL and JDBC APIs. They also serve as the foundation for building first-class integrations with various tools. | ❌ | ❌ | ✅ | ✅ | Proprietary, Cloud (Starter, Enterprise, Enterprise+)|

## Feature comparison

The following table compares the features available in <Constant name="cloud" /> and source available in <Constant name="core" />:

| Feature | MetricFlow Source available | <Constant name="semantic_layer" /> with <Constant name="cloud" /> |
| ----- | :------: | :------: |
| Define metrics and semantic models in dbt using the MetricFlow spec | ✅ | ✅ |
| Generate SQL from a set of config files | ✅ | ✅ |
| Query metrics and dimensions through the command line interface (CLI) | ✅ | ✅ |
| Query dimension, entity, and metric metadata  through the CLI | ✅ | ✅ |
| Query metrics and dimensions through semantic APIs (ADBC, GQL)  | ❌ | ✅ |
| Connect to downstream integrations (Tableau, Hex, Mode, Google Sheets, and so on.) | ❌ | ✅ |
| Create and run Exports to save metrics queries as tables in your data platform. | ❌ | ✅ |

## Related docs
- [<Constant name="semantic_layer" /> FAQs](/docs/use-dbt-semantic-layer/sl-faqs)
