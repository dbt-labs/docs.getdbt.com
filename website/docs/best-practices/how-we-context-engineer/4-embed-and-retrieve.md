---
title: "Embed and retrieve"
id: 4-embed-and-retrieve
description: Learn how to turn text into searchable vectors, search across sources with citations, and keep embeddings fresh.
displayText: Embed and retrieve
hoverSnippet: Learn how to make text searchable by meaning and keep it fresh.
---

Your text is chunked and traceable. Now you make it searchable by meaning, so an agent can find the right piece without knowing the exact words. Run chunk → embed → search first. Classifying chunks is the precision step on top, and we cover it in [Enrich with AI](/best-practices/how-we-context-engineer/5-enrich-with-ai).

In this section, you'll learn how to:

- Turn chunks into embeddings and search them by meaning
- See where plain search falls short
- Combine many sources into one knowledge base that cites its origins
- Keep embeddings fresh without overspending

Stuck on a term? Check the [glossary](/best-practices/how-we-context-engineer/8-glossary).

## Embed your text

An **embedding** is a list of numbers, called a **vector**, that captures what a piece of text means. Texts with similar meaning get similar numbers. That's what lets a search for "renewal risk" find a chunk that says "the customer is worried about resigning," even though they share no words.

Here's what that looks like. Each chunk becomes a vector. We show three numbers per chunk to keep it readable. Real vectors have hundreds (for example, 768 for `snowflake-arctic-embed-m-v1.5`), and the values below are made up for illustration:

<SimpleTable>

| Chunk text | Vector (first 3 numbers) |
|------------|--------------------------|
| "The customer is worried about resigning." | `[0.70, -0.05, 0.50, …]` |
| "Renewal paperwork is due next week." | `[0.60, 0.10, 0.55, …]` |
| "Truck 14 was delayed by a winter storm." | `[-0.20, 0.65, 0.05, …]` |

</SimpleTable>

You can't read meaning off the numbers by eye. What matters is how close two vectors are. When you search for "renewal risk," the question gets embedded too (here, `[0.80, -0.10, 0.42, …]`), and every chunk gets a **cosine similarity** score against it: 1.0 means the same direction, and -1.0 means the opposite.

<SimpleTable>

| Chunk text | Score against "renewal risk" |
|------------|------------------------------|
| "The customer is worried about resigning." | 0.99 |
| "Renewal paperwork is due next week." | 0.94 |
| "Truck 14 was delayed by a winter storm." | -0.33 |

</SimpleTable>

The two renewal chunks score high and the truck chunk scores low, even though only one chunk shares a word with the query. That's search by meaning.

### Treat embeddings as derived assets

An embedding is the output of a function: text, plus a model, plus any preprocessing, goes in, and a vector comes out.

Vectors have one rule that ordinary columns don't: **they're only comparable to vectors from the same model.** Two models place meaning in different spaces, so similarity between their vectors is meaningless. This is the sharpest edge in the whole practice, and it drives most of our recommendations:

- **Pin one embedding model for the whole corpus.** Never mix models in one searchable set.
- **Embed your query with the same model as your corpus.** A query vector from a different model returns confidently wrong results.
- **Set the model explicitly in configuration.** A floating alias can quietly resolve to a new snapshot.

Embedding costs money, so you'll want to refresh vectors incrementally. We cover that in [Keep embeddings fresh](#keep-embeddings-fresh), once you have search working.

## Retrieve by meaning

Retrieval is the read side of context engineering: given a question, find the most relevant chunks. It takes three steps:

1. **Embed the query** into the same vector space as your corpus.
2. **Score** every chunk by its cosine similarity to the query.
3. **Return** the highest-scoring chunks, usually the top 10.

In the package, that's one macro, `vector_search`. It returns the id and columns you ask for, plus a `score`:

<File name="models/context/ai/search.sql">

```sql
{{ dbt_context_engineering.vector_search(
    relation=ref('knowledge_base'),
    embedding_column='embedding',
    query_embedding=dbt_context_engineering.embed("'late deliveries and what is driving them'"),
    top_k=10,
    id_column='source_id',
    select_columns=['source_type', 'citation_url', 'text'],
    filter="account_key = 'CLI-0042'"
) }}
```

</File>

Retrieval is the contract with your agent. A chunk earns its place by being similar, filterable, and traceable, so the agent can cite a source instead of paraphrasing one.

### Start with brute force

There are two ways to rank:

<SimpleTable>

| Approach | How it works | Best for |
|----------|--------------|----------|
| Brute force | Compare the query to every row and sort. Exact, plain SQL. | Thousands to low millions of rows |
| Vector index | A specialized structure or service that returns approximate matches fast | Very large corpora |

</SimpleTable>

