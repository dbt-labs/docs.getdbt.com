---
title: "About Iceberg catalogs"
id: about-catalogs
sidebar_label: "About Iceberg catalogs"
description: Understand how Iceberg catalogs fit into your dbt Mesh configurations.
---

Data catalogs have recently become at the top of the data industry's mind, especially given the excitement about Iceberg and data governance for AI. It has become an overused term that represents a broad set of tools. So, before we dive into Iceberg catalogs, let's start at the beginning: 

## About data catalogs

The short answer is it’s **data about your data**.

A Data Catalog is a centralized metadata management layer that enables users and tools to discover, understand, and govern data effectively. At its core, it organizes metadata about datasets, including information about the schemas, lineage, access controls, and business context to help technical and non-technical users work with data more efficiently.

### History of data catalogs

Data catalogs aren’t a new concept. 

Data dictionaries were the earliest forms of catalogs, and they were part of relational databases. These dictionaries stored schema-level metadata (like table names). They weren’t made for business users and were very manual.

Fast forward to the early 2010s, and the industry began to delve deeply into [Hadoop](https://hadoop.apache.org/) and data lakes. [Hive Metastore](https://hive.apache.org/) became the standard for managing schema metadata in Hadoop ecosystems. However, it was still limited to structural metadata, as it lacked lineage, discovery, and business context metadata. 

Next, there was the emergence of open source technical catalogs like [Iceberg](https://iceberg.apache.org/terms/), [Polaris](https://polaris.apache.org/), and [Unity Catalog](https://www.unitycatalog.io/), and business catalogs like [Atlan](https://atlan.com/what-is-a-data-catalog/). In the era of AI, it’s more important than ever to have catalogs that can support structural metadata and business logic. 

For data teams, the catalogs can fall into two buckets: 

- **Technical data catalogs:** Focus on structural metadata, including information about data like table and column names, data types, storage locations (particularly important for open table formats), and access controls. They usually come either “built-in” (no setup needed) or externally managed and integrated into your data platform. They are used by compute engines to locate and interact with data. 

- **Business data catalogs:** Serve broader organizational users (BI analysts, product managers, etc.). They enrich technical metadata with business context in the form of metrics, business definitions, data quality indicators, usage patterns, and ownership. 

### Why data catalogs are important to dbt

For dbt users working in a lakehouse or multi-engine architecture, understanding and interacting with data catalogs is essential for several reasons, including:

- **Table Discovery:** dbt models are registered in catalogs. Understanding the catalog structure is critical for managing datasets and informing dbt about what has already been built and where it resides.

- **Cross-Engine Interoperability:** Iceberg catalogs allow datasets created by one compute engine to be read by another.  This is what dbt Mesh’s cross-platform functionality is built on. 

## About Iceberg catalogs

Apache Iceberg is an open table format designed for petabyte-scale analytic datasets. It supports schema evolution, time travel, partition pruning, and transactional operations across distributed compute engines.

Iceberg catalogs are a critical abstraction layer that maps logical table names to their metadata locations and provides a namespace mechanism. They decouple compute engines from the physical layout of data, enabling multiple tools to interoperate consistently on the same dataset.

There are multiple types of Iceberg catalogs:
- Iceberg REST
- Iceberg REST compatible
- Delta/Iceberg Hybrid*

Hybrid catalogs support storing duplicate table metadata in Iceberg and Delta Lake formats, enabling workflows like an Iceberg engine to read from Delta Lake or vice versa. There will be limitations specific to how the platform has implemented this. 

### How dbt works with Iceberg catalogs

dbt interacts with Iceberg catalogs through the adapters in two ways:

- **Model Materialization:** When dbt materializes a model as a table or view, if the catalog integration is declared, the underlying adapter (Spark, Trino, Snowflake, etc.) creates an Iceberg table entry in the specified catalog, both built-in or external. 


- **Catalog Integration**: With our initial release of the new catalog framework, users can declare which catalog the table's metadata is written to. 

Why is this important? dbt uses and creates a significant amount of metadata. Before every run, dbt needs to know what already exists so it knows how to compile code (ex. resolving your `{{ref()}}` to the actual table name) and where to materialize the object. By supporting these two methods, dbt can cleverly adjust based on the environment, code logic, and use case defined in your dbt project. 

### Limitations

To ensure that your compute engine has access to the catalog, you must provide the networking and permissions are set up correctly. This means that if you are using X warehouse with Y catalog but want to read Y catalog from Z warehouse, you need to ensure that Z warehouse can connect to Y catalog. If IP restrictions are turned on, you must resolve this by removing restrictions on allowlisting (only possible if the warehouse supports static IP addresses) or setting something like Privatelink to support this. 
