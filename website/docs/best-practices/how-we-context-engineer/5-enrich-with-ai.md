---
title: "Enrich with AI"
id: 5-enrich-with-ai
description: Learn how to use a model to label, extract, and summarize your text, with prompts managed as versioned code.
displayText: Enrich with AI
hoverSnippet: Learn how to label, extract, and summarize text with a model.
---

Enrichment is where a model reads each piece and adds meaning: a label, a set of facts, or a summary. This gives you new columns you can filter on, test, and search by. Classify is the precision step on top of chunk → embed → search.

In this section, you'll learn how to:

- Run a model as an ordinary transformation
- Choose the right operation for the job
- Manage prompts and output shapes as versioned code
- Read the model's answer back out the same way on every warehouse

Stuck on a term? Check the [glossary](/best-practices/how-we-context-engineer/8-glossary).

## Treat inference as a transformation

The instinct most teams bring is to pull rows into a notebook, call an API in a loop, and write the results back. It works, but the AI step now sits outside everything you've built: it's untested, unversioned, and has no lineage. It also moves your data out of the warehouse.

Warehouses now expose AI as SQL functions, so an AI call is just a column expression. You call the model from SQL, one row at a time, and the answer is a new column in a model that dbt builds like any other. That gives you two things for free:

- Governance which allows the AI step to inherit version control, code review, tests, lineage, and scheduling.
- Data remains so nothing is exported and there's no second copy to secure.

Run the model _per row_, not with many rows stuffed into one giant prompt. A giant prompt breaks the one-to-one link between input and output, doesn't work with incremental builds, and can blow past the model's context window (how much text it can read at once). Per-row calls also keep cost controls simple (read [Control cost](/best-practices/how-we-context-engineer/7-control-cost) for more info).

## Choose an operation

Context engineering runs on a small vocabulary. There are four row-level operations and one group-level operation, and picking the right one is most of the skill:

<SimpleTable>

| Operation | Package macro | Returns | Output shape defined by | Use it to |
|-----------|---------------|---------|------------------------|-----------|
| Classify | `classify()` | One label | Required. The allowed values are the labels. | Put each row in a bucket |
| Extract | `extract()` | A record with several fields | Required | Pull out facts that are present in the text, with a quote you can verify |
| Generate | `generate()` | Free text, or a structured object | Optional | Summarize, rewrite, or answer |
| Embed | `embed()` | A vector | None. You pin a model. | Make text searchable by meaning (covered in [Embed and retrieve](/best-practices/how-we-context-engineer/4-embed-and-retrieve)) |
| Aggregate | `ai_agg()` | One answer per group | None | Reason across every row in a group at once |

</SimpleTable>

Every major warehouse exposes these as SQL functions, but each names them differently:

<SimpleTable>

