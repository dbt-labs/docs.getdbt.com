---
title: Saved queries
id: saved-queries
description: "Saved queries are a way to save commonly used queries in MetricFlow. They can be used to save time and avoid writing the same query over and over again."
sidebar_label: "Saved queries"
tags: [Metrics, Semantic Layer]
---

Saved queries are a way to save commonly used queries in MetricFlow. You can group metrics, dimensions, and filters that are logically related into a saved query. 

Saved queries are different from [Exports](/docs/use-dbt-semantic-layer/exports) &mdash; exports are essentially saved queries scheduled and executed using dbt’s job scheduler. 

The following table outlines the key differences between saved queries and exports in dbt:

| Feature      | Saved queries  | Exports    |
|--------------|----------------|------------|
| **Availability**    | Available in both dbt Core and dbt Cloud   | Available to dbt Cloud users on Team and Enterprise plans | 
| **Purpose**    | To define and manage common Semantic Layer queries     | To schedule and run saved queries as part of [dbt's job scheduler](/docs/deploy/job-scheduler) |
| **Usage**   | For organizing and reusing queries within dbt projects.<br /><br />**Example**: Standardizing a frequently used revenue calculation across multiple reports. | For materializing query results in the data platform.<br /><br /><br />**Example**: Creating a weekly aggregated table for active user metrics, automatically updated and stored in the data platform.  |

For more detailed information on exports, please refer to the [Exports documentation](/docs/cloud/about-cloud/saved-queries-exports).

## Define saved queries

To define a saved query, refer to the following specification:

 Parameter | Description | Type |
| --------- | ----------- | ---- |
| `name` | The name of the metric. | Required |
| `description` | The description of the metric. | Optional |
| `query_params` | The query parameters for the saved query: `metrics`, `group_by`, and `where`. | Required |

The following is an example of a saved query:

* All metrics in a saved query need to use the same dimensions in the `group_by` or `where` clauses.

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

## Related docs

- [Exports](/docs/use-dbt-semantic-layer/exports)
- [Set up the dbt Semantic Layer](docs/use-dbt-semantic-layer/setup-sl)
