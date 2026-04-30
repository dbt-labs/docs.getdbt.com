---
title: "Upgrading to v1.12"
id: upgrading-to-v1.12
description: New features and changes in dbt Core v1.12
displayed_sidebar: "docs"
---

# Upgrading to v1.12

:::info Beta coming soon

<Constant name="core" /> v1.12 is not yet available in beta. We will update this guide when it becomes available.

:::

## Resources
- <Constant name="core" /> v1.12 changelog (coming soon)
- [<Constant name="core" /> CLI Installation guide](/docs/local/install-dbt)
- [Cloud upgrade guide](/docs/dbt-versions/upgrade-dbt-version-in-cloud#release-tracks)

## What to know before upgrading

dbt Labs is committed to providing backward compatibility for all versions 1.x. Any behavior changes will be accompanied by a [behavior change flag](/reference/global-configs/behavior-changes#behavior-change-flags) to provide a migration window for existing projects. If you encounter an error upon upgrading, please let us know by [opening an issue](https://github.com/dbt-labs/dbt-core/issues/new).

<Constant name="dbt" /> provides the functionality from new versions of <Constant name="core" /> via [release tracks](/docs/dbt-versions/cloud-release-tracks) with automatic upgrades. If you have selected the **Latest** release track in <Constant name="dbt" />, you already have access to all the features, fixes, and other functionality included in the latest <Constant name="core" /> version! If you have selected the **Compatible** release track, you will have access to the next monthly **Compatible** release after the <Constant name="core" /> v1.12 final release.

We continue to recommend explicitly installing both `dbt-core` and `dbt-<youradapter>`. This may become required for a future version of dbt. For example:

```bash
python3 -m pip install dbt-core dbt-snowflake
```

## New and changed features and functionality

### `.env` file for environment variables <Lifecycle status="beta" />

<Constant name="core" /> now automatically loads environment variables from a `.env` file in your current working directory. Shell environment variables take precedence over `.env` values. New projects created with `dbt init` include `.env` in the default `.gitignore`. For more information, refer to [About env_var function](/reference/dbt-jinja-functions/env_var#using-the-env-file).

### `packages` config for Python UDFs <Lifecycle status="beta" />

You can specify public third-party PyPI packages for your Python UDF with the optional `packages` config. The warehouse installs these packages when it creates the UDF, which lets your UDF use functionality from external Python libraries. For more information, refer to [Defining UDFs in dbt](/docs/build/udfs#defining-udfs-in-dbt) and the [packages](/reference/resource-configs/packages) config reference.

### `selector` method for named YAML selectors <Lifecycle status="beta" />

You can reference a named selector from `selectors.yml` inside `--select` or `--exclude` using the [`selector` method](/reference/node-selection/methods#selector) (for example, `selector:my_selector`). This makes it easier to compose reusable YAML selectors with other [selection methods](/reference/node-selection/methods), [graph operators](/reference/node-selection/graph-operators), and [set operators](/reference/node-selection/set-operators) on the command line without duplicating logic.

When you use the legacy `--selector` flag together with `--select` or `--exclude`, dbt only uses `--selector` for node selection and ignores `--select` and `--exclude`. Starting in <Constant name="core" /> v1.12, dbt also raises a warning when these flags are combined. If you want to combine a selector with `--select` or `--exclude`, use the new `selector:` method instead.

### Compiled SQL for snapshots <Lifecycle status="beta" />

`dbt compile` writes compiled SQL for [snapshots](/docs/build/snapshots) to `target/compiled/`, consistent with models, tests, analyses, and functions. Each snapshot gets its own output file, named from the snapshot identifier, so multiple snapshot blocks in the same source file do not share one compiled path.

For more information, refer to [About dbt compile](/reference/commands/compile).

### Support for `vars.yml` <Lifecycle status="beta" />

You can use the [`vars.yml`](/docs/build/project-variables#defining-variables-in-varsyml) file, located at the project root, to define project variables. This keeps variable definitions in one place and helps simplify `dbt_project.yml`. Variables defined in `vars.yml` are parsed _before_ `dbt_project.yml`, so you can reference them in `dbt_project.yml` using `{{ var('...') }}`. You can continue to define variables in `dbt_project.yml` as before, but you cannot define variables in both files. For details and precedence, refer to [Project variables](/docs/build/project-variables).

### Improved exception handling and error messages

<Constant name="core" /> v1.12 improves exception handling so error messages are clearer and stack traces are easier to interpret.

Previously, some internal failures surfaced as Python errors (for example, `AttributeError`, `KeyError`, `IndexError`, `RuntimeError`), which could be difficult to understand. In <Constant name="core" /> v1.12, these are replaced with dbt errors (such as `CompilationError` and `ParsingError`) that include a clear error message. When you need the full Python error output for debugging, use `--debug` or check the logs.

Key improvements:

- **Cleaner default output**: Built-in Python exceptions (`Exception`, `ValueError`, `RuntimeError`) are replaced with dbt errors, so dbt no longer treats them as internal errors or displays unnecessary stack traces.
- **Parsing and config validation**: Invalid field values raise a `ParsingError` instead of a raw `InvalidFieldValue` exception when applying `dbt_project.yml` configs to resources. In a generic data test, a `config` value that is a string or a number instead of a set of key-value pairs raises a `TestConfigNotDictError`.
- **Snapshot validation**: When snapshot validation fails, dbt shows the relevant error message and omits the long Python error output.
- **`dbt run-operation`**: When a `run-operation` call fails, the exception message is included in `run_results.json`, which makes failures easier to inspect.
- **Cycle detection**: Dependency graph cycles raise a `CompilationError` instead of the built-in `RuntimeError`.
- **Semantic model dependencies**: When a semantic model references a disabled or missing model, dbt raises a `CompilationError` instead of an `IndexError`.
<Expandable alt_header="More scenarios with exception handling improvements">

- A string concatenation in a `doc()` argument (such as `doc('foo' ~ 'bar')`) is skipped during doc block resolution instead of crashing with an `AttributeError`. 
- A Jinja variable (such as `doc(my_variable)`) raises a `DocTargetNotFoundError`.
- When a `meta` value in `schema.yml` references an undefined Jinja variable, dbt converts it to `None` instead of raising a `TypeError` during partial parse.
- When `sources`, `tables`, `exposure` tags, or `packages` are set to `null`, dbt treats them as an empty list instead of raising a `TypeError`.
- When a model with custom contract constraints is evaluated during `state:modified` selection, dbt returns `None` for unknown constraint types instead of raising a `KeyError`.
</Expandable>

### Managing changes to legacy behaviors

<Constant name="core" /> v1.12 introduces new flags for [managing changes to legacy behaviors](/reference/global-configs/behavior-changes). You may opt into recently introduced changes (disabled by default), or opt out of mature changes (enabled by default), by setting `True` / `False` values, respectively, for `flags` in `dbt_project.yml`.

You can read more about each of these behavior changes in the following links:

- (Introduced, disabled by default) [`require_valid_schema_from_generate_schema_name`](/reference/global-configs/behavior-changes#valid-schema-from-generate_schema_name). This flag is set to `False` by default. With this setting, dbt raises the [`GenerateSchemaNameNullValueDeprecation`](/reference/deprecations#generateschemanamenullvaluedeprecation) warning when a custom `generate_schema_name` macro returns a `null` value. When set to `True`, dbt enforces stricter validation and raises a parsing error instead of a warning.
- (Introduced, disabled by default) [`require_sql_header_in_test_configs`](/reference/global-configs/behavior-changes#sql_header-in-data-tests). When set to `True`, you can set [`sql_header`](/reference/resource-configs/sql_header) in the `config` of a generic data test at the model or column level in your `properties.yml` file. For more information, refer to [Data test configurations](/reference/data-test-configs).
- (Introduced, disabled by default) [`require_corrected_analysis_fqns`](/reference/global-configs/behavior-changes#project-level-configuration-for-analyses). When set to `true`, dbt applies project-level analysis configuration from `dbt_project.yml`. Previously, dbt silently ignored this configuration. This flag also corrects fully qualified names (FQNs) of analyses by removing the extra path segment, making them consistent with other resource types (for example, `your_project.my_analysis` instead of `your_project.analyses.my_analysis`). For more information, refer to [Analyses](/docs/build/analyses).
- (Introduced, disabled by default) [`require_source_and_semantic_model_names_without_spaces`](/reference/global-configs/behavior-changes#no-spaces-in-source-and-semantic-model-names). By default, dbt raises a [`ResourceNamesWithSpacesDeprecation`](/reference/deprecations#resourcenameswithspacesdeprecation) warning if it detects a space in a source name or semantic model name. When the flag is set to `True`, dbt raises an error.

## Adapter-specific features and functionalities

### Snowflake

- You can set the [`iceberg_version`](/docs/mesh/iceberg/snowflake-iceberg-support#adapter-properties) config on Snowflake Iceberg tables to control which Iceberg format version Snowflake uses. Set it to `3` to use Iceberg V3, which improves `VARIANT` type support and makes row-level changes more efficient by tracking deletions separately instead of rewriting data. The default value is `2`. Note that you cannot change the value of `iceberg_version` after table creation.
- You can configure the [`scheduler`](/reference/resource-configs/snowflake-configs#scheduler) parameter on Snowflake dynamic tables to control how refreshes are managed. Setting it to `ENABLE` lets Snowflake automatically refresh the dynamic table, while `DISABLE` means dbt manages refreshes during model execution. When `scheduler` is set to `ENABLE`, you must also specify [`target_lag`](/reference/resource-configs/snowflake-configs#target-lag). 

    By default, dbt sets `scheduler` to `DISABLE` (unlike Snowflake’s native default of `ENABLE`), so dbt controls the refresh schedule unless you explicitly opt in to Snowflake’s scheduler. If you specify `target_lag` without setting `scheduler`, dbt automatically sets `scheduler` to `ENABLE`.
- You can use the [`snowflake_initialization_warehouse`](/reference/resource-configs/snowflake-configs#initialization-warehouse) parameter to specify a warehouse for the initial build and reinitialization of a dynamic table, separate from `snowflake_warehouse` which is used for regular incremental refreshes.
- You can create Snowflake dynamic tables as transient (no [Fail-safe period](https://docs.snowflake.com/en/user-guide/data-failsafe)) by setting the [`transient`](/reference/resource-configs/snowflake-configs#transient-dynamic-tables) config on models. 

    When `transient` is not set on a model, the [`snowflake_default_transient_dynamic_tables`](/reference/global-configs/snowflake-changes#the-snowflake_default_transient_dynamic_tables-flag) flag controls the default. Set this flag to `True` to make all dynamic tables transient by default.

### BigQuery

- Added the [`bigquery_reject_wildcard_metadata_source_freshness`](/reference/global-configs/bigquery-changes#the-bigquery_reject_wildcard_metadata_source_freshness-flag) flag. When you set this flag to `True`, dbt raises a `DbtRuntimeError` if you run metadata-based source freshness checks with wildcard table identifiers (for example, `events_*`), preventing incorrect freshness results.
- You can configure BigQuery job link logging with `job_link_info_level_log`. By default, dbt logs job links at the debug level. To log job links at the info level, set `job_link_info_level_log: true` in your BigQuery profile. This makes job links visible in dbt logs for easier access to the BigQuery console. For more information, see [BigQuery setup](/docs/local/connect-data-platform/bigquery-setup#job_link_info_level_log).
- You can set `job_execution_timeout_seconds` per model, snapshot, seed, or test, in addition to the profile-level configuration. The per-resource value takes precedence over the default value set in the profile level. For more information, refer to [BigQuery setup](/docs/local/connect-data-platform/bigquery-setup#job_execution_timeout_seconds).

### Redshift

- The [`redshift_skip_autocommit_transaction_statements`](/reference/global-configs/redshift-changes#redshift_skip_autocommit_transaction_statements-flag) flag defaults to `False`, preserving legacy behavior of sending `BEGIN`/`COMMIT`/`ROLLBACK` statements even when autocommit is enabled. To skip unnecessary transaction statements and improve performance, set the flag to `True`.
- Added support for the `query_group` session parameter, allowing dbt to tag queries for Redshift Workload Manager routing and query logging. When configured in a profile, dbt sets `query_group` when opening a connection and the value applies for the duration of that session. You can also configure `query_group` at the model level to temporarily override the default value for a specific model, and dbt reverts the value at the end of model materialization. For more information, see [Redshift configurations](/reference/resource-configs/redshift-configs#session-configuration).

## Quick hits

- `dbt seed` now supports the [`--empty`](/reference/commands/seed#the---empty-flag) flag. Use it to create seed tables with the correct schema but without loading any data.

