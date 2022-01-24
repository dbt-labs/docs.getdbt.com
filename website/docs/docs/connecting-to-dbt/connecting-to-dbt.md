---
title: "Connecting to dbt"
id: "connecting-to-dbt"
description: ""
---


dbt connects to your data warehouse to run data transformation queries. As such, you’ll need a data warehouse with source data loaded in it to use dbt. dbt natively supports connections to Snowflake, BigQuery, Redshift and Postgres data warehouses, and there’s a number of community-supported adapters for other warehouses.

When you define your connection, you’ll also be able to specify the target schema where dbt should create your models as tables and views. For more information on picking target schema names, see [Managing environments](/docs/guides/managing-environments).

## About adapters
dbt connects to and runs SQL against your database, warehouse, platform, or query engine. It works by using a dedicated **adapter** for each technology. All the adapters listed below are open source and free to use, just like dbt.

Any adapter can be installed from PyPi using `pip`. The installation will include `dbt-core` and any other required dependencies, which may include other adapter plugins. Read more about [installing dbt](dbt-cli/install/overview).

##TODO what is an adapter? When do you need an adapter? Why would I use an adapter?

##TODO LINK TO AVAILABLE ADAPTERS
##TODO LINK TO CREATING AN ADAPTER
##TODO link To building a new adapter