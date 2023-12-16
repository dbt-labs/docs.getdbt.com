---
title: "Semantic Layer APIs"
id: sl-api-overview
description: "Integrate and query metrics and dimensions in downstream tools using the Semantic Layer APIs"
tags: [Semantic Layer, API]
hide_table_of_contents: true
pagination_next: "docs/dbt-cloud-apis/sl-jdbc"
---

<VersionBlock lastVersion="1.5">

import DeprecationNotice from '/snippets/_sl-deprecation-notice.md';

<DeprecationNotice />
 
</VersionBlock>
 
The rapid growth of different tools in the modern data stack has helped data professionals address the diverse needs of different teams. The downside of this growth is the fragmentation of business logic across teams, tools, and workloads.

The [dbt Semantic Layer](/docs/use-dbt-semantic-layer/dbt-sl) allows you to define metrics in code (with [MetricFlow](/docs/build/about-metricflow)) and dynamically generate and query datasets in downstream tools based on their dbt governed assets, such as metrics and models. Integrating with the dbt Semantic Layer will help organizations that use your product make more efficient and trustworthy decisions with their data. It also helps you to avoid duplicative coding, optimize development workflow, ensure data governance, and guarantee consistency for data consumers.  

You can use the dbt Semantic Layer for a variety of tools and applications of data. Some common use cases are:

* Business intelligence (BI), reporting, and analytics
* Data quality and monitoring
* Governance and privacy
* Data discovery and cataloging
* Machine learning and data science

<!-- this partial lives here: https://github.com/dbt-labs/docs.getdbt.com/website/snippets/_sl-plan-info. Use it on diff pages and to tailor the message depending which instance can access the SL and what product lifecycle we're in. -->

import Features from '/snippets/_sl-plan-info.md'

<Features
product="dbt Semantic Layer"
plan="dbt Cloud Team or Enterprise"
/>

<div className="grid--3-col">

<Card
    title="JDBC API"
    body="Use a JDBC driver to query metrics and dimensions in downstream tools, while also providing standard metadata functionality."
    link="/docs/dbt-cloud-apis/sl-jdbc"
    icon="dbt-bit"/>

<Card
    title="GraphQL API"
    body="Use GraphQL to query metrics and dimensions in downstream tools."
    link="/docs/dbt-cloud-apis/sl-graphql"
    icon="dbt-bit"/>

<Card
    title="Semantic manifest"
    body="Learn about the semantic manifest.json file and how you can use artifacts to gain insights about your Semantic Layer."
    link="/docs/dbt-cloud-apis/sl-manifest"
    icon="dbt-bit"/>

</div>
