---
title: Saved queries
id: saved-queries
description: "Saved queries are a way to save commonly used queries in MetricFlow. They can be used to save time and avoid writing the same query over and over again."
sidebar_label: "Saved queries"
tags: [Metrics, Semantic Layer]
---

:::info Saved queries coming soon
Saved queries isn't currently available in MetricFlow but support is coming soon.
 :::

Saved queries are a way to save commonly used queries in MetricFlow. You can group metrics, dimensions, and filters that are logically related into a saved query. 

To define a saved query, refer to the following specification:

 Parameter | Description | Type |
| --------- | ----------- | ---- |
| `name` | The name of the metric. | Required |
| `description` | The description of the metric. | Optional |
| `metrics` | The metrics included in the saved query. | Required |
| `group_bys` | The value displayed in downstream tools. | Required |
| `where` | Filter applied to the query. | Optional |

The following is an example of a saved query:

```yaml
saved_query:
  name: p0_booking
  description: Booking-related metrics that are of the highest priority.
  metrics:
    - bookings
    - instant_bookings
  group_bys:
    - TimeDimension('metric_time', 'day')
    - Dimension('listing__capacity_latest')
  where:
    - "{{ Dimension('listing__capacity_latest') }} > 3"
```

### FAQs 

* All metrics in a saved query need to use the same dimensions in the `group_by` or `where` clauses.
