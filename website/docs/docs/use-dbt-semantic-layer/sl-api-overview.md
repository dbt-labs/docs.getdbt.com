---
title: "Semantic Layer APIs"
id: sl-api-overview
description: "Integrate and query using the Semantic Layer APIs."
tags: ["semantic-layer, apis"]
hide_table_of_contents: true
---

<VersionBlock lastVersion="1.5">

import UpgradeSL from '/snippets/_upgrade-new-sl.md';

<UpgradeSL />


With the Semantic Layer APIs, you can seamlessly query the metrics you built with [MetricFlow](/docs/build/about-metricflow) to avoid duplicative coding, optimize your development workflow, ensure data governance for company metrics, and guarantee consistency for data consumers.  

The full dbt Semantic Layer lets you create systems for data consumption, automated reporting, easily feed metrics to downstream tools, and more. This can help you connect to a wide variety of data applications across the modern data stack and natively integrate with the dbt Semantic Layer and MetricFlow — from Business Intelligence tools to notebooks, spreadsheets, data catalogs, and more.

The dbt Semantic Layer generates a [`semantic_manifest.json` artifact file](/docs/use-dbt-semantic-layer/sl-manifest). This artifact contains comprehensive information about your Semantic Layer. You can use it as a valuable reference to understand the structure and details of your data models.

To query metrics using the dbt Semantic Lay API, accounts must be on a [Team or Enterprise plans](https://www.getdbt.com/pricing/). 

The dbt Semantic Layer provides the following APIs, which you can refer to for more info:

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

Requests to the dbt Semantic Layer APIs can be authorized through two types of API tokens: 

- [User tokens](/docs/dbt-cloud-apis/user-tokens)  
- [Service account tokens](/docs/dbt-cloud-apis/service-tokens)


</VersionBlock>


<VersionBlock firstVersion="1.6">

With the Semantic Layer APIs, you can seamlessly query the metrics you built with [MetricFlow](/docs/build/about-metricflow) to avoid duplicative coding, optimize your development workflow, ensure data governance for company metrics, and guarantee consistency for data consumers.  

The full dbt Semantic Layer lets you create systems for data consumption, automated reporting, easily feed metrics to downstream tools, and more. This can help you connect to a wide variety of data applications across the modern data stack and natively integrate with the dbt Semantic Layer and MetricFlow — from Business Intelligence tools to notebooks, spreadsheets, data catalogs, and more.

The dbt Semantic Layer generates a [`semantic_manifest.json` artifact file](/docs/use-dbt-semantic-layer/sl-manifest). This artifact contains comprehensive information about your Semantic Layer. You can use it as a valuable reference to understand the structure and details of your data models.

To query metrics using the dbt Semantic Lay API, accounts must be on a [Team or Enterprise plans](https://www.getdbt.com/pricing/). 

The dbt Semantic Layer provides the following APIs, which you can refer to for more info:

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

Requests to the dbt Semantic Layer APIs can be authorized through two types of API tokens: 

- [User tokens](/docs/dbt-cloud-apis/user-tokens)  
- [Service account tokens](/docs/dbt-cloud-apis/service-tokens)

</VersionBlock>
