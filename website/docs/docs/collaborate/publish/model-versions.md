---
title: "Model versions"
---

:::info Beta functionality
This functionality is new in v1.5. These docs exist to provide a high-level overview of what's to come. The specific syntax is liable to change.

For more details and to leave your feedback, check out the GitHub discussion:
* ["Model versions" (dbt-core#6736)](https://github.com/dbt-labs/dbt-core/discussions/6736)
:::

API versioning is a _complex_ problem in software engineering. It's also essential. Our goal is to _overcome obstacles to transform a complex problem into a reality_.

## Related documentation
* Coming soon: `version` & `latest` (_not_ [this one](project-configs/version))
* Coming soon: `deprecation_date`

## Why version a model?

If a model defines a ["contract"](model-contracts) (a set of guarantees for its structure), it's also possible to change that model's contract in a way that "breaks" the previous set of parameters.

One approach is to force every model consumer to immediately handle the breaking change when it's deployed to production. While this may work at smaller organizations or while iterating on an immature set of data models, it doesn’t scale well beyond that.

Instead, the model owner can create a **new version** and provide a **deprecation window**, during which consumers can migrate from the old version to the new.

In the meantime, anywhere that model is used downstream, it can be referenced at a specific version.

When a model approaches its deprecation date, consumers of that model will be notified about it. When the date is reached, it goes away.