| Operation | Snowflake | Databricks | BigQuery |
|-----------|-----------|------------|----------|
| Generate | [`AI_COMPLETE`](https://docs.snowflake.com/en/sql-reference/functions/ai_complete) | [`ai_query`](https://docs.databricks.com/aws/en/sql/language-manual/functions/ai_query) | [`AI.GENERATE`](https://docs.cloud.google.com/bigquery/docs/reference/standard-sql/bigqueryml-syntax-ai-generate) |
| Classify | [`AI_CLASSIFY`](https://docs.snowflake.com/en/sql-reference/functions/ai_classify) | [`ai_classify`](https://docs.databricks.com/aws/en/sql/language-manual/functions/ai_classify) | [`AI.GENERATE`](https://docs.cloud.google.com/bigquery/docs/reference/standard-sql/bigqueryml-syntax-ai-generate) |
| Extract | [`AI_COMPLETE`](https://docs.snowflake.com/en/sql-reference/functions/ai_complete) | [`ai_query`](https://docs.databricks.com/aws/en/sql/language-manual/functions/ai_query) | [`AI.GENERATE`](https://docs.cloud.google.com/bigquery/docs/reference/standard-sql/bigqueryml-syntax-ai-generate) |
| Embed | [`AI_EMBED`](https://docs.snowflake.com/en/sql-reference/functions/ai_embed) | [Serving endpoint](https://docs.databricks.com/aws/en/machine-learning/model-serving/query-embedding-models) | [`AI.EMBED`](https://docs.cloud.google.com/bigquery/docs/reference/standard-sql/bigqueryml-syntax-ai-embed) |
| Aggregate | [`AI_AGG`](https://docs.snowflake.com/en/sql-reference/functions/ai_agg) | No native function. The package builds it with [`ai_query`](https://docs.databricks.com/aws/en/sql/language-manual/functions/ai_query). | [`AI.AGG`](https://docs.cloud.google.com/bigquery/docs/reference/standard-sql/bigqueryml-syntax-ai-agg) |

</SimpleTable>

You don't write these by hand. In your models, you call the package macro from the first table, and it writes your warehouse's function for you. The examples on this page use Snowflake. On Databricks or BigQuery, the same macro call works. Only the function it writes changes.

### Classify

Classify sorts each chunk into one bucket from a list you write, like `weather_disruption` or `routine_status`.

Who does the sorting? An AI model, through your warehouse's built-in AI function (on Snowflake, `AI_CLASSIFY`). You don't label anything by hand. You write the list of labels and what each one means, and the package's `classify()` macro sends each chunk to the model.

#### Create your labels

1. **Pick your labels.** Keep the list short, and make each label a business category. Include a catch-all, like `routine_status`, so every chunk has somewhere to go.
2. **Write them in a macro file.** Create a `.sql` file in your project's `macros/` folder. It holds two macros. One has the instructions for the model, with each label and what it means. The other has the list of allowed labels. The macro names include a version, like `v1`.

    <File name="macros/prompts/jaffle_content_type.sql">

    ```sql
    {% macro prompt__jaffle_content_type__v1() -%}
    {%- raw -%}
    Classify the text below into exactly one label.

    weather_disruption: caused by severe weather (a storm, ice, snow).
    handling_or_warehouse_error: a warehouse or loading mistake.
    routine_status: a routine update with no problem to report.
    account_assessment: a review of how the account or service is performing overall.

    Text:
    {{ input }}
    {%- endraw -%}
    {%- endmacro %}

    {% macro schema__jaffle_content_type__v1() -%}
    {%- raw -%}
    { "type": "object",
      "properties": { "content_type": { "type": "string",
       "enum": ["weather_disruption", "handling_or_warehouse_error", "routine_status", "account_assessment"] } },
      "required": ["content_type"] }
    {%- endraw -%}
    {%- endmacro %}
    ```

    </File>

3. **Call the package's `classify()` macro in a model.** Name your prompt once in `meta.ai_prompt`, and the model reads it from there. The cost guard reads the same name (refer to [Control cost](/best-practices/how-we-context-engineer/7-control-cost)). Set `materialized='table'` too. The package refuses to run an AI call in a view, which would re-bill on every read ([why](/best-practices/how-we-context-engineer/7-control-cost#dont-use-views-for-ai-models)):

    <File name="models/context/ai/call_transcripts_classify.sql">

    ```sql
    {{ config(
        materialized='table',
        meta={'ai_prompt': {'name': 'jaffle_content_type', 'version': 'v1'}}
    ) }}

    select
        chunk_id,
        {{ dbt_context_engineering.classify(
            'chunk_text',
            prompt=dbt_context_engineering.config_prompt(),
            output_schema=dbt_context_engineering.config_schema()
        ) }} as content_type
    from {{ ref('call_transcripts_hashed') }}
    ```

    </File>

4. **Run it and check a few rows.** Like any AI step, this bills your warehouse, so start small (refer to [Control cost](/best-practices/how-we-context-engineer/7-control-cost)):

    ```bash
    dbt build --select call_transcripts_classify --vars '{"ai_functions_enabled": true}'
    dbt show --select call_transcripts_classify --limit 10
    ```

Each chunk now has one label (the values here are illustrative):

<SimpleTable>

| chunk_text | content_type |
|------------|--------------|
| "Reviewed with dispatch." | `routine_status` |
| "Truck slid on ice during the storm and missed the delivery window." | `weather_disruption` |
| "This quarter's review: on-time delivery has slipped for three months." | `account_assessment` |

</SimpleTable>

Labels make search precise. Without them, short boilerplate chunks crowd the top results (check out [Embed and retrieve](/best-practices/how-we-context-engineer/4-embed-and-retrieve#embedding-buys-recall-classification-buys-precision)). With them, you filter search to the category your question is about. In our test, every result in the top 10 became real account content.

#### Change your labels

Treat your labels like any other model: someone owns them, and changes go through a pull request.

- **Never edit `v1`: Copy both macros to `v2`, make your change, and change the version in `meta.ai_prompt` to `v2`.
- Change both macros together: The instructions and the list need the same labels. A test catches a label that isn't on the list (refer to [Keep context trustworthy](/best-practices/how-we-context-engineer/6-keep-context-trustworthy)).
- Rebuild: Classify relabels every chunk on each build, so it bills again.
- Check accuracy: Keep a small set of chunks you've labeled yourself, and test the model's labels against them.
- Revisit the list when your questions change: A list built for today's questions may not fit tomorrow's.

:::caution Different labels when you rerun
The same text can get a different label when you rerun the build. Tests catch that drift, but they don't prevent it.
:::

### Extract <Lifecycle status="beta" />

Extract pulls typed facts out of the text into fields. Use it when you need several facts at once, such as the account, the stated problem, and the date.

Every extracted fact should carry an `evidence` field: the verbatim quote that supports it. That quote is what makes the fact checkable (refer to [Keep context trustworthy](/best-practices/how-we-context-engineer/6-keep-context-trustworthy)). Mark `evidence` as optional in your schema. A quote might genuinely not exist, and a required field the model can't fill invites an invented quote, which is an ungrounded citation.

On Snowflake, `extract()` runs `AI_COMPLETE` with your schema. Write the prompt macro the same way you did for classify. The schema is where Extract differs, because it lists fields instead of labels:

<File name="macros/prompts/jaffle_incident_facts.sql">

```sql
{% macro schema__jaffle_incident_facts__v1() -%}
{%- raw -%}
{ "type": "object",
  "properties": {
    "account": { "type": "string" },
    "problem": { "type": "string" },
    "evidence": { "type": "string" } },
  "required": ["problem"] }
{%- endraw -%}
{%- endmacro %}
```

</File>

Then call `extract()` in a model, the same way you called `classify()`:

<File name="models/context/ai/incident_facts.sql">

```sql
{{ config(
    materialized='table',
    meta={'ai_prompt': {'name': 'jaffle_incident_facts', 'version': 'v1'}}
) }}

select
    chunk_id,
    {{ dbt_context_engineering.extract(
        'chunk_text',
        prompt=dbt_context_engineering.config_prompt(),
        output_schema=dbt_context_engineering.config_schema()
    ) }} as facts
from {{ ref('chunk_transcripts') }}
```

</File>

Set the `model_extract` var (or `model_generate`) to a model your Snowflake account can use.

### Generate <Lifecycle status="beta" />

Generate produces open-ended output: a summary, a rewrite, or an answer. Reach for it when no label or field set fits. Because the output is free-form, it's the hardest operation to test, so prefer classify or extract when either would do.

On Snowflake, `generate()` runs `AI_COMPLETE`. It takes a prompt macro like the one for classify, with no schema needed:

<File name="models/context/ai/call_summaries.sql">

```sql
{{ config(
    materialized='table',
    meta={'ai_prompt': {'name': 'jaffle_call_summary', 'version': 'v1'}}
) }}

select
    chunk_id,
    {{ dbt_context_engineering.generate(
        'chunk_text',
        prompt=dbt_context_engineering.config_prompt()
    ) }} as summary
from {{ ref('chunk_transcripts') }}
```

</File>

Set the `model_generate` var to a model your Snowflake account can use.

### Aggregate <Lifecycle status="beta" />

Aggregate asks a model to reason across every row in a `group by` group instead of row by row, such as summarizing a whole call transcript or rolling up sentiment for an account.

On Snowflake, `ai_agg()` runs `AI_AGG`. The prompt is a plain instruction, not a template, and your `group by` decides what counts as one group. Here, every chunk from one call becomes one summary:

<File name="models/context/ai/call_rollups.sql">

```sql
{{ config(materialized='table') }}

select
    partition_key as transcript_id,
    {{ dbt_context_engineering.ai_agg(
        'chunk_text',
        'Summarize what this customer raised on the call, in two sentences.'
    ) }} as call_summary
from {{ ref('chunk_transcripts') }}
group by partition_key
```

</File>

This is the operation where warehouses diverge the most. See [adapter notes](#adapter-notes) below.

## Treat prompts and schemas as code

A prompt isn't documentation. It's an input that changes your output, exactly like a SQL query. A one-word change can flip every downstream label.

The **output schema** is the same. It declares the shape the model must return: field names, types, and allowed values. Together, a prompt and a schema turn free-form prose into a typed object per row you can store and query. That's what lets a model act as a data transformation instead of a chat window.

### Our recommendations

- **Version prompts and schemas like database migrations:** Each version is an immutable, named artifact, such as `v3`. To improve a prompt, write `v4`. Never edit a released version in place.
- **Reference an explicit version every time:** There's no "latest". A model on `v3` stays on `v3` until you deliberately bump it, so changes roll out and roll back one model at a time.
- **Keep prompts where they show up in a pull request:** If a prompt lives in a warehouse console under a mutable pointer, you can't answer "what changed, and when?"
- **Treat the schema's label list as the source of truth:** Your tests check against it, and the package copies it into the prompt where a warehouse needs that. If you also name labels in the prompt's instructions, update both together so they don't drift.

In the package, a prompt and a schema are each a macro, and the macro's name carries its version, like `prompt__jaffle_content_type__v1`. The [Classify](#classify) section shows a full example.

Calling the model is only half of portability. Each warehouse returns structured results in its own format, so convert them right away into plain columns:

- `classify` already returns a plain label string on every warehouse, so you can use it as is.
- For structured results, pull each field into an ordinary typed column straight after the call. Don't pass the raw result downstream. In the package, `field()` does this for a structured result (`extract`, or `generate` with a schema), and `text()` does it for plain generated text. Both are in beta.

## Adapter notes

The operations are the same everywhere, but the warehouses behave differently in ways that matter. Check these before you ship.

<SimpleTable>

| Topic | Snowflake | Databricks | BigQuery |
|-------|-----------|------------|----------|
| Structured result type | `VARIANT` object | `JSON` string | `STRUCT` |
| Enforces the allowed values in the schema | Yes | Yes | No. Enums are silently dropped. |
| Group-level aggregation | Native | No native function | Native |

</SimpleTable>

**BigQuery drops enum constraints:** BigQuery's output schema can't express an allowed-value list, so it quietly turns the field into a plain string. The call succeeds, but the model never saw your labels and invents its own, like `PROBLEM` or `Discovery Question` instead of `pain_point`. Nothing errors, so nothing turns red. On BigQuery, put the labels in the prompt too, generated from the schema's list so they still live in one place. You don't need this on Snowflake and Databricks, where the schema already enforces them.

**Aggregation differs the most** <Lifecycle status="beta" />: Databricks has no native aggregate function, and Snowflake and BigQuery differ on model choice and row order. Check your warehouse's documentation before you rely on it.

**Name your models explicitly:** Set the model for each operation in configuration rather than relying on defaults. In the package, those are the `model_generate`, `model_classify`, and `model_extract` vars.

## What's next

Your text now has labels, facts, and summaries. Next, you'll make sure it's correct in [Keep context trustworthy](/best-practices/how-we-context-engineer/6-keep-context-trustworthy).
