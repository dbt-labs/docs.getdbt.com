---
title: "Apache Iceberg Support"
id: apache-iceberg-support
sidebar_label: "Apache Iceberg support"
pagination_next: "docs/mesh/iceberg/about-catalogs"
description: Understand dbt platform support for Iceberg catalogs.
---

Apache Iceberg is an open table format that brings greater portability and interoperability to the data ecosystem. By standardizing how data is stored and accessed, Iceberg enables teams to use the same data across multiple engines and platforms, without replication.

There are multiple layers of Iceberg support, in data platform and in dbt:
- **Iceberg Table Format** - an open-source table format. Iceberg tables are a combination of data files in object storage (such as parquet files in an S3 bucket), as well as metadata files (recording the table's schema, versioning, etc) that also live in object storage.
- **Iceberg Data Catalog** - an open-source specification for a metadata system that tracks the schema, partition, and versions of multiple Iceberg tables.
- **Iceberg REST Protocol** (also referred to as Iceberg REST API) defines standard endpoints for interacting with Iceberg-compatible catalogs

In theory, the Iceberg standard enables one query engine to read from or write to Iceberg tables in an external catalog, managed by another engine or platform. In practice, different Iceberg catalogs work differently, and different query engines support the Iceberg spec to varying degrees.

To the extent possible, dbt tries to abstract away the complexity of table formats, and the divergence among vendor-specific Iceberg implementations, so teams can focus on delivering reliable, well-modeled data. To learn more, click on one of the following tiles:

<div className="grid--4-col">

<Card
    title="Using dbt + Iceberg Catalogs"
    body="dbt support for Apache Iceberg"
    link="/docs/mesh/iceberg/about-catalogs"
    icon="dbt-icon"/>

<Card
    title="Using catalogs.yml"
    body="dbt support for Apache Iceberg"
    link="/docs/mesh/iceberg/about-catalogs"
    icon="dbt-icon"/>

<Card
    title="Snowflake + Iceberg"
    body="Snowflake Iceberg Configurations"
    link="/docs/mesh/iceberg/snowflake-iceberg-support"
    icon="snowflake"/>

<Card
    title="BigQuery + Iceberg"
    body="BigQuery Iceberg Configurations"
    link="/docs/mesh/iceberg/bigquery-iceberg-support"
    icon="bigquery"/>

<Card
    title="Databricks + Iceberg"
    body="Databricks Iceberg Configurations"
    link="/docs/mesh/iceberg/databricks-iceberg-support"
    icon="databricks"/>

</div>

<Card
    title="DuckDB + Iceberg"
    body="DuckDB Iceberg Configurations"
    link="/docs/mesh/iceberg/databricks-iceberg-support"
    icon="duckdb"/>

</div>
