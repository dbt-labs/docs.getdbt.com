---
title: "Overview"
id: "supported-databases"
---

## Supported databases

dbt supports the following databases:

These database plugins are supported by the core dbt maintainers.

| Database | Documentation | Support |
| -------- | ------------- | ------- |
| Postgres | [Profile Setup](profile-postgres) | ✅Full Support |
| Redshift | [Profile Setup](profile-redshift), [Configuration](redshift-configs) | ✅Full Support |
| BigQuery | [Profile Setup](profile-bigquery), [Configuration](bigquery-configs) | ✅Full Support |
| Snowflake | [Profile Setup](profile-snowflake), [Configuration](snowflake-configs) | ✅ Full Support |
| Presto | [Profile Setup](profile-presto) | Partial Support |
| Spark | [Profile Setup](profile-spark), [Configuration](spark-configs) | Partial Support |

##  Community Supported dbt Plugins

These database plugins are community-supported 🌱

| Database | Documentation | Notes |
| -------- | ------------- | ----- |
| Microsoft SQL Server ([dbt-mssql](https://github.com/jacobm001/dbt-mssql)) | [Profile Setup](profile-mssql) | SQL Server 2008 R2 and later |
| Microsoft SQL Server ([dbt-sqlserver](https://github.com/mikaelene/dbt-sqlserver)) | [Profile Setup](profile-mssql) | SQL Server 2016 and later |

## Creating a new adapter

dbt can be extended with "adapter plugins." These plugins can be built into separate Python modules, and dbt will discover them if they are installed on your system. If you're interested in developing a new adapter plugin for dbt, please [open an issue](https://github.com/fishtown-analytics/dbt/issues/new) and be sure to check out the docs on [building a new adapter](building-a-new-adapter).
