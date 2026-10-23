---
title: "Keep context trustworthy"
id: 5-keep-context-trustworthy
description: Learn how to test AI output with deterministic checks and keep lineage and citations intact end to end.
displayText: Keep context trustworthy
hoverSnippet: Learn how to test AI output and keep every claim traceable.
---

Trusted metrics earned their trust from tests. Context has to earn it the same way. And asking a model to grade another model isn't a test. It's a second opinion, billed by the token.

In this section, you'll learn how to:

- Test AI output with checks that need no model and cost nothing to run
- Gate prompt and model changes so quality can't slip quietly
- Keep every claim traceable to the exact source it came from

## Why do you need a new kind of test?

The rest of your pipeline answers "is this data shaped right?" Right type, in range, not null. None of that answers "is it correct?"

AI output fails in ways ordinary tests never probe. A value can be well-formed, the right type, and non-null, and still be something the model made up. The checks pass while the content is a lie.

Models fail in three characteristic ways:

| Failure | What it looks like |
|---------|--------------------|
| Hallucinated evidence | The model reports a fact and attaches a supporting quote that appears nowhere in the source |
| Out-of-taxonomy labels | A classifier told to pick from `pain_point`, `requirement`, or `objection` returns `PROBLEM` |
| Silent regression | A prompt tweak or model upgrade quietly drops accuracy, and nothing turns red |

## Check with code, not with another model

Here's the idea that makes this practical: **checking is far cheaper than producing.**

- To produce a grounded quote, you need a model. To check that a quote is grounded, you need a substring test.
- To produce a correct label, you need a model. To check a label is allowed, you need set membership.
- To score accuracy, you compare against a hand-labeled answer key.

Every check is exact string, set, or arithmetic logic. No model, no spend, no randomness. That's what lets these tests run on every pull request like any other dbt test, instead of being an expensive, occasional, human-run ritual.

Wherever you can, verify AI output with non-AI checks.

## Three tests we recommend

### Groundedness

A groundedness test fails any row whose evidence quote isn't actually in its source text. This is the highest-leverage check you can add, because it turns a convention you already follow, carrying a verbatim quote with every extracted fact, from an honor system into an enforced rule. A required-but-unchecked field is a false sense of safety.

```yaml
columns:
  - name: evidence
    data_tests:
      - grounded:
          source_text_column: chunk_text
```

Our recommendations:

- **Normalize case and whitespace by default.** Trivial formatting differences shouldn't fail a build.
- **Let a missing quote be null.** If a quote legitimately doesn't exist, null is correct, and the test shouldn't flag it. This only works if the field is optional in your schema, as covered in [Enrich with AI](/best-practices/how-we-context-engineer/3-enrich-with-ai).
- **Know its limit.** A passing test proves the quote is real. It doesn't prove the model read it correctly.

### Conformance

A conformance test fails any row whose label isn't in the schema's allowed values. It's the check that catches silent failures: when an engine drops your allowed-value list, the call succeeds and returns well-formed output, and only this test notices the labels are wrong.

Our recommendations:

- **Test a flattened scalar.** Pull the field out of the structured result first, using the accessor from [Enrich with AI](/best-practices/how-we-context-engineer/3-enrich-with-ai) <Lifecycle status="beta" />. Then the test reads the same plain value on every engine.
- **Read the allowed values from the schema.** Don't copy the label list into the test. One definition, many uses.
- **Write it as a singular test in dbt.** Looking up a versioned schema by name can't be done in a generic test. Let the platform's constraint set the shape, and write down why, so the next person doesn't "tidy" it back into a generic test and quietly break it.

### Evaluation

An evaluation test scores your predictions against a hand-labeled **golden set**: accuracy overall, plus precision and recall for each label. Put a threshold on a metric and you have a gate. If a prompt tweak or model upgrade drops accuracy below the bar, the build fails.

Our recommendations:

- **Build a golden set early.** A small hand-labeled set beats none. Without it, you can't tell an improvement from a regression.
- **Gate every prompt and model change on it.** Regression is silent by nature. A gate is how it becomes loud.
- **Keep the set stable.** Add to it as you find edge cases, but don't quietly relabel to make a new prompt look better.

### Chunk size

Opt in to a test that flags any chunk over your size target. Treat it as a data-quality signal about your source text, such as one very long unit, not as a bug in your chunking.

## Prove your tests can fail

A test that has only ever passed hasn't been shown to work. Validate in both directions:

- **Passes on good data.**
- **Fails on planted bad data.** Deliberately add a hallucinated quote, an invented label, and a wrong metric, and confirm each one turns the build red.

This is also why conformance is worth running early. In our own cross-engine testing, one warehouse silently dropped the allowed values, and every conformance check failed 10 out of 10, while the extraction itself was perfect. Only looking at outputs, not contracts, exposed it.

## Carry lineage at every stage

When an agent says "Acme is a churn risk," the only useful follow-up is "how do you know?" The answer has to point at the exact source: this ticket, that call turn, this sentence.

In analytics, tracing a value back to where it came from is lineage. For context an AI reads and repeats, the same trace is the **citation**.

Our core rule: **every piece of context carries enough identity, at every stage, to trace it back to the original row, and extracted facts carry the verbatim span that supports them.**

| Stage | What carries lineage |
|-------|----------------------|
| Chunking | The ids of the source rows packed into each chunk |
| Extraction | A required-or-optional `evidence` field with the verbatim quote |
| Knowledge base | The source type and source id on every row |
| Retrieval | Those ids carried into every result |

A retrieved hit can then say: this came from ticket T-42, and here's the exact sentence. That's the difference between an answer and a defensible answer.

Two granularities matter, and you need both:

- **Row-level lineage** says _where_ a fact came from. It doesn't prove the fact is in that row, because a model can cite the right ticket and still invent the detail.
- **Span-level evidence** says _what in the row_ supports it. Because it's literal text, you can machine-check it, which is what makes the groundedness test possible.

**Design lineage in on day one.** Lineage is destroyed, not derived. The moment a chunk forgets which sentences it packed, that information is gone, and no later step can recover it. You can only carry provenance forward. The cost is small: a few extra columns and an evidence field. Pay it everywhere, rather than regret its absence later.

## Adapter notes

The tests are mostly portable, so there's little to configure.

| Topic | What to know |
|-------|--------------|
| Structured result type | Snowflake returns a `VARIANT`, Databricks a `JSON` string, and BigQuery a `STRUCT`. Flatten to a scalar before testing. |
| Substring and whitespace checks | The one place engines differ. BigQuery uses `STRPOS` where others use `POSITION ... IN`, so isolate these behind one interface. |
| Allowed values | BigQuery drops enum constraints from its output schema, so conformance tests matter most there. |
| Warehouse access | These checks are deterministic, so you can run them without warehouse credentials against sample data, for example on DuckDB. |

## What's next

Your context is correct and traceable. The last piece is cost: AI calls aren't free to re-run, so [Control cost](/best-practices/how-we-context-engineer/6-control-cost) shows how to build in limits and a record of what each run spent.
