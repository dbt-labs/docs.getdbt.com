---
title: "Cross-warehouse references"
sidebar_label: "Cross-warehouse references"
description: "The dbt-fabric adapter supports cross-warehouse queries with the source and ref macros across Fabric warehouses."
---

The dbt-fabric adapter supports cross-warehouse queries using `source()` or `ref()` macros.

```sql
select * from {{ source('sales_dw', 'transactions') }}
union all
select * from {{ ref('customer_dim') }}
```

Ensure that the corresponding model or source definitions specify the correct `database:` parameter to reference another Fabric Warehouse.

Example `sources.yml`:
```yaml
sources:
  - name: sales_dw
    database: saleswarehouse
    schema: sales
    tables:
      - name: transactions
```
> To use cross-warehouse references or warehouse snapshots, ensure the identity configured here has access to all referenced Fabric Warehouses.
