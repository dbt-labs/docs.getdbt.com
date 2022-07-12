---
title: "Available adapters"
id: "available-adapters"
---

dbt connects to and runs SQL against your database, warehouse, platform, or query engine. It works by using a dedicated **adapter** for each technology. All the adapters listed below are open source and free to use, just like dbt.

If you have a new adapter, please add it to this list using a pull request! See [Documenting your adapter](/docs/contributing/documenting-a-new-adapter.md)  for more information.

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


| Adapter for                                                                                                   | Documentation                                                                               | Install from PyPi |
|---------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------| ----------------- |
| ClickHouse ([dbt-clickhouse](https://github.com/ClickHouse/dbt-clickhouse))                                   | [Profile Setup](clickhouse-profile), [Configuration](clickhouse-configs)                    | `pip install dbt-clickhouse` |
| Databricks ([dbt-databricks](https://github.com/databricks/dbt-databricks))                                   | [Profile Setup](databricks-profile), [Configuration](spark-configs#databricks-configurations) | `pip install dbt-databricks` |
| Firebolt ([dbt-firebolt](https://github.com/firebolt-db/dbt-firebolt))                                        | [Profile Setup](firebolt-profile), [Configuration](firebolt-configs)                        | `pip install dbt-firebolt` |
| Impala ([dbt-impala](https://github.com/cloudera/dbt-impala))                                                 | [Profile Setup](impala-profile), [Configuration](impala-configs)                            | `pip install dbt-impala` |
| iomete ([dbt-iomete](https://github.com/iomete/dbt-iomete))                                                   | [Profile Setup](iomete-profile)                                                             | `pip install dbt-iomete` |
| Layer Bigquery ([dbt-layer](https://github.com/layerai/dbt-layer))                                            | [Profile Setup](layer-profile)                                                              | `pip install dbt-layer-bigquery` |
| Materialize ([dbt-materialize](https://github.com/MaterializeInc/materialize/blob/main/misc/dbt-materialize)) | [Profile Setup](materialize-profile), [Configuration](materialize-configs)                  | `pip install dbt-materialize` |
| MindsDB ([dbt-mindsdb](https://github.com/mindsdb/dbt-mindsdb))                                               | [Profile Setup](mindsdb-profile), [Configuration](mindsdb-configs)                          | `pip install dbt-mindsdb`     |
| Oracle ([dbt-oracle](https://github.com/oracle/dbt-oracle))                                                   | [Profile Setup](oracle-profile)                                                             | `pip install dbt-oracle`     |
| Rockset ([dbt-rockset](https://github.com/rockset/dbt-rockset))                                               | [Profile Setup](rockset-profile)                                                            | `pip install dbt-rockset` |
| SingleStore ([dbt-singlestore](https://github.com/memsql/dbt-singlestore))                                    | [Profile Setup](singlestore-profile)                                                        | `pip install dbt-singlestore` |
| Starburst & Trino ([dbt-trino](https://github.com/starburstdata/dbt-trino))                                   | [Profile Setup](trino-profile)                                                              | `pip install dbt-trino` |
| Teradata ([dbt-teradata](https://github.com/teradata/dbt-teradata))                                           | [Profile Setup](teradata-profile), [Configuration](teradata-configs)                        | `pip install dbt-teradata` |
| TiDB ([dbt-tidb](https://github.com/pingcap/dbt-tidb))                                                        | [Profile Setup](tidb-profile)                                                               | `pip install dbt-tidb` |

### Community Supported

These adapter plugins are contributed and maintained by members of the community 🌱

| Adapter for            | Documentation                                                                | Notes                     | Install with pip             |
|------------------------|------------------------------------------------------------------------------|---------------------------|------------------------------|
| SQL Server & Azure SQL | [Profile Setup](mssql-profile), [Configuration](mssql-configs)               | SQL Server 2016 and later | `pip install dbt-sqlserver`  |
| Azure Synapse          | [Profile Setup](azuresynapse-profile), [Configuration](azuresynapse-configs) | Azure Synapse 10+         | `pip install dbt-synapse`    |
| Exasol Analytics       | [Profile Setup](exasol-profile)                                              | Exasol 6.x and later      | `pip install dbt-exasol`     |
| Dremio                 | [Profile Setup](dremio-profile)                                              | Dremio 4.7+               | `pip install dbt-dremio`     |
| Athena                 | [Profile Setup](athena-profile)                                              | Athena engine version 2   | `pip install git+https://github.com/Tomme/dbt-athena.git` |
| Vertica                | [Profile Setup](vertica-profile)                                             | Vertica 10.0+             | `pip install dbt-vertica`    |
| AWS Glue               | [Profile Setup](glue-profile), [Configuration](glue-configs)                 | Glue 2.0+                 | `pip install dbt-glue`       |
| Greenplum              | [Profile Setup](greenplum-profile), [Configuration](greenplum-configs)       | Greenplum 6.0+            | `pip install dbt-greenplum`  |
| DuckDB                 | [Profile Setup](duckdb-profile)                                              | DuckDB 0.3.2              | `pip install dbt-duckdb`     |
| SQLite                 | [Profile Setup](sqlite-profile)                                              | SQlite Version 3.0+       | `pip install dbt-sqlite`     |
| MySQL                  | [Profile Setup](mysql-profile)                                               | MySQL 5.7 and 8.0         | `pip install dbt-mysql`      |
| IBM DB2                | [Profile Setup](ibmdb2-profile)                                              | IBM DB2 V9fp2+            | `pip install dbt-ibmdb2`     |

Community-supported plugins are works in progress, and anyone is welcome to contribute by testing and writing code. If you're interested in contributing:
- Join both the dedicated #adapter-ecosystem channel in [dbt Slack](https://community.getdbt.com/) and the channel for your adapter's data store (e.g. #db-sqlserver, #db-athena) 
- Check out the open issues in the plugin's source repository

Note that, while no community plugins are currently supported in dbt Cloud, we expect this to change in the near future.

## Creating a new adapter

dbt can be extended to any SQL-speaking database, warehouse, data lake, query engine, or analytical platform by means of an _adapter plugin_. These plugins can be built as separate Python modules, and dbt will discover them if they are installed on your system. If you see something missing from the lists above, and you're interested in developing an integration, read more about [building a new adapter](building-a-new-adapter).
