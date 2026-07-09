---
title: "Unsupported features"
sidebar_label: "Unsupported features"
description: "Review the limitations of the dbt-watsonx-spark adapter, including materialized views, snapshots, and performance."
---

Despite its extensive capabilities, the `dbt-watsonx-spark` adapter has some limitations:

- **Incremental Materialization**: Supported but requires additional configuration for partitioning and performance tuning.
- **Materialized Views**: Not natively supported in Spark SQL within Watsonx.data.
- **Snapshots**: Not supported due to Spark’s lack of built-in snapshot functionality.
- **Performance Considerations**:
  - Large datasets may require tuning of Spark configurations such as shuffle partitions and memory allocation.
  - Some transformations may be expensive due to Spark’s in-memory processing model.

By understanding these capabilities and constraints, users can maximize the effectiveness of dbt with Watsonx.data Spark for scalable data transformations and analytics.
