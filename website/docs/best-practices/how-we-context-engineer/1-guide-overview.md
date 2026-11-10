---
title: "How to do context engineering"
id: 1-guide-overview
description: Learn how to model the data AI agents read, and why it's the next job for analytics engineers.
displayText: How to do context engineering
hoverSnippet: Learn how we model the data AI agents read.
---

import ContextEngineeringEvolving from '/snippets/_context-engineering-evolving.md';

For a decade, we've modelled data for one reader: the dashboard. And every model, test, and metric existed so a person could look at a number and trust it.

That worked for a bit but a metric is thousands of rows squashed into something you can read at a glance, and you can't un-squash it. Every number on a dashboard sets off the same three questions (give or take): which ones moved and why? and what do we do about it? Since dashboards can't answer any of them, they usually become a ticket in the data team's queue.

The answer always existed except it was sitting in your warehouse, or could easily land there: call transcripts, support tickets, CRM notes, contracts, emails, etc. But historically, it's not something you really modelled, mostly because there's no bar chart (or `gasp: pie chart`) for a call transcript.

AI agents are new readers that can now use that detail, but they can only be as good as what they get. Context engineering is the practice of modeling data for that new reader, with the same discipline you already apply to metrics: staging, tests, docs, and one governed DAG.

<ContextEngineeringEvolving />

## What you'll learn

