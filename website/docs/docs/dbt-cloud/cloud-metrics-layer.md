---
title: "What is the dbt Metrics Layer?"
id: "cloud-metrics-layer"
description: "The dbt metrics layer helps you standardize metrics within your organization."
keywords:
  - dbt metrics layer
---

[dbt metrics](/docs/building-a-dbt-project/metrics) keeps your metrics consistent and provides a way to standardize them for an organization by abstracting metrics calculations out of the data warehouse and into the transformation later, which is where dbt exists. dbt metrics solves the problem of trying to calculate metrics along a set of specified dimensions accurately when metrics values are constantly changing.

Because dbt already transforms your data, it can use the same plane of existence to abstract out the metrics. dbt already knows about your core entities, for example, users, orders, and sessions. It can tell you not just about sessions, but average time on site. Or it might tell you not only about users but new users across these dimensions and this time range.

[Sign up for the beta!](https://www.getdbt.com/signup/)
