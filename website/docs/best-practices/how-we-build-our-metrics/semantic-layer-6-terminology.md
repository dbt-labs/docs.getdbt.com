---
title: "Tactical terminology"
description: Getting started with the dbt Semantic Layer
hoverSnippet: Learn how to get started with the dbt Semantic Layer
pagination_next: "best-practices/how-we-build-our-metrics/semantic-layer-7-semantic-structure"
---

The rest of this guide will focus on the process of migrating your existing dbt code to the <Constant name="semantic_layer" />. To do this, we'll need to introduce some new terminology and concepts that are specific to the <Constant name="semantic_layer" />.

We want to define them up front, as we have specific meanings in mind applicable to the process of migrating code to the <Constant name="semantic_layer" />. These terms can mean different things in different settings, but here we mean:

- 🔲 **Normalized** — can be defined with varying degrees of technical rigor, but used here we mean something that contains unique data stored only once in one place, so it can be efficiently joined and aggregated into various shapes. You can think of it referring to tables that function as conceptual building blocks in your business, _not_ in the sense of say, strict [Codd 3NF](https://en.wikipedia.org/wiki/Third_normal_form).
- 🛒 **Mart** — also has a variety of definitions, but here we mean a table that is relatively normalized and functions as the source of truth for a core concept in your business.
- 🕸️ **Denormalized** — when we store the same data in multiple places for easier access without joins. The most denormalized data modeling system is OBT (One Big Table), where we try to get every possible interesting column related to a concept (for instance, customers) into one big table so all an analyst needs to do is `select`.
- 🗞️ **Rollup** — used here as a catchall term meaning both denormalized tables built on top of normalized marts and those that perform aggregations to a certain grain. For example `active_accounts_per_week` might aggregate `customers` and `orders` data to a weekly time. Another example would be `customer_metrics` which might denormalize a lot of the data from `customers` as well as aggregated data from `orders`. For the sake of brevity in this guide, we’ll call all these types of products built on top of your normalized concepts as **rollups**.

We'll also use a couple _new_ terms for the sake of brevity. These aren't standard or official dbt-isms, but useful for communicating meaning in the context of refactoring code for the <Constant name="semantic_layer" />:

- 🧊 **Frozen** — shorthand to indicate code that is statically built in dbt’s logical transformation layer. Does not refer to the materialization type: views, incremental models, and regular tables are all considered _frozen_ as they statically generate data or code that is stored in the warehouse as opposed to dynamically querying, as with the <Constant name="semantic_layer" />. This is _not_ a bad thing! We want some portion of our transformation logic to be frozen and stable as the _transformation_ _logic_ is not rapidly shifting and we benefit in testing, performance, and stability.
- 🫠 **Melting** — the process of breaking up frozen structures into flexible <Constant name="semantic_layer" /> code. This allows them to create as many combinations and aggregations as possible dynamically in response to stakeholder needs and queries.

:::tip
🏎️ **The <Constant name="semantic_layer" /> is a denormalization engine.** dbt transforms your data into clean, normalized marts. The <Constant name="semantic_layer" /> is a denormalization engine that dynamically connects and molds these building blocks into the maximum amount of shapes available _dynamically_.
:::
