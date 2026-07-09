---
title: Why might my actual warehouse costs differ from displayed costs? 
description: "Explanation of why actual warehouse costs may differ from displayed costs"
sidebar_label: 'Actual vs displayed costs'
id: actual-vs-displayed-costs
---

Cost Insights shows estimates based on warehouse-reported usage and your configured pricing variables. These estimates are based on a retroactive analysis of historical runs and reflect actual usage, _not_ forecasts of future costs. Adjustments and differences may occur if:

- Your warehouse has custom pricing that differs from the default compute credit unit.
- There are discounts or credits applied at the billing level that aren't reflected in usage tables.
- Costs include other charges beyond compute.
- **(Snowflake)** Some query cost can't be attributed to a model and is excluded &mdash; specifically short-running queries (roughly 100 milliseconds or less) and queries run on Adaptive Warehouses. Because of these exclusions, Cost Insights totals are typically lower than your Snowflake billing dashboards. For more information, see [Understanding cost and reduction estimates](/docs/explore/cost-insights#understanding-cost-and-reduction-estimates).

Costs Insights in the <Constant name="dbt_platform" /> is designed to be directionally accurate, showing you dbt-specific components rather than matching your billing exactly.
