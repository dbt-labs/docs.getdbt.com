---
title: "Upgrading to 0.21.0"

---

:::info Release candidate

dbt v0.21.0-rc1 is currently available as a release candidate. If you have questions or encounter bugs, please let us know in [#dbt-prereleases](https://community.getdbt.com/) or by opening an issue [in GitHub](https://github.com/dbt-labs/dbt).

:::

### Resources

- [Changelog](https://github.com/dbt-labs/dbt/blob/0.21.latest/CHANGELOG.md)

## Breaking changes

- `dbt source snapshot-freshness` has been renamed to `dbt source freshness`. Its node selection logic is now consistent with other tasks. In order to check freshness for a specific source, you must prefix it with `source:`.
- Two dbt JSON artifacts have a new schema: [`manifest.json`](manifest-json) (new default node properties) and [`sources.json`](sources-json) (now includes timing information).

## New and changed documentation

### Tasks
- [Commands](dbt-commands), [`build`](commands/build), [rpc](rpc): Add `dbt build`
- [Commands: `source`](commands/source): Renamed to `dbt source freshness`.
- [`deps`](commands/deps): Add `dbt deps` logging for outdated packages
- [`list`](commands/list): Add `--output-keys` flag and RPC parameter

## Selection
- [Commands: `source`](commands/source): Updated selection logic to match other tasks. When selecting a specific source to check freshness, you must prefix it with `source:`.
- [Node selection syntax](node-selection/syntax), [commands](dbt-commands): Switch `--models` for `--select` across the board. (Commands which previously used the `--models` flag still support it for backwards compatibility.)
- [YAML selectors](yaml-selectors#default) now support an optional `default` property. If set, dbt will use custom selection criteria for commands that do not specify their own selection/exclusion flags.
- [Selection methods](node-selection/methods) and [state comparison caveats](state-comparison-caveats): Add `state:modified` subselectors, and reflect that it now includes changes to upstream macros.

### Elsewhere in Core
- [Configuring incremental models](configuring-incremental-models): New optional configuration for incremental models, `on_schema_change`.
- [Environment variables](env_var): Add a log-scrubbing prefix, `DBT_ENV_SECRET_`

### Plugins
- **Postgres** [profile](postgres-profile) property `connect_timeout` now configurable. Also applicable to child plugins (e.g. `dbt-redshift`)
- **Redshift**: [profile](redshift-profile) property `ra3: true` to support cross-database source definitions and read-only querying
- **BigQuery**: [profile](bigquery-profile) property `execution_project` now configurable. [Snapshots](snapshots) support `target_project` and `target_dataset` config aliases.