---
title: "dbt Semantic Layer"
id: dbt-sl
description: "Learn how the dbt Semantic Layer enables data teams to centrally define and query metrics."
sidebar_label: "About the dbt Semantic Layer"
tags: [Semantic Layer]
hide_table_of_contents: false
pagination_next: "guides/sl-snowflake-qs"
pagination_prev: null
---

# dbt Semantic Layer <Lifecycle status="self_service,managed,managed_plus" />

<IntroText>

The dbt Semantic Layer eliminates duplicate coding by allowing data teams to define metrics on top of existing models and automatically handling data joins.

</IntroText>

The dbt Semantic Layer, powered by [MetricFlow](/docs/build/about-metricflow), simplifies the process of defining and using critical business metrics, like `revenue` in the modeling layer (your dbt project). By centralizing metric definitions, data teams can ensure consistent self-service access to these metrics in downstream data tools and applications.

Moving metric definitions out of the BI layer and into the modeling layer allows data teams to feel confident that different business units are working from the same metric definitions, regardless of their tool of choice. If a metric definition changes in dbt, it’s refreshed everywhere it’s invoked and creates consistency across all applications. To ensure secure access control, the <Constant name="semantic_layer" /> implements robust [access permissions](/docs/use-dbt-semantic-layer/setup-sl#set-up-dbt-semantic-layer) mechanisms.

Refer to the [<Constant name="semantic_layer" /> FAQs](/docs/use-dbt-semantic-layer/sl-faqs) or [Why we need a universal semantic layer](https://www.getdbt.com/blog/universal-semantic-layer/)  blog post to learn more.

<div style={{ display: 'flex', justifyContent: 'center', }}>
<iframe width="850" height="510" position="relative" src="https://www.youtube.com/embed/DS7Ub_CmBR0?si=m92hLmxw1VuE6KKO" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

## Get started with the dbt Semantic Layer

<!-- this partial lives here: https://github.com/dbt-labs/docs.getdbt.com/website/snippets/_sl-plan-info. Use it on diff pages and to tailor the message depending which instance can access the SL and what product lifecycle we're in. -->

import Features from '/snippets/_sl-plan-info.md'

<Features
product="dbt Semantic Layer"
plan="dbt Starter or Enterprise-tier"
/>

:::info Not yet supported in the dbt Fusion engine
<Constant name="semantic_layer" /> is currently supported in the <Constant name="dbt_platform" /> for environments running versions of <Constant name="core" />. Support for environments on the dbt Fusion engine is coming soon.
:::

This page points to various resources available to help you understand, configure, deploy, and integrate the <Constant name="semantic_layer" />. The following sections contain links to specific pages that explain each aspect in detail. Use these links to navigate directly to the information you need, whether you're setting up the <Constant name="semantic_layer" /> for the first time, deploying metrics, or integrating with downstream tools.


Refer to the following resources to get started with the <Constant name="semantic_layer" />:
- [Quickstart with the <Constant name="semantic_layer" />](/guides/sl-snowflake-qs) &mdash; Build and define metrics, set up the <Constant name="semantic_layer" />, and query them using our first-class integrations.
- [<Constant name="semantic_layer" /> FAQs](/docs/use-dbt-semantic-layer/sl-faqs) &mdash; Discover answers to frequently asked questions about the <Constant name="semantic_layer" />, such as availability, integrations, and more.

## Configure the dbt Semantic Layer

The following resources provide information on how to configure the <Constant name="semantic_layer" />:
- [Set up the <Constant name="semantic_layer" />](/docs/use-dbt-semantic-layer/setup-sl) &mdash; Learn how to set up the <Constant name="semantic_layer" /> in <Constant name="cloud" /> using intuitive navigation.
- [Architecture](/docs/use-dbt-semantic-layer/sl-architecture) &mdash; Explore the powerful components that make up the <Constant name="semantic_layer" />.

## Deploy metrics
This section provides information on how to deploy the <Constant name="semantic_layer" /> and materialize your metrics:
- [Deploy your <Constant name="semantic_layer" />](/docs/use-dbt-semantic-layer/deploy-sl) &mdash; Run a <Constant name="cloud" /> job to deploy the <Constant name="semantic_layer" /> and materialize your metrics.
- [Write queries with exports](/docs/use-dbt-semantic-layer/exports) &mdash; Use exports to write commonly used queries directly within your data platform, on a schedule.
- [Cache common queries](/docs/use-dbt-semantic-layer/sl-cache) &mdash; Leverage result caching and declarative caching for common queries to speed up performance and reduce query computation.

## Consume metrics and integrate
Consume metrics and integrate the <Constant name="semantic_layer" /> with downstream tools and applications:
- [Consume metrics](/docs/use-dbt-semantic-layer/consume-metrics) &mdash; Query and consume metrics in downstream tools and applications using the <Constant name="semantic_layer" />.
- [Available integrations](/docs/cloud-integrations/avail-sl-integrations) &mdash; Review a wide range of partners you can integrate and query with the <Constant name="semantic_layer" />.
- [<Constant name="semantic_layer" /> APIs](/docs/dbt-cloud-apis/sl-api-overview) &mdash; Use the <Constant name="semantic_layer" /> APIs to query metrics in downstream tools for consistent, reliable data metrics.

