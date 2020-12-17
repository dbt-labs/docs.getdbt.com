---
title: "Supported databases"
id: "supported-databases"
---

These database adapters are supported by the core dbt maintainers. (✅ indicates "full support.")

| Database | Documentation | Core features | dbt Cloud | Distribution |
| -------- | ------------- | ------- | ------ | ---- |
| Postgres | [Profile Setup](postgres-profile) | ✅ | ✅  | core |
| Redshift | [Profile Setup](redshift-profile), [Configuration](redshift-configs) | ✅ | ✅  | core |
| BigQuery | [Profile Setup](bigquery-profile), [Configuration](bigquery-configs) | ✅  | ✅  | core |
| Snowflake | [Profile Setup](snowflake-profile), [Configuration](snowflake-configs) | ✅ | ✅  | core |
| Spark | [Profile Setup](spark-profile), [Configuration](spark-configs) | nearly full support | preview | plugin |
| Presto | [Profile Setup](presto-profile) | partial support |  | plugin |

###  Community Plugins

These database plugins are contributed and maintained by members of the community 🌱

| Database | Documentation | Notes |
| -------- | ------------- | ----- |
| Microsoft SQL Server ([dbt-mssql](https://github.com/jacobm001/dbt-mssql)) | [Profile Setup](mssql-profile) | SQL Server 2008 R2 and later |
| Microsoft SQL Server ([dbt-sqlserver](https://github.com/mikaelene/dbt-sqlserver)) | [Profile Setup](mssql-profile) | SQL Server 2016 and later 
| Microsoft Azure Synapse DW ([dbt-synapse](https://github.com/swanderz/dbt-synapse)) | [Profile Setup](../reference/warehouse-profiles/azuresynapse-profile.md) | Azure Synapse 10+ 
| Microsoft Azure Synapse DW ([dbt-azuresynapse](https://github.com/embold-health/dbt-azuresynapse)) | [Profile Setup](azuresynapse-profile) | Azure Synapse 10+ 
| Exasol Analytics ([dbt-exasol](https://github.com/tglunde/dbt-exasol)) | [Profile Setup](exasol-profile) | Exasol 6.x and later |
| Oracle Database ([dbt-oracle](https://github.com/techindicium/dbt-oracle)) | [Profile Setup](oracle-profile) | Oracle 11+ |
| Dremio ([dbt-dremio](https://github.com/fabrice-etanchaud/dbt-dremio)) | [Profile Setup](dremio-profile) | Dremio 4.7+ |

Community-supported plugins are works in progress, and all users are encouraged to contribute by testing and writing code. If you're interested in contributing:
- Join the dedicated channel in [dbt Slack](https://community.getdbt.com/) (e.g. #db-sqlserver, #db-athena)
- Check out the open issues in the plugin's source repository

Note that, while no community plugins are currently supported in dbt Cloud, we expect this to change in 2021.

## Creating a new adapter

dbt can be extended to a new database or data platform by means of an "adapter plugin." These plugins can be built into separate Python modules, and dbt will discover them if they are installed on your system. If you're interested in developing a new database plugin for dbt, please check out the docs on [building a new adapter](building-a-new-adapter).
