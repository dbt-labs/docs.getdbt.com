---
title: "run"
id: "run"
---

## Overview

`dbt run` executes compiled sql model files against the current `target` database. dbt connects to the target database and runs the relevant SQL required to materialize all data models using the specified materialization strategies. Models are run in the order defined by the dependency graph generated during compilation. Intelligent multi-threading is used to minimize execution time without violating dependencies.

Deploying new models frequently involves destroying prior versions of these models. In these cases, `dbt run` minimizes the amount of time in which a model is unavailable by first building each model with a temporary name, then dropping the existing model, then renaming the model to its correct name. The drop and rename happen within a single database transaction for database adapters that support transactions.

## Refresh incremental models

If you provide the `--full-refresh` argument to `dbt run`, dbt will treat incremental models as table models. This is useful when

1. The schema of an incremental model changes and you need to recreate it
2. You want to reprocess the entirety of the incremental model because of new logic in the model code

<File name='bash'>

```shell
dbt run --full-refresh
```

</File>

In the dbt compilation context, this flag will be available as [flags.FULL_REFRESH](flags). Further, the `is_incremental()` macro will return `false` for *all* models in response when the `--full-refresh` flag is specified.

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

## Treat warnings as errors

In some cases, dbt will emit warnings rather than errors. These warnings are intended to alert you to potential issues with your dbt project, like the use of deprecated methods or configurations. To treat these warnings as errors (eg. in a CI environment) provide the `--warn-error` flag to your invocation of dbt.

```
$ dbt --warn-error run
```

## Running specific models

dbt will also allow you select which specific models you'd like to materialize. This can be useful during special scenarios where you may prefer running a different set of models at various intervals. This can also be helpful when you may want to limit the tables materialized while you develop and test new models.

For more information, see the [Model Selection Syntax Documentation](model-selection-syntax).
