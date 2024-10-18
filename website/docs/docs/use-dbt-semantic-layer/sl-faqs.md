---
title: "dbt Semantic Layer FAQs"
id: sl-faqs
description: "Read the FAQs to learn more about the dbt Semantic Layer, how it works, how to build metrics, integrations, and more."
sidebar_label: "Semantic Layer FAQs"
tags: [Semantic Layer]
pagination_next: null
---

The [dbt Semantic Layer](/docs/use-dbt-semantic-layer/dbt-sl) is a dbt Cloud offering that allows users to centrally define their metrics within their dbt project using [MetricFlow](/docs/build/about-metricflow).

The dbt Semantic Layer offers:

- Dynamic SQL generation to compute metrics
- APIs to query metrics and dimensions
- First-class [integrations](/docs/cloud-integrations/avail-sl-integrations) to query those centralized metrics in downstream tools

The dbt Semantic Layer is powered by MetricFlow, which is a source-available component.

## Overview of the dbt Semantic Layer

<Expandable alt_header="What are the main benefits of using the dbt Semantic Layer?">

The primary value of the dbt Semantic Layer is to centralize and bring consistency to your metrics across your organization. Additionally, it allows you to:

- **Meet your users where they are** by being agnostic to where your end users consume data through the supporting of different APIs for integrations.
- **Optimize costs** by spending less time preparing data for consumption.
- **Simplify your code** by not duplicating metric logic and allowing MetricFlow to perform complex calculations for you.
- **Empower stakeholders** with rich context and flexible, yet governed experiences.

<Lightbox src="/img/docs/dbt-cloud/semantic-layer/sl-concept.png" width="90%" title="This diagram shows how the dbt Semantic Layer works with your data stack." />

</Expandable>

<Expandable alt_header="What's the main difference between the dbt Semantic Layer and dbt Metrics?">

dbt Metrics is the now-deprecated dbt package that was used to define metrics within dbt. dbt Metrics has been replaced with [MetricFlow](/docs/build/about-metricflow), a more flexible and powerful engine, which powers the foundation of the dbt Semantic Layer today.

MetricFlow introduces SQL generation to the dbt Semantic Layer and offers more advanced capabilities than dbt Metrics, for example:

- **Query construction** &mdash; MetricFlow iteratively constructs queries using a dataflow plan, our internal DAG for generating SQL. By comparison, dbt Metrics relied on templated Jinja to construct SQL.
- **Joins** &mdash; MetricFlow also has a sophisticated way of handling joins, which dbt Metrics did not support. With MetricFlow you can effortlessly access all valid dimensions for your metrics on the fly, even when they are defined in different semantic models.

</Expandable>

<Expandable alt_header="Is there a dbt Semantic Layer discussion hub?">

