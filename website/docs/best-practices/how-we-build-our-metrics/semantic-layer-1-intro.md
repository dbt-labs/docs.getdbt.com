---
title: "Intro to the dbt Semantic Layer"
description: Getting started with the dbt Semantic Layer
hoverSnippet: Learn how to get started with the dbt Semantic Layer
pagination_next: "best-practices/how-we-build-our-metrics/semantic-layer-2-setup"
pagination_prev: null
---

Flying cars, hoverboards, and true self-service analytics: this is the future we were promised. The first two might still be a few years out, but real self-service analytics is here today. With <Constant name="cloud" />'s <Constant name="semantic_layer" />, you can resolve the tension between accuracy and flexibility that has hampered analytics tools for years, empowering everybody in your organization to explore a shared reality of metrics. Best of all for analytics engineers, building with these new tools will significantly [DRY](https://docs.getdbt.com/terms/dry) up and simplify your codebase. As you'll see, the deep interaction between your dbt models and the <Constant name="semantic_layer" /> make your dbt project the ideal place to craft your metrics.

## Learning goals

- ❓ Understand the **purpose and capabilities** of the ** <Constant name="semantic_layer" />**, particularly MetricFlow as the engine that powers it.
- 🧱 Familiarity with the core components of MetricFlow — **semantic models and metrics** — and how they work together.
- 🔁 Know how to **refactor** dbt models for the <Constant name="semantic_layer" />.
- 🏅 Aware of **best practices** to take maximum advantage of the <Constant name="semantic_layer" />.

## Guide structure overview

1. Getting **setup** in your dbt project.
2. Building a **semantic model** and its fundamental parts: **entities, dimensions, and measures**.
3. Building a **metric**.
4. Defining **advanced metrics**: `ratio` and `derived` types.
5. **File and folder structure**: establishing a system for naming things.
6. **Refactoring** marts and roll-ups for the <Constant name="semantic_layer" />.
7. Review **best practices**.

If you're ready to ship your users more power and flexibility with less code, let's dive in!

:::info
MetricFlow is the engine for defining metrics in dbt and one of the key components of the [<Constant name="semantic_layer" />](/docs/use-dbt-semantic-layer/dbt-sl). It handles SQL query construction and defines the specification for dbt semantic models and metrics.

To fully experience the <Constant name="semantic_layer" />, including the ability to query dbt metrics via external integrations, you'll need a [<Constant name="cloud" /> Starter, Enterprise, or Enterprise+ accounts](https://www.getdbt.com/pricing/). Refer to [<Constant name="semantic_layer" /> FAQs](/docs/use-dbt-semantic-layer/sl-faqs) for more information.
:::
