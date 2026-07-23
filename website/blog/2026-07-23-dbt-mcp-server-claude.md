---
title: "The dbt MCP server comes to Claude: governed context, one sign-in away"
description: "The governed definitions you build in dbt now flow directly into the workflows where the work actually happens."
slug: dbt-mcp-server-claude
authors: [alex_noonan]
tags: [ai, data ecosystem]
hide_table_of_contents: false
date: 2026-07-23
is_featured: true
---

When we open-sourced the dbt MCP server in [April 2025](/blog/introducing-dbt-mcp-server), it was an experimental, locally hosted project with a clear thesis behind it: structured data is going to be deeply integrated into AI workflows, and dbt is the layer that provides the governed context those workflows run on. [Anthropic](https://claude.com/blog/how-anthropic-enables-self-service-data-analytics-with-claude) has helped validate our thesis. Naturally, it made sense to have a cloud-hosted version with remote OAuth, so you can use it with whatever AI tool you are most comfortable with.

The remote dbt MCP server now runs inside the <Constant name="dbt_platform" />, and you can connect it to Claude in a minute or two by signing in and completing the authentication flow. You add dbt as a connector, approve the access you want, and Claude gains access to your governed data and rich dbt metadata.

This post walks through what the remote server brings to Claude, the types of workflows it fits into for both people and agents, and how the tools compose once they share a conversation.

<!-- truncate -->

## The full feature set at a glance

The server exposes a set of tools that operate on top of your dbt project. You ask questions in natural language, and Claude selects the right tool for each request. Here are the tools available today. For the complete list, refer to the [available tools documentation](/docs/dbt-ai/mcp-available-tools?version=2.0).

| Capability | What you can ask for | Representative tools |
| ----- | ----- | ----- |
| Discovery and lineage | What models exist, how they connect, what a model contains, and whether it is healthy | `get_all_models`, `get_model_details`, `get_lineage`, `get_model_health` |
| Governed metrics | Business questions answered from your certified Semantic Layer definitions | `list_metrics`, `get_dimensions`, `query_metrics` |
| Flexible SQL | Exploratory queries generated and run with full awareness of your models | `text_to_sql`, `execute_sql` |
| Operations | Job run history, failure details, and retries through the Administrative API | `list_jobs_runs`, `get_job_run_error`, `retry_job_run` |
| Column lineage | Dependencies traced to the individual column with the <Constant name="fusion_engine" /> | `fusion.get_column_lineage` |
| Product docs | Answers to dbt questions pulled from the official documentation | `search_product_docs`, `get_product_doc_pages` |

The [dbt Semantic Layer](/docs/use-dbt-semantic-layer/dbt-sl) is the anchor of that list and has the greatest potential to unlock value for nontechnical stakeholders. Your metrics are defined explicitly, so when Claude answers a question about revenue or active users, it returns the trusted number. Everything else builds trustworthy context around that governed core, and each tool serves a person asking a question as readily as an agent taking an action.

This quick demo shows how I use the dbt MCP server to understand the capabilities and current state of my data, then answer questions using that context.

<div style={{ position: 'relative', maxWidth: '960px', margin: '1.5rem auto', paddingBottom: '56.25%', height: 0, overflow: 'hidden' }}>
  <iframe
    src="https://www.youtube.com/embed/WjlnzTDui2g"
    title="Demo of the dbt MCP server in Claude"
    loading="lazy"
    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    referrerPolicy="strict-origin-when-cross-origin"
    allowFullScreen
  />
</div>

## Composition of tools

<Lightbox
  src="/img/blog/2026-07-23-dbt-mcp-server-claude/tool-time-workflows.jpg"
  width="85%"
  alt="Tool Time hosts Tim Taylor and Al Borland pointing toward the show's logo"
  title="The dbt MCP server lets Claude combine governed data with the other tools in your workflow."
/>

Almost every process benefits from a trustworthy answer to "What is actually happening in the business?" A campaign plan needs acquisition numbers. A goal needs a baseline. A weekly update needs last week's actuals. Going back to the dashboard is one option, but that context switch is another opportunity to get distracted and takes you out of the decision loop.

Once that governed context from your dbt project is available inside Claude, it becomes the backbone your other connectors build on. Internal knowledge, so-called “context,” project management software, and observability tooling all get sharper when the data beside them is trusted. dbt supplies the keystone; the rest of your work composes around it.

## dbt context in your everyday workflows

The real payoff shows up when you bring dbt's structured data and its context into the workflows you already run. Here are three examples that use dbt project context with other tools.

### 1. Marketing campaign design

In a past life, I was a marketer. As a budding data analyst, I wanted to make as many data-driven decisions as possible. However, the limitations of the tools at the time made proper analysis and planning prohibitive, so I had to rely on taste and experience. Now, you can bring your relevant CRM, paid ads, organic social, and webinar data into a warehouse with governed metrics. You can combine your context, taste, and experience with an analyst that has a command of the data. Trying to weave a story across several dashboards that only go a few levels deep is not a great use of time. Instead, you can get the data you need at the right depth while also focusing on messaging, reaching the audience, and experimentation to drive results.

### 2. Goal setting and periodic reviews

<Lightbox
  src="/img/blog/2026-07-23-dbt-mcp-server-claude/projections-and-goals.jpeg"
  width="85%"
  alt="A character explaining that projections are hopes and dreams derived from reality"
  title="Ground projections, goals, and periodic reviews in governed metrics."
/>

Targets and recurring updates lean on the same governed metrics, which makes them a natural fit for the server. Set quarterly goals anchored to Semantic Layer baselines, and record them in Google Sheets or Notion. Then, on your preferred cadence, have Claude generate a business review that measures actuals against those targets and post it to a Slack channel. The real unlock is being able to interrogate the numbers and riff with Claude on possible interpretations and strategies. You arrive at the meeting informed, prepared for follow-up questions, and ready with solutions.

### 3. Data platform management

This one is closest to home for analytics engineers. We spend most of our days maintaining the platform, not necessarily building net-new models, and AI is most useful when combined with other data tooling. Use the dbt discovery, model health, lineage, and Administrative API tools alongside an observability connector like Datadog and an incident tool like incident.io. When a job fails or a dashboard looks off, Claude correlates the dbt run error and failing test with infrastructure signals, uses lineage to scope the blast radius, and drafts an incident summary in one place.

_One more worth trying: safe change management._ Before you rename or drop a column, chain `fusion.get_column_lineage` and `get_model_details` with your issue tracker in Linear, Jira, or GitHub. Claude traces every downstream model, exposure, and dashboard that depends on the field, then opens tickets or creates a review checklist so the change ships with its full blast radius mapped. I would be remiss if I didn't mention that this is a perfect [Wizard](/docs/platform/wizard-overview) use case.

## Getting started

For detailed setup guidance, refer to [Integrate with Claude](/docs/dbt-ai/integrate-mcp-claude?version=2.0&name=Fusion).

1. In the <Constant name="dbt_platform" />, copy your MCP endpoint URL from **Account settings** → **Access URLs** → **MCP Endpoint URL**.
2. In Claude Desktop or the Claude web app, open the connector settings, add a custom connector, paste the URL, and click **Connect**. Claude sends you to dbt to sign in and shows a consent screen where you approve the scopes you want to grant.
3. In Claude Code, add the server to `.mcp.json` at your project root so your whole team inherits the setup:

   ```json
   {
     "mcpServers": {
       "dbt": {
         "type": "http",
         "url": "https://YOUR_DBT_HOST_URL/api/ai/v1/mcp/"
       }
     }
   }
   ```

4. Ask a Semantic Layer question like "What was total revenue for the last 30 days, by region?" to confirm the connection.

To use OAuth, you need an account with a static subdomain, which is the `abc123` in `abc123.us1.dbt.com`. Availability depends on your plan as remote OAuth rolls out across tiers. Token-based authentication covers clients that don't support OAuth yet. The consent screen is worth reading closely because scopes let you grant Claude exactly the access a workflow needs.

## Where this is heading

In April 2025, we said data teams would increasingly focus on building the rich, governed context that feeds AI systems, and that dbt would become the control plane for that context. The remote server, authenticated and native in Claude, is a step toward turning that vision into reality. The governed definitions you build in dbt now flow directly into everyday workflows, from a marketing brief to an incident review, and both people and agents operate on the same trusted foundation.

This is still early, and the best patterns will come from the community. Grab your MCP endpoint URL, add dbt as a custom connector in Claude, and start with a Semantic Layer question. See how much the tools can accomplish together.

Join the conversation in `#tools-dbt-mcp` in the dbt community Slack.
