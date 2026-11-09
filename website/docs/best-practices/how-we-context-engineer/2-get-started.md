---
title: "Get started"
id: 2-get-started
description: Get from raw text to a working search in three steps with the dbt_context_engineering package.
displayText: Get started
hoverSnippet: Chunk, embed, and search your text in three steps.
---

You don't need the whole guide to get value. Three steps take you from raw text to a working search:

<SimpleTable>

| Step | What you do | Package macro | Where to learn more |
|------|-------------|---------------|---------------------|
| 1. Chunk | Break each text into pieces small enough to search | `chunk()` | [Prepare your text](/best-practices/how-we-context-engineer/3-prepare-your-text) |
| 2. Embed | Turn each chunk into a list of numbers that captures its meaning | `embed()` | [Embed and retrieve](/best-practices/how-we-context-engineer/4-embed-and-retrieve) |
| 3. Search | Find the chunks closest in meaning to a question | `vector_search()` | [Embed and retrieve](/best-practices/how-we-context-engineer/4-embed-and-retrieve) |

</SimpleTable>

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

Add the package to a `packages.yml` file at the root of your dbt project, as `jaffle-logistics` does, then run `dbt deps`:

<File name="packages.yml">

```yaml
packages:
  - package: dbt-labs/dbt_context_engineering
    version: [">=0.2.0", "<1.0.0"]
```

</File>

This guide needs version 0.2.0 or later. Earlier versions are missing features that [Control cost](/best-practices/how-we-context-engineer/7-control-cost) uses.

Set the variables the package reads in `dbt_project.yml`. AI functions are off by default, so nothing bills until you turn them on for a target:

<File name="dbt_project.yml">

```yaml
vars:
  ai_functions_enabled: false # set to true only for the target where you want to spend
  embedding_model: "snowflake-arctic-embed-m-v1.5" # example for Snowflake. Name your own model.
```

</File>

Each step below is one dbt model: a plain `.sql` file in your `models/` folder. These snippets are trimmed down from `jaffle-logistics`, which adds hashing, incremental refresh, and cost hooks (we cover those later).

### What `chunk()` reads

`chunk()` needs a model with one row per piece of text, in order. For call transcripts, that's one row per speaker turn. The first snippet reads a model called `int_transcript_turns` with these columns. Swap in your own table and column names:

<SimpleTable>

| Column | What it holds |
|--------|---------------|
| `turn_id` | A unique id for each turn |
| `turn_index` | The turn's position in the call, so chunks keep their order |
| `transcript_id` | Which call the turn belongs to, so chunks never mix two calls |
| `speaker` | Who's talking |
| `turn_text` | What they said |

</SimpleTable>

### 1. Chunk

Break each text into pieces. Here, a call transcript's turns become chunks that never split a turn or mix two calls:

<File name="models/context/chunk_transcripts.sql">

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

</File>

### 2. Embed

Turn each chunk into numbers. The guard in the pre-hook stops a run that's too big before it spends anything:

<File name="models/context/transcript_embeddings.sql">

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

</File>

### 3. Search

Embed your question with the same model, then rank every chunk by how close it is:

<File name="models/context/search_transcripts.sql">

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

</File>

### 4. Run it

Build the search model and everything it depends on:

```bash
dbt build --select +search_transcripts --vars '{"ai_functions_enabled": true}'
```

`ai_functions_enabled` turns on real AI calls, so this run bills your warehouse. Try it on a small table of text first.

When the build finishes, print the results in your terminal:

```bash
dbt show --select search_transcripts --limit 10
```

You can also query `search_transcripts` in your warehouse like any other table.

## What it looks like

`search_transcripts` returns a table like this. It's illustrative and trimmed to three rows, so your chunks and scores will differ:

<SimpleTable>

| chunk_id | chunk_text | score |
|----------|------------|-------|
| `CT-99021::2` | "…I'll bring findings next time, not just a promise." | 0.57 |
| `CT-99021::1` | "We've flagged a pattern in late deliveries, but we don't know the cause yet." | 0.54 |
| `CT-99022::1` | "The late deliveries are clustering around the Columbus warehouse." | 0.50 |

</SimpleTable>

Here's how to read it:

- Each row is one chunk. The `chunk_id` points to the call and the piece, so you can trace any answer back to its source.
- `score` is how close the chunk is in meaning to your question. 1.0 means the same meaning, and rows come back highest first.
- The top chunk never says "late deliveries", yet it's the closest match to a question about them. That's search by meaning.

That's a working context pipeline. It's not perfect yet, though. Short, formulaic text can sneak into the top results. [Embed and retrieve](/best-practices/how-we-context-engineer/4-embed-and-retrieve) explains why, and [Enrich with AI](/best-practices/how-we-context-engineer/5-enrich-with-ai) fixes it.

## What's next

You've got a working pipeline. Next, you'll learn why each piece is built the way it is, starting with [Prepare your text](/best-practices/how-we-context-engineer/3-prepare-your-text).
