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

:::tip Keep on latest version, always

Starting this year, let dbt Labs handle version upgrades for you. With dbt Cloud, you can get early access to new functionality before it lands in the final release of dbt Core v1.8 and without the need of managing your own version upgrades. For more details, refer to [Upgrade Core version in Cloud](/docs/dbt-versions/upgrade-dbt-version-in-cloud).

The **Keep on latest version** setting is currently available in beta for select dbt Cloud customers, rolling out to wider availability through February and March.

For users of dbt Core, the v1.8.0-b1 release of `dbt-core` & dbt Labs-maintained adapters is planned for February 28.

:::

## What to know before upgrading

dbt Labs is committed to providing backward compatibility for all versions 1.x, with the exception of any changes explicitly mentioned below. If you encounter an error upon upgrading, please let us know by [opening an issue](https://github.com/dbt-labs/dbt-core/issues/new).

## New and changed features and functionality

Features and functionality new in dbt v1.8

### The `--empty` flag

The [`run`](/reference/commands/run#the-`--empty`-flag) and [`build`](/reference/commands/run#the-`--empty`-flag) commands now support the `--empty` flag for building schema-only dry runs. The `--empty` flag limits the refs and sources to zero rows. dbt will still execute the model SQL against the target data warehouse but will avoid expensive reads of input data. This validates dependencies and ensures your models will build properly.


## Quick hits

Coming soon!