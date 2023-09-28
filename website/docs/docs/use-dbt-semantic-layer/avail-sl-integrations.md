---
title: "Available integrations"
id: avail-sl-integrations
description: "Discover the diverse range of partners that seamlessly integrate with the powerful dbt Semantic Layer, allowing you to query and unlock valuable insights from your data ecosystem."
tags: [Semantic Layer]
sidebar_label: "Available integrations"
meta:
  api_name: dbt Semantic Layer API
---

<VersionBlock firstVersion="1.6">

import NewSLChanges from '/snippets/_new-sl-changes.md';

<NewSLChanges />


There are a number of data applications that seamlessly integrate with the dbt Semantic Layer, powered by MetricFlow, from business intelligence tools to notebooks, spreadsheets, data catalogs, and more. These integrations allow you to query and unlock valuable insights from your data ecosystem.

<span>Query dbt metrics with external integrations using the sophisticated <a href="https://docs.getdbt.com/docs/dbt-cloud-apis/sl-api-overview" target="_self">{frontMatter.meta.api_name}</a></span>. The API enables you to query metrics, avoid duplicative coding, optimize your development workflow, ensure data governance for company metrics, and guarantee consistency for data consumers.<br /><br />

<!-- turn these into cards for ga -->

import AvailIntegrations from '/snippets/_sl-partner-links.md';

<AvailIntegrations/>

### Custom integrations
You can write a custom integration in a variety of languages and tools. We support connecting through JDBC, ADBC, and a GraphQL API. Refer to [some examples](https://github.com/dbt-labs/example-semantic-layer-clients/blob/main/python/src/adbc_example.py) for more info. (WILL TWEAK IN AN HOUR)

## Related docs

- <span><a href="https://docs.getdbt.com/docs/dbt-cloud-apis/sl-api-overview" target="_self">{frontMatter.meta.api_name}</a></span> to learn how to integrate with the JDBC to query your metrics in downstream tools.
- [dbt Semantic Layer API query syntax](/docs/dbt-cloud-apis/sl-jdbc#querying-the-api-for-metric-metadata) 

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
