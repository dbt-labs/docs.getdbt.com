---
title: About quickstarts
id: overview
sidebar_label: "About quickstarts"
description: "Quickly create and run your first dbt project with SQL."
---

dbt Core is a powerful open-source tool for [data transformations](https://www.getdbt.com/analytics-engineering/transformation/), and dbt Cloud is the fastest and most reliable way to deploy your dbt jobs. With the help of a sample project, learn how to quickly start using dbt and one of the most common data platforms. 

The quickstarts will show you how to set up dbt and perform some key tasks. These tasks will illustrate how dbt establishes standard practices for your work such as using Git to version control your analytics code, testing your models to validate they are working correctly, documenting your models in detail to better collaborate with others, and scheduling jobs to execute at designated times.  

Before you begin, you will need:

* Warehouse with sample data. If you don't have this, you can use the [BigQuery project](/docs/quickstarts/dbt-cloud/bigquery), which leverages public data sets.
* Basic understanding of [Git](https://git-scm.com/doc).
* Basic understanding of [SQL](https://www.sqltutorial.org/).


<div className="grid--2-col">

<Card
    title="Quickstart for dbt Cloud and BigQuery"
    body="Learn how to connect to BigQuery, build your first dbt models with a sample project, test your models, document your models, and schedule a job run all in one web-based UI."
    link="/docs/quickstarts/dbt-cloud/bigquery"
    icon="bigquery"/>

<Card
    title="Quickstart for dbt Cloud and Databricks"
    body="Learn how to connect to Databricks, build your first dbt models with a sample project, test your models, document your models, and schedule a job run all in one web-based UI."
    link="/docs/quickstarts/dbt-cloud/databricks"
    icon="databricks"/>

<Card
    title="Quickstart for dbt Cloud and Redshift"
    body="Learn how to connect to Redshift, build your first dbt models with a sample project, test your models, document your models, and schedule a job run all in one web-based UI."
    link="/docs/quickstarts/dbt-cloud/redshift"
    icon="redshift"/>

<Card
    title="Quickstart for dbt Cloud and Snowflake"
    body="Learn how to connect to Snowflake, build your first dbt models with a sample project, test your models, document your models, and schedule a job run all in one web-based UI."
    link="/docs/quickstarts/dbt-cloud/snowflake"
    icon="snowflake"/>

<Card
    title="Quickstart for dbt Core using GitHub Codespaces"
    body="Learn how to quickly start running dbt commands in a GitHub codespace development environment with just a few clicks."
    link="/docs/quickstarts/dbt-core/codespace"
    icon="github-codespace"/>

<Card
    title="Quickstart for dbt Core from a manual install"
    body="When you use dbt Core to work with dbt, you will be editing files locally using a code editor, and running projects using a command line interface."
    link="/docs/quickstarts/dbt-core/manual-install"
    icon="command-line"/>

</div>

