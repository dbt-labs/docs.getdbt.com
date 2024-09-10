---
title: "Consume metrics from your Semantic Layer"
description: "Learn how to query and consume metrics from your deployed dbt Semantic Layer using various tools and APIs."
sidebar_label: "Consume your metrics"
tags: [Semantic Layer]
pagination_next: "docs/use-dbt-semantic-layer/sl-faqs"
---

After [deploying](/docs/use-dbt-semantic-layer/deploy-sl) your dbt Semantic Layer, the next important (and fun!) step is querying and consuming the metrics you’ve defined. This page links to key resources that guide you through the process of consuming metrics across different integrations, APIs, and tools, using various different [query syntaxes](/docs/dbt-cloud-apis/sl-jdbc#querying-the-api-for-metric-metadata).

Once your Semantic Layer is deployed, you can start querying your metrics using a variety of tools and APIs. Here are the main resources to get you started:

### Available integrations

Integrate the dbt Semantic Layer with a variety of business intelligence (BI) tools and data platforms, enabling seamless metric queries within your existing workflows. Explore the following integrations:

- [Available integrations](/docs/cloud-integrations/avail-sl-integrations) &mdash; Review a wide range of partners such as Tableau, Google Sheets, Microsoft Excel, and more, where you can query your metrics directly from the dbt Semantic Layer.

### Query with APIs

To leverage the full power of the dbt Semantic Layer, you can use the dbt Semantic Layer APIs for querying metrics programmatically:
- [dbt Semantic Layer APIs](/docs/dbt-cloud-apis/sl-api-overview) &mdash; Learn how to use the dbt Semantic Layer APIs to query metrics in downstream tools, ensuring consistent and reliable data metrics.
  - [JDBC API query syntax](/docs/dbt-cloud-apis/sl-jdbc#querying-the-api-for-metric-metadata) &mdash; Dive into the syntax for querying metrics with the JDBC API, with examples and detailed instructions.
  - [GraphQL API query syntax](/docs/dbt-cloud-apis/sl-graphql#querying) &mdash; Learn the syntax for querying metrics via the GraphQL API, including examples and detailed instructions.
  - [Python SDK](/docs/dbt-cloud-apis/sl-python#usage-examples) &mdash; Use the Python SDK library to query metrics programmatically with Python.
  
### Query during development

For developers working within the dbt ecosystem, it’s essential to understand how to query metrics during the development phase using MetricFlow commands:
- [MetricFlow commands](/docs/build/metricflow-commands) &mdash; Learn how to use MetricFlow commands to query metrics directly during the development process, ensuring your metrics are correctly defined and working as expected.

## Next steps

After understanding the basics of querying metrics, consider optimizing your setup and ensuring the integrity of your metric definitions:

- [Optimize querying performance](/docs/use-dbt-semantic-layer/sl-cache) &mdash; Improve query speed and efficiency by using declarative caching techniques.
- [Validate semantic nodes in CI](/docs/deploy/ci-jobs#semantic-validations-in-ci) &mdash; Ensure that any changes to dbt models don’t break your metrics by validating semantic nodes in Continuous Integration (CI) jobs.
- [Build your metrics and semantic models](/docs/build/build-metrics-intro) &mdash; If you haven’t already, learn how to define and build your metrics and semantic models using your preferred development tool.
