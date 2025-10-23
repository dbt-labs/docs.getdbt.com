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

At the same time, caching is famously one of the two hardest problems in computer science!

dbt's Caching falls into the following three buckets:
1. a user never has to think about
2. a user should sometimes have to think about
3. a user pays dbt Labs so that they need not think about it

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

### Relation Cache

### Source Schema Cache

In order to perform offline [static analysis](new-concepts) of your project, the first thing that's required is

### (BETA) Query Cache

The biggest performance bottleneck in dbt isn’t the language the engine is written in: it’s actually the times that dbt needs to query the data warehouse in order to render jinja into SQL! 

We call this “introspection” and it really slows down local development! See [New Concepts: Rendering introspective queries](new-concepts#rendering-introspective-queries)

 So we’ve shipped a query cache that’s now in beta.

**How it works**

During a dbt compile, every time there’s a DWH query executed to render jinja into SQL, dbt will now locally cache the result. So the next time a dbt command needs to compile, it doesn’t have to make a round trip to the DWH for the same results as last time, it will just use the previously hydrated cache.

Try it out. I've seen some impressive results on internal projects.

**Where is the cache?**

If you have query caching enabled, you will notice a new folder `target/query_cache/` that contains many parquet files.

**How to invalidate the cache**

Inevitably, the local cache will be out of date. For example, the remote DWH might have a new column on a certain table that the query cache doesn’t have reflected.

While there is a 12-hour expiration date on the query cache objects you can also refresh the cache manually by either:

- deleting the `target/query_cache/`
- use the “Clear Cache” button of the VSCode sidebar

  <img width="100" alt="image 3" src="https://github.com/user-attachments/assets/bbae709e-e775-415c-9b9c-294ed541a24b" />


**How to opt into this beta feature**

1. Add `--beta-use-query-cache` to all your dbt CLI commands
2. Enable the VS Code extension setting “Use Query Cache”
    
<img width="200" alt="image 4" src="https://github.com/user-attachments/assets/6ddeac36-b12a-40bf-89e6-4c426abbef1c" />


### LSP compile cache

### Source Freshness Cache


## Frequently Asked Questions

### Do the CLI and LSP share the same cache?