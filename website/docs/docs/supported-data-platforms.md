---
title: "Supported Data Platforms"
id: "supported-data-platforms"
---

dbt connects to and runs SQL against your database, warehouse, lake or query engine. To keep things simple, we group all of these SQL-speaking things into one bucket called "data platforms". dbt can be extended to any data platform by means of a dedicated _adapter plugin_. These plugins are built as separate Python modules that dbt Core will discover them if they are installed on your system. All the adapters listed below are open source and free to use, just like dbt Core.

To learn more about adapters, check out ["What Are Adapters"](contributing/adapter-development/1-what-are-adapters).

## Adapter Installation

With a few exceptions [^1], all adapters listed below can be installed from PyPI using `pip install <ADAPTER-NAME>`. The installation will include `dbt-core` and any other required dependencies, which may include both other dependencies and even other adapter plugins. Read more about [installing dbt](dbt-cli/install/overview).

## Adapter Taxonomy

### Verified by dbt Labs

In order to provide a more consistent and reliable experience, dbt Labs now has a rigorous process by which we verify adapter plugins. The process covers aspects of development, documentation, user experience and maintenance. These adapters earn a "Verified" designation so that users can have a certain level of trust and expectation when they use them. To learn more see ["Verifying a new adapter](7-verifying-a-new-adapter")

We also welcome and encourage adapter plugins from the dbt community (see the below ["Contributing to a pre-existing adapter"](#contributing-to-a-pre-existing-adapter)). Please note that these community maintainers are intrepid volunteers who owe you nothing, but give anyway -- so be kind and understanding, and help out where you can!

### Maintainers

Who made and maintains and adapter is certainly relevant, but we recommend using an adapter's verification status to determine quality and health of an adapter. So far we have three categories of maintainers:

| Supported by | Maintained By                                                                                                                                                                                                                                  |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| dbt Labs     | dbt Labs maintains a set of adapter plugins for some of the most common databases, warehouses, and platforms. As for why particular data platforms were chosen, see ["Why Verify an Adapter"](7-verifying-a-new-adapter#why-verify-an-adapter) |
| Partner      | These adapter plugins are built and maintained by the same people who build and maintain the complementary data technology                                                                                                                     |
| Community    | These adapter plugins are contributed and maintained by members of the community 🌱                                                                                                                                                           |


## Supported Data Platforms

### Verified Adapters

| Data Platform                              | latest verified version  |
| ------------------------------------------ | ------------------------ |
| AlloyDB  ([setup](alloydb-profile))        | (same as `dbt-postgres`) |
| BigQuery ([setup](bigquery-profile))       | 1.2.0                    |
| Databricks ([setup](databricks-profile))   | 1.2.0 :construction:     |
| Postgres ([setup](postgres-profile))       | 1.2.0                    |
| Redshift ([setup](redshift-profile))       | 1.2.0                    |
| Snowflake ([setup](snowflake-profile))     | 1.2.0                    |
| Apache Spark ([setup](spark-profile))      | 1.2.0                    |
| Starburst & Trino ([setup](trino-profile)) | 1.2.0 :construction:     |

### Community Adapters

| Data Platform                                   |
| ----------------------------------------------- |
| Athena ([setup](athena-profile))                |
| ClickHouse ([setup](clickhouse-profile))        |
| IBM DB2 ([setup](ibmdb2-profile))               |
| DuckDB ([setup](duckdb-profile))                |
| Dremio ([setup](dremio-profile))                |
| Exasol Analytics ([setup](exasol-profile))      |
| Firebolt ([setup](firebolt-profile))            |
| AWS Glue ([setup](glue-profile))                |
| Greenplum ([setup](greenplum-profile))          |
| Hive ([setup](hive-profile))                    |
| Impala ([setup](impala-profile))                |
| iomete ([setup](iomete-profile))                |
| Layer ([setup](layer-profile))                  |
| Materialize ([setup](materialize-profile))      |
| MindsDB ([setup](mindsdb-profile))              |
| MySQL ([setup](mysql-profile))                  |
| Oracle ([setup](oracle-profile))                |
| Rockset ([setup](rockset-profile))              |
| SingleStore ([setup](singlestore-profile))      |
| SQLite ([setup](sqlite-profile))                |
| SQL Server & Azure SQL ([setup](mssql-profile)) |
| AzureSynapse ([setup](azuresynapse-profile))    |
| Teradata ([setup](teradata-profile))            |
| TiDB ([setup](tidb-profile))                    |
| Vertica ([setup](vertica-profile))              |

## Contributing to dbt-core adapters

### Contributing to a pre-existing adapter

Community-supported plugins are works in progress, and anyone is welcome to contribute by testing and writing code. If you're interested in contributing:

- Join both the dedicated channel, [#adapter-ecosystem](https://getdbt.slack.com/archives/C030A0UF5LM), in [dbt Slack](https://community.getdbt.com/) and the channel for your adapter's data store (see "Slack Channel" column of above tables)
- Check out the open issues in the plugin's source repository (follow relevant link in "Adapter Repository" column of above tables)

### Creating a new adapter

If you see something missing from the lists above, and you're interested in developing an integration, read more about adapters and how they're developed in the  ["Adapter Development"](/docs/contributing/adapter-development) section.

If you have a new adapter, please add it to this list using a pull request! See [Documenting your adapter](5-documenting-a-new-adapter) for more information.

[^1]: Here are the two different adapters. Use the PyPI package name when installing with `pip`

    | Adapter repo name | PyPI package name    |
    | ----------------- | -------------------- |
    | `dbt-athena`      | `dbt-athena-adapter` |
    | `dbt-layer`       | `dbt-layer-bigquery` |
