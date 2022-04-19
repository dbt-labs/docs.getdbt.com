---
title: "What is the dbt metrics layer?"
id: "cloud-metrics-layer"
description: "The dbt metrics layer helps you standardize metrics within your organization."
keywords:
  - dbt metrics layer
---

[dbt metrics](/docs/building-a-dbt-project/metrics) ensure metric consistency and provide a way to standardize metrics under version control in dbt projects. By abstracting metrics calculations out of pre-aggregated tables or specific business intelligence tools (BI tools), dbt metrics can be defined once and used everywhere. Defining metrics in one place ensures consistent reporting of key business metrics especially in an environment where metric definitions and dimensions are changing along with your business.

The data models that power these metrics already exist in your dbt project. You can use dbt metrics in different ways:
  
* High-level view of your most important key performance indicators (KPIs), such as  weekly active users, revenue, or time-on-site. 
* Drilled-down view of the core entities that comprise those metrics, such as users, orders, or pageviews. 

While dbt does not currently provide a BI experience for exploring these metrics, we’re working on a number of integrations with BI partners that will help unlock the full value of the metrics layer.

If you’re interested in taking metrics for a spin or integrating your product with dbt metrics, you can [sign up for the beta!](https://docs.google.com/forms/d/1MjVfD3rLg2hpjEbOaaocnjGtUdNY-wNpoyy1aHL_x9o/viewform)