Using the [`dbt_context_engineering` package](https://github.com/dbt-labs/dbt-context-engineering), you'll hopefully learn how to turn a pile of raw text into context an agent can search, cite, and trust. The package gives you the building blocks: chunk your text, embed it, search it, label it, test it, and keep an eye on cost. 

We also use the [`jaffle-logistics`](https://github.com/dbt-labs/jaffle-logistics) project which demonstrates how the building blocks work together. The patterns are tool-agnostic, and patterns still being hardened carry a <Lifecycle status="beta" /> pill. Make sure you keep your own conventions if they fit your team better. 

Each recommendation comes with an example and a _why_, so you can decide when to deviate.

The following diagram explains the entire concept: text is split into chunks, each chunk becomes numbers that capture its meaning, and a question finds the chunks closest to it. The numbers and chunks in the diagram are made up and simplified: embeddings for reals have hundreds of dimensions, not two.

<Lightbox src="/img/best-practices/context-engineering/pipeline.svg" width="100%" title="A call transcript is chunked, embedded as numbers, and placed on a map where similar meanings sit close together. A question lands on the same map, and the closest chunks come back with a score and a source." />

In this guide, a **context model** is a dbt model that prepares text for agents: it chunks, embeds, labels, or combines it. An **LLM** or **embedding model** is the model your warehouse calls from those context models.

## What's in the guide

This guide covers the following:

1. [Get started](/best-practices/how-we-context-engineer/2-get-started): Chunk, embed, and search your text in three steps.
2. [Prepare your text](/best-practices/how-we-context-engineer/3-prepare-your-text): Break raw text into pieces an agent can retrieve, and attach source details so every piece can cite where it came from.
3. [Embed and retrieve](/best-practices/how-we-context-engineer/4-embed-and-retrieve): Make text searchable by meaning, search across sources, and keep vectors fresh.
4. [Enrich with AI](/best-practices/how-we-context-engineer/5-enrich-with-ai): Label each piece so search gets precise, with prompts managed as versioned code.
5. [Keep context trustworthy](/best-practices/how-we-context-engineer/6-keep-context-trustworthy): Test AI output the way you test any other dbt model, and keep lineage and citations intact.
6. [Control cost](/best-practices/how-we-context-engineer/7-control-cost): Build in limits and a record of what each run spent.
7. [Pair context with the semantic layer](/best-practices/how-we-context-engineer/8-pair-with-the-semantic-layer): See how context and metrics fit in one project, and how an agent uses both.
8. [Glossary](/best-practices/how-we-context-engineer/9-glossary): Look up new terms, macros, and vars in one place.

## What is context?

Context is the information an AI agent reads to do its job. Good context is:

- Governed, which means someone owns it, and changes are reviewed
- Tested so you can prove it’s correct
- Traceable so every claim points back to the source it came from

So if you ask an agent a question, like _"Why were deliveries late for this account?"_, the answer you get will vary depending on how well your context is structured:

<SimpleTable>

| | Example of bad context | Example of good context |
|---|---|---|
| What the agent reads | One pasted blob: "…pattern of late deliveries. Reviewed with dispatch. Truck 14 slid on ice…" | Small pieces, each with an id, account, and source: `IR-9001::1`, "Truck slid on ice during the storm and missed the delivery window." |
| The answer | "Probably weather." No source, so you can't check it. | "Truck 14 slid on ice during the storm and missed its delivery window (`IR-9001::1`)" You can check it. |

</SimpleTable>

Context engineering not only structures data but also adds ownership, tests, and traceability, so that you and your end users can check where an agent’s answers come from instead of just believe it.

If you've built a dbt project, you already have most of the instincts:

<SimpleTable>

| In dbt you... | In context engineering you... |
|---------------|-------------------------------|
| Test models | Test that AI output is grounded in its source |
| Build incremental models | Refresh embeddings only when text or settings change |
| Build a conformed dimension | Build a knowledge base, one common shape for every source |

</SimpleTable>

## Context and the semantic layer

Use the semantic layer for your metrics and context for your unstructured and semi-structured data. Your metrics tell an agent _what_ happened. Context tells it _why_. They live in the same project and work side by side, and an agent uses both to answer one question. [Pair context with the semantic layer](/best-practices/how-we-context-engineer/8-pair-with-the-semantic-layer) shows how.

## What counts as unstructured data?

Anything that carries meaning but doesn't fit neatly in rows and columns, like support tickets, transcripts, call, etc. Context engineering is a new way to think about the data you already have, not one use case.

Our example project is Jaffle Logistics, a fictional logistics company whose customer story is scattered across roughly eight disconnected systems. Five of them go through the pipeline in the [`jaffle-logistics`](https://github.com/dbt-labs/jaffle-logistics) project, the reference implementation for the package. 

The question people keep asking is: _"What's driving late deliveries for this account?"_. But the answer isn't in any one system. Here are the five sources:

<SimpleTable>

| Source | What's hiding in it | What you'd do with it |
|--------|---------------------|-----------------------|
| Call transcripts | The reason a customer is unhappy, in their own words | Find what a customer actually raised on a call |
| Support tickets | Patterns in what's breaking, and for whom | Spot recurring problems for an account |
| CRM notes | Account history that never made it into a field | Check the health of an account before a renewal |
| Contracts | What you actually committed to | Look up what you promised a customer |
| Incident reports | What went wrong on the ground, and why | Trace late deliveries to a root cause |

</SimpleTable>

Emails, runbooks, and internal docs work the same way.

## Prerequisites

You need:

- <Constant name="core" /> 1.11 or later, or the <Constant name="fusion_engine" />
- The [`dbt_context_engineering` package](https://github.com/dbt-labs/dbt-context-engineering), version 0.2.0 or later. You add it to your `packages.yml` and run `dbt deps`. [Get started](/best-practices/how-we-context-engineer/2-get-started#use-it-in-your-own-project) shows how.
- A warehouse the package supports, which runs the AI calls with its own built-in AI:
  - Snowflake, using Cortex AI functions
  - Databricks, on Databricks Runtime 15.4 LTS or above (not Databricks SQL Classic)
  - BigQuery, using its built-in AI functions. Your normal dbt connection is enough. A separate connection for AI functions is optional.
  - Redshift, using Amazon Bedrock. You create the Bedrock functions once with the package's `create_bedrock_function` operation, which needs permission to create models, an IAM role that can call Bedrock, and Bedrock model access.
- Optionally, DuckDB, to run the parts that don't call AI without any credentials

On Redshift, structured output is best-effort, and there's no managed vector index or drift canary.

:::info New to some dbt basics? 
If you're new to dbt, we recommend you skim [SQL models](/docs/build/sql-models), [materializations](/docs/build/materializations), [incremental models](/docs/build/incremental-models), [data tests](/docs/build/data-tests), [hooks](/docs/build/hooks-operations), [project variables](/docs/build/project-variables), and [packages](/docs/build/packages) first. You don't need to be an expert.

If you're unsure on some context engineering terms, check out the [glossary](/best-practices/how-we-context-engineer/9-glossary).
:::


## What's next

Ready to try it? Head to [Get started](/best-practices/how-we-context-engineer/2-get-started). **Hope** it's smooth rowing from here 🚣‍♀️
