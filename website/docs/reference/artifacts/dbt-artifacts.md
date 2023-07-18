---
title: "About dbt artifacts"
sidebar_label: "About dbt artifacts"
---

With every invocation, dbt generates and saves one or more *artifacts*. Several of these are <Term id="json" /> files (`semantic_manifest.json`, `manifest.json`, `catalog.json`, `run_results.json`, and `sources.json`) that are used to power:

- [documentation](/docs/collaborate/documentation)
- [state](/reference/node-selection/syntax#about-node-selection)
- [visualizing source freshness](/docs/build/sources#snapshotting-source-data-freshness)

They could also be used to:

- gain insights into your [dbt Semantic Layer](/docs/use-dbt-semantic-layer/dbt-sl)
- calculate project-level test coverage
- perform longitudinal analysis of run timing
- identify historical changes in <Term id="table" /> structure
- do much, much more

dbt has produced artifacts since the release of dbt-docs in v0.11.0. Starting in dbt v0.19.0, we are committing to a stable and sustainable way of versioning, documenting, and validating dbt artifacts.

## When are artifacts produced?

Most dbt commands (and corresponding RPC methods) produce artifacts:
- [semantic manifest](/docs/dbt-cloud-apis/sl-manifest): Lives in the `/target` directory of your dbt project and stores various artifacts (such as compiled models and tests) generated during the execution of your project.
- [manifest](/reference/artifacts/manifest-json): produced by commands that read and understand your project
- [run results](/reference/artifacts/run-results-json): produced by commands that run, compile, or catalog nodes in your DAG
- [catalog](catalog-json): produced by `docs generate`
- [sources](/reference/artifacts/sources-json): produced by `source freshness`

## Common metadata

<Changelog>New in v0.19.0</Changelog>

All artifacts produced by dbt include a `metadata` dictionary with these properties:

- `dbt_version`: Version of dbt that produced this artifact.
- `dbt_schema_version`: URL of this artifact's schema. See notes below.
- `generated_at`: Timestamp in UTC when this artifact was produced.
- `adapter_type`: The adapter (database), e.g. `postgres`, `spark`, etc.
- `env`: Any environment variables prefixed with `DBT_ENV_CUSTOM_ENV_` will be included in a dictionary, with the prefix-stripped variable name as its key.
- [`invocation_id`](/reference/dbt-jinja-functions/invocation_id): Unique identifier for this dbt invocation

In the manifest, the `metadata` may also include:
- `send_anonymous_usage_stats`: Whether this invocation sent [anonymous usage statistics](/reference/global-configs/usage-stats) while executing.
- `project_name`: The `name` defined in the root project's `dbt_project.yml`. (Added in manifest v10 / dbt Core v1.6)
- `project_id`: Project identifier, hashed from `project_name`, sent with anonymous usage stats if enabled.
- `user_id`: User identifier, stored by default in `~/dbt/.user.yml`, sent with anonymous usage stats if enabled.

#### Notes:
- The structure of dbt artifacts is canonized by [JSON schemas](https://json-schema.org/), which are hosted at **schemas.getdbt.com**.
- Artifact versions may change in any minor version of dbt (`v1.x.0`). Each artifact is versioned independently.
