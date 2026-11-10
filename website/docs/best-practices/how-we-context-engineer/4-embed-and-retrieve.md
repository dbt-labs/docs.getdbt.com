---
title: "Embed and retrieve"
id: 4-embed-and-retrieve
description: Learn how to turn text into searchable vectors, search across sources with citations, and keep embeddings fresh.
displayText: Embed and retrieve
hoverSnippet: Learn how to make text searchable by meaning and keep it fresh.
---

Now that your text is chunked and traceable, let's make it searchable by meaning so an agent can find the right piece without knowing the exact words. 

In this section, you'll learn how to:

- Turn chunks into embeddings and search them by meaning
- See where plain search falls short
- Combine many sources into one knowledge base that cites its origins
- Keep embeddings fresh without overspending

Stuck on a term? Check the [glossary](/best-practices/how-we-context-engineer/9-glossary).

## Embed your text

An **embedding** is a list of numbers, called a **vector**, that captures what a piece of text means. Texts with similar meaning get similar numbers. That's what lets a search for "renewal risk" find a chunk that says "the customer is worried about resigning," even though they share no words.

Here's what that looks like. Each chunk becomes a vector. We show three numbers per chunk to keep it readable. Real vectors have hundreds (for example, 768 for `snowflake-arctic-embed-m-v1.5`), and the values in this guide are made up ([fugazi](https://www.urbandictionary.com/define.php?term=fugazi) one would say) for illustration.

So when you search for "renewal risk," the question gets embedded too (here, `[0.80, -0.10, 0.42, …]`), and every chunk gets a **cosine similarity** score against it: 1.0 means the same direction, and -1.0 means the opposite.

<SimpleTable>

| Chunk text | Vector (first 3 numbers) | Score against "renewal risk" |
|------------|--------------------------|------------------------------|
| "The customer is worried about resigning." | `[0.70, -0.05, 0.50, …]` | 0.99 |
| "Renewal paperwork is due next week." | `[0.60, 0.10, 0.55, …]` | 0.94 |
| "Truck 14 was delayed by a winter storm." | `[-0.20, 0.65, 0.05, …]` | -0.33 |

</SimpleTable>

You can't read meaning off the numbers by eye. What matters is how close two vectors are. The two renewal chunks score high and the truck chunk scores low, even though only one chunk shares a word with the query. That's search by meaning.

### Treat embeddings as derived assets

An embedding only matches embeddings from the same embedding model. Each embedding model arranges meaning differently, so comparing embeddings from two models gives meaningless scores. This is the biggest gotcha in the practice, and it drives three rules:

- Use one embedding model for the whole corpus. Never mix models in one searchable set.
- Embed your question with the same embedding model as your chunks. A different embedding model returns confidently wrong results.
- Set the embedding model explicitly in your config, with the `embedding_model` var. A floating alias like "latest" can quietly switch to a new version.

