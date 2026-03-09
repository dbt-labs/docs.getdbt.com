---
title: How do I populate the owner column in the generated docs?
description: "Modify owner column"
sidebar_label: 'Can I populate owner column in docs?'
id: modify-owner-column
---

You cannot change the `owner` column in your generated documentation.
 
dbt pulls the `owner` field in `dbt-docs` from database metadata ([catalog.json](/reference/artifacts/catalog-json)), meaning the `owner` of that table in the database. With the exception of [exposures](/docs/build/exposures), dbt does not pull this value from an `owner` field set within dbt.
 
Generally, dbt's database user owns the tables created in the database. The service responsible for ingesting or loading the data usually owns the source tables.
 
If you set `meta.owner`, that field appears under **meta** (pulled from dbt), but still not under the top-level `owner` field.

## Example

The following example shows a model with `meta.owner` so it appears under **meta** in the docs. Replace `DATA_TEAM_EMAIL` with your own values.

<File name='models/stg_orders.yml'>
```yaml
models:
  - name: stg_orders
    description: "Staging table for order events."
    config:
      meta:
        owner: "DATA_TEAM_EMAIL"
    columns:
      - name: order_id
        description: "Primary key for orders."
      - name: order_date
        description: "Date when order was placed."
```
</File>