---
title: "Prepare your text"
id: 3-prepare-your-text
description: Learn how to chunk raw text and attach source metadata so every piece of context stays whole and citable.
displayText: Prepare your text
hoverSnippet: Learn how to chunk raw text and attach source metadata.
---

Raw text is the source-conformed data of context engineering: shaped by systems you don't control, and too big or messy for an agent to use as-is. Preparing it is the first step, and the one everything else depends on.

Retrieval quality is decided before any AI runs. A chunk that splits a sentence in half, or mixes two customers' calls, isn't helpful for anyone and won't improve by the time it gets to the embedding model or LLM. This is because search over context works on _embeddings_: which are lists of numbers that capture what a piece of text _means_, so that similar meanings land close together. A chunk that fuses two unrelated thoughts embeds to a muddy point and helps no one. Chunk well and now you get embeddings worth searching.

In this section, you'll learn how to:

- Break long text into chunks that keep their meaning
- Carry source details onto every chunk so each one can cite its origin

## Chunking

A **chunk** is a piece of text small enough to embed (turn into a list of numbers that captures its meaning) and retrieve. Embedding models can only read so much at once, so a 90-minute transcript or a 40-page contract has to be broken up.

<Lightbox src="/img/best-practices/context-engineering/chunk-too-big.jpg" width="50%" title="Make sure your chunk isn't bigger than the embedding model's limit." />

### Pack, don't cut

It makes sense to use the approach of cutting the text every _N_ characters. But doing a blind cut can split a sentence or cut off a speaker's convo. And each half embeds to something that represents nothing.

We recommend **packing** instead. You work through the text in order, keeping a running token count. Each whole **unit** goes into the chunk it _starts_ in. A unit is the smallest piece of text you'll never split, like a speaker turn in a transcript or a sentence in a document.

<SimpleTable>

| Source | Unit |
|--------|------|
| Call transcript | One speaker turn |
| Contract, incident report, or CRM note | One sentence |
| Support ticket | The whole ticket. It's already one record, so there's nothing to chunk. |

</SimpleTable>

### Our recommendations

- **Dom't split a unit:** Meaning lives in whole thoughts. If two goals conflict, keep the one that protects meaning.
- **Treat the size limit as soft, and watch for big units:** Because units are never split, a unit that starts a chunk can push it over the limit. One very large unit makes an oversized chunk, which can exceed your embedding model's input limit. Chunking flags these rows with `exceeds_target`, and you can opt in to the `no_oversized_chunks` test to fail on them.
- **Don't cross a partition key:** A partition key is the column that identifies one source object, such as `call_id`. Chunks stay inside one call, so turns from different customers never end up together.
- **Make chunking deterministic and free:** Deterministic means the same input always produces the same chunks. Chunking runs over everything and sits upstream of every embedding, search, and test, so it must be cheap and repeatable. Skip AI calls here.
- **Estimate size, don't measure it:** Estimating tokens as characters divided by four is close enough for budgeting and needs no model.

Here's the idea in plain SQL. Estimate tokens per unit, keep a running total within each partition, and use the total to number the chunks:

<File name="models/context/chunk_by_hand.sql">

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

</File>

The package's [`chunk()` macro](https://github.com/dbt-labs/dbt-context-engineering/blob/main/macros/chunking/chunk.sql) does this for you and returns one row per chunk, with the chunk's text, its id, the source rows it packed, and a token estimate. Here's the shape of the result (the values are illustrative):

<SimpleTable>

| chunk_id | source_rows | token_estimate | chunk_text |
|----------|-------------|----------------|------------|
| `CT-99001::1` | The ids of the turns packed into this chunk | 96 | "Stephen: Jason, thanks for taking this. …" |
| `CT-99001::2` | The ids of the next turns | 88 | "Jason: It did. My question is whether you can handle our peak volume. …" |

</SimpleTable>

This example SQL uses 512 tokens, a typical target, and it's the package's default. Change it with the `chunk_target_tokens` var. The jaffle project uses 100 on purpose. Its sample documents are short, so 512 would never split anything.

If searches miss answers that straddle a chunk boundary, you can repeat the last unit or two of the previous chunk at the start of the next. It costs extra tokens, so add it only when you need it. In the package, that's the `chunk_overlap_tokens` var, which defaults to 0.

### Keep lineage from the start

**Lineage** means you can trace any piece of context back to the source rows it came from. Every chunk should record which source rows it packed. This is non-negotiable. An agent will quote this context to a person, often to justify a decision. If a chunk forgets where it came from, nobody can trace the claim, and you can't rebuild that link later. 

### Adapter notes

Chunking is plain SQL, so it behaves the same across engines, with a few things to know before you go incremental:

- `chunk_id` isn't a stable identity: Edit one unit and every later chunk boundary in that partition can move, so a chunk id can disappear.
- Incremental chunking replaces a whole partition (one call or document) at a time. Set `unique_key='partition_key'`, never `chunk_id`. A single edit can change how many chunks a call has, so replacing them together keeps old chunks from lingering.
- BigQuery has no incremental chunking: You rebuild the full table each run. That costs warehouse compute only, because chunking makes no AI calls and unchanged text isn't re-embedded.
- On Redshift, `source_rows` is an array of ids stored as text, not the original id type.

## Attach source metadata

A chunk needs to carry details about its source so you can filter, cite, and present it: a document title, a link back to the original, the participants on a call.

### Two readers, two forms

The same metadata serves two readers with different eyes:

<SimpleTable>

| Reader | Sees | Needs metadata as |
|--------|------|-------------------|
| SQL | Columns | Columns, to filter, join, and build a citation link |
| Embedding model and LLM | Only the chunk's text | Text, written into the chunk |

</SimpleTable>

### Our recommendations

- Attach metadata in its own step, after chunking. Attaching is a simple join, and chunking is the fragile step. Keeping them apart means a metadata change can't break your chunks.
- Keep metadata as columns. Add it to the text only if the LLM or embedding model needs it (`in_text=true`). Keep the metadata columns so you never have to parse metadata back out of the text.
- Recount tokens if you add metadata to the text. It adds tokens, so your size estimate is too low until you recompute it.
- Add the citation link in the knowledge base. When many sources merge into one shape, the link gets its own column. [Embed and retrieve](/best-practices/how-we-context-engineer/4-embed-and-retrieve) covers it.

Here's what metadata written into a chunk's text looks like:

```text
title: Q3 renewal call
assignee: ric
---
<original chunk text follows>
```

Attaching metadata uses plain, portable SQL, so there's nothing adapter-specific to configure.

## What's next

Your text is now whole, bounded, and traceable. Next, you'll make it searchable in [Embed and retrieve](/best-practices/how-we-context-engineer/4-embed-and-retrieve).
