---
title: "Glossary"
id: 9-glossary
description: Plain-language definitions of the terms used in the context engineering guide, plus every package macro and var in one place.
displayText: Glossary
hoverSnippet: Look up the terms used in the context engineering guide.
---

Look up a term, a package macro, or a var here. Jump to [macros](#macros) or [vars](#vars).

## Terms

The terms are in alphabetical order.

<SimpleTable>

| Term | What it means |
|------|---------------|
| Canary | A few frozen probe texts you re-embed on every build and compare to a reviewed baseline, to catch an embedding model that quietly changed |
| Chunk | A piece of text small enough to embed and retrieve |
| Classification | Giving each chunk one label from a fixed set |
| Context model | A dbt model that prepares text for agents: it chunks, embeds, labels, or combines it |
| Context window | How much text an LLM can read in one go |
| Cosine similarity | A score from 1.0 (same direction) to -1.0 (opposite) for how close two vectors are in meaning |
| Deferral | Letting a CI job read models from another environment, such as production, instead of rebuilding them. See [defer](/reference/node-selection/defer). |
| Embedding | A list of numbers that captures what a piece of text means |
| Embedding model | The model your warehouse calls to turn text into an embedding |
| Enum | A fixed list of allowed values, such as the labels a classifier may return |
| Event sourcing | Recording a change by appending a new row instead of editing an old one |
| Golden set | A small, hand-labeled dataset of known-correct answers that you score AI output against |
| Hallucination | When an LLM states something, such as a quote or a fact, that isn't in the source |
| Hook | SQL that dbt runs before (pre-hook) or after (post-hook) a model builds |
| Knowledge base | One table where every source lands in the same shape, so one search covers all of them |
| Lineage | The trail from a piece of context back to the source row it came from |
| LLM | The large language model your warehouse calls to label, extract, or summarize text |
| Precision and recall | Recall is whether search finds the right chunk at all. Precision is whether the right chunk ranks near the top. |
| Taxonomy | Your fixed list of labels for classification |
| Token | The sub-word piece an LLM or embedding model reads and bills by, roughly four characters of English |
| Unit | The smallest piece of text you never split, such as a speaker turn or a sentence |
| Vector | The list of numbers an embedding is stored as. Only comparable to vectors from the same embedding model. |

</SimpleTable>

## Macros

The following table lists most of the macros in the the [`dbt_context_engineering` package](https://github.com/dbt-labs/dbt-context-engineering/tree/main/macros), but refer to the repo for the official list. You call them as `dbt_context_engineering.MACRO_NAME`, replacing `MACRO_NAME` with the actual macro name.

| Macro name| What it does | Learn more |
|-------|--------------|------------|
| `chunk` | Packs whole units, such as speaker turns or sentences, into chunks | [Prepare your text](/best-practices/how-we-context-engineer/3-prepare-your-text) |
| `split_sentences` | Splits each document into one row per sentence, ready for `chunk` | [Prepare your text](/best-practices/how-we-context-engineer/3-prepare-your-text) |
| `no_oversized_chunks` | Test that flags chunks over your size target | [Prepare your text](/best-practices/how-we-context-engineer/3-prepare-your-text) |
| `embed` | Turns text into a vector | [Embed and retrieve](/best-practices/how-we-context-engineer/4-embed-and-retrieve) |
| `vector_search` | Finds the chunks closest in meaning to a question | [Embed and retrieve](/best-practices/how-we-context-engineer/4-embed-and-retrieve) |
| `knowledge_base` | Puts every source into one common shape | [Embed and retrieve](/best-practices/how-we-context-engineer/4-embed-and-retrieve) |
| `create_vector_index` | Creates a managed vector index. Run it with `dbt run-operation`. Not supported on Redshift. | [Embed and retrieve](/best-practices/how-we-context-engineer/4-embed-and-retrieve) |
| `version_guard` | Says whether the stored embedding version differs from the pinned one | [Embed and retrieve](/best-practices/how-we-context-engineer/4-embed-and-retrieve) |
| `incremental_delta_predicate` | Builds the `where` clause that picks which rows to embed | [Embed and retrieve](/best-practices/how-we-context-engineer/4-embed-and-retrieve) |
| `content_hash` | Fingerprints the text you embedded | [Embed and retrieve](/best-practices/how-we-context-engineer/4-embed-and-retrieve) |
| `embedding_fn_fingerprint` | Fingerprints the embedding model and settings | [Embed and retrieve](/best-practices/how-we-context-engineer/4-embed-and-retrieve) |
| `embedding_dimension` | Records the size of the vector the engine returned | [Embed and retrieve](/best-practices/how-we-context-engineer/4-embed-and-retrieve) |
| `embedding_logic_hash` | Fingerprints the embedding code | [Embed and retrieve](/best-practices/how-we-context-engineer/4-embed-and-retrieve) |
| `print_embedding_canary` | Prints the canary's probe texts. Run it with `dbt run-operation`. | [Embed and retrieve](/best-practices/how-we-context-engineer/4-embed-and-retrieve) |
| `classify` | Gives each row one label | [Enrich with AI](/best-practices/how-we-context-engineer/5-enrich-with-ai) |
| `extract` | Pulls typed fields out of text | [Enrich with AI](/best-practices/how-we-context-engineer/5-enrich-with-ai) |
| `generate` | Writes free text | [Enrich with AI](/best-practices/how-we-context-engineer/5-enrich-with-ai) |
| `ai_agg` | Reasons across every row in a group | [Enrich with AI](/best-practices/how-we-context-engineer/5-enrich-with-ai) |
| `config_prompt` and `config_schema` | Read the prompt and schema named in `meta.ai_prompt` | [Enrich with AI](/best-practices/how-we-context-engineer/5-enrich-with-ai), [Control cost](/best-practices/how-we-context-engineer/7-control-cost) |
| `field` and `text` | Pull a result into a typed column (beta) | [Enrich with AI](/best-practices/how-we-context-engineer/5-enrich-with-ai) |
| `grounded` | Test that an evidence quote appears in its source | [Keep context trustworthy](/best-practices/how-we-context-engineer/6-keep-context-trustworthy) |
| `conforms_to_schema` | Test that output uses only the allowed values | [Keep context trustworthy](/best-practices/how-we-context-engineer/6-keep-context-trustworthy) |
| `eval` | Scores predictions against known-correct answers | [Keep context trustworthy](/best-practices/how-we-context-engineer/6-keep-context-trustworthy) |
| `guard_batch` | Stops a run that's over your row or token ceiling | [Control cost](/best-practices/how-we-context-engineer/7-control-cost) |
| `guard_agg_batch` | Stops a group that's too big for `ai_agg`. Databricks needs it. | [Enrich with AI](/best-practices/how-we-context-engineer/5-enrich-with-ai) |
| `log_ai_run` | Adds a `started` row to the run log | [Control cost](/best-practices/how-we-context-engineer/7-control-cost) |
| `complete_ai_run` | Adds a `completed` row to the run log | [Control cost](/best-practices/how-we-context-engineer/7-control-cost) |
| `create_ai_run_log_table` | Creates the run log once, in an `on-run-start` hook | [Control cost](/best-practices/how-we-context-engineer/7-control-cost) |
| `dev_sample_filter` | Caps a context model to a random sample of rows while you develop | [Control cost](/best-practices/how-we-context-engineer/7-control-cost) |
| `require_ai_functions_enabled` | Raises an error unless `ai_functions_enabled` is `true` | [Control cost](/best-practices/how-we-context-engineer/7-control-cost) |
| `require_safe_materialization` | Raises an error if an AI function runs in a view | [Control cost](/best-practices/how-we-context-engineer/7-control-cost) |
| `require_full_refresh_gate` | Raises an error if an incremental context model that calls an AI function sets no `full_refresh` | [Control cost](/best-practices/how-we-context-engineer/7-control-cost) |


## Vars

Set these in `dbt_project.yml` under `vars:`. Refer to the package's [var reference](https://github.com/dbt-labs/dbt-context-engineering/blob/main/skills/dbt-ce-setup/references/vars-reference.md) for the full list of `vars` supported.

| Var | Default | What it controls | Learn more |
|-----|---------|------------------|------------|
| `embedding_model` | None | The embedding model `embed()` uses. Pin it. On Redshift, the name of your Bedrock function. | [Embed and retrieve](/best-practices/how-we-context-engineer/4-embed-and-retrieve) |
| `model_generate` | None | The LLM `generate()` uses. On Redshift, the name of your Bedrock function. | [Enrich with AI](/best-practices/how-we-context-engineer/5-enrich-with-ai) |
| `model_classify` | None | The LLM `classify()` uses. On Redshift, the name of your Bedrock function. | [Enrich with AI](/best-practices/how-we-context-engineer/5-enrich-with-ai) |
| `model_extract` | None | The LLM `extract()` uses. Falls back to `model_generate`. On Redshift, the name of your Bedrock function. | [Enrich with AI](/best-practices/how-we-context-engineer/5-enrich-with-ai) |
| `chunk_target_tokens` | `512` | Target chunk size | [Prepare your text](/best-practices/how-we-context-engineer/3-prepare-your-text) |
| `chunk_overlap_tokens` | `0` | How much text adjacent chunks share | [Prepare your text](/best-practices/how-we-context-engineer/3-prepare-your-text) |
| `ai_functions_enabled` | `false` | The master switch. AI calls raise an error unless it's `true`. | [Control cost](/best-practices/how-we-context-engineer/7-control-cost) |
| `allow_full_reembed` | Unset | Wire it to `full_refresh` so a stray `--full-refresh` can't re-bill your corpus | [Control cost](/best-practices/how-we-context-engineer/7-control-cost) |
| `max_batch_rows` | `10000` | Row ceiling for `guard_batch` | [Control cost](/best-practices/how-we-context-engineer/7-control-cost) |
| `max_est_tokens` | `5000000` | Estimated-token ceiling for `guard_batch` | [Control cost](/best-practices/how-we-context-engineer/7-control-cost) |
| `max_agg_group_tokens` | `100000` | Per-group token ceiling for `guard_agg_batch` | [Enrich with AI](/best-practices/how-we-context-engineer/5-enrich-with-ai) |
| `est_output_tokens_per_row` | None | Output allowance per row in the guard's estimate | [Control cost](/best-practices/how-we-context-engineer/7-control-cost) |
| `max_output_tokens` | None | Cap on the LLM's reply | [Control cost](/best-practices/how-we-context-engineer/7-control-cost) |
| `bq_thinking_budget` | None | BigQuery and Gemini only. `0` turns off default "thinking". | [Control cost](/best-practices/how-we-context-engineer/7-control-cost) |
| `ai_sample_rows` | None (off) | Row cap for `dev_sample_filter` | [Control cost](/best-practices/how-we-context-engineer/7-control-cost) |
| `cost_per_1k_tokens` | None | Price behind the estimated cost in the run log | [Control cost](/best-practices/how-we-context-engineer/7-control-cost) |
| `ai_run_log_relation` | None | Where the run log is written | [Control cost](/best-practices/how-we-context-engineer/7-control-cost) |
| `embedding_canary_similarity_threshold` | `0.999` | Lowest similarity a canary probe can score against its baseline | [Embed and retrieve](/best-practices/how-we-context-engineer/4-embed-and-retrieve) |
| `embedding_canary_test_severity` | `warn` | Whether a canary mismatch warns or fails | [Embed and retrieve](/best-practices/how-we-context-engineer/4-embed-and-retrieve) |
| `embedding_canary_vector_dimension` | `768` | Snowflake only. Match your embedding model's vector size. | [Embed and retrieve](/best-practices/how-we-context-engineer/4-embed-and-retrieve) |
| `bq_connection` | None | BigQuery only. A Vertex AI connection, optional for interactive runs. | [Control cost](/best-practices/how-we-context-engineer/7-control-cost) |
 
