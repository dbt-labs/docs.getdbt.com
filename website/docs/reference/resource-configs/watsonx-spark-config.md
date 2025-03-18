---
title: "IBM watsonx.data Spark configurations"
id: "watsonx-spark-config"
---

## Instance requirements

To use IBM watsonx.data Spark with `dbt-watsonx-spark` adapter, ensure the instance has an attached catalog that supports creating, renaming, altering, and dropping objects such as tables and views. The user connecting to the instance via the `dbt-watsonx-spark` adapter must have the necessary permissions for the target catalog.

For detailed setup instructions, including setting up watsonx.data, adding the Spark engine, configuring storages, registering data sources, and managing permissions, refer to the official IBM documentation:
- watsonx.data Software Documentation: [IBM watsonx.data Software Guide](https://www.ibm.com/docs/en/watsonx/watsonxdata/2.1.x)
- watsonx.data SaaS Documentation: [IBM watsonx.data SaaS Guide](https://cloud.ibm.com/docs/watsonxdata?topic=watsonxdata-getting-started)


## Session properties

With IBM watsonx.data SaaS/Software instance, you can [set session properties](https://sparkdb.io/docs/current/sql/set-session.html) to modify the current configuration for your user session.

To temporarily adjust session properties for a specific dbt model or a group of models, use a [dbt hook](/reference/resource-configs/pre-hook-post-hook). For example:

```sql
{{
  config(
    pre_hook="set session query_max_run_time='10m'"
  )
}}
```

## Connector properties

IBM watsonx.data SaaS/Software supports various Spark-specific connector properties to control data representation, execution performance, and storage format.

For more details on supported configurations for each data source, refer to:

- [watsonx.data SaaS Catalog](https://cloud.ibm.com/docs/watsonxdata?topic=watsonxdata-reg_database)
- [watsonx.data Software Catalog](https://www.ibm.com/docs/en/watsonx/watsonxdata/2.1.x?topic=components-adding-data-source)

### Additional configuration

The `dbt-watsonx-spark` adapter allows additional configurations to be set in the catalog profile:

- `Catalog:` Specifies the catalog to use for the Spark connection. The plugin can automatically detect the file format type `(Iceberg, Hive, or Delta)` based on the catalog type.
- `use_ssl:` Enables SSL encryption for secure connections.

Example configuration:

```yaml
project_name:
  target: "dev"
  outputs:
    dev:
      type: watsonx_spark
      method: http
      schema: [schema name]
      host: [hostname]
      uri: [uri]
      catalog: [catalog name]
      use_ssl: false
      auth:
        instance: [Watsonx.data Instance ID]
        user: [username]
        apikey: [apikey]
```

---

### File format configuration

The supported file formats depend on the catalog type:

- **Iceberg Catalog:** Supports **Iceberg** tables.
- **Hive Catalog:** Supports **Hive** tables.
- **Delta Lake Catalog:** Supports **Delta** tables.
- **Hudi Catalog:** Supports **Hudi** tables.

The plugin **automatically** detects the file format type based on the catalog specified in the configuration.

By specifying file format dbt models. For example:

```sql
{{
  config(
    materialized='table',
    file_format='iceberg' or 'hive' or 'delta' or 'hudi'
  )
}}
```

**For more details**, refer to the [documentation.](https://spark.apache.org/docs/3.5.3/sql-ref-syntax.html#sql-syntax)

## Seeds and prepared statements
You can configure column data types either in the dbt_project.yml file or in property files, as supported by dbt. For more details on seed configuration and best practices, refer to the [dbt seed configuration documentation](/reference/seed-configs).


## Materializations
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

## Unsupported features
Despite its extensive capabilities, the `dbt-watsonx-spark` adapter has some limitations:

- **Incremental Materialization**: Supported but requires additional configuration for partitioning and performance tuning.
- **Materialized Views**: Not natively supported in Spark SQL within Watsonx.data.
- **Snapshots**: Not supported due to Spark’s lack of built-in snapshot functionality.
- **Performance Considerations**:
  - Large datasets may require tuning of Spark configurations such as shuffle partitions and memory allocation.
  - Some transformations may be expensive due to Spark’s in-memory processing model.

By understanding these capabilities and constraints, users can maximize the effectiveness of dbt with Watsonx.data Spark for scalable data transformations and analytics.
