---
title: "dbt Semantic Layer updates and fixes for April 2024"
description: "Apr 2024: Enhanced Google Sheets integration include new features for metric labels, saved selections, and time filters. Tableau integration improvements include data source updates."
sidebar_label: "Updates and fixes: dbt Semantic Layer"
sidebar_position: 06
tags: [Apr-2024]
date: 2024-04-30
---

The dbt Labs team continues to work on adding new features, fixing bugs, and increasing reliability for the [dbt Semantic Layer](/docs/use-dbt-semantic-layer/dbt-sl) and [MetricFlow](/docs/build/about-metricflow). This release note includes fixes, updates, and deprecations for in April 2024.


### New features

**Google Sheets**
- **Saved selections** &mdash; You can [save your query selections](/docs/use-dbt-semantic-layer/gsheets#using-saved-selections) within the [Google Sheets application](/docs/use-dbt-semantic-layer/gsheets). They can be made private or public and refresh upon loading.
- **Display metric label** &mdash; Metrics are now displayed by their labels as `metric_name`.

### Updates

- **Metadata in metrics** &mdash; [Metrics](/docs/build/metrics-overview) now supports the [`meta` option](/reference/resource-configs/meta) under the [config](/reference/resource-properties/config) property. Previously, we only supported the now deprecated `meta` tag.

**Google Sheets**

- **Explore saved queries** &mdash; Added [support](/docs/use-dbt-semantic-layer/gsheets#using-saved-queries) to allow jumping off from or exploring MetricFlow-defined saved queries directly.
- **Query dimensions** &mdash; Added support to query dimensions without metrics. Previously, you needed a dimension.
- Time filters &mdash; Added support for time presets and complex time range filters such as "between", "after", and "before".
- **Dimension value population** &mdash; Added supported to automatically populate dimension values when you select a "where" filter, removing the need to manually type them.  Previously, you needed to manually type the dimension values.
- **Entity querying** &mdash; Added support to directly query entities, expanding the flexibility of data requests.
- **Exclude column headers** &mdash; Added an option to exclude column headers, which is useful for populating templates with only the required data.

### Deprecation

**Tableau**

- **`METRICS_AND_DIMENSIONS`** &mdash; The [`METRICS_AND_DIMENSIONS` data source](/docs/use-dbt-semantic-layer/tableau#using-the-integration) has been [deprecated](/docs/use-dbt-semantic-layer/tableau#using-the-integration) for all accounts not actively using it. We encourage users to transition to the "ALL" data source for future integrations.

