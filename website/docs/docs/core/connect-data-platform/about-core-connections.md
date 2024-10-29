---
title: "About dbt Core data platform connections"
id: "about-core-connections"
description: "Information about data platform connections in dbt Core"
sidebar_label: "About data platform connections in dbt Core"
hide_table_of_contents: true
pagination_next: "docs/core/connect-data-platform/profiles.yml"
pagination_prev: null
---

dbt Core can connect with a variety of data platform providers including: 

- [Amazon Redshift](/docs/core/connect-data-platform/redshift-setup) 
- [Apache Spark](/docs/core/connect-data-platform/spark-setup) 
- [Azure Synapse](/docs/core/connect-data-platform/azuresynapse-setup)
- [Databricks](/docs/core/connect-data-platform/databricks-setup) 
- [Google BigQuery](/docs/core/connect-data-platform/bigquery-setup)
- [Microsoft Fabric](/docs/core/connect-data-platform/fabric-setup)
- [PostgreSQL](/docs/core/connect-data-platform/postgres-setup)
- [Snowflake](/docs/core/connect-data-platform/snowflake-setup)
- [Starburst or Trino](/docs/core/connect-data-platform/trino-setup)

dbt communicates with a number of different data platforms by using a dedicated adapter for each. When you install dbt Core, you'll also need to install the specific adapter for your data platform, connect to dbt Core, and set up a [profiles.yml file](/docs/core/connect-data-platform/profiles.yml). You can do this using the command line (CLI).

Data platforms supported in dbt Core may be verified by our Trusted Adapter Program, and maintained by dbt Labs, partners, or community members.

These connection instructions provide the basic fields required for configuring a data platform connection in dbt Cloud. For more detailed guides, which include demo project data, read our [Quickstart guides](https://docs.getdbt.com/docs/guides)

## Connection profiles

If you're using dbt from the command line (CLI), you'll need a profiles.yml file that contains the connection details for your data platform. When you run dbt from the CLI, it reads your dbt_project.yml file to find the profile name, and then looks for a profile with the same name in your profiles.yml file. This profile contains all the information dbt needs to connect to your data platform.

For detailed info, you can refer to the [Connection profiles](/docs/core/connect-data-platform/connection-profiles).

## Adapter features

The following table lists the features available for adapters:

| Adapter | Catalog | Source freshness |
|---------|---------|------------------|
| dbt default configuration | full | `loaded_at_field` |
| `dbt-bigquery` | partial and full | metadata-based and `loaded_at_field` |
| `dbt-databricks` | full | metadata-based and `loaded_at_field` |
| `dbt-postgres` | partial and full | `loaded_at_field` |
| `dbt-redshift` | partial and full | metadata-based and `loaded_at_field` |
| `dbt-snowflake` | partial and full | metadata-based and `loaded_at_field` |
| `dbt-spark` | full | `loaded_at_field` |


### Catalog 

For adapters that support it, you can partially build the catalog. This allows the catalog to be built for only a select number of models via `dbt docs generate --select ...`. For adapters that don't support partial catalog generation, you must run `dbt docs generate` to build the full catalog.

### Source freshness
You can measure source freshness using the warehouse metadata tables on supported adapters. This allows for calculating source freshness without using the [`loaded_at_field`](/reference/resource-properties/freshness#loaded_at_field) and without querying the table directly. This is faster and more flexible (though it might sometimes be inaccurate, depending on how the warehouse tracks altered tables). You can override this with the `loaded_at_field` in the [source config](/reference/source-configs). If the adapter doesn't support this, you can still use the `loaded_at_field`.
