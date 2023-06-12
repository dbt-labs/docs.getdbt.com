---
title: "About dbt run command"
sidebar_label: "run"
description: "Read this guide on how dbt's run command can be used to execute compiled SQL model files against a target database."
id: "run"
---

## Overview

`dbt run` executes compiled sql model files against the current `target`
database. dbt connects to the target database and runs the relevant SQL required
to materialize all data models using the specified <Term id="materialization" /> strategies.
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

If you provide the `--full-refresh` flag to `dbt run`, dbt will treat incremental models as <Term id="table" /> models. This is useful when

1. The schema of an incremental model changes and you need to recreate it.
2. You want to reprocess the entirety of the incremental model because of new logic in the model code.

<File name='bash'>

```shell
dbt run --full-refresh
```

</File>

<VersionBlock firstVersion="1.3">

You can also supply the flag by its short name: `dbt run -f`.

</VersionBlock>

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

<Changelog>

- Moved to [global configs](/reference/global-configs/about-global-configs) in v1.0

</Changelog>

See [global configs](/reference/global-configs/failing-fast)

## Failing fast

<Changelog>

- The `--fail-fast` flag is new in dbt v0.17.0
- Moved to [global configs](/reference/global-configs/about-global-configs) in v1.0

</Changelog>

See [global configs](/reference/global-configs/failing-fast)

## Enable or Disable Colorized Logs

<Changelog>

- The `--use-colors` and `--no-use-colors` flags are new in dbt v0.18.0
- Moved to [global configs](/reference/global-configs/about-global-configs) in v1.0

</Changelog>

See [global configs](/reference/global-configs/print-output#print-color)
