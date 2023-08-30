---
title: "About dbt Core data platform connections"
id: "about-core-connections"
description: "Information about data platform connections in dbt Core"
sidebar_label: "About data platform connections in dbt Core"
hide_table_of_contents: true
---

dbt Core can connect with a variety of data platform providers including: 

- [Amazon Redshift](/docs/core/connect-data-platform/redshift-setup) 
- [Apache Spark](/docs/core/connect-data-platform/spark-setup) 
- [Databricks](/docs/core/connect-data-platform/databricks-setup) 
- [Google BigQuery](/docs/core/connect-data-platform/bigquery-setup)
- [PostgreSQL](/docs/core/connect-data-platform/postgres-setup)
- [Snowflake](/docs/core/connect-data-platform/snowflake-setup)
- [Starburst or Trino](/docs/core/connect-data-platform/trino-setup)

dbt communicates with a number of different data platforms by using a dedicated adapter for each. When you install dbt Core, you'll also need to install the specific adapter for your data platform, connect to dbt Core, and set up a [profiles.yml file](/docs/core/connect-data-platform/profiles.yml). You can do this using the command line (CLI).

Data platforms supported in dbt Core may be verified or unverified, and maintained by dbt Labs, partners, or community members.

These connection instructions provide the basic fields required for configuring a data platform connection in dbt Cloud. For more detailed guides, which include demo project data, read our [Quickstart guides](https://docs.getdbt.com/docs/quickstarts/overview)

## Connection profiles

If you're using dbt from the command line (CLI), you'll need a profiles.yml file that contains the connection details for your data platform. When you run dbt from the CLI, it reads your dbt_project.yml file to find the profile name, and then looks for a profile with the same name in your profiles.yml file. This profile contains all the information dbt needs to connect to your data platform.

For detailed info, you can refer to the [Connection profiles](/docs/core/connect-data-platform/connection-profiles).
