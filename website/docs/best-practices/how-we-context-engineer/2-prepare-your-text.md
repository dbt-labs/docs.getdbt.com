---
title: "Prepare your text"
id: 2-prepare-your-text
description: Learn how to chunk raw text and attach source metadata so every piece of context stays whole and citable.
displayText: Prepare your text
hoverSnippet: Learn how to chunk raw text and attach source metadata.
---

Raw text is the source-conformed data of context engineering: shaped by systems you don't control, and too big or messy for an agent to use as-is. Preparing it is the first step, and the one everything else depends on.

In this section, you'll learn how to:

- Break long text into chunks that keep their meaning
- Carry source details onto every chunk so each one can cite its origin

## Why does preparation matter?

Retrieval quality is decided before any AI runs. A chunk that splits a sentence in half, or mixes two customers' calls, can't be rescued by a better model downstream.

Here's why. Search over context works on **embeddings**: lists of numbers that capture what a piece of text _means_, so that similar meanings land close together. A chunk that fuses two unrelated thoughts embeds to a muddy point that sits near nothing useful. Chunk well, and you get embeddings worth searching.

## Chunking

A **chunk** is a piece of text small enough to embed and retrieve. Models can only read so much at once, so a 90-minute transcript or a 40-page contract has to be broken up.

### Pack, don't cut

The naive approach is cutting the text every _N_ characters. Don't. A blind cut splits a sentence or a speaker's turn down the middle, and each half embeds to something that represents neither idea.

Think of **packing** instead. You fill a box with whole sentences until the next one wouldn't fit, then start a new box. The thing you pack is a **unit**: the smallest piece of text you'll never split, like a speaker turn in a transcript or a sentence in a document.

| Source | Unit |
|--------|------|
| Call transcript | One speaker turn |
| Support ticket | One message in the thread |
| Contract or document | One sentence |

### Our recommendations

- **Never split a unit.** Meaning lives in whole thoughts. If two goals conflict, keep the one that protects meaning.
- **Treat the size limit as soft.** Because units are never split, you can't guarantee an exact size. A chunk can run over by at most the one unit that tipped it past the limit. That small overshoot is harmless, while a split thought isn't.
- **Never cross a partition key.** A partition key is the column that identifies one source object, such as `call_id`. Chunks stay inside one call, so turns from different customers never end up together.
- **Make chunking deterministic and free.** Chunking runs over everything, so it must be cheap. It also sits upstream of every embedding, search, and test, so the same input should always produce the same chunks. Skip AI calls here.
- **Estimate size, don't measure it.** A **token** is the sub-word piece a model reads and bills by, roughly four characters of English. Estimating tokens as characters divided by four is close enough for budgeting and needs no model.

Here's the idea in plain SQL. Estimate tokens per unit, keep a running total within each partition, and use the total to number the chunks:

```sql
with units as (

    select
        call_id,
        turn_index,
        turn_text,
        ceil(length(turn_text) / 4.0) as token_estimate
    from {{ ref('stg_transcripts') }}

),

running_total as (

    select
        *,
        sum(token_estimate) over (
            partition by call_id
            order by turn_index
        ) - token_estimate as tokens_before
    from units

)

select
    *,
    floor(tokens_before / 512) as chunk_seq
from running_total
```

:::tip
Want smarter boundaries, like splitting by topic? You can. Do it upstream, then feed the results into your chunking step as units. Semantic splitting usually needs an AI call, so you give up the free, repeatable behavior above.
:::

### Overlap

If context is lost at the seams between chunks, you can repeat the last unit or two of the previous chunk at the start of the next. This costs extra tokens, so add it only if your searches miss answers that straddle a boundary.

### Keep lineage from the start

Every chunk should record which source rows it packed. This is non-negotiable. An agent will quote this context to a person, often to justify a decision. If a chunk forgets where it came from, nobody can trace the claim, and you can't rebuild that link later. You can only carry it forward.

### Adapter notes

Chunking is plain window SQL, so it behaves the same on Snowflake, Databricks, and BigQuery. The one place engines differ is ordered aggregation, such as building an ordered list of source row ids or stitching text together in order. Each engine spells that differently, so isolate it in one place instead of repeating it across models.

## Attach source metadata

A chunk needs to carry details about its source so you can filter, cite, and present it: a document title, a link back to the original, the participants on a call.

### Two readers, two forms

The same metadata serves two readers with different eyes:

| Reader | Sees | Needs metadata as |
|--------|------|-------------------|
| SQL | Columns | Columns, to filter, join, and build a citation link |
| Embedding model and LLM | Only the chunk's text | Text, written into the chunk |

### Our recommendations

- **Attach metadata in its own step, after chunking.** Attaching is a simple collapse and join. Chunking is the fragile step. Keep the simple concern out of the fragile one, so a change to metadata can never break your chunks.
- **Write metadata into the text and keep the columns.** Don't swap one for the other. A mode that moves metadata into the text forces SQL to parse it back out. Keep both, and each reader gets what it needs.
- **Count the extra tokens.** Metadata written into the text adds real tokens, so recompute your size estimate afterward. Otherwise you'll understate what the model reads and costs.
- **Treat all metadata columns the same in the transform.** The step that attaches metadata shouldn't know whether a field is a customer name or a citation link. You pass the list of columns, and it does the same thing for each.
- **Promote the citation link later.** In the serving layer, where many sources merge into one shape, a citation link earns its own guaranteed column. We cover that in [Embed and retrieve](/best-practices/how-we-context-engineer/4-embed-and-retrieve).

Here's what metadata written into a chunk's text looks like:

```text
title: Q3 renewal call
assignee: dana
---
<original chunk text follows>
```

### Adapter notes

Attaching metadata uses plain, portable SQL, so there's nothing adapter-specific to configure.

## What's next

Your text is now whole, bounded, and traceable. Next, you'll use a model to label, extract, and summarize it in [Enrich with AI](/best-practices/how-we-context-engineer/3-enrich-with-ai).
