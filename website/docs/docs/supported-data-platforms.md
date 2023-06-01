---
title: "Supported data platforms"
id: "supported-data-platforms"
---

dbt connects to and runs SQL against your database, warehouse, lake, or query engine. We group all of these SQL-speaking things into one bucket called _data platforms_. dbt can be extended to any data platform using a dedicated _adapter plugin_. These plugins are built as Python modules that dbt Core discovers if they are installed on your system. All the adapters listed below are open source and free to use, just like dbt Core.

To learn more about adapters, check out [What Are Adapters](/guides/dbt-ecosystem/adapter-development/1-what-are-adapters).

## Supported Data Platforms

### Verified Adapters

| Data Platform (click to view setup guide) | latest verified version  |
| ----------------------------------------- | ------------------------ |
| [AlloyDB](/reference/warehouse-setups/alloydb-setup)                  | (same as `dbt-postgres`) |
| [Azure Synapse](/reference/warehouse-setups/azuresynapse-setup)       | 1.3 :construction:     |
| [BigQuery](/reference/warehouse-setups/bigquery-setup)                | 1.4                    |
| [Databricks](/reference/warehouse-setups/databricks-setup)            | 1.4                    |
| [Dremio](/reference/warehouse-setups/dremio-setup)                    | 1.4 :construction:     |
| [Microsoft Fabric Synapse Data Warehouse](/reference/warehouse-setups/fabric-setup)       | 1.4 :construction:     |
| [Postgres](/reference/warehouse-setups/postgres-setup)                | 1.4                    |
| [Redshift](/reference/warehouse-setups/redshift-setup)                | 1.4                    |
| [Snowflake](/reference/warehouse-setups/snowflake-setup)              | 1.4                    |
| [Spark](/reference/warehouse-setups/spark-setup)                      | 1.4                    |
| [Starburst & Trino](/reference/warehouse-setups/trino-setup)          | 1.4                    |
:construction:: Verification in progress

### Community Adapters

| Data Platforms (click to view setup guide) |                                  |                                      |
|--------------------------------------------|----------------------------------|--------------------------------------|
| [Athena](/reference/warehouse-setups/athena-setup)                     | [Greenplum](/reference/warehouse-setups/greenplum-setup)     | [Oracle](/reference/warehouse-setups/oracle-setup)               |
| [Clickhouse](/reference/warehouse-setups/clickhouse-setup)             | [Hive](/reference/warehouse-setups/hive-setup)               | [Rockset](/reference/warehouse-setups/rockset-setup)             |
| [IBM DB2](/reference/warehouse-setups/ibmdb2-setup)                    | [Impala](/reference/warehouse-setups/impala-setup)           | [SingleStore](/reference/warehouse-setups/singlestore-setup)     |
| [Doris & SelectDB](/reference/warehouse-setups/doris-setup)            | [Infer](/reference/warehouse-setups/infer-setup)             | [SQLite](/reference/warehouse-setups/sqlite-setup)               |
| [DuckDB](/reference/warehouse-setups/duckdb-setup)                     | [iomete](/reference/warehouse-setups/iomete-setup)           | [SQL Server & Azure SQL](/reference/warehouse-setups/mssql-setup) |
| [Dremio](/reference/warehouse-setups/dremio-setup)                     | [Layer](/reference/warehouse-setups/layer-setup)             | [Teradata](/reference/warehouse-setups/teradata-setup)           |
| [Exasol Analytics](/reference/warehouse-setups/exasol-setup)           | [Materialize](/reference/warehouse-setups/materialize-setup) | [TiDB](/reference/warehouse-setups/tidb-setup)                   |
| [Firebolt](/reference/warehouse-setups/firebolt-setup)                 | [MindsDB](/reference/warehouse-setups/mindsdb-setup)         | [Vertica](/reference/warehouse-setups/vertica-setup)             |
| [AWS Glue](/reference/warehouse-setups/glue-setup)                     | [MySQL](/reference/warehouse-setups/mysql-setup)             |                                      |
| [Databend Cloud](/reference/warehouse-setups/databend-setup)           | [fal - Python models](/reference/warehouse-setups/fal-setup) |                                      |

## Adapter Installation

With a few exceptions [^1], all adapters listed below can be installed from PyPI using `pip install <ADAPTER-NAME>`. The installation will include `dbt-core` and any other required dependencies, which may include both other dependencies and even other adapter plugins. Read more about [installing dbt](/docs/core/installation).

## Adapter Taxonomy

### Verified by dbt Labs

In order to provide a more consistent and reliable experience, dbt Labs has a rigorous process by which we verify adapter plugins. The process covers aspects of development, documentation, user experience, and maintenance. These adapters earn a **Verified** designation so that users can have a certain level of trust and expectation when they use them. To learn more, see [Verifying a new adapter](/guides/dbt-ecosystem/adapter-development/7-verifying-a-new-adapter).

We also welcome and encourage adapter plugins from the dbt community (see the below [Contributing to a pre-existing adapter](#contributing-to-a-pre-existing-adapter)). Please be mindful that these community maintainers are intrepid volunteers who donate their time and effort &mdash; so be kind, understanding, and help out where you can!

### Maintainers

Who made and maintains an adapter is certainly relevant, but we recommend using an adapter's verification status to determine the quality and health of an adapter. So far there are three categories of maintainers:

| Supported by | Maintained By                                                                                                                                                                                                                                  |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| dbt Labs     | dbt Labs maintains a set of adapter plugins for some of the most common databases, warehouses, and platforms. As for why particular data platforms were chosen, see ["Why Verify an Adapter"](/guides/dbt-ecosystem/adapter-development/7-verifying-a-new-adapter#why-verify-an-adapter) |
| Partner      | These adapter plugins are built and maintained by the same people who build and maintain the complementary data technology.                                                                                                                    |
| Community    | These adapter plugins are contributed and maintained by members of the community. 🌱                                                                                                                                                          |

## Contributing to dbt-core adapters

### Contributing to a pre-existing adapter

Community-supported plugins are works in progress, and anyone is welcome to contribute by testing and writing code. If you're interested in contributing:

- Join both the dedicated channel, [#adapter-ecosystem](https://getdbt.slack.com/archives/C030A0UF5LM), in [dbt Slack](https://community.getdbt.com/) and the channel for your adapter's data store (see **Slack Channel** column of above tables)
- Check out the open issues in the plugin's source repository (follow relevant link in **Adapter Repository** column of above tables)

### Creating a new adapter

If you see something missing from the lists above, and you're interested in developing an integration, read more about adapters and how they're developed in the  [Adapter Development](/guides/dbt-ecosystem/adapter-development/1-what-are-adapters) section.

If you have a new adapter, please add it to this list using a pull request! See [Documenting your adapter](/guides/dbt-ecosystem/adapter-development/5-documenting-a-new-adapter) for more information.

[^1]: Here are the two different adapters. Use the PyPI package name when installing with `pip`

    | Adapter repo name | PyPI package name    |
    | ----------------- | -------------------- |
    | `dbt-athena`      | `dbt-athena-adapter` |
    | `dbt-layer`       | `dbt-layer-bigquery` |
