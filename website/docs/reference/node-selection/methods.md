---
title: "Methods"
---

Selector methods return all resources that share a common property, using the
syntax `method:value`. While it is recommended to explicitly denote the method,
you can omit it (the default value will be one of `path`, `file` or `fqn`).


Many of the methods below support Unix-style wildcards:

| Wildcard | Description                                               |
| -------- | --------------------------------------------------------- |
| \*       | matches any number of any characters (including none)     |
| ?        | matches any single character                              |
| [abc]    | matches one character given in the bracket                |
| [a-z]    | matches one character from the range given in the bracket |

For example:
```
dbt list --select "*.folder_name.*"
dbt list --select "package:*_source"
```

### The "tag" method
The `tag:` method is used to select models that match a specified [tag](/reference/resource-configs/tags).


  ```bash
dbt run --select "tag:nightly"    # run all models with the `nightly` tag
```


### The "source" method
The `source` method is used to select models that select from a specified [source](/docs/build/sources#using-sources). Use in conjunction with the `+` operator.


  ```bash
dbt run --select "source:snowplow+"    # run all models that select from Snowplow sources
```

### The "resource_type" method
Use the `resource_type` method to select nodes of a particular type (`model`, `test`, `exposure`, and so on). This is similar to the `--resource-type` flag used by the [`dbt ls` command](/reference/commands/list).

  ```bash
dbt build --select "resource_type:exposure"    # build all resources upstream of exposures
dbt list --select "resource_type:test"         # list all tests in your project
dbt list --select "resource_type:source"       # list all sources in your project
```

### The "path" method
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


### The "file" method
The `file` method can be used to select a model by its filename, including the file extension (`.sql`).

```bash
# These are equivalent
dbt run --select "file:some_model.sql"
dbt run --select "some_model.sql"
dbt run --select "some_model"
```

### The "fqn" method

The `fqn` method is used to select nodes based off their "fully qualified names" (FQN) within the dbt graph. The default output of [`dbt list`](/reference/commands/list) is a listing of FQN. The default FQN format is composed of the project name, subdirectories within the path, and the file name (without extension) separated by periods.

```bash
dbt run --select "fqn:some_model"
dbt run --select "fqn:your_project.some_model"
dbt run --select "fqn:some_package.some_other_model"
dbt run --select "fqn:some_path.some_model"
dbt run --select "fqn:your_project.some_path.some_model"
```

### The "package" method

The `package` method is used to select models defined within the root project
or an installed dbt package. While the `package:` prefix is not explicitly required, it may be used to make
selectors unambiguous.


  ```bash
  # These three selectors are equivalent
  dbt run --select "package:snowplow"
  dbt run --select "snowplow"
  dbt run --select "snowplow.*"
```


### The "config" method

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

### The "test_type" method

<VersionBlock lastVersion="1.7">

The `test_type` method is used to select tests based on their type, `singular` or `generic`:

```bash
dbt test --select "test_type:generic"        # run all generic tests
dbt test --select "test_type:singular"       # run all singular tests
```

</VersionBlock>

<VersionBlock firstVersion="1.8">

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

</VersionBlock>

### The "test_name" method

The `test_name` method is used to select tests based on the name of the generic test
that defines it. For more information about how generic tests are defined, read about
[tests](/docs/build/data-tests).


  ```bash
dbt test --select "test_name:unique"            # run all instances of the `unique` test
dbt test --select "test_name:equality"          # run all instances of the `dbt_utils.equality` test
dbt test --select "test_name:range_min_max"     # run all instances of a custom schema test defined in the local project, `range_min_max`
```


### The "state" method

**N.B.** State-based selection is a powerful, complex feature. Read about [known caveats and limitations](/reference/node-selection/state-comparison-caveats) to state comparison.

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

### The "exposure" method

The `exposure` method is used to select parent resources of a specified [exposure](/docs/build/exposures). Use in conjunction with the `+` operator.


  ```bash
dbt run --select "+exposure:weekly_kpis"                # run all models that feed into the weekly_kpis exposure
dbt test --select "+exposure:*"                         # test all resources upstream of all exposures
dbt ls --select "+exposure:*" --resource-type source    # list all source tables upstream of all exposures
```

### The "metric" method

The `metric` method is used to select parent resources of a specified [metric](/docs/build/build-metrics-intro). Use in conjunction with the `+` operator.

```bash
dbt build --select "+metric:weekly_active_users"       # build all resources upstream of weekly_active_users metric
dbt ls    --select "+metric:*" --resource-type source  # list all source tables upstream of all metrics
```

### The "result" method

The `result` method is related to the `state` method described above and can be used to select resources based on their result status from a prior run. Note that one of the dbt commands [`run`, `test`, `build`, `seed`] must have been performed in order to create the result on which a result selector operates. You can use `result` selectors in conjunction with the `+` operator. 

```bash
dbt run --select "result:error" --state path/to/artifacts # run all models that generated errors on the prior invocation of dbt run
dbt test --select "result:fail" --state path/to/artifacts # run all tests that failed on the prior invocation of dbt test
dbt build --select "1+result:fail" --state path/to/artifacts # run all the models associated with failed tests from the prior invocation of dbt build
dbt seed --select "result:error" --state path/to/artifacts # run all seeds that generated errors on the prior invocation of dbt seed.
```

### The "source_status" method
  
Supported in v1.1 or higher.

Another element of job state is the `source_status` of a prior dbt invocation. After executing `dbt source freshness`, for example, dbt creates the `sources.json` artifact which contains execution times and `max_loaded_at` dates for dbt sources. You can read more about `sources.json` on the ['sources'](/reference/artifacts/sources-json) page. 

The following dbt commands produce `sources.json` artifacts whose results can be referenced in subsequent dbt invocations:  
- `dbt source freshness`

After issuing one of the above commands, you can reference the source freshness results by adding a selector to a subsequent command as follows: 


```bash
# You can also set the DBT_STATE environment variable instead of the --state flag.
dbt source freshness # must be run again to compare current to previous state
dbt build --select "source_status:fresher+" --state path/to/prod/artifacts
```

### The "group" method

The `group` method is used to select models defined within a [group](/reference/resource-configs/group).


```bash
dbt run --select "group:finance" # run all models that belong to the finance group.
```

### The "access" method

The `access` method selects models based on their [access](/reference/resource-configs/access) property.

```bash
dbt list --select "access:public"      # list all public models
dbt list --select "access:private"       # list all private models
dbt list --select "access:protected"       # list all protected models
```

### The "version" method

The `version` method selects [versioned models](/docs/collaborate/govern/model-versions) based on their [version identifier](/reference/resource-properties/versions) and [latest version](/reference/resource-properties/latest_version).

```bash
dbt list --select "version:latest"      # only 'latest' versions
dbt list --select "version:prerelease"  # versions newer than the 'latest' version
dbt list --select "version:old"         # versions older than the 'latest' version

dbt list --select "version:none"        # models that are *not* versioned
```

### The "semantic_model" method

The `semantic_model` method selects [semantic models](/docs/build/semantic-models).

```bash
dbt list --select "semantic_model:*"        # list all semantic models 
dbt list --select "+semantic_model:orders"  # list your semantic model named "orders" and all upstream resources
```

### The "saved_query" method

The `saved_query` method selects [saved queries](/docs/build/saved-queries).

```bash
dbt list --select "saved_query:*"                    # list all saved queries 
dbt list --select "+saved_query:orders_saved_query"  # list your saved query named "orders_saved_query" and all upstream resources
```

### The "unit_test" method

<VersionBlock lastVersion="1.7">
Supported in v1.8 or newer.
</VersionBlock>
<VersionBlock firstVersion="1.8">

The `unit_test` method selects [unit tests](/docs/build/unit-tests).

```bash
dbt list --select "unit_test:*"                        # list all unit tests 
dbt list --select "+unit_test:orders_with_zero_items"  # list your unit test named "orders_with_zero_items" and all upstream resources
```

</VersionBlock>
