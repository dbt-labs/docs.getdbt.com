---
title: "Upgrading to 0.21.0"

---

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
