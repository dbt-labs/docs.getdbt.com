---
title: "How to build a Semantic Layer in pieces: step-by-step for busy analytics engineers"
description: A deep-dive into the steps you can take to start building your dbt Semantic Layer _today_, without doing a big migration.
slug: semantic-layer-in-pieces
authors: [gwen_windflower]
tags: [analytics craft]
hide_table_of_contents: false
date: 2024-07-10
is_featured: true
---

The [dbt Semantic Layer](/docs/use-dbt-semantic-layer/dbt-sl) is founded on the idea that data transformation should be both _flexible_, allowing for on-the-fly aggregations grouped and filtered by definable dimensions and _version-controlled and tested_. Like any other codebase, you should have confidence that your transformations express your organization’s business logic correctly. Historically, you had to choose between these options, but the dbt Semantic Layer brings them together. This has required new paradigms for _how_ you express your transformations though.

<!-- truncate -->

Because of this, we’ve noticed when talking to dbt users that they _want_ to adopt the Semantic Layer, but feel daunted by the idea of migrating their transformations to this new paradigm. The good news is that you do _not_ need to make a huge one-time migration.

We’re here to discuss another way: building a Semantic Layer in pieces. Our goal is to make sure you derive increased leverage and velocity from each step on your journey. If you’re eager to start building but have limited bandwidth (like most busy analytics engineers), this one is especially for you.

## System of a noun: deciding what happens where

When you’re using the dbt Semantic Layer, you want to _minimize_ _the modeling that exists outside of dbt_. Eliminate it completely if you can. Why?

- It’s **duplicative, patchy, and confusing** as discussed above.
- It’s **less powerful**.
- You **can’t** **test** it.
- Depending on the tool, oftentimes you **can’t** **version control** it.

What you want is a unified development flow that handles **normalized transformation in dbt models** and **dynamic denormalization in the dbt Semantic Layer** (meaning it dynamically combines and reshapes normalized data models into different formats whenever you need them).

:::info
🏎️ **The Semantic Layer is a denormalization engine.** dbt transforms your data into clean, normalized marts. The dbt Semantic Layer is a denormalization engine that dynamically connects and molds these building blocks into the maximum amount of shapes available _dynamically_.
:::

This enables a more **flexible consumption layer**, meaning downstream tools (like AI or dashboards) can sit as directly on top of Semantic Layer-generated artifacts and APIs as possible, and focus on what makes them shine instead of being burdened by basic dynamic modeling and aggregation tasks. Any tool-specific constructs should typically operate as close to **transparent pass-throughs** as you can make them, primarily serving to surface metrics and dimensions from the Semantic Layer in your downstream tool. There may be exceptions of course, but as a general guiding principle this gets you the most dynamic denormalization ability, and thus value, from your Semantic Layer code.

So now we’ve established the system, let’s dig into the _plan_ for how we can get there iteratively.

## The plan: towards iterative velocity

1. **Identify a Data Product that is impactful** Find something that is in heavy use and high value, but fairly narrow scope. **Don’t start with a broad executive dashboard** that shows metrics from across the company because you’re looking to optimize for migrating the **smallest amount of modeling for the highest amount of impact** that you can.

   For example, a good starting place would be a dashboard focused on Customer Acquisition Cost (CAC) that relies on a narrow set of metrics and underlying tables that are nonetheless critical for your company.
