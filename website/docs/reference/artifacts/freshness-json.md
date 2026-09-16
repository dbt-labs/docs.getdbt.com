---
title: "Freshness JSON file"
sidebar_label: "Freshness"
availability:
  engine: v2
  access: free
---

# Freshness JSON file <Lifecycle status="beta" />

**Current schema**: [v0](https://schemas.getdbt.com/dbt/freshness/v0/index.html)
**Produced by:** [`dbt freshness`](/reference/commands/freshness)

This file contains freshness results for all sources and models with [freshness](/reference/resource-configs/freshness) configured. dbt writes it to `target/freshness.json` after every `dbt freshness` invocation.

Each entry includes a `resource_type` field that identifies whether a resource is a source or a model.

### Top-level keys

- `metadata`: Invocation metadata with the following fields:
  - `dbt_schema_version`: Schema URL for this artifact (always `https://schemas.getdbt.com/dbt/freshness/v0.json`).
  - `dbt_version`: dbt version that produced the file.
  - `generated_at`: Timestamp when the file was written.
  - `invocation_id`: Unique identifier for this invocation.
  - `invocation_started_at`: Timestamp when the invocation started. Omitted if not available.
  - `env`: Map of `DBT_ENV_CUSTOM_ENV_*` environment variables, if set.
- `results`: Array of freshness results.

Each entry in `results` is a dictionary with the following keys:

- `unique_id`: Unique node identifier, mapping results to `nodes` or `sources` in the [manifest](/reference/artifacts/manifest-json).
- `resource_type`: Either `model` or `source`.
- `max_loaded_at`: Max value of the loaded-at timestamp when queried.
- `snapshotted_at`: Timestamp when the check ran.
- `max_loaded_at_time_ago_in_s`: Interval between `max_loaded_at` and `snapshotted_at` in seconds.
- `status`: Freshness status: `Pass`, `Warn`, or `Error`. If the freshness query fails, dbt logs an error but omits the node from the file rather than writing it with a failed status.
- `criteria`: The freshness configuration for this node, including `warn_after`, `error_after`, `filter`, `loaded_at_field`, and `loaded_at_query`.
- `thread_id`: Identifier for the thread that ran this check.
