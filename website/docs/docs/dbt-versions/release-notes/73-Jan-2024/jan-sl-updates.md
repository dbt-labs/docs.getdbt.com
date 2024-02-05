---
title: "dbt Semantic Layer updates and fixes for January 2024"
description: "January 2024: New conversion metrics, enhanced metrics labels, support for shorthand to create metrics and Tableau parameter filters, and bug fixes."
sidebar_label: "Updates and fixes: dbt Semantic Layer"
sidebar_position: 08
tags: [Jan-2024]
date: 2024-01-31
---
The dbt Labs team continues to work on adding new features, fixing bugs, and increasing reliability for the [dbt Semantic Layer](/docs/use-dbt-semantic-layer/dbt-sl).

The following list explains the new features, updates, and fixes for January 2024 in more detail.

## New features

- **Conversion metrics** &mdash; New metric type that allows you to measure conversion events. For example, users who viewed a web page and then filled out a form. For more details, refer to [Conversion metrics](/docs/build/conversion).
- **Simplified dimension resolution** &mdash; Instead of specifying the fully qualified dimension name (for example, `order__user__country`) in the group by or filter expression, you now only need to provide the primary entity and dimensions name, like `user__county`.
- **Saved queries** &mdash; You can now query the [saved queries](/docs/build/saved-queries) you've defined in the dbt Semantic Layer using [Tableau](/docs/use-dbt-semantic-layer/tableau), [GraphQL API](/docs/dbt-cloud-apis/sl-graphql), [JDBC API](docs/dbt-cloud-apis/sl-jdbc), and the [dbt Cloud CLI](/docs/cloud/cloud-cli-installation).

## Updates

- **Display `label` for dbt Semantic Layer metrics** &mdash; The YAML spec parameter `label` is now available for Semantic Layer metrics in [JDBC and GraphQL APIs](/docs/dbt-cloud-apis/sl-api-overview). This means you can conveniently use `label` as a display name for your metrics when exposing them.
- **Use shorthand to create metrics** &mdash; Added support for `create_metric: true` for a measure, which is a shorthand to quickly create metrics. This is useful in cases when metrics are only used to build other metrics.
- **Support for Tableau parameter filters** &mdash; Added support for Tableau parameter filters. You can use the [Tableau connector](docs/use-dbt-semantic-layer/tableau) to create and use parameters with your dbt Semantic Layer data.
- **Additional parameters for GraphQL API** &mdash;  Added support to expose `expr` and `agg` for [Measures](/docs/build/measures) in the [GraphQL API](/docs/dbt-cloud-apis/sl-graphql).
- **Improved error messages** &mdash; You have improved error messages in the command line interface when querying a dimension that is not reachable for a given metric.
- **Entities in Tableau** &mdash; You can now query entities using our Tableau integration (similar to querying dimensions). 
- **New Tableau data source** &mdash; A new data source is available in our Tableau integration called "ALL", which contains all semantic objects defined. This has the same information as "METRICS_AND_DIMENSIONS". In the future, we will deprecate "METRICS_AND_DIMENSIONS" in favor of "ALL" for clarity. 

## Bug fixes

- **BigQuery numeric types** &mdash; Support for numeric types with precision greater than 38 (like `BIGDECIMAL`) in BigQuery is now available. Previously, it was unsupported so would return an error.
- **Large numbers incorrectly displayed in scientific notation** &mdash; In some instances, large numeric dimensions were being interpreted by Tableau in scientific notation, making them hard to use. These should now be displayed as numbers as expected.
- **Google Sheets dimension values** &mdash; We now preserve dimension values accurately instead of being inadvertently converted into strings. 
- **Multiple derived metrics resolution** &mdash; Resolved issues with naming collisions in queries involving multiple derived metrics using the same metric input. Previously, this could cause a naming collision. Input metrics are now deduplicated, ensuring each is referenced only once.
- **Deduplication of input measures** &mdash; Resolved warnings related to using two duplicate input measures in a derived metric. Previously, this would trigger a warning. Input measures are now deduplicated, enhancing query processing and clarity.
- **Correctly reference entities in filters using the object syntax** &mdash; Resolved an error where referencing an entity in a filter using the object syntax would fail. For example, `{{Entity('entity_name')}}` would fail to resolve.
