---
title: "Semantic Layer API"
id: sl-api-overview
description: "Integrate and query using the Semantic Layer API."
tags: ["semantic-layer, apis"]
hide_table_of_contents: true
---

<VersionBlock lastVersion="1.5">

import UpgradeSL from '/snippets/_upgrade-new-sl.md';

<UpgradeSL />

</VersionBlock>

The rapid growth of different tools in the modern data stack has helped data professionals address the diverse needs of different teams. The downside of this growth is the fragmentation of business logic across teams, tools, and workloads.

The dbt Semantic Layer allows users to define metrics in code (with [MetricFlow](/docs/build/about-metricflow)) and dynamically generate and query datasets in downstream tools based on their dbt governed assets, such as metrics and models. Integrating with the dbt Semantic Layer will help the organizations that uses your product make more efficient and trustworthy decisions with their data. It also helps avoid duplicative coding, optimizes development workflow, ensures data governance, and guarantee consistency for data consumers.  

You can use the dbt Semantic Layer for a variety of tools and applications of data. Here are some common use cases:

* Business intelligence (BI), reporting, and analytics
* Data quality and monitoring
* Governance and privacy
* Data discovery and cataloging
* Machine learning and data science

The dbt Semantic Layer APIs are available for accounts on [Team or Enterprise plans](https://www.getdbt.com/pricing/), allowing them to query metrics and build integrations.

<div className="grid--3-col">

<Card
    title="JDBC API"
    body="Use a JDBC driver to query metrics in downstream tools."
    link="/docs/use-dbt-semantic-layer/jdbc"
    icon="dbt-bit"/>

<Card
    title="GraphQL API"
    body="Use GraphQL to query metrics in downstream tools."
    link="/docs/use-dbt-semantic-layer/graphql"
    icon="dbt-bit"/>

<Card
    title="Discovery API"
    body="Uses the Discovery API to query metrics in downstream tools using metadata details about your project’s models, sources, and other nodes along with their execution results."
    link="/docs/dbt-cloud-apis/discovery-api"
    icon="dbt-bit"/>

</div>

## Authentication

dbt Cloud authorizes requests to the dbt Semantic Layer APIs. You need to provide an environment ID, host, and [service account tokens](/docs/dbt-cloud-apis/service-tokens).
