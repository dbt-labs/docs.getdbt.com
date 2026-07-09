---
title: "Connector properties"
sidebar_label: "Connector properties"
description: "Configure Spark-specific connector properties and file formats for the dbt-watsonx-spark adapter."
---

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
