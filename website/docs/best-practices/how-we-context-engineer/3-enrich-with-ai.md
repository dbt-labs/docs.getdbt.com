---
title: "Enrich with AI"
id: 3-enrich-with-ai
description: Learn how to use a model to label, extract, and summarize your text, with prompts managed as versioned code.
displayText: Enrich with AI
hoverSnippet: Learn how to label, extract, and summarize text with a model.
---

Your text is chunked and traceable. Enrichment is where a model reads each piece and adds meaning: a label, a set of facts, or a summary. The result is new columns you can filter on, test, and search by.

In this section, you'll learn how to:

- Run a model as an ordinary transformation
- Choose the right operation for the job
- Manage prompts and output shapes as versioned code
- Read the model's answer back out the same way on every warehouse

## Treat inference as a transformation

The instinct most teams bring is to pull rows into a notebook, call an API in a loop, and write the results back. It works, but the AI step now sits outside everything you've built: it's untested, unversioned, and has no lineage. It also moves your data out of the warehouse.

Warehouses now expose AI as SQL functions. That makes a different pattern possible, and it's the one we recommend: **an AI call is just a column expression**. You call the model from SQL, one row at a time, and the answer is a new column in a model that dbt builds like any other.

You get three things for free:

- **Governance.** The AI step inherits version control, code review, tests, lineage, and scheduling.
- **Data stays put.** Nothing is exported, so there's no second copy to secure.
- **Clean lineage.** One row in, one answer out. Incremental builds work, and so do cost controls (see [Control cost](/best-practices/how-we-context-engineer/6-control-cost)).

We recommend running the model **per row**, not stuffing many rows into one giant prompt. A giant prompt breaks the one-to-one link between input and output, doesn't work with incremental builds, and can blow past the model's context window.

## Choose an operation

Context engineering runs on a small vocabulary. There are four row-level operations and one group-level operation, and picking the right one is most of the skill:

| Operation | Returns | Output shape defined by | Use it to |
|-----------|---------|------------------------|-----------|
| Classify | One label | Required. The allowed values are the labels. | Put each row in a bucket |
| Extract | A record with several fields | Required | Pull out facts that are present in the text, with a quote you can verify |
| Generate | Free text, or a structured object | Optional | Summarize, rewrite, or answer |
| Embed | A vector | None. You pin a model. | Make text searchable by meaning (covered in [Embed and retrieve](/best-practices/how-we-context-engineer/4-embed-and-retrieve)) |
| Aggregate | One answer per group | None | Reason across every row in a group at once |

A quick way to keep them straight: classify gives you the bucket, extract gives you the fields (plus a quote), generate gives you whatever you describe, and embed gives you the coordinates for search.

### Classify

Classify picks exactly one label from a fixed set. Use it when you have a closed list of categories, such as whether a chunk is an account assessment, a weather disruption, a handling error, or routine status.

Classification is the highest-value enrichment step, because it makes search precise. We cover why in [Embed and retrieve](/best-practices/how-we-context-engineer/4-embed-and-retrieve).

### Extract <Lifecycle status="beta" />

Extract pulls typed facts out of the text into fields. Use it when you need several facts at once, such as the account, the stated problem, and the date.

Every extracted fact should carry an `evidence` field: the verbatim quote that supports it. That quote is what makes the fact checkable (see [Keep context trustworthy](/best-practices/how-we-context-engineer/5-keep-context-trustworthy)).

### Generate <Lifecycle status="beta" />

Generate produces open-ended output: a summary, a rewrite, or an answer. Reach for it when no label or field set fits. Because the output is free-form, it's the hardest operation to test, so prefer classify or extract when either would do.

### Aggregate <Lifecycle status="beta" />

Aggregate asks a model to reason across every row in a `group by` group instead of row by row, such as summarizing a whole call transcript or rolling up sentiment for an account.

