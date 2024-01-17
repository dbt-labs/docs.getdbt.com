---
title: "dbt Semantic Layer architecture"
id: sl-architecture
description: "dbt Semantic Layer product architecture and related questions."
sidebar_label: "Architecture"
tags: [Semantic Layer]
pagination_next: null
---

<VersionBlock lastVersion="1.5">

import DeprecationNotice from '/snippets/_sl-deprecation-notice.md';

<DeprecationNotice />
 
 </VersionBlock>

The dbt Semantic Layer allows you to define metrics and use various interfaces to query them. The Semantic Layer does the heavy lifting to find where the queried data exists in your data platform and generates the SQL to make the request (including performing joins). 

<Lightbox src="/img/docs/dbt-cloud/semantic-layer/sl-architecture.jpg" width="85%" title="The diagram displays how your data flows using the dbt Semantic Layer and the variety of integration tools it supports."/>

## Components

The dbt Semantic Layer includes the following components:

import markdownTable from '/snippets/_abctest.md';

<expandTable markdown={markdownTable} />

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
