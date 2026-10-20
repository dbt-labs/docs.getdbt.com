---
title: "How we do context engineering"
id: 1-guide-overview
description: Learn how we model the data AI agents read, and why it's the next job for analytics engineers.
displayText: How we do context engineering
hoverSnippet: Learn how we model the data AI agents read.
---

## Why does context need engineering?

For a decade, we modeled data for one reader: the dashboard. Every model, test, and metric existed so a person could look at a number and trust it.

That work succeeded. But a metric is thousands of rows squashed into something you can read at a glance, and you can't un-squash it. Every number on a dashboard sets off the same three questions: why did it move, which ones, and what do we do about it. The chart can't answer any of them, so they become a ticket in the data team's queue.

The detail was never deleted. It's sitting in your warehouse, or could easily land there: call transcripts, support tickets, CRM notes, contracts, and emails. Nobody modeled it because there's no bar chart for a call transcript.

AI agents are the first readers that can use that detail. But they can only be as good as what you hand them. Context engineering is the practice of modeling data for that new reader, with the same discipline you already apply to metrics: staging, tests, docs, and one governed DAG.

## What is context?

Context is the information an AI agent reads to do its job. Good context is:

- **Governed.** Someone owns it, and changes are reviewed.
- **Tested.** You can prove it's correct, not just hope.
- **Traceable.** Every claim points back to the source it came from.

Context isn't just your semantic layer. They work side by side:

| Layer | What it holds | Example question |
|-------|---------------|------------------|
| Semantic layer | Your metrics and how they're defined | "What was on-time delivery last quarter?" |
| Context | Your unstructured and semi-structured data, modeled so agents can find and cite it | "Why did on-time delivery slip, and which accounts drove it?" |

Your metrics tell an agent _what_ happened. Context tells it _why_.

## What counts as unstructured data?

Anything that carries meaning but doesn't fit neatly in rows and columns. If you only picture call centers, you're thinking too small. Context engineering is a new way to think about the data you already have, not one use case.

| Source | What's hiding in it |
|--------|---------------------|
| Call transcripts | The reason a customer is unhappy, in their own words |
| Support tickets | Patterns in what's breaking, and for whom |
| CRM notes | Account history that never made it into a field |
| Contracts | What you actually committed to |
| Emails | Decisions and context that live nowhere else |
| Runbooks and internal docs | Processes nobody has written down twice |

## Learning goals

This guide has three main goals:

- Cover our most up-to-date recommendations for modeling context
- Illustrate each recommendation with an example
- Explain _why_ we recommend it, so you can decide when to deviate

You should walk away able to turn a pile of raw text into context an agent can search, cite, and trust.

:::info
This is a young discipline, and this guide is a starting point. The patterns are tool-agnostic, so they apply whichever warehouse, models, and tools you use. Where an adapter behaves differently, we call it out in a note. Keep your own conventions if they fit your team better. Just write them down and stay consistent.
:::

### Adapter notes

Every major warehouse now exposes AI as SQL functions, but each one names and shapes them differently. In practice, about 80% of the work maps cleanly across engines. The other 20% is where adapter notes come in. We cover Snowflake, Databricks, and BigQuery.

| Operation | What it does | Snowflake | Databricks | BigQuery |
|-----------|--------------|-----------|------------|----------|
| Generate | Produces free-form text | `AI_COMPLETE` | `ai_query` | `AI.GENERATE` |
| Classify | Picks one label from a fixed set | `AI_CLASSIFY` | `ai_classify` | `AI.GENERATE` |
| Extract | Pulls typed fields out of text | `AI_COMPLETE` | `ai_query` | `AI.GENERATE` |
| Embed | Turns text into a vector | `AI_EMBED` | Serving endpoint | `AI.EMBED` |

Our advice: make the differences explicit in configuration, such as which model each function uses, rather than hoping the engine infers them.

### Feature status

Not every pattern is equally proven. We mark the ones still being hardened with <Lifecycle status="beta" /> so you know what to expect. Free-form generation, typed extraction, and group-level reasoning are beta today, so use them and expect the edges to move.

## Example project

This guide uses a fictional logistics company called Jaffle Logistics. Its customer story is scattered across roughly eight disconnected systems: tickets, call transcripts, incident reports, contracts, and more.

The question we keep asking: _"What's driving late deliveries for this account?"_ The answer isn't in any one system, which is exactly why this makes a good example.

## Guide structure overview

Context moves through a pipeline, and the guide follows it:

1. **Prepare your text.** Break raw text into pieces an agent can retrieve without losing meaning, and attach the source details so every piece can cite where it came from.
2. **Enrich with AI.** Use a model to label, extract, or summarize each piece, with prompts managed as versioned code.
3. **Embed and retrieve.** Turn text into searchable vectors, keep them fresh, and search across sources at once.
4. **Keep context trustworthy.** Test AI output the way you test any other model, and keep lineage and citations intact.
5. **Control cost.** AI calls aren't free to re-run, so build in limits and a record of what each run spent.

Three ideas show up on every page:

- **Context is modeled, not dumped.** Raw text in a vector store isn't context. Modeled text is.
- **Lineage is never optional.** Every piece of context carries enough identity to trace it back to its source.
- **Testing applies to AI output too.** Checking an answer is cheaper and more reliable than generating one.
