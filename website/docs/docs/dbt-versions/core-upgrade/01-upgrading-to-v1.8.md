---
title: "Upgrading to v1.8 (beta)"
id: upgrading-to-v1.8
description: New features and changes in dbt Core v1.8
displayed_sidebar: "docs"
---

## Resources

- Changelog (coming soon)
- [dbt Core CLI Installation guide](/docs/core/installation-overview)
- [Cloud upgrade guide](/docs/dbt-versions/upgrade-dbt-version-in-cloud)
- Release schedule (coming soon)

## What to know before upgrading

dbt Labs is committed to providing backward compatibility for all versions 1.x, except for any changes explicitly mentioned on this page. If you encounter an error upon upgrading, please let us know by [opening an issue](https://github.com/dbt-labs/dbt-core/issues/new).

dbt Labs plans to release dbt Core v1.8.0-b1 and dbt Labs-maintained adapters on February 28th, 2024.

## Keep on the latest version in dbt Cloud

With dbt Cloud, you can get early access to many new features and functionality before it's in the Generally Available (GA) release of dbt Core v1.8 without the need to manage version upgrades. For more details, refer to [Upgrade Core version in Cloud](/docs/dbt-versions/upgrade-dbt-version-in-cloud).

The **Keep on latest version** setting is currently available in beta for most dbt Cloud customers, with full availability by the end of March 2024.

## New and changed features and functionality

Features and functionality new in dbt v1.8.

### New dbt Core adapter installation procedure

Before v1.8, when you installed an adapter, you would automatically get `dbt-core` installed along with the adapter package (if you didn’t already have an existing, compatible version of dbt-core).

Beginning in v1.8, the [dbt adapters and dbt Core have been decoupled](https://github.com/dbt-labs/dbt-adapters/discussions/87). As a result, you must install _both_ dbt-core and the desired adapter. A new `pip` installation needs to look like this:

```shell
pip install dbt-core dbt-ADAPTER_NAME
```

For example, you would use the following command if you use Snowflake:
```shell
pip install dbt-core dbt-snowflake
```

### Unit Tests

Historically, dbt's test coverage was confined to [“data” tests](/docs/build/data-tests), assessing the quality of input data or resulting datasets' structure.

In v1.8, we're introducing native support for [unit testing](/docs/build/unit-tests). Unit tests validate your SQL modeling logic on a small set of static inputs __before__ you materialize your full model in production. They support a test-driven development approach, improving both the efficiency of developers and the reliability of code.

Starting from v1.8, when you execute the `dbt test` command, it will run both unit and data tests. Use the [`test_type`](/reference/node-selection/methods#the-test_type-method) method to run only unit or data tests:

```shell

dbt test --select "test_type:unit"           # run all unit tests
dbt test --select "test_type:data"           # run all data tests

```

Unit tests are defined in YML files in your `models/` directory and are currently only supported on SQL models. To distinguish between the two, the `tests:` config has been renamed to `data_tests:`. Both are currently supported for backward compatibility.

### The `--empty` flag

The [`run`](/reference/commands/run#the-`--empty`-flag) and [`build`](/reference/commands/build#the---empty-flag) commands now support the `--empty` flag for building schema-only dry runs. The `--empty` flag limits the refs and sources to zero rows. dbt will still execute the model SQL against the target data warehouse but will avoid expensive reads of input data. This validates dependencies and ensures your models will build properly.

### Additional attributes in run_results.json

The run_results.json now includes three attributes related to the `applied` state that complement `unique_id`:

- `compiled`: Boolean entry of the node compilation status (`False` after parsing, but `True` after compiling).
- `compiled_code`: Rendered string of the code that was compiled (empty after parsing, but full string after compiling).
- `relation_name`: The fully-qualified name of the object that was (or will be) created/updated within the database.


## Quick hits

- [Global config flags](/reference/global-configs/about-global-configs) are deprecated from the [`profiles.yml`](/docs/core/connect-data-platform/profiles.yml) file and should be moved to the [`dbt_project.yml`](/reference/dbt_project.yml).
- A new subcategory of flags has been created for [legacy behaviors](/reference/global-configs/legacy-behaviors).
- The [`--indirect_selection`](/reference/global-configs/indirect-selection) flag used with `dbt test` or `dbt build` configures which tests to run for the nodes you specify.
