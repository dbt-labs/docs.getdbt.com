---
title: Sources
---

_Current schema_: [`v1`](https://schemas.getdbt.com/dbt/sources/v1.json)

_Produced by:_ `dbt source freshness`

This file contains information about [sources with freshness checks](using-sources#snapshotting-source-data-freshness). Today, dbt Cloud uses this file to power its [Source Freshness visualization](cloud-snapshotting-source-freshness).

### Top-level keys

- [`metadata`](dbt-artifacts#common-metadata)
- `elapsed_time`: Total invocation time in seconds.
- `results`: Array of freshness-check execution details.

Each entry in `results` is a dictionary with the following keys:

- `unique_id`: Unique source node identifier, which map results to `sources` in the [manifest](manifest-json)
- `max_loaded_at`: Max value of `loaded_at_field` timestamp in the source table when queried.
- `snapshotted_at`: Current timestamp when querying.
- `max_loaded_at_time_ago_in_s`: Interval between `max_loaded_at` and `snapshotted_at`, calculated in python to handle timezone complexity.
- `criteria`: The freshness threshold(s) for this source, defined in the project.
- `status`: The freshness status of this source, based on `max_loaded_at_time_ago_in_s` + `criteria`, reported on the CLI. One of `pass`, `warn`, or `error` if the query succeeds, `runtime error` if the query fails.
- `adapter_response`: Dictionary of information returned from the database, which varies by adapter. Not populated by source freshness checks, as of v0.19.0; we plan to fix in a future release ([dbt#2580](https://github.com/dbt-labs/dbt/issues/2580)).
