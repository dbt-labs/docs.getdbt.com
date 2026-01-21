---
title: "Analyst agent (self-service)"
id: "agents-self-service"
description: "Chat with your data using the Analyst agent powered by the dbt Semantic Layer"
sidebar_label: "Analyst agent"
tags: [AI, Agents, Semantic Layer]
---

# Analyst agent (self-service) <Lifecycle status="private_beta"/>

The Analyst agent lets you chat with your data and get accurate answers powered by the [dbt Semantic Layer](/docs/use-dbt-semantic-layer/dbt-sl). Unlike generic AI chat interfaces, the Analyst agent provides consistent, explainable results with transparent SQL, lineage, and data policies.

:::info Private beta
The Analyst agent is currently in private beta. [Book a demo](https://www.getdbt.com/product/dbt-agents) to learn more and get access.
:::

## How it works

The Analyst agent combines natural language processing with your dbt Semantic Layer to:

1. **Understand your question** - Interpret business questions in plain language
2. **Query governed metrics** - Access only the metrics, dimensions, and data you have permission to see
3. **Generate transparent SQL** - Show the exact SQL query used to answer your question
4. **Provide context** - Include lineage, definitions, and data policies with every answer

This ensures answers are accurate, consistent, and auditable rather than hallucinated or inconsistent.

## Key features

### Governed data access

The Analyst agent respects your organization's data governance:
- Only queries metrics and dimensions defined in your Semantic Layer
- Honors access policies and permissions
- Provides consistent definitions across all users

### Transparent results

Every answer includes full context:
- **SQL query** - See exactly what query was run
- **Lineage** - Understand which data sources and models were used
- **Definitions** - View metric and dimension definitions
- **Policies** - See any data governance rules applied

### Natural language interface

Ask questions the way you naturally think about your business:
- "What was our revenue last quarter?"
- "Show me top 10 customers by total orders"
- "How many active users do we have this month compared to last month?"

## Use cases

The Analyst agent is designed for:

**Business analysts** - Get quick answers to ad-hoc questions without writing SQL

**Data consumers** - Explore data with confidence that results are governed and accurate

**Executives** - Access trusted metrics for decision-making without data team bottlenecks

**Analytics engineers** - Validate semantic model definitions and metric logic

## Prerequisites

To use the Analyst agent, you need:

- **dbt Semantic Layer** - Your organization must have the dbt Semantic Layer configured with semantic models and metrics
- **Access permissions** - You must have appropriate permissions to query the Semantic Layer
- **Private beta access** - The Analyst agent is currently in private beta

## Benefits

### Speed

- Get answers to business questions in seconds
- No waiting for data team to write queries
- Explore data iteratively without technical barriers

### Accuracy

- Answers grounded in governed metrics from the Semantic Layer
- Consistent definitions across all users and tools
- No risk of hallucinated or incorrect results

### Transparency

- See the SQL behind every answer
- Understand data lineage and sources
- Verify governance policies are applied

### Self-service

- Empower business users to answer their own questions
- Reduce bottlenecks on data teams
- Enable faster decision-making across the organization

## Comparison with other tools

| Feature | Analyst agent | Generic AI chat | Traditional BI |
| ------- | ------------- | --------------- | -------------- |
| Natural language queries | Yes | Yes | Limited |
| Governed metrics | Yes | No | Yes |
| Transparent SQL | Yes | No | Yes |
| Data lineage | Yes | No | Sometimes |
| Self-service access | Yes | Yes | Limited |
| Consistent definitions | Yes | No | Yes |
| Hallucination risk | No | Yes | No |

## Getting started

The Analyst agent is currently in private beta. To get access:

1. **Book a demo** - [Schedule time](https://www.getdbt.com/product/dbt-agents) with the dbt Labs team
2. **Configure Semantic Layer** - Ensure your dbt Semantic Layer is set up with semantic models and metrics
3. **Set up access policies** - Define appropriate data access and governance policies
4. **Start asking questions** - Begin chatting with your data through the Analyst agent interface

## Related documentation

- [dbt Semantic Layer](/docs/use-dbt-semantic-layer/dbt-sl)
- [Build your metrics](/docs/build/build-metrics-intro)
- [Semantic models](/docs/build/semantic-models)
- [dbt Agents overview](/docs/dbt-ai/agents-overview)
- [About dbt AI and intelligence](/docs/dbt-ai/about-dbt-ai-and-intelligence)

## FAQs

<FAQ path="AI/analyst-agent-semantic-layer" />
<FAQ path="AI/analyst-agent-accuracy" />
<FAQ path="AI/analyst-agent-access" />

## Support

For questions about the Analyst agent:

- **Private beta participants** - Contact your dbt Labs representative
- **Interested users** - [Book a demo](https://www.getdbt.com/product/dbt-agents) to learn more
- **General questions** - Visit the [dbt Community](https://www.getdbt.com/community/) or [Slack](https://www.getdbt.com/community/join-the-community/)
