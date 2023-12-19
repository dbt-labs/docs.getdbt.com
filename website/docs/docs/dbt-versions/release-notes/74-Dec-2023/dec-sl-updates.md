---
title: "Updates and fixes: dbt Semantic Layer and MetricFlow updates for December 2023."
description: "December 2023: Enhanced Tableau integration, BIGINT support, LookML to MetricFlow conversion, and deprecation of legacy features."
sidebar_label: "Update ad fixes: dbt Semantic Layer and MetricFlow."
sidebar_position: 08
date: 2023-12-22
---
The dbt Labs team continues to work on adding new features, fixing bugs, and increasing reliability for the dbt Semantic Layer and MetricFlow. Here are the updates and fixes for December 2023.

## Bug fixes
- The dbt Semantic Layer integration with Tableau now supports queries that resolve to a "NOT IN" clause (for example: using "exclude" in the filtering user interface). Previously it wasn’t supported.
- The dbt Semantic Layer can support `BIGINT` with precision greater than 18. Previously it would return an error.
- We fixed a memory leak that would amount in intermittent errors when querying our JDBC API.
- Added support for converting various Redshift and Postgres specific data types. Previously, the driver would throw an error when encountering columns with those types.
- Apply time offset for nested dervied & ratio metrics ([#882](https://github.com/dbt-labs/metricflow/issues/882))
- Fix Incorrect SQL Column Name Rendering for WhereConstraintNode ([#908](https://github.com/dbt-labs/metricflow/issues/908))
- `Unable To Satisfy Query Error` with Cumulative Metrics in Saved Queries ([#917](https://github.com/dbt-labs/metricflow/issues/917))
- Fixes a bug in dimension-only queries where the filter column is removed before the filter has been applied. ([#923](https://github.com/dbt-labs/metricflow/issues/923))
- Bug fix: Keep where constraint column until used for nested derived offset metric queries. ([#930](https://github.com/dbt-labs/metricflow/issues/930))

## Improvements
- dbt Labs deprecated [dbt Metrics and the legacy dbt Semantic Layer](/docs/dbt-versions/release-notes/Dec-2023/legacy-sl), both supported on dbt version 1.5 or lower. This change came into effect on December 15th, 2023.
- The [dbt converter tool](https://github.com/dbt-labs/dbt-converter) can now help automate some of the work in converting from LookML (Looker's modeling language) for those who are migrating. Previously this wasn’t available. 

## New features
- Support for ambiguous group-by-item resolution. Previously, group-by-items were input by the user in a relatively specific form. For example, the group-by-item:
```
guest__listing__created_at__month
```
refers to the created_at time dimension at a month grain that is resolved by joining the measure source to the dimension sources by the guest and listing entities. Now we handle this complexity for the user, and allow you to simply request ``listing__created_at__month``. If there is only one possible resolution, we will resolve it for the user. If there are multiple possible resolutions, we will ask for additional user input.
