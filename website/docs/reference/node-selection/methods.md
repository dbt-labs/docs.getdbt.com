---
title: "Node selector methods"
sidebar: "Node selector methods"
---

Selector methods return all resources that share a common property, using the
syntax `method:value`. While it is recommended to explicitly denote the method,
you can omit it (the default value will be one of `path`, `file` or `fqn`).

<Expandable alt_header="Differences between --select and --selector">

The `--select` and `--selector` arguments sound similar, but they are different. To understand the difference, see [Differences between `--select` and `--selector`](/reference/node-selection/yaml-selectors#difference-between---select-and---selector).

</Expandable>

import UsingCommas from '/snippets/_using-commas.md';

<UsingCommas />

Many of the methods below support Unix-style wildcards:

| Wildcard | Description                                               |
| -------- | --------------------------------------------------------- |
| \*       | matches any number of any characters (including none)     |
| ?        | matches any single character                              |
| [abc]    | matches one character given in the bracket                |
| [a-z]    | matches one character from the range given in the bracket |

For example:
```bash
dbt list --select "*.folder_name.*"
dbt list --select "package:*_source"
```

### access

The `access` method selects models based on their [access](/reference/resource-configs/access) property.

```bash
dbt list --select "access:public"      # list all public models
dbt list --select "access:private"       # list all private models
dbt list --select "access:protected"       # list all protected models
```

### config

The `config` method is used to select models that match a specified [node config](/reference/configs-and-properties).



  ```bash
dbt run --select "config.materialized:incremental"    # run all models that are materialized incrementally
dbt run --select "config.schema:audit"              # run all models that are created in the `audit` schema
dbt run --select "config.cluster_by:geo_country"      # run all models clustered by `geo_country`
```

While most config values are strings, you can also use the `config` method to match boolean configs, dictionary keys, and values in lists.

For example, given a model with the following configurations:

```bash
{{ config(
  materialized = 'incremental',
  unique_key = ['column_a', 'column_b'],
  grants = {'select': ['reporter', 'analysts']},
  meta = {"contains_pii": true},
  transient = true
) }}

select ...
```

 You can select using any of the following:
```bash
dbt ls -s config.materialized:incremental
dbt ls -s config.unique_key:column_a
dbt ls -s config.grants.select:reporter
dbt ls -s config.meta.contains_pii:true
dbt ls -s config.transient:true
```


### exposure

The `exposure` method is used to select parent resources of a specified [exposure](/docs/build/exposures). Use in conjunction with the `+` operator.


  ```bash
dbt run --select "+exposure:weekly_kpis"                # run all models that feed into the weekly_kpis exposure
dbt test --select "+exposure:*"                         # test all resources upstream of all exposures
dbt ls --select "+exposure:*" --resource-type source    # list all source tables upstream of all exposures
```

### file

<VersionBlock lastVersion="1.10">

The `file` method can be used to select a model by its filename, including the file extension (`.sql`).

```bash
# These are equivalent
dbt run --select "file:some_model.sql"
dbt run --select "some_model.sql"
dbt run --select "some_model"
```
</VersionBlock>

<VersionBlock firstVersion="1.11">

The `file` method can be used to select a model or a function by its filename, including the file extension (`.sql`).

```bash
# These are equivalent
dbt run --select "file:some_model.sql"
dbt run --select "some_model.sql"
dbt run --select "some_model"

# These are equivalent
dbt build --select "file:my_function.sql"
dbt build --select "my_function.sql"
dbt build --select "my_function"

# To build all models that use the function
dbt build --select "my_function+"
```
</VersionBlock>

### fqn

The `fqn` method is used to select nodes based off their "fully qualified names" (FQN) within the dbt graph. The default output of [`dbt list`](/reference/commands/list) is a listing of FQN. The default FQN format is composed of the project name, subdirectories within the path, and the file name (without extension) separated by periods.

```bash
dbt run --select "fqn:some_model"
dbt run --select "fqn:your_project.some_model"
dbt run --select "fqn:some_package.some_other_model"
dbt run --select "fqn:some_path.some_model"
dbt run --select "fqn:your_project.some_path.some_model"
```


### group

The `group` method is used to select models defined within a [group](/reference/resource-configs/group).


```bash
dbt run --select "group:finance" # run all models that belong to the finance group.
```

### metric

The `metric` method is used to select parent resources of a specified [metric](/docs/build/build-metrics-intro). Use in conjunction with the `+` operator.

```bash
dbt build --select "+metric:weekly_active_users"       # build all resources upstream of weekly_active_users metric
dbt ls    --select "+metric:*" --resource-type source  # list all source tables upstream of all metrics
```

### package

The `package` method is used to select models defined within the root project
or an installed dbt package. While the `package:` prefix is not explicitly required, it may be used to make
selectors unambiguous.


  ```bash
  # These three selectors are equivalent
  dbt run --select "package:snowplow"
  dbt run --select "snowplow"
  dbt run --select "snowplow.*"
```

Use the `this` package to select nodes from the current project. From the example, running `dbt run --select "package:this"` from the `snowplow` project runs the exact same set of models as the other three selectors.

Since `this` always refers to the current project, using `package:this` ensures that you're only selecting models from the project you're working in.

### path

<VersionBlock lastVersion="1.10">
The `path` method is used to select models/sources defined at or under a specific path.
Model definitions are in SQL/Python files (not YAML), and source definitions are in YAML files.
While the `path` prefix is not explicitly required, it may be used to make
selectors unambiguous.


  ```bash
  # These two selectors are equivalent
  dbt run --select "path:models/staging/github"
  dbt run --select "models/staging/github"

  # These two selectors are equivalent
  dbt run --select "path:models/staging/github/stg_issues.sql"
  dbt run --select "models/staging/github/stg_issues.sql"
  ```

</VersionBlock>

<VersionBlock firstVersion="1.11">

The `path` method is used to select models, sources, or functions defined at or under a specific path.
Model definitions are in SQL/Python files (not YAML), and source definitions are in YAML files. Functions are defined in SQL files. While the `path` prefix is not explicitly required, it may be used to make
selectors unambiguous.


  ```bash
  # These two selectors are equivalent
  dbt run --select "path:models/staging/github"
  dbt run --select "models/staging/github"

  # These two selectors are equivalent
  dbt run --select "path:models/staging/github/stg_issues.sql"
  dbt run --select "models/staging/github/stg_issues.sql"

  # These two selectors are equivalent
  dbt build --select "path:functions/my_function.sql"
  dbt build --select "functions/my_function.sql"
  ```

</VersionBlock>

### resource_type

<VersionBlock lastVersion="1.10">

Use the `resource_type` method to select nodes of a particular type (`model`, `test`, `exposure`, and so on). This is similar to the `--resource-type` flag used by the [`dbt ls` command](/reference/commands/list).

```bash
dbt build --select "resource_type:exposure"    # build all resources upstream of exposures
dbt list --select "resource_type:test"         # list all tests in your project
dbt list --select "resource_type:source"       # list all sources in your project
```

</VersionBlock>

<VersionBlock firstVersion="1.11">

Use the `resource_type` method to select nodes of a particular type (`model`, `test`, `exposure`, `function`, and so on). This is similar to the `--resource-type` flag used by the [`dbt ls` command](/reference/commands/list).

```bash
dbt build --select "resource_type:exposure"    # build all resources upstream of exposures
dbt build --select "resource_type:function"    # build all functions in your project
dbt list --select "resource_type:test"         # list all tests in your project
dbt list --select "resource_type:source"       # list all sources in your project
```

</VersionBlock>

### result

The `result` method is related to the [`state` method](/reference/node-selection/methods#state) and can be used to select resources based on their result status from a prior run. Note that one of the dbt commands [`run`, `test`, `build`, `seed`] must have been performed in order to create the result on which a result selector operates. 

You can use `result` selectors in conjunction with the `+` operator. 

```bash
# run all models that generated errors on the prior invocation of dbt run
dbt run --select "result:error" --state path/to/artifacts 

# run all tests that failed on the prior invocation of dbt test
dbt test --select "result:fail" --state path/to/artifacts 

# run all the models associated with failed tests from the prior invocation of dbt build
dbt build --select "1+result:fail" --state path/to/artifacts

# run all seeds that generated errors on the prior invocation of dbt seed
dbt seed --select "result:error" --state path/to/artifacts 
```

- Only use `result:fail` when you want to re-run tests that failed during the last invocation. This selector is specific to test nodes. Tests don't have downstream nodes in the DAG, so using the `result:fail+` selector will only return the failed test itself and not the model or anything built on top of it.
- On the other hand, `result:error` selects any resource (models, tests, snapshots, and more) that returned an error.
- As an example, to re-run upstream and downstream resources associated with failed tests, you can use one of the following selectors:
  ```bash
  # reruns all the models associated with failed tests from the prior invocation of dbt build
  dbt build --select "1+result:fail" --state path/to/artifacts

  # reruns the models associated with failed tests and all downstream dependencies - especially useful in deferred state workflows
  dbt build --select "1+result:fail+" --state path/to/artifacts
  ```

### saved_query

The `saved_query` method selects [saved queries](/docs/build/saved-queries).

```bash
dbt list --select "saved_query:*"                    # list all saved queries 
dbt list --select "+saved_query:orders_saved_query"  # list your saved query named "orders_saved_query" and all upstream resources
```

### semantic_model

The `semantic_model` method selects [semantic models](/docs/build/semantic-models).

```bash
dbt list --select "semantic_model:*"        # list all semantic models 
dbt list --select "+semantic_model:orders"  # list your semantic model named "orders" and all upstream resources
```

### source
The `source` method is used to select models that select from a specified [source](/docs/build/sources#using-sources). Use in conjunction with the `+` operator.


  ```bash
dbt run --select "source:snowplow+"    # run all models that select from Snowplow sources
```

### source_status
  
Another element of job state is the `source_status` of a prior dbt invocation. After executing `dbt source freshness`, for example, dbt creates the `sources.json` artifact which contains execution times and `max_loaded_at` dates for dbt sources. You can read more about `sources.json` on the ['sources'](/reference/artifacts/sources-json) page. 

The following dbt commands produce `sources.json` artifacts whose results can be referenced in subsequent dbt invocations:  
- `dbt source freshness`

After issuing one of the above commands, you can reference the source freshness results by adding a selector to a subsequent command as follows: 


```bash
# You can also set the DBT_STATE environment variable instead of the --state flag.
dbt source freshness # must be run again to compare current to previous state
dbt build --select "source_status:fresher+" --state path/to/prod/artifacts
```

### state

**N.B.** [State-based selection](/reference/node-selection/state-selection) is a powerful, complex feature. Read about [known caveats and limitations](/reference/node-selection/state-comparison-caveats) to state comparison.

The `state` method is used to select nodes by comparing them against a previous version of the same project, which is represented by a [manifest](/reference/artifacts/manifest-json). The file path of the comparison manifest _must_ be specified via the `--state` flag or `DBT_STATE` environment variable.

`state:new`: There is no node with the same `unique_id` in the comparison manifest

`state:modified`: All new nodes, plus any changes to existing nodes.

  ```bash
dbt test --select "state:new" --state path/to/artifacts      # run all tests on new models + and new tests on old models
dbt run --select "state:modified" --state path/to/artifacts  # run all models that have been modified
dbt ls --select "state:modified" --state path/to/artifacts   # list all modified nodes (not just models)
  ```

Because state comparison is complex, and everyone's project is different, dbt supports subselectors that include a subset of the full `modified` criteria:
- `state:modified.body`: Changes to node body (e.g. model SQL, seed values)
- `state:modified.configs`: Changes to any node configs, excluding `database`/`schema`/`alias`
- `state:modified.relation`: Changes to `database`/`schema`/`alias` (the database representation of this node), irrespective of `target` values or `generate_x_name` macros
- `state:modified.persisted_descriptions`: Changes to relation- or column-level `description`, _if and only if_ `persist_docs` is enabled at each level
- `state:modified.macros`: Changes to upstream macros (whether called directly or indirectly by another macro)
- `state:modified.contract`: Changes to a model's [contract](/reference/resource-configs/contract), which currently include the `name` and `data_type` of `columns`. Removing or changing the type of an existing column is considered a breaking change, and will raise an error.

Remember that `state:modified` includes _all_ of the criteria above, as well as some extra resource-specific criteria, such as modifying a source's `freshness` or `quoting` rules or an exposure's `maturity` property. (View the source code for the full set of checks used when comparing [sources](https://github.com/dbt-labs/dbt-core/blob/9e796671dd55d4781284d36c035d1db19641cd80/core/dbt/contracts/graph/parsed.py#L660-L681), [exposures](https://github.com/dbt-labs/dbt-core/blob/9e796671dd55d4781284d36c035d1db19641cd80/core/dbt/contracts/graph/parsed.py#L768-L783), and [executable nodes](https://github.com/dbt-labs/dbt-core/blob/9e796671dd55d4781284d36c035d1db19641cd80/core/dbt/contracts/graph/parsed.py#L319-L330).)

There are two additional `state` selectors that complement `state:new` and `state:modified` by representing the inverse of those functions:
- `state:old` &mdash; A node with the same `unique_id` exists in the comparison manifest
- `state:unmodified` &mdash; All existing nodes with no changes 

These selectors can help you shorten run times by excluding unchanged nodes. Currently, no subselectors are available at this time, but that might change as use cases evolve. 

#### `state:modified` node and reference impacts

`state:modified` identifies any new nodes added, changes to existing nodes, and any changes made to:

- [access](/reference/resource-configs/access) permissions
- [`deprecation_date` ](/reference/resource-properties/deprecation_date)
- [`latest_version` ](/reference/resource-properties/latest_version)

If a node changes its group, downstream references may break, potentially causing build failures.

As `group` is a config, and configs are generally included in `state:modified` detection, modifying the group name everywhere it's referenced will flag those nodes as "modified".

Depending on whether partial parsing is enabled, you will catch the breakage as part of CI workflows.

- If you change a group name everywhere it's referenced, and partial parsing is enabled, dbt may only re-parse the changed model.
- If you update a group name in all its references without partial parsing enabled, dbt will re-parse all models and identify any invalid downstream references.

An error along the lines of "there's nothing to do" can occur when you change the group name *and* something is picked up to be run via `dbt build --select state:modified`. This error will be caught at runtime so long as the CI job is selecting `state:modified+` (including downstreams).

Certain factors can affect how references are used or resolved later on, including:

- Modifying access: if permissions or access rules change, some references might stop working.
- Modifying `deprecation_date`: if a reference or model version is marked  deprecated, new warnings might appear that affect how references are  processed.
- Modifying `latest_version`: if there's no tie to a specific version, the reference or model will point to the latest version.
  -  If a newer version is released, the reference will automatically resolve to the new version, potentially changing the behavior or output of the system that relies on it.

dbt handles state comparison for seed files differently depending on their size:

- **Seed files smaller than 1 MiB** &mdash; Included in the `state:modified` selector only when the contents change.
- **Seed files 1 MiB or larger** &mdash; Included in the `state:modified` selector only when the seed file path changes.

#### Overwrites the `manifest.json`

import Overwritesthemanifest from '/snippets/_overwrites-the-manifest.md';

<Overwritesthemanifest />

#### Recommendation

import Recommendationoverwritesthemanifest from '/snippets/_recommendation-overwriting-manifest.md'; 

<Recommendationoverwritesthemanifest />

### tag
The `tag:` method is used to select models that match a specified [tag](/reference/resource-configs/tags).


  ```bash
dbt run --select "tag:nightly"    # run all models with the `nightly` tag
```

### test_name

The `test_name` method is used to select tests based on the name of the generic test
that defines it. For more information about how generic tests are defined, read about
[data tests](/docs/build/data-tests).


  ```bash
dbt test --select "test_name:unique"            # run all instances of the `unique` test
dbt test --select "test_name:equality"          # run all instances of the `dbt_utils.equality` test
dbt test --select "test_name:range_min_max"     # run all instances of a custom schema test defined in the local project, `range_min_max`
```

### The test_type

The `test_type` method is used to select tests based on their type: 

- [Unit tests](/docs/build/unit-tests)
- [Data tests](/docs/build/data-tests):
  - [Singular](/docs/build/data-tests#singular-data-tests)
  - [Generic](/docs/build/data-tests#generic-data-tests)


```bash
dbt test --select "test_type:unit"           # run all unit tests
dbt test --select "test_type:data"           # run all data tests
dbt test --select "test_type:generic"        # run all generic data tests
dbt test --select "test_type:singular"       # run all singular data tests
```

### unit_test

The `unit_test` method selects [unit tests](/docs/build/unit-tests).

```bash
dbt list --select "unit_test:*"                        # list all unit tests 
dbt list --select "+unit_test:orders_with_zero_items"  # list your unit test named "orders_with_zero_items" and all upstream resources
```

### version

The `version` method selects [versioned models](/docs/mesh/govern/model-versions) based on their [version identifier](/reference/resource-properties/versions) and [latest version](/reference/resource-properties/latest_version).

```bash
dbt list --select "version:latest"      # only 'latest' versions
dbt list --select "version:prerelease"  # versions newer than the 'latest' version
dbt list --select "version:old"         # versions older than the 'latest' version

dbt list --select "version:none"        # models that are *not* versioned
```
