---
title: "dbt Semantic Layer updates for December 2023"
description: "December 2023: Enhanced Tableau integration, BIGINT support, LookML to MetricFlow conversion, and deprecation of legacy features."
sidebar_label: "Update and fixes: dbt Semantic Layer"
sidebar_position: 08
date: 2023-12-22
---
The dbt Labs team continues to work on adding new features, fixing bugs, and increasing reliability for the dbt Semantic Layer and MetricFlow.

Refer to the following updates and fixes for December 2023:

## Bug fixes

The following are updates for the dbt Semantic Layer and MetricFlow:

**dbt Semantic Layer**

- Tableau integration &mdash; The dbt Semantic Layer integration with Tableau now supports queries that resolve to a "NOT IN" clause. This applies to using "exclude" in the filtering user interface. Previously it wasn’t supported.
- `BIGINT` support &mdash; The dbt Semantic Layer can now support `BIGINT` values with precision greater than 18. Previously it would return an error.
- Memory leak &mdash; Fixed a memory leak in the JDBC API that would previously lead to intermittent errors when querying it.
- Data conversion support &mdash; Added support for converting various Redshift and Postgres-specific data types. Previously, the driver would throw an error when encountering columns with those types.


## Improvements

- Deprecation &mdash; We deprecated [dbt Metrics and the legacy dbt Semantic Layer](/docs/dbt-versions/release-notes/Dec-2023/legacy-sl), both supported on dbt version 1.5 or lower. This change came into effect on December 15th, 2023.
- Improved dbt converter tool &mdash; The [dbt converter tool](https://github.com/dbt-labs/dbt-converter) can now help automate some of the work in converting from LookML (Looker's modeling language) for those who are migrating. Previously this wasn’t available. 

