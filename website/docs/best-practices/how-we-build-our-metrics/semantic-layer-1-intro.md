---
title: "Intro to MetricFlow"
description: Getting started with the dbt and MetricFlow
hoverSnippet: Learn how to get started with the dbt and MetricFlow
---

Flying cars, hoverboards, and true self-service analytics: this is the future we were promised. The first two might still be a few years out, but real self-service analytics is here today. With dbt Cloud's Semantic Layer, you can resolve the tension between accuracy and flexibility that has hampered analytics tools for years, empowering everybody in your organization to explore a shared reality of metrics. Best of all for analytics engineers, building with these new tools will significantly [DRY](https://docs.getdbt.com/terms/dry) up and simplify your codebase. As you'll see, the deep interaction between your dbt models and the Semantic Layer make your dbt project the ideal place to craft your metrics.

## Learning goals

- ❓ Understand the **purpose and capabilities** of the **dbt Semantic Layer**, particularly MetricFlow as the engine that powers it.
- 🧱 Familiarity with the core components of MetricFlow — **semantic models and metrics** — and how they work together.
- 🛠️ Hands-on **experience building** semantic models and metrics in dbt Cloud.
- 🔁 Know how to **refactor** models for MetricFlow.
- 🏅 Aware of new **best practices** to take maximum advantage of the Semantic Layer.

## Guide structure overview

We'll work through our learning goals via an [example project](https://github.com/dbt-labs/jaffle-sl-template), we encourage you to follow along and try the code out for yourself if you'd like on the `start-here` branch, or you can just follow along with the completed state of the codebase on the `main` branch.

1. Getting **setup** with MetricFlow in your dbt project.
2. Building your first **semantic model** and its fundamental parts: **entities, dimensions, and measures**.
3. Building your first **metric**.
4. **Refactoring** a mart into the Semantic Layer.
5. Defining **advanced metrics**: `ratio` and `derived` types.
6. Review **best practices**.

If you're ready to ship your users more power with less code, let's dive in!

:::info
MetricFlow is a new way to define metrics in dbt and one of the key components of the [dbt Semantic Layer](/docs/use-dbt-semantic-layer/dbt-sl). It handles SQL query construction and defines the specification for dbt semantic models and metrics.

To fully experience the dbt Semantic Layer, including the ability to query dbt metrics via external integrations, you'll need a [dbt Cloud Team or Enterprise account](https://www.getdbt.com/pricing/).
:::
