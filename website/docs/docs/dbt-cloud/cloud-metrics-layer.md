---
title: "What is the dbt Metrics Layer?"
id: "cloud-metrics-layer"
description: "The dbt metrics layer helps you standardize metrics within your organization."
keywords:
  - dbt metrics layer
---

[dbt metrics](/docs/building-a-dbt-project/metrics) ensure metric consistency and provide a way to standardize metrics under version control in dbt projects. By abstracting metrics calculations out of pre-aggregated tables or specific business intelligence tools (BI tools), dbt metrics can be defined once and used everywhere. This helps ensure consistent reporting of key business metrics especially in an environment where metric definitions and dimensions are changing along with your business.

dbt already transforms your data, so it can use the same plane of existence to abstract out the metrics. Because dbt already knows about your core entities, such as users, orders, and sessions, dbt metrics can reveal a broader story. You can learn not just about sessions, but about average time on site, or not only about users but about new users across these dimensions and this time range.

[Sign up for the beta!](https://forms.gle/4hi8YQ4mQ35QvYCh7)
