---
title: "Supported Data Platforms"
id: "supported-data-platforms"
---

dbt connects to and runs SQL against your database, warehouse, lake or query engine. To keep things simple, we group all of these SQL-speaking things into one bucket called "data platforms". dbt can be extended to any data platform by means of a dedicated _adapter plugin_. These plugins are built as separate Python modules that dbt Core will discover them if they are installed on your system. All the adapters listed below are open source and free to use, just like dbt Core.

To learn more about adapters, check out ["What Are Adapters"](contributing/adapter-development/1-what-are-adapters).

## Adapter Installation

With two exceptions [^1], all adapters listed below can be installed from PyPI using `pip install <ADAPTER-NAME>`. The installation will include `dbt-core` and any other required dependencies, which may include other adapter plugins. Read more about [installing dbt](dbt-cli/install/overview).

## Adapter Taxonomy

### Verified by dbt Labs

We have two tiers for dbt-core adapters: "Verified" and "Community".

| Tier      | Relevant adapters                                                                                                                                                                                                                                                                      |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Verified  | The adapters: <li>maintained by dbt Labs as well as</li><li> partner-maintained adapters that have been verified by dbt Labs</li>                                                                                                                                                |
| Community | <li>All other partner-maintained adapters as well as</li> <li>all community adapters.</li> Community adapters in particular tend to be works-in-progress. Contributions from users are highly encouraged (see ["Contributing to a pre-existing adapter"](#contributing-to-a-pre-existing-adapter)) |

### Maintainers

Who made and maintains and adapter is certainly relevant, but we recommend using an adapter's verification status to determine quality and health of an adapter. So far we have three categories of maintainers:

| Supported by | Description                                                                                                                           |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------- |
| dbt Labs     | dbt Labs maintains a set of adapters for some of the most common databases, warehouses, and platforms. |
| Partner      | These adapter plugins are built and maintained by the same people who build and maintain the complementary data technology            |
| Community    | These adapter plugins are contributed and maintained by members of the community 🌱                                                  |

Note that, while no community plugins are currently supported in dbt Cloud, we expect this to change in the near future.

## Supported Data Platforms



### Verified Adapters

| Data Platform     | Adapter Repository                                             | latest verified version  | Cloud support      | Maintained By | Profile Setup                            | Configuration                                                | Slack Channel                                                             |
| ----------------- | -------------------------------------------------------------- | ------------------------ | ------------------ | ------------- | ---------------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------------------- |
| AlloyDB           | [dbt-postgres](https://github.com/dbt-labs/dbt-postgres)       | (same as `dbt-postgres`) | :white_check_mark: | n/a           | [AlloyDB Profile](alloydb-profile)       |                                                              | [#db-postgres](https://getdbt.slack.com/archives/C0172G2E273)             |
| BigQuery          | [dbt-bigquery](https://github.com/dbt-labs/dbt-bigquery)       | 1.2.0                    | :white_check_mark: | dbt Labs      | [BigQuery Profile](bigquery-profile)     | [BigQuery Configs](bigquery-configs)                         | [#db-bigquery](https://getdbt.slack.com/archives/C99SNSRTK)               |
| Databricks        | [dbt-databricks](https://github.com/databricks/dbt-databricks) | 1.2.0 :construction:     |                    | Databricks    | [Databricks Profile](databricks-profile) | [Databricks Configs](spark-configs#databricks-configuration) | [#db-databricks-and-spark](https://getdbt.slack.com/archives/C01DRQ178LQ) |
| Postgres          | [dbt-postgres](https://github.com/dbt-labs/dbt-postgres)       | 1.2.0                    | :white_check_mark: | dbt Labs      | [Postgres Profile](postgres-profile)     |                                                              | [#db-postgres](https://getdbt.slack.com/archives/C0172G2E273)             |
| Redshift          | [dbt-redshift](https://github.com/dbt-labs/dbt-redshift)       | 1.2.0                    | :white_check_mark: | dbt Labs      | [Redshift Profile](redshift-profile)     | [Redshift Configs](redshift-configs)                         | [#db-redshift](https://getdbt.slack.com/archives/C01DRQ178LQ)             |
| Snowflake         | [dbt-snowflake](https://github.com/dbt-labs/dbt-snowflake)     | 1.2.0                    | :white_check_mark: | dbt Labs      | [Snowflake Profile](snowflake-profile)   | [Snowflake Configs](snowflake-configs)                       | [#db-snowflake](https://getdbt.slack.com/archives/C01DRQ178LQ)            |
| Apache Spark      | [dbt-spark](https://github.com/dbt-labs/dbt-spark)             | 1.2.0                    | :white_check_mark: | dbt Labs      | [Spark Profile](spark-profile)           | [Spark Configs](spark-configs)                               | [#db-databricks-and-spark](https://getdbt.slack.com/archives/C01DRQ178LQ) |
| Starburst & Trino | [dbt-trino](https://github.com/starburstdata/dbt-trino)        | 1.2.0 :construction:     |                    | Starburst     | [Trino Profile](trino-profile)           |                                                              | [#db-presto-trino](https://getdbt.slack.com/archives/C013MLFR7BQ)         |

### Community Adapters

Community-supported plugins are works in progress, and anyone is welcome to contribute by testing and writing code. If you're interested in contributing:

- Join both the dedicated #adapter-ecosystem channel in [dbt Slack](https://community.getdbt.com/) and the channel for your adapter's data store (e.g. #db-sqlserver, #db-athena)
- Check out the open issues in the plugin's source repository

| Data Platform          | Adapter Repository                                                                              | Maintained By | Profile Setup                              | Configuration                              | Slack Channel                                                     | Notes                     |
| ---------------------- | ----------------------------------------------------------------------------------------------- | ------------- | ------------------------------------------ | ------------------------------------------ | ----------------------------------------------------------------- | ------------------------- |
| Athena                 | [dbt-athena](https://github.com/Tomme/dbt-athena)                                               | Community     | [Athena Profile](athena-profile)           |                                            | [#db-athena](https://getdbt.slack.com/archives/C013MLFR7BQ)       | Athena engine version 2   |
| ClickHouse             | [dbt-clickhouse](https://github.com/ClickHouse/dbt-clickhouse)                                  | Clickhouse    | [Clickhouse Profile](clickhouse-profile)   | [Clickhouse Configs](clickhouse-configs)   | [#db-redshift](https://getdbt.slack.com/archives/C01DRQ178LQ)     |                           |
| IBM DB2                | [dbt-ibmdb2](https://github.com/aurany/dbt-ibmdb2)                                              | Community     | [DB2 Profile](ibmdb2-profile)              |                                            | n/a                                                               | IBM DB2 V9fp2+            |
| DuckDB                 | [dbt-duckdb](https://github.com/jwills/dbt-duckdb/)                                             | Community     | [DuckDB Profile](duckdb-profile)           |                                            | [#db-duckdb](https://getdbt.slack.com/archives/C039D1J1LA2)       | DuckDB 0.3.2              |
| Dremio                 | [dbt-dremio](https://github.com/fabrice-etanchaud/dbt-dremio/)                                  | Community     | [Dremio Profile](dremio-profile)           |                                            | n/a                                                               | Dremio 4.7+               |
| Exasol Analytics       | [dbt-exasol](https://github.com/tglunde/dbt-exasol)                                             | Community     | [Exasol Profile](exasol-profile)           |                                            | n/a                                                               | Exasol 6.x and later      |
| Firebolt               | [dbt-firebolt](https://github.com/firebolt-db/dbt-firebolt)                                     | Firebolt      | [Firebolt Profile](firebolt-profile)       | [Firebolt Configs](firebolt-configs)       | [#db-firebolt](https://getdbt.slack.com/archives/C02PYT5CXN0)     |                           |
| AWS Glue               | [dbt-glue](https://github.com/aws-samples/dbt-glue)                                             | AWS           | [Glue Profile](glue-profile)               | [Glue Configs](glue-configs)               | [#db-glue](https://getdbt.slack.com/archives/C02R4HSMBAT)         | Glue 2.0+                 |
| Greenplum              | [dbt-greenplum](https://github.com/markporoshin/dbt-greenplum)                                  | Community     | [Greenplum Profile](greenplum-profile)     | [Greenplum Configs](greenplum-configs)     | n/a                                                               | Greenplum 6.0+            |
| Hive                   | [dbt-hive](https://github.com/cloudera/dbt-hive)                                                | Cloudera      | [Hive Profile](hive-profile)               | [Hive Configs](hive-configs)               | [#db-hive](https://getdbt.slack.com/archives/C0401DTNSKW)         |                           |
| Impala                 | [dbt-impala](https://github.com/cloudera/dbt-impala)                                            | Cloudera      | [Impala Profile](impala-profile)           | [Impala Configs](impala-configs)           | [#db-impala](https://getdbt.slack.com/archives/C03K2PTHHTP)       |                           |
| iomete                 | [dbt-iomete](https://github.com/iomete/dbt-iomete)                                              | Iomete        | [iomete Profile](iomete-profile)           |                                            | [#db-iomete](https://getdbt.slack.com/archives/C03JFG22EP9)       |                           |
| Layer Bigquery         | [dbt-layer](https://github.com/layerai/dbt-layer)                                               | Layer AI      | [Layer Profile](layer-profile)             |                                            | [#tools-layer](https://getdbt.slack.com/archives/C03STA39TFE)     |                           |
| Materialize            | [dbt-materialize](https://github.com/MaterializeInc/materialize/blob/main/misc/dbt-materialize) | Materialize   | [Materialize Profile](materialize-profile) | [Materialize Configs](materialize-configs) | [#db-materialize](https://getdbt.slack.com/archives/C01PWAH41A5)  |                           |
| MindsDB                | [dbt-mindsdb](https://github.com/mindsdb/dbt-mindsdb)                                           | MindsDB       | [MindsDB Profile](mindsdb-profile)         | [MindsDB Configs](mindsdb-configs)         | n/a                                                               |                           |
| MySQL                  | [dbt-mysql](https://github.com/dbeatty10/dbt-mysql)                                             | Community     | [MySQL Profile](mysql-profile)             |                                            | [#db-mysql-family](https://getdbt.slack.com/archives/C03BK0SHC64) | MySQL 5.7 and 8.0         |
| Oracle                 | [dbt-oracle](https://github.com/oracle/dbt-oracle)                                              | Oracle        | [Oracle Profile](oracle-profile)           |                                            | [#db-oracle](https://getdbt.slack.com/archives/C01PWH4TXLY)       |                           |
| Rockset                | [dbt-rockset](https://github.com/rockset/dbt-rockset)                                           | Rockset       | [Rockset Profile](rockset-profile)         |                                            | [#db-rockset](https://getdbt.slack.com/archives/C02J7AZUAMN)      |                           |
| SingleStore            | [dbt-singlestore](https://github.com/memsql/dbt-singlestore)                                    | Single Store  | [SingleStore Profile](singlestore-profile) |                                            | [#db-singlestore](https://getdbt.slack.com/archives/C02V2QHFF7U)  |                           |
| SQLite                 | [dbt-sqlite](https://github.com/codeforkjeff/dbt-sqlite)                                        | Community     | [SQLite Profile](sqlite-profile)           |                                            | n/a                                                               | SQlite Version 3.0+       |
| SQL Server & Azure SQL | [dbt-sqlserver](https://github.com/dbt-msft/dbt-sqlserver/)                                     | Community     | [SQL Server Profile](mssql-profile)        | [SQL Server Configs](mssql-configs)        | [#db-sqlserver](https://getdbt.slack.com/archives/CMRMDDQ9W)      | SQL Server 2016 and later |
| Azure Synapse          | [dbt-synapse](https://github.com/dbt-msft/dbt-synapse)                                          | Community     | [Synapse Profile](azuresynapse-profile)    | [Synapse Configs](azuresynapse-configs)    | [#db-synapse](https://getdbt.slack.com/archives/C01DRQ178LQ)      | Azure Synapse 10+         |
| Teradata               | [dbt-teradata](https://github.com/teradata/dbt-teradata)                                        | Teradata      | [Teradata Profile](teradata-profile)       | [Teradata Configs](teradata-configs)       | [#db-teradata](https://getdbt.slack.com/archives/C027B6BHMT3)     |                           |
| TiDB                   | [dbt-tidb](https://github.com/pingcap/dbt-tidb)                                                 | PingCAP       | [TiDB Profile](tidb-profile)               |                                            | [#db-tidb](https://getdbt.slack.com/archives/C03CC86R1NY)         |                           |
| Vertica                | [dbt-vertica](https://github.com/ahedengren/dbt-vertica)                                        | Community     | [Vertica Profile](vertica-profile)         |                                            | n/a                                                               | Vertica 10.0+             |

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
