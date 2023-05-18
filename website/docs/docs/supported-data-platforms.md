---
title: "Supported data platforms"
id: "supported-data-platforms"
sidebar_labe: "Supported data platforms"
description: "Connect dbt to any data platform in dbt Cloud or dbt Core, using a dedicated adapter plugin"
hide_table_of_contents: true

---

dbt connects to and runs SQL against your database, warehouse, lake, or query engine. We group all of these SQL-speaking things into one bucket called _data platforms_. You can extend dbt to any data platform using a dedicated _adapter plugin_ using the command line (CLI) or directly in the dbt Cloud user interface (UI). Plugins are built as Python modules that dbt Core discovers if they are installed on your system. To learn more about adapters, check out [What Are Adapters](/guides/dbt-ecosystem/adapter-development/1-what-are-adapters).

The following adapters are open-source, verified by dbt Labs, and available to use in dbt Cloud or dbt Core. 

For community, open-source adapters, refer to [community adapters](/docs/community-adapters).



<div className="grid--3-col">

<Card
    title="Redshift"
    icon="redshift"/>


<Card
    title="Postgres"
    body="Connect to and run queries against underlying data in Postgres"
    icon="rocket"/>


<Card
    title="BigQuery"
    body="Connect to and run queries against underlying data in BigQuery"
    icon="bigquery"/>

<Card
    title="Databricks"
    body="Connect to and run queries against underlying data in Databricks"
    icon="databricks"/>

<Card
    title="Snowflake"
    body="Connect to and run queries against underlying data in Snowflake"
    link="/docs/quickstarts/dbt-cloud/starburst-galaxy"
    icon="snowflake"/>

<Card
    title="Starburst"
    body="Connect to and run queries against underlying data in Starburst"
    icon="starburst-partner-logo"/>

<Card
    title="Spark"
    body="Connect to and run queries against underlying data in Spark"
    icon="databricks"/>

<Card
    title="Dremio*"
    body="Connect to and run queries against underlying data in Spark"
    icon="databricks"/>

<Card
    title="Azure Synapse*"
    body="Connect to and run queries against underlying data in Spark"
    icon="databricks"/>

<Card
    title="AlloyDB"
    body="<a href='https://docs.getdbt.com/docs/cloud/connect-data-platform/connect-redshift-postgresql-alloydb'>Set up in dbt Cloud </a> <br /><a href='https://docs.getdbt.com/docs/cloud/connect-data-platform/connect-redshift-postgresql-alloydb'>Install in dbt Core </a> <br /> Latest version: 1.4"
    icon="alloydb"/>

</div>
