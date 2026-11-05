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

The [`dbt_context_engineering` package](https://github.com/dbt-labs/dbt-context-engineering) gives you the building blocks: chunk your text, embed it, search it, label it, test it, and keep an eye on cost. The [`jaffle-logistics`](https://github.com/dbt-labs/jaffle-logistics) project shows them working together.

:::info
This is a young discipline, and this guide is a starting point. The patterns are tool-agnostic. Where an adapter behaves differently, we call it out in a note. Keep your own conventions if they fit your team better. Just write them down and stay consistent.
:::

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

Anything that carries meaning but doesn't fit neatly in rows and columns. If you only picture call centers, you're thinking too small. Context engineering is a new way to think about the data you already have, not one use case. Here are the five sources in our example project:

| Source | What's hiding in it | What you'd do with it |
|--------|---------------------|-----------------------|
| Call transcripts | The reason a customer is unhappy, in their own words | Find what a customer actually raised on a call |
| Support tickets | Patterns in what's breaking, and for whom | Spot recurring problems for one account |
| CRM notes | Account history that never made it into a field | Check the health of an account before a renewal |
| Contracts | What you actually committed to | Look up what you promised a customer |
| Incident reports | What went wrong on the ground, and why | Trace late deliveries to a root cause |

Emails, runbooks, and internal docs work the same way.

## How context engineering maps to what you know

You already have most of the instincts:

| In dbt you... | In context engineering you... |
|---------------|-------------------------------|
| Test models | Test that AI output is grounded in its source |
| Build incremental models | Refresh embeddings only when text or settings change |
| Build a conformed dimension | Build a knowledge base, one common shape for every source |

## What you need

- <Constant name="core" /> version 1.11 or later, or the <Constant name="fusion_engine" />
- A warehouse: Snowflake, Databricks, BigQuery, or Redshift
- Optionally, DuckDB for credential-free local runs of the parts that don't call AI

On Redshift, AI runs through Amazon Bedrock. Structured output is best-effort, there's no managed vector index, and the drift canary isn't supported.

### New to some of this?

The guide builds on a few dbt basics. If one of these is unfamiliar, skim its page first and come back. You don't need to be an expert in any of them:

- [SQL models](/docs/build/sql-models) and [materializations](/docs/build/materializations)
- [Incremental models](/docs/build/incremental-models)
- [Data tests](/docs/build/data-tests)
- [Hooks](/docs/build/hooks-operations), SQL that runs before or after a model
- [Project variables](/docs/build/project-variables) and [packages](/docs/build/packages)

Stuck on a context engineering term? Check the [glossary](#glossary).

## Start here: the minimum path

You don't need the whole guide to get value. Three steps take you from raw text to a working search:

| Step | What you do | Package macro | Where to learn more |
|------|-------------|---------------|---------------------|
| 1. Chunk | Break each text into pieces small enough to search | `chunk()` | [Prepare your text](/best-practices/how-we-context-engineer/2-prepare-your-text) |
| 2. Embed | Turn each chunk into a list of numbers that captures its meaning | `embed()` | [Embed and retrieve](/best-practices/how-we-context-engineer/3-embed-and-retrieve) |
| 3. Search | Find the chunks closest in meaning to a question | `vector_search()` | [Embed and retrieve](/best-practices/how-we-context-engineer/3-embed-and-retrieve) |

Everything after that makes the result better: labels for precision, tests for trust, and guards for cost.

### Try it first, no credentials needed

The fastest way to see the pipeline is the `jaffle-logistics` project on DuckDB. It runs on your laptop and can't bill you, because the AI step is skipped by default.

1. Clone [`jaffle-logistics`](https://github.com/dbt-labs/jaffle-logistics). It needs <Constant name="core" /> 1.12 or later and the `dbt-duckdb` adapter.
2. Add a `jaffle-logistics` profile to your `profiles.yml` that points at DuckDB, as the project README shows.
3. Run `dbt deps`, then `dbt build`.

Then open `analyses/the_pattern/` in the project. It walks the whole pipeline in seven numbered queries: raw transcript, chunk, embed, knowledge base, raw search, classify, and search with classify.

:::caution
To see real embeddings and search results, point the project at Snowflake, Databricks, or BigQuery and set `ai_functions_enabled` to `true`. Those are real AI calls, and they bill. The [Control cost](/best-practices/how-we-context-engineer/6-control-cost) page shows how to keep that safe.
:::

### Use it in your own project

Install the package in `packages.yml`, as `jaffle-logistics` does:

```yaml
packages:
  - package: dbt-labs/dbt_context_engineering
    version: [">=0.1.0", "<1.0.0"]
```

Set the variables the package reads in `dbt_project.yml`. AI functions are off by default, so nothing bills until you turn them on for a target:

```yaml
vars:
  ai_functions_enabled: false # set to true only for the target where you want to spend
  embedding_model: "snowflake-arctic-embed-m-v1.5" # example for Snowflake. Name your own model.
```

Then each step is one model. These snippets are trimmed down from `jaffle-logistics`, which adds hashing, incremental refresh, and cost hooks (we cover those later).

**1. Chunk** each text into pieces. Here, a call transcript's turns become chunks that never split a turn or mix two calls:

```sql
{{ config(materialized='table') }}

{{ dbt_context_engineering.chunk(
    relation=ref('int_transcript_turns'),
    id_column='turn_id',
    order_column='turn_index',
    text_column='turn_text',
    partition_column='transcript_id',
    label_column='speaker'
) }}
```

**2. Embed** each chunk. The guard in the pre-hook stops a run that's too big before it spends anything:

```sql
{{ config(
    materialized='table',
    pre_hook="{{ dbt_context_engineering.guard_batch(ref('chunk_transcripts'), 'chunk_text') }}"
) }}

select
    chunk_id,
    chunk_text,
    {{ dbt_context_engineering.embed('chunk_text') }} as embedding
from {{ ref('chunk_transcripts') }}
```

**3. Search** by embedding your question with the same model, then ranking every chunk by how close it is:

```sql
{{ config(materialized='table') }}

{{ dbt_context_engineering.vector_search(
    relation=ref('transcript_embeddings'),
    embedding_column='embedding',
    query_embedding=dbt_context_engineering.embed("'late deliveries and what is driving them'"),
    top_k=10,
    id_column='chunk_id',
    select_columns=['chunk_text']
) }}
```

You get the top 10 chunks, each with a similarity `score`. That's a working context pipeline. The rest of this guide explains why each piece is built the way it is.

## Example project

This guide uses a fictional logistics company called Jaffle Logistics. Its customer story is scattered across roughly eight disconnected systems. Five of them (the sources in the table above) go through the pipeline in `jaffle-logistics`, the reference implementation for the package.

The question we keep asking: _"What's driving late deliveries for this account?"_ The answer isn't in any one system, which is exactly why this makes a good example.

## Guide structure overview

Context moves through a pipeline, and the guide follows it:

1. **Prepare your text.** Break raw text into pieces an agent can retrieve without losing meaning, and attach the source details so every piece can cite where it came from.
2. **Embed and retrieve.** Turn text into searchable vectors, search across sources at once, and keep the vectors fresh.
3. **Enrich with AI.** Use a model to label each piece so search gets precise, with prompts managed as versioned code.
4. **Keep context trustworthy.** Test AI output the way you test any other model, and keep lineage and citations intact.
5. **Control cost.** AI calls aren't free to re-run, so build in limits and a record of what each run spent.

Three ideas show up on every page: context is modeled, not dumped; lineage is never optional; and testing applies to AI output too.

### Adapter notes

Every major warehouse exposes AI as SQL functions, but each names them differently. The adapter notes in this guide cover Snowflake, Databricks, and BigQuery. Patterns still being hardened carry a <Lifecycle status="beta" /> pill: free-form generation, typed extraction, and group-level reasoning.

| Operation | What it does | Snowflake | Databricks | BigQuery |
|-----------|--------------|-----------|------------|----------|
| Generate | Produces free-form text | `AI_COMPLETE` | `ai_query` | `AI.GENERATE` |
| Classify | Picks one label from a fixed set | `AI_CLASSIFY` | `ai_classify` | `AI.GENERATE` |
| Extract | Pulls typed fields out of text | `AI_COMPLETE` | `ai_query` | `AI.GENERATE` |
| Embed | Turns text into a vector | `AI_EMBED` | Serving endpoint | `AI.EMBED` |

## Glossary

| Term | What it means |
|------|---------------|
| Canary | A few frozen probe texts you re-embed on every build and compare to a reviewed baseline, to catch a model that quietly changed |
| Chunk | A piece of text small enough to embed and retrieve |
| Classification | Giving each chunk one label from a fixed set |
| Context window | How much text a model can read in one go |
| Cosine similarity | A score from 1.0 (same direction) to -1.0 (opposite) for how close two vectors are in meaning |
| Deferral | Letting a CI job read models from another environment, such as production, instead of rebuilding them. See [defer](/reference/node-selection/defer). |
| Embedding | A list of numbers that captures what a piece of text means |
| Enum | A fixed list of allowed values, such as the labels a classifier may return |
| Event sourcing | Recording a change by appending a new row instead of editing an old one |
| Golden set | A small, hand-labeled dataset of known-correct answers that you score AI output against |
| Hallucination | When a model states something, such as a quote or a fact, that isn't in the source |
| Hook | SQL that dbt runs before (pre-hook) or after (post-hook) a model builds |
| Knowledge base | One table where every source lands in the same shape, so one search covers all of them |
| Lineage | The trail from a piece of context back to the source row it came from |
| Precision and recall | Recall is whether search finds the right chunk at all. Precision is whether the right chunk ranks near the top. |
| Taxonomy | Your fixed list of labels for classification |
| Token | The sub-word piece a model reads and bills by, roughly four characters of English |
| Unit | The smallest piece of text you never split, such as a speaker turn or a sentence |
| Vector | The list of numbers an embedding is stored as. Only comparable to vectors from the same model. |
