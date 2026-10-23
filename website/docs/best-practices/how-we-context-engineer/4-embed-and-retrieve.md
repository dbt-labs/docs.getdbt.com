---
title: "Embed and retrieve"
id: 4-embed-and-retrieve
description: Learn how to turn text into searchable vectors, keep them fresh, and search across sources with citations.
displayText: Embed and retrieve
hoverSnippet: Learn how to make text searchable by meaning and keep it fresh.
---

Your text is chunked, labeled, and traceable. Now you make it searchable by meaning, so an agent can find the right piece without knowing the exact words.

In this section, you'll learn how to:

- Embed text and keep those embeddings fresh without overspending
- Search by meaning, and make that search precise
- Combine many sources into one knowledge base that cites its origins

## Embed your text

An **embedding** is a list of numbers, called a **vector**, that captures what a piece of text means. Texts with similar meaning land close together. That's what lets a search for "renewal risk" find a chunk that says "the customer is worried about resigning," even though they share no words.

### Treat embeddings as derived assets

An embedding is the output of a function: text, plus a model, plus any preprocessing, goes in, and a vector comes out. Like any cached value, it goes stale when anything on the input side changes.

Vectors have one rule that ordinary columns don't: **they're only comparable to vectors from the same model.** Two models place meaning in different spaces, so similarity between their vectors is meaningless. This is the sharpest edge in the whole practice, and it drives most of our recommendations.

- **Pin one embedding model for the whole corpus.** Never mix models in one searchable set.
- **Embed your query with the same model as your corpus.** A query vector from a different model returns confidently wrong results.
- **Set the model explicitly in configuration.** Don't let a floating alias decide for you, because it can quietly resolve to a new snapshot.

### Refresh incrementally, with two modes

Embedding costs money, so you don't want to re-embed a row you've already processed. That makes an incremental model the natural fit. But because of the rule above, your model needs to know which of two modes it's in on each run:

| Mode | Trigger | What happens |
|------|---------|--------------|
| Steady state | Model and config unchanged | Embed only new and changed rows. Cheap. |
| Version bump | You pinned a new model or changed a setting | Re-embed the whole corpus so it's consistent again. Expensive, but correct. |

Think of it like a schema migration for a derived column: normally you append, but when the definition changes, you rebuild every row.

Our recommendations:

- **Decide the mode at run time, not parse time.** "Did the stored version change?" can only be answered by reading the table when the model runs. Use a runtime signal that flips an ordinary incremental model's `where` clause.
- **Stick with a standard incremental model.** A custom materialization is more surface area to learn, and it hides the logic that decides when you spend money. Keep that decision in plain sight.
- **Catch edited rows, not just new ones.** A row whose key already exists, but whose text changed, would otherwise stay stale until someone forces a full refresh. Store a hash of the exact text you embedded, and re-embed when it changes.
- **Gate full rebuilds.** A bare `--full-refresh` shouldn't be able to silently re-bill your whole corpus.

### Store a cache key with every vector

Store enough with each vector to know whether it still matches what the function would produce today, and to scope an incident to the exact rows it touched:

| Column | Answers |
|--------|---------|
| Vector | The embedding itself |
| Content hash | Did the text change? |
| Function fingerprint | Did the model, dimension, or provider settings change, with the text held constant? |
| Dimension | How long is the vector the engine actually returned, not the one you configured? |
| Embedded at | When was it made? |
| Model name | Which model made it? Keep this for humans. It's an audit column, and nothing should depend on it. |

You need both the content hash and the fingerprint. Without the fingerprint, a settings change with identical text goes undetected. Without the hash, an edit to a row under the same model goes undetected.

:::tip
Store each vector in the same row as the entity it describes. A separate table keyed on the hash only pays off when the same text repeats across many rows, and chunks are close to unique by construction. Moving to a separate table later is a real migration, so only do it when you have heavy repetition, like boilerplate.
:::

### Watch for orphans and nulls

