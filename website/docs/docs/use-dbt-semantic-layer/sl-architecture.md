---
title: "dbt Semantic Layer architecture"
id: sl-architecture
description: "dbt Semantic Layer product architecture and related questions."
sidebar_label: "Architecture"
tags: [Semantic Layer]
pagination_next: null
---

The dbt Semantic Layer allows you to define metrics and use various interfaces to query them. The Semantic Layer does the heavy lifting to find where the queried data exists in your data platform and generates the SQL to make the request (including performing joins). 

<Lightbox src="/img/docs/dbt-cloud/semantic-layer/sl-architecture.jpg" width="85%" title="The diagram displays how your data flows using the dbt Semantic Layer and the variety of integration tools it supports."/>

## Components

The dbt Semantic Layer includes the following components:


| Components | Information | dbt Core users | Developer plans |  Team plans | Enterprise plans | License |
| --- | --- | :---: | :---: | :---: | :---: |
| **[MetricFlow](/docs/build/about-metricflow)** | MetricFlow in dbt allows users to centrally define their semantic models and metrics with YAML specifications. | ✅ | ✅ | ✅ |  ✅  | BSL package (code is source available) |
| **dbt Semantic interfaces**| A configuration spec for defining metrics, dimensions, how they link to each other, and how to query them. The [dbt-semantic-interfaces](https://github.com/dbt-labs/dbt-semantic-interfaces) is available under Apache 2.0. | ❌ | ❌ | ✅ | ✅ | Proprietary, Cloud (Team & Enterprise)|
| **Service layer** | Coordinates query requests and dispatching the relevant metric query to the target query engine. This is provided through dbt Cloud and is available to all users on dbt version 1.6 or later. The service layer includes a Gateway service for executing SQL against the data platform. | ❌ | ❌ | ✅ | ✅ | Proprietary, Cloud (Team & Enterprise) |
| **[Semantic Layer APIs](/docs/dbt-cloud-apis/sl-api-overview)** | The interfaces allow users to submit metric queries using GraphQL and JDBC APIs. They also serve as the foundation for building first-class integrations with various tools. | ❌ | ❌ | ✅ | ✅ | Proprietary, Cloud (Team & Enterprise)|


## Feature comparison

The following table compares the features available in dbt Cloud and source available in dbt Core:

| Feature | MetricFlow Source available | dbt Semantic Layer with dbt Cloud |
| ----- | :------: | :------: |
| Define metrics and semantic models in dbt using the MetricFlow spec | ✅ | ✅ |
| Generate SQL from a set of config files | ✅ | ✅ |
| Query metrics and dimensions through the command line interface (CLI) | ✅ | ✅ |
| Query dimension, entity, and metric metadata  through the CLI | ✅ | ✅ |
| Query metrics and dimensions through semantic APIs (ADBC, GQL)  | ❌ | ✅ |
| Connect to downstream integrations (Tableau, Hex, Mode, Google Sheets, and so on.) | ❌ | ✅ |
| Create and run Exports to save metrics queries as tables in your data platform. | ❌ | Coming soon |

## FAQs

import SlFaqs from '/snippets/_sl-faqs.md';

<SlFaqs/>
