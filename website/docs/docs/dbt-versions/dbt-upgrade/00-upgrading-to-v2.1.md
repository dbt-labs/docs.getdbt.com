---
title: "Upgrading to v2.1"
id: upgrading-to-v2.1
description: New features and changes in dbt v2.1
displayed_sidebar: "docs"
availability:
  engine: v2
  access: free
---

import FusionLifecycle from '/snippets/_v2-lifecycle-callout.md';

# Upgrading to v2.1 <Lifecycle status="beta" />

<FusionLifecycle />

## Resources
- [dbt v2.1 changelog](https://github.com/dbt-labs/dbt/blob/2.1.latest/CHANGELOG.md)
- [Install dbt](/docs/local/install-dbt)
- [dbt platform upgrade guide](/docs/dbt-versions/upgrade-dbt-platform-version)

## What to know before upgrading

Fivetran is committed to providing backward compatibility for all versions 2.x. Any behavior changes will be accompanied by a [behavior change flag](/reference/global-configs/behavior-changes#behavior-change-flags) to provide a migration window for existing projects. If you encounter an error upon upgrading, please let us know by [opening an issue](https://github.com/dbt-labs/dbt/issues/new).

<Constant name="dbt" /> provides the functionality from new versions of dbt v2 via [release tracks](/docs/dbt-versions/dbt-release-tracks) with automatic upgrades. If you have selected the **v2 Preview** release track in <Constant name="dbt" />, you already have access to all the features, fixes, and other functionality included in the latest dbt v2 version! If you have selected the **v2 Extended** release track, you will have access to the next monthly **v2 Extended** release after the dbt v2.1 final release.

## New and changed features and functionality

### Behavior change flags

dbt v2.1 introduces new flags for [managing changes to legacy behaviors](/reference/global-configs/behavior-changes). You can opt into recently introduced changes (disabled by default) by setting `true` for `flags` in `dbt_project.yml`.

- (Introduced, disabled by default) [`use_v2_empty_sql_rewrite`](/reference/global-configs/behavior-flags/use_v2_empty_sql_rewrite). When you enable this flag, dbt rewrites `ref()`, `source()`, and `{{ this }}` into named zero-row subqueries when running with `--empty`, preserving implicit table aliases. This resolves an error that occurs when your model SQL qualifies column names with the relation name (for example, `my_table.col_a`) without an explicit alias.
