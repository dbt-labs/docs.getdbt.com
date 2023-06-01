---
title: "Verified adapters"
id: "verified-adapters"
---


The dbt Labs has a rigorous verified adapter program which provides reassurance to users about which adapters can be trusted to use in production, has been tested, and is actively maintained and updated. The process covers aspects of development, documentation, user experience, and maintenance. 

These adapters then earn a "Verified" status so that users can have a certain level of trust and expectation when they use them. The adapters also have maintainers and we recommend using the adapter's verification status to determine its quality and health.

Here's the list of the verified data platforms that can connect to dbt and its latest version.

| dbt Cloud setup  | CLI installation | latest verified version  |
| ---------------- | ----------------------------------------- | ------------------------ |
| [Setup AlloyDB](/docs/cloud/connect-data-platform/connect-redshift-postgresql-alloydb)  | [Install AlloyDB](/docs/core/connect-data-platform/alloydb-setup)     | (same as `dbt-postgres`) |
| Not supported | [Install Azure Synapse](/docs/core/connect-data-platform/azuresynapse-setup)       | 1.3 :construction:       |
| [Set up BigQuery](/docs/cloud/connect-data-platform/connect-bigquery) | [Install BigQuery](/docs/core/connect-data-platform/bigquery-setup)                | 1.4                      |
| [Set up Databricks ](/docs/cloud/connect-data-platform/connect-databricks)| [ Install Databricks](/docs/core/connect-data-platform/databricks-setup)            | 1.4                      |
| Not supported | [Install Dremio](/docs/core/connect-data-platform/dremio-setup)                    | 1.4 :construction:       |
| [Set up Postgres](/docs/cloud/connect-data-platform/connect-redshift-postgresql-alloydb)  | [Install Postgres](/docs/core/connect-data-platform/postgres-setup)                | 1.4                      |
| [Set up Redshift](/docs/cloud/connect-data-platform/connect-redshift-postgresql-alloydb)   | [Install Redshift](/docs/core/connect-data-platform/redshift-setup)                | 1.4                      |
| [Set up Snowflake](/docs/cloud/connect-data-platform/connect-snowflake)   | [ Install Snowflake](/docs/core/connect-data-platform/snowflake-setup)              | 1.4                      |
| [Set up Spark](/docs/cloud/connect-data-platform/connect-apache-spark) | [Install Spark](/docs/core/connect-data-platform/spark-setup)                      | 1.4                      |
| [Set up Starburst & Trino](/docs/cloud/connect-data-platform/connect-starburst-trino)| [Installl Starburst & Trino](/docs/core/connect-data-platform/trino-setup)          | 1.4                      |

:construction:: Verification in progress

To learn more, see [Verifying a new adapter](/guides/dbt-ecosystem/adapter-development/7-verifying-a-new-adapter).


