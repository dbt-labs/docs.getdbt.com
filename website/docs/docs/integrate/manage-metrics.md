---
title: "Manage metrics "
id: manage-metrics
description: "Manage and define metrics for your project"
sidebar_label: "Manage metrics"
---


:::📌 New to dbt or metrics? 

Review our [Getting Started guide](/docs.getdbt.com/guides/getting-started) to build your first dbt project and then our [Jaffle Shop](https://github.com/dbt-labs/jaffle_shop_metrics) project to define your first example metrics!

:::

If you're not sure whether to define a metric in dbt or not, ask yourself the following: *Is this something our teams consistently need to report on?*  

An important business metric should be:

- Well-defined (the definition is agreed upon throughout the entire organization)
- Time-bound (able to be compared across time)

A great example of this is revenue - it can be aggregated on multiple levels (weekly, monthly, etc) and is key for the broader business to understand:

The dbt Semantic Layer supports the calculation of metrics by using the [dbt-metrics package](https://github.com/dbt-labs/dbt_metrics). This package supports the following primary aggregate metrics:

- Count
- Count distinct
- Average
- Max
- Min
- Sum

Additionally, the dbt-metrics package supports *secondary* metric calculations including:

- Period over Period changes differences and ratios
- Period to date average, sum, min, and max
- Rolling average, sum, min, and max

The secondary metric calculations use a built-in calendar, which you can use to define time boundaries for weeks, months, and quarters. The default calendar is applicable for many businesses, and users may supply their own calendars if they use non-standard quarters or other time constructs for reporting.

**Define metrics**

To design, define and query your own metrics, review the following documents for more details:

- [dbt metrics](/docs.getdbt.com/docs/building-a-dbt-project/metrics) for in-depth detail on attributes, properties, filters, and how to define and query your metrics
- [`FUTURE BLOG POST`](URL) to understand best practices for designing and structuring metrics in your dbt project
- [`Integrate with dbt`](URL) to learn about the dbt Semantic Layer
- [Getting started with the Semantic Layer](/docs.getdbt.com/blog/getting-started-with-the-dbt-semantic-layer) blog post to see further examples
