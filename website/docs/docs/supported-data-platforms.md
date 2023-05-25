---
title: "Supported data platforms"
id: "supported-data-platforms"
sidebar_label: "Supported data platforms"
description: "Connect dbt to any data platform in dbt Cloud or dbt Core, using a dedicated adapter plugin"
hide_table_of_contents: true
---

dbt connects to and runs SQL against your database, warehouse, lake, or query engine. These SQL-speaking platforms are collectively referred to as _data platforms_. dbt connects with data platforms by using a dedicated [adapter plugin](/guides/dbt-ecosystem/adapter-development/1-what-are-adapters) for each. Plugins are built as Python modules that dbt Core discovers if they are installed on your system. 

You can [connect](/docs/connect-adapters) to adapters and data platforms either directly in the dbt Cloud user interface (UI) or install them manually using the command line (CLI). There are two types of adapters available and to evaluate quality and maintenance, we recommend you consider their verification status:

- **Verified** &mdash; dbt Labs' strict [adapter program](/guides/dbt-ecosystem/adapter-development/7-verifying-a-new-adapter) assures users of trustworthy, tested, and regularly updated adapters for production use. Verified adapters earn a "Verified" status, providing users with trust and confidence. 
- **Community** &mdash; [Community adapters](/docs/community-adapters) are open-source and maintained by community members. 

### Verified adapters

The following are **Verified adapters** ✅ you can connect to either in dbt Cloud or dbt Core:

<div className="grid--4-col">

<Card
    title="AlloyDB"
    body="<a href='/docs/cloud/connect-data-platform/connect-redshift-postgresql-alloydb'><img src='/img/icons/dbt-bit.svg' width='7%'/>Set up in dbt Cloud </a> <br /><a href='/docs/core/connect-data-platform/alloydb-setup'><img src='/img/icons/dbt-bit.svg' width='7%'/>Install using the CLI </a> <br /><br />  Latest version: 1.4"
    icon="alloydb"/>

<Card
    title="BigQuery"
    body="<a href='/docs/cloud/connect-data-platform/connect-bigquery'><img src='/img/icons/dbt-bit.svg' width='7%'/>Set up in dbt Cloud </a> <br /><a href='/docs/core/connect-data-platform/bigquery-setup'><img src='/img/icons/dbt-bit.svg' width='7%'/>Install using the CLI </a> <br /><br /> Latest version: 1.4"
    icon="bigquery"/>

<Card
    title="Databricks"
    body="<a href='/docs/cloud/connect-data-platform/connect-databricks'><img src='/img/icons/dbt-bit.svg' width='7%'/>Set up in dbt Cloud </a> <br /><a href='/docs/core/connect-data-platform/databricks-setup'><img src='/img/icons/dbt-bit.svg' width='7%'/>Install using the CLI  </a> <br /><br /> Latest version: 1.4"
    icon="databricks"/>

<Card
    title="Postgres"
    body="<a href='/docs/cloud/connect-data-platform/connect-redshift-postgresql-alloydb'><img src='/img/icons/dbt-bit.svg' width='7%'/>Set up in dbt Cloud </a> <br /><a href='/docs/core/connect-data-platform/postgres-setup'><img src='/img/icons/dbt-bit.svg' width='7%'/>Install using the CLI </a> <br /><br /> Latest version: 1.4"
    icon="redshift"/>

<Card
    title="Redshift"
    body="<a href='/docs/cloud/connect-data-platform/connect-redshift-postgresql-alloydb'><img src='/img/icons/dbt-bit.svg' width='7%'/>Set up in dbt Cloud </a> <br /><a href='/docs/core/connect-data-platform/redshift-setup'><img src='/img/icons/dbt-bit.svg' width='7%'/>Install using the CLI </a> <br /><br /> Latest version: 1.4"
    icon="redshift"/>

<Card
    title="Snowflake"
    body="<a href='/docs/cloud/connect-data-platform/connect-snowflake'><img src='/img/icons/dbt-bit.svg' width='7%'/>Set up in dbt Cloud </a> <br /><a href='/docs/core/connect-data-platform/snowflake-setup'><img src='/img/icons/dbt-bit.svg' width='7%'/>Install using the CLI  </a> <br /><br /> Latest version: 1.4"
    icon="snowflake"/>

<Card
    title="Spark"
    body="<a href='/docs/cloud/connect-data-platform/connect-apache-spark'><img src='/img/icons/dbt-bit.svg' width='7%'/>Set up in dbt Cloud </a> <br /><a href='/docs/core/connect-data-platform/spark-setup'><img src='/img/icons/dbt-bit.svg' width='7%'/>Install using the CLI </a> <br /><br /> Latest version: 1.4"
    icon="databricks"/>

<Card
    title="Starburst"
    body="<a href='/docs/cloud/connect-data-platform/connect-starburst-trino'><img src='/img/icons/dbt-bit.svg' width='7%'/>Set up in dbt Cloud </a> <br /><a href='/docs/core/connect-data-platform/trino-setup'><img src='/img/icons/dbt-bit.svg' width='7%'/>Install using the CLI  </a> <br /> <br /> Latest version: 1.4"
    icon="starburst"/>

<Card
    title="Dremio*"
    body="<a href='/docs/core/connect-data-platform/dremio-setup'><img src='/img/icons/dbt-bit.svg' width='7%'/>Install using the CLI  </a> <br /><br /> Latest version: 1.4<br /> 🚧 Verification in progress"
    icon="rocket"/>

<Card
    title="Azure Synapse*"
    body="<a href='/docs/core/connect-data-platform/azuresynapse-setup'><img src='/img/icons/dbt-bit.svg' width='7%'/>Install using the CLI  </a> <br /><br /> Latest version: 1.3<br /> 🚧 Verification in progress"
    icon="rocket"/>

</div>

<br />
* Not supported in dbt Cloud and you can only install them using the CLI.<br />

