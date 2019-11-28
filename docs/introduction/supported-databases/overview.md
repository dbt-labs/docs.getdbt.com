---
title: Overview
---
dbt supports the following databases:

These database plugins are supported by the core dbt maintainers.
[block:parameters]
{
  "data": {
    "h-0": "Database",
    "h-1": "Documentation",
    "h-2": "Support",
    "0-0": "Postgres",
    "0-1": "[Profile Setup](doc:profile-postgres)",
    "0-2": "✅Full Support",
    "1-0": "Redshift",
    "1-1": "[Profile Setup](doc:profile-redshift), [Configuration](doc:redshift-configs)",
    "1-2": "✅Full Support",
    "2-0": "BigQuery",
    "2-1": "[Profile Setup](doc:profile-bigquery), [Configuration](bigquery-configs)",
    "2-2": "✅Full Support",
    "3-0": "Snowflake",
    "3-1": "[Profile Setup](doc:profile-snowflake), [Configuration](snowflake-configs)",
    "3-2": "✅ Full Support",
    "4-0": "Presto",
    "4-1": "[Profile Setup](doc:profile-presto)",
    "4-2": "[Partially Supported](doc:profile-presto#section-caveats)",
    "h-3": "Repo",
    "5-0": "Spark",
    "5-1": "[Profile Setup](doc:profile-spark)",
    "5-2": "[Partially Supported](doc:profile-spark#section-caveats)"
  },
  "cols": 3,
  "rows": 6
}
[/block]
#  Community Supported dbt Plugins

These database plugins are community-supported 🌱
[block:parameters]
{
  "data": {
    "0-0": "Microsoft SQL Server\n([dbt-mssql](https://github.com/jacobm001/dbt-mssql))",
    "0-1": "[Profile Setup](doc:profile-mssql#section-overview-of-dbt-mssql)",
    "0-2": "SQL Server 2008 R2 and later",
    "0-3": "",
    "h-0": "Database",
    "h-1": "Documentation",
    "h-2": "Notes",
    "h-3": "Source",
    "1-0": "Microsoft SQL Server\n([dbt-sqlserver](https://github.com/mikaelene/dbt-sqlserver))",
    "1-2": "SQL Server 2016 and later",
    "1-1": "[Profile Setup](doc:profile-mssql#section-overview-of-dbt-sqlserver)"
  },
  "cols": 3,
  "rows": 2
}
[/block]
# Creating a new adapter

dbt can be extended with "adapter plugins." These plugins can be built into separate Python modules, and dbt will discover them if they are installed on your system. If you're interested in developing a new adapter plugin for dbt, please [open an issue](https://github.com/fishtown-analytics/dbt/issues/new) and be sure to check out the docs on [building a new adapter](doc:building-a-new-adapter).
