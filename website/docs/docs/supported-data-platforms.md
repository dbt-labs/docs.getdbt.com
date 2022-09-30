---
title: "Supported data platforms"
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

| Supported by | Maintained By                                                                                                                |
| ------------ | -------------------------------------------------------------------------------------------------------------------------- |
| dbt Labs     | dbt Labs maintains a set of adapter plugins for some of the most common databases, warehouses, and platforms. As for why particular data platforms were chosen, see ["Why Verify an Adapter"](7-verifying-a-new-adapter#why-verify-an-adapter)                 |
| Partner      | These adapter plugins are built and maintained by the same people who build and maintain the complementary data technology |
| Community    | These adapter plugins are contributed and maintained by members of the community 🌱                                       |


## Supported Data Platforms



### Verified Adapters

| Data Platform     | Adapter Repository                                             | latest verified version  | Enabled in dbt Cloud      | Profile Setup                            | Configuration                                                | dbt Community Slack channel                                                             | Maintained By |
| ----------------- | -------------------------------------------------------------- | ------------------------ | ------------------ | ---------------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------------------- | ------------- |
| AlloyDB           | [dbt-postgres](https://github.com/dbt-labs/dbt-postgres)       | (same as `dbt-postgres`) | :white_check_mark: | [AlloyDB Profile](alloydb-profile)       |                                                              | [#db-postgres](https://getdbt.slack.com/archives/C0172G2E273)             | n/a           |
| BigQuery          | [dbt-bigquery](https://github.com/dbt-labs/dbt-bigquery)       | 1.2.0                    | :white_check_mark: | [BigQuery Profile](bigquery-profile)     | [BigQuery Configs](bigquery-configs)                         | [#db-bigquery](https://getdbt.slack.com/archives/C99SNSRTK)               | dbt Labs      |
| Databricks        | [dbt-databricks](https://github.com/databricks/dbt-databricks) | 1.2.0 :construction:     |                    | [Databricks Profile](databricks-profile) | [Databricks Configs](spark-configs#databricks-configuration) | [#db-databricks-and-spark](https://getdbt.slack.com/archives/C01DRQ178LQ) | Databricks    |
| Postgres          | [dbt-postgres](https://github.com/dbt-labs/dbt-postgres)       | 1.2.0                    | :white_check_mark: | [Postgres Profile](postgres-profile)     |                                                              | [#db-postgres](https://getdbt.slack.com/archives/C0172G2E273)             | dbt Labs      |
| Redshift          | [dbt-redshift](https://github.com/dbt-labs/dbt-redshift)       | 1.2.0                    | :white_check_mark: | [Redshift Profile](redshift-profile)     | [Redshift Configs](redshift-configs)                         | [#db-redshift](https://getdbt.slack.com/archives/C01DRQ178LQ)             | dbt Labs      |
| Snowflake         | [dbt-snowflake](https://github.com/dbt-labs/dbt-snowflake)     | 1.2.0                    | :white_check_mark: | [Snowflake Profile](snowflake-profile)   | [Snowflake Configs](snowflake-configs)                       | [#db-snowflake](https://getdbt.slack.com/archives/C01DRQ178LQ)            | dbt Labs      |
| Apache Spark      | [dbt-spark](https://github.com/dbt-labs/dbt-spark)             | 1.2.0                    | :white_check_mark: | [Spark Profile](spark-profile)           | [Spark Configs](spark-configs)                               | [#db-databricks-and-spark](https://getdbt.slack.com/archives/C01DRQ178LQ) | dbt Labs      |
| Starburst & Trino | [dbt-trino](https://github.com/starburstdata/dbt-trino)        | 1.2.0 :construction:     |                    | [Trino Profile](trino-profile)           |                                                              | [#db-presto-trino](https://getdbt.slack.com/archives/C013MLFR7BQ)         | Starburst     |

### Community Adapters

| Data Platform          | Adapter Repository                                                                              | Profile Setup                              | Configuration                              | Slack Channel                                                     | Maintained By |
| ---------------------- | ----------------------------------------------------------------------------------------------- | ------------------------------------------ | ------------------------------------------ | ----------------------------------------------------------------- | ------------- |
| Athena                 | [dbt-athena](https://github.com/Tomme/dbt-athena)                                               | [Athena Profile](athena-profile)           |                                            | [#db-athena](https://getdbt.slack.com/archives/C013MLFR7BQ)       | Community     |
| ClickHouse             | [dbt-clickhouse](https://github.com/ClickHouse/dbt-clickhouse)                                  | [Clickhouse Profile](clickhouse-profile)   | [Clickhouse Configs](clickhouse-configs)   | [#db-clickhouse](https://getdbt.slack.com/archives/C03KVDLMNV6)     | Clickhouse    |
| IBM DB2                | [dbt-ibmdb2](https://github.com/aurany/dbt-ibmdb2)                                              | [DB2 Profile](ibmdb2-profile)              |                                            | n/a                                                               | Community     |
| DuckDB                 | [dbt-duckdb](https://github.com/jwills/dbt-duckdb/)                                             | [DuckDB Profile](duckdb-profile)           |                                            | [#db-duckdb](https://getdbt.slack.com/archives/C039D1J1LA2)       | Community     |
| Dremio                 | [dbt-dremio](https://github.com/fabrice-etanchaud/dbt-dremio/)                                  | [Dremio Profile](dremio-profile)           |                                            | n/a                                                               | Community     |
| Exasol Analytics       | [dbt-exasol](https://github.com/tglunde/dbt-exasol)                                             | [Exasol Profile](exasol-profile)           |                                            | n/a                                                               | Community     |
| Firebolt               | [dbt-firebolt](https://github.com/firebolt-db/dbt-firebolt)                                     | [Firebolt Profile](firebolt-profile)       | [Firebolt Configs](firebolt-configs)       | [#db-firebolt](https://getdbt.slack.com/archives/C02PYT5CXN0)     | Firebolt      |
| AWS Glue               | [dbt-glue](https://github.com/aws-samples/dbt-glue)                                             | [Glue Profile](glue-profile)               | [Glue Configs](glue-configs)               | [#db-glue](https://getdbt.slack.com/archives/C02R4HSMBAT)         | AWS           |
| Greenplum              | [dbt-greenplum](https://github.com/markporoshin/dbt-greenplum)                                  | [Greenplum Profile](greenplum-profile)     | [Greenplum Configs](greenplum-configs)     | n/a                                                               | Community     |
| Hive                   | [dbt-hive](https://github.com/cloudera/dbt-hive)                                                | [Hive Profile](hive-profile)               | [Hive Configs](hive-configs)               | [#db-hive](https://getdbt.slack.com/archives/C0401DTNSKW)         | Cloudera      |
| Impala                 | [dbt-impala](https://github.com/cloudera/dbt-impala)                                            | [Impala Profile](impala-profile)           | [Impala Configs](impala-configs)           | [#db-impala](https://getdbt.slack.com/archives/C03K2PTHHTP)       | Cloudera      |
| iomete                 | [dbt-iomete](https://github.com/iomete/dbt-iomete)                                              | [iomete Profile](iomete-profile)           |                                            | [#db-iomete](https://getdbt.slack.com/archives/C03JFG22EP9)       | Iomete        |
| Layer         | [dbt-layer](https://github.com/layerai/dbt-layer)                                               | [Layer Profile](layer-profile)             |                                            | [#tools-layer](https://getdbt.slack.com/archives/C03STA39TFE)     | Layer AI      |
| Materialize            | [dbt-materialize](https://github.com/MaterializeInc/materialize/blob/main/misc/dbt-materialize) | [Materialize Profile](materialize-profile) | [Materialize Configs](materialize-configs) | [#db-materialize](https://getdbt.slack.com/archives/C01PWAH41A5)  | Materialize   |
| MindsDB                | [dbt-mindsdb](https://github.com/mindsdb/dbt-mindsdb)                                           | [MindsDB Profile](mindsdb-profile)         | [MindsDB Configs](mindsdb-configs)         | n/a                                                               | MindsDB       |
| MySQL                  | [dbt-mysql](https://github.com/dbeatty10/dbt-mysql)                                             | [MySQL Profile](mysql-profile)             |                                            | [#db-mysql-family](https://getdbt.slack.com/archives/C03BK0SHC64) | Community     |
| Oracle                 | [dbt-oracle](https://github.com/oracle/dbt-oracle)                                              | [Oracle Profile](oracle-profile)           |                                            | [#db-oracle](https://getdbt.slack.com/archives/C01PWH4TXLY)       | Oracle        |
| Rockset                | [dbt-rockset](https://github.com/rockset/dbt-rockset)                                           | [Rockset Profile](rockset-profile)         |                                            | [#db-rockset](https://getdbt.slack.com/archives/C02J7AZUAMN)      | Rockset       |
| SingleStore            | [dbt-singlestore](https://github.com/memsql/dbt-singlestore)                                    | [SingleStore Profile](singlestore-profile) |                                            | [#db-singlestore](https://getdbt.slack.com/archives/C02V2QHFF7U)  | Single Store  |
| SQLite                 | [dbt-sqlite](https://github.com/codeforkjeff/dbt-sqlite)                                        | [SQLite Profile](sqlite-profile)           |                                            | n/a                                                               | Community     |
| SQL Server & Azure SQL | [dbt-sqlserver](https://github.com/dbt-msft/dbt-sqlserver/)                                     | [SQL Server Profile](mssql-profile)        | [SQL Server Configs](mssql-configs)        | [#db-sqlserver](https://getdbt.slack.com/archives/CMRMDDQ9W)      | Community     |
| Azure Synapse          | [dbt-synapse](https://github.com/dbt-msft/dbt-synapse)                                          | [Synapse Profile](azuresynapse-profile)    | [Synapse Configs](azuresynapse-configs)    | [#db-synapse](https://getdbt.slack.com/archives/C01DRQ178LQ)      | Community     |
| Teradata               | [dbt-teradata](https://github.com/teradata/dbt-teradata)                                        | [Teradata Profile](teradata-profile)       | [Teradata Configs](teradata-configs)       | [#db-teradata](https://getdbt.slack.com/archives/C027B6BHMT3)     | Teradata      |
| TiDB                   | [dbt-tidb](https://github.com/pingcap/dbt-tidb)                                                 | [TiDB Profile](tidb-profile)               |                                            | [#db-tidb](https://getdbt.slack.com/archives/C03CC86R1NY)         | PingCAP       |
| Vertica                | [dbt-vertica](https://github.com/ahedengren/dbt-vertica)                                        | [Vertica Profile](vertica-profile)         |                                            | n/a                                                               | Community     |

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
