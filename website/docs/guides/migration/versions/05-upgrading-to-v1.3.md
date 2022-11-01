---
title: "Upgrading to v1.3 (latest)"
---
### Resources

- [Changelog](https://github.com/dbt-labs/dbt-core/blob/1.3.latest/CHANGELOG.md)
- [CLI Installation guide](/docs/get-started/installation)
- [Cloud upgrade guide](/docs/dbt-versions/upgrade-core-in-cloud)

## Breaking changes

We are committed to providing backward compatibility for all versions 1.x. If you encounter an error upon upgrading, please let us know by [opening an issue](https://github.com/dbt-labs/dbt-core/issues/new).

There are three changes in dbt Core v1.3 that may require action from some users:
1. If you have a `profiles.yml` file located in the root directory where you run dbt, dbt will start preferring that profiles file over the default location on your machine. [You can read more details here](/docs/get-started/connection-profiles#advanced-customizing-a-profile-directory).
2. If you already have `.py` files defined in the `model-paths` of your dbt project, dbt will start trying to read them as Python models. You can use [the new `.dbtignore` file](dbtignore) to tell dbt to ignore those files.
3. If you have custom code accessing the `raw_sql` property of models (with the [model](dbt-jinja-functions/model) or [graph](/reference/dbt-jinja-functions/graph) objects), it has been renamed to `raw_code`. This is a change to the manifest contract, described in more detail below.

### For users of dbt Metrics

The names of metric properties have changed, with backward compatibility. Those changes are:
- Renamed `type` to `calculation_method`
- Renamed `sql` to `expression`
- Renamed `expression` calculation method metrics to `derived` calculation method metrics

We plan to keep backward compatibility for a full minor version. Defining metrics with the old names will raise an error in dbt Core v1.4.

### For consumers of dbt artifacts (metadata)

We have updated the manifest schema version to `v7`. This includes the changes to metrics described above and a few other changes related to the addition of Python models:
- Renamed `raw_sql` to `raw_code`
- Renamed `compiled_sql` to `compiled_code`
- A new top-level node property, `language` (`'sql'` or `'python'`)

For users of [state-based selection](understanding-state): This release includes logic providing backward and forward compatibility for older manifest versions. While running dbt Core v1.3, it should be possible to use `state:modified --state ...` selection against a manifest produced by dbt Core v1.0 and higher.

### For maintainers of adapter plugins

_GitHub discussion forthcoming_

**Notes:**
- The `statement` and `create_table_as` macros accept a new argument, `language`, with a default value of `'sql'`

## New and changed documentation

- **[Python models](building-models/python-models)** are natively supported in `dbt-core` for the first time, on data warehouses that support Python runtimes.
- Updates made to **[Metrics](build/metrics)** reflect their new syntax for definition, as well as additional properties that are now available.
- Plus, a few related updates to **[exposure properties](exposure-properties)**: `config`, `label`, and `name` validation.

- **[Custom `node_color`](/reference/resource-configs/docs.md)** in `dbt-docs`. For the first time, you can control the colors displayed in dbt's DAG. Want bronze, silver, and gold layers? It's at your fingertips.
- **[`Profiles.yml`](/docs/get-started/connection-profiles#advanced-customizing-a-profile-directory)** search order now looks in the current working directory before `~/.dbt`.


### Quick hits
- **["Full refresh"](full_refresh)** flag supports a short name, `-f`.
- **[The "config" selection method](methods#the-config-method)** supports boolean and list config values, in addition to strings.
- Two new dbt-Jinja context variables for accessing invocation metadata: [`invocation_args_dict`](flags#invocation_args_dict) and [`dbt_metadata_envs`](env_var#custom-metadata).
