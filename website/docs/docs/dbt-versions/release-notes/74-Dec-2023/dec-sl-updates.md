---
title: "dbt Semantic Layer updates for December 2023"
description: "December 2023: Enhanced Tableau integration, BIGINT support, LookML to MetricFlow conversion, and deprecation of legacy features."
sidebar_label: "Update and fixes: dbt Semantic Layer"
sidebar_position: 08
date: 2023-12-22
---
The dbt Labs team continues to work on adding new features, fixing bugs, and increasing reliability for the dbt Semantic Layer. The following list explains the updates and fixes for December 2023 in more detail. 

## dbt Semantic Layer
- You can now access a list of your exports via the list saved-queries command by adding `--show-exports`
- We fixed a bug where our Tableau connector was erroneously returning a timestamp filter instead of a date filter when filtering by dates.
- The dbt Semantic Layer and Tableau Connector now supports relative date filters in Tableau
- The dbt Semantic Layer Google Sheets integration now exposes a note on the cell where the data was requested, which indicates what components were requested.
- The dbt Semantic Layer and Google Sheets integration now exposes a quick “Time Range” option that allows you to quickly select what ranges of dates you want to look at.
- Our GraphQL API now exposes a parameter for `requiresMetricTime` which indicates whether a metric must be grouped by time (certain metrics defined in MetricFlow cannot be looked at without a time dimension).

### MetricFlow

New Features:

- [Exports](https://docs.getdbt.com/docs/use-dbt-semantic-layer/exports#define-exports) allow you to materialize a saved query as a table or view in your data platform. By using exports, you can unify metric definitions in your data platform and query them as you would any other table or view.
- Enable querying metrics with an offset and cumulative metrics with the time dimenson name, instead of `metric_time` https://github.com/dbt-labs/metricflow/issues/1000
- Enable querying metric_time without metrics. https://github.com/dbt-labs/metricflow/issues/928
- Add Support for Consistent SQL Query Generation https://github.com/dbt-labs/metricflow/issues/1020

Bug Fixes:

- Validate that there are metrics or group by items in each query https://github.com/dbt-labs/metricflow/issues/1002
- **For measures using `join_to_timespine`, we now properly apply filters after time spine join**
- **Querying multiple granularities with offset metrics:**
    1. If you query a time offset metric with multiple instances of `metric_time`/`agg_time_dimension`, only one of the instances will be offset. All of them should be.
    2. If you query a time offset metric with one instance of `metric_time`/`agg_time_dimension` but filter by a different one, the query will fail
- **A**lways use candidate join type when evaluating nodes to join instead of the default join type. For example, the default join type for distinct values queries is `FULL OUTER JOIN` but time spine joins require `CROSS JOIN`.
- Fixed a bug where references to entities in the where filter caused an error

Dependencies

- Remove unused numpy dependency https://github.com/dbt-labs/metricflow/issues/984
- Update Jinja2 past 3.1.3 https://github.com/dbt-labs/metricflow/issues/1049