Embedding costs money, so refresh only what changed. [Keep embeddings fresh](#keep-embeddings-fresh) covers how, once you have search working.

## Retrieve by meaning
Retrieval is how an agent finds what it needs: given a question, it returns the most relevant chunks. It takes three steps:

1. Turn the question into an embedding, using the same embedding model as your chunks.
2. Score every chunk by how close its meaning is to the question (cosine similarity).
3. Return the highest-scoring chunks, usually the top 10.

In the package, the `embed()` macro handles step 1, and the `vector_search` macro handles steps 2 and 3. It returns the columns you ask for, plus a `score`. The `filter` limits the search to one account's rows:

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

A good chunk is similar to the question, filterable, and traceable to its source. That's what lets an agent cite a source instead of paraphrasing one.

### Pick how to search

There are two ways to rank:

<SimpleTable>
| Approach     | How it works                                                     | Best for                          |
|--------------|------------------------------------------------------------------|-----------------------------------|
| Brute force  | Compares the question to every row and sorts. Exact, plain SQL.  | Thousands to low millions of rows |
| Vector index | A separate service that finds approximate matches fast           | Very large corpora                |

</SimpleTable>

Start with brute force. It runs on the table you already have, with nothing new to set up or pay for. The embedding is an ordinary column, so your tests and lineage already cover it. For most corpora, scanning every row is fast enough.

An index is optional and in beta. It's a separate service that bills even when no one is searching, and dbt builds tables, not services. If you outgrow brute force:

- Create it with `dbt run-operation` (the package's `create_vector_index` macro), not as a model.
- Drop it yourself when you're done.
- On Databricks, you create it through its Vector Search API.
- On Redshift, it isn't supported. Search stays brute force.

To scope a search to one customer, filter before you rank, as the `filter` argument above does.

## Embedding buys recall. Classification buys precision.

Semantic search finds text that means something like your question, but not always the text you needed. **Recall** is whether search finds the right chunk at all. **Precision** is whether the right chunk ranks near the top.

We ran plain similarity search on a realistic multi-source corpus and asked, "late deliveries and what is driving them." The top-scoring chunk for the account was six tokens long: "Reviewed with dispatch." Most of the rest of the top 10 was boilerplate and routine check-ins. The quarterly business reviews that documented the real root cause never made the list.

The cause is structural, not a tuning problem. Short, formulaic text sits near the center of embedding space, so it scores decently against almost any question. Recall was fine 🙂. Precision wasn't 🙁.

By adding classification, that now closes the gap! Give each chunk one label, then filter the search to the category your question is about. You don't need it to get started. Run chunk → embed → search first, and what you see is exactly why you'll want it. [Enrich with AI](/best-practices/how-we-context-engineer/5-enrich-with-ai) covers how.

## Combine sources into a knowledge base

Questions like "Tell me everything about this account" span different tables. The answer lives in tickets, call transcripts, meeting notes, and emails, each with its own column names and timestamps.

A _knowledge base_ is one table that holds all of them. You create it with the package's `knowledge_base()` macro where you list your sources and say which columns map to which, and the macro then renames and stacks them into one table. 

Think of it as a union model that writes itself. Because every source ends up with the same columns, one search covers all of them.

<Lightbox src="/img/best-practices/context-engineering/knowledge-base.svg" width="100%" title="Each source has its own source models that chunk, embed, and optionally classify its text. One knowledge base model calls the knowledge_base() macro, which renames and stacks the sources into one table. An agent or app searches that table, filtered by account, and every hit says which system and row it came from." />

### Where this fits in your workflow

You build the knowledge base last, after every source is ready. Two kinds of context model are involved:

<SimpleTable>

| Model | What it is | Who writes it |
|-------|------------|---------------|
| Source models | One set per source. Each chunks, embeds, and optionally classifies that source's text, as covered earlier in this guide. | You |
| Knowledge base model | One model that stacks all the source models into a single table. Its body is one call to the package's `knowledge_base()` macro. | You write the call. The macro writes the SQL. |

</SimpleTable>

Here's the recommended order of your workflow:

1. Prepare, embed, and optionally classify each source, with the same embedding model for every source.
2. Create one new context model that calls `knowledge_base()` and lists those sources.
3. Build it with `dbt build`.
4. Point your agent or app at the result and search it.

The macro doesn't create embeddings or labels but it does stack what your source models already have.

### What comes out

Your sources that start with different column names:

<SimpleTable>

| Source | Id | Account | Text | Timestamp |
|--------|----|---------|------|-----------|
| Tickets | `ticket_id` | `account_id` | `body` | `created_at` |
| Calls | `chunk_id` | `client_id` | `chunk_text` | `artifact_ts` |

</SimpleTable>

The knowledge base gives them one set of names, so a ticket and a call can sit in the same table:

<SimpleTable>

| Column | What it holds |
|--------|---------------|
| `source_type` | Which system the row came from, such as ticket or call |
| `source_id` | The row's id in that system |
| `account_key` | The key you filter on, such as account or tenant |
| `text` | The content |
| `embedding` | The vector for that text |
| `ts` | When it happened |
| `citation_url` | A link back to the original. Optional. |
| `classification` | The label from [Enrich with AI](/best-practices/how-we-context-engineer/5-enrich-with-ai). Optional. |

</SimpleTable>

The macro also adds `source_key` and `content_hash` for you, so incremental runs can find new and changed rows.

### Tell the macro how to map each source

Use the package's `knowledge_base()` macro in a model. You pass it a list with one entry per source. Each entry says which of that source's columns goes into which knowledge base column:

<SimpleTable>

| Key in your entry | You set it to | Required |
|-------------------|---------------|----------|
| `relation` | The source model, such as `ref('legal_docs_embedded_classified')` | Yes |
| `source_type` | A label you pick, such as `'Legal Document'` | Yes |
| `source_id` | The source column with the row's id | Yes |
| `account_key` | The source column you filter by | Yes |
| `text` | The source column with the text | Yes |
| `embedding` | The source column with the vector | Yes |
| `timestamp` | The source column with the date or time. It becomes `ts`. | Yes |
| `citation_url` | The source column with a link back to the original | No |
| `classification` | The source column with the label | No |

</SimpleTable>

If you leave out an optional key, that source's rows get `null` in the column. Here are two of the five sources in `jaffle-logistics`:

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

To add a source, add one more entry to the list.

### Build and use it

The knowledge base is a regular dbt model, so you build it like any other. Build your source models first, because their embed and classify steps make the AI calls. Then build the knowledge base:

```shell
dbt build --select knowledge_base --vars '{"ai_functions_enabled": true}'
```

The knowledge base itself is plain SQL with no AI calls, so it adds warehouse compute only. You build it. Your agent or app queries it, and your end users ask the agent.

To answer a cross-system question, [search by meaning](#retrieve-by-meaning) over the table and filter on `account_key`. Every hit carries its `source_type` and `source_id`, so it says which system and row it came from.

Our recommendations:

- **Keep adding a source small:** A new source needs one entry plus its own prepare and embed models (and a classify model, if you classify), as `jaffle-logistics` shows. If adding a source means rewriting your search, people won't do it.
- **Carry lineage on every row:** Each result should say which system and row it came from.
- **Give the citation link and the label their own columns:** They're always there, and `null` when a source has none.

## Keep embeddings fresh

You can skip this section on a first pass and come back to it once you're re-running builds and want to stop paying to re-embed text that hasn't changed.

An embedding goes stale when anything on the input side changes: the text, the embedding model, or the settings. Embedding costs money, so you really don't want to re-embed a row you've already processed. That makes an incremental model the natural fit. The [`dbt_context_engineering` package](https://github.com/dbt-labs/dbt-context-engineering) builds these practices in, and each recommendation in the next section names the macro or var that does it.

:::tip Accessing the `var` list

Browse the package's [`macros` folder](https://github.com/dbt-labs/dbt-context-engineering/tree/main/macros). The [var reference](https://github.com/dbt-labs/dbt-context-engineering/blob/main/skills/dbt-ce-setup/references/vars-reference.md) lists every var and its default.
:::

### Refresh incrementally
Since vectors are only comparable within one embedding model, your context model needs to know which of two modes it's in on each run:

<Lightbox src="/img/best-practices/context-engineering/refresh-modes.webp" width="70%" title="On each run, the embedding model checks whether the stored version differs from the pinned one. If not, it embeds only new and changed rows. If so, it re-embeds the whole corpus. Either way, the corpus ends up on one model." />

<SimpleTable>

| Mode | Trigger | What happens |
|------|---------|--------------|
| Steady state | Model and config unchanged | Embed only new and changed rows. Cheap. |
| Version bump | You pinned a new model or changed a setting | Re-embed the whole corpus so it's consistent again. Expensive, but correct. |

</SimpleTable>

- Decide the mode when the context model runs, not when dbt parses it. "Did the stored version change?" can only be answered by reading the table. Use a runtime signal that flips an ordinary incremental model's `where` clause. In the package, `version_guard` returns true when the stored version differs from the pinned one, and `incremental_delta_predicate` builds the `where` clause for you. [ADR-0004](https://github.com/dbt-labs/dbt-context-engineering/blob/main/adr/0004-version-aware-incremental-refresh.md) explains the reasoning.
- To catch edited rows, not just new ones, store a hash (a short fingerprint of the text) of exactly what you embedded, and re-embed when it changes. In the package, that's `content_hash`.
- Gate full rebuilds, so a bare `--full-refresh` can't silently re-bill your whole corpus. [Control cost](/best-practices/how-we-context-engineer/7-control-cost#gate-full-refreshes) shows how.

### Store a cache key with every vector

Alongside the hash of the text, store a fingerprint of the embedding model, vector size, and provider settings you used. You need both. Without the fingerprint, a settings change with identical text goes undetected. Without the hash, an edit to a row under the same embedding model goes undetected. Keep each vector in the same row as the entity it describes.

In the package, `embedding_fn_fingerprint` covers the model and settings, `embedding_dimension` records the vector size the engine returned, and `embedding_logic_hash` fingerprints the embedding code itself. [ADR-0023](https://github.com/dbt-labs/dbt-context-engineering/blob/main/adr/0023-embedding-metadata-and-content-hash-delta.md) explains the reasoning.

Two more things to watch for. If you re-chunk and a chunk id disappears, nothing detects the stale vector, so add a `relationships` test between your embeddings and your current chunks. And a row whose text later becomes null is left frozen rather than re-embedded, so filter out null text with `where body is not null`.

### Monitor for drift <Lifecycle status="beta" />

Your code and config can stay exactly the same while the provider changes what comes back, for example when an embedding model alias moves to a new snapshot.

You can use a **canary** to catch this. You keep a handful of frozen probe strings, re-embed them on every build, and compare each result to a baseline a person has already reviewed. If similarity drops below your threshold, the test raises a warning.

- Compare by cosine similarity, not exact match, because identical text doesn't always produce identical vectors (check out [adapter notes](#adapter-notes-for-freshness)). Ask "would this difference change a search result?" The default threshold is 0.999, set with the `embedding_canary_similarity_threshold` var.
- Expect a warning, not a failure. The default severity is `warn`, so a benign build never fails on a mismatch. Set the `embedding_canary_test_severity` var to `error` if you want it to fail, for example in CI.
- The canary is the `embedding_canary` model. It makes real embedding calls, so it's off by default and its baseline seed ships disabled. Turn it on deliberately: enable the model and the seed together, and run it on a scheduled production job:

<File name="dbt_project.yml">

```yaml
models:
  dbt_context_engineering:
    monitoring:
      +enabled: true

seeds:
  dbt_context_engineering:
    +enabled: true
```

</File>

When you change the embedding function on purpose, re-review the baseline. Run `dbt run-operation print_embedding_canary` to print the current probes.

### Adapter notes for freshness

- **Vectors aren't bit-for-bit repeatable on Snowflake and Databricks:** Re-embedding the same text gives cosine similarity above 0.999999 between runs. Never compare vectors for exact equality. BigQuery showed no variation in our tests.
- **On Snowflake, check the canary's vector size:** The `embedding_canary_vector_dimension` var defaults to 768, the size of `snowflake-arctic-embed-m-v1.5`. Set it if your embedding model's vectors are a different size. Databricks and BigQuery need nothing.
- **The canary isn't supported on Redshift:** It raises an error with guidance, so leave it off there.
- **Databricks needs a recent runtime for AI functions:** It requires DBR 15.4 LTS or above, and not Databricks SQL Classic. If you don't meet this, you'll see an opaque SQL error, so check it first when troubleshooting.

## What's next

Okayyy so your context is searchable and cited. Next, you'll make that search precise with labels in [Enrich with AI](/best-practices/how-we-context-engineer/5-enrich-with-ai).
