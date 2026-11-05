---
title: "Get started"
id: 2-get-started
description: Get from raw text to a working search in three steps with the dbt_context_engineering package.
displayText: Get started
hoverSnippet: Chunk, embed, and search your text in three steps.
---

You don't need the whole guide to get value. Three steps take you from raw text to a working search:

| Step | What you do | Package macro | Where to learn more |
|------|-------------|---------------|---------------------|
| 1. Chunk | Break each text into pieces small enough to search | `chunk()` | [Prepare your text](/best-practices/how-we-context-engineer/3-prepare-your-text) |
| 2. Embed | Turn each chunk into a list of numbers that captures its meaning | `embed()` | [Embed and retrieve](/best-practices/how-we-context-engineer/4-embed-and-retrieve) |
| 3. Search | Find the chunks closest in meaning to a question | `vector_search()` | [Embed and retrieve](/best-practices/how-we-context-engineer/4-embed-and-retrieve) |

Everything after that makes the result better: labels for precision, tests for trust, and guards for cost.

Stuck on a term? Check the [glossary](/best-practices/how-we-context-engineer/8-glossary).

## Try it first, no credentials needed

The fastest way to see the pipeline is the `jaffle-logistics` project on DuckDB. It runs on your laptop and can't bill you, because the AI step is skipped by default.

1. Clone [`jaffle-logistics`](https://github.com/dbt-labs/jaffle-logistics). It needs <Constant name="core" /> 1.12 or later and the `dbt-duckdb` adapter.
2. Add a `jaffle-logistics` profile to your `profiles.yml` that points at DuckDB, as the project README shows.
3. Run `dbt deps`, then `dbt build`.

Then open `analyses/the_pattern/` in the project. It walks the whole pipeline in seven numbered queries: raw transcript, chunk, embed, knowledge base, raw search, classify, and search with classify.

:::caution
To see real embeddings and search results, point the project at Snowflake, Databricks, or BigQuery and set `ai_functions_enabled` to `true`. Those are real AI calls, and they bill. The [Control cost](/best-practices/how-we-context-engineer/7-control-cost) page shows how to keep that safe.
:::

## Use it in your own project

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

## What's next

You've got a working pipeline. Next, you'll learn why each piece is built the way it is, starting with [Prepare your text](/best-practices/how-we-context-engineer/3-prepare-your-text).
