---
title: "Model versions"
id: model-versions
sidebar_label: "Model versions"
description: "Version models to help with lifecycle management"
---

:::info Beta functionality
This functionality is new in v1.5. These docs exist to provide a high-level overview of what's to come. The specific syntax is liable to change.

For more details and to leave your feedback, check out the GitHub discussion:
* ["Model versions" (dbt-core#6736)](https://github.com/dbt-labs/dbt-core/discussions/6736)
:::

API versioning is a _complex_ problem in software engineering. It's also essential. Our goal is to _overcome obstacles to transform a complex problem into a reality_.

## Related documentation
* Coming soon: `version` & `latest_version` (_not_ [this one](project-configs/version))

## Why version a model?

If a model defines a ["contract"](model-contracts) (a set of guarantees for its structure), it's also possible to change that model's contract in a way that "breaks" the previous set of parameters.

One approach is to force every model consumer to immediately handle the breaking change when it's deployed to production. While this may work at smaller organizations or while iterating on an immature set of data models, it doesn’t scale well beyond that.

Instead, the model owner can create a **new version**, during which consumers can migrate from the old version to the new.

In the meantime, anywhere that model is used downstream, it can be referenced at a specific version.

## How to create a new version of a model

Let's say you have an unversioned model with the following contract:

<File name="models/schema.yml">

```yaml
models:
  - name: dim_customers
    config:
      materialized: table
      contract:
        enforced: true
    columns:
      - name: customer_id
        description: This is the primary key
        data_type: int
      - name: country_name
        description: Where this customer lives
        data_type: string
```

</File>

If you wanted to make a breaking change to the model - for example, removing a column - you'd create a new model file (e.g. SQL file) encompassing those breaking changes. The default convention is to name the new file would with a `_v<version>` suffix. The new version can then be configured in relation to the original model:

<File name="models/schema.yml">

```yaml
models:
  - name: dim_customers
    latest_version: 2
    config:
      materialized: table
      contract:
        enforced: true
    columns:
      - name: customer_id
        description: This is the primary key
        data_type: float
      - name: country_name
        description: Where this customer lives
        data_type: string
    versions:
      - v: 2
        columns:
          - include: *
            exclude: country_name # this is the breaking change!
      - v: 1
        config:
          alias: dim_customers # keep old relation location
```

</File>

The above configuration will create two models (one for each version), with aliases `dim_customers` (version 1) and `dim_customers_v2`.