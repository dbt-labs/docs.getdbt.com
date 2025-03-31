---
title: "About the Query page"
description: "Learn how to query data and perform exploratory data analysis using the Query page"
sidebar_label: "About the Query page"
tags: [Semantic Layer]
pagination_next:  "docs/collaborate/access-query-page"
image: /img/docs/query-page/qp-results.jpg
---

# About the Query page <Lifecycle status="beta,enterprise" />

<IntroText>
Learn how to query data with the Query page and view documentation in dbt Explorer.
</IntroText>

:::tip
Query page is available in private beta to Enterprise accounts. To join, please reach out to your account manager.
:::

The Query page in dbt Cloud empowers users to seamlessly explore and query data with an intuitive, context-rich interface. It bridges technical and business users by combining metadata, documentation, AI-assisted tools, and powerful querying capabilities into one unified experience. 

Query page in dbt Cloud integrates with [dbt Explorer](/docs/collaborate/explore-projects), [dbt Cloud IDE](/docs/cloud/dbt-cloud-ide/develop-in-the-cloud), [Visual Editor](/docs/cloud/visual-editor), [dbt Copilot](/docs/cloud/dbt-copilot), and [dbt Semantic Layer](/docs/use-dbt-semantic-layer/dbt-sl) to make it easier for you to perform exploratory data analysis, leverage AI-assisted tools, make faster decisions, and collaborate across teams.

<Lightbox src="/img/docs/query-page/qp-main.gif" title="Overview of the Query page and its features" />

## Key benefits

Key benefits include:
- Quickly write, run, and iterate on SQL queries with tools like syntax highlighting, tabbed editors, and query history.
- Leverage dbt metadata, trust signals, and lineage from dbt Explorer for informed query construction.
- Make data accessible to users of varied technical skill levels with SQL, Semantic Layer queries, and visual tools.
- Use dbt Copilot's AI-assistance to generate or edit SQL queries, descriptions, and more.

Some example use cases include:
- Analysts can quickly construct queries to analyze sales performance metrics across regions and view results.
- All users have a rich development experience powered by dbt Explorer's end-to-end exploration experience.

## Prerequisites 

- Have a dbt Cloud [Enterprise](https://www.getdbt.com/pricing) account &mdash; [book a demo](https://www.getdbt.com/contact) to learn more about the Query page.
- Available on all [tenant](/docs/cloud/about-cloud/tenancy) configurations. 
- Have a dbt Cloud [developer license](/docs/cloud/manage-access/seats-and-users) with access to the Query page.
- Configured [developer credentials](/docs/cloud/dbt-cloud-ide/develop-in-the-cloud#get-started-with-the-cloud-ide)
- Your production and development [environments](/docs/dbt-cloud-environments) are on dbt Cloud’s ‘Latest’ [release track](/docs/dbt-versions/cloud-release-tracks) or a supported dbt version.
- Configured the [Semantic Layer](/docs/use-dbt-semantic-layer/setup-sl) for your dbt project.
- Use Snowflake, BigQuery, Databricks, Redshift, or Postgres.
	- Note SSH tunneling for Postgres or Redshift connections is not supported. 
	- Single sign-on (SSO) for development user accounts supported, however SSO for production credentials not yet supported.
- Have a successful job run in the environment where you configured the [Semantic Layer](/docs/use-dbt-semantic-layer/dbt-sl).
