---
title: "Supported data platforms"
id: "supported-data-platforms"
sidebar_labe: "Supported data platforms"
description: "Connect dbt to any data platform in dbt Cloud or dbt Core, using a dedicated adapter plugin"
hide_table_of_contents: true

---

dbt connects to and runs SQL against your database, warehouse, lake, or query engine. We group all of these SQL-speaking things into one bucket called _data platforms_. dbt connects with data platforms by using a dedicated adapter plugin for each. Plugins are built as Python modules that dbt Core discovers if they are installed on your system. 

You can [connects to the adapter plugin](/docs/connect-adapters) seamlessly and directly in the dbt Cloud user interface (UI) or installing it using the command line (CLI). To learn more about adapters, check out [What Are Adapters](/guides/dbt-ecosystem/adapter-development/1-what-are-adapters).

There are two types of adapters and we recommend relying on the adapter's verification status to assess its quality and maintenance: 
- **Verified** &mdash; dbt Labs offers a rigorous adapter program to assure users of trustworthy, tested, and regularly updated adapters for production use. Verified adapters earn a "Verified" status, providing users with trust and confidence. Refer to [Verifying a new adapter](/guides/dbt-ecosystem/adapter-development/7-verifying-a-new-adapter) to learn more about the program. 
- **Community** &mdash; Community, open-source adapter are maintained by community members. Refer to [community adapters](/docs/community-adapters) for more info.

Here's the list of the **Verified data platforms** that can connect to dbt Cloud or dbt Core, and its latest version available. 

<div className="grid--4-col">

<Card
    title="AlloyDB"
    body="<a href='/docs/cloud/connect-data-platform/connect-redshift-postgresql-alloydb'><img src='/img/icons/dbt-bit.svg' width='7%'/>Set up in dbt Cloud </a> <br /><a href='/docs/core/connect-data-platform/alloydb-setup'><img src='/img/icons/command-line.svg' width='6%'/>Install using the CLI</a> <br /><br />  Latest version: 1.4"
    icon="alloydb"/>

<Card
    title="Redshift"
    body="<a href='/docs/cloud/connect-data-platform/connect-redshift-postgresql-alloydb'><img src='/img/icons/dbt-bit.svg' width='7%'/>Set up in dbt Cloud </a> <br /><a href='/docs/core/connect-data-platform/redshift-setup'><img src='/img/icons/command-line.svg' width='6%'/>Install using the CLI </a> <br /><br /> Latest version: 1.4"
    icon="redshift"/>


<Card
    title="Postgres"
    body="<a href='/docs/cloud/connect-data-platform/connect-redshift-postgresql-alloydb'>Set up in dbt Cloud </a> <br /><a href='/docs/core/connect-data-platform/postgres-setup'>Install in dbt Core </a> <br /><br /> Latest version: 1.4"
    icon="redshift"/>


<Card
    title="BigQuery"
    body="<a href='/docs/cloud/connect-data-platform/connect-bigquery'>Set up in dbt Cloud </a> <br /><a href='/docs/core/connect-data-platform/bigquery-setup'>Install in dbt Core </a> <br /><br /> Latest version: 1.4"
    icon="bigquery"/>

<Card
    title="Databricks"
    body="<a href='/docs/cloud/connect-data-platform/connect-databricks'>Set up in dbt Cloud </a> <br /><a href='/docs/core/connect-data-platform/databricks-setup'>Install in dbt Core </a> <br /><br /> Latest version: 1.4"
    icon="databricks"/>

<Card
    title="Snowflake"
    body="<a href='/docs/cloud/connect-data-platform/connect-snowflake'>Set up in dbt Cloud </a> <br /><a href='/docs/core/connect-data-platform/snowflake-setup'>Install in dbt Core </a> <br /><br /> Latest version: 1.4"
    icon="snowflake"/>

<Card
    title="Starburst"
    body="<a href='/docs/cloud/connect-data-platform/connect-starburst-trino'>Set up in dbt Cloud </a> <br /><a href='/docs/core/connect-data-platform/trino-setup'>Install in dbt Core </a> <br /> <br /> Latest version: 1.4"
    icon="starburst-partner-logo"/>

<Card
    title="Spark"
    body="<a href='/docs/cloud/connect-data-platform/connect-apache-spark'>Set up in dbt Cloud </a> <br /><a href='/docs/core/connect-data-platform/spark-setup'>Install in dbt Core </a> <br /><br /> Latest version: 1.4"
    icon="rocket"/>

<Card
    title="Dremio*"
    body="<a href='/docs/core/connect-data-platform/dremio-setup'>Install in dbt Core </a> <br /><br /> Latest version: 1.4<br /> 🚧 Verification in progress"
    icon="rocket"/>

<Card
    title="Azure Synapse*"
    body="<a href='/docs/core/connect-data-platform/azuresynapse-setup'>Install in dbt Core </a> <br /><br /> Latest version: 1.3<br /> 🚧 Verification in progress"
    icon="rocket"/>

</div>

<br />
* These adapters aren't supported in dbt Cloud and you can only install them using the CLI.<br />

