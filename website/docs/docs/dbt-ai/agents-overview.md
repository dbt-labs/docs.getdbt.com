---
title: "dbt Agents overview"
id: "agents-overview"
description: "Learn about the AI agents available in dbt to automate and accelerate analytics workflows"
sidebar_label: "dbt Agents overview"
tags: [AI, Agents]
---

# dbt Agents overview <Lifecycle status="private_beta"/>

dbt Agents are a suite of native AI agents that turn structured dbt context into auditable actions. These agents help you build, manage, and consume governed data at scale by bringing intelligence to every step of the analytics development lifecycle.

## Available agents

dbt offers several specialized agents, each designed for specific workflows in the analytics lifecycle:

### Analyst agent <Lifecycle status="private_beta"/>

Chat with your data and get accurate answers powered by the [dbt Semantic Layer](/docs/use-dbt-semantic-layer/dbt-sl). The Analyst agent provides consistent, explainable results with transparent SQL, lineage, and policies.

**Use cases:**
- Ask natural language questions about your data
- Get answers grounded in your governed metrics and semantic models
- Understand the SQL and lineage behind every answer

**Availability:** Private beta. [Book a demo](https://www.getdbt.com/product/dbt-agents) to learn more.

### Discovery agent <Lifecycle status="waitlist"/>

Find the right, approved dataset fast. The Discovery agent surfaces definitions, freshness, tests, owners, and lineage right where you work.

**Use cases:**
- Quickly locate trusted datasets across your data platform
- Understand data quality, freshness, and ownership before using data
- See full context including tests, documentation, and lineage

**Availability:** Private beta. [Join the waitlist](https://www.getdbt.com/product/dbt-agents) to get early access.

### Observability agent <Lifecycle status="waitlist"/>

Autonomously and continuously monitor pipelines, flag likely root causes in context, and guide fixes. Results in faster mean time to resolution, higher reliability, and streamlined ticket queues.

**Use cases:**
- Automatically detect data quality issues and pipeline failures
- Get root cause analysis with full context from dbt metadata
- Reduce time spent triaging and debugging data issues

**Availability:** Waitlist. [Join the waitlist](https://www.getdbt.com/product/dbt-agents) to be notified when available.

### Developer agent <Lifecycle status="waitlist"/>

Describe the data question or product you want; the agent writes or refactors models, validates with dbt Fusion, and runs against your warehouse with full context.

**Use cases:**
- Generate new dbt models from natural language descriptions
- Refactor existing models for better performance or readability
- Stay in flow with AI-assisted development

**Availability:** Now GA. Available in supported development environments.

### dbt MCP server 

Build your own custom agents and copilots with the local or remote dbt MCP server. The [Model Context Protocol (MCP)](/docs/dbt-ai/about-mcp) makes dbt's structured context available to any AI system.

**Use cases:**
- Build custom agents tailored to your organization's workflows
- Integrate dbt context into existing AI tools and platforms
- Create specialized copilots for specific data tasks

**Availability:** Now GA. [Learn more about dbt MCP](/docs/dbt-ai/about-mcp).

## How dbt Agents work

dbt Agents leverage your dbt project's structured context:

- **Semantic Layer** - Metrics, dimensions, and business logic
- **Metadata** - Lineage, tests, documentation, and ownership
- **Governance** - Access policies, data quality rules, and contracts

This context ensures agents provide accurate, auditable, and governed results rather than hallucinated or inconsistent answers.

## Key benefits

- **Faster development** - Engineers and analysts ship data products faster with AI assistance
- **Better decisions** - Business users get accurate answers grounded in governed data
- **Auditability** - Every agent action includes transparent SQL, lineage, and policies
- **Scalability** - Automate routine tasks and let teams focus on high-value work

## Related documentation

- [About dbt AI and intelligence](/docs/dbt-ai/about-dbt-ai-and-intelligence)
- [dbt Copilot](/docs/cloud/dbt-copilot)
- [dbt MCP server](/docs/dbt-ai/about-mcp)
- [dbt Semantic Layer](/docs/use-dbt-semantic-layer/dbt-sl)