2. **Catalog the models and their columns that service the Data Product**, both **in dbt _and_ the BI tool**, including rollups, metrics tables, and marts that support those. Pay special attention to aggregations as these will constitute _metrics_. You can reference [this example Google Sheet](https://docs.google.com/spreadsheets/d/1BR62C5jY6L5f5NvieMcA7OVldSFxu03Y07TG3waq0As/edit?usp=sharing) for one-way you might track this.
3. [**Melt the frozen rollups**](https://docs.getdbt.com/best-practices/how-we-build-our-metrics/semantic-layer-6-terminology) in your dbt project, as well as variations modeled in your BI tool, **into Semantic Layer code.** We’ll go much more in-depth on this process, and we encourage you to read more about this tactical terminology (frozen, rollup, etc) in the link &mdash; it will be used throughout this article!
4. **Create a parallel version of your data product that points to Semantic Layer artifacts, audit, and then publish.** Creating in parallel takes the pressure off, allowing you to fix any issues and publish gracefully. You’ll keep the existing Data Product as-is while swapping the clone to be supplied with data from the Semantic Layer.

<Lightbox src="/img/blog/2024-07-09-semantic-layer-in-pieces/elsa_meme.jpg" title="Elsa iterates rapidly." />

These steps constitute an **iterative piece** you will ship as you **progressively** move code into your Semantic Layer. As we dig into how to do this, we’ll discuss the **immediate value** this provides to your team and stakeholders. Broadly, it enables you to drastically increase [**iteration velocity**](https://www.linkedin.com/posts/rauchg_iteration-velocity-is-the-right-metric-to-activity-7087498430226313216-BVIP?utm_source=share&utm_medium=member_desktop).

The process of **melting static, frozen tables** into more flexible, fluid, **dynamic Semantic Layer code** is not complex, but it’s helpful to dig into the specific steps in the process. In the next section, we’ll dive into what this looks like in practice so you have a solid understanding of the "what’s required".

This is the most **technical, detailed, and specific section of this article**, so make sure to bookmark it and **reference it** as often as you can until the process becomes as intuitive as regular modeling in dbt!

## Migrating a chunk: step-by-step

### 1. Identify target

1. **Identify a relatively normalized mart that is powering rollups in dbt**. If you do your rollups in your BI tool, start there. But we recommend starting with the frozen tables in dbt _first_ and moving through the flow of the DAG progressively, bringing logic in your BI tool into play last. This is because we want to iteratively break up these frozen concepts in such a way that we benefit from earlier parts of the chain being migrated already. Think "moving left-to-right in a big DAG" that spans all your tools.
   - ✅ `orders`, `customers` — these are basic concepts powering your business, so should be marts models materialized via dbt.
   - ❌ `active_accounts_per_week` — this is built on top of the above, and something we want to generate dynamically in the dbt Semantic Layer.
   - Put another way: `customers` and `orders` are **normalized building blocks**, `active_accounts_per_week` is a **rollup** and we always want to _migrate those to the Semantic Layer_.
     <Lightbox src="/img/blog/2024-07-09-semantic-layer-in-pieces/rollup_dag.png" title="A frozen rollup built on normalized marts." />

### 2. Catalog the inputs

1. Identify **normalized columns** and **ignore any aggregation columns** for now. For example, `order_id`, `ordered_at`, `customer_id`, `order_total` are fields we want to put in our semantic model, a window function that sums `customer_cac` _statically_ in the dbt model is _not_ a field we want in our semantic model because we want to _dynamically_ codify that calculation as a metric in the Semantic Layer.
   1. If you find in the next step that you can’t express a certain calculation in the Semantic Layer yet, use dbt to model it**.** This is the beauty of having your Semantic Layer code integrated in your dbt codebase, it’s easy to manage the push and pull of the line between the Transformation and Semantic Layers because you’re managing **a cohesive set of code and tooling.**

### 3. Write Semantic Layer code

1. **Start with the semantic model** going through column by column and putting all identified columns from Step 2 into the 3 semantic buckets:
   1. [**Entities**](/docs/build/entities) — these are the spine of your semantic concepts or objects, you can think of them as roughly correlating to IDs or keys that form the grain.
   2. [**Dimensions**](/docs/build/dimensions) — these are ways of grouping and bucketing these objects or concepts, such as time and categories.
   3. [**Measures**](/docs/build/measures) — these are numeric values that you want to aggregate such as an order total or number of times a user clicked an ad.
2. **Create metrics for the aggregation columns** we didn’t encode into the semantic model.
3. Now, **identify a rollup you want to melt**. Refer to the [earlier example](#1-identify-target) to help distinguish these types of models.
4. **Repeat these steps for any** **other concepts** that you need to create that rollup e.g. `active_accounts_per_week` may need **both `customers` and `orders`.**
5. **Create metrics for the aggregation columns present in the rollup**. If your rollup references multiple models, put metrics in the YAML file that is most closely related to the grain or key aggregation of the table. For example, `active_accounts_per_week` is aggregated at a weekly time grain, but the key metric counts customer accounts, so we’d want to put that metric in the `customers.yml` or `sem_customers.yml` file (depending on [the naming system](/best-practices/how-we-build-our-metrics/semantic-layer-7-semantic-structure) you prefer). If it also contained a metric aggregating total orders in a given week, we’d put that metric into `orders.yml` or `sem_orders.yml`.
6. **Create [saved queries with exports](/docs/build/saved-queries)** configured to materialize your new Semantic Layer-based artifacts into the warehouse in parallel with the frozen rollup. This will allow us to shift consumption tools and audit results.

### 4. Connect external tools in parallel

1. Now, **shift your external analysis tool to point at the Semantic Layer exports instead of the rollup**. Remember, we only want to shift the pointers for the rollup that we’ve migrated, everything else should stay pointing to frozen rollups. We’re migrating iteratively in pieces!
   1. If your downstream tools have an integration with the Semantic Layer, you’ll want to set that up as well. This will allow not only [declarative caching](/docs/use-dbt-semantic-layer/sl-cache#declarative-caching) of common query patterns with exports but also easy, totally dynamic on-the-fly queries.
2. Once you’ve replicated the previous state of things, with the Semantic Layer providing the data instead of frozen rollups, now you’re ready to **shift the transformations happening in your BI tool into the Semantic Layer**, following the same process.
3. Finally, to **feel the new speed and power you’ve unlocked**, ask a stakeholder for a dimension or metric that’s on their wishlist for the data product you’re working with. Then, bask in the glory of amazing them when you ship it an hour later!

:::tip
💁🏻‍♀️ If your BI tool allows it, make sure to do the BI-related steps above **in a development environment**. If it doesn’t have these capabilities, stick with duplicating the data product you’re re-building and perform this there so you can swap it later after you’ve tested it thoroughly.
:::

## Deep impact

The first time you turn around a newly sliced, diced, filtered, and rolled up metric table for a stakeholder in under an hour instead of a week, not only you, but the stakeholder will immediately feel the value and power of the Semantic Layer.

dbt Labs’ mission is to create and disseminate organizational knowledge. This process, and building a Semantic Layer generally, is about encoding organizational knowledge in such a way that it creates and disseminates _leverage_. Enabled by this process, you can start building your Semantic Layer _today_, without waiting for the magical capacity for a giant overhaul to materialize. Building iterative velocity as you progress, your team can finally make any BI tool deliver the way you need it to.
