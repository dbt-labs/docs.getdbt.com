---
title: "Advanced data modeling"
description: "Learn about advanced topics for dbt Semantic Layer and MetricFlow, such as modeling workflows and more."
pagination_prev: null
---

The <Constant name="semantic_layer" /> and MetricFlow are powerful tools that allow you to define metrics and semantic models in your dbt project. 

This section covers advanced topics for the <Constant name="semantic_layer" /> and MetricFlow, such as data modeling workflows, and more.
<!--
- [Fill null values for simple and derived or ratio metrics](/docs/build/fill-nulls-advanced) &mdash; Use `fill_nulls_with` to set null metric values to zero, ensuring numeric values for every data row, even with derived metrics.
-->

<div className="grid--2-col">

<Card
    title="Fill null values for metrics"
    body="Use <code>fill_nulls_with</code> to set null metric values to zero, ensuring numeric values for every data row."
    link="/docs/build/fill-nulls-advanced"
    icon="dbt-bit"/>

<Card
    title="Metrics as dimensions with metric filters"
    body="Add metrics as dimensions to your metric filters to create more complex metrics and gain more insights."
    link="/docs/build/ref-metrics-in-filters"
    icon="dbt-bit"/>

</div>
