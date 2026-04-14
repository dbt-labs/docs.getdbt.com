---
title: "Semantic Layer vs. Text-to-SQL: 2026 Benchmark Update"
description: "With 2026's best models, the dbt Semantic Layer hits near-100% accuracy for covered queries. Here's what changed and what didn't in our updated benchmark."
slug: semantic-layer-vs-text-to-sql-2026

authors: [jason_ganz, benoit_perigaud]

tags: [ai, semantic-layer, llm]
hide_table_of_contents: false

date: 2026-04-07
is_featured: true
---

There are two primary ways to get answers from your data using LLMs today: have the model write SQL directly, or have it query through a structured ontology like the dbt Semantic Layer. Both work. Companies are getting real value from each. But they fail in very different ways, and understanding those failure modes is what actually matters when you're deciding which to use.

In 2023, [we ran a benchmark](https://roundup.getdbt.com/p/semantic-layer-as-the-data-interface) comparing the two approaches and the Semantic Layer won handily. But 2023 is roughly 10 million years ago in LLM time. Models have gotten dramatically better at writing SQL. So we reran the benchmark with the latest generation models to see whether the gap has closed.

<!-- truncate -->

## TL;DR

<FilterableTable>

| Model | Method | Accuracy % |
| --- | --- | --- |
| claude-sonnet-4-6 | Text-to-SQL | 90.0% |
| claude-sonnet-4-6 | Semantic Layer | 98.2% |
| gpt-5.3-codex | Text-to-SQL | 84.1% |
| gpt-5.3-codex | Semantic Layer | 100.0% |

</FilterableTable>

<br />


- **Models are getting much better at text-to-SQL.** The improvement from GPT-4 era to today is dramatic.
- **For queries covered by a well-modeled Semantic Layer, accuracy approaches or hits 100%.** The Semantic Layer's deterministic query generation means the LLM can't produce subtly wrong results.
- **Data modeling quality matters enormously for both approaches.** Adding even minimal modeling on top of raw tables improved results across the board.
- **Our recommendation:** Text-to-SQL for ad hoc analyses and smaller datasets. Semantic Layer for enterprise use where accuracy is critical and datasets are large, complex, or messy.

These numbers will keep improving, but we expect the underlying principles to have staying power. **If you just want to try the benchmark yourself or see more detailed data and the associated costs, head to [the repo](https://github.com/dbt-labs/dbt-llm-sl-bench).** Otherwise, keep reading for the full methodology and what we learned.

## How the two approaches actually work

Before we get into the numbers, a quick refresher on what's happening under the hood.

**Text-to-SQL** is the more straightforward pattern. You provide an LLM with some amount of schema information and ask it to generate a SQL query that answers a natural language question. The LLM has to infer the semantics of your data from structural clues: table names, column names, relationships. It then writes a query from scratch every time. This makes it flexible (any question is fair game as long as the data exists), but also fragile. The LLM might join tables incorrectly, misinterpret a column's meaning, or produce a query that runs successfully but returns wrong results. There's no guardrail between the question and the generated SQL.

Ontology-driven approaches, like the **dbt Semantic Layer**, work differently. Instead of asking the LLM to write raw SQL, you define a structured ontology (metrics, dimensions, entities, and the relationships between them) that encodes your business logic. The LLM's job is then reduced to decomposing a natural language question into the correct combination of metrics and dimensions. dbt's Semantic Layer uses its engine MetricFlow to handle the actual query generation deterministically. This means the LLM can't produce an incorrect join or a bad aggregation: if it picks the right metric and dimensions, the query is guaranteed to be correct. Perhaps more importantly, it can't produce _correct-looking numbers that are subtly different across runs_: the logic is codified and deterministic. The trade-off is coverage: the Semantic Layer can only answer questions that fall within the scope of what's been modeled.

Both methods have their place. But where exactly does each one shine, and where does it fall down? We tested it.

## The benchmark

We ran our experiment against the [ACME Insurance benchmark](https://github.com/datadotworld/cwd-benchmark-data) originally created by Juan Sequeda et al. from data.world, a semi-complex dataset meant to mimic real-world analytical problems. 11 questions, each run 20 times, across multiple LLMs.

We tested four configurations:

- **Text-to-SQL:** The agent gets schema information and writes queries from scratch.
- **Minimal Semantic Layer:** A light-touch dbt project on top of the original (highly normalized) tables.
- **Modeled Semantic Layer:** A reworked project with proper modeling conforming to dbt best practices.
- **Text-to-SQL on top of modeled data:** The agent is asked to create queries from scratch but it now has access to the same new models created for the previous use case.

<Lightbox src="/img/blog/2026-04-07-semantic-layer-vs-text-to-sql-2026/benchmark-configurations.png" width="85%" alt="Diagram showing the four benchmark configurations: Text-to-SQL, Minimal Semantic Layer, Modeled Semantic Layer, and Text-to-SQL on modeled data" />

The most "real world" comparison for dbt users is text-to-SQL vs. Semantic Layer on the modeled project. An important caveat: to make text-to-SQL work, we loaded the entire schema as context, which isn't practical for larger datasets. Keep that in mind as you read the numbers.

## Which model should you use? (It matters less than you'd think) {#which-model-should-you-use}

Before running the full benchmark, we wanted to know: does the choice of model or reasoning effort level make a meaningful difference?

We tested Opus 4.6, Sonnet 4.6, GPT-5.3 Codex, and GPT-5.2 (GPT-5.4 wasn't available yet via API) across multiple reasoning levels: Anthropic's `low` to `max` and OpenAI's `none` to `xhigh`. Here's what 16 permutations looked like for questions answerable via the Semantic Layer:

<FilterableTable>

| Model | Effort | SL Accuracy % | Text-to-SQL Accuracy % | SL Advantage (pp) |
| --- | --- | --- | --- | --- |
| gpt-5.3-codex | none | 100.0 | 50.0 | 50.0 |
| gpt-5.2-2025-12-11 | medium | 100.0 | 52.5 | 47.5 |
| gpt-5.3-codex | low | 100.0 | 52.5 | 47.5 |
| gpt-5.3-codex | medium | 100.0 | 52.5 | 47.5 |
| gpt-5.2-2025-12-11 | none | 95.0 | 50.0 | 45.0 |
| gpt-5.2-2025-12-11 | low | 100.0 | 55.0 | 45.0 |
| gpt-5.2-2025-12-11 | high | 100.0 | 55.0 | 45.0 |
| claude-sonnet-4-6 | low | 100.0 | 62.5 | 37.5 |
| claude-sonnet-4-6 | medium | 100.0 | 62.5 | 37.5 |
| claude-sonnet-4-6 | max | 100.0 | 62.5 | 37.5 |
| gpt-5.3-codex | high | 97.5 | 60.0 | 37.5 |
| claude-sonnet-4-6 | high | 97.5 | 62.5 | 35.0 |
| gpt-5.2-2025-12-11 | xhigh | 100.0 | 65.0 | 35.0 |
| gpt-5.3-codex | xhigh | 100.0 | 65.0 | 35.0 |
| claude-opus-4-6 | low | 87.5 | 62.5 | 25.0 |
| claude-opus-4-6 | max | 87.5 | 62.5 | 25.0 |
| claude-opus-4-6 | medium | 87.2 | 62.5 | 24.7 |
| claude-opus-4-6 | high | 87.2 | 62.5 | 24.7 |

</FilterableTable>

<br />


The short answer: **for Semantic Layer queries, it barely matters.** Most models hit 100% or near regardless of reasoning effort. The task is specific enough and the context is clear enough that throwing more reasoning tokens at it doesn't help.

What _does_ change with increased reasoning is speed, and not in the direction you want. GPT models on `xhigh` averaged over 20 seconds per query vs. 8 seconds on `high`, with no meaningful accuracy improvement. For Anthropic models, reasoning effort changed neither results nor latency.

A few surprises:

- Sonnet 4.6 outperformed Opus 4.6 in our use case
- GPT-5.3 Codex and GPT-5.2 performed similarly
- The biggest model isn't always the best model for structured data tasks

Based on this, we ran the full benchmark on Sonnet 4.6 and GPT-5.3 Codex with default reasoning levels.

## The main event: 2023 vs. 2026

So, are LLMs actually better at answering questions on data than they were two years ago?

Yes. Significantly. We ran the same 11 questions, 20 times each, comparing GPT-4 (November 2023) against GPT-5.3 Codex and Sonnet 4.6 (February/March 2026). More questions are now answered correctly 100% of the time across both methods, including questions that were giving inconsistent results just two years ago.

Here's the breakdown, split by whether the question requires too many entity hops for MetricFlow:

<FilterableTable>

| Too Many Hops | Text-to-SQL 2023 | Text-to-SQL Sonnet 4.6 | Text-to-SQL GPT-5.3 Codex | SL 2023 | SL Sonnet 4.6 | SL GPT-5.3 Codex |
| --- | --- | --- | --- | --- | --- | --- |
| False | 26.9% | 62.5% | 51.2% | 83.1% | 100.0% | 100.0% |
| True | 48.3% | 70.0% | 100.0% | 0.0% | 0.0% | 0.0% |
| All | 32.7% | 64.5% | 64.5% | 60.5% | 72.7% | 72.7% |

</FilterableTable>

<br />


What jumps out:

- **Text-to-SQL accuracy nearly doubled**, from 32.7% to 64.5% on the full question set. That's a massive improvement.
- **Sonnet 4.6 and GPT-5.3 Codex perform almost identically** across both methods: identical SL accuracy, identical overall Text-to-SQL accuracy (both 64.5%).
- **For questions within the Semantic Layer's scope, both models now return correct results 100% of the time.** In earlier iterations we occasionally saw 1-2 incorrect answers where the data was right but the model didn't pick the expected dimensions. That's gone now.
- **Questions that couldn't be answered via the Semantic Layer in 2023 still can't be answered today**, without additional modeling. But here's the critical difference: the Semantic Layer tells you it can't answer. It never returns invalid data. Text-to-SQL will cheerfully give you a wrong number.

This is the distinction that matters most in production. With text-to-SQL, failure looks like a plausible but incorrect answer. With the Semantic Layer, failure looks like an error message. For anything going to a board deck, an auditor, or a company KPI dashboard, that difference is everything.

## What happens when you add even minimal modeling?

Some questions couldn't be answered via the Semantic Layer because the original schema, in [third normal form](https://en.wikipedia.org/wiki/Third_normal_form) and extremely normalized, required too many entity hops for [MetricFlow](/docs/build/about-metricflow). So we asked: what's the minimum modeling effort needed to close that gap?

We prompted an LLM to create as few dbt models as possible to answer all 11 questions via the Semantic Layer. It created [3 new models](https://github.com/dbt-labs/semantic-layer-llm-benchmarking/commit/5dd5561), joining a few tables together and creating the corresponding semantic models, without us writing any code.

We pushed the change to git, the Semantic Layer updated automatically, and we reran the benchmark. For the text-to-SQL test, we also updated the DDL context with the new tables and relationships.

The results speak for themselves. With just 3 additional models, the Semantic Layer can now answer every question in the benchmark. And text-to-SQL improved too, confirming that **better modeling helps both approaches.**

<FilterableTable>

| Model | Method | Accuracy % |
| --- | --- | --- |
| claude-sonnet-4-6 | Text-to-SQL | 90.0% |
| claude-sonnet-4-6 | Semantic Layer | 98.2% |
| gpt-5.3-codex | Text-to-SQL | 84.1% |
| gpt-5.3-codex | Semantic Layer | 100.0% |

</FilterableTable>

<br />


(We also ran this on GPT-5.2, but the results were notably weaker: 68% Text-to-SQL accuracy vs. 84.1% with GPT-5.3 Codex.)

## Which should you use?

The answer isn't text-to-SQL _vs._ Semantic Layer. It's both, for different things.

When multiple tables are involved (15 in our benchmark), having a Semantic Layer adds determinism and dramatically increases accuracy. When the Semantic Layer can answer a question, it gets it right. When it can't, it tells you. It never silently returns wrong data.

Text-to-SQL is more flexible: it can attempt any question as long as the data exists. But that flexibility comes with a real cost: it will sometimes give you plausible, wrong answers. And adding modeling on top of raw tables improved results for _both_ approaches.

Here's how we think about it:

- **When accuracy matters** (board data, auditors, OKRs, KPIs, weekly reports): configure a Semantic Layer and connect your LLM to it.
- **For ad hoc exploration** (one-off questions, data discovery, prototyping): check if the Semantic Layer can answer first. If not, check if a minor modeling change would close the gap. Otherwise, fall back to text-to-SQL with as much schema context as possible.

<Lightbox src="/img/blog/2026-04-07-semantic-layer-vs-text-to-sql-2026/recommendation-diagram.png" width="85%" alt="Decision diagram: use the Semantic Layer when accuracy matters (KPIs, board data, auditors), fall back to text-to-SQL for ad hoc exploration when queries aren't covered" />

This is exactly the approach we recommend in [our agent skill for answering natural language questions with dbt](https://github.com/dbt-labs/dbt-agent-skills/blob/main/skills/dbt/skills/answering-natural-language-questions-with-dbt/SKILL.md).

## Try it yourself and dive into the data

The full benchmark is open source and reproducible. We moved from the original notebook-and-CSV approach to a Python library using [Pydantic AI](https://ai.pydantic.dev/) for LLM interaction and DuckDB for result storage.

- **Run the benchmark on your own data:** [dbt-labs/dbt-llm-sl-bench](https://github.com/dbt-labs/dbt-llm-sl-bench)
- **Explore costs and latency:** [full benchmark data](https://dbt-labs.github.io/dbt-llm-sl-bench/)
- **Set up your own Semantic Layer:** Use the [dbt agent skills](https://github.com/dbt-labs/dbt-agent-skills) to have an AI help you build and configure it
- **Questions or findings?** Share them with us in #tools-dbt-mcp on the [dbt Community Slack](https://www.getdbt.com/community/join-the-community)
