---
title: "Model versions"
id: model-versions
sidebar_label: "Model versions"
description: "Version models to help with lifecycle management"
---

:::info New functionality
This functionality is new in v1.5.
:::

API versioning is a _complex_ problem in software engineering. It's also essential. Our goal is to _overcome obstacles to transform a complex problem into a reality_.

## Related documentation
- [`versions`](resource-properties/versions)
- [`latest_version`](resource-properties/latest-version)
- [`include` & `exclude`](resource-properties/include-exclude)

## Why version a model?

If a model defines a ["contract"](model-contracts) (a set of guarantees for its structure), it's also possible to change that model's contract in a way that "breaks" the previous set of parameters.

One approach is to force every model consumer to immediately handle the breaking change when it's deployed to production. While this may work at smaller organizations or while iterating on an immature set of data models, it doesn’t scale well beyond that.

Instead, the model owner can create a **new version**, during which consumers can migrate from the old version to the new.

In the meantime, anywhere that model is used downstream, it can be referenced at a specific version.

## How is this different from "version control"?

[Version control](git-version-control) allows your team to collaborate simultaneously on a single code repository, manage conflicts between changes, and review changes before deploying into production. In that sense, version control is an essential tool for versioning the deployment of an entire dbt project—always the latest state of the `main` branch, with the ability to "rollback" changes by reverting a commit or pull request. In general, only one version of your project code is deployed into an environment at a time.

Model versions are different. Multiple versions of a model will live in the same code repository at the same time and be deployed into the same data environment simultaneously. This is similar to how web APIs are versioned—multiple versions are live simultaneously; older versions are often eventually sunsetted.

dbt's model `versions` makes it possible to define multiple versions:
- That share the same "reference" name
- While reusing the same top-level properties, highlighting just their differences

## How to create a new version of a model

Let's say you have a model (not yet versioned) with the following contract:

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
        data_type: varchar
```

</File>

If you wanted to make a breaking change to the model - for example, removing a column - you'd create a new model file (SQL or Python) encompassing those breaking changes. The default convention is naming the new file with a `_v<version>` suffix. The new version can then be configured in relation to the original model:

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
        data_type: int
      - name: country_name
        description: Where this customer lives
        data_type: varchar
    versions:
      - v: 2
        columns:
          - include: "*"
            exclude:
              - country_name # this is the breaking change!
      - v: 1
```

</File>

The above configuration will create two models (one for each version), and produce database relations with aliases `dim_customers_v1` and `dim_customers_v2`.

By convention, dbt will expect those two models to be defined in files named `dim_customers_v1.sql` and `dim_customers_v2.sql`. It is possible to override this by setting a `defined_in` property.

You can reconfigure each version independently. For example, if you wanted `dim_customers.v1` to continue populating the database table named `dim_customers` (its original name), you could use the `defined_in` configuration:

```yml
      - v: 1
        defined_in: dim_customers # keep original relation name
```

:::info
Projects which have historically implemented [custom aliases](/docs/build/custom-aliases) by reimplementing the `generate_alias_name` macro will need to update their custom implementations to account for model versions. 

Otherwise, they'll see something like this as soon as they start using versions:

```sh
dbt.exceptions.AmbiguousAliasError: Compilation Error
  dbt found two resources with the database representation "database.schema.model_name".
  dbt cannot create two resources with identical database representations. To fix this,
  change the configuration of one of these resources:
  - model.project_name.model_name.v1 (models/.../model_name.sql)
  - model.project_name.model_name.v2 (models/.../model_name_v2.sql)
```
