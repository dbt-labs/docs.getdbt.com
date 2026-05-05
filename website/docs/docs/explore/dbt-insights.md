---
title: "About dbt Insights"
description: "Learn how to query data and perform exploratory data analysis using dbt Insights"
sidebar_label: "About dbt Insights"
tags: [Semantic Layer]
image: /img/docs/dbt-insights/insights-chart.jpg
pagination_prev: "docs/explore/model-query-history"
pagination_next: "docs/explore/navigate-dbt-insights"
---

# About dbt Insights <Lifecycle status="managed,managed_plus" />

<IntroText>
Learn how to query data with <Constant name="insights" /> and view documentation in <Constant name="catalog" />.
</IntroText>

<Constant name="insights" /> in <Constant name="dbt" /> empowers users to seamlessly explore and query data with an intuitive, context-rich interface. It bridges technical and business users by combining metadata, documentation, AI-assisted tools, and powerful querying capabilities into one unified experience. 

<Constant name="insights" /> in <Constant name="dbt" /> integrates with [<Constant name="catalog" />](/docs/explore/explore-projects), [<Constant name="studio_ide" />](/docs/platform/studio-ide/develop-in-studio), [<Constant name="canvas" />](/docs/platform/canvas), [<Constant name="copilot" />](/docs/platform/dbt-copilot), and [<Constant name="semantic_layer" />](/docs/use-dbt-semantic-layer/dbt-sl) to make it easier for you to perform exploratory data analysis, leverage AI-assisted tools, make faster decisions, and collaborate across teams.

<Lightbox src="/img/docs/dbt-insights/insights-main.gif" title="Overview of the dbt Insights and its features" />

## Key benefits

Key benefits include:
- Quickly write, run, and iterate on SQL queries with tools like syntax highlighting, tabbed editors, and query history.
- Leverage dbt metadata, trust signals, and lineage from <Constant name="catalog" /> for informed query construction.
- Make data accessible to users of varied technical skill levels with SQL, <Constant name="semantic_layer" /> queries, and visual tools.
- Use <Constant name="copilot" />'s AI-assistance to generate or edit SQL queries, descriptions, and more.

Some example use cases include:
- Analysts can quickly construct queries to analyze sales performance metrics across regions and view results.
- All users have a rich development experience powered by <Constant name="catalog" />'s end-to-end exploration experience.

## Prerequisites 

- Be on a <Constant name="dbt" /> [Enterprise-tier](https://www.getdbt.com/pricing) plan &mdash; [book a demo](https://www.getdbt.com/contact) to learn more about <Constant name="insights" />.
- Available on all [tenant](/docs/platform/about-platform/tenancy) configurations. 
- Have a <Constant name="dbt" /> [developer license](/docs/platform/manage-access/seats-and-users) with access to <Constant name="insights" />.
- Configured [developer credentials](/docs/platform/studio-ide/develop-in-studio#get-started-with-the-cloud-ide).
- Your production and development [environments](/docs/dbt-cloud-environments) are on <Constant name="dbt" />’s ‘Latest’ [release track](/docs/dbt-versions/cloud-release-tracks) or a supported dbt version.
- Use a supported data platform: Snowflake, BigQuery, Databricks, Redshift, or Postgres.
	- Single sign-on (SSO) for development user accounts is supported. Deployment environments will be queried leveraging the user's development credentials.
- (Optional) &mdash; To query [<Constant name="semantic_layer" />](/docs/use-dbt-semantic-layer/dbt-sl) metrics from the <Constant name="insights" />, you must also:
  - [Configure](/docs/use-dbt-semantic-layer/setup-sl) the <Constant name="semantic_layer" /> for your dbt project.
  - Have a successful job run in the environment where you configured the <Constant name="semantic_layer" />. 
- (Optional) To enable [Language Server Protocol (LSP) features](/docs/explore/navigate-dbt-insights#lsp-features-in-dbt-insights) in <Constant name="insights" /> and run your compilations on the <Constant name="fusion_engine" />, set your development environment to use the **Latest Fusion** dbt version.
