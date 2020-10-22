---
title: Sources
---

### sources.json

_Produced by:_ `dbt source snapshot-freshness`

This file contains information about sources with freshness checks. Today, dbt Cloud uses this file to power its [Source Freshness visualization](cloud-snapshotting-source-freshness).

- [`metadata`](dbt-artifacts#common-metadata)
- `elapsed_time`: Total invocation time in seconds.
- `results`: Array of freshness-check execution details.