- **Orphaned chunks.** If you re-chunk and a chunk id disappears, nothing detects the stale vector, because an absence is invisible to both the key check and the hash check. Add a `relationships` test between your embeddings and your current chunks.
- **Null text.** A row whose text later becomes null is left frozen rather than re-embedded. For a brand-new row with null text, filter it out at the call site with `where body is not null`.

### Monitor for drift <Lifecycle status="beta" />

Your code and config can stay exactly the same while the provider changes what comes back, for example when a model alias moves to a new snapshot. Nothing in your project would show it.

A **canary** catches this. You keep a handful of frozen probe strings, re-embed them on every build, and compare each result to a baseline a person has already reviewed. If similarity drops below your threshold, the test fails.

- **Compare by cosine similarity, not exact match.** Identical text doesn't always produce identical vectors (see [adapter notes](#adapter-notes)), so ask "would this difference change a search result?" instead of "are these numbers the same?"
- **Run it on a schedule in production only.** A canary makes real embedding calls, so it costs money. Leave it off by default and add it to a scheduled production job.

### Adapter notes

| Topic | Snowflake | Databricks | BigQuery |
|-------|-----------|------------|----------|
| Embedding function | `AI_EMBED` | Serving endpoint | `AI.EMBED` |
| Run-to-run variation | Small | Small | None observed |
| Canary configuration | Set the vector dimension explicitly | Defaults | Defaults |

- **Vectors aren't bit-for-bit repeatable on Snowflake and Databricks.** Re-embedding the same text lands on a few exact, repeating vectors, with cosine similarity above 0.999999 between them. This looks like requests being routed across serving replicas that are each consistent but numerically a hair apart. BigQuery showed no variation. Never compare vectors for exact equality. Use similarity with a threshold.
- **Changed-row detection needs a multi-column `not in`, and BigQuery rejects the usual form.** BigQuery wants the subquery's select list wrapped as a single tuple, and Snowflake and Databricks reject that wrapped form. Isolate the one line that differs rather than repeating it across models.
- **Databricks needs a recent runtime for AI functions.** It requires DBR 15.4 LTS or above, and not Databricks SQL Classic. If you don't meet this, you'll see an opaque SQL error rather than a clear message, so check it first when troubleshooting.

## Retrieve by meaning

Retrieval is the read side of context engineering: given a question, find the most relevant chunks. It takes three steps:

1. **Embed the query** into the same vector space as your corpus.
2. **Score** every chunk by its **cosine similarity** to the query: a number from 1.0 (same direction) down to -1.0 (opposite).
3. **Return** the highest-scoring chunks, usually the top 10.

Retrieval is the contract with your agent. A chunk earns its place by being similar, filterable, and traceable, so the agent can cite a source instead of paraphrasing one.

### Start with brute force

There are two ways to rank:

| Approach | How it works | Best for |
|----------|--------------|----------|
| Brute force | Compare the query to every row and sort. Exact, plain SQL. | Thousands to low millions of rows |
| Vector index | A specialized structure or service that returns approximate matches fast | Very large corpora |

We recommend **brute force by default**. It works on the table you already have, with nothing new to provision, learn, or pay for. Because the vector is an ordinary column, it inherits your tests, lineage, and governance. For most real corpora, a linear scan is fast enough.

Treat an index as a deliberate opt-in, and here's why. A table is inert: it costs storage and nothing more when idle. An index is a long-lived, separately billed service that charges even when nobody queries it. dbt manages tables, not services, so a routine `dbt run` should never quietly stand one up.

### Build an index only on purpose <Lifecycle status="beta" />

When you outgrow brute force, create the index:

- **Run it as an operation, never as a model.** It should be impossible to trigger by accident.
- **Expect to tear it down yourself.** Nothing cleans it up for you, and it keeps billing until you drop it.
- **Check your engine's path.** On Databricks, the index is created through an API or SDK rather than SQL, so SQL-based tooling can't build it for you.

### Filter before you rank

Narrow the candidate set before ranking, such as by account. This is how you scope a search to one customer, and it keeps results relevant.

### Adapter notes

