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

#### What is the relation cache?

Before dbt creates modifies or drops any table or view in the target data platform, it first needs to know what's already in there! The fundamental reason is simple: make sure that name of model you're about to materialize is not taken already!

However, it doesn't make sense to make these metadata queries to the warehouse for every model; the better answer is for dbt to initially cache all the relations, then update the cache as it runs. We call this the relational cache.

<!-- TODO make a stadnalone reference page to define introspective queries -->
An additional benefit of this cache is when a dbt model makes use of an introspective query. Introspective queries are queries that a dbt model's jinja requires in order to be rendered to SQL. While they are often convenient, the can have a sizable impact on dbt's ability to performantly compile a project, especially as it relates to the dbt Fusion engine which also performs static analysis.

An example of the additional benefit that the relation cache provide to end users that have introspective queries in their project is the `dbt_utils.get_relations_by_pattern()` ([docs](https://github.com/dbt-labs/dbt-utils?tab=readme-ov-file#get_relations_by_pattern-source)) macro. If you use that in a model, for dbt to know how to turn it into SQL, it needs to know what relations there are! It could ask the datawarehouse everytime the model is compiled or ran. However, it can simply use the relation cache.

#### When to know about the relation cache and how to troubleshoot it

The relation cache has been a part of dbt for years now and is quite stable, so you likely will not need to think about it unless are contributing to the dbt codebase, or developing a custom materialization.

In Fusion, there is currently a `logs/beta_cache.log` artifact which provides some information on the intitial poputation of the cache, such as 
- which schemas were cached
- how many relations were found in each schema
- how long did the metadata queries take


As the filename suggest, this file is in a beta state, and likely to evolve and be integrated into `logs/dbt.log`

<!-- TODO: what Core CLI flags are supported in Fusion?? -->

### Source Schema Cache

#### What is the source schema cache?

In order to perform offline [static analysis](new-concepts) of your project and validate that all the datatypes are correct, the dbt Fusion engine first needs to know the column datatypes of all of your source tables.

To accomplish this, the first thing Fusion does is make metadata queries to your data platform to get all the column names and datatypes of all of the relevant source tables. The result is saved to `target/db/` as parquet files.

The parquet files have no rows, but the colums and datatypes do correspond to those of the source table in the data warehouse.

#### When to know about the source schema cache and how to troubleshoot it?

As an end user, you'll likely come across the cache when:
- you're migrating from Core to Fusion, but you don't have permission to get the schema of some of the source tables defined in your project
- Fusion tells you it can't find a column in your source table, but it's actually there






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