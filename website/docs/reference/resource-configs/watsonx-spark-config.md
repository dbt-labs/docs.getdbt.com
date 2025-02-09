---
title: "IBM watsonx.data Spark Configurations"
id: "watsonx-spark-config"
---

### **Instance Requirements**

To use IBM watsonx.data Spark with the `dbt-watsonx-spark` adapter, ensure the instance has an attached catalog that supports Spark SQL operations, including creating, renaming, altering, and dropping tables and views. The user connecting via the `dbt-watsonx-spark` adapter must have the necessary permissions for the target catalog and schema.

For detailed setup instructions, including configuring Watsonx.data, adding the Spark engine, setting up storage, registering data sources, and managing permissions, refer to the official IBM documentation:

- [Documentation for IBM Cloud and SaaS offerings](https://cloud.ibm.com/docs/watsonxdata?topic=watsonxdata-dbt_watsonx_spark_inst)
- [Documentation for IBM watsonx.data software](https://www.ibm.com/docs/en/watsonx/watsonxdata/2.1.x?topic=integration-data-build-tool-adapter-spark)

---

### **Session Properties**

With an IBM watsonx.data SaaS/Software instance, you can set session properties to modify the current configuration for your user session.

To temporarily adjust session properties for a specific dbt model or a group of models, use a dbt hook. For example:

```sql
{{
  config(
    pre_hook="SET spark.sql.shuffle.partitions = 200"
  )
}}
```

---

### **Catalogs Properties**

IBM watsonx.data SaaS/Software supports various Spark-specific connector properties to control data representation, execution performance, and storage format.

For more details on supported configurations for each data source, refer to:

- [watsonx.data SaaS Catalog](https://cloud.ibm.com/docs/watsonxdata?topic=watsonxdata-reg_database)
- [watsonx.data Software Catalog](https://www.ibm.com/docs/en/watsonx/watsonxdata/2.1.x?topic=components-adding-data-source)

#### **Extra Configuration**

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

### **File Format Configuration**

The supported file formats depend on the catalog type:

- **Iceberg Catalog:** Supports **Iceberg** tables.
- **Hive Catalog:** Supports **Hive** tables.
- **Delta Lake Catalog:** Supports **Delta** tables.
- **Hudi Catalog:** Supports **Hudi** tables.

The plugin **automatically** detects the file format type based on the catalog specified in the configuration.



By specifying file format dbt models. Example:

```sql
{{
  config(
    materialized='table',
    file_format='iceberg' or 'hive' or 'delta' or 'hudi'
  )
}}
```

**For more details**, refer to the [documentation.](https://spark.apache.org/docs/3.5.3/sql-ref-syntax.html#sql-syntax)



## **Materializations**

The `dbt-watsonx-spark` adapter supports multiple materialization strategies, allowing for efficient storage and querying of data.

### **Table**

The adapter enables creating and updating tables using table materialization. Recommendations:

- Ensure the necessary permissions are granted for table creation.
- Review [`Spark SQL`](https://spark.apache.org/docs/3.5.3/sql-ref-syntax.html) statement support to confirm compatibility with table creation and modification.

### **View**

The adapter automatically creates views by default if no materialization is explicitly specified.

### **Incremental**

Incremental materialization is supported but requires additional configuration for partitioning and performance tuning.

To verify view creation support for a specific connector, refer to the [`Spark SQL` statement support documentation.](https://spark.apache.org/docs/3.5.3/sql-ref-syntax.html)

---

### **Limitations and Considerations**

Despite its extensive capabilities, the `dbt-watsonx-spark` adapter has some limitations:

- **Incremental Materialization**: Supported but requires additional configuration for partitioning and performance tuning.
- **Materialized Views**: Not natively supported in Spark SQL within Watsonx.data.
- **Snapshots**: Not supported due to Spark’s lack of built-in snapshot functionality.
- **Performance Considerations**:
  - Large datasets may require tuning of Spark configurations such as shuffle partitions and memory allocation.
  - Some transformations may be expensive due to Spark’s in-memory processing model.

By understanding these capabilities and constraints, users can maximize the effectiveness of dbt with Watsonx.data Spark for scalable data transformations and analytics.



