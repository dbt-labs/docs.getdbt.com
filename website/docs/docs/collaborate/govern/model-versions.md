---
title: "Model versions"
id: model-versions
sidebar_label: "Model versions"
description: "Version models to help with lifecycle management"
---

:::info New functionality
This functionality is new in v1.5.
:::

Versioning APIs is a challenging problem in software engineering. The goal of model versions is not to make the problem go away, or pretend it's easier than it is. Rather, we want dbt to provide tools that make it possible to tackle this problem, thoughtfully and head-on, and to develop standard patterns for solving it.

## Related documentation
- [`versions`](resource-properties/versions)
- [`latest_version`](resource-properties/latest-version)
- [`include` & `exclude`](resource-properties/include-exclude)
- [`ref` with `version` argument](ref#versioned-ref)

## Why version a model?

If a model defines a ["contract"](model-contracts) (a set of guarantees for its structure), it's also possible to change that model's structure in a way that "breaks" the previous set of guarantees.

One approach is to force every model consumer to immediately handle the breaking change as soon as it's deployed to production. This is actually the appropriate answer at many smaller organizations, or while rapidly iterating on a not-yet-mature set of data models. But it doesn’t scale well beyond that.

Instead, for mature models at larger organizations, the model owner can create a **new version**, during which consumers can migrate from the old version to the new.

In the meantime, anywhere that model is used downstream, it can continue to be referenced at a specific version.

In the future, we intend to also add support for **deprecating models**. Taken together, model versions and deprecation offer a pathway for _sunsetting_ and _migrating_. In the short term, avoid breaking everyone's queries. Over the longer term, older & unmaintained versions go away—they do **not** stick around forever.

## When should you version a model?

Many changes to a model are not breaking, and do not require a new version! Examples include adding a new column, or fixing a bug in modeling logic.

By enforcing a model's contract, dbt can help you catch unintended changes to column names and data types that could cause a big headache for downstream queriers.

It's also possible to change the model in more subtle ways — by recalculating a column in a way that doesn't change its name, data type, or enforceable characteristics—but would substantially change the results seen by downstream queriers.

The process of sunsetting and migrating model versions requires real work, and may require significant coordination across teams. If, instead of using model versions, you opt for non-breaking changes wherever possible—that's a completely legitimate approach. Even so, after a while, you'll find yourself with lots of unused or deprecated columns. Many teams will want to consider a predictable cadence (once or twice a year) for bumping the version of their mature models, and taking the opportunity to remove no-longer-used columns.

## How is this different from "version control"?

[Version control](git-version-control) allows your team to collaborate simultaneously on a single code repository, manage conflicts between changes, and review changes before deploying into production. In that sense, version control is an essential tool for versioning the deployment of an entire dbt project—always the latest state of the `main` branch, with the ability to "rollback" changes by reverting a commit or pull request. In general, only one version of your project code is deployed into an environment at a time.

Model versions are different. Multiple versions of a model will live in the same code repository at the same time and be deployed into the same data environment simultaneously. This is similar to how web APIs are versioned—multiple versions are live simultaneously; older versions are often eventually sunsetted.

## How is this different from just creating a new model?

Honestly, it's only a little bit different! There isn't much magic here, and that's by design.

You've always been able to create a new model, and name it `dim_customers_v2`. Why should you opt for a "real" versioned model instead?

First, the versioned model preserves its _reference name_. Versioned models are `ref`'d by their _model name_, rather than the name of the file that they're defined in. By default, the `ref` resolves to the latest version (as declared by that model's maintainer), but you can also `ref` a specific version of the model, with a `version` keyword.

<File name="models/schema.yml">

```sql
{{ ref('dim_customers') }}            -- resolves to latest
{{ ref('dim_customers', version=2) }} -- resolves to v2
```

</File>

Second, a versioned model can reuse the majority of its yaml properties and configuration. Each version needs to only say how it _differs_ from the shared set of attributes. This gives you an opportunity to highlight the differences across versions—which is otherwise difficult to detect in models with dozens or hundreds of columns—and to clearly track, in one place, all versions of the model which are currently live.

Third, dbt supports `version`-based selection. For example, you could define a [default yaml selector](node-selection/yaml-selectors#default), to avoid running any old model versions in development—even as you continue to run them in production through a sunset and migration period:

```yml
selectors:
  - name: exclude_old_versions
    default: "{{ target.name == 'dev' }}"
    definition:
      method: fqn
      value: "*"
      exclude:
        - method: version
          value: old
```

Finally, we intend to add support for **deprecating models** in dbt Core v1.6. When you slate a versioned model for deprecation, dbt will be able to provide more helpful warnings to downstream consumers of that model. Rather than just, "This model is going away," it's - "This older version of the model is going away, and there's a new version coming soon."

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
    latest_version: 1
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

By convention, dbt will expect those two models to be defined in files named `dim_customers_v1.sql` and `dim_customers_v2.sql`. (It is possible to override this by setting `defined_in: any_file_name_you_want`, but we strongly encourage you to follow the convention!)

The `latest_version` would be `2` (numerically greatest) if not specified explicitly. In this case, `v1` is specified to still be the latest; `v2` is just a prerelease in early development. When ready to roll out `v2` to everyone by default, bump the `latest_version` to `2` (or remove it from the specification).

### Configuring versioned models

You can reconfigure each version independently. For example, you could materialize `v2` as a table and `v1` as a view:

<File name="models/schema.yml">

```yml
versions:
  - v: 2
    config:
      materialized: table
  - v: 1
    config:
      materialized: view
```

</File>

Like with all config inheritance, any configs set _within_ the versioned model's definition (`.sql` or `.py` file) will take precedence over the configs set in yaml.

### Configuring database location with `alias`

Following the example, let's say you wanted `dim_customers.v1` to continue populating the database table named `dim_customers`. That's what the table was named previously, and you may have several other dashboards or tools expecting to read its data from `<dbname>.<schemaname>.dim_customers`.

You could use the `alias` configuration:

<File name="models/schema.yml">

```yml
      - v: 1
        config:
          alias: dim_customers   # keep v1 in its original database location
```

</File>

Or, you could define a separate view that always points to the latest version of the model. We recommend this pattern because it's the most transparent and easiest to follow.

<File name="models/dim_customers_view.yml">

```sql
{{ config(alias = 'dim_customers') }}

select * from {{ ref('dim_customers') }}
```

</File>

:::info
If your project has historically implemented [custom aliases](/docs/build/custom-aliases) by reimplementing the `generate_alias_name` macro, and you'd like to start using model versions, you should update your custom implementation to account for model versions. Specifically, we'd encourage you to add [a condition like this one](https://github.com/dbt-labs/dbt-core/blob/ada8860e48b32ac712d92e8b0977b2c3c9749981/core/dbt/include/global_project/macros/get_custom_name/get_custom_alias.sql#L26-L30).

Your existing implementation of `generate_alias_name` should not encounter any errors upon first upgrading to v1.5. It's only when you create your first versioned model, that you may see an error like:

```sh
dbt.exceptions.AmbiguousAliasError: Compilation Error
  dbt found two resources with the database representation "database.schema.model_name".
  dbt cannot create two resources with identical database representations. To fix this,
  change the configuration of one of these resources:
  - model.project_name.model_name.v1 (models/.../model_name.sql)
  - model.project_name.model_name.v2 (models/.../model_name_v2.sql)
```

We opted to use `generate_alias_name` for this functionality so that the logic remains accessible to end users, and could be reimplemented with custom logic.

### Optimizing model versions

How you define each model version is completely up to you. While it's easy to start by copy-pasting from one model's SQL definition into another, you should think about _what actually is changing_ from one version to another.

For example, if your new model version is only renaming or removing certain columns, you could define one version as a view on top of the other one:

<File name="models/dim_customers_v2.sql">

```sql
{{ config(materialized = 'view') }}

{% set dim_customers_v1 = ref('dim_customers', v=1)}

select
{{ dbt_utils.star(from=dim_customers_v1, except=["country_name"]) }}
from {{ dim_customers_v1 }}
```

</File>

Of course, if one model version makes meaningful and substantive changes to logic in another, it may not be possible to optimize it in this way. At that point, the cost of human intuition and legibility is more important than the cost of recomputing similar transformations.

We expect to develop more opinionated recommendations as teams start adopting model versions in practice. One recommended pattern we can envision: Prioritize the definition of the `latest_version`, and define other versions (old and prerelease) based on their diffs from the latest. How?
- Define the properties and configuration for the latest version in the top-level model yaml, and the diffs for other versions below (via `include`/`exclude`)
- Where possible, define other versions as `select` transformations, which take the latest version as their starting point
- When bumping the `latest_version`, migrate the SQL and yaml accordingly. In this case, we would see if it's possible to redefine `v1` with respect to `v2`.
