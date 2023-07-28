---
title: "Build your first metric"
id: 4-semantic-layer-build-metric
description: Getting started with the dbt Semantic Layer
displayText: "dbt Cloud Semantic Layer best practices"
hoverSnippet: Learn how to get started with the dbt Semantic Layer
---

## Our first metric

- We'll start with one of the most important metrics for any business: **revenue**.
- For now, our metric for revenue will be **defined as the sum of order totals excluding tax**.
- Let's create a file called `metrics.yml` in our marts folder for now to write our first metric in.

## Defining revenue

- 🔢 Metrics have four basic properties:
  - `name:` We'll use 'revenue' to reference this metric.
  - `description:` For documentation.
  - `label:` The display name for the metric in downstream tools.
  - `type:` one of `simple`, `ratio`, or `derived`.
- 🎛️ Each type has different `type_params`.
- 🛠️ We'll build a **simple metric** first to get the hang of it, and move on to ratio and derived metrics later.
- 📏 Simple metrics are built on a **single measure defined as a type parameter**.
- 🔜 Defining **measures as their own distinct component** on semantic models is critical to allowing the **flexibility of more advanced metrics**, though simple metrics act mainly as **pass-through that provide filtering** and labeling options. A `create_metric` option for measures is coming in the next version of MetricFlow to **save you writing extra code** for simple metrics that make no changes to the underlying measure.

```YAML
metrics:
  - name: revenue
    description: Sum of the order total.
    label: Revenue
    type: simple
    type_params:
      measure: order_total
```

## Query your metric

- It's best practice any time we're updating our semantic layer code to run a `dbt parse && mf validate-configs`.
- If everything passes, we can start querying this metric with `mf query`!
- `mf query` is not how you would use the tool in production, that's handled by the dbt Semantic Layer's cloud features. It's available for testing results of various metric queries in development, exactly as we're using it now.
- Try `mf query --metrics revenue --group-by metric_time_day` and see a preview of the data come back.

<!-- TODO: Results -->
