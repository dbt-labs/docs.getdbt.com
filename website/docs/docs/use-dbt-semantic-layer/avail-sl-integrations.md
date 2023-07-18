---
title: "Available integrations"
id: avail-sl-integrations
description: "Discover the diverse range of partners that seamlessly integrate with the powerful dbt Semantic Layer, allowing you to query and unlock valuable insights from your data ecosystem."
tags: [Semantic Layer]
sidebar_label: "Available integrations"
---

<VersionBlock firstVersion="1.6">

import NewSLChanges from '/snippets/_new-sl-changes.md';

<NewSLChanges />

Discover the diverse range of data applications that seamlessly integrate with the powerful dbt Semantic Layer, powered by MetricFlow &mdash; from business intelligence tools to notebooks, spreadsheets, data catalogs, and more. These integrations allow you to query and unlock valuable insights from your data ecosystem.

Query dbt metrics via external integrations using the sophisticated [dbt Semantic Layer APIs](/docs/dbt-cloud-apis/sl-api-overview) (JDBC, GraphQL, and Discovery APIs). With these APIs, you can query metrics to avoid duplicative coding, optimize your development workflow, ensure data governance for company metrics, and guarantee consistency for data consumers.

The dbt Semantic Layer integrations are capable of querying dbt metrics, importing definitions, surfacing the underlying data in partner tools, and more. Here are some of the integrations you can query from:

- Google Sheets  &mdash; coming soon
- Hex &mdash;
- Mode &mdash; 
- Any SQL developer tool that supports a generic driver, such as DataGrip

For information on the partner integrations, their documentation, and more &mdash; refer to the [dbt Semantic Layer integrations](https://www.getdbt.com/product/semantic-layer-integrations) page.

<Lightbox src="/img/docs/dbt-cloud/semantic-layer/sl-architecture.jpg" width="95%" title="The universal dbt Semantic Layer connecting to integration tools."/>


## Related docs

- [dbt Semantic Layer APIs](/docs/dbt-cloud-apis/sl-api-overview) to learn how to integrate with the JDBC, GraphQL, and Discovery APIs to query your metrics in downstream tools.

</VersionBlock>

<VersionBlock lastVersion="1.5">

import LegacyInfo from '/snippets/_legacy-sl-callout.md';

<LegacyInfo />

A wide variety of data applications across the modern data stack natively integrate with the dbt Semantic Layer and dbt metrics &mdash; from Business Intelligence tools to notebooks, data catalogs, and more.

The dbt Semantic Layer integrations are capable of querying dbt metrics, importing definitions, surfacing the underlying data in partner tools, and leveraging the dbt Server. 

For information on the partner integrations, their documentation, and more &mdash; refer to the [dbt Semantic Layer integrations](https://www.getdbt.com/product/semantic-layer-integrations) page.

<Lightbox src="/img/docs/dbt-cloud/semantic-layer/sl_architecture.png" width="75%" title="The universal dbt Semantic Layer connecting to integration tools."/>

## Related docs

- [dbt Semantic Layer](/docs/use-dbt-semantic-layer/dbt-sl) to learn more about the dbt Semantic Layer.

</VersionBlock>
