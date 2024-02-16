---
title: "dbt Semantic Layer FAQs"
id: sl-faqs
description: "Read the FAQs to learn more about the dbt Semantic Layer, how it works, how to build metrics, integrations, and more."
sidebar_label: "Semantic Layer FAQs"
tags: [Semantic Layer]
pagination_next: "docs/use-dbt-semantic-layer/avail-sl-integrations"
---

The [dbt Semantic Layer](/docs/use-dbt-semantic-layer/dbt-sl) is a dbt Cloud offering that allows users to centrally define their metrics within their dbt project using [MetricFlow](/docs/build/about-metricflow).

The dbt Semantic Layer offers:

- Dynamic SQL generation to compute metrics,
- Use [dbt Semantic Layer APIs](/docs/dbt-cloud-apis/sl-api-overview) to query metrics and dimensions,
- First-class [integrations](/docs/use-dbt-semantic-layer/avail-sl-integrations) to query those centralized metrics in downstream tools.

The dbt Semantic Layer is powered by MetricFlow, which is a source-available component.

## Overview of the dbt Semantic Layer

<expandable alt_header="What are the main benefits of using the dbt Semantic Layer?">

The primary value of the dbt Semantic Layer is to centralize and bring consistency to your metrics across your organization. Additionally, it allows you to:

- **Meet your users where they are** by being agnostic to where your end users consume data through the supporting of different APIs for integrations.
- **Optimize costs** by spending less time preparing data for consumption.
- **Simplify your code** by not duplicating metric logic and allowing MetricFlow perform complex calculations for you.
- **Empower stakeholders** with rich context and flexible, yet governed experiences.

</expandable>

<expandable alt_header="What's the main difference between the dbt Semantic Layer and dbt Metrics?">

dbt Metrics is the now-deprecated dbt package that was used to define metrics within dbt. dbt Metrics has been replaced with [MetricFlow](/docs/build/about-metricflow), a more flexible and powerful engine, which powers the foundation of the dbt Semantic Layer today. 

MetricFlow introduces SQL generation to the dbt Semantic Layer and offers more advanced capabilities than dbt Metrics, for example:

- **Query construction** &mdash; MetricFlow iteratively constructs queries using a dataflow plan, our internal DAG for generating SQL. By comparison, dbt Metrics relied on templated Jinja to construct SQL.
- **Joins** &mdash; MetricFlow also has a sophisticated way of handling joins, which dbt Metrics did not support. With MetricFlow you can effortlessly access all valid dimensions for your metrics on the fly, even when they are defined in different semantic models.

</expandable>

<expandable alt_header="Is there a dbt Semantic Layer discussion hub?">

