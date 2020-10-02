---
title: "Supported databases"
id: "supported-databases"
---

dbt supports the following databases:

These database plugins are supported by the core dbt maintainers.

| Database | Documentation | Support |
| -------- | ------------- | ------- |
| Postgres | [Profile Setup](postgres-profile) | ✅Full Support |
| Redshift | [Profile Setup](redshift-profile), [Configuration](redshift-configs) | ✅Full Support |
| BigQuery | [Profile Setup](bigquery-profile), [Configuration](bigquery-configs) | ✅Full Support |
| Snowflake | [Profile Setup](snowflake-profile), [Configuration](snowflake-configs) | ✅ Full Support |
| Presto | [Profile Setup](presto-profile) | Partial Support |
| Spark | [Profile Setup](spark-profile), [Configuration](spark-configs) | Partial Support |

##  Community Supported dbt Plugins

These database plugins are community-supported 🌱

| Database | Documentation | Notes |
| -------- | ------------- | ----- |
| Microsoft SQL Server ([dbt-mssql](https://github.com/jacobm001/dbt-mssql)) | [Profile Setup](mssql-profile) | SQL Server 2008 R2 and later |
| Microsoft SQL Server ([dbt-sqlserver](https://github.com/mikaelene/dbt-sqlserver)) | [Profile Setup](mssql-profile) | SQL Server 2016 and later 
| Microsoft Azure Synapse DW ([dbt-azuresynapse](https://github.com/embold-health/dbt-azuresynapse)) | [Profile Setup](azuresynapse-profile) | Azure Synapse 10+ 
| Exasol Analytics ([dbt-exasol](https://github.com/tglunde/dbt-exasol)) | [Profile Setup](exasol-profile) | Exasol 6.x and later |
| Oracle Database ([dbt-oracle](https://github.com/techindicium/dbt-oracle)) | [Profile Setup](oracle-profile) |Oracle 11+ |
| Dremio ([dbt-dremio](https://github.com/fabrice-etanchaud/dbt-dremio)) | [Profile Setup](dremio-profile) |Dremio 4.7+ |

## Creating a new adapter

dbt can be extended with "adapter plugins." These plugins can be built into separate Python modules, and dbt will discover them if they are installed on your system. If you're interested in developing a new adapter plugin for dbt, please [open an issue](https://github.com/fishtown-analytics/dbt/issues/new) and be sure to check out the docs on [building a new adapter](building-a-new-adapter).
