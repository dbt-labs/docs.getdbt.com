---
title: "Analyst agent (self-service)"
id: "agents-self-service"
description: "Chat with your data using the Analyst agent powered by the dbt Semantic Layer"
sidebar_label: "Analyst agent"
tags: [AI, Agents, Semantic Layer]
---

# Analyst agent (self-service) <Lifecycle status="private_beta,managed,managed_plus"/>

The Analyst agent lets you chat with your data and get accurate answers powered by the [dbt Semantic Layer](/docs/use-dbt-semantic-layer/dbt-sl). Unlike generic AI chat interfaces, the Analyst agent provides consistent, explainable results with transparent SQL, lineage, and data policies.

:::info Private beta
The Analyst agent is currently in private beta. [Book a demo](https://www.getdbt.com/product/dbt-agents) to learn more and get access.
:::

## Prerequisites 

- Have access to [dbt Insights](/docs/explore/dbt-insights)
- Be on a <Constant name="dbt_platform" /> [Enterprise-tier](https://www.getdbt.com/pricing) plan &mdash; [book a demo](https://www.getdbt.com/contact) to learn more about <Constant name="query_page" />.
- Available on all [tenant](/docs/cloud/about-cloud/tenancy) configurations. 
- Have a <Constant name="cloud" /> [developer license](/docs/cloud/manage-access/seats-and-users) with access to <Constant name="query_page" />.
- Configured [developer credentials](/docs/cloud/studio-ide/develop-in-studio#get-started-with-the-cloud-ide).
- Your production and development [environments](/docs/dbt-cloud-environments) are on <Constant name="cloud" />’s ‘Latest’ [release track](/docs/dbt-versions/cloud-release-tracks) or a supported dbt version.
- Use a supported data platform: Snowflake, BigQuery, Databricks, Redshift, or Postgres.
	- Single sign-on (SSO) for development user accounts is supported. Deployment environments will be queried leveraging the user's development credentials.
- (Optional) &mdash; To query [<Constant name="semantic_layer" />](/docs/use-dbt-semantic-layer/dbt-sl) metrics from the <Constant name="query_page" />, you must also:
  - [Configure](/docs/use-dbt-semantic-layer/setup-sl) the <Constant name="semantic_layer" /> for your dbt project.
  - Have a successful job run in the environment where you configured the <Constant name="semantic_layer" />. 
- (Optional) To enable [Language Server Protocol (LSP) features](/docs/explore/navigate-dbt-insights#lsp-features-in-dbt-insights) in <Constant name="query_page" /> and run your compilations on the <Constant name="fusion_engine" />, set your development environment to use the **Latest Fusion** dbt version.

import AnalystAgentsCopilot from '/snippets/_analyst_agents-copilot.md';

<AnalystAgentsCopilot/>
