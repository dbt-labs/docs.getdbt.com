---
title: "Best practices"
id: 7-semantic-layer-conclusion
description: Getting started with the dbt Semantic Layer
displayText: "dbt Cloud Semantic Layer best practices"
hoverSnippet: Learn how to get started with the dbt Semantic Layer
---

## Putting it all together

- The finished state of your project should look like this.

## Best practices

- Prefer normalization when possible to allow MetricFlow to denormalize dynamically for end users.
- Use marts to denormalize as needed, for instance grouping tables together into richer components, or getting measures on dimensional tables attached to a table with a time spine.
- Prefer computing values in measures and metrics when possible as opposed to in fixed marts.
- Use `dbt parse && mf validate-configs` to generate a semantic manifest and ensure it works with your data.
- Use `mf list dimensions --metrics [metric name]` to check that you're increasing dimensionality as you progress.
- Use `mf query [query options]` to preview the output from your metrics as you develop.

## Next steps

- Map out a clear plan for your dbt project to incrementally adopt the Semantic Layer.
- Get involved in the community and ask questions, help craft best practices, and share your progress in building a dbt Semantic Layer.

The dbt Semantic Layer is the biggest paradigm shift thus far in the young practice of analytics engineering. It's ready to provide value right away, but is most impactful if you move your project towards increasing normalization, and allow MetricFlow to do the denormalization for you with maximum dimensionality.

We will be releasing more resources soon covering implementation of the Semantic Layer in dbt Cloud with various integrated BI tools. This is just the beginning, but hopefully this guide has given you a path forward for building your data platform in this era.
