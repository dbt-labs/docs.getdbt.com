---
title: "Building metrics"
description: Getting started with the dbt Semantic Layer
hoverSnippet: Learn how to get started with the dbt Semantic Layer
pagination_next: "best-practices/how-we-build-our-metrics/semantic-layer-5-advanced-metrics"
---

## How to build metrics

- 💹 We'll start with one of the most important metrics for any business: **revenue**.
- 📖 For now, our metric for revenue will be **defined as the sum of order totals excluding tax**.

## Defining revenue

- 🔢 Metrics have four basic properties:
  - `name:` We'll use 'revenue' to reference this metric.
  - `description:` For documentation.
  - `label:` The display name for the metric in downstream tools.
  - `type:` one of `simple`, `ratio`, or `derived`.
- 🎛️ Each type has different `type_params`.
- 🛠️ We'll build a **simple metric** first to get the hang of it, and move on to ratio and derived metrics later.
- 📏 Simple metrics are built on a **single measure defined as a type parameter**.
- 🔜 Defining **measures as their own distinct component** on semantic models is critical to allowing the **flexibility of more advanced metrics**, though simple metrics act mainly as **pass-through that provide filtering** and labeling options.

<File name="models/marts/orders.yml" />

```yml
metrics:
  - name: revenue
    description: Sum of the order total.
    label: Revenue
    type: simple
    type_params:
      measure: order_total
```

## Query your metric

You can use the <Constant name="cloud_cli" /> for metric validation or queries during development, via the `dbt sl` set of subcommands. Here are some useful examples:

```bash
dbt sl query revenue --group-by metric_time__month
dbt sl list dimensions --metrics revenue # list all dimensions available for the revenue metric
```

- It's best practice any time we're updating our <Constant name="semantic_layer" /> code to run `dbt parse` to update our development semantic manifest.
- `dbt sl query` is not how you would typically use the tool in production, that's handled by the <Constant name="cloud" /> Semantic Layer's features. It's available for testing results of various metric queries in development, exactly as we're using it now.
- Note the structure of the above query. We select the metric(s) we want and the dimensions to group them by — we use dunders (double underscores e.g.`metric_time__[time bucket]`) to designate time dimensions or other non-unique dimensions that need a specified entity path to resolve (e.g. if you have an orders location dimension and an employee location dimension both named 'location' you would need dunders to specify `orders__location` or `employee__location`).
