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

There are a number of data applications that seamlessly integrate with the dbt Semantic Layer, powered by MetricFlow, from business intelligence tools to notebooks, spreadsheets, data catalogs, and more. These integrations allow you to query and unlock valuable insights from your data ecosystem.

Use the [dbt Semantic Layer APIs](/docs/dbt-cloud-apis/sl-api-overview) to simplify metric queries, optimize your development workflow, and reduce coding. This approach also ensures data governance and consistency for data consumers.

import AvailIntegrations from '/snippets/_sl-partner-links.md';

<AvailIntegrations/>

### Custom integration

- [Exports](/docs/use-dbt-semantic-layer/exports) enable custom integration with additional tools that don't natively connect with the dbt Semantic Layer, such as PowerBI.
- [Consume metrics](/docs/use-dbt-semantic-layer/consume-metrics) and develop custom integrations using different languages and tools, supported through [JDBC](/docs/dbt-cloud-apis/sl-jdbc), ADBC, and [GraphQL](/docs/dbt-cloud-apis/sl-graphql) APIs, and [Python SDK library](/docs/dbt-cloud-apis/sl-python). For more info, check out [our examples on GitHub](https://github.com/dbt-labs/example-semantic-layer-clients/).
- Connect to any tool that supports SQL queries. These tools must meet one of the two criteria:
    - Offers a generic JDBC driver option (such as DataGrip) or
    - Is compatible Arrow Flight SQL JDBC driver version 12.0.0 or higher.

## Related docs

- <span><a href="https://docs.getdbt.com/docs/dbt-cloud-apis/sl-api-overview" target="_self">{frontMatter.meta.api_name}</a></span> to learn how to integrate and query your metrics in downstream tools.
- [dbt Semantic Layer API query syntax](/docs/dbt-cloud-apis/sl-jdbc#querying-the-api-for-metric-metadata) 
- [Hex dbt Semantic Layer cells](https://learn.hex.tech/docs/explore-data/cells/data-cells/dbt-metrics-cells) to set up SQL cells in Hex.
- [Resolve 'Failed APN'](/faqs/Troubleshooting/sl-alpn-error) error when connecting to the dbt Semantic Layer.
- [dbt Semantic Layer on-demand course](https://learn.getdbt.com/courses/semantic-layer)
- [dbt Semantic Layer FAQs](/docs/use-dbt-semantic-layer/sl-faqs)
