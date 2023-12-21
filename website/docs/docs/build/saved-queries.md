---
title: Saved queries
id: saved-queries
description: "Saved queries are a way to save commonly used queries in MetricFlow. They can be used to save time and avoid writing the same query over and over again."
sidebar_label: "Saved queries"
tags: [Metrics, Semantic Layer]
---

Saved queries are a way to save commonly used queries in MetricFlow. You can group metrics, dimensions, and filters that are logically related into a saved query. 

They are distinct from [Exports](/docs/use-dbt-semantic-layer/exports), which are scheduled and executed saved queries using [dbt's job scheduler](/docs/deploy/job-scheduler).

| Feature      | Saved queries  | Exports    |
|--------------|----------------|------------|
| **Availability**   | Available in both dbt Core and dbt Cloud.  | Available to dbt Cloud users on Team and Enterprise plans. | 
| **Purpose**    | To define and manage common Semantic Layer queries.     | Automatically runs saved queries and materializes them within your data platform using dbt's job scheduler. |
| **Usage**   | For organizing and reusing queries within dbt projects. | For materializing query results in the data platform.  |

The following is an example of a saved query:

All metrics in a saved query need to use the same dimensions in the `group_by` or `where` clauses.

```yaml
saved_queries:
  name: p0_booking
  description: Booking-related metrics that are of the highest priority.
  query_params:
    metrics:
      - bookings
      - instant_bookings
    group_by:
      - TimeDimension('metric_time', 'day')
      - Dimension('listing__capacity_latest')
    where:
      - "{{ Dimension('listing__capacity_latest') }} > 3"
```

## Parameters

To define a saved query, refer to the following parameters:

| Parameter | Type    | Required | Description    |
|-------|---------|----------|----------------|
| `name`       | String    | Required     | Name of the saved query object.          |
| `description`     | String      | Required     | A description of the saved query.     |
| `query_params`       | Structure   | Required     | Contains the query parameters. |
| `query_params::metrics`   | List or String   | Optional    | A list of the metrics to be used in the query as specified in the CLI. |
| `query_params::group_bys`    | List or String          | Optional    | A list of the Entities and Dimensions to be used in the query, which include the `Dimension` or `TimeDimension`. |
| `query_params::where`        | LList or String  or String | Optional  | A list of string which may include the `Dimension` or `TimeDimension` objects. |
| `exports`     | List or Structure | Optional    | A list of exports to be specified with the exports structure.     |
| `exports::name`       | String               | Required     | Name of the export object.      |
| `exports::config`     | List or Structure     | Required     | A config section for any parameters specifying the export.  |
| `exports::config::export_as` | String    | Required     | The type of export to run. Options include table or view currently and cache in the near future.   |
| `exports::config`   | String   | Optional    | The schema used for creating the table or view. This option cannot be used for caching.   |
| `exports::config`  | String     | Optional    | The table alias to use to write the table or view.  This option cannot be used for caching.  |


## Related docs

- [Exports](/docs/use-dbt-semantic-layer/exports)
- [Set up the dbt Semantic Layer](/docs/use-dbt-semantic-layer/setup-sl)
