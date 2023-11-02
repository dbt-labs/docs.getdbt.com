---
title: "Upgrading to v1.0"
description: New features and changes in dbt Core v1.0
id: "upgrading-to-v1.0"
displayed_sidebar: "docs"
---

import UpgradeMove from '/snippets/_upgrade-move.md';

<UpgradeMove />

### Resources

- [Discourse](https://discourse.getdbt.com/t/3180)
- [Changelog](https://github.com/dbt-labs/dbt-core/blob/1.0.latest/CHANGELOG.md)
- [CLI Installation guide](/docs/core/installation)
- [Cloud upgrade guide](/docs/dbt-versions/upgrade-core-in-cloud)

## What to know before upgrading

dbt Core major version 1.0 includes a number of breaking changes! Wherever possible, we have offered backwards compatibility for old behavior, and (where necessary) made migration simple.

### Renamed fields in `dbt_project.yml`

**These affect everyone:**
- [model-paths](/reference/project-configs/model-paths) have replaced `source-paths` in `dbt-project.yml`.
- [seed-paths](/reference/project-configs/seed-paths) have replaced `data-paths` in `dbt-project.yml` with a default value of `seeds`.
- The [packages-install-path](/reference/project-configs/packages-install-path) was updated from `modules-path`.  Additionally the default value is now `dbt_packages` instead of `dbt_modules`.  You may need to update this value in [`clean-targets`](/reference/project-configs/clean-targets).
- Default for `quote_columns` is now `True` for all adapters other than Snowflake.

**These probably don't:**
- The default value of [test-paths](/reference/project-configs/test-paths) has been updated to be the plural `tests`.
- The default value of [analysis-paths](/reference/project-configs/analysis-paths) has been updated to be the plural `analyses`.

### Tests

The two **test types** are now "singular" and "generic" (instead of "data" and "schema", respectively). The `test_type:` selection method accepts `test_type:singular` and `test_type:generic`. (It will also accept `test_type:schema` and `test_type:data` for backwards compatibility.) **Not backwards compatible:** The `--data` and `--schema` flags to dbt test are no longer supported, and tests no longer have the tags `'data'` and `'schema'` automatically applied. Updated docs: [tests](/docs/build/tests), [test selection](/reference/node-selection/test-selection-examples), [selection methods](/reference/node-selection/methods).

The `greedy` flag/property has been renamed to **`indirect_selection`**, which is now eager by default. **Note:** This reverts test selection to its pre-v0.20 behavior by default. `dbt test -s my_model` _will_ select multi-parent tests, such as `relationships`, that depend on unselected resources. To achieve the behavior change in v0.20 + v0.21, set `--indirect-selection=cautious` on the CLI or `indirect_selection: cautious` in YAML selectors. Updated docs: [test selection examples](/reference/node-selection/test-selection-examples), [yaml selectors](/reference/node-selection/yaml-selectors).

### Global macros

Global project macros have been reorganized, and some old unused macros have been removed: `column_list`, `column_list_for_create_table`, `incremental_upsert`. This is unlikely to affect your project.

### Installation

- [Installation docs](/docs/supported-data-platforms) reflects adapter-specific installations
- `pip install dbt` is no longer supported, and will raise an explicit error. Install the specific adapter plugin you need as `pip install dbt-<adapter>`.
- `brew install dbt` is no longer supported. Install the specific adapter plugin you need (among Postgres, Redshift, Snowflake, or BigQuery) as `brew install dbt-<adapter>`.
- Removed official support for python 3.6, which is reaching end of life on December 23, 2021

### For users of adapter plugins

- **BigQuery:** Support for [ingestion-time-partitioned tables](/guides/legacy/creating-date-partitioned-tables) has been officially deprecated in favor of modern approaches. Use `partition_by` and incremental modeling strategies instead.

### For maintainers of plugins + other integrations

We've introduced a new [**structured event interface**](/reference/events-logging), and we've transitioned all dbt logging to use this new system. **This includes a breaking change for adapter plugins**, requiring a very simple migration. For more details, see the [`events` module README](https://github.com/dbt-labs/dbt-core/blob/HEAD/core/dbt/events/README.md#adapter-maintainers). If you maintain a different kind of plugin that _needs_ legacy logging, for the time being, you can re-enable it with an env var (`DBT_ENABLE_LEGACY_LOGGER=True`); be advised that we will remove this capability in a future version of dbt Core.

The [**dbt RPC Server**](/reference/commands/rpc) has been split out from `dbt-core` and is now packaged separately. Its functionality will be fully deprecated by the end of 2022, in favor of a new dbt Server. Instead of `dbt rpc`, use `dbt-rpc serve`.

**Artifacts:** New schemas (manifest v4, run results v4, sources v3). Notable changes: add `metrics` nodes; schema test + data test nodes are renamed to generic test + singular test nodes; freshness threshold default values look slightly different.

### Deprecations from long ago

Several under-the-hood changes from past minor versions, tagged with deprecation warnings, have now been fully deprecated.
- The `packages` argument of [dispatch](/reference/dbt-jinja-functions/dispatch) has been deprecated and will raise an exception when used.
- The "adapter_macro" macro has been deprecated. Instead, use the [dispatch](/reference/dbt-jinja-functions/dispatch) method to find a macro and call the result.
- The `release` arg has been removed from the `execute_macro` method.

## New features and changed documentation

- Add [metrics](/docs/build/metrics), a new node type
- [Generic tests](/guides/best-practices/writing-custom-generic-tests) can be defined in `tests/generic` (new), in addition to `macros/` (as before)
- [Parsing](/reference/parsing): partial parsing and static parsing have been turned on by default.
- [Global configs](/reference/global-configs/about-global-configs) have been standardized. Related updates to [global CLI flags](/reference/global-cli-flags) and [`profiles.yml`](/docs/core/connect-data-platform/profiles.yml).
- [The `init` command](/reference/commands/init) has a whole new look and feel. It's no longer just for first-time users.
- Add `result:<status>` subselectors for smarter reruns when dbt models have errors and tests fail. See examples: [Pro-tips for Workflows](/guides/legacy/best-practices#pro-tips-for-workflows)
- Secret-prefixed [env vars](/reference/dbt-jinja-functions/env_var) are now allowed only in `profiles.yml` + `packages.yml`
