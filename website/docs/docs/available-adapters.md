---
title: "Available adapters"
id: "available-adapters"
---

dbt connects to and runs SQL against your database, warehouse, platform, or query engine. It works by using a dedicated **adapter** for each technology. All the adapters listed below are open source and free to use, just like dbt.

### Fishtown Supported

In addition to maintaining `dbt-core`, [Fishtown Analytics](https://github.com/fishtown-analytics) maintains a set of adapters for some of the most common databases, warehouses, and platforms. (✅ indicates "full support.")

| Adapter for  | Documentation | Core features | dbt Cloud | Distribution |
| ------------ | ------------- | ------- | ------ | ---- |
| Postgres     | [Profile Setup](postgres-profile) | ✅ | ✅  | core |
| Redshift     | [Profile Setup](redshift-profile), [Configuration](redshift-configs) | ✅ | ✅  | core |
| BigQuery     | [Profile Setup](bigquery-profile), [Configuration](bigquery-configs) | ✅  | ✅  | core |
| Snowflake    | [Profile Setup](snowflake-profile), [Configuration](snowflake-configs) | ✅ | ✅  | core |
| Apache Spark | [Profile Setup](spark-profile), [Configuration](spark-configs) | nearly full support | preview | plugin |
| Databricks   | [Profile Setup](spark-profile#odbc), [Configuration](spark-configs#databricks-configurations) | nearly full support | preview | plugin |
| Presto       | [Profile Setup](presto-profile) | partial support |  | plugin |

Adapters distributed with "core" are ready to use when you [install dbt](dbt-cli/installation). For "plugin" adapters, check each page for specific installation instructions.

### Vendor Supported

These adapter plugins are built and maintained by the same people who build and maintain the complementary data technology.

| Adapter for  | Documentation |
| ------------ | ------------- |
| Materialize ([dbt-materialize](https://github.com/MaterializeInc/materialize/blob/main/misc/dbt-materialize))  | [Profile Setup](materialize-profile) |

### Community Supported

These adapter plugins are contributed and maintained by members of the community 🌱

| Adapter for | Documentation | Notes |
| ------- | ------------- | ----- |
| Microsoft SQL Server ([dbt-mssql](https://github.com/jacobm001/dbt-mssql)) | [Profile Setup](mssql-profile) | SQL Server 2008 R2 and later |
| Microsoft SQL Server ([dbt-sqlserver](https://github.com/dbt-msft/dbt-sqlserver)) | [Profile Setup](mssql-profile) | SQL Server 2016 and later 
| Microsoft Azure Synapse DW ([dbt-synapse](https://github.com/dbt-msft/dbt-synapse)) | [Profile Setup](../reference/warehouse-profiles/azuresynapse-profile.md) | Azure Synapse 10+ 
| Microsoft Azure Synapse DW ([dbt-azuresynapse](https://github.com/embold-health/dbt-azuresynapse)) | [Profile Setup](azuresynapse-profile) | Azure Synapse 10+ 
| Exasol Analytics ([dbt-exasol](https://github.com/tglunde/dbt-exasol)) | [Profile Setup](exasol-profile) | Exasol 6.x and later |
| Oracle Database ([dbt-oracle](https://github.com/techindicium/dbt-oracle)) | [Profile Setup](oracle-profile) | Oracle 11+ |
| Dremio ([dbt-dremio](https://github.com/fabrice-etanchaud/dbt-dremio)) | [Profile Setup](dremio-profile) | Dremio 4.7+ |
| ClickHouse ([dbt-clickhouse](https://github.com/silentsokolov/dbt-clickhouse)) | [Profile Setup](clickhouse-profile) | ClickHouse 20.11+ |

Community-supported plugins are works in progress, and all users are encouraged to contribute by testing and writing code. If you're interested in contributing:
- Join the dedicated channel in [dbt Slack](https://community.getdbt.com/) (e.g. #db-sqlserver, #db-athena)
- Check out the open issues in the plugin's source repository

Note that, while no community plugins are currently supported in dbt Cloud, we expect this to change in 2021.

## Creating a new adapter

dbt can be extended to any SQL-speaking database, warehouse, data lake, query engine, or analytical platform by means of an _adapter plugin_. These plugins can be built as separate Python modules, and dbt will discover them if they are installed on your system. If you see something missing from the lists above, and you're interested in developing an integration, read more about [building a new adapter](building-a-new-adapter).
