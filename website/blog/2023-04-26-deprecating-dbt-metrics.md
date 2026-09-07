---
title: "Why we're deprecating the dbt_metrics package"
description: "We are bidding adieu to dbt_metrics and moving forward with MetricFlow! Discover how this new source-available project lays the foundation for the dbt Semantic Layer. Let's dive in!"
slug: deprecating-dbt-metrics

authors: [callum_mccann]

hide_table_of_contents: false

date: 2023-04-26
is_featured: true
---


Hello, my dear data people.

If you haven’t read [Nick & Roxi’s blog post about what’s coming in the future of the dbt Semantic Layer](https://www.getdbt.com/blog/dbt-semantic-layer-whats-next/), I highly recommend you read through that, as it gives helpful context around what the future holds.

With that said, it has come time for us to bid adieu to our beloved dbt_metrics package. **Upon the release of dbt-core v1.6 in late July, we will be deprecating support for the dbt_metrics package.** 

<!--truncate-->

With the upcoming integration with MetricFlow, we're on the cusp of a new era for the dbt Semantic Layer. And if we’re honest with ourselves, it is a brighter future than the dbt_metrics package would have been able to support.

We know that some of you have been using the package to help serve your organizations. **We will be providing migration scripts to help reduce the complexity of upgrading to the new specs.** 

If you’re interested in getting ahead of the transition, we recommend that you start familiarizing yourself with the new spec in this [Github Discussion](https://github.com/dbt-labs/dbt-core/discussions/7456). If you’re even more curious, you can read the MetricFlow documentation, although some elements will change in the coming months as we work on the integration. I’m confident that, with a little time, you'll come to love MetricFlow far more than you did dbt_metrics.

Before we get into the technical details around why we’re deprecating the package, I want to give a big thank you to everyone from the community who used or contributed to the dbt_metrics package over the last year. From the bottom of my heart, I’ve loved hearing from all of you and discussing ways to help you solve your organization's data problems. It’s been a dream come true to work in this area and it wouldn’t have been possible without all of you lovely folks.

## Why we’re deprecating

With all that said, let’s dig into the exact reasons why we’re deprecating the package.

**Duplicative functionality:** 

MetricFlow and dbt_metrics share a common purpose – a simplified and standard way to generate SQL to query metrics. However, MetricFlow does this much more effectively, with advanced features and a more robust foundation.

**The Jinja trap:** 

Relying on Jinja macros for generating SQL in dbt_metrics proved to be sub-optimal and restrictive. This approach limited the package's potential and made it difficult to scale and customize for each new metric type and piece of functionality that we wanted to add. In contrast, MetricFlow's Python implementation offers a far more flexible and expressive solution.

- *To further emphasize that MetricFlow is years ahead of dbt_metrics, it actually used to use Jinja templates but moved away from them in a complete overhaul in order to increase flexibility.*

**Focusing on a dynamic semantic layer:** 

We feel strongly that the power of a Semantic Layer lies in its ability to serve the organization dynamically - to answer the user’s first, second, and third questions. As such, **MetricFlow will not support materializing metric queries as static database objects.** Instead, we will focus on caching functionality that increases performance without reducing capability.

**Advanced SQL generation with intelligent joins:**

MetricFlow brings advanced SQL generation to the table and leaves dbt_metrics far behind in terms of capabilities. One of the key features is its sophisticated handling of joins, which has been the number one feature requested by folks within the community. With MetricFlow you can effortlessly access all valid dimensions for your metrics on the fly, even when they are defined in different semantic models. Moreover, you can construct metrics using measures from multiple semantic models.

- *How does it do this?* It creates a graph with semantic models as nodes and join paths as edges, automatically generating the appropriate join type based on the entity types. This approach helps avoid fan-out or chasm joins to ensure that the results are correct. **Trying to do this within Jinja would have been a fool's errand.**

**First-rate validation with a three-step approach**:

MetricFlow offers comprehensive validation for the semantics, making sure that your data models are sound and reliable. This process involves three key steps:

1. **Data warehouse validation**: To further validate your semantics, MetricFlow checks if the semantic definitions exist in your data warehouse. By running queries against your data warehouse, it ensures that the generated SQL for semantic models, dimensions, and metrics will execute as intended.

2. **Semantic validation**: After building your semantic models, MetricFlow runs a suite of tests to ensure that the semantics make sense. For example, it checks if measure names are unique or if metrics reference existing measures. This helps maintain the integrity and consistency of the semantic manifest.
    
3. **Continuous Integration (CI)**: By integrating these validation steps into your CI pipeline, MetricFlow helps catch any issues early in the development process. This results in fewer surprises, a more reliable dbt pipeline, and increased confidence in your DAG.

**A flexible foundation for integration**: 

MetricFlow is a more flexible foundation through which we can provide our integration partners with the tools to build differentiated experiences. This opens the door to exciting collaborations and makes it easier for our partners to build.

So as we bid farewell to the `dbt_metrics` package, we say hello to MetricFlow and all the opportunities and advancements that come with it. This is the next era for the Semantic Layer. 

With the migration tools and resources coming soon, we're committed to supporting you through this transition. We extend our gratitude to everyone who has used, contributed to, or supported dbt_metrics, and we invite you all to join us on this exciting journey toward a brighter future in data analytics. If you're interested in discussing, please come on over to [#dbt-core-metrics](https://getdbt.slack.com/archives/C02CCBBBR1D)!