---
title: "Upgrading to 0.21.0"

---

:::info Beta

dbt v0.21.0-b1 is currently available as a prerelease. If you have questions or encounter bugs, please let us know in [#dbt-prereleases](https://community.getdbt.com/) or by opening an issue [in GitHub](https://github.com/dbt-labs/dbt).

:::

### Resources

- [Changelog](https://github.com/dbt-labs/dbt/blob/0.21.latest/CHANGELOG.md)

## Breaking changes

- `dbt source snapshot-freshness` has been renamed to `dbt source freshness`, and its node selection logic is consistent with other commands

## New and changed documentation

- [Commands](dbt-commands) and [Commands: `build`](commands/build): Add `dbt build`
- [Configuring incremental models](configuring-incremental-models): New optional configuration for incremental models, `on_schema_change`.
- [Commands: `source`](commands/source): Renamed to `dbt source freshness`, updated selection logic.
- [Environment variables](env_var): Add a log-scrubbing prefix, `DBT_ENV_SECRET_`

### Plugins
- [Redshift profile](redshift-profile): `ra3: true` profile property to support cross-database source definitions and read-only querying
