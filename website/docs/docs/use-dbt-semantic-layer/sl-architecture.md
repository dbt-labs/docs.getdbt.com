---
title: "dbt Semantic Layer architecture"
id: sl-architecture
description: "dbt Semantic Layer product architecture and related questions."
sidebar_label: "Architecture"
tags: [Semantic Layer]
pagination_next: null
---


<VersionBlock firstVersion="1.6">

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

</VersionBlock>

<VersionBlock lastVersion="1.5">

import DeprecationNotice from '/snippets/_sl-deprecation-notice.md';

<DeprecationNotice />

## Product architecture 

The dbt Semantic Layer product architecture includes four primary components:

| Components | Information | Developer plans | Team plans | Enterprise plans | License |
| --- | --- | :---: | :---: | :---: | --- |
| **[dbt project](/docs/build/metrics)** | Define models and metrics in dbt Core. <br /> *Note, we will deprecate and no longer support the dbt_metrics package. | ✅ | ✅ |  ✅  | Open source, Core |
| **[dbt Server](https://github.com/dbt-labs/dbt-server)**| A persisted HTTP server that wraps dbt core to handle RESTful API requests for dbt operations. | ✅ | ✅ | ✅ | BSL |
| **SQL Proxy** | Reverse-proxy that accepts dbt-SQL (SQL + Jinja like query models and metrics, use macros), compiles the query into pure SQL, and executes the query against the data platform. | ✅ <br></br>_* Available during Public Preview only_ | ✅ | ✅ | Proprietary, Cloud (Team & Enterprise) |
| **[Discovery API](/docs/dbt-cloud-apis/discovery-api)**  | Accesses metric definitions primarily via integrations and is the source of truth for objects defined in dbt projects (like models, macros, sources, metrics). The Discovery API is updated at the end of every dbt Cloud run. | ❌ | ✅ | ✅ | Proprietary, Cloud (Team & Enterprise) |
    
<Lightbox src="/img/docs/dbt-cloud/semantic-layer/sl-architecture-flow.png" title="dbt Semantic components" />

dbt Semantic Layer integrations will:

- Leverage the Discovery API to fetch a list of objects and their attributes, like metrics
- Generate a dbt-SQL statement
- Then query the SQL proxy to evaluate the results of this statement

</VersionBlock>
