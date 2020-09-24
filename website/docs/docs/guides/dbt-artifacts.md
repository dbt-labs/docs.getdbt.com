---
title: dbt Artifacts
---

When dbt runs dbt jobs, it generates and saves *artifacts*. These artifacts (`manifest.json`, `catalog.json`, `run_results.json`, and `sources.json`) are used to power:
- [auto-generated documentation site](documentation)
- [deferred runs](run#deferring-to-previous-run-state)
- [state selector method](methods#the-state-method)
- [dbt Cloud source freshness view](cloud-snapshotting-source-freshness)
- and much more to come!

dbt has produced artifacts since the release of dbt-docs in v0.11.0. Starting in dbt v0.19.0, we are committing to a stable and sustainable way of versioning, documenting, and validating dbt artifacts.

## When are artifacts produced?

Most dbt commands (and corresponding RPC methods) produce artifacts:
- `manifest`: produced by `compile`, `run`, `test`, `docs generate`, `ls`
- `run_results`: produced by `run`, `test`
- `catalog`: produced by `docs generate`
- `sources`: produced by `source snapshot-freshness`

## Artifact Metadata

<Changelog>New in v0.19.0</Changelog>

All artifacts produced by dbt include a `metadata` dictionary.

- `dbt_schema_version`
    - The structure of dbt artifacts is canonized by [JSON schemas](https://json-schema.org/) hosted at schemas.getdbt.com/dbt
    - The artifacts produced by dbt v0.18.0 are consistent with v1 schemas. Artifacts in dbt versions older than v0.18 are not officially versioned.
    - dbt v0.19.0 artifacts use v2 schemas.
    - Going forward, artifact versions may change in minor versions of dbt. Artifact version updates are not guaranteed to align with one another (e.g. we may have a v3 `manifest` while still using v2 `sources`). We will always include artifact schema updates as breaking changes in the release notes.
- [`invocation_id`](invocation_id)
- `generated_at`: timestamp in UTC when the artifact was produced
- `env`: any environment variables prefixed with `DBT_ENV_CUSTOM_ENV_` will be included in a dictionary, with the prefix-stripped variable name as its key
