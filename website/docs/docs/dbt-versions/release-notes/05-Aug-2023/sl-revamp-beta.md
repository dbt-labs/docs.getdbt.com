---
title: "Enhancement: Revamped dbt Semantic Layer available in public beta"
description: "August 2023: The revamped dbt Semantic Layer, now available in public beta, introduces new semantic components and evolves the semantic layer's capability."
sidebar_label: "Enhancement: Revamped dbt Semantic Layer in public beta"
tags: [Aug-2023, dbt Semantic Layer]
date: 2023-08-03
sidebar_position: 7
---

:::important
If you're using the legacy Semantic Layer, we **highly** recommend you [upgrade your dbt version](/docs/dbt-versions/upgrade-core-in-cloud) to dbt v1.6 or higher to use the new dbt Semantic Layer. To migrate to the new Semantic Layer, refer to the dedicated [migration guide](/guides/migration/sl-migration) for more info.
:::

dbt Labs are thrilled to announce the re-release of the [dbt Semantic Layer](/docs/use-dbt-semantic-layer/dbt-sl), now available in [public beta](#public-beta). It aims to bring the best of modeling and semantics to downstream applications by introducing:

- [MetricFlow](/docs/build/about-metricflow) is a framework for constructing performant and legible SQL from an all new set of semantic constructs which include semantic models, entities, and metrics.
- New Semantic Layer infrastructure that enables support for more data platforms (Snowflake, Databricks, BigQuery, Redshift, and soon more), along with improved performance.
- New and improved [developer workflows](/guides/migration/sl-migration), governance, and collaboration features.
- New [Semantic Layer API](/docs/dbt-cloud-apis/sl-api-overview) using JDBC to query metrics and build integrations.

With semantics at its core, the dbt Semantic Layer marks a crucial milestone towards a new era of centralized logic and data applications.

<Lightbox src="/img/docs/dbt-cloud/semantic-layer/sl-architecture.jpg" width="75%" title="The universal dbt Semantic Layer connecting to integration tools."/>

## Enhanced dbt Semantic Layer

What sets the dbt Semantic Layer apart is its ability to centralize logic for many downstream data applications, streamlining access and governance and enabling more efficient utilization of data models. It provides a consistent view of data while simplifying complex tasks in downstream applications and reducing the costs of and barriers to data access.

We are excited to present several important capabilities with the enhanced dbt Semantic Layer:

- **Consistent organization**: Provides a consistent view of data, ensuring that metrics and definitions match across the organization and the breadth of interfaces where data is consumed. This fosters trust in data and drives better decision-making by eliminating inconsistencies and errors that come up when individual users define metrics independently.

- **Improved governance**: The dbt Semantic Layer ensures proper governance and auditing of data changes, providing an auditable record of modifications and clear ownership. This saves time by making it clear who can create and manage new metrics, ensuring accountability and data integrity.

- **Reduce costs**: The dbt Semantic Layer simplifies complex tasks, such as bridging entities across a semantic graph. Often users duplicate slices and dice of data and make them available in a data platform, making it difficult to manage and causing high computation. The dbt Semantic Layer minimizes duplication of work and reduces computational costs - allowing users to focus on analyzing data rather than navigating intricate technical processes or duplicating work.

- **Enhanced efficiency**: With the dbt Semantic Layer, data teams can create and update metrics using a new set of validations that make defining and iterating on metrics efficient. The streamlined development workflows makes it simpler for a data team to serve large organizations with broad data needs.

- **Accessible data**: Defining common metrics and dimensions and making them joinable, makes access simpler for users with less expertise in the specifics of a company's data modeling work. This creates opportunities to leverage data insights, fostering collaboration and driving innovation in a more inclusive data environment.

By bringing these enhancements to the dbt Semantic Layer, we enable organizations of all sizes and industries to leverage the power of semantics in their data workflows.

## Public beta

The dbt Semantic Layer is currently available as a public beta, which means:

- **Who** &mdash; To experience the new dbt Semantic Layer, you must be on a dbt Cloud [Team and Enterprise](https://www.getdbt.com/pricing/) multi-tenant dbt Cloud plan, [hosted](/docs/cloud/about-cloud/regions-ip-addresses) in North America and on dbt v1.6 and higher. Look out for announcements on removing the location requirement soon.

  - Developer plans or dbt Core users can use MetricFlow to define and test metrics using the dbt MetricFlow CLI only.

- **What** &mdash; Public beta provides early access to new features. The dbt Semantic Layer is stable and you can use it for production deployments, but there may still be some planned additions and modifications to product behaviors before moving to general availability later this year. We may also introduce new functionality that isn't backwards compatible. We provide support, and relevant service level objectives (SLOs) apply. If you have any questions on pricing, please reach out to your account representative.

- **When** &mdash; Public beta starts on August 1st, 2023.

- **Where** &mdash; You can experience the dbt Semantic Layer in dbt Cloud. Public beta is enabled at the account level so you don’t need to worry about enabling it per user.

## Next steps

To experience the universal dbt Semantic Layer and its enhanced beta capabilities, check out:

- [Introducing the new dbt Semantic Layer](https://www.getdbt.com/blog/introducing-new-look-dbt-semantic-layer)
- [dbt Semantic Layer docs](/docs/use-dbt-semantic-layer/dbt-sl)
- [dbt Semantic Layer get started guide](/docs/use-dbt-semantic-layer/quickstart-sl)
- [Build your metrics with MetricFlow](/docs/build/build-metrics-intro)

