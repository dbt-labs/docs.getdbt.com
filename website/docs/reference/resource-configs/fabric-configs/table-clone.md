---
title: "Table clone"
sidebar_label: "Table clone"
description: "Use the table_clone materialization to create a physical copy of an existing table with Fabric's cloning capabilities."
---

The `table_clone` materialization creates a physical copy of an existing table using Fabric’s cloning capabilities. This is useful for versioning, branching, or snapshot-like workflows.

```sql
{{ config(materialized='table_clone', clone_from='staging_table') }}
select * from staging_table
```

**Notes:**
- The source table must exist in the target warehouse.
- Cloning preserves the schema and data state at the time of creation.
- Ideal for scenarios requiring fast, zero-copy duplication for testing or rollback.
