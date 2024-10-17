---
title: "Other artifact files"
sidebar_label: "Other artifacts"
---

### index.html

**Produced by:** [`docs generate`](/reference/commands/cmd-docs)

This file is the skeleton of the [auto-generated dbt documentation website](/docs/collaborate/build-and-view-your-docs). The contents of the site are populated by the [manifest](/reference/artifacts/manifest-json) and [catalog](catalog-json).

Note: the source code for `index.json` comes from the [dbt-docs repo](https://github.com/dbt-labs/dbt-docs). Head over there if you want to make a bug report, suggestion, or contribution relating to the documentation site.

### partial_parse.msgpack

**Produced by:** [manifest commands](/reference/artifacts/manifest-json) + [`parse`](/reference/commands/parse)

This file is used to store a compressed representation of files dbt has parsed. If you have [partial parsing](/reference/parsing#partial-parsing) enabled, dbt will use this file to identify the files that have changed and avoid re-parsing the rest.

### graph.gpickle

**Produced by:** commands supporting [node selection](/reference/node-selection/syntax)

Stores the network representation of the dbt resource DAG.

### graph_summary.json

**Produced by:** [manifest commands](/reference/artifacts/manifest-json)

This file is useful for investigating performance issues in dbt Core's graph algorithms.

It is more anonymized and compact than [`manifest.json`](/reference/artifacts/manifest-json) and [`graph.gpickle`](#graph.gpickle).

It includes that information at two separate points in time:
1. `linked` &mdash; immediately after the graph is linked together, and
2. `with_test_edges` &mdash; after test edges have been added.

Each of those points in time contains the `name` and `type` of each node and `succ` contains the keys of its child nodes.

### semantic_manifest.json

The [`semantic_manifest.json`](/reference/artifacts/sl-manifest) file is useful as an internal interface between `dbt-core` and MetricFlow. As such, it functions as a behind-the-scenes bridge for interaction between the two systems. You can find all of the `semantic_manifest.json` information in the [`semantic_manifest.json`](/reference/artifacts/sl-manifest).

There are two reasons why `semantic_manifest.json` exists alongside `manifest.json`:

- Deserialization: `dbt-core` and MetricFlow use different libraries for handling data serialization.
- Efficiency and performance: MetricFlow and the dbt Semantic Layer need specific semantic details from the manifest. By trimming down the information printed into `semantic_manifest.json`, the process becomes more efficient and enables faster data handling between `dbt-core` and MetricFlow.
