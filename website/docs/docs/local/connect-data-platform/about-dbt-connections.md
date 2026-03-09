---
title: "About data platform connections"
id: "about-dbt-connections"
description: "Learn how to connect dbt to your data platform"
sidebar_label: "About data platform connections"
hide_table_of_contents: true
pagination_next: null
pagination_prev: null
---

dbt connects to your data platform to run SQL transformations against your data. The connection setup depends on which dbt engine you use:
- [<Constant name="fusion_engine" />](/docs/local/connect-data-platform/about-dbt-connections?version=2)
- [<Constant name="core" />](/docs/local/connect-data-platform/about-dbt-connections?version=1)

<VersionBlock firstVersion="2.0">

## Supported Fusion data platforms

The <Constant name="fusion_engine" /> includes built-in support for:

- [Snowflake](/docs/local/connect-data-platform/snowflake-setup)
- [Databricks](/docs/local/connect-data-platform/databricks-setup)
- [Amazon Redshift](/docs/local/connect-data-platform/redshift-setup)
- [Google BigQuery](/docs/local/connect-data-platform/bigquery-setup)

<Constant name="fusion" /> uses [ADBC (Arrow Database Connectivity)](https://arrow.apache.org/adbc/) drivers for high-performance connections to these platforms. No separate adapter installation is required.

## Connection profiles

When you run dbt locally, it reads your `dbt_project.yml` file to find the profile name, then looks for a profile with the same name in your `profiles.yml` file. This profile contains the connection details for your data platform.

For detailed configuration options, refer to [Connection profiles](/docs/local/profiles.yml).

</VersionBlock>

<VersionBlock lastVersion="1.99">

## Supported Core data platforms

<Constant name="core" /> connects to data platforms through adapters. Popular platforms include:

- [Snowflake](/docs/local/connect-data-platform/snowflake-setup)
- [Databricks](/docs/local/connect-data-platform/databricks-setup) 
- [Amazon Redshift](/docs/local/connect-data-platform/redshift-setup) 
- [Google BigQuery](/docs/local/connect-data-platform/bigquery-setup)
- [PostgreSQL](/docs/local/connect-data-platform/postgres-setup)
- [Apache Spark](/docs/local/connect-data-platform/spark-setup) 
- [Starburst or Trino](/docs/local/connect-data-platform/trino-setup)
- [Microsoft Fabric](/docs/local/connect-data-platform/fabric-setup)
- [Azure Synapse](/docs/local/connect-data-platform/azuresynapse-setup)

When you install <Constant name="core" />, you also need to install the specific adapter for your data platform. Data platform adapters may be verified by our [Trusted Adapter Program](/docs/trusted-adapters), and maintained by dbt Labs, partners, or community members.

For the full list of supported platforms, see [Supported data platforms](/docs/supported-data-platforms).

## Connection profiles

When you run dbt from the CLI, it reads your `dbt_project.yml` file to find the profile name, then looks for a profile with the same name in your `profiles.yml` file. This profile contains the connection details for your data platform.

For detailed configuration options, refer to [Connection profiles](/docs/local/profiles.yml).

## Adapter features

The following table lists features available for adapters:

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

For adapters that support it, you can partially build the catalog. This builds the catalog for only selected models via `dbt docs generate --select ...`. For adapters that don't support partial catalog generation, run `dbt docs generate` to build the full catalog.

### Source freshness

You can measure source freshness using warehouse metadata tables on supported adapters. This calculates source freshness without using the [`loaded_at_field`](/reference/resource-properties/freshness#loaded_at_field) and without querying the table directly. This approach is faster and more flexible (though it might sometimes be inaccurate, depending on how the warehouse tracks altered tables). You can override this with the `loaded_at_field` in the [source config](/reference/source-configs). If the adapter doesn't support this, you can still use the `loaded_at_field`.

</VersionBlock>

## Next steps

For step-by-step setup instructions with demo project data, see our [Quickstart guides](/guides).
