---
title: "Freshness JSON file"
sidebar_label: "Freshness"
availability:
  engine: v2
  access: free
---

# Freshness JSON file <Lifecycle status="beta" />

**Produced by:** [`dbt freshness`](/reference/commands/freshness)

This file contains freshness results for all sources and models with [freshness](/reference/resource-configs/freshness) configured. dbt writes it to `target/freshness.json` after every `dbt freshness` invocation.

Unlike [`sources.json`](/reference/artifacts/sources-json), which covers sources only, `freshness.json` covers both sources and models. Each entry includes a `resource_type` field to distinguish them.

### Top-level keys

- [`metadata`](/reference/artifacts/dbt-artifacts#common-metadata)
- `elapsed_time`: Total invocation time in seconds.
- `results`: Array of freshness results.

Each entry in `results` is a dictionary with the following keys:

- `unique_id`: Unique node identifier, mapping results to `nodes` or `sources` in the [manifest](/reference/artifacts/manifest-json).
- `resource_type`: Either `model` or `source`.
- `max_loaded_at`: Max value of the loaded-at timestamp when queried. Determined by `loaded_at_query`, `loaded_at_field`, or adapter metadata, in that order.
- `snapshotted_at`: Timestamp when the check ran.
- `max_loaded_at_time_ago_in_s`: Interval between `max_loaded_at` and `snapshotted_at` in seconds.
- `status`: Freshness status: `pass`, `warn`, or `error` if the check succeeds; `runtime error` if the query fails.
- `criteria`: The freshness thresholds (`warn_after`, `error_after`) configured for this node.
- `execution_time`: Total time spent checking freshness for this node.
- `timing`: Array of timing steps (e.g., `compile`, `execute`).
- `adapter_response`: Adapter-level response metadata.
- `thread_id`: Identifier for the thread that ran this check.
