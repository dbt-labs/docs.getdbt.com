---
title: "Caching and the dbt Fusion engine"
id: "about-fusion-caching"
sidebar_label: "About Fusion Caching"
description: "Caching is a big source of Fusion's improved Developer Experience."
pagination_next: null
pagination_prev: null
---

# Caching and the dbt Fusion engine

<VersionBlock lastVersion="1.99">

import FusionLifecycle from '/snippets/_fusion-lifecycle-callout.md';

<FusionLifecycle />

</VersionBlock>

<IntroText>

Caching is large part of how <Constant name="fusion_engine" /> delivers a vastly impoved developer experience. The goal for Fusion is to enable analytics engineers to meaningful feedback as fast as possible.

## Feature Matrix

Where 🚧 indicates a feature that is still in beta

| **Flavor of Caching**  | **what it enables**        | **dbt Core**<br /><small>(self-hosted)</small> | **Fusion CLI**<br/><small>(self-hosted)</small> | **VS Code <br />+ Fusion** | **<Constant name="dbt_platform" />*** |
| :--------------------- | -------------------------- | :--------------------------------------------: | :---------------------------------------------: | :------------------------: | :-----------------------------------: |
| Relation Cache         | knowing what's in your DWH |                       ✅                       |                       ✅                        |             ✅             |                  ✅                   |
| Source Schema Cache    | offline SQL understanding  |                       ❌                       |                       ✅                        |             ✅             |                  ✅                   |
| Query Cache            | faster subsequent compiles |                       ❌                       |                       🚧                       |            🚧             |                  🚧                  |
| LSP Compile Cache      | incremental compilation    |                       ❌                       |                       ❌                        |             ✅             |                  ✅                   |
| Source Freshness Cache | State-Aware Orchestration  |                       ❌                       |                       ❌                        |             ❌             |                  ✅                   |

## Kinds of Caching

### Source Schema Cache

In order to perform offline [static analysis](new-concepts) of your project, the first thing that's required is

## Frequently Asked Questions

### Do the CLI and LSP share the same cache?