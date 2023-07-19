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

During [public beta](/docs/dbt-versions/release-notes/July-2023/sl-revamp-beta#public-beta), the dbt Semantic Layer is accessible to all dbt Cloud Team and Enterprise multi-tenant plans [hosted](/docs/cloud/about-cloud/regions-ip-addresses) in North America. It's available on dbt v1.6 or higher. dbt Cloud Developer plans and dbt Core users can use MetricFlow to define and test metrics locally, but can't dynamically query them with integrated tools. 

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
