---
title: "Views"
sidebar_label: "Views"
description: "Create views in dbt-fabric with the view materialization, either per model or globally in your project configuration."
---

You can create views using the `view` materialization:

```sql
{{ config(materialized='view') }}
select * from source_data
```

You can set this globally as well:

```yaml
models:
  my_project:
    +materialized: view
```

> **Limitation:** Nested CTEs (Common Table Expressions) are not supported in model materialization. Models using multiple nested CTEs may fail during compilation or execution.
