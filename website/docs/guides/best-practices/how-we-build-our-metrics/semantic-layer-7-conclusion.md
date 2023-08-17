---
title: "Best practices"
description: Getting started with the dbt and MetricFlow
hoverSnippet: Learn how to get started with the dbt and MetricFlow
---

## Putting it all together

- 📊 We've **created semantic models and metrics** for basic coverage of a key business area.
- 🔁 In doing so we've **refactored a 'static' mart** into a dynamic, flexible new life in the Semantic Layer.
- 🗺️ We encourage you to **explore the `main` branch** of the [example project repo](https://github.com/dbt-labs/jaffle-sl-template) to see even more metrics and semantic models in action within a project fully ported to the Semantic Layer.

## Best practices

- ✅ **Prefer normalization** when possible to allow MetricFlow to denormalize dynamically for end users.
- ✅ Use **marts to denormalize** when needed, for instance grouping tables together into richer components, or getting measures on dimensional tables attached to a table with a time spine.
- ✅ When source data is **well normalized** you can **build semantic models on top of staging models**.
- ✅ **Prefer** computing values in **measures and metrics** when possible as opposed to in fixed marts.
- ❌ **Don't directly refactor the code you have in production**, build in parallel so you can audit the Semantic Layer output and deprecate old marts gracefully.

## Key commands

- 🔑 Use `dbt parse && mf validate-configs` to generate a semantic manifest and ensure it works with your data.
- 🔑 Use `mf list dimensions --metrics [metric name]` to check that you're increasing dimensionality as you progress.
- 🔑 Use `mf query [query options]` to preview the output from your metrics as you develop.

## Next steps

- 🗺️ Map out a clear plan for your dbt project to **incrementally adopt the Semantic Layer**.
- 🤗 Get involved in the community and ask questions, **help craft best practices**, and share your progress in building a dbt Semantic Layer.

The dbt Semantic Layer is the biggest paradigm shift thus far in the young practice of analytics engineering. It's ready to provide value right away, but is most impactful if you move your project towards increasing normalization, and allow MetricFlow to do the denormalization for you with maximum dimensionality.

We will be releasing more resources soon covering implementation of the Semantic Layer in dbt Cloud with various integrated BI tools. This is just the beginning, hopefully this guide has given you a path forward for building your data platform in this new era.
