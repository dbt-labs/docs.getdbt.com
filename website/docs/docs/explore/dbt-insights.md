---
title: "About dbt Insights"
description: "Learn how to query data and perform exploratory data analysis using dbt Insights"
sidebar_label: "About dbt Insights"
tags: [Semantic Layer]
image: /img/docs/dbt-insights/insights-chart.jpg
pagination_prev: "docs/explore/model-query-history"
pagination_next: "docs/explore/navigate-dbt-insights"
---

# About dbt Insights <Lifecycle status="preview,managed,managed_plus" />

<IntroText>
Learn how to query data with <Constant name="query_page" /> and view documentation in <Constant name="explorer" />.
</IntroText>

<Constant name="query_page" /> in <Constant name="cloud" /> empowers users to seamlessly explore and query data with an intuitive, context-rich interface. It bridges technical and business users by combining metadata, documentation, AI-assisted tools, and powerful querying capabilities into one unified experience. 

<Constant name="query_page" /> in <Constant name="cloud" /> integrates with [<Constant name="explorer" />](/docs/explore/explore-projects), [<Constant name="cloud_ide" />](/docs/cloud/dbt-cloud-ide/develop-in-the-cloud), [<Constant name="visual_editor" />](/docs/cloud/canvas), [<Constant name="copilot" />](/docs/cloud/dbt-copilot), and [<Constant name="semantic_layer" />](/docs/use-dbt-semantic-layer/dbt-sl) to make it easier for you to perform exploratory data analysis, leverage AI-assisted tools, make faster decisions, and collaborate across teams.

<Lightbox src="/img/docs/dbt-insights/insights-main.gif" title="Overview of the dbt Insights and its features" />

## Key benefits

Key benefits include:
- Quickly write, run, and iterate on SQL queries with tools like syntax highlighting, tabbed editors, and query history.
- Leverage dbt metadata, trust signals, and lineage from <Constant name="explorer" /> for informed query construction.
- Make data accessible to users of varied technical skill levels with SQL, <Constant name="semantic_layer" /> queries, and visual tools.
- Use <Constant name="copilot" />'s AI-assistance to generate or edit SQL queries, descriptions, and more.

Some example use cases include:
- Analysts can quickly construct queries to analyze sales performance metrics across regions and view results.
- All users have a rich development experience powered by <Constant name="explorer" />'s end-to-end exploration experience.

## Prerequisites 

- Be on a <Constant name="cloud" /> [Enterprise-tier](https://www.getdbt.com/pricing) plan &mdash; [book a demo](https://www.getdbt.com/contact) to learn more about <Constant name="query_page" />.
- Available on all [tenant](/docs/cloud/about-cloud/tenancy) configurations. 
- Have a <Constant name="cloud" /> [developer license](/docs/cloud/manage-access/seats-and-users) with access to <Constant name="query_page" />.
- Configured [developer credentials](/docs/cloud/dbt-cloud-ide/develop-in-the-cloud#get-started-with-the-cloud-ide).
- Your production and development [environments](/docs/dbt-cloud-environments) are on <Constant name="cloud" />’s ‘Latest’ [release track](/docs/dbt-versions/cloud-release-tracks) or a supported dbt version.
- Use a supported data platfrom: Snowflake, BigQuery, Databricks, Redshift, or Postgres.
	- Single sign-on (SSO) for development user accounts is supported, however SSO for production credentials is not yet supported.
- (Optional) &mdash; To query [<Constant name="semantic_layer" />](/docs/use-dbt-semantic-layer/dbt-sl) metrics from the <Constant name="query_page" />, you must also:
  - [Configure](/docs/use-dbt-semantic-layer/setup-sl) the <Constant name="semantic_layer" /> for your dbt project.
  - Have a successful job run in the environment where you configured the <Constant name="semantic_layer" />. 
