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

<VersionBlock firstVersion="1.7">

## Adapter features

The following table lists the features available for adapters:

| Adapter | Catalog | Source freshness |
|---------|---------|------------------|
| dbt default configuration | manual run | `loaded_at` field |
| `dbt-bigquery` | incremental | metadata-based and `loaded_at` field |
| `dbt-databricks` | manual run | metadata-based and `loaded_at` field |
| `dbt-postgres` | incremental | `loaded_at` field |
| `dbt-redshift` | incremental | metadata-based and `loaded_at` field |
| `dbt-snowflake` | incremental | metadata-based and `loaded_at` field |
| `dbt-spark` | manual run | `loaded_at` field |


### Catalog 

For adapters that support it, you can partially build the catalog. This allows for the catalog to be built along with the model, eliminating the need to run a lengthy `dbt docs generate --select ...` at the end of a dbt run. For adapters that don't support incremental catalog generation, you must run `dbt docs generate --select ...` to build the catalog.

### Source freshness
You can measure source freshness using the warehouse metadata tables when the adapter supports it. This allows for calculating source freshness without using the `loaded_at` field and without querying the table directly. This is faster and more flexible. You can override this with the `loaded_at` field in the model config. If the adapter doesn't support this, you can still use the `loaded_at` field.
You can measure source freshness using the metadata when the adapter supports it. This allows for calculating source freshness without using the `loaded_at` field and without querying the table directly. This is faster and more flexible. You can override this with the `loaded_at` field in the model config. If the adapter doesn't support this, you can still use the `loaded_at` field.

</VersionBlock>