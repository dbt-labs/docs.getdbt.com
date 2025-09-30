---
title: "Apache Iceberg Support"
id: apache-iceberg-support
sidebar_label: "Apache Iceberg support"
pagination_next: "docs/mesh/iceberg/about-catalogs"
description: Understand dbt platform support for Iceberg catalogs.
---

Apache Iceberg is an open standard table format that brings greater portability and interoperability to the data ecosystem. By standardizing how data is stored and accessed, Iceberg enables teams to work across different engines and platforms with confidence. It has many components to it but the main ones that dbt interacts with are:

- **Iceberg Table Format** - an open-source table format. Tables materialized in iceberg table format are stored on a user’s infrastructure, such as a S3 Bucket.
- **Iceberg Data Catalog** - an open-source metadata management system that tracks the schema, partition, and versions of Iceberg tables.
- **Iceberg REST Protocol** (also referred to as Iceberg REST API) is how engines can support and speak to other Iceberg-compatible catalogs.

dbt abstracts the complexity of table formats so teams can focus on delivering reliable, well-modeled data. Our initial integration with Iceberg supports table materializations and catalog integrations, allowing users to define and manage Iceberg tables directly in their dbt projects. To learn more, click on one of the following tiles

<div className="grid--4-col">

<Card
    title="Using dbt + Iceberg Catalog overview"
    body="dbt support for Apache Iceberg"
    link="/docs/mesh/iceberg/about-catalogs"
    icon="dbt-icon"/>

<Card
    title="Snowflake"
    body="Snowflake Iceberg Configurations"
    link="/docs/mesh/iceberg/snowflake-iceberg-support"
    icon="snowflake"/>

<Card
    title="BigQuery"
    body="BigQuery Iceberg Configurations"
    link="/docs/mesh/iceberg/bigquery-iceberg-support"
    icon="bigquery"/>

<Card
    title="Databricks"
    body="Databricks Iceberg Configurations"
    link="/docs/mesh/iceberg/databricks-iceberg-support"
    icon="databricks"/>

</div>
