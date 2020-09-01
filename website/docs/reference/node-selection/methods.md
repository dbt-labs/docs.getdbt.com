---
title: "Methods"
---

Selector methods return all resources that share a common property, using the
syntax `method:value`.

### The "tag" method
The `tag:` method is used to select models that match a specified [tag](resource-configs/tags).

```bash
$ dbt run --models tag:nightly    # run all models with the `nightly` tag
```

### The "source" method
The `source` method is used to select models that select from a specified [source](using-sources). Use in conjunction with the `+` operator.

```bash
$ dbt run --models source:snowplow+    # run all models that select from Snowplow sources
```

### The "path" method
The `path` method is used to select models located at or under a specific path.
While the `path` prefix is not explicitly required, it may be used to make
selectors unambiguous.

```bash
# These two selectors are equivalent
dbt run --models path:models/staging/github
dbt run --models models/staging/github

# These two selectors are equivalent
dbt run --models path:models/staging/github/stg_issues.sql
dbt run --models models/staging/github/stg_issues.sql
```

### The "package" method
<Changelog>New in v0.18.0</Changelog>

The `package` method is used to select models defined within the root project
or an installed dbt package. While the `package:` prefix is not explicitly required, it may be used to make
selectors unambiguous.

```bash
# These three selectors are equivalent
dbt run --models package:snowplow
dbt run --models snowplow
dbt run --models snowplow.*
```

### The "config" method
<Changelog>New in v0.18.0</Changelog>

The `config` method is used to select models that match a specified [node config](config).

```bash
$ dbt run --models config.materialized:incremental    # run all models that are materialized incrementally
$ dbt run --models config.schema:audit                # run all models that are created in the `audit` schema
$ dbt run --models config.cluster_by:geo_country      # run all models clustered by `geo_country`
```

### The "test_type" method
<Changelog>New in v0.18.0</Changelog>

The `test_type` method is used to select tests based on their type, `schema` or `data`:

```bash
$ dbt test --models test_type:schema        # run all schema tests
$ dbt test --models test_type:data          # run all data tests
```

### The "test_name" method
<Changelog>New in v0.18.0</Changelog>

The `test_name` method is used to select schema tests based on the name of the `test_` macro
that defines it. For more information about how schema tests are defined, read about
[custom schema tests](custom-schema-tests).

```bash
$ dbt test --models test_name:unique            # run all instances of the `unique` test
$ dbt test --models test_name:equality          # run all instances of the `dbt_utils.equality` test
$ dbt test --models test_name:range_min_max     # run all instances of a custom schema test defined in the local project, `range_min_max`
```

### The "state" method
<Changelog>New in v0.18.0</Changelog>

:::info [β] Beta Feature
This is net-new functionality in v0.18.0, with iterative improvements to come.
If you encounter unexpected behavior, please post in Slack or open an issue.
:::

The `state` method is used to select nodes by comparing them against a supplied
manifest. The file path of the comparison manifest _must_ be specified via the
`--state` flag or `DBT_ARTIFACT_STATE_PATH` environment variable.

`state:new`: There is no node with the same `unique_id` in the comparison manifest

`state:modified`: Everything new, plus any changes to:
* file/node contents
* configs (`materialized`, `bind`, `transient`, `quote`, etc.)
* descriptions (top-level and/or column-level, depending on `persist_docs`)
* database representations (user-input `database`, `schema`, `alias`, irrespective of `target` + `generate_x_name` macros)

```bash
$ dbt test --models state:new            # run all tests on new models + and new tests on old models
$ dbt run --models state:modified        # run all models that have been modified
$ dbt ls --models state:modified     # list all modified nodes (not just models)
```

**N.B.** State comparison works by identifying discrepancies between two manifests. 
Those discrepancies could be the result of:

1. Changes made to a project in development
2. Env-aware logic that causes different behavior based on the `target`, env vars, etc.

dbt will do its best to capture *only* changes that are the result of development.
In projects with intricate env-aware logic, dbt will err on the side of running 
too many models (i.e. false positives). We're working on better options for more 
complex projects, in the form of more-specific subselectors.
Track [this issue](https://github.com/fishtown-analytics/dbt/issues/2704) for progress.
