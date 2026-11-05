---
title: "How to do context engineering"
id: 1-guide-overview
description: Learn how to model the data AI agents read, and why it's the next job for analytics engineers.
displayText: How to do context engineering
hoverSnippet: Learn how we model the data AI agents read.
---

For a decade, we've modelled data for one reader: the dashboard. And every model, test, and metric existed so a person could look at a number and trust it.

That worked for a bit but a metric is thousands of rows squashed into something you can read at a glance, and you can't un-squash it. Every number on a dashboard sets off the same three questions (give or take): which ones moved and why? and what do we do about it? Since dashboards can't answer any of them, they usually become a ticket in the data team's queue.

That always existed except it was sitting in your warehouse, or could easily land there: call transcripts, support tickets, CRM notes, contracts, emails, etc. It's not something you really modelled, mostly because there's no bar (or `gasp: pie chart`) chart for a call transcript.

<!-- MEME: pie chart of a call transcript -->

AI agents are the first readers that can use that detail. But they can only be as good as what they get. Context engineering is the practice of modeling data for that new reader, with the same discipline you already apply to metrics: staging, tests, docs, and one governed DAG.

## What you'll learn

You'll walk away able to turn a pile of raw text into context an agent can search, cite, and trust. Each recommendation comes with an example and a _why_, so you can decide when to deviate.

Here's the whole idea in one picture. Text is split into chunks, each chunk becomes numbers that capture its meaning, and a question finds the chunks closest to it. The numbers and chunks are made up, and the map is simplified: real embeddings have hundreds of dimensions, not two.

<Lightbox src="/img/best-practices/context-engineering/pipeline.svg" width="100%" title="A call transcript is chunked, embedded as numbers, and placed on a map where similar meanings sit close together. A question lands on the same map, and the closest chunks come back with a score and a source." />

The [`dbt_context_engineering` package](https://github.com/dbt-labs/dbt-context-engineering) gives you the building blocks: chunk your text, embed it, search it, label it, test it, and keep an eye on cost. The [`jaffle-logistics`](https://github.com/dbt-labs/jaffle-logistics) project shows them working together. The patterns are tool-agnostic, and patterns still being hardened carry a <Lifecycle status="beta" /> pill. Keep your own conventions if they fit your team better. Just write them down and stay consistent.

## What is context?

Context is the information an AI agent reads to do its job. Good context is:

- Governed, which means someone owns it, and changes are reviewed
- Tested so you can prove it’s correct &mdash; and our teammate Hope can continue rowing 🚣‍♀️
- Traceable so every claim points back to the source it came from

## Context and the semantic layer

Use the semantic layer for your metrics and context for your unstructured and semi-structured data. They work side by side:

<SimpleTable>

| Layer | What it holds | Example question |
|-------|---------------|------------------|
| Semantic layer | Your metrics and how they're defined | "What was on-time delivery last quarter?" |
| Context | Your unstructured and semi-structured data, modeled so agents can find and cite it | "Why did on-time delivery slip, and which accounts drove it?" |
</SimpleTable>

Your metrics tell an agent _what_ happened. Context tells it _why_. Agents discover both through [Agents Schema](https://github.com/dbt-labs/agents_schema), a standard `AGENTS` schema in your warehouse.

This guide covers _modeling_ context, not serving it. The package isn't an agent, an MCP server, or a serving layer. It makes the context those systems read.

## What counts as unstructured data?

Anything that carries meaning but doesn't fit neatly in rows and columns. If you only picture call centers, you're thinking too small. Context engineering is a new way to think about the data you already have, not one use case.

Our example project is Jaffle Logistics, a fictional logistics company whose customer story is scattered across roughly eight disconnected systems. Five of them go through the pipeline in the [`jaffle-logistics`](https://github.com/dbt-labs/jaffle-logistics) project, the reference implementation for the package. The question we keep asking: _"What's driving late deliveries for this account?"_ The answer isn't in any one system. Here are the five sources:

<SimpleTable>

| Source | What's hiding in it | What you'd do with it |
|--------|---------------------|-----------------------|
| Call transcripts | The reason a customer is unhappy, in their own words | Find what a customer actually raised on a call |
| Support tickets | Patterns in what's breaking, and for whom | Spot recurring problems for one account |
| CRM notes | Account history that never made it into a field | Check the health of an account before a renewal |
| Contracts | What you actually committed to | Look up what you promised a customer |
| Incident reports | What went wrong on the ground, and why | Trace late deliveries to a root cause |

</SimpleTable>

Emails, runbooks, and internal docs work the same way.

## How context engineering maps to what you know

You already have most of the instincts:

<SimpleTable>

| In dbt you... | In context engineering you... |
|---------------|-------------------------------|
| Test models | Test that AI output is grounded in its source |
| Build incremental models | Refresh embeddings only when text or settings change |
| Build a conformed dimension | Build a knowledge base, one common shape for every source |

</SimpleTable>

## What you need

- <Constant name="core" /> version 1.11 or later, or the <Constant name="fusion_engine" />
- A warehouse: Snowflake, Databricks, BigQuery, or Redshift
- Optionally, DuckDB for credential-free local runs of the parts that don't call AI

On Redshift, AI runs through Amazon Bedrock. Structured output is best-effort, there's no managed vector index, and the drift canary isn't supported.

New to some dbt basics? Skim [SQL models](/docs/build/sql-models), [materializations](/docs/build/materializations), [incremental models](/docs/build/incremental-models), [data tests](/docs/build/data-tests), [hooks](/docs/build/hooks-operations), [project variables](/docs/build/project-variables), and [packages](/docs/build/packages) first. You don't need to be an expert. Stuck on a context engineering term? Check the [glossary](/best-practices/how-we-context-engineer/8-glossary).

## What's in the guide

Context moves through a pipeline, and the guide follows it:

1. **Get started.** Chunk, embed, and search your text in three steps.
2. **Prepare your text.** Break raw text into pieces an agent can retrieve, and attach source details so every piece can cite where it came from.
3. **Embed and retrieve.** Make text searchable by meaning, search across sources, and keep vectors fresh.
4. **Enrich with AI.** Label each piece so search gets precise, with prompts managed as versioned code.
5. **Keep context trustworthy.** Test AI output the way you test any other model, and keep lineage and citations intact.
6. **Control cost.** Build in limits and a record of what each run spent.

Three ideas show up on every page: context is modeled, not dumped; lineage is never optional; and testing applies to AI output too.

## What's next

Ready to try it? Head to [Get started](/best-practices/how-we-context-engineer/2-get-started).
