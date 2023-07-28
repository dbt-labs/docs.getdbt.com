---
title: "More advanced metrics"
id: 6-semantic-layer-advanced-metrics
description: Getting started with the dbt Semantic Layer
displayText: "dbt Cloud Semantic Layer best practices"
hoverSnippet: Learn how to get started with the dbt Semantic Layer
---

## More advanced metric types

We're not limited to just passing measures through to our metrics, we can also _combine_ measures to model more advanced metrics.

- Ratio metrics are, as the name implies, about comparing to measures as a numerator and a denominator to form a metric, for instance the percentage of order items that are food items instead of drinks.
- Derived metrics are when we want to write an expression that calculates a metric using more than one measure. A classic example here is our gross profit calculated by subtracting costs from revenue.
- Cumulative metrics calculate all of a measure over a given window, such as the past week, or if no window is supplied, the all-time total of that measure.

## Ratio metrics

## Derived metrics

## Cumulative metrics
