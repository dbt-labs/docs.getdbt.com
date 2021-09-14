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

The `config` method is used to select models that match a specified [node config](configs-and-properties).

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

The `test_name` method is used to select tests based on the name of the generic test
that defines it. For more information about how generic tests are defined, read about
[tests](building-a-dbt-project/tests).

```bash
$ dbt test --models test_name:unique            # run all instances of the `unique` test
$ dbt test --models test_name:equality          # run all instances of the `dbt_utils.equality` test
$ dbt test --models test_name:range_min_max     # run all instances of a custom schema test defined in the local project, `range_min_max`
```

### The "state" method
<Changelog>
    - **v0.18.0** introduced `state:new` and `state:modified`
    - **v0.21.0** introduced `modified` sub-selectors, and handling for upstream macro dependencies
</Changelog>

**N.B.** State-based selection is a powerful, complex feature. Read about [known caveats and limitations](node-selection/state-comparison-caveats) to state comparison.

The `state` method is used to select nodes by comparing them against a previous version of the same project, which is represented by a [manifest](artifacts/manifest-json). The file path of the comparison manifest _must_ be specified via the `--state` flag or `DBT_ARTIFACT_STATE_PATH` environment variable.

`state:new`: There is no node with the same `unique_id` in the comparison manifest

`state:modified`: All new nodes, plus any changes to existing nodes.

```bash
$ dbt test --models state:new            # run all tests on new models + and new tests on old models
$ dbt run --models state:modified        # run all models that have been modified
$ dbt ls --models state:modified         # list all modified nodes (not just models)
```

Because state comparison is complex, and everyone's project is different, dbt supports subselectors that include a subset of the full `modified` criteria:
- `state:modified.body`: Changes to node body (e.g. model SQL, seed values)
- `state:modified.configs`: Changes to any node configs, excluding `database`/`schema`/`alias`
- `state:modified.relation`: Changes to `database`/`schema`/`alias` (the database representation of this node), irrespective of `target` values or `generate_x_name` macros
- `state:modified.persisted_descriptions`: Changes to relation- or column-level `description`, _if and only if_ `persist_docs` is enabled at each level
- `state:modified.macros`: Changes to upstream macros (whether called directly or indirectly by another macro)

Remember that `state:modified` includes _all_ of the criteria above, as well as some extra resource-specific criteria, such as changes to a source's `freshness` property or an exposure's `maturity` property. (View the source code for the full set of checks used when comparing [sources](https://github.com/dbt-labs/dbt/blob/9e796671dd55d4781284d36c035d1db19641cd80/core/dbt/contracts/graph/parsed.py#L660-L681), [exposures](https://github.com/dbt-labs/dbt/blob/9e796671dd55d4781284d36c035d1db19641cd80/core/dbt/contracts/graph/parsed.py#L768-L783), and [executable nodes](https://github.com/dbt-labs/dbt/blob/9e796671dd55d4781284d36c035d1db19641cd80/core/dbt/contracts/graph/parsed.py#L319-L330).)

### The "exposure" method
<Changelog>New in v0.18.1</Changelog>

The `exposure` method is used to select parent resources of a specified [exposure](exposure-properties). Use in conjunction with the `+` operator.

```bash
$ dbt run --models +exposure:weekly_kpis                # run all models that feed into the weekly_kpis exposure
$ dbt test --models +exposure:*                         # test all resources upstream of all exposures
$ dbt ls --select +exposure:* --resource-type source    # list all sources upstream of all exposures
```
