---
title: "Available adapters"
id: "available-adapters"
---

dbt connects to and runs SQL against your database, warehouse, platform, or query engine. It works by using a dedicated **adapter** for each technology. All the adapters listed below are open source and free to use, just like dbt.

### Installation

Most adapters can be installed from PyPi using `pip`. The installation will include `dbt-core` and any other required dependencies, which may include other adapter plugins. Read more about [installing dbt](dbt-cli/install/overview).

Some vendor or community adapters may not exist in PyPi. However, you can still install an adapter hosted on GitHub with `pip install`, by replacing MAINTAINER_NAME with the person or company maintaining the adapter on GitHub and ADAPTER_NAME with the git repository's name (these can be taken directly from the adapter's url):

```shell
pip install git+https://github.com/MAINTAINER_NAME/ADAPTER_NAME.git
```

### dbt Labs Supported

In addition to maintaining `dbt-core`, [dbt Labs](https://github.com/dbt-labs) maintains a set of adapters for some of the most common databases, warehouses, and platforms. (✅ indicates "full support.")

| Adapter for  | Documentation | Core features | dbt Cloud | Install from PyPi |
| ------------ | ------------- | ------------- | --------- | ----------------- |
| Postgres     | [Profile Setup](postgres-profile) | ✅ | ✅  | `pip install dbt-postgres` |
| Redshift     | [Profile Setup](redshift-profile), [Configuration](redshift-configs) | ✅ | ✅  | `pip install dbt-redshift` |
| BigQuery     | [Profile Setup](bigquery-profile), [Configuration](bigquery-configs) | ✅  | ✅  | `pip install dbt-bigquery` |
| Snowflake    | [Profile Setup](snowflake-profile), [Configuration](snowflake-configs) | ✅ | ✅  | `pip install dbt-snowflake` |
| Apache Spark | [Profile Setup](spark-profile), [Configuration](spark-configs) | ✅ | ✅ | `pip install dbt-spark[PyHive]` |

### Vendor Supported

These adapter plugins are built and maintained by the same people who build and maintain the complementary data technology.

| Adapter for  | Documentation | Install from PyPi |
| ------------ | ------------- | ----------------- |
| Databricks ([dbt-databricks](https://github.com/databricks/dbt-databricks)) | [Profile Setup](databricks-profile), [Configuration](spark-configs#databricks-configurations) | `pip install dbt-databricks` |
| Firebolt ([dbt-firebolt](https://github.com/firebolt-db/dbt-firebolt)) | [Profile Setup](firebolt-profile), [Configuration](firebolt-configs) | `pip install dbt-firebolt` |
| Materialize ([dbt-materialize](https://github.com/MaterializeInc/materialize/blob/main/misc/dbt-materialize))  | [Profile Setup](materialize-profile), [Configuration](materialize-configs) | `pip install dbt-materialize` |
| Oracle ([dbt-oracle](https://github.com/oracle/dbt-oracle))        | [Profile Setup](oracle-profile)       | `pip install dbt-oracle`     |
| Rockset ([dbt-rockset](https://github.com/rockset/dbt-rockset))  | [Profile Setup](rockset-profile) | `pip install dbt-rockset` |
| SingleStore ([dbt-singlestore](https://github.com/memsql/dbt-singlestore)) | [Profile Setup](singlestore-profile) | `pip install dbt-singlestore` |
| Starburst & Trino ([dbt-trino](https://github.com/starburstdata/dbt-trino)) | [Profile Setup](trino-profile)  | `pip install dbt-trino` |
| Teradata ([dbt-teradata](https://github.com/teradata/dbt-teradata)) | [Profile Setup](teradata-profile), [Configuration](teradata-configs) | `pip install dbt-teradata` |
| TiDB ([dbt-tidb](https://github.com/pingcap/dbt-tidb)) | [Profile Setup](tidb-profile) | `pip install dbt-tidb` |


### Community Supported

These adapter plugins are contributed and maintained by members of the community 🌱

| Adapter for            | Documentation                         | Notes                     | Install with pip             |
|------------------------|---------------------------------------|---------------------------|------------------------------|
| SQL Server & Azure SQL | [Profile Setup](mssql-profile)        | SQL Server 2016 and later | `pip install dbt-sqlserver`  |
| Azure Synapse          | [Profile Setup](azuresynapse-profile) | Azure Synapse 10+         | `pip install dbt-synapse`    |
| Exasol Analytics       | [Profile Setup](exasol-profile)       | Exasol 6.x and later      | `pip install dbt-exasol`     |
| Dremio                 | [Profile Setup](dremio-profile)       | Dremio 4.7+               | `pip install dbt-dremio`     |
| ClickHouse             | [Profile Setup](clickhouse-profile)   | ClickHouse 20.11+         | `pip install dbt-clickhouse` |
| Athena                 | [Profile Setup](athena-profile)       | Athena engine version 2   | `pip install git+https://github.com/Tomme/dbt-athena.git` |
| Vertica                | [Profile Setup](vertica-profile)      | Vertica 10.0+             | `pip install dbt-vertica`    |

Community-supported plugins are works in progress, and anyone is welcome to contribute by testing and writing code. If you're interested in contributing:
- Join both the dedicated #adapter-ecosystem channel in [dbt Slack](https://community.getdbt.com/) and the channel for your adapter's data store (e.g. #db-sqlserver, #db-athena) 
- Check out the open issues in the plugin's source repository

Note that, while no community plugins are currently supported in dbt Cloud, we expect this to change in the near future.

## Creating a new adapter

dbt can be extended to any SQL-speaking database, warehouse, data lake, query engine, or analytical platform by means of an _adapter plugin_. These plugins can be built as separate Python modules, and dbt will discover them if they are installed on your system. If you see something missing from the lists above, and you're interested in developing an integration, read more about [building a new adapter](building-a-new-adapter).
