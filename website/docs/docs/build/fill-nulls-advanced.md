---
title: "Fill null values for metrics"
id: fill-nulls-advanced
description: "Learn about advanced topics for dbt Semantic Layer and MetricFlow, such as modeling workflows and more."
sidebar_label: Fill null values for metrics
---

Understanding and implementing strategies to fill null values in metrics is key for accurate analytics. This guide explains `fill_nulls_with` and `join_to_timespine` to ensure data completeness, helping end users make more informed decisions and enhancing your dbt workflows.

### About null values

You can use `fill_nulls_with` to replace null values in metrics with a value like zero (or your chosen integer). This ensures every data row shows a numeric value.

This guide explains how to ensure there are no null values in your metrics:

- Use `fill_nulls_with` for `simple`, `cumulative`, and `conversion` metrics
- Use `join_to_timespine` and `fill_nulls_with` together for derived and ratio metrics to avoid null values appearing.

### Fill null values for simple metrics

For example, if you'd like to handle days with site visits but no leads, you can use `fill_nulls_with` to set the value for leads to zero on days when there are no conversions.

Let's say you have three metrics:

- `website_visits` and `leads`
- and a derived metric called `leads_to_website_visit` that calculates the ratio of leads to site visits.

On the days when there are no conversions, you can set the value for leads to zero by adding the `fill_nulls_with` parameter to the measure input on the leads metric:

<File name='models/metrics/website_vists.yml'>

```yaml
metrics:
  - name: website_visits
    type: simple
    type_params:
      measure:
        name: bookings
  - name: leads
    type: simple
    type_params:
      measure:
        name: bookings
        fill_nulls_with: 0 # This fills null values with zero
  - name: leads_to_website_visit
    type: derived
    type_params:
      expr: leads/website_visits
      metrics:
        - name: leads
        - name: website_visits
```

</File>

The `website_visits` and `leads` metrics have the following data:

| metric_time | website_visits |
| --- | --- |
| 2024-01-01 | 50 |
| 2024-01-02 | 37 |
| 2024-01-03 | 79 |


| metric_time | leads |
| --- | --- |
| 2024-01-01 | 5 |
| 2024-01-03 | 8 |
* Note that there is no data for `2024-01-02` in the `leads` metric.

Although there are no days without visits, there are days without leads. After applying `fill_nulls_with: 0` to the `leads` metric, querying these metrics together shows zero for leads on days with no conversions:

| metric_time | website_visits | leads |
| --- | --- | --- |
| 2024-01-01 | 50 | 5 |
| 2024-01-02 | 37 | 0 |
| 2024-01-03 | 79 | 8 |

### Use join_to_timespine for derived and ratio metrics

To ensure you have a complete set of data for every and daily coverage for metrics calculated from other metrics, you can use `join_to_timespine` to fill null values for `derived` and `ratio` metrics. These metrics are built from other metrics (other calculations), not direct measures (raw data), requiring MetricFlow to have an extra subquery layer to render the metric. The subquery nesting is as follows:

- For `derived` and `ratio` metrics, there are three levels of subquery nesting &mdash; derived or ratio metric → input metrics → input measures.
- For `simple` and `cumulative` metrics, there are only two levels of subquery nesting &mdash; simple or cumulative metric → input measure.

Because `coalesce` isn't applied to the third, subquery layer for `derived` or `ratio` metrics, this means you could still have nulls in the final result set. 

* Note you can use `join_to_timespine` with metrics that take measure inputs as well if you want to include a row for every date, even if there is no data.

### Fill null values for derived and ratio metrics

To fill null values for derived and ratio metrics, you can link them with a time spine to ensure daily data coverage. As mentioned in [the previous section](#use-join_to_timespine-for-derived-and-ratio-metrics), this is because `derived` and `ratio` metrics take *metrics* as inputs instead of *measures*.

For example, the following structure leaves nulls in the final results (`leads_to_website_visit` column) because `COALESCE` isn't applied at the third outer rendering layer for the final metric calculation in `derived` metrics:

| metric_time | bookings | leads | leads_to_website_visit |
| --- | --- | --- | --- |
| 2024-01-01 | 50 | 5 | .1 |
| 2024-01-02 | 37 | 0 | null |
| 2024-01-03 | 79 | 8 | .1 |

To display a zero value for `leads_to_website_visit` for `2024-01-02`, you would join the `leads` metric to a time spine model to ensure a value for each day. This can be done by adding `join_to_timespine` to the `measure` parameter in the `leads` metric configuration:

<File name='models/metrics/leads.yml'>

```yaml
- name: leads
  type: simple
  type_params:
    measure:
      name: bookings
      fill_nulls_with: 0
      join_to_timespine: true
```
</File>

Once you do this, if you query the `leads` metric after the timespine join, there will be a record for each day and any null values will get filled with zero.

| metric_time |  leads | leads_to_website_visit |
| --- | --- | --- |
| 2024-01-01 |  5 | .1 |
| 2024-01-02 | 0 | 0 |
| 2024-01-03 |  8 | .1 |

Now, if you combine the metrics in a `derived` metric, there will be a zero value for `leads_to_website_visit` on `2024-01-02` and the final result set will not have any null values.

## FAQs

<Expandable alt_header="How to handle null values in derived metrics defined on top of multiple tables">

For additional examples and discussion on how to handle null values in derived metrics that use data from multiple tables, check out [MetricFlow issue #1031](https://github.com/dbt-labs/metricflow/issues/1031).

</Expandable>

