---
title: "Apache Iceberg support"
id: apache-iceberg-support
sidebar_label: "Apache Iceberg support"
description: Understand dbt platform support for Iceberg catalogs.
---

Apache Iceberg is an open table format that brings greater portability and interoperability to the data ecosystem. By standardizing how data is stored and accessed, Iceberg enables teams to use the same data across multiple engines and platforms, without replication.

There are multiple layers of Iceberg support, in data platform and in dbt:

- **Iceberg table format** &mdash; An open-source table format. Iceberg tables are a combination of data files in object storage (such as Parquet files in an S3 bucket), as well as metadata files (recording the table's schema, versioning, and more) that also live in object storage.
- **Iceberg data catalog** &mdash; An open-source specification for a metadata system that tracks the schema, partition, and versions of multiple Iceberg tables.
- **Iceberg REST protocol** (also referred to as the Iceberg REST API) &mdash; Defines standard endpoints for interacting with Iceberg-compatible catalogs.

In theory, the Iceberg standard enables one query engine to read from or write to Iceberg tables in an external catalog, managed by another engine or platform. In practice, different Iceberg catalogs work differently, and different query engines support the Iceberg spec to varying degrees.

To the extent possible, dbt tries to abstract away the complexity of table formats, and the divergence among vendor-specific Iceberg implementations, so teams can focus on delivering reliable, well-modeled data. To learn more, select one of the following tiles:

<div className="grid--4-col">

<Card
    title="Iceberg catalogs"
    body="About Iceberg catalogs"
    link="/docs/build/iceberg/about-catalogs"
    icon="dbt-icon"/>

<Card
    title="Using table_format + catalogs.yml"
    body="dbt support for Iceberg + catalogs"
    link="/docs/build/iceberg/catalogs-yml"
    icon="dbt-icon"/>

<Card
    title="Snowflake + Iceberg"
    body="Snowflake Iceberg configurations"
    link="/docs/build/iceberg/adapters/snowflake-iceberg-support"
    icon="snowflake"/>

<Card
    title="BigQuery + Iceberg"
    body="BigQuery Iceberg configurations"
    link="/docs/build/iceberg/adapters/bigquery-iceberg-support"
    icon="bigquery"/>

<Card
    title="Databricks + Iceberg"
    body="Databricks Iceberg configurations"
    link="/docs/build/iceberg/adapters/databricks-iceberg-support"
    icon="databricks"/>

<Card
    title="DuckDB + Iceberg"
    body="DuckDB Iceberg Configurations"
    link="/docs/mesh/iceberg/databricks-iceberg-support"
    icon="duckdb"/>

</div>
