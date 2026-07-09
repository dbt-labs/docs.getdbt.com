---
title: "Materializations"
sidebar_label: "Materializations"
description: "Learn how the dbt-watsonx-presto adapter supports table and view materializations in IBM watsonx.data Presto."
---

The `dbt-watsonx-presto` adapter supports both table and view materializations, allowing you to manage how your data is stored and queried in watsonx.data Presto(java).

For further information on configuring materializations, refer to the [dbt materializations documentation](/reference/resource-configs/materialized).

### Table

The `dbt-watsonx-presto` adapter enables you to create and update tables through table materialization, making it easier to work with data in watsonx.data Presto.

#### Recommendations
- **Check Permissions:** Ensure that the necessary permissions for table creation are enabled in the catalog or schema.
- **Check Connector Documentation:** Review watsonx.data Presto [sql statement support](https://www.ibm.com/support/pages/node/7157339) to ensure it supports table creation and modification.

#### Limitations with some connectors
Certain watsonx.data Presto connectors, particularly read-only ones or those with restricted permissions, do not allow creating or modifying tables. If you attempt to use table materialization with these connectors, you may encounter an error like:

```sh
PrestoUserError(type=USER_ERROR, name=NOT_SUPPORTED, message="This connector does not support creating tables with data", query_id=20241206_071536_00026_am48r)
```

### View

The `dbt-watsonx-presto` adapter automatically creates views by default, as views are the standard materialization in dbt. If no materialization is explicitly specified, dbt will create a view in watsonx.data Presto.

To confirm whether your connector supports view creation, refer to the watsonx.data [sql statement support](https://www.ibm.com/support/pages/node/7157339).
