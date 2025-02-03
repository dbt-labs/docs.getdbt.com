---
title: "IBM watsonx.data Presto configurations"
id: "watsonx-presto-config"
---

## Instance requirements

To use IBM watsonx.data Presto(java) with `dbt-watsonx-presto` adapter, ensure the instance has an attached catalog that supports creating, renaming, altering, and dropping objects such as tables and views. The user connecting to the instance via the `dbt-watsonx-presto` adapter must have the necessary permissions for the target catalog.

For detailed setup instructions, including setting up watsonx.data, adding the Presto(Java) engine, configuring storages, registering data sources, and managing permissions, refer to the official IBM documentation:
- watsonx.data Software Documentation: [IBM watsonx.data Software Guide](https://www.ibm.com/docs/en/watsonx/watsonxdata/2.1.x)
- watsonx.data SaaS Documentation: [IBM watsonx.data SaaS Guide](https://cloud.ibm.com/docs/watsonxdata?topic=watsonxdata-getting-started)



## Session properties

With IBM watsonx.data SaaS/Software instance, you can [set session properties](https://prestodb.io/docs/current/sql/set-session.html) to modify the current configuration for your user session.

To temporarily adjust session properties for a specific dbt model or a group of models, use a [dbt hook](../../reference/resource-configs/pre-hook-post-hook). For example:

```sql
{{
  config(
    pre_hook="set session query_max_run_time='10m'"
  )
}}
```

## Connector properties

IBM watsonx.data SaaS/Software support various connector properties to manage how your data is represented. These properties are particularly useful for file-based connectors like Hive.

For information on what is supported for each data source, refer to the following resources:
- [watsonx.data SaaS Catalog](https://cloud.ibm.com/docs/watsonxdata?topic=watsonxdata-reg_database)
- [watsonx.data Software Catalog](https://www.ibm.com/docs/en/watsonx/watsonxdata/2.1.x?topic=components-adding-data-source)


## File format configuration

File-based connectors, such as Hive and Iceberg, allow customization of table materialization, data formats, and partitioning strategies in dbt models. The following examples demonstrate how to configure these options for each connector.

### Hive Configuration

Hive supports specifying file formats and partitioning strategies using the properties parameter in dbt models. The example below demonstrates how to create a partitioned table stored in Parquet format:

```sql
{{
  config(
    materialized='table',
    properties={
      "format": "'PARQUET'", -- Specifies the file format
      "partitioned_by": "ARRAY['id']", -- Defines the partitioning column(s)
    }
  )
}}
```

For more details about Hive table creation and supported properties, refer to the [Hive connector documentation](https://prestodb.io/docs/current/connector/hive.html#create-a-managed-table).

### Iceberg Configuration

Iceberg supports defining file formats and advanced partitioning strategies to optimize query performance. The following example demonstrates how to create a ORC table partitioned using a bucketing strategy:

```sql
{{
  config(
    materialized='table',
    properties={
      "format": "'ORC'", -- Specifies the file format
      "partitioning": "ARRAY['bucket(id, 2)']", -- Defines the partitioning strategy
    }
  )
}}
```
For more information about Iceberg table creation and supported configurations, refer to the [Iceberg connector documentation](https://prestodb.io/docs/current/connector/iceberg.html#create-table).


## Seeds and prepared statements
The `dbt-watsonx-presto` adapter offers comprehensive support for all [watsonx.data Presto datatypes](https://www.ibm.com/support/pages/node/7157339) in seed files. To leverage this functionality, you must explicitly define the data types for each column.

You can configure column data types either in the dbt_project.yml file or in property files, as supported by dbt. For more details on seed configuration and best practices, refer to the [dbt seed configuration documentation](https://docs.getdbt.com/reference/seed-configs).


## Materializations
The `dbt-watsonx-presto` adapter supports both table and view materializations, allowing you to manage how your data is stored and queried in watsonx.data Presto(java).

For further information on configuring materializations, refer to the [dbt materializations documentation](https://docs.getdbt.com/reference/resource-configs/materialized).

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


## Unsupported features
The following features are not supported by the `dbt-watsonx-presto` adapter
- Incremental Materialization
- Materialized Views
- Snapshots
