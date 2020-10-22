---
title: dbt Artifacts
---

With every invocation, dbt generates and saves one or more *artifacts*. Several of these are JSON files (`manifest.json`, `catalog.json`, `run_results.json`, and `sources.json`) that are used to power:
- [documentation](documentation)
- [state](state)
- [visualizing source freshness](cloud-snapshotting-source-freshness)

They could also be used to:
- calculate project-level test coverage
- perform longitudinal analysis of run timing
- identify historical changes in table structure
- do much, much more

dbt has produced artifacts since the release of dbt-docs in v0.11.0. Starting in dbt v0.19.0, we are committing to a stable and sustainable way of versioning, documenting, and validating dbt artifacts.

## When are artifacts produced?

Most dbt commands (and corresponding RPC methods) produce artifacts:
- **manifest**: produced by `compile`, `run`, `test`, `docs generate`, `ls`
- **run results**: produced by `run`, `test`, `seed`, `snapshot`, `docs generate`
- **catalog**: produced by `docs generate`
- **sources**: produced by `source snapshot-freshness`

## Common Artifact Metadata

<Changelog>New in v0.19.0</Changelog>

All artifacts produced by dbt include a `metadata` dictionary.

- `dbt_version`: Version of dbt that produced this artifact.
- `dbt_schema_version`: URL of this artifact's schema. See notes below.
- [`invocation_id`](invocation_id)
- `generated_at`: Timestamp in UTC when this artifact was produced.
- `env`: Any environment variables prefixed with `DBT_ENV_CUSTOM_ENV_` will be included in a dictionary, with the prefix-stripped variable name as its key.

#### Notes:
- The structure of dbt artifacts is canonized by [JSON schemas](https://json-schema.org/) hosted at https://schemas.getdbt.com/dbt/
- Going forward, artifact versions may change in minor versions of dbt. Artifact version updates are not guaranteed to align with one another (e.g. we may have a v3 `manifest` while still using v2 `sources`). We will always include artifact schema updates as breaking changes in the release notes.
