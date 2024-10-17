---
title: "About dbt artifacts"
sidebar_label: "About dbt artifacts"
---

With every invocation, dbt generates and saves one or more *artifacts*. Several of these are <Term id="json" /> files (`semantic_manifest.json`, `manifest.json`, `catalog.json`, `run_results.json`, and `sources.json`) that are used to power:

- [documentation](/docs/collaborate/build-and-view-your-docs)
- [state](/reference/node-selection/syntax#about-node-selection)
- [visualizing source freshness](/docs/build/sources#snapshotting-source-data-freshness)

They could also be used to:

- gain insights into your [dbt Semantic Layer](/docs/use-dbt-semantic-layer/dbt-sl)
- calculate project-level test coverage
- perform longitudinal analysis of run timing
- identify historical changes in <Term id="table" /> structure
- do much, much more

dbt has produced artifacts since the release of dbt-docs in v0.11.0. Starting in dbt v0.19.0, we are committing to a stable and sustainable way of versioning, documenting, and validating dbt artifacts.

### When are artifacts produced? <Lifecycle status="team,enterprise"/>

Most dbt commands (and corresponding RPC methods) produce artifacts:
- [semantic manifest](/reference/artifacts/sl-manifest): produced whenever your dbt project is parsed
- [manifest](/reference/artifacts/manifest-json): produced by commands that read and understand your project
- [run results](/reference/artifacts/run-results-json): produced by commands that run, compile, or catalog nodes in your DAG
- [catalog](catalog-json): produced by `docs generate`
- [sources](/reference/artifacts/sources-json): produced by `source freshness`

When running commands from the [dbt Cloud CLI](/docs/cloud/cloud-cli-installation), all artifacts are downloaded by default. If you want to change this behavior, refer to [How to skip artifacts from being downloaded](/docs/cloud/configure-cloud-cli#how-to-skip-artifacts-from-being-downloaded).

## Where are artifacts produced?

By default, artifacts are written to the `/target` directory of your dbt project. You can configure the location using the [`target-path` flag](/reference/global-configs/json-artifacts).

## Common metadata

All artifacts produced by dbt include a `metadata` dictionary with these properties:

- `dbt_version`: Version of dbt that produced this artifact. For details about release versioning, refer to [Versioning](/reference/commands/version#versioning). 
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

- The structure of dbt artifacts is canonized by [JSON schemas](https://json-schema.org/), which are hosted at [schemas.getdbt.com](https://schemas.getdbt.com/).
- Artifact versions may change in any minor version of dbt (`v1.x.0`). Each artifact is versioned independently.

## Related docs
- [Other artifacts](/reference/artifacts/other-artifacts) files such as `index.html` or `graph_summary.json`.
