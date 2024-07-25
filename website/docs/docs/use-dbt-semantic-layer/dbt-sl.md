---
title: "dbt Semantic Layer"
id: dbt-sl
description: "Learn how the dbt Semantic Layer enables data teams to centrally define and query metrics."
sidebar_label: "About the dbt Semantic Layer"
tags: [Semantic Layer]
hide_table_of_contents: true
pagination_next: "guides/sl-snowflake-qs"
pagination_prev: null
---

<VersionBlock lastVersion="1.5">

import DeprecationNotice from '/snippets/_sl-deprecation-notice.md';

<DeprecationNotice />
 
</VersionBlock>

The dbt Semantic Layer, powered by [MetricFlow](/docs/build/about-metricflow), simplifies the process of defining and using critical business metrics, like `revenue` in the modeling layer (your dbt project). By centralizing metric definitions, data teams can ensure consistent self-service access to these metrics in downstream data tools and applications. The dbt Semantic Layer eliminates duplicate coding by allowing data teams to define metrics on top of existing models and automatically handles data joins. 

Moving metric definitions out of the BI layer and into the modeling layer allows data teams to feel confident that different business units are working from the same metric definitions, regardless of their tool of choice. If a metric definition changes in dbt, it’s refreshed everywhere it’s invoked and creates consistency across all applications. To ensure secure access control, the dbt Semantic Layer implements robust [access permissions](/docs/use-dbt-semantic-layer/setup-sl#set-up-dbt-semantic-layer) mechanisms.

Refer to the [dbt Semantic Layer FAQs](/docs/use-dbt-semantic-layer/sl-faqs) or [Why we need a universal semantic layer](https://www.getdbt.com/blog/universal-semantic-layer/)  blog post to learn more.

## Explore the dbt Semantic Layer
<!-- this partial lives here: https://github.com/dbt-labs/docs.getdbt.com/website/snippets/_sl-plan-info. Use it on diff pages and to tailor the message depending which instance can access the SL and what product lifecycle we're in. -->

import Features from '/snippets/_sl-plan-info.md'

<Features
product="dbt Semantic Layer"
plan="dbt Cloud Team or Enterprise"
/>

<div className="grid--3-col">

<Card
    title="Quickstart with the dbt Cloud Semantic Layer"
    body="Build and define metrics, set up the dbt Semantic Layer, and query them using our first-class integrations."
    link="/guides/sl-snowflake-qs"
    icon="dbt-bit"/>

<Card
    title="Set up the dbt Semantic Layer"
    body="Set up the dbt Semantic Layer in dbt Cloud using intuitive navigation."
    link="/docs/use-dbt-semantic-layer/setup-sl"
    icon="dbt-bit"/>

<Card
    title="Architecture"
    body="Learn about the powerful components that make up the dbt Semantic Layer."
    link="/docs/use-dbt-semantic-layer/sl-architecture"
    icon="dbt-bit"/>

<Card
    title="Write queries with exports"
    body="Use exports to write commonly used queries directly within your data platform, on a schedule."
    link="/docs/use-dbt-semantic-layer/exports"
    icon="dbt-bit"/>

<Card
    title="Cache common queries"
    body="Leverage result caching and declarative caching for common queries to speed up performance and reduce query computation."
    link="/docs/use-dbt-semantic-layer/sl-cache"
    icon="dbt-bit"/>

<Card
    title="dbt Semantic Layer FAQs"
    body="Discover answers to frequently asked questions about the dbt Semantic Layer, such as availability, integrations, and more."
    link="/docs/use-dbt-semantic-layer/sl-faqs"
    icon="dbt-bit"/>

<Card
    title="Available integrations"
    body="Review a wide range of partners you can integrate and query with the dbt Semantic Layer."
    link="/docs/cloud-integrations/avail-sl-integrations"
    icon="dbt-bit"/>

<Card
    title="dbt Semantic Layer APIs"
    body="Use the dbt Semantic Layer APIs to query metrics in downstream tools for consistent, reliable data metrics."
    link="/docs/dbt-cloud-apis/sl-api-overview"
    icon="dbt-bit"/>

</div>
