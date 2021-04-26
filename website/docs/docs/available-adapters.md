---
title: "Available adapters"
id: "available-adapters"
---

dbt connects to and runs SQL against your database, warehouse, platform, or query engine. It works by using a dedicated **adapter** for each technology. All the adapters listed below are open source and free to use, just like dbt.

Any adapter can be installed from PyPi using `pip`. The installation will include `dbt-core` and any other required dependencies, which may include other adapter plugins. Read more about [installing dbt](dbt-cli/installation).

### Fishtown Supported

In addition to maintaining `dbt-core`, [Fishtown Analytics](https://github.com/fishtown-analytics) maintains a set of adapters for some of the most common databases, warehouses, and platforms. (✅ indicates "full support.")

| Adapter for  | Documentation | Core features | dbt Cloud | Install from PyPi |
| ------------ | ------------- | ------------- | --------- | ----------------- |
| Postgres     | [Profile Setup](postgres-profile) | ✅ | ✅  | `pip install dbt-postgres` |
| Redshift     | [Profile Setup](redshift-profile), [Configuration](redshift-configs) | ✅ | ✅  | `pip install dbt-redshift` |
| BigQuery     | [Profile Setup](bigquery-profile), [Configuration](bigquery-configs) | ✅  | ✅  | `pip install dbt-bigquery` |
| Snowflake    | [Profile Setup](snowflake-profile), [Configuration](snowflake-configs) | ✅ | ✅  | `pip install dbt-snowflake` |
| Apache Spark | [Profile Setup](spark-profile), [Configuration](spark-configs) | ✅ | ✅ | `pip install dbt-spark[PyHive]` |
| Databricks   | [Profile Setup](spark-profile#odbc), [Configuration](spark-configs#databricks-configurations) | ✅ | ✅ | `pip install dbt-spark[ODBC]` |
| Presto       | [Profile Setup](presto-profile) | partial support |  | `pip install dbt-presto` |

### Vendor Supported

These adapter plugins are built and maintained by the same people who build and maintain the complementary data technology.

| Adapter for  | Documentation | Install from PyPi |
| ------------ | ------------- | ----------------- |
| Materialize ([dbt-materialize](https://github.com/MaterializeInc/materialize/blob/main/misc/dbt-materialize))  | [Profile Setup](materialize-profile) | `pip install dbt-materialize` |

### Community Supported

These adapter plugins are contributed and maintained by members of the community 🌱

| Adapter for | Documentation | Notes | Install from PyPi |
| ----------- | ------------- | ----- | ----------------- |
| Microsoft SQL Server | [Profile Setup](mssql-profile) | SQL Server 2008 R2 and later | `pip install dbt-mssql` |
| Microsoft SQL Server | [Profile Setup](mssql-profile) | SQL Server 2016 and later | `pip install dbt-sqlserver` |
| Microsoft Azure Synapse DW | [Profile Setup](azuresynapse-profile) | Azure Synapse 10+ | `pip install dbt-synapse` |
| Microsoft Azure Synapse DW | [Profile Setup](azuresynapse-profile) | Azure Synapse 10+ | `pip install dbt-azuresynapse` |
| Exasol Analytics | [Profile Setup](exasol-profile) | Exasol 6.x and later | `pip install dbt-exasol` |
| Oracle Database | [Profile Setup](oracle-profile) | Oracle 11+ | `pip install dbt-oracle` |
| Dremio | [Profile Setup](dremio-profile) | Dremio 4.7+ | `pip install dbt-dremio` |
| ClickHouse | [Profile Setup](clickhouse-profile) | ClickHouse 20.11+ | `pip install dbt-clickhouse` |

Community-supported plugins are works in progress, and all users are encouraged to contribute by testing and writing code. If you're interested in contributing:
- Join the dedicated channel in [dbt Slack](https://community.getdbt.com/) (e.g. #db-sqlserver, #db-athena)
- Check out the open issues in the plugin's source repository

Note that, while no community plugins are currently supported in dbt Cloud, we expect this to change in 2021.

## Creating a new adapter

dbt can be extended to any SQL-speaking database, warehouse, data lake, query engine, or analytical platform by means of an _adapter plugin_. These plugins can be built as separate Python modules, and dbt will discover them if they are installed on your system. If you see something missing from the lists above, and you're interested in developing an integration, read more about [building a new adapter](building-a-new-adapter).
