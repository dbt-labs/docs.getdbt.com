---
title: "Best practices"
description: Getting started with the dbt Semantic Layer
hoverSnippet: Learn how to get started with the dbt Semantic Layer
pagination_next: null
---

## Putting it all together

- 📊 We've walked through **creating semantic models and metrics** for basic coverage of a key business area.
- 🔁 In doing so we've looked at how to **refactor a frozen rollup** into a dynamic, flexible new life in the <Constant name="semantic_layer" />.

## Best practices

- ✅ **Prefer normalization** when possible to allow MetricFlow to denormalize dynamically for end users.
- ✅ Use **marts to denormalize** when needed, for instance grouping tables together into richer components, or getting measures on dimensional tables attached to a table with a time spine.
- ✅ When source data is **well normalized** you can **build semantic models on top of staging models**.
- ✅ **Prefer** computing values in **measures and metrics** when possible as opposed to in frozen rollups.
- ❌ **Don't directly refactor the code you have in production**, build in parallel so you can audit the <Constant name="semantic_layer" /> output and deprecate old marts gracefully.

## Key commands

- 🔑 Use `dbt parse` to generate a fresh semantic manifest.
- 🔑 Use `dbt sl list dimensions --metrics [metric name]` to check that you're increasing dimensionality as you progress.
- 🔑 Use `dbt sl query [query options]` to preview the output from your metrics as you develop.

## Next steps

- 🗺️ Use these best practices to map out your team's plan to **incrementally adopt the <Constant name="semantic_layer" />**.
- 🤗 Get involved in the community and ask questions, **help craft best practices**, and share your progress in building a <Constant name="semantic_layer" />.
- [Validate semantic nodes in CI](/docs/deploy/ci-jobs#semantic-validations-in-ci) to ensure code changes made to dbt models don't break these metrics.

The <Constant name="semantic_layer" /> is the biggest paradigm shift thus far in the young practice of analytics engineering. It's ready to provide value right away, but is most impactful if you move your project towards increasing normalization, and allow MetricFlow to do the denormalization for you with maximum dimensionality.

We will be releasing more resources soon covering implementation of the <Constant name="semantic_layer" /> in <Constant name="dbt" /> with various integrated BI tools. This is just the beginning, hopefully this guide has given you a path forward for building your data platform in this new era. Refer to [<Constant name="semantic_layer" /> FAQs](/docs/use-dbt-semantic-layer/sl-faqs) for more information.
