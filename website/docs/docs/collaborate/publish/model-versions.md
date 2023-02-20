---
title: "Model versions"
---

:::info Beta functionality
This functionality is new in v1.5! These docs exist to provide a high-level overview of what's to come. Specific syntax is liable to change.

For more details, and to leave your feedback, check out the GitHub discussion:
* ["Model versions" (dbt-core#6736)](https://github.com/dbt-labs/dbt-core/discussions/6736)
:::

API versioning is **a hard problem** in software engineering. It's also very important. Our goal is to _make a hard thing possible_.

## Related documentation
* TK: `version` & `latest` (_not_ [this one](project-configs/version))
* TK: `deprecation_date`

## Why version a model?

If a model defines a ["contract"](model-contracts) (a set of guarantees for its structure), it's also possible to change that model's contract in a way that "breaks" the previous set of guarantees.

One approach is to force every consumer of the model to immediately handle the breaking change, as soon as it's deployed to production. While this may work at smaller organizations, or while iterating on an immature set of data models, it doesn't scale much beyond that.

Instead, the owner of the model can create a **new version**, and provide a **deprecation window**, during which consumers can migrate from the old version to the new.

In the meantime, anywhere that model is used downstream, it can be referenced at a specific version.

When a model is reaching its deprecation date, consumers of that model will hear about it. When the date is reached, it goes away.