We recommend **brute force by default**. It works on the table you already have, with nothing new to provision, learn, or pay for. Because the vector is an ordinary column, it inherits your tests, lineage, and governance. For most real corpora, a linear scan is fast enough.

An index is a deliberate opt-in. A table costs storage and nothing more when idle. An index is a long-lived, separately billed service that charges even when nobody queries it. dbt manages tables, not services, so a routine `dbt run` should never quietly stand one up.

### Build an index only on purpose <Lifecycle status="beta" />

When you outgrow brute force, create the index:

- **Run it as an operation, never as a model.** It should be impossible to trigger by accident.
- **Expect to tear it down yourself.** Nothing cleans it up for you, and it keeps billing until you drop it.
- **Check your engine's path.** On Databricks, the index is created through an API or SDK rather than SQL.

### Filter before you rank

Narrow the candidate set before ranking, such as by account (the `filter` argument above). This is how you scope a search to one customer, and it keeps results relevant.

### Adapter notes for retrieval

<SimpleTable>

| Topic | Snowflake | Databricks | BigQuery |
|-------|-----------|------------|----------|
| Similarity | Scalar cosine function | Scalar cosine function | A `VECTOR_SEARCH` table function, in brute-force mode |
| Managed index | Cortex Search | Vector Search, created through its API | Vector index |

</SimpleTable>

Hide the BigQuery difference behind one interface so your models read the same on every engine.

## Embedding buys recall. Classification buys precision.

Semantic search finds text that means something like your query. That isn't the same as finding the text you needed. **Recall** is whether search finds the right chunk at all. **Precision** is whether the right chunk ranks near the top.

We ran plain similarity search on a realistic multi-source corpus and asked, "late deliveries and what is driving them." The highest-scoring chunk for the account was six tokens long: a trailing fragment reading "Reviewed with dispatch." Most of the rest of the top 10 was boilerplate and routine check-ins. The quarterly business reviews that documented the real root cause never made the list.

The cause is structural, not a tuning problem. Short, formulaic text sits near the center of embedding space, so it scores respectably against almost any query. Recall was fine. Precision wasn't.

**Classification closes the gap.** Give each chunk one label, then filter the search to the category your question is about. You don't need it to get started: run chunk → embed → search first, and what you see is exactly why you'll want it. We cover how in [Enrich with AI](/best-practices/how-we-context-engineer/5-enrich-with-ai).

## Combine sources into a knowledge base

Useful questions rarely live in one table. "Tell me everything about this account" spans tickets, call transcripts, meeting notes, and emails, each with its own column names, grain, and timestamps. An agent shouldn't need to know that a ticket body and a call transcript are the same kind of thing.

You've solved this problem before. A conformed dimension defines one canonical shape and maps every source into it. A **knowledge base** is the same idea for context: a retrieval-ready table where every source lands in one common shape.

<SimpleTable>

| Column | Meaning |
|--------|---------|
| `source_type` | Which system the row came from, such as ticket or call |
| `source_id` | The row's id in that system |
| `account_key` | The key you filter on, such as account or tenant |
| `text` | The content |
| `embedding` | Its vector |
| `ts` | When it happened |
| `citation_url` | A link back to the original. Optional per source. |
| `classification` | The label from [Enrich with AI](/best-practices/how-we-context-engineer/5-enrich-with-ai). Optional per source. |

</SimpleTable>

With this in place, one filtered search answers a cross-system question, and every hit says which system and row it came from.

In the package, you list each source and say which of its columns map to the shared shape. Here are two of the five sources in `jaffle-logistics`:

<File name="models/context/ai/knowledge_base.sql">

```sql
{{ dbt_context_engineering.knowledge_base([
    {'relation': ref('legal_docs_embedded_classified'), 'source_type': 'Legal Document',
     'source_id': 'chunk_id', 'account_key': 'client_id',
     'text': 'chunk_text', 'embedding': 'embedding', 'timestamp': 'artifact_ts',
     'citation_url': 'citation_url', 'classification': 'classification'},
    {'relation': ref('incident_reports_embedded_classified'), 'source_type': 'Incident Report',
     'source_id': 'chunk_id', 'account_key': 'client_id',
     'text': 'chunk_text', 'embedding': 'embedding', 'timestamp': 'artifact_ts',
     'citation_url': 'citation_url', 'classification': 'classification'}
]) }}
```

</File>

Our recommendations:

- **Make adding a source a small change to the knowledge base.** Each new source needs one mapping like the ones above, which is a one-line change here. The source still needs its own prepare and embed models (and a classify model, if you classify), as `jaffle-logistics` shows. If adding a source means rewriting your search, people won't do it.
- **Embed every source with the same model.** This is where someone accidentally mixes models, and the rankings turn quietly wrong.
- **Carry lineage on every row.** A hit can come from any system, so "which system and which row" must travel with it into every result.
- **Give the citation link and the label their own columns.** Consumers depend on them, so they're always there, and `null` when a source has no link.
- **Use plain SQL.** Combining sources is a union with casts, so there's no engine-specific logic to hide.

