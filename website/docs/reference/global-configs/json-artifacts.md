---
title: "JSON artifacts"
id: "json-artifacts"
sidebar: "JSON artifacts"
---

### Write JSON artifacts

The `WRITE_JSON` config determines whether dbt writes [JSON artifacts](/reference/artifacts/dbt-artifacts) (eg. `manifest.json`, `run_results.json`) to the `target/` directory. JSON serialization can be slow, and turning this flag off _might_ make invocations of dbt faster. Alternatively, you might disable this config if you want to perform a dbt operation and avoid overwriting artifacts from a previous run step.

<File name='Usage'>

```text
dbt --no-write-json run
```

</File>

<VersionBlock firstVersion="1.2">

### Target path

By default, dbt will write JSON artifacts and compiled SQL files to a directory named `target/`. This directory is located relative to `dbt_project.yml` of the active project.

Just like other global configs, it is possible to override these values for your environment or invocation by using the CLI option (`--target-path`) or environment variables (`DBT_TARGET_PATH`).

</VersionBlock>
