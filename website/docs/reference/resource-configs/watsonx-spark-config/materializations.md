---
title: "Materializations"
sidebar_label: "Materializations"
description: "Learn how the dbt-watsonx-spark adapter supports table, view, and incremental materializations in IBM watsonx.data Spark."
---

The `dbt-watsonx-spark` adapter supports table materializations, allowing you to manage how your data is stored and queried in watsonx.data Spark.

For further information on configuring materializations, refer to the [dbt materializations documentation](/reference/resource-configs/materialized).

### Table

The `dbt-watsonx-spark` adapter enables you to create and update tables through table materialization, making it easier to work with data in watsonx.data Spark.

### View

The adapter automatically creates views by default if no materialization is explicitly specified.

### Incremental

Incremental materialization is supported but requires additional configuration for partitioning and performance tuning.

#### Recommendations
- **Check Permissions:** Ensure that the necessary permissions for table creation are enabled in the catalog or schema.
- **Check Connector Documentation:** Review watsonx.data Spark [data ingestion in watsonx.data](https://www.ibm.com/docs/en/watsonx/watsonxdata/2.1.x?topic=data-overview-ingestion) to ensure it supports table 
creation and modification.
