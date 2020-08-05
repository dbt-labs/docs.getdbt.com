---
title: "run"
id: "run"
---

## Overview

`dbt run` executes compiled sql model files against the current `target`
database. dbt connects to the target database and runs the relevant SQL required
to materialize all data models using the specified materialization strategies.
Models are run in the order defined by the dependency graph generated during
compilation. Intelligent multi-threading is used to minimize execution time
without violating dependencies.

Deploying new models frequently involves destroying prior versions of these
models. In these cases, `dbt run` minimizes the amount of time in which a model
is unavailable by first building each model with a temporary name, then dropping
the existing model, then renaming the model to its correct name. The drop and
rename happen within a single database transaction for database adapters that
support transactions.

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

## Failing fast

<Changelog>

 - The `--fail-fast` flag is new in dbt v0.17.0

</Changelog>

Supply the `-x` or `--fail-fast` flag to `dbt run` to make dbt exit immediately
if a single model fails to build. If other models are in-progress when the first
model fails, then dbt will terminate the connections for these still-running
models. In the example below, note that 4 models are selected to run, but a
failure in the first model prevents other models from running.

```text
$ dbt run --fail-fast --threads 1
Running with dbt=0.17.0
Found 4 models, 1 test, 1 snapshot, 2 analyses, 143 macros, 0 operations, 1 seed file, 0 sources

14:47:39 | Concurrency: 1 threads (target='dev')
14:47:39 |
14:47:39 | 1 of 4 START table model test_schema.model_1........... [RUN]
14:47:40 | 1 of 4 ERROR creating table model test_schema.model_1.. [ERROR in 0.06s]
14:47:40 | 2 of 4 START view model test_schema.model_2............ [RUN]
14:47:40 | CANCEL query model.debug.model_2....................... [CANCEL]
14:47:40 | 2 of 4 ERROR creating view model test_schema.model_2... [ERROR in 0.05s]

Database Error in model model_1 (models/model_1.sql)
  division by zero
  compiled SQL at target/run/debug/models/model_1.sql

Encountered an error:
FailFast Error in model model_1 (models/model_1.sql)
  Failing early due to test failure or runtime error
```

## Deferring to previous run state

<Changelog>

 - The `--defer` and `--state` flags are new in dbt v0.18.0

</Changelog>

:::info Beta Feature
This is net-new functionality in v0.18.0, with iterative improvements to come.
If you encounter unexpected behavior, please post in Slack or open an issue.
:::

dbt will resolve `ref` calls differently depending on whether a node is selected
for a given run. If a node is unselected, references to it will resolve to the namespace 
specified by the state artifact.

This is especially useful when running a subset of models in a new test or development schema,
as it obviates the need to create all of those models' parents.

**Environment variables**

Deferral and state can be set by environment variables as well as CLI flags:

- `--defer` or `DEFER_MODE`
- `--state` or `ARTIFACT_STATE_PATH`

If both the flag and env var are provided, the flag takes precedence.

**Usage notes**

- In its current implementation, deferral requires **state** to be set explicitly, either
by flag or env var. In a future release, we may set state to be the [target-path](target-path) by default.
- `dbt run` (with no `--models` or `--exclude` specification) includes _all_
nodes, even seeds and sources. In this way, `dbt run` and `dbt run --defer --state ...` always yield
identical results, with no deferred nodes.
- Ephemeral models are never deferred, since they serve as "passthroughs" for other `ref` calls.
Including or excluding an ephemeral model makes no difference; including or excluding
the non-ephemeral parent of an ephemeral model does.

**Example**

In my local development environment, I create all models in a schema named
`dbt_me`. In production, the same models are created in a schema named
`prod`. Both are located in a database called `analytics`.

Given a model `model_2`:

<File name='models/model_2.sql'>

```sql
select

    id,
    count(*)
    
from {{ ref('model_1') }}
```

</File>

I access the dbt-generated [artifacts](artifacts) (namely `manifest.json`)
from a production run, and copy them into a local directory called `prod-run-artifacts`.
Then I can run:

<File name='bash'>

```shell
dbt run --models model_2 --defer --state prod-run-artifacts
```

</File>

Because `model_1` is unselected, dbt will resolve all instances of `{{ ref(model_1) }}` 
using the production namespace, instead of the one configured in my profile.

<File name='target/run/my_project/model_2.sql'>

```sql
create or replace view analytics.dbt_me.model_2 as (
    
    select

        id,
        count(*)
        
    from analytics.prod.model_1
    
)
```

</File>