| Topic | Snowflake | Databricks | BigQuery |
|-------|-----------|------------|----------|
| Similarity | Scalar cosine function | Scalar cosine function | A `VECTOR_SEARCH` table function, in brute-force mode |
| Managed index | Cortex Search | Vector Search, created through its API | Vector index |

Hide the BigQuery difference behind one interface so your models read the same on every engine.

## Embedding buys recall. Classification buys precision.

Semantic search finds text that means something like your query. That isn't the same as finding the text you needed.

We ran plain similarity search on a realistic multi-source corpus and asked, "late deliveries and what is driving them." The highest-scoring chunk for the account was six tokens long: a trailing fragment reading "Reviewed with dispatch." Most of the rest of the top 10 was boilerplate and routine check-ins. The quarterly business reviews that documented the real root cause never made the list.

The cause is structural, not a tuning problem. Short, formulaic text sits near the center of embedding space, so it scores respectably against almost any query. Recall was fine. Precision wasn't.

**Classification closes the gap.** Give each chunk one label from a closed business taxonomy, such as an account assessment, a weather disruption, a handling error, or routine status. Then run the same search, filtered to the category your question is actually about. In our test, every result in the top 10 became real account content, in coherent order, with the boilerplate gone.

Our recommendations:

- **Run the basic pipeline first.** Chunk, embed, and search works without classification. What you learn from running it is exactly why you'll want classification.
- **Use the label as a filter on search.** Retrieval narrows to the right category before ranking.
- **Version your taxonomy like any other prompt.** Changing it should be a reviewable diff, as covered in [Enrich with AI](/best-practices/how-we-context-engineer/3-enrich-with-ai).

:::caution
Two honest limits. A taxonomy built for the questions you've thought of may not generalize to questions you haven't, and that's unsolved. Also, labels aren't cached the way embeddings are, so a rebuild relabels everything and the same text can land in a different category between runs. Filtering removes the wrong categories, but it doesn't guarantee the best chunk in a category wins.
:::

## Combine sources into a knowledge base

Useful questions rarely live in one table. "Tell me everything about this account" spans tickets, call transcripts, meeting notes, and emails, each with its own column names, grain, and timestamps. An agent shouldn't need to know that a ticket body and a call transcript are the same kind of thing.

You've solved this problem before. A conformed dimension defines one canonical shape and maps every source into it. A **knowledge base** is the same idea for context: a retrieval-ready mart where every source lands in one common shape.

| Column | Meaning |
|--------|---------|
| `source_type` | Which system the row came from, such as ticket or call |
| `source_id` | The row's id in that system |
| `account_key` | The key you filter on, such as account or tenant |
| `text` | The content |
| `embedding` | Its vector |
| `ts` | When it happened |
| `citation_url` | A link back to the original. Optional per source. |
| `classification` | The label from the previous section. Optional per source. |

With this in place, one filtered search answers a cross-system question, and every hit says which system and row it came from.

Our recommendations:

- **Make adding a source a one-line change.** The only per-source work is a mapping: this source's `body` is the shared `text`, its `created_at` is `ts`. If adding a source means rewriting your search, people won't do it, and the knowledge base drifts from reality.
- **Embed every source with the same model.** This is where someone accidentally mixes models, and the rankings turn quietly wrong.
- **Carry lineage on every row.** A hit can come from any system, so "which system and which row" must travel with it into every result.
- **Give the citation link and the label their own columns.** In the transform that prepares each source, every field is treated the same. In the knowledge base, the columns your consumers depend on are guaranteed. A citation link a consumer can only sometimes find isn't a promise it can rely on, so the column is always there, and `null` when a source has no link. That's why [Prepare your text](/best-practices/how-we-context-engineer/2-prepare-your-text) treats metadata generically and this layer doesn't.
- **Use plain SQL.** Combining sources is a union with casts, and it behaves the same everywhere, so there's no engine-specific logic to hide.

## What's next

Your context is searchable and cited. Next, you'll make sure it's correct in [Keep context trustworthy](/best-practices/how-we-context-engineer/5-keep-context-trustworthy).
