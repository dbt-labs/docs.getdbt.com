---
title: "Methods"
---

Selector methods return all resources that share a common property, using the
syntax `method:value`. While it is recommended to explicitly denote the method,
you can omit it (the default value will be one of `path`, `file` or `fqn`).

### The "tag" method
The `tag:` method is used to select models that match a specified [tag](resource-configs/tags).


  ```bash
  $ dbt run --select tag:nightly    # run all models with the `nightly` tag
  ```


### The "source" method
The `source` method is used to select models that select from a specified [source](/docs/build/sources#using-sources). Use in conjunction with the `+` operator.


  ```bash
  $ dbt run --select source:snowplow+    # run all models that select from Snowplow sources
  ```


### The "path" method
The `path` method is used to select models/sources defined at or under a specific path.
Model definitions are in SQL/Python files (not YAML), and source definitions are in YAML files.
While the `path` prefix is not explicitly required, it may be used to make
selectors unambiguous.


  ```bash
  # These two selectors are equivalent
  dbt run --select path:models/staging/github
  dbt run --select models/staging/github

  # These two selectors are equivalent
  dbt run --select path:models/staging/github/stg_issues.sql
  dbt run --select models/staging/github/stg_issues.sql
  ```


<VersionBlock firstVersion="1.2">

### The "file" or "fqn" method
The `file` or `fqn` method can be used to select a model by its filename, including the file extension (`.sql`).

```bash
# These are equivalent
dbt run --select some_model.sql
dbt run --select some_model
dbt run --select fqn:some_model # fqn is an abbreviation for "fully qualified name"
```

</VersionBlock>

### The "package" method

The `package` method is used to select models defined within the root project
or an installed dbt package. While the `package:` prefix is not explicitly required, it may be used to make
selectors unambiguous.


  ```bash
  # These three selectors are equivalent
  dbt run --select package:snowplow
  dbt run --select snowplow
  dbt run --select snowplow.*
  ```


### The "config" method

The `config` method is used to select models that match a specified [node config](configs-and-properties).



  ```bash
  $ dbt run --select config.materialized:incremental    # run all models that are materialized incrementally
  $ dbt run --select config.schema:audit                # run all models that are created in the `audit` schema
  $ dbt run --select config.cluster_by:geo_country      # run all models clustered by `geo_country`
  ```


<VersionBlock firstVersion="1.3">

While most config values are strings, you can also use the `config` method to match boolean configs, dictionary keys, and values in lists.

For example, given a model with the following configurations:
```
{{ config(
  materialized = 'incremental',
  unique_key = ['column_a', 'column_b'],
  grants = {'select': ['reporter', 'analysts']},
  transient = true
) }}

select ...
```

 You can select using any of the following:
```bash
$ dbt ls -s config.materialized:incremental
$ dbt ls -s config.unique_key:column_a
$ dbt ls -s config.grants.select:reporter
$ dbt ls -s config.transient:true
```

</VersionBlock>

### The "test_type" method
<Changelog>
In v1.0.0, test types were renamed: "singular" (instead of "data") and "generic" (instead of "schema")
</Changelog>

The `test_type` method is used to select tests based on their type, `singular` or `generic`:



  ```bash
  $ dbt test --select test_type:generic        # run all generic tests
  $ dbt test --select test_type:singular       # run all singular tests
  ```


### The "test_name" method

The `test_name` method is used to select tests based on the name of the generic test
that defines it. For more information about how generic tests are defined, read about
[tests](/docs/build/tests).


  ```bash
  $ dbt test --select test_name:unique            # run all instances of the `unique` test
  $ dbt test --select test_name:equality          # run all instances of the `dbt_utils.equality` test
  $ dbt test --select test_name:range_min_max     # run all instances of a custom schema test defined in the local project, `range_min_max`
  ```


### The "state" method

**N.B.** State-based selection is a powerful, complex feature. Read about [known caveats and limitations](node-selection/state-comparison-caveats) to state comparison.

<VersionBlock lastVersion="1.4">

The `state` method is used to select nodes by comparing them against a previous version of the same project, which is represented by a [manifest](artifacts/manifest-json). The file path of the comparison manifest _must_ be specified via the `--state` flag or `DBT_ARTIFACT_STATE_PATH` environment variable.

</VersionBlock>

<VersionBlock firstVersion="1.5">

The `state` method is used to select nodes by comparing them against a previous version of the same project, which is represented by a [manifest](artifacts/manifest-json). The file path of the comparison manifest _must_ be specified via the `--state` flag or `DBT_STATE` environment variable.

</VersionBlock>

`state:new`: There is no node with the same `unique_id` in the comparison manifest

`state:modified`: All new nodes, plus any changes to existing nodes.


  ```bash
  $ dbt test --select state:new            # run all tests on new models + and new tests on old models
  $ dbt run --select state:modified        # run all models that have been modified
  $ dbt ls --select state:modified         # list all modified nodes (not just models)
  ```


Because state comparison is complex, and everyone's project is different, dbt supports subselectors that include a subset of the full `modified` criteria:
- `state:modified.body`: Changes to node body (e.g. model SQL, seed values)
- `state:modified.configs`: Changes to any node configs, excluding `database`/`schema`/`alias`
- `state:modified.relation`: Changes to `database`/`schema`/`alias` (the database representation of this node), irrespective of `target` values or `generate_x_name` macros
- `state:modified.persisted_descriptions`: Changes to relation- or column-level `description`, _if and only if_ `persist_docs` is enabled at each level
- `state:modified.macros`: Changes to upstream macros (whether called directly or indirectly by another macro)
- `state:modified.contract`: Changes to a model's [contract](resource-configs/contract), which currently include the `name` and `data_type` of `columns`. Removing or changing the type of an existing column is considered a breaking change, and will raise an error.

Remember that `state:modified` includes _all_ of the criteria above, as well as some extra resource-specific criteria, such as modifying a source's `freshness` or `quoting` rules or an exposure's `maturity` property. (View the source code for the full set of checks used when comparing [sources](https://github.com/dbt-labs/dbt-core/blob/9e796671dd55d4781284d36c035d1db19641cd80/core/dbt/contracts/graph/parsed.py#L660-L681), [exposures](https://github.com/dbt-labs/dbt-core/blob/9e796671dd55d4781284d36c035d1db19641cd80/core/dbt/contracts/graph/parsed.py#L768-L783), and [executable nodes](https://github.com/dbt-labs/dbt-core/blob/9e796671dd55d4781284d36c035d1db19641cd80/core/dbt/contracts/graph/parsed.py#L319-L330).)

### The "exposure" method

The `exposure` method is used to select parent resources of a specified [exposure](exposures). Use in conjunction with the `+` operator.


  ```bash
  $ dbt run --select +exposure:weekly_kpis                # run all models that feed into the weekly_kpis exposure
  $ dbt test --select +exposure:*                         # test all resources upstream of all exposures
  $ dbt ls --select +exposure:* --resource-type source    # list all sources upstream of all exposures
  ```

### The "metric" method
<Changelog>New in v1.0.0</Changelog>

The `metric` method is used to select parent resources of a specified [metric](metrics). Use in conjunction with the `+` operator.

```bash
$ dbt build --select +metric:weekly_active_users       # build all resources upstream of weekly_active_users metric
$ dbt ls    --select +metric:* --resource-type source  # list all source tables upstream of all metrics
```

### The "result" method
<Changelog>New in v1.0.0</Changelog>

The `result` method is related to the `state` method described above, and can be used to select resources based on their result status from a prior run. Note that one of the dbt commands [`run`, `test`, `build`, `seed`] must have been performed in order to create the result on which a result selector operates. You can use `result` selectors in conjunction with the `+` operator.

```bash
$ dbt run --select result:error # run all models that generated errors on the prior invocation of dbt run
$ dbt test --select result:fail # run all tests that failed on the prior invocation of dbt test
$ dbt build --select 1+result:fail # run all the models associated with failed tests from the prior invocation of dbt build
$ dbt seed --select result:error # run all seeds that generated errors on the prior invocation of dbt seed.
```

### The "source_status" method
<VersionBlock lastVersion="1.0">

Only supported by v1.1 or newer.

</VersionBlock>

<VersionBlock firstVersion="1.1">

Only supported by v1.1 or newer.

:::caution Experimental functionality
The `source_status` selection method is experimental and subject to change. During this time, ongoing improvements may limit this feature’s availability and cause breaking changes to its functionality.
:::

Another element of job state is the `source_status` of a prior dbt invocation. After executing `dbt source freshness`, for example, dbt creates the `sources.json` artifact which contains execution times and `max_loaded_at` dates for dbt sources. You can read more about `sources.json` on the ['sources'](/docs/reference/artifacts/sources-json) page. 

The following dbt commands produce `sources.json` artifacts whose results can be referenced in subsequent dbt invocations:  
- `dbt source freshness`

After issuing one of the above commands, you can reference the source freshness results by adding a selector to a subsequent command as follows: 

<VersionBlock lastVersion="1.4">

```bash
# You can also set the DBT_ARTIFACT_STATE_PATH environment variable instead of the --state flag.
$ dbt source freshness # must be run again to compare current to previous state
$ dbt build --select source_status:fresher+ --state path/to/prod/artifacts
```

</VersionBlock>

<VersionBlock firstVersion="1.5">

```bash
# You can also set the DBT_STATE environment variable instead of the --state flag.
$ dbt source freshness # must be run again to compare current to previous state
$ dbt build --select source_status:fresher+ --state path/to/prod/artifacts
```

</VersionBlock>


</VersionBlock>


### The "group" method
<VersionBlock lastVersion="1.4">

Only supported by v1.5 or newer.

</VersionBlock>

<VersionBlock firstVersion="1.5">

Only supported by v1.5 or newer.

The `group` method is used to select models defined within a group.


  ```bash
  dbt run --select group:finance # run all models that belong to the finance group.
  ```


</VersionBlock>