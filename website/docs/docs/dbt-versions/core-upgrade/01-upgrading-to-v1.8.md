---
title: "Upgrading to v1.8 (beta)"
id: upgrading-to-v1.8
description: New features and changes in dbt Core v1.8
displayed_sidebar: "docs"
---

## Resources

- Changelog (coming soon)
- [CLI Installation guide](/docs/core/installation-overview)
- [Cloud upgrade guide](/docs/dbt-versions/upgrade-dbt-version-in-cloud)
- Release schedule (coming soon)

## What to know before upgrading

dbt Labs is committed to providing backward compatibility for all versions 1.x, with the exception of any changes explicitly mentioned below. If you encounter an error upon upgrading, please let us know by [opening an issue](https://github.com/dbt-labs/dbt-core/issues/new).

The dbt Core v1.8.0-b1 release of dbt-core & dbt Labs-maintained adapters is planned for February 28th.

## Keep on the latest version in dbt Cloud

 With dbt Cloud, you can get early access to many new features and functionality before it is in the GA release of dbt Core v1.8 without the need to manage version upgrades. For more details, refer to [Upgrade Core version in Cloud](/docs/dbt-versions/upgrade-dbt-version-in-cloud).

The **Keep on latest version** setting is currently available in closed beta for select dbt Cloud customers and will have wider availability in March of 2024.

## New and changed features and functionality

Features and functionality new in dbt v1.8.

### Updated installation procedure

Before v1.8, when you installed an adapter, you would automatically get `dbt-core ` installed along with the adapter package (if you didn’t already have an existing, compatible version of dbt-core).

Beginning in v1.8, you must install _both_ dbt-core and the desired adapter. A new `pip` installation needs to look like this:

```shell
pip install dbt-core dbt-ADAPTER_NAME
```

### Unit Tests

Historically, dbt's test coverage was confined to [“data” tests](/docs/build/data-tests), assessing the quality of input data or resulting datasets' structure.

In `1.8`, we're introducing native support for [unit testing](/docs/build/unit-tests). Unit tests validate your SQL modeling logic on a small set of static inputs __before__ you materialize your full model in production. They support a test-driven development approach, improving both the efficiency of developers and reliability of code.

When you execute `dbt test` in v1.8+, it will run both unit and data tests. Use the [`test_type`](/reference/node-selection/methods#the-test_type-method) method to run only unit or data tests:

```shell

dbt test --select "test_type:unit"           # run all unit tests
dbt test --select "test_type:data"           # run all data tests

```

Unit tests are defined in YML files in your `models/` directory and are currently only supported on SQL models. To distinguish between the two, the `tests:` config has been renamed to `data_tests:`. Both are currently supported for backward compatibility.

### The `--empty` flag

The [`run`](/reference/commands/run#the-`--empty`-flag) and [`build`](/reference/commands/build#the---empty-flag) commands now support the `--empty` flag for building schema-only dry runs. The `--empty` flag limits the refs and sources to zero rows. dbt will still execute the model SQL against the target data warehouse but will avoid expensive reads of input data. This validates dependencies and ensures your models will build properly.


## Quick hits

- [Global config flags](/reference/global-configs/about-global-configs) are deprecated from the [`profiles.yml`](/docs/core/connect-data-platform/profiles.yml) file and should be moved to the `dbt_project.yml`.
- A new subcategory of flags has been created for [legacy behaviors](reference/global-configs/legacy-behaviors).
- The [`--indirect_selection`](/reference/global-configs/indirect-selection) flag used with `dbt test` or `dbt build` configures which tests to run for the nodes you specify.
