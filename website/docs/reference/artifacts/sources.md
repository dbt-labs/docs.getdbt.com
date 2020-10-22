---
title: Sources
---

### sources.json

_Produced by:_ `dbt source snapshot-freshness`

This file contains information from your data warehouse about the tables and views produced by the models in your project. dbt uses this file to render information like column types and table statistics into the docs site.

- [`metadata`](dbt-artifacts#common-artifact-metadata)
- `elapsed_time`: Total invocation time in seconds.
- `results`: Array of freshness-check execution details.