Yes, absolutely! Join the [dbt Slack community](https://app.slack.com/client/T0VLPD22H) and [#dbt-cloud-semantic-layer](https://getdbt.slack.com/archives/C046L0VTVR6) slack channel for all things related to the dbt Semantic Layer.

</expandable>

<expandable alt_header="How does the dbt Semantic Layer fit with different modeling approaches (Medallion, Data Vault, Dimensional modeling)?">

The dbt Semantic Layer is flexible enough to work with many common modeling approaches. It references dbt models, which means how you configure your Semantic Layer will mirror the modeling approach you've taken with the underlying data.

The primary consideration is the flexibility and performance of the underlying queries. For example:

- A star schema data model offers more flexibility for dimensions that are available for a given metric, but will require more joins. 
- A fully denormalized data model is simpler, will be materialized to a specific grain, but won’t be able to join to other tables. 

While the dbt Semantic Layer will work for both cases, it's best to allow MetricFlow do handle some level of denormalization for you in order to provide more flexibility to metric consumers.
</expandable>

<expandable alt_header="How is the dbt Semantic Layer priced?">

The dbt Semantic Layer measures usage in distinct 'Queried Metrics'. Refer to the [Billing](/docs/cloud/billing#what-counts-as-a-queried-metric) to learn more about pricing.
</expandable>

## How does the dbt Semantic Layer works?

<expandable alt_header="Why is the dbt Semantic Layer better than using tables or dbt models to calculate  metrics?">

You can use tables and dbt models to calculate metrics as an option, but it's a static approach that is rigid and cumbersome to maintain. That’s because metrics are seldom useful on their own: they usually need dimensions, grains, and attributes for business users to analyze (or slice and dice) data effectively.

If you create a table with a metric, you’ll need to create numerous other tables derived from that table to show the desired metric cut by the desired dimension or time grain. Mature data models have thousands of dimensions, so you can see how this will quickly result in unnecessary duplication, maintenance, and costs.  It's also incredibly hard to predict all the slices of data that a user is going to need ahead of time.

With the dbt Semantic Layer, you don’t need to pre-join or build any tables; rather, you can simply add a few lines of code to your semantic model, and that data will only be computed when it’s requested.
</expandable>

<expandable alt_header="When I define a semantic model, do I materialize anything?">

No, you don't. When querying the dbt Semantic Layer through our APIs, you are not materializing any data by default. The dbt Semantic Layer dynamically computes the metric using the underlying data tables and returns the output to the end user.
</expandable>

<expandable alt_header="Is the dbt Semantic Layer a physical copy of your data stored on your data warehouse?">

The dbt Semantic Layer does not store a physical copy of your data, it uses underlying tables to construct/compute the requested output.
</expandable>

<expandable alt_header="Where is MetricFlow hosted? How do queries pass through MetricFlow and dbt Cloud and back to the end user?">

MetricFlow is hosted in dbt Cloud. Requests from semantic layer APIs are routed from our API gateway to MetricFlow, which generates the SQL to compute what the user is requesting. MetricFlow hands the SQL back to our gateway, which then executes it against the data platform.
</expandable>

<expandable alt_header="How do I configure the dbt Semantic Layer?">

First, you define semantic models in .yml files that describe your data, including entities (for joins), measures (with aggregation types as a building block to your metrics), and dimensions (to slice and dice your metrics). The next step is to build your metrics on top of these semantic models. This is all done in `.yml` configurations alongside your dbt models in your projects. Read our [Quickstart](/docs/use-dbt-semantic-layer/quickstart-sl) for more information.

</expandable>

<expandable alt_header="How does caching work in the dbt Semantic Layer?">

Beginning in March 2024, the dbt Semantic Layer will offer two layers of caching: the result cache which is a Redis cache and an declarative cache which lives in your data platform.

</expandable>

<expandable alt_header="How are queries optimized to not scan more data than they should?">

MetricFlow always tries to generate SQL in the most performant way while ensuring the metric value is correct. The way we generate SQL means we can add optimizations like predicate pushdown to ensure we don’t perform full table scans.  

</expandable>

<expandable alt_header="What are the latency considerations of using the dbt Semantic Layer?">

The latency of query runtimes is low, in the order of milliseconds.

</expandable>

<expandable alt_header="What if different teams need different definitions?">

If the underlying metric aggregation is different, we posit that these would be different metrics. However, if the teams’ definitions are different due to a filter or dimensional slice, then these can be the same metric that are simply sliced differently dynamically across various downstream tools, or by using a [saved query](/docs/build/saved-queries) to more explicitly separate out the various permutations of it.

</expandable>

## Build metrics and semantic models

<expandable alt_header="Can I define my own aggregations?">

MetricFlow does not currently support custom aggregations on measures. You can find supported aggregation types [here](/docs/build/measures#aggregation).

</expandable>

<expandable alt_header="How are joins identified in the semantic model? ">

[Joins](/docs/build/join-logic) are identified through entities defined in a semantic model. These are the keys in your dataset. You can specify foreign, unique, primary, or natural joins. With multiple semantic models and the entities within them, MetricFlow creates a graph using the semantic models as nodes and the join paths as edges to perform joins automatically. MetricFlow chooses the appropriate join type and avoids fan-out or chasm joins with other tables based on the entity types. You can find supported join types [here](/docs/build/join-logic#types-of-joins).
</expandable>

<expandable alt_header="What is the benefit of “expr” used in semantic models and metric configurations?">

Expr (short for “expression”) allows you to put any arbitrary SQL supported by your data platform in any definition of a measure, entity, or dimension. This can be useful if you want an object name in the semantic model to be different than what it’s called in the database, or if you want to include logic in the definition of the component you are creating. The MetricFlow spec is deliberately opinionated, and we offer “expr” as an escape hatch to allow developers to be more expressive.
</expandable>

<expandable alt_header="Do you support semi-additive metrics?">

Yes, we approach this by specifying a dimension that a metric cannot be aggregated across (i.e time). You can learn how to configure semi-additive dimensions [here](/docs/build/measures#non-additive-dimensions).
</expandable>

<expandable alt_header="Can I use an entity as a dimension?">

Yes, while entities must be defined under “entities,”  they can be queried like dimensions in downstream tools. Additionally, if the entity is not used to perform joins across your semantic models, you may optionally define it as a dimension.
</expandable>

## Available integrations

<expandable alt_header="What analytics tool integration are supported today?">

A number of data applications have integrations with the dbt Semantic Layer, including Tableau, Google Sheets, Hex, and Mode, among others. You can find the current list of dbt Semantic Layer integrations [here](/docs/use-dbt-semantic-layer/avail-sl-integrations).

</expandable>

<expandable alt_header="How can I benefit from using the dbt Semantic Layer if my visualization tool is not currently supported?">

You can use exports to materialize your metrics into a table or view in your data platform, and from there, can connect your visualization tool to your data platform. While this approach does not provide the dynamic benefits of the dbt Semantic Layer, you still benefit from centralized metrics and from using MetricFlow configurations to define, generate, and compute SQL for your metrics.

</expandable>

<expandable alt_header="Why should I use exports as opposed to defining a view within my data platform?">

Creating an export allows you to bring your governed metric definitions into your data platform as a table or view. This means your metric logic is managed centrally in dbt, instead of as a view in your data platform and ensures that metric values remain consistent across all interfaces.

</expandable>

<expandable alt_header="Can metric descriptions be viewed from third-party tools?">

Yes, all of our interfaces/APIs expose metric descriptions, which can be surfaced in downstream tools.

</expandable>

## Permissions and access

<expandable alt_header="How do fine-grained access controls work with the dbt Semantic Layer?">

Currently, the credentials you configure when setting up the dbt Semantic Layer are used for every request, and any physical access policies you have tied to your credentials will be respected. We are currently working on introducing more fine-grained access controls including user level access and group credentials that enable flexible granular permissions.
</expandable>

## Availability

<expandable alt_header="Do I need to be on a specific version of dbt to use dbt Semantic Layer?">
Yes, the dbt Semantic Layer is compatible with dbt v1.6 or higher.
</expandable>

<expandable alt_header="Does dbt Semantic Layer require a specific dbt Cloud plan?">

Yes, dbt Cloud [Enterprise and Team](https://www.getdbt.com/pricing) plan customers can access the dbt Semantic Layer.
</expandable>


<expandable alt_header="Is there a way to leverage dbt Semantic Layer capabilities in dbt Core?">

The dbt Semantic Layer is proprietary to dbt Cloud, however some components of it are open source. Users on dbt Core can take advantage of all MetricFlow features—like defining metrics in their projects—without a Cloud license and can query their semantic layer locally using the command line interface, but cannot dynamically access those metrics via the API or our downstream integrations.
</expandable>

<expandable alt_header="Is there a solution or licensing path for an organization that doesn't use dbt for pipelining, but might like to implement the dbt Semantic Layer?">
If you are interested in the this type of implementation, please reach out to us [here](https://www.getdbt.com/get-started).
</expandable>

## Implementation

<expandable alt_header="What is your recommendation on which ‘staging layer’ the dbt Semantic Layer should talk to? Raw, staging, or marts?">
We recommend to build your semantic layer on top of the marts layer, which represents the clean and transformed data from your dbt models.
</expandable>

<expandable alt_header="Should Semantic Layer credentials mirror those for production environments, or can/should they be different?">

Semantic layer credentials are different than the credentials used to run your dbt models. Specifically, we recommend a less privileged set of credentials since consumers are only reading data.
</expandable>

<expandable alt_header="How does the dbt Semantic Layer support a dbt Mesh architecture design?">

Today, semantic models can be created from dbt models that live across projects (aka dbt Mesh). In the future, users will also be able to use mesh concepts on semantic objects and define metrics across dbt projects.
</expandable>

<expandable alt_header="How do I migrate from the legacy Semantic Layer?">
If you're using the legacy Semantic Layer, we highly recommend you [upgrade your dbt version](/docs/dbt-versions/upgrade-core-in-cloud) to dbt v1.6 or higher to use the new dbt Semantic Layer. Refer to the dedicated [migration guide](/guides/sl-migration) for more info.
</expandable>
