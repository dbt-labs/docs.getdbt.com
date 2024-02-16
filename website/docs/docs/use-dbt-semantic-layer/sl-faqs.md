---
title: "dbt Semantic Layer FAQs"
id: sl-faqs
description: "Read the FAQs to learn more about the dbt Semantic Layer, how it works, how to build metrics, integrations, and more."
sidebar_label: "Semantic Layer FAQs"
tags: [Semantic Layer]
pagination_next: "docs/use-dbt-semantic-layer/avail-sl-integrations"
---

The [dbt Semantic Layer](/docs/use-dbt-semantic-layer/dbt-sl) is a dbt Cloud offering that allows users to centrally define their metrics within their dbt project using [MetricFlow](/docs/build/about-metricflow).

The dbt Semantic Layer offers:

- Dynamic SQL generation to compute metrics,
- Use [dbt Semantic Layer APIs](/docs/dbt-cloud-apis/sl-api-overview) to query metrics and dimensions,
- First-class [integrations](/docs/use-dbt-semantic-layer/avail-sl-integrations) to query those centralized metrics in downstream tools.

The dbt Semantic Layer is powered by MetricFlow, which is a source-available component.

## Overview of the dbt Semantic Layer

<detailsToggle alt_header="What are the main benefits of using the dbt Semantic Layer?">

The primary value of the dbt Semantic Layer is to centralize and bring consistency to your metrics across your organization. Additionally, it allows you to:

- **Meet your users where they are** by being agnostic to where your end users consume data through the supporting of different APIs for integrations.
- **Optimize costs** by spending less time preparing data for consumption
- **Simplify your code** because you are not duplicating metric logic, and you are letting MetricFlow perform complex calculations for you
- **Empower stakeholder**s with rich context and a flexible but governed experiences

</detailsToggle>

<detailsToggle alt_header="What's the main difference between the dbt Semantic Layer and dbt Metrics?">
dbt Metrics is the now-deprecated dbt package that was used to define metrics within dbt. dbt Metrics has been replaced with MetricFlow, a more flexible and powerful engine, which powers the foundation of the dbt Semantic Layer today. MetricFlow introduces SQL generation to the dbt Semantic Layer and offers more advanced capabilities than dbt Metrics. A few highlights:  

- **Query construction:** dbt metrics relied on templated Jinja to construct SQL and by comparison, MetricFlow iteratively constructs queries using a dataflow plan, our internal DAG for generating SQL.
- **Joins:** MetricFlow also has a sophisticated way of handling joins, which dbt Metrics did not support. With MetricFlow you can effortlessly access all valid dimensions for your metrics on the fly, even when they are defined in different semantic models.

</detailsToggle>

<detailsToggle alt_header="Is there a dbt Semantic Layer discussion hub?">
Yes, absolutely! Join the [dbt Slack community](https://app.slack.com/client/T0VLPD22H) and [#dbt-cloud-semantic-layer](https://getdbt.slack.com/archives/C046L0VTVR6) slack channel for all things related to the dbt Semantic Layer.

</detailsToggle>

<detailsToggle alt_header="How does the dbt Semantic Layer fit with different modeling approaches (Medallion, Data Vault, Dimensional modeling)?">
The dbt Semantic Layer is flexible enough to work with many common modeling approaches. Because semantic models reference dbt models, the configuration of your semantic layer will mirror the modeling approach you’ve taken with the underlying data. The primary consideration is the flexibility and performance of the underlying queries. For example, a star schema data model will allow maximum flexibility for dimensions that are available for a given metric, but will require more joins.  On the other hand, a fully denormalized data model will be materialized to a specific grain and won’t be able to easily join to other tables. While the dbt Semantic Layer will work for both cases, we typically recommend letting MetricFlow do some level of denormalization for you in order to provide more flexibility to metric consumers.
</detailsToggle>

<detailsToggle alt_header="How is the dbt Semantic Layer priced?">
The dbt Semantic Layer measures usage in distinct Queried Metrics. Refer to the [Billing](/docs/cloud/billing#what-counts-as-a-queried-metric) to learn more about pricing.
</detailsToggle>

## How does the dbt Semantic Layer works?

## Build metrics and semantic models

## Available integrations

## Permissions and access

## Availability

## Implementation
