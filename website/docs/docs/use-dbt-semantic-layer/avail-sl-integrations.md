---
title: "Available integrations"
id: avail-sl-integrations
description: "Discover the diverse range of partners that seamlessly integrate with the powerful dbt Semantic Layer, allowing you to query and unlock valuable insights from your data ecosystem."
tags: [Semantic Layer]
sidebar_label: "Available integrations"
hide_table_of_contents: true
meta:
  api_name: dbt Semantic Layer APIs
---

<VersionBlock firstVersion="1.6">


There are a number of data applications that seamlessly integrate with the dbt Semantic Layer, powered by MetricFlow, from business intelligence tools to notebooks, spreadsheets, data catalogs, and more. These integrations allow you to query and unlock valuable insights from your data ecosystem.

Use the [dbt Semantic Layer APIs](/docs/dbt-cloud-apis/sl-api-overview) to simplify metric queries, optimize your development workflow, and reduce coding. This approach also ensures data governance and consistency for data consumers.

import AvailIntegrations from '/snippets/_sl-partner-links.md';

<AvailIntegrations/>

## Other integrations

You can also integrate the following tools with the dbt Semantic Layer:
- [Push.ai](https://docs.push.ai/semantic-layer-integrations/dbt-semantic-layer)
- [Delphi](delphihq.com)

### Custom integration

- You can create custom integrations using different languages and tools. We support connecting with JDBC, ADBC, and GraphQL APIs. For more info, check out [our examples on GitHub](https://github.com/dbt-labs/example-semantic-layer-clients/).
- You can also connect to tools that allow you to write SQL. These tools must meet one of the two criteria:
  
    - Supports a generic JDBC driver option (such as DataGrip) or
    - Uses Arrow Flight SQL JDBC driver version 12.0.0 or higher.

## Related docs

- <span><a href="https://docs.getdbt.com/docs/dbt-cloud-apis/sl-api-overview" target="_self">{frontMatter.meta.api_name}</a></span> to learn how to integrate and query your metrics in downstream tools.
- [dbt Semantic Layer API query syntax](/docs/dbt-cloud-apis/sl-jdbc#querying-the-api-for-metric-metadata) 
- [Hex dbt Semantic Layer cells](https://learn.hex.tech/docs/logic-cell-types/transform-cells/dbt-metrics-cells) to set up SQL cells in Hex.

</VersionBlock>

<VersionBlock lastVersion="1.5">

import LegacyInfo from '/snippets/_legacy-sl-callout.md';

<LegacyInfo />

A wide variety of data applications across the modern data stack natively integrate with the dbt Semantic Layer and dbt metrics &mdash; from Business Intelligence tools to notebooks, data catalogs, and more.

The dbt Semantic Layer integrations are capable of querying dbt metrics, importing definitions, surfacing the underlying data in partner tools, and leveraging the dbt Server. 

For information on the partner integrations, their documentation, and more &mdash; refer to the [dbt Semantic Layer integrations](https://www.getdbt.com/product/semantic-layer-integrations) page.

<Lightbox src="/img/docs/dbt-cloud/semantic-layer/sl_architecture.png" width="75%" title="The universal dbt Semantic Layer connecting to integration tools."/>

## Related docs

- [About the dbt Semantic Layer](/docs/use-dbt-semantic-layer/dbt-sl)

</VersionBlock>