Yes, absolutely! Join the [dbt Slack community](https://app.slack.com/client/T0VLPD22H) and [#dbt-cloud-semantic-layer](https://getdbt.slack.com/archives/C046L0VTVR6) slack channel for all things related to the dbt Semantic Layer.

</Expandable>

<Expandable alt_header="How does the dbt Semantic Layer fit with different modeling approaches (Medallion, Data Vault, Dimensional modeling)?">

The dbt Semantic Layer is flexible enough to work with many common modeling approaches. It references dbt models, which means how you configure your Semantic Layer will mirror the modeling approach you've taken with the underlying data.

The primary consideration is the flexibility and performance of the underlying queries. For example:

- A star schema data model offers more flexibility for dimensions that are available for a given metric, but will require more joins.
- A fully denormalized data model is simpler, will be materialized to a specific grain, but won’t be able to join to other tables.

While the dbt Semantic Layer will work for both cases, it's best to allow MetricFlow do handle some level of denormalization for you in order to provide more flexibility to metric consumers.
</Expandable>

<Expandable alt_header="How is the dbt Semantic Layer priced?">

The dbt Semantic Layer measures usage in distinct 'Queried Metrics'. Refer to the [Billing](/docs/cloud/billing#what-counts-as-a-queried-metric) to learn more about pricing.
</Expandable>

## Availability

<Expandable alt_header="What data platforms are supported by the dbt Semantic Layer?">

The dbt Semantic Layer supports the following data platforms:

- Snowflake
- BigQuery
- Databricks
- Redshift

Support for other data platforms, such as Fabric and Trino, isn't available at this time. If you're interested in using the dbt Semantic Layer with a data platform not on the list, please [contact us](https://www.getdbt.com/get-started).
</Expandable>

<Expandable alt_header="Do I need to be on a specific version of dbt to use dbt Semantic Layer?">

Yes, the dbt Semantic Layer is compatible with [dbt v1.6 or higher](/docs/dbt-versions/upgrade-dbt-version-in-cloud).
</Expandable>

<Expandable alt_header="Does dbt Semantic Layer require a specific dbt Cloud plan?">

Yes, dbt Cloud [Enterprise or Team](https://www.getdbt.com/pricing) plan customers can access the dbt Semantic Layer.
</Expandable>

<Expandable alt_header="Is there a way to leverage dbt Semantic Layer capabilities in dbt Core?">

The dbt Semantic Layer is proprietary to dbt Cloud, however some components of it are open-source. dbt Core users can use MetricFlow features, like defining metrics in their projects, without a dbt Cloud plan.

dbt Core users can also query their semantic layer locally using the command line. However, they won't be able to use the [APIs](/docs/dbt-cloud-apis/sl-api-overview) or [available integrations](/docs/cloud-integrations/avail-sl-integrations) to access metrics dynamically.

</Expandable>

<Expandable alt_header="Is there a solution or licensing path for an organization that doesn't use dbt for pipelining, but might like to implement the dbt Semantic Layer?">

If you're interested in the this type of implementation, please reach out to us [here](https://www.getdbt.com/get-started).
</Expandable>

## How does the dbt Semantic Layer work?

<Expandable alt_header="Why is the dbt Semantic Layer better than using tables or dbt models to calculate  metrics?">

You can use tables and dbt models to calculate metrics as an option, but it's a static approach that is rigid and cumbersome to maintain. That’s because metrics are seldom useful on their own: they usually need dimensions, grains, and attributes for business users to analyze (or slice and dice) data effectively.

If you create a table with a metric, you’ll need to create numerous other tables derived from that table to show the desired metric cut by the desired dimension or time grain. Mature data models have thousands of dimensions, so you can see how this will quickly result in unnecessary duplication, maintenance, and costs. It's also incredibly hard to predict all the slices of data that a user is going to need ahead of time.

With the dbt Semantic Layer, you don’t need to pre-join or build any tables; rather, you can simply add a few lines of code to your semantic model, and that data will only be computed upon request.

<Lightbox src="/img/docs/dbt-cloud/semantic-layer/sl-concept.png" width="90%" title="This diagram shows how the dbt Semantic Layer works with your data stack." />

</Expandable>

<Expandable alt_header="Do I materialize anything when I define a semantic model?">

No, you don't. When querying the dbt Semantic Layer through the [Semantic Layer APIs](/docs/dbt-cloud-apis/sl-api-overview), you're not materializing any data by default.

The dbt Semantic Layer dynamically computes the metric using the underlying data tables. Then it returns the output to the end user.
</Expandable>

<Expandable alt_header="Is the dbt Semantic Layer a physical copy of your data stored on your data warehouse?">

The dbt Semantic Layer does not store a physical copy of your data. It uses underlying tables to construct or compute the requested output.
</Expandable>

<Expandable alt_header="How does the Semantic Layer handle data?">

The dbt Semantic Layer is part of dbt Cloud. It allows data teams to define metrics once, centrally, and access them from any integrated analytics tool, ensuring consistent answers across diverse datasets. In providing this service, dbt Labs permits clients to access Semantic Layer metrics. Client data passes through the Semantic Layer on the way back from the data warehouse.

dbt Labs handles this in a secure way using encryption and authentication from the client’s data warehouse. In certain cases, such data may be cached on dbt Labs system ephemerally (data is not persistently stored).

dbt Labs employees cannot access cached data during normal business operations and must have a business need and/or direct manager approval for access to the underlying infrastructure. Access would only be when necessary for providing a client services and never with the purpose of enriching dbt Labs.

No client warehouse data is retained on dbt Labs's systems. We offer a caching solution to optimize query performance. The caching feature uses client data warehouse storage rather than being stored on dbt Labs’s systems. In addition, this feature is activated only through a client opt-in. Therefore, caching is always in client hands and at client discretion

</Expandable>

<Expandable alt_header="Does our agreement, the Terms of Service (ToS) for dbt Cloud, apply to the Semantic Layer?">

Yes it does.

</Expandable>

<Expandable alt_header="Where is MetricFlow hosted? How do queries pass through MetricFlow and dbt Cloud and back to the end user?">

MetricFlow is hosted in dbt Cloud. Requests from the [Semantic Layer APIs](/docs/dbt-cloud-apis/sl-api-overview) are routed from our API gateway to MetricFlow, which generates the SQL to compute what's requested by the user. MetricFlow hands the SQL back to our gateway, which then executes it against the data platform.
</Expandable>

<Expandable alt_header="How do I configure the dbt Semantic Layer?">

1. You define [semantic models](/docs/build/semantic-models) in YAML files that describe your data, including entities (for joins), measures (with aggregation types as a building block to your metrics), and dimensions (to slice and dice your metrics).

2. Then you build your metrics on top of these semantic models. This is all done in `.yml` configurations alongside your dbt models in your projects.
3. Once you've defined your metrics and semantic models, you can [configure the dbt Semantic Layer](/docs/use-dbt-semantic-layer/setup-sl) in dbt Cloud.

Read our [dbt Semantic Layer quickstart](/guides/sl-snowflake-qs) guide for more information.

</Expandable>

<Expandable alt_header="How does caching work in the dbt Semantic Layer?">

Beginning in March 2024, the dbt Semantic Layer will offer two layers of caching:

- The result cache, which caches query results in the data platform so that subsequent runs of the same query are faster.
- A declarative cache which also lives in your data platform.

</Expandable>

<Expandable alt_header="Does the dbt Semantic Layer expect all models to be in normalized format?">

No, the dbt Semantic Layer is flexible enough to work with many data modeling approaches including Snowflake, Star schemas, Data vaults, or other normalized tables.
</Expandable>

<Expandable alt_header="How are queries optimized to not scan more data than they should?">

MetricFlow always tries to generate SQL in the most performant way, while ensuring the metric value is correct. It generates SQL in a way that allows us to add optimizations, like predicate pushdown, to ensure we don’t perform full table scans.

</Expandable>

<Expandable alt_header="What are the latency considerations of using the dbt Semantic Layer?">

The latency of query runtimes is low, in the order of milliseconds.

</Expandable>

<Expandable alt_header="What if different teams have different definitions?">

If the underlying metric aggregation is different, then these would be different metrics. However, if teams have different definitions because they're using specific filters or dimensions, it's still the same metric. They're just using it in different ways.

This can be managed by adjusting how the metric is viewed in downstream tools or setting up [saved queries](/docs/build/saved-queries) to handle the various permutations of it.

</Expandable>

## Build metrics and semantic models

<Expandable alt_header="Can I define my own aggregations?">

MetricFlow does not currently support custom aggregations on measures. You can find supported aggregation types [here](/docs/build/measures#aggregation).

</Expandable>

<Expandable alt_header="How are joins identified in the semantic model? ">

[Joins](/docs/build/join-logic) are identified through [entities](/docs/build/entities) defined in a [semantic model](/docs/build/semantic-models). These are the keys in your dataset. You can specify `foreign`, `unique`, `primary`, or `natural` joins.

With multiple semantic models and the entities within them, MetricFlow creates a graph using the semantic models as nodes and the join paths as edges to perform joins automatically. MetricFlow chooses the appropriate join type and avoids fan-out or chasm joins with other tables based on the entity types. You can find supported join types [here](/docs/build/join-logic#types-of-joins).
</Expandable>

<Expandable alt_header="What is the benefit of “expr” used in semantic models and metric configurations?">

Expr (short for “expression”) allows you to put any arbitrary SQL supported by your data platform in any definition of a measure, entity, or dimension.

This is useful if you want the object name in the semantic model to be different than what it’s called in the database. Or if you want to include logic in the definition of the component you're creating.

The MetricFlow spec is deliberately opinionated, and we offer “expr” as an escape hatch to allow developers to be more expressive.
</Expandable>

<Expandable alt_header="Do you support semi-additive metrics?">

Yes, we approach this by specifying a [dimension](/docs/build/dimensions) that a metric cannot be aggregated across (such as `time`). You can learn how to configure semi-additive dimensions [here](/docs/build/measures#non-additive-dimensions).
</Expandable>

<Expandable alt_header="Can I use an entity as a dimension?">

Yes, while [entities](/docs/build/entities) must be defined under “entities,” they can be queried like dimensions in downstream tools. Additionally, if the entity isn't used to perform joins across your semantic models, you may optionally define it as a dimension.
</Expandable>

<Expandable alt_header="Can I test my semantic models and metrics?">

Yes! You can validate your semantic nodes (semantic models, metrics, saved queries) in a few ways:

- [Query and validate you metrics](/docs/build/metricflow-commands) in your development tool before submitting your code changes.
- [Validate semantic nodes in CI](/docs/deploy/ci-jobs#semantic-validations-in-ci) to ensure code changes made to dbt models don't break these metrics.

</Expandable>

## Available integrations

<Expandable alt_header="What integrations are supported today?">

There are a number of data applications that have integrations with the dbt Semantic Layer, including Tableau, Google Sheets, Hex, and Mode, among others.

Refer to [Available integrations](/docs/cloud-integrations/avail-sl-integrations) for more information.

</Expandable>

<Expandable alt_header="How can I benefit from using the dbt Semantic Layer if my visualization tool is not currently supported?">

You can use [exports](/docs/use-dbt-semantic-layer/exports) to materialize your metrics into a table or view in your data platform. From there, you can connect your visualization tool to your data platform.

Although this approach doesn't provide the dynamic benefits of the dbt Semantic Layer, you still benefit from centralized metrics and from using MetricFlow configurations to define, generate, and compute SQL for your metrics.

</Expandable>

<Expandable alt_header="Why should I use exports as opposed to defining a view within my data platform?">

Creating an [export](/docs/use-dbt-semantic-layer/exports) allows you to bring your governed metric definitions into your data platform as a table or view. This means your metric logic is managed centrally in dbt, instead of as a view in your data platform and ensures that metric values remain consistent across all interfaces.

</Expandable>

<Expandable alt_header="Can metric descriptions be viewed from third-party tools?">

Yes, all of our interfaces or APIs expose metric descriptions, which you can surface in downstream tools.

</Expandable>

## Permissions and access

<Expandable alt_header="How do fine-grained access controls work with the dbt Semantic Layer?">

The dbt Semantic Layer uses service tokens for authentication, mapped to underlying data platform credentials. These credentials control physical access to the raw data. The credential configuration allows admins to create a credential and map it to service tokens, which can then be shared to relevant teams for BI connection setup. You can configure credentials and service tokens to reflect your teams and their roles. 

Currently, the credentials you configure when setting up the dbt Semantic Layer are used for every request. Any physical access policies you have tied to your credentials will be respected.

We are currently working on introducing more fine-grained access controls, including user-level access and group credentials, that enable flexible granular permissions.

</Expandable>

## Implementation

<Expandable alt_header="How can I implement dbt Mesh with the dbt Semantic Layer">

import SLMeshFAQs from '/snippets/_sl-dbt-mesh-faq.md';

<SLMeshFAQs/>

</Expandable>

<Expandable alt_header="Which ‘staging layer’ should the dbt Semantic Layer talk to? Raw, staging, or marts?">

We recommend to build your semantic layer on top of the [marts layer](/best-practices/how-we-structure/4-marts), which represents the clean and transformed data from your dbt models.
</Expandable>

<Expandable alt_header="Should semantic layer credentials mirror those for production environments? Or should they be different?">

Semantic layer credentials are different than the credentials you use to run dbt models. Specifically, we recommend a less privileged set of credentials since consumers are only reading data.
</Expandable>

<Expandable alt_header="How does the dbt Semantic Layer support a dbt Mesh architecture design?">

Currently, semantic models can be created from dbt models that live across projects ([dbt Mesh](/best-practices/how-we-mesh/mesh-1-intro)). In the future, users will also be able to use mesh concepts on semantic objects and define metrics across dbt projects.
</Expandable>

<Expandable alt_header="How do I migrate from the legacy Semantic Layer?">

If you're using the legacy Semantic Layer, we highly recommend you [upgrade your dbt version](/docs/dbt-versions/upgrade-dbt-version-in-cloud) to dbt v1.6 or higher to use the latest dbt Semantic Layer. Refer to the dedicated [migration guide](/guides/sl-migration) for more info.
</Expandable>
