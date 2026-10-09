---
title: "Upgrading to v1.13"
id: upgrading-to-v1.13
description: New features and changes in dbt v1.13
displayed_sidebar: "docs"
availability:
  engine: v1
  access: free
---

# Upgrading to v1.13 <Lifecycle status="beta" />

## Resources
- [dbt v1.13 changelog](https://github.com/dbt-labs/dbt/blob/1.13.latest/CHANGELOG.md)
- [<Constant name="core" /> CLI Installation guide](/docs/local/install-dbt)
- [dbt platform upgrade guide](/docs/dbt-versions/upgrade-dbt-platform-version#release-tracks)

## What to know before upgrading

dbt Labs is committed to providing backward compatibility for all versions 1.x. Any behavior changes will be accompanied by a [behavior change flag](/reference/global-configs/behavior-changes#behavior-change-flags) to provide a migration window for existing projects. If you encounter an error upon upgrading, please let us know by [opening an issue](https://github.com/dbt-labs/dbt/issues/new).

<Constant name="dbt" /> provides the functionality from new versions of <Constant name="core" /> via [release tracks](/docs/dbt-versions/dbt-release-tracks) with automatic upgrades. If you have selected the **v1 Latest** release track in <Constant name="dbt" />, you already have access to all the features, fixes, and other functionality included in the latest <Constant name="core" /> version! If you have selected the **v1 Compatible** release track, you will have access to the next monthly **v1 Compatible** release after the dbt v1.13 final release.

## New and changed features and functionality

**Coming soon**

## Adapter-specific features and functionalities

### BigQuery

- Unit tests now support the `_FILE_NAME` pseudocolumn on BigQuery external tables. You can include them directly in `dict` or `csv` fixture rows without `format: sql`. For more information, refer to [Unit testing with pseudocolumns](/docs/build/unit-tests#unit-testing-with-pseudocolumns).
