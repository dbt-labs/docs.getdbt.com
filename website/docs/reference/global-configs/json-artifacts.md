---
title: "JSON artifacts"
id: "json-artifacts"
sidebar: "JSON artifacts"
---

The `WRITE_JSON` config determines whether dbt writes JSON artifacts (eg. `manifest.json`, `run_results.json`) to the `target/` directory. JSON serialization can be slow, and turning this flag off _might_ make invocations of dbt faster. Alternatively, you might disable this config if you want to perform a dbt operation and avoid overwriting artifacts from a previous run step.

<File name='Usage'>

```text
dbt --no-write-json run
```

</File>
