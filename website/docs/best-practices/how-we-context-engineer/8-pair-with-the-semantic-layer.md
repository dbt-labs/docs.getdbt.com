---
title: "Pair context with the semantic layer"
id: 8-pair-with-the-semantic-layer
description: Learn how context and the semantic layer fit in one dbt project, which to build first, and how an agent uses both to answer a question.
displayText: Pair context with the semantic layer
hoverSnippet: Learn how context and the semantic layer work together in one project.
---

Most real questions need two kinds of answer: a number and a reason. "How far did on-time delivery fall, and why?" The semantic layer gives the number. Context gives the reason. This page shows how the two fit in one dbt project, which to build first, and how an agent uses both.

<Lightbox src="/img/best-practices/context-engineering/two-layers.svg" width="100%" title="Your marts feed two things: semantic models and metrics in the semantic layer, and context models that end in a knowledge base. An agent splits a question in two. It gets the number from the semantic layer and the cause from the knowledge base, then answers with both and cites both." />

## Two layers, one project

<SimpleTable>

| | Semantic layer | Context |
|---|---|---|
| What you build | Semantic models and metrics, in YAML on your marts | Context models that end in a [knowledge base](/best-practices/how-we-context-engineer/4-embed-and-retrieve#combine-sources-into-a-knowledge-base) |
| What it holds | A governed definition, such as `on_time_rate` | A row of text with a vector, a source, an account, a link, and a label |
| What it answers | What happened, and how much | Why it happened, and what was said |
| Example | "What was on-time delivery in Q1?" | "What happened in Paris in January?" |

</SimpleTable>

Both live in the same project, built by the same team. Both are reviewed in a pull request, tested on every build, and traced in lineage. That's the point: context gets the same discipline as your metrics, not a side project.

## Build the semantic layer first

Metrics come first, then context. The order matters because metrics are the questions. A metric that moves is what sends someone looking for a reason, and context is where the reason lives.

1. Build your marts.
2. Add [semantic models](/docs/build/semantic-models) and [metrics](/docs/build/metrics-overview) on top of them.
3. Prepare your text, build context models, and combine them into a knowledge base, as the rest of this guide shows.

If you already have a semantic layer, great! You can go ahead and prepare your text, build context models, and more! If you don't have a semantic layer yet, we recommend checking out our [How to build your metrics](/best-practices/how-we-build-our-metrics/semantic-layer-1-intro?version=2) guide or [quickstart](https://docs.getdbt.com/guides/sl-qs?step=1)

## How an agent answers

Take the question "What happened in Q1 that caused on-time delivery to go down?" An agent with both layers answers it in four steps:

1. It splits the question in two: the number, and the cause.
2. For the number, it queries the semantic layer. It picks `on_time_rate`, looks at it by quarter, then at Q1 by city. Paris in January is the low point.
3. For the cause, it searches the knowledge base. It embeds "what happened in Paris in January", filters to the account and date range, and ranks the chunks by similarity. The top hit is `IR-9001::1`: a truck slid on ice during the storm and missed its delivery window.
4. It answers with both, and cites both: the metric name and the source id.

The example values are from the Jaffle Logistics showcase and are illustrative. The shape of the answer is the point. The number has a definition behind it, and the reason has a source behind it. Nothing is guessed from a schema.

## Our recommendations

- **Numbers come from metrics, never from text:** If an agent needs a figure, it should come from the semantic layer. Text in the knowledge base explains a number. It isn't a second place to compute one.
- **Share keys across both layers:** Use the same account, location, and date keys in your knowledge base that your semantic models use as dimensions. Then a dimension value from a metric, such as Paris or `CLI-0042`, becomes the filter for a context search.
- **Keep both in one project:** One pull request can change a metric definition and the context model that explains it. Lineage covers both.
- **Cite both in every answer:** Carry the metric name and the `source_id` through to the agent's reply, so a person can check either half.

## Where serving starts

This guide covers modeling, not serving. The package isn't an agent or an MCP server. It makes the tables those systems read. Your agent or app embeds each live question as it arrives, with the same embedding model as your chunks, then searches the knowledge base.

Agents reach both layers through tools over MCP. The [dbt MCP server](/docs/dbt-ai/about-mcp) exposes the semantic layer, and agents discover context through [Agents Schema](https://github.com/dbt-labs/agents_schema), a standard `AGENTS` schema in your warehouse.

## Conclusion

You already model numbers so a person can trust them. Context engineering gives your text the same treatment, so an agent can search it, cite it, and trust it. The core flow is the same every time: chunk, embed, search.

<Lightbox src="/img/best-practices/context-engineering/pipeline.svg" width="100%" title="A call transcript is chunked, embedded as numbers, and placed on a map where similar meanings sit close together. A question lands on the same map, and the closest chunks come back with a score and a source." />

Around that flow, you add four habits:

<SimpleTable>

| Habit | What you do | Go back to |
|-------|-------------|------------|
| Label | Tag each chunk with an LLM, using prompts kept as versioned code | [Enrich with AI](/best-practices/how-we-context-engineer/5-enrich-with-ai) |
| Test | Check AI output with plain code, and carry a citation on every claim | [Keep context trustworthy](/best-practices/how-we-context-engineer/6-keep-context-trustworthy) |
| Budget | Cap what AI calls spend and record what each run used | [Control cost](/best-practices/how-we-context-engineer/7-control-cost) |
| Pair | Get the number from a metric and the reason from context | [How an agent answers](#how-an-agent-answers) |

</SimpleTable>

Metrics tell you what moved. Context tells you why.

<ConfettiTrigger>
At the start of this guide, we said that for a decade we've modeled data for one reader: the dashboard. Now there's a second reader, the agent. It’s only as trustworthy as the context you give it, and you’re well placed to build that.
</ConfettieTrigger>

New terms? The [Glossary](/best-practices/how-we-context-engineer/9-glossary) lists them, plus every macro and var in the package.
