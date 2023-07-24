---
title: "Sources JSON file"
sidebar_label: "Sources"
---

**Current schema:** [`v3`](https://schemas.getdbt.com/dbt/sources/v3/index.html)

**Produced by:** [`source freshness`](/reference/commands/source)

This file contains information about [sources with freshness checks](/docs/build/sources#checking-source-freshness). Today, dbt Cloud uses this file to power its [Source Freshness visualization](/docs/build/sources#snapshotting-source-data-freshness).

### Top-level keys

- [`metadata`](/reference/artifacts/dbt-artifacts#common-metadata)
- `elapsed_time`: Total invocation time in seconds.
- `results`: Array of freshness-check execution details.

Each entry in `results` is a dictionary with the following keys:

- `unique_id`: Unique source node identifier, which map results to `sources` in the [manifest](/reference/artifacts/manifest-json)
- `max_loaded_at`: Max value of `loaded_at_field` timestamp in the source <Term id="table" /> when queried.
- `snapshotted_at`: Current timestamp when querying.
- `max_loaded_at_time_ago_in_s`: Interval between `max_loaded_at` and `snapshotted_at`, calculated in python to handle timezone complexity.
- `criteria`: The freshness threshold(s) for this source, defined in the project.
- `status`: The freshness status of this source, based on `max_loaded_at_time_ago_in_s` + `criteria`, reported on the CLI. One of `pass`, `warn`, or `error` if the query succeeds, `runtime error` if the query fails.
- `execution_time`: Total time spent checking freshness for this source
- `timing`: Array that breaks down execution time into steps (`compile` + `execute`)

import RowsAffected from '/snippets/_run-result.md'; 

<RowsAffected/>

