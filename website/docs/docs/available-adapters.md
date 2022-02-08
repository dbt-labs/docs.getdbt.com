---
title: "Available adapters"
id: "available-adapters"
---

dbt connects to and runs SQL against your database, warehouse, platform, or query engine. It works by using a dedicated **adapter** for each technology. All the adapters listed below are open source and free to use, just like dbt.

Any adapter can be installed from PyPi using `pip`. The installation will include `dbt-core` and any other required dependencies, which may include other adapter plugins. Read more about [installing dbt](dbt-cli/install/overview).

### dbt Labs Supported

In addition to maintaining `dbt-core`, [dbt Labs](https://github.com/dbt-labs) maintains a set of adapters for some of the most common databases, warehouses, and platforms. (✅ indicates "full support.")

| Adapter for  | Documentation | Core features | dbt Cloud | Install from PyPi |
| ------------ | ------------- | ------------- | --------- | ----------------- |
| Postgres     | [Profile Setup](postgres-profile) | ✅ | ✅  | `pip install dbt-postgres` |
| Redshift     | [Profile Setup](redshift-profile), [Configuration](redshift-configs) | ✅ | ✅  | `pip install dbt-redshift` |
| BigQuery     | [Profile Setup](bigquery-profile), [Configuration](bigquery-configs) | ✅  | ✅  | `pip install dbt-bigquery` |
| Snowflake    | [Profile Setup](snowflake-profile), [Configuration](snowflake-configs) | ✅ | ✅  | `pip install dbt-snowflake` |
| Apache Spark | [Profile Setup](spark-profile), [Configuration](spark-configs) | ✅ | ✅ | `pip install dbt-spark[PyHive]` |
| Databricks   | [Profile Setup](databricks-profile), [Configuration](spark-configs#databricks-configurations) | ✅ | ✅ | `pip install dbt-databricks` |
| Presto       | [Profile Setup](presto-profile) | partial support |  | `pip install dbt-presto` |

### Vendor Supported

These adapter plugins are built and maintained by the same people who build and maintain the complementary data technology.

| Adapter for  | Documentation | Install from PyPi |
| ------------ | ------------- | ----------------- |
| Materialize ([dbt-materialize](https://github.com/MaterializeInc/materialize/blob/main/misc/dbt-materialize))  | [Profile Setup](materialize-profile) | `pip install dbt-materialize` |
| Rockset ([dbt-rockset](https://github.com/rockset/dbt-rockset))  | [Profile Setup](rockset-profile) | `pip install dbt-rockset` |
| Starburst & Trino ([dbt-trino](https://github.com/starburstdata/dbt-trino)) | [Profile Setup](trino-profile)  | `pip install dbt-trino` |
| Firebolt ([dbt-firebolt](https://github.com/firebolt-db/dbt-firebolt)) | [Profile Setup](firebolt-profile), [Configuration](firebolt-configs) | `pip install dbt-firebolt` |
| Teradata ([dbt-teradata](https://github.com/teradata/dbt-teradata)) | [Profile Setup](teradata-profile), [Configuration](teradata-configs) | `pip install dbt-teradata` |
| SingleStore ([dbt-singlestore](https://github.com/memsql/dbt-singlestore)) | [Profile Setup](singlestore-profile) | `pip install dbt-singlestore` |


### Community Supported

These adapter plugins are contributed and maintained by members of the community 🌱

| Adapter for            | Documentation                         | Notes                     | Install from PyPI            |
|------------------------|---------------------------------------|---------------------------|------------------------------|
| SQL Server & Azure SQL | [Profile Setup](mssql-profile)        | SQL Server 2016 and later | `pip install dbt-sqlserver`  |
| Azure Synapse          | [Profile Setup](azuresynapse-profile) | Azure Synapse 10+         | `pip install dbt-synapse`    |
| Exasol Analytics       | [Profile Setup](exasol-profile)       | Exasol 6.x and later      | `pip install dbt-exasol`     |
| Oracle Database        | [Profile Setup](oracle-profile)       | Oracle 11+                | `pip install dbt-oracle`     |
| Dremio                 | [Profile Setup](dremio-profile)       | Dremio 4.7+               | `pip install dbt-dremio`     |
| ClickHouse             | [Profile Setup](clickhouse-profile)   | ClickHouse 20.11+         | `pip install dbt-clickhouse` |
| Athena                 | [Profile Setup](athena-profile)       | Athena engine version 2   | `pip install git+https://github.com/Tomme/dbt-athena.git` |

Community-supported plugins are works in progress, and all users are encouraged to contribute by testing and writing code. If you're interested in contributing:
- Join the dedicated channel in [dbt Slack](https://community.getdbt.com/) (e.g. #db-sqlserver, #db-athena)
- Check out the open issues in the plugin's source repository

Note that, while no community plugins are currently supported in dbt Cloud, we expect this to change in the near future.

## Creating a new adapter

dbt can be extended to any SQL-speaking database, warehouse, data lake, query engine, or analytical platform by means of an _adapter plugin_. These plugins can be built as separate Python modules, and dbt will discover them if they are installed on your system. If you see something missing from the lists above, and you're interested in developing an integration, read more about [building a new adapter](building-a-new-adapter).
