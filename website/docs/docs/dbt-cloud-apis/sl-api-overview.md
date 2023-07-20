---
title: "Semantic Layer APIs"
id: sl-api-overview
description: "Integrate and query using the Semantic Layer API."
tags: [Semantic Layer, APIs]
hide_table_of_contents: true
---

<VersionBlock lastVersion="1.5">

import LegacyInfo from '/snippets/_legacy-sl-callout.md';

<LegacyInfo />

</VersionBlock>

The rapid growth of different tools in the modern data stack has helped data professionals address the diverse needs of different teams. The downside of this growth is the fragmentation of business logic across teams, tools, and workloads.

The [dbt Semantic Layer](/docs/use-dbt-semantic-layer/dbt-sl) allows users to define metrics in code (with [MetricFlow](/docs/build/about-metricflow)) and dynamically generate and query datasets in downstream tools based on their dbt governed assets, such as metrics and models. Integrating with the dbt Semantic Layer will help the organizations that uses your product make more efficient and trustworthy decisions with their data. It also helps avoid duplicative coding, optimizes development workflow, ensures data governance, and guarantee consistency for data consumers.  

You can use the dbt Semantic Layer for a variety of tools and applications of data. Here are some common use cases:

* Business intelligence (BI), reporting, and analytics
* Data quality and monitoring
* Governance and privacy
* Data discovery and cataloging
* Machine learning and data science

<!-- this partial lives here: https://github.com/dbt-labs/docs.getdbt.com/website/snippets/_sl-plan-info. Use it on diff pages and to tailor the message depending which instance can access the SL and what product lifecycle we're in. -->

import Features from '/snippets/_sl-plan-info.md'

<Features
cycle="public beta"
product="dbt Semantic Layer"
plan="dbt Cloud Team and Enterprise"
instance="hosted in North America"
/>
<br /><br />

<div className="grid--3-col">

<Card
    title="JDBC API"
    body="Use a JDBC driver to query metrics in downstream tools."
    link="/docs/dbt-cloud-apis/sl-jdbc"
    icon="dbt-bit"/>

<Card
    title="GraphQL API"
    body="Use GraphQL to query metrics in downstream tools."
    link="/docs/dbt-cloud-apis/sl-graphql"
    icon="dbt-bit"/>

<Card
    title="Semantic manifest"
    body="Learn about the semantic manifest.json file and how you can use artifacts to gain insights about your Semantic Layer."
    link="/docs/dbt-cloud-apis/sl-manifest"
    icon="dbt-bit"/>

</div>

## Authentication

dbt Cloud authorizes requests to the dbt Semantic Layer APIs. You need to provide an environment ID, host, and [service account tokens](/docs/dbt-cloud-apis/service-tokens).
