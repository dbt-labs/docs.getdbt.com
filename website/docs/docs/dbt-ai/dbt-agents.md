---
title: "dbt Agents overview"
id: "dbt-agents"
description: "Learn about the AI agents available in dbt to automate and accelerate analytics workflows"
sidebar_label: "dbt Agents overview"
tags: [AI, Agents]
image: /img/docs/dbt-platform/copilot-agent.png
---

# dbt Agents overview <Lifecycle status="self_service,managed,managed_plus"/>

[dbt Agents](https://www.getdbt.com/product/dbt-agents), available on [Starter and dbt Enterprise-tier plans](https://www.getdbt.com/pricing), are a suite of native AI agents that turn structured dbt context into auditable actions. These agents help you build, manage, and consume governed data at scale by bringing intelligence to every step of the analytics development lifecycle. 

:::info 
Some dbt Agents are in preview or beta; others are coming soon. Enterprise customers can contact your account manager for access or changes. Starter plan customers can contact [dbt Labs Support](mailto:support@getdbt.com). 

See [available agents](#available-agents) to find out what's available.
:::

dbt Agents are built on top of dbt's structured context to provide accurate, auditable, and governed results:

- Semantic Layer &mdash; Metrics, dimensions, and business logic
- Metadata &mdash; Lineage, tests, documentation, and ownership
- Governance &mdash; Access policies, data quality rules, and contracts

Having dbt as the standard context layer for agentic analytics means that dbt Agents are built on top of this context to provide accurate results rather than hallucinated or inconsistent answers.

<div style={{display: 'flex', justifyContent: 'center', margin: '20px 0'}}>
<iframe width="560" height="315" src="https://www.youtube.com/embed/VMkRXWkEcKk?si=vPNG0T8w8q3g3ugT" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

## Key benefits

- Faster development &mdash; Engineers and analysts ship data products faster with AI assistance.
- Better decisions &mdash; Business users get accurate answers grounded in governed data.
- Auditability &mdash; Every agent action includes transparent SQL, lineage, and policies.
- Scalability &mdash; Routine tasks are automated so teams can focus on high-value work.

## Available agents
dbt offers several specialized agents, each designed for specific workflows in the analytics lifecycle to help you scale your data teams across the <Constant name="dbt_platform" />.

The following agents are available. Contact your account manager for early access to agents that are in beta or coming soon.

#### Analyst agent <Lifecycle status="beta,managed,managed_plus"/>

Use <Constant name="copilot" /> to analyze your data and get contextualized results in real time by asking natural language questions to the [<Constant name="insights" />](/docs/explore/dbt-insights) [Analyst agent](/docs/dbt-ai/analyst-agent). Available on Enterprise-tiered plans.

Chat with your data, get accurate answers powered by the [dbt Semantic Layer](/docs/use-dbt-semantic-layer/dbt-sl). That means consistent, explainable results with transparent SQL, lineage, and policies.

The Analyst agent is a beta feature. Enable beta features under **Account settings** > **Personal profile** > **Experimental features**. For more information, see [Preview new dbt platform features](/docs/dbt-versions/experimental-features). 

#### Developer agent <Lifecycle status="preview,self_service,managed,managed_plus"/>

The <Constant name="dev_agent" /> is the next evolution of <Constant name="copilot" /> in the <Constant name="studio_ide" />, purpose-built to streamline the developer experience. Describe the data product or change you want &mdash; the agent writes or refactors models, validates with <Constant name="fusion_engine" />, and runs against your warehouse with full context. Stay in flow in the [<Constant name="studio_ide" />](/docs/platform/studio-ide/develop-in-studio).

The agent always has access to the latest dbt-recommended guidance through [dbt Agent Skills](https://github.com/dbt-labs/dbt-agent-skills) &mdash; curated instructions and scripts managed by dbt Labs, available out of the box with no configuration required.

For setup instructions and available use cases, see [<Constant name="dev_agent" />](/docs/dbt-ai/developer-agent).

#### Discovery agent <Lifecycle status="private_beta"/>

Find the right, approved dataset fast in <Constant name="catalog" />. The Discovery agent surfaces definitions, freshness, tests, owners, and lineage right where you work.

To request access to the Discovery agent, contact your account manager.

#### Observability agent <Lifecycle status="Coming soon"/>

The Observability agent autonomously and continuously monitors pipelines, flags likely root causes in context, and guides fixes — resulting in faster mean time to resolution, higher reliability, and streamlined ticket queues. No more digging through logs.

#### dbt MCP server

Build your own custom agents and copilots with the local or remote dbt MCP server. The [Model Context Protocol (MCP)](/docs/dbt-ai/about-mcp) makes dbt's structured context available to any AI system.

## Related docs

- [About dbt AI and intelligence](/docs/dbt-ai/about-dbt-ai)
- [<Constant name="dev_agent" />](/docs/dbt-ai/developer-agent)
- [dbt Copilot](/docs/platform/dbt-copilot)
- [dbt MCP server](/docs/dbt-ai/about-mcp)
- [dbt Semantic Layer](/docs/use-dbt-semantic-layer/dbt-sl)
- [dbt Insights](/docs/explore/dbt-insights)