## Keep embeddings fresh

You can skip this section on a first pass. Come back to it once you're re-running builds and want to stop paying to re-embed text that hasn't changed.

An embedding goes stale when anything on the input side changes: the text, the model, or the settings. Embedding costs money, so you don't want to re-embed a row you've already processed. That makes an incremental model the natural fit.

### Refresh incrementally, with two modes

Because vectors are only comparable within one model, your model needs to know which of two modes it's in on each run:

<SimpleTable>

| Mode | Trigger | What happens |
|------|---------|--------------|
| Steady state | Model and config unchanged | Embed only new and changed rows. Cheap. |
| Version bump | You pinned a new model or changed a setting | Re-embed the whole corpus so it's consistent again. Expensive, but correct. |

</SimpleTable>

Think of it like a schema migration for a derived column: normally you append, but when the definition changes, you rebuild every row.

- **Decide the mode at run time, not parse time.** "Did the stored version change?" can only be answered by reading the table when the model runs. Use a runtime signal that flips an ordinary incremental model's `where` clause.
- **Stick with a standard incremental model.** A custom materialization hides the logic that decides when you spend money. Keep that decision in plain sight.
- **Catch edited rows, not just new ones.** Store a hash (a short fingerprint of the text) of exactly what you embedded, and re-embed when it changes.
- **Gate full rebuilds.** A bare `--full-refresh` shouldn't be able to silently re-bill your whole corpus.

### Store a cache key with every vector

Store enough with each vector to know whether it still matches what the function would produce today:

<SimpleTable>

| Column | Answers |
|--------|---------|
| Vector | The embedding itself |
| Content hash | Did the text change? |
| Function fingerprint | Did the model, dimension, or provider settings change, with the text held constant? |
| Dimension | How long is the vector the engine actually returned, not the one you configured? |
| Embedded at | When was it made? |
| Model name | Which model made it? Keep this for humans. It's an audit column, and nothing should depend on it. |

</SimpleTable>

You need both the content hash and the fingerprint. Without the fingerprint, a settings change with identical text goes undetected. Without the hash, an edit to a row under the same model goes undetected.

:::tip
Store each vector in the same row as the entity it describes. A separate table keyed on the hash only pays off when the same text repeats across many rows, and chunks are close to unique by construction.
:::

### Watch for orphans and nulls

- **Orphaned chunks.** If you re-chunk and a chunk id disappears, nothing detects the stale vector. Add a `relationships` test between your embeddings and your current chunks.
- **Null text.** A row whose text later becomes null is left frozen rather than re-embedded. For a brand-new row with null text, filter it out with `where body is not null`.

### Monitor for drift <Lifecycle status="beta" />

Your code and config can stay exactly the same while the provider changes what comes back, for example when a model alias moves to a new snapshot. Nothing in your project would show it.

A **canary** catches this. You keep a handful of frozen probe strings, re-embed them on every build, and compare each result to a baseline a person has already reviewed. If similarity drops below your threshold, the test raises a warning.

- **Compare by cosine similarity, not exact match.** Identical text doesn't always produce identical vectors (see [adapter notes](#adapter-notes-for-freshness)), so ask "would this difference change a search result?" The default threshold is 0.999.
- **Expect a warning, not a failure.** The default severity is `warn`, so a benign build never fails on a mismatch. Set the severity to `error` if you want it to fail, for example in CI.
- **Turn it on deliberately.** The canary makes real embedding calls, so it's off by default and its baseline seed ships disabled. Enable the monitor and the seed together, and run it on a scheduled production job.

### Adapter notes for freshness

<SimpleTable>

| Topic | Snowflake | Databricks | BigQuery |
|-------|-----------|------------|----------|
| Embedding function | `AI_EMBED` | Serving endpoint | `AI.EMBED` |
| Run-to-run variation | Small | Small | None observed |
| Canary configuration | Set the vector dimension explicitly | Defaults | Defaults |

</SimpleTable>

- **Vectors aren't bit-for-bit repeatable on Snowflake and Databricks.** Re-embedding the same text gives cosine similarity above 0.999999 between runs. Never compare vectors for exact equality.
- **Databricks needs a recent runtime for AI functions.** It requires DBR 15.4 LTS or above, and not Databricks SQL Classic. If you don't meet this, you'll see an opaque SQL error, so check it first when troubleshooting.

## What's next

Your context is searchable and cited. Next, you'll make that search precise with labels in [Enrich with AI](/best-practices/how-we-context-engineer/5-enrich-with-ai).