This is the operation where warehouses diverge the most. See [adapter notes](#adapter-notes) below.

## Treat prompts and schemas as code

A prompt isn't documentation. It's an input that changes your output, exactly like a SQL query. A one-word change can flip every downstream label.

The **output schema** is the same. It declares the shape the model must return: field names, types, and allowed values. Together, a prompt and a schema turn free-form prose into a typed object per row you can store and query. That's what lets a model act as a data transformation instead of a chat window.

### Our recommendations

- **Version prompts and schemas like database migrations.** Each version is an immutable, named artifact, such as `v3`. To improve a prompt, write `v4`. Never edit a released version in place.
- **Reference an explicit version every time.** There's no "latest". A model on `v3` stays on `v3` until you deliberately bump it, so changes roll out and roll back one model at a time.
- **Keep prompts where they show up in a pull request.** If a prompt lives in a warehouse console under a mutable pointer, you can't answer "what changed, and when?"
- **Make the exact prompt visible in compiled SQL.** Anyone reading the DAG or the compiled query should be able to see precisely what was sent to the model.
- **Define each taxonomy once.** The allowed labels belong in the schema, and everything else (the classifier, your tests, the prompt) should derive from it. A label list copied into two places will silently drift.

Here's a schema that follows these recommendations:

```json
{
  "type": "object",
  "properties": {
    "signal": {
      "type": "string",
      "enum": ["pain_point", "requirement", "objection", "buying_signal", "other"]
    },
    "evidence": { "type": "string" }
  },
  "required": ["signal"]
}
```

Two things to notice:

- **`signal` is required, `evidence` is optional.** A classification always resolves to a label, with `other` as the floor. A supporting quote might genuinely not exist, and if you mark a field required that the model can't fill, it will make something up. An invented quote is an ungrounded citation, which is exactly what you're trying to avoid.
- **The `enum` is the one source of truth** for the label set.

## Read the answer back the same way everywhere

Calling the model is only half of portability. The other half is what comes back. Ask three warehouses for the same structured result, and you get three different types. If you don't deal with it, every downstream `where`, join, and test has to branch by engine.

Our recommendation: **normalize once, right after the call.** Use a thin accessor layer that reads each engine's native shape and hands back a plain scalar. Past that boundary, nothing downstream needs to know which warehouse produced the value.

- **Classify returns a plain label string.** That's the contract: give me the label, not an engine object.
- **Flatten structured results into typed columns right away.** Pull each field out as its own column, then treat it as an ordinary scalar.

## Adapter notes

The operations are the same everywhere, but the warehouses behave differently in ways that matter. Check these before you ship.

| Topic | Snowflake | Databricks | BigQuery |
|-------|-----------|------------|----------|
| Structured result type | `VARIANT` object | `JSON` string | `STRUCT` |
| Enforces the allowed values in the schema | Yes | Yes | No. Enums are silently dropped. |
| Group-level aggregation | Native | No native function | Native |

**BigQuery drops enum constraints.** BigQuery's output schema can't express an allowed-value list, so it quietly turns the field into a plain string. The call succeeds and returns well-formed output, but the model never saw your labels and invents its own, like `PROBLEM` or `Discovery Question` instead of `pain_point`. Nothing errors, so nothing turns red.

:::caution
Silent failures are the most dangerous kind. Don't assume a structured-output contract is enforced. Check what each engine actually returns.
:::

Here's how to handle it:

- **Put the labels in the prompt too, on BigQuery.** Generate that instruction from the schema's `enum` at compile time, so the labels still live in one place. You don't need it on Snowflake and Databricks, where the schema already enforces them, and adding it there only adds noise to the model's input.
- **Bind, don't steer.** A schema `enum` binds the output so it can't leave the set. A prompt instruction only steers it. Use binding wherever the engine supports it, and steering where it doesn't.

**On Snowflake, build extraction on the same function as generation.** Snowflake has a separate extraction-only function, but it can't enforce an allowed-value list, and it returns the string `"None"` for any field it can't fill. That's not a valid label and not a quote from your text. The generate function with a response format binds the enum instead, which matches how Databricks and BigQuery already work.

**Aggregation differs the most** <Lifecycle status="beta" />:

- **Models:** Snowflake picks the model internally, so you can't choose one. Databricks and BigQuery let you.
- **Row order:** Snowflake respects an `order by` placed ahead of the `group by`. BigQuery ignores input order entirely.
- **Oversized groups:** Snowflake and BigQuery handle a group bigger than the model's context window for you. Databricks has no native aggregate, so you collapse the group in SQL and pass it to the model yourself. Put a token ceiling in front of it so an oversized group fails the build loudly instead of being silently truncated.

**Name your models explicitly.** Set the model for each operation in configuration rather than relying on defaults, so the engine never infers a choice for you.

## What's next

Your text now has labels, facts, and summaries. Next, you'll make it searchable in [Embed and retrieve](/best-practices/how-we-context-engineer/4-embed-and-retrieve).
