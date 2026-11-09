---
title: "Keep context trustworthy"
id: 6-keep-context-trustworthy
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

Ordinary tests check shape: right type, in range, not null. They can't tell you whether a value is correct. A model can return a well-formed answer it made up (a **hallucination**), and every check still passes.

AI output fails in three ways:

<SimpleTable>

| Failure | What it looks like |
|---------|--------------------|
| Hallucinated evidence | The model reports a fact and attaches a supporting quote that appears nowhere in the source |
| Out-of-taxonomy labels | A classifier told to pick from `pain_point`, `requirement`, or `objection` returns `PROBLEM` |
| Silent regression | A prompt tweak or model upgrade quietly drops accuracy, and nothing turns red |

</SimpleTable>

## Check with code, not with another model

Checking is far cheaper than producing:

- To produce a grounded quote, you need a model. To check that a quote is grounded, you need a substring test.
- To produce a correct label, you need a model. To check a label is allowed, you need set membership.
- To score accuracy, you compare against a hand-labeled answer key.

Every check is exact string, set, or arithmetic logic: no model, no spend, no randomness. So these tests run on every pull request like any other dbt test.

## Three tests we recommend

The `dbt_context_engineering` package ships all three. The jaffle project doesn't wire them yet.

### Groundedness

A groundedness test fails any row whose evidence quote isn't actually in its source text. This is the highest-leverage check you can add. It turns a convention you already follow, carrying a verbatim quote with every extracted fact, from an honor system into an enforced rule.

<File name="models/context/ai/_context_ai.yml">

```yaml
models:
  - name: extracted_facts
    columns:
      - name: evidence
        data_tests:
          - dbt_context_engineering.grounded:
              source_text_column: chunk_text
```

</File>

Our recommendations:

- **Normalize case and whitespace by default:** Trivial formatting differences shouldn't fail a build.
- **Let a missing quote be null:** If a quote legitimately doesn't exist, null is correct, and the test shouldn't flag it. This only works if the field is optional in your schema, as covered in [Enrich with AI](/best-practices/how-we-context-engineer/5-enrich-with-ai).
- **Know its limit:** A passing test proves the quote is real. It doesn't prove the model read it correctly.

### Conformance

A conformance test fails any row whose label isn't in the schema's allowed values. It catches silent failures, such as an engine dropping your allowed-value list.

You write it as a one-line singular test, a SQL file in your `tests/` folder that returns the failing rows (refer to [data tests](/docs/build/data-tests)):

<File name="tests/assert_content_types_conform.sql">

```sql
{{ dbt_context_engineering.conforms_to_schema(
    ref('call_transcripts_classify'), 'content_type', 'jaffle_content_type', 'v1'
) }}
```

</File>

Our recommendations:

- **Test a flattened scalar:** Pull the field out of the structured result first, as described in [Enrich with AI](/best-practices/how-we-context-engineer/5-enrich-with-ai) <Lifecycle status="beta" />. Then the test reads the same plain value on every engine.
- **Read the allowed values from the schema:** Don't copy the label list into the test. One definition, many uses.
- **Keep it a singular test:** Looking up a versioned schema by name can't be done in a generic test. Write down why, so the next person doesn't "tidy" it into a generic test and quietly break it.

### Evaluation

An evaluation test scores your predictions against a hand-labeled **golden set**: accuracy overall, plus precision and recall for each label. Set a threshold on a metric and you have a gate: if a prompt tweak or model upgrade drops accuracy below the bar, the build fails.

The package's `eval` macro takes a table with a predicted column and an expected column, and returns one row per metric:

<File name="models/eval_metrics.sql">

```sql
{{ dbt_context_engineering.eval(ref('predictions'), 'predicted_label', 'expected_label') }}
```

</File>

Then a singular test turns a metric into a gate. This one fails the build if overall accuracy drops below 90%:

<File name="tests/assert_accuracy_above_bar.sql">

```sql
select *
from {{ ref('eval_metrics') }}
where metric = 'accuracy'
  and label = '__overall__'
  and value < 0.9
```

</File>

Our recommendations:

- **Build a golden set early:** A small hand-labeled set beats none. Without it, you can't tell an improvement from a regression.
- **Gate every prompt and model change on it:** Regression is silent by nature. A gate is how it becomes loud.
- **Keep the set stable:** Add to it as you find edge cases, but don't quietly relabel to make a new prompt look better.

### Chunk size

Opt in to the `no_oversized_chunks` test to flag any chunk over your size target. It's a data-quality signal about your source text, such as one very long unit, not a bug in your chunking.

## Prove your tests can fail

A test that has only ever passed hasn't been shown to work. Validate in both directions: it passes on good data, and it fails on planted bad data. Deliberately add a hallucinated quote and an invented label, and confirm each one turns the build red.

## Carry lineage at every stage

When an agent says "Acme is a churn risk," the only useful follow-up is "how do you know?" The answer has to point at the exact source: this ticket, that call turn, this sentence.

Tracing a value back to its source is lineage. For context an AI repeats, it's the **citation**.

Our core rule: **every piece of context carries enough identity, at every stage, to trace it back to the original row, and extracted facts carry the verbatim span that supports them.**

<SimpleTable>

| Stage | What carries lineage |
|-------|----------------------|
| Chunking | The ids of the source rows packed into each chunk |
| Extraction | A required-or-optional `evidence` field with the verbatim quote |
| Knowledge base | The source type and source id on every row |
| Retrieval | Those ids carried into every result |

</SimpleTable>

A retrieved hit can then say: this came from ticket T-42, and here's the exact sentence.

Two granularities matter, and you need both:

- **Row-level lineage** says _where_ a fact came from. It doesn't prove the fact is in that row, because a model can cite the right ticket and still invent the detail.
- **Span-level evidence** says _what in the row_ supports it. Because it's literal text, you can machine-check it, which is what makes the groundedness test possible.

Design lineage in on day one, because it can't be rebuilt later. Once a chunk forgets which sentences it packed, no later step can recover that. The cost is small: a few extra columns and an evidence field.

## Adapter notes

<SimpleTable>

| Topic | What to know |
|-------|--------------|
| Structured result type | Snowflake returns a `VARIANT`, Databricks a `JSON` string, and BigQuery a `STRUCT`. Flatten to a scalar before testing. |
| Allowed values | BigQuery drops enum constraints from its output schema, so conformance tests matter most there. |
| Warehouse access | These checks are deterministic, so you can run them without warehouse credentials against sample data, for example on DuckDB. |

</SimpleTable>

## What's next

Next, [Control cost](/best-practices/how-we-context-engineer/7-control-cost) shows how to limit what AI calls spend and record what each run used.
