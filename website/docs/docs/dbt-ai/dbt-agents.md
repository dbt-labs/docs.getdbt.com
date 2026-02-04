---
title: "dbt Agents overview"
id: "dbt-agents"
description: "Learn about the AI agents available in dbt to automate and accelerate analytics workflows"
sidebar_label: "dbt Agents overview"
tags: [AI, Agents]
---

# dbt Agents overview <Lifecycle status="beta,managed,managed_plus"/>

[dbt Agents](https://www.getdbt.com/product/dbt-agents) are a suite of native AI agents that turn structured dbt context into auditable actions. These agents help you build, manage, and consume governed data at scale by bringing intelligence to every step of the analytics development lifecycle. 

Agents are currently available on dbt [Enterprise-tier plans](https://www.getdbt.com/pricing).

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

dbt offers several specialized agents, each designed for specific workflows in the analytics lifecycle.

Most agents are currently in beta or on the waitlist &mdash; [join the waitlist](https://www.getdbt.com/contact) to get early access.

#### Analyst agent <Lifecycle status="beta"/>

Use <Constant name="copilot" /> to analyze your data and get contextualized results in real time by asking natural language questions to the [<Constant name="query_page" />](/docs/explore/dbt-insights) [Analyst agent](/docs/dbt-ai/analyst-agent). 

Chat with your data, get accurate answers powered by the [dbt Semantic Layer](/docs/use-dbt-semantic-layer/dbt-sl). That means consistent, explainable results with transparent SQL, lineage, and policies.

The Analyst agent is a beta feature. Enable beta features under **Account settings** > **Personal profile** > **Experimental features**. For more information, see [Preview new dbt platform features](/docs/dbt-versions/experimental-features). 

#### Discovery agent <Lifecycle status="private_beta"/>

Find the right, approved dataset fast in <Constant name="explorer" />. The Discovery agent surfaces definitions, freshness, tests, owners, and lineage right where you work.

To request access to the Discovery agent, contact your account manager.

#### Observability agent <Lifecycle status="Waitlist"/>

The Observability agent in the <Constant name="dbt_platform" />'s orchestrator helps you monitor jobs, pinpoint likely root causes, and cut resolution time. It's designed to reduce noise and cuts down on investigation and debugging time &mdash; no more digging through logs.

#### Developer agent <Lifecycle status="Waitlist"/>

The Developer agent helps you describe the data question or product you want; the agent writes or refactors models, validates with <Constant name="fusion" />, and runs against your warehouse with full context. 

It helps you understand model logic, predict downstream impact, flag duplicate logic, and validate changes before merge. It runs directly in VS Code or <Constant name="cloud_ide" />, powered by dbt's context, so every change can be shipped quickly and safely.

#### dbt MCP server

Build your own custom agents and copilots with the local or remote dbt MCP server. The [Model Context Protocol (MCP)](/docs/dbt-ai/about-mcp) makes dbt's structured context available to any AI system.

## Related docs

- [About dbt AI and intelligence](/docs/dbt-ai/about-dbt-ai)
- [dbt Copilot](/docs/cloud/dbt-copilot)
- [dbt MCP server](/docs/dbt-ai/about-mcp)
- [dbt Semantic Layer](/docs/use-dbt-semantic-layer/dbt-sl)
- [dbt Insights](/docs/explore/dbt-insights)
