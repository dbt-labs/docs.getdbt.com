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
- The dbt Semantic Layer can support `BIGINT` with over 18 digits. Previously it would return an error.
- We fixed a memory leak that would amount in intermittent errors when querying our JDBC API.

## Improvements
- dbt Labs deprecated [dbt Metrics and the legacy dbt Semantic Layer](/docs/dbt-versions/release-notes/Dec-2023/legacy-sl), both supported on dbt version 1.5 or lower. This change came into effect on December 15th, 2023.
- The [dbt converter tool](https://github.com/dbt-labs/dbt-converter) can now help automate some of the work in converting from LookML (Looker's modeling language) for those who are migrating. Previously this wasn’t available. 

## New features
- Test
