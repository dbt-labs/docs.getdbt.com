---
title: "Metric views"
sidebar_label: "Metric views"
description: "Manage a Unity Catalog metric view with dbt using the metric_view materialization and a YAML definition."
---

<VersionBlock firstVersion="1.12">

Set `materialized='metric_view'` to manage a [Unity Catalog metric view](https://docs.databricks.com/aws/en/metric-views/) with dbt. Instead of SQL, the body of the model is the metric view's YAML definition: a `version`, a `source`, `dimensions`, `measures`, and an optional `filter`. dbt creates the metric view with `CREATE OR REPLACE VIEW ... WITH METRICS LANGUAGE YAML`.

<File name='order_metrics.sql'>

```sql
{{ config(materialized='metric_view') }}

version: 1.1
source: "{{ ref('source_orders') }}"
filter: status = 'completed'
dimensions:
  - name: order_date
    expr: order_date
  - name: status
    expr: status
    synonyms: [state, order_state]
measures:
  - name: total_orders
    expr: count(1)
  - name: total_revenue
    expr: sum(revenue)
    synonyms: [revenue, sales]
```

</File>

Reference the source relation in `source` with `ref()` so dbt resolves dependencies. Query the resulting metric view with the `MEASURE()` function.

dbt passes the YAML body through to Databricks unchanged, so a metric view supports the **entire** [Unity Catalog metric view YAML specification](https://docs.databricks.com/aws/en/business-semantics/metric-views/yaml-reference), not only the keys shown above. Any field Databricks accepts server-side works through dbt, including [`synonyms`](https://docs.databricks.com/aws/en/metric-views/semantic-metadata) and `display_name` on dimensions and measures, and `format` and `window` on measures.

You can also set `databricks_tags` and [`grants`](/reference/resource-configs/grants) on a metric view. `tblproperties` are applied only when the view is updated in place (with `view_update_via_alter`) or replaced, not on first creation.

### Updating a metric view

By default, dbt rebuilds the metric view with `CREATE OR REPLACE VIEW` on every run.

When you set [`view_update_via_alter`](/reference/global-configs/databricks-changes#changes-to-the-view-materialization) to `true`, dbt applies incremental changes in place instead of replacing the view:

- Changes to the YAML definition are applied with `ALTER VIEW ... AS`.
- Changes to `databricks_tags` or `tblproperties` are applied with `ALTER VIEW ... SET`.

If neither the definition nor the tags or properties have changed, dbt skips the update.

</VersionBlock>
