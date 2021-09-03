---
title: "Upgrading to 0.21.0"

---

:::info Beta

dbt v0.21.0-b2 is currently available as a prerelease. If you have questions or encounter bugs, please let us know in [#dbt-prereleases](https://community.getdbt.com/) or by opening an issue [in GitHub](https://github.com/dbt-labs/dbt).

:::

### Resources

- [Changelog](https://github.com/dbt-labs/dbt/blob/0.21.latest/CHANGELOG.md)

## Breaking changes

- `dbt source snapshot-freshness` has been renamed to `dbt source freshness`, and its node selection logic is consistent with other commands

## New and changed documentation

- [Commands](dbt-commands), [`build`](commands/build), [rpc](rpc): Add `dbt build`
- [Node selection syntax](node-selection/syntax) and above: Switch `--models` for `--select` across the board. (Commands which previously used the `--models` flag still support it for backwards compatibility.)
- [Configuring incremental models](configuring-incremental-models): New optional configuration for incremental models, `on_schema_change`.
- [Commands: `source`](commands/source): Renamed to `dbt source freshness`, updated selection logic.
- [Environment variables](env_var): Add a log-scrubbing prefix, `DBT_ENV_SECRET_`
- [Selection methods](node-selection/methods) and [state comparison caveats](state-comparison-caveats): Add `state:modified` subselectors, and reflect that it now includes changes to upstream macros.
- [`deps`](commands/deps): Add `dbt deps` logging for outdated packages

### Plugins
- **Redshift**: [profile](redshift-profile) property `ra3: true` to support cross-database source definitions and read-only querying
- **BigQuery**: [Snapshots](snapshots) support `target_project` and `target_dataset` config aliases