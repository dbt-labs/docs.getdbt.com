---
title: "About Iceberg catalogs"
id: about-catalogs
sidebar_label: "About Iceberg catalogs"
description: Understand technical data catalogs, and how they support dbt + Iceberg workflows
---

A technical data catalog is a metadata management layer that enables users and tools to programmatically discover, understand, and govern data assets that are available across multiple data platforms and query engines.

### Background

In the early 2010s, with the introduction of [Hadoop](https://hadoop.apache.org/) and data lakes, [Hive Metastore](https://hive.apache.org/) became the standard for managing schema metadata in Hadoop ecosystems. While effective in supporting early distributed query engines (separated compute and storage), such as Apache Spark and Trino, the Hive Metastore is limited in the kinds of structural metadata it can support, and it is generally slower and costlier than modern technical catalogs.

In recent years, the emergence and consolidation around the [Iceberg standard](https://iceberg.apache.org/terms/) has led to evolution of existing data catalogs (such as [Unity Catalog](https://www.unitycatalog.io/)) or the creation of new open source catalogs (including [Polaris](https://polaris.apache.org/) and [Lakekeeper](https://docs.lakekeeper.io/).

One important note - **technical data catalogs** serve a different purpose from **business catalogs**, although both benefit data teams:

- **Technical data catalogs:** Focus on structural metadata, including information about data like table and column names, data types, storage locations (particularly important for open table formats), and access controls. They can be built into an existing data platform (no setup needed) — such as Databricks Unity Catalog or Snowflake Horizon Catalog — or externally managed and integrated with each query engine. Those engines use the catalog to locate, read, and write data. 

- **Business data catalogs:** Serve broader organizational users (BI analysts, product managers, etc.). They enrich technical metadata with business context in the form of metrics, business definitions, data quality indicators, usage patterns, and ownership. 

### Why data catalogs are important to dbt

For dbt users working in a lakehouse or multi-engine architecture, data catalogs can serve two purposes:

- **Table Discovery:** dbt models are materialized in an open table format (often Iceberg) and registered in a catalog. Understanding the catalog structure is critical for managing datasets and informing dbt about what has already been built and where it resides.

- **Cross-Engine Interoperability:** Iceberg catalogs allow datasets created by one compute engine to be read by another, without replication. This is the foundation for [cross-platform dbt Mesh](/docs/mesh/cross-platform-mesh).

Without a catalog, each Iceberg table's metadata needs to be registered with the query engine individually, requiring many additional `create iceberg table` and `alter ... refresh` queries. With a catalog, each table's metadata is registered and refreshed automatically, and there is a single endpoint to ask about every table.

Over the past year, data platform vendors have been adding support for catalog "linking" or "federation," which is when the data platform manages the synchronization of metadata between external data catalogs and its managed data catalog. This means that an Iceberg table written by one query engine into one catalog is automatically available for reading by another query engine. See: [Snowflake catalog-linked databases](https://docs.snowflake.com/en/sql-reference/sql/create-database-catalog-linked), [Databricks catalog federation](https://docs.databricks.com/aws/en/query-federation/catalog-federation), [AWS Glue catalog federation](https://docs.aws.amazon.com/lake-formation/latest/dg/federated-catalog-data-connection.html), [BigQuery catalog federation](https://docs.cloud.google.com/lakehouse/docs/use-catalog-federation).

### How dbt works with Iceberg catalogs

dbt uses [Iceberg catalogs defined in `catalogs.yml`](/docs/mesh/iceberg/catalogs-yml) in order to:

- **Materialize models:** When dbt materializes a model as a table or view, if the catalog integration is declared, the underlying adapter (Spark, Trino, Snowflake, etc.) creates an Iceberg table entry in the specified catalog, both built-in or external. 

- **Resolve references:** When dbt reads a model materialized to a catalog, it will use the "physical" location defined by the active adapter (new spec) or write integration (old spec). This enables referencing (reading) a model (Iceberg table) in one query engine that was originally materialized (written) by another one, so long as both engines are integrated to the same catalog.

### Limitations

Many data platforms, query engines, and data catalogs have added substantially more support for Iceberg standards over the past few years — but it is still not a guarantee that any given data warehouse can interoperate with any given data catalog.

When it does exist, that support can be limited. For example, most Iceberg catalogs only support tables (`table` + `incremental` materialization in dbt), not views. They may not support atomic `create table as` statements, meaning that dbt must update tables using multiple statements without <Term id="ACID" /> guarantees.

Benoit (DX Advocate at dbt Labs) created a [useful visualization](https://b-per.github.io/iceberg-roulette/#matrix) (also available as a [fun interactive game](https://b-per.github.io/iceberg-roulette/)) to show the current state of warehouse / catalog interoperability. (See something that looks wrong or out-of-date? Open an issue or PR in [the repo](https://github.com/b-per/iceberg-roulette).)