---
title: "Upgrading to v1.13"
id: upgrading-to-v1.13
description: New features and changes in dbt Core v1.13
displayed_sidebar: "docs"
---

# Upgrading to v1.13 <Lifecycle status="beta" />

## Resources

- [<Constant name="core" /> v1.13 changelog](https://github.com/dbt-labs/dbt-core/blob/1.13.latest/CHANGELOG.md)
- [<Constant name="core" /> CLI Installation guide](/docs/local/install-dbt)
- [dbt platform upgrade guide](/docs/dbt-versions/upgrade-dbt-platform-version#release-tracks)

## What to know before upgrading

dbt Labs is committed to providing backward compatibility for all versions 1.x. Any behavior changes will be accompanied by a [behavior change flag](/reference/global-configs/behavior-changes#behavior-change-flags) to provide a migration window for existing projects. If you encounter an error upon upgrading, please let us know by [opening an issue](https://github.com/dbt-labs/dbt-core/issues/new).

<Constant name="dbt" /> provides the functionality from new versions of <Constant name="core" /> via [release tracks](/docs/dbt-versions/dbt-release-tracks) with automatic upgrades. If you have selected the **Latest** release track in <Constant name="dbt" />, you already have access to all the features, fixes, and other functionality included in the latest <Constant name="core" /> version. If you have selected the **Compatible** release track, you will have access to the next monthly **Compatible** release after the <Constant name="core" /> v1.13 final release.

## New and changed features and functionality

### dbt State

[dbt State](/docs/deploy/dbt-state-about) is natively available in <Constant name="core" /> v1.13. dbt State helps dbt decide whether selected nodes need to rebuild by comparing each node's logic and data against previous builds. When a node is unchanged and its upstream data is still fresh, dbt can reuse an existing relation instead of rebuilding it.

To use dbt State locally, run [`dbt login`](/reference/commands/login) and authenticate with your <Constant name="dbt_platform" /> account or a standalone [dbt State account](https://app.state.dbt.com). After authentication, dbt State can run automatically on `dbt run` and `dbt build`.

You can enable or disable dbt State per invocation with `--manage-state` or `--no-manage-state`, or by setting the `DBT_ENGINE_MANAGE_STATE` environment variable. To enable dbt State for everyone on your project, add `manage_state: true` to the `flags:` block in `dbt_project.yml`.

For setup steps and configuration options, refer to [Setting up dbt State](/docs/deploy/dbt-state-setup) and [dbt State configs](/reference/resource-configs/dbt-state-configs).
