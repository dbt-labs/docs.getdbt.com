---
title: "Enhancement: Revamped dbt Semantic Layer available in public beta"
description: "July 2023: The revamped dbt Semantic Layer, now available in public beta, introduces new semantic components and evolves the semantic layer's capability."
sidebar_label: "Enhancement: Revamped dbt Semantic Layer in public beta"
tags: [July-2023, dbt Semantic Layer]
date: 2023-07-31
sidebar_position: 9
---

We are thrilled to announce the re-release of the [dbt Semantic Layer](/docs/use-dbt-semantic-layer/dbt-sl), now available in [public beta](#public-beta). It revolutionizes data analysis by introducing:

- [MetricFlow](/docs/build/about-metricflow) &mdash;  a new way to define metrics in dbt and one of the key components of the dbt Semantic Layer
- New semantic components like semantic models and metrics, which help lay the foundation for effective organization and interaction with data,
- Improved governance, enhanced efficiency, and data accessibility
- New [Semantic Layer APIs](/docs/dbt-cloud-apis/sl-api-overview) to query metrics and build integrations

With semantics at its core, the dbt Semantic Layer marks a crucial milestone towards a new era of centralized logic and data applications.

<Lightbox src="/img/docs/dbt-cloud/semantic-layer/sl-architecture.jpg" width="95%" title="The universal dbt Semantic Layer connecting to integration tools."/>

## Why the dbt Semantic Layer?

What sets the dbt Semantic Layer apart is its ability to centralize logic and data applications, streamlining processes and enabling efficient management and utilization of data models. It provides a consistent view of data, incorporating context and historical information, simplifying complex tasks, and reducing costs.

We are excited to present several important capabilities with the enhanced dbt Semantic Layer:

- **Consistent organization**: Provides a consistent view of data, ensuring that metrics and definitions match across the organization. This fosters trust in data and drives better decision-making by eliminating inconsistencies and errors that come up when individual users define metrics independently.

- **Improved governance**: The dbt Semantic Layer ensures proper governance and auditing of data changes, providing an auditable record of modifications and clear ownership. This saves time by making it clear who can create and manage new metrics, ensuring accountability and data integrity.

- **Reduce costs**: The dbt Semantic Layer simplifies complex tasks, such as bridging entities across a semantic graph. Often users duplicate slices and dice of data and make them available in a data platform, making it difficult to manage and causing high computation. The dbt Semantic Layer minimizes duplication of work and reducing computational costs - allowing users to focus on analyzing data rather than navigating intricate technical processes or duplicating work. 

- **Enhanced efficiency**: With the dbt Semantic Layer, data teams can create and update metrics in one central location, saving time and reducing the risk of errors and downstream impacts. The agnostic approach allows seamless integration with various data platforms and downstream BI tools, making migration easier and more flexible.

- **Accessible data**: Without the dbt Semantic Layer, there would be limited access to critical information which stifles effective communication. An accessible semantic layer allows all users to have equal opportunities to leverage data insights, fostering collaboration and driving innovation. 

By bringing these enhancements to the dbt Semantic Layer, we enable organizations of all sizes and industries to leverage the power of semantics in their data workflows. 

## Public beta 

THINKING OF TURNING INTO A TABLE ONCE I HAVE THE ACCURATE INFO AND MOVING ABOVE AFTER INTO (BEFORE 'WHY SL')

The dbt Semantic Layer is currently available as a public beta, which means:

- **Who?** The dbt Semantic Layer is open to all dbt Cloud tiers (Developer, Team, and Enterprise) during public beta. 
  * Developer accounts will be able to query the Proxy Server using SQL, but will not be able to browse dbt metrics in external tools, which requires access to the Semantic Layer and Discovery APIs. 
- **What?** Public Previews provide early access to new features. The Semantic Layer is stable and you can use it for production deployments, but there may still be some planned additions and modifications to product behaviors before moving to general availability. We may also introduce new functionality that isn't backwards compatible. dbt Labs provides support, and relevant service level objectives (SLOs) apply. We will introduce pricing for the dbt Semantic Layer alongside the General Available (GA) release (future GA date to be announced).
- **When?**  Public Preview will end once the dbt Semantic Layer is available for GA. After GA, the dbt Semantic Layer will only be available to dbt Cloud **Team** and **Enterprise** plans.
- **Where?** Public Preview is enabled at the account level so you don’t need to worry about enabling it per user

## Next steps

To experience the universal dbt Semantic Layer and its enhanced beta capabilities, check out:

- [Revamped dbt Semantic Layer documents](/docs/use-dbt-semantic-layer/dbt-sl)
- [dbt Semantic Layer get started guide](/docs/use-dbt-semantic-layer/quickstart-sl)
- [Build your metrics with MetricFlow](/docs/build/build-metrics-intro)
- BLOG announcement link.
