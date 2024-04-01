---
title: "dbt Semantic Layer updates and fixes for March 2024"
description: "March 2024 updates for dbt Semantic Layer & MetricFlow: New export features, enhanced date filters, Tableau, Google Sheets & GraphQL API enhancements, and bug fixes."
sidebar_label: "Updates and fixes: dbt Semantic Layer"
sidebar_position: 10
tags: [Mar-2024]
date: 2024-04-01
---

The dbt Labs team continues to work on adding new features, fixing bugs, and increasing reliability for the [dbt Semantic Layer](/docs/use-dbt-semantic-layer/dbt-sl) and [MetricFlow](/docs/build/about-metricflow). This release note includes our work in March 2024:


**New features**

- **Privatelink:** The Semantic Layer services now support using Privatelink for customers who have it enabled.
- **SSO support for Semantic Layer development:** You can now develop against and test your Semantic Layer in the Cloud CLI if your developer credential uses SSO.

**Updates**

**Entities are selectable in the Google Sheets app:** You can select entities to Group By, Filter By, and Order By.


**Bug fixes**

- `dbt parse` no longer shows an error when you use a list of filters (instead of just a string filter) on a metric.
- `join_to_timespine` now properly gets applied to conversion metric input measures.
- Fixed an issue where exports in Redshift were not always committing to the DWH, which also had the side-effect of leaving table locks open.
