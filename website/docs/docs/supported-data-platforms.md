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
    title="AlloyDB"
    body="<a href='https://docs.getdbt.com/docs/cloud/connect-data-platform/connect-redshift-postgresql-alloydb'><img src='/img/icons/dbt-bit.svg' width='7%'/>Set up in dbt Cloud </a> <br /><a href='https://docs.getdbt.com/docs/cloud/connect-data-platform/connect-redshift-postgresql-alloydb'><img src='/img/icons/command-line.svg' width='6%'/>Install using the CLI</a> <br /><br />  Latest version: 1.4"
    icon="alloydb"/>

<Card
    title="Redshift"
    body="<a href='https://docs.getdbt.com/docs/cloud/connect-data-platform/connect-redshift-postgresql-alloydb'><img src='/img/icons/dbt-bit.svg' width='7%'/>Set up in dbt Cloud </a> <br /><a href='https://docs.getdbt.com/docs/core/connect-data-platform/redshift-setup'><img src='/img/icons/command-line.svg' width='6%'/>Install using the CLI </a> <br /><br /> Latest version: 1.4"
    icon="redshift"/>


<Card
    title="Postgres"
    body="<a href='https://docs.getdbt.com/docs/cloud/connect-data-platform/connect-redshift-postgresql-alloydb'>Set up in dbt Cloud </a> <br /><a href='https://docs.getdbt.com/docs/core/connect-data-platform/postgres-setup'>Install in dbt Core </a> <br /><br /> Latest version: 1.4"
    icon="redshift"/>


<Card
    title="BigQuery"
    body="<a href='https://docs.getdbt.com/docs/cloud/connect-data-platform/connect-redshift-postgresql-alloydb'>Set up in dbt Cloud </a> <br /><a href='https://docs.getdbt.com/docs/core/connect-data-platform/bigquery-setupb'>Install in dbt Core </a> <br /><br /> Latest version: 1.4"
    icon="bigquery"/>

<Card
    title="Databricks"
    body="<a href='https://docs.getdbt.com/docs/cloud/connect-data-platform/connect-redshift-postgresql-alloydb'>Set up in dbt Cloud </a> <br /><a href='https://docs.getdbt.com//docs/core/connect-data-platform/connection-profiles'>Install in dbt Core </a> <br /><br /> Latest version: 1.4"
    icon="databricks"/>

<Card
    title="Snowflake"
    body="<a href='https://docs.getdbt.com/docs/cloud/connect-data-platform/connect-redshift-postgresql-alloydb'>Set up in dbt Cloud </a> <br /><a href='https://docs.getdbt.com/docs/core/connect-data-platform/snowflake-setup'>Install in dbt Core </a> <br /><br /> Latest version: 1.4"
    link="/docs/quickstarts/dbt-cloud/starburst-galaxy"
    icon="snowflake"/>

<Card
    title="Starburst"
    body="<a href='https://docs.getdbt.com/docs/cloud/connect-data-platform/connect-redshift-postgresql-alloydb'>Set up in dbt Cloud </a> <br /><a href='https://docs.getdbt.com/docs/core/connect-data-platform/trino-setup'>Install in dbt Core </a> <br /> <br /> Latest version: 1.4"
    icon="starburst-partner-logo"/>

<Card
    title="Spark"
    body="<a href='https://docs.getdbt.com/docs/cloud/connect-data-platform/connect-redshift-postgresql-alloydb'>Set up in dbt Cloud </a> <br /><a href='https://docs.getdbt.com/docs/core/connect-data-platform/spark-setup'>Install in dbt Core </a> <br /><br /> Latest version: 1.4"
    icon="rocket"/>

<Card
    title="Dremio*"
    body="<a href='https://docs.getdbt.com/docs/cloud/connect-data-platform/connect-redshift-postgresql-alloydb'>Install in dbt Core </a> <br /><br /> Latest version: 1.4<br /> 🚧 Verification in progress"
    icon="rocket"/>

<Card
    title="Azure Synapse*"
    body="<a href='https://docs.getdbt.com/docs/cloud/connect-data-platform/connect-redshift-postgresql-alloydb'>Install in dbt Core </a> <br /><br /> Latest version: 1.3<br /> 🚧 Verification in progress"
    icon="rocket"/>

</div>

<br />
* These adapters aren't supported in dbt Cloud and you can only install them using the CLI.<br />

