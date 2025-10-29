---
title: "About dbt run command"
sidebar_label: "run"
description: "The dbt run command executes your compiled SQL models against a target database."
id: "run"
---

## Overview

The `dbt run` command only applies to models. It doesn't run tests, snapshots, seeds, or other resource types. To run those commands, use the appropriate dbt commands found in the [dbt commands](/reference/dbt-commands) section — such as `dbt test`, `dbt snapshot`, or `dbt seed`.

You can use the `dbt run` command when you want to build or rebuild models in your project.

### How does `dbt run` work?

- `dbt run` executes compiled SQL model files against the current `target` database. 
- dbt connects to the target database and runs the relevant SQL required to materialize all data models using the specified <Term id="materialization" /> strategies.
- Models are run in the order defined by the dependency graph generated during compilation. Intelligent multi-threading is used to minimize execution time without violating dependencies.
- Deploying new models frequently involves destroying prior versions of these models. In these cases, `dbt run` minimizes downtime by first building each model with a temporary name, then dropping and renaming within a single transaction (for adapters that support transactions).

## Refresh incremental models

If you provide the `--full-refresh` flag to `dbt run`, dbt will treat incremental models as <Term id="table" /> models. This is useful when

1. The schema of an incremental model changes and you need to recreate it.
2. You want to reprocess the entirety of the incremental model because of new logic in the model code.

<File name='bash'>

```shell
dbt run --full-refresh
```

</File>

You can also supply the flag by its short name: `dbt run -f`.

In the dbt compilation context, this flag will be available as [flags.FULL_REFRESH](/reference/dbt-jinja-functions/flags). Further, the `is_incremental()` macro will return `false` for *all* models in response when the `--full-refresh` flag is specified.

<File name='models/example.sql'>

```sql
select * from all_events

-- if the table already exists and `--full-refresh` is
-- not set, then only add new records. otherwise, select
-- all records.
{% if is_incremental() %}
   where collector_tstamp > (
     select coalesce(max(max_tstamp), '0001-01-01') from {{ this }}
   )
{% endif %}
```

</File>

## Running specific models

dbt will also allow you select which specific models you'd like to materialize. This can be useful during special scenarios where you may prefer running a different set of models at various intervals. This can also be helpful when you may want to limit the tables materialized while you develop and test new models.

For more information, see the [Model Selection Syntax Documentation](/reference/node-selection/syntax).

For more information on running parents or children of specific models, see the [Graph Operators Documentation](/reference/node-selection/graph-operators).

## Treat warnings as errors

See [global configs](/reference/global-configs/warnings)

## Failing fast

See [global configs](/reference/global-configs/failing-fast)

## Enable or Disable Colorized Logs

See [global configs](/reference/global-configs/print-output#print-color)


## The `--empty` flag

The `run` command supports the `--empty` flag for building schema-only dry runs. The `--empty` flag limits the refs and sources to zero rows. dbt will still execute the model SQL against the target data warehouse but will avoid expensive reads of input data. This validates dependencies and ensures your models will build properly.

## Status codes

When calling the [list_runs api](/dbt-cloud/api-v2#/operations/List%20Runs), you will get a status code for each run returned. The available run status codes are as follows:

- Queued = 1
- Starting = 2
- Running = 3
- Success = 10
- Error = 20
- Canceled = 30
- Skipped = 40
