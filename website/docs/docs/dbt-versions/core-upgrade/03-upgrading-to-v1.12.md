---
title: "Upgrading to v1.12"
id: upgrading-to-v1.12
description: New features and changes in dbt Core v1.12
displayed_sidebar: "docs"
---

# Upgrading to v1.12 <Lifecycle status="beta" />

## Resources
- [<Constant name="core" /> v1.12 changelog](https://github.com/dbt-labs/dbt-core/blob/1.12.latest/CHANGELOG.md)
- [<Constant name="core" /> CLI Installation guide](/docs/local/install-dbt)
- [dbt platform upgrade guide](/docs/dbt-versions/upgrade-dbt-platform-version#fusion-release-tracks)

## What to know before upgrading

dbt Labs is committed to providing backward compatibility for all versions 1.x. Any behavior changes will be accompanied by a [behavior change flag](/reference/global-configs/behavior-changes#behavior-change-flags) to provide a migration window for existing projects. If you encounter an error upon upgrading, please let us know by [opening an issue](https://github.com/dbt-labs/dbt-core/issues/new).

<Constant name="dbt" /> provides the functionality from new versions of <Constant name="core" /> via [release tracks](/docs/dbt-versions/dbt-release-tracks) with automatic upgrades. If you have selected the **Latest** release track in <Constant name="dbt" />, you already have access to all the features, fixes, and other functionality included in the latest <Constant name="core" /> version! If you have selected the **Compatible** release track, you will have access to the next monthly **Compatible** release after the <Constant name="core" /> v1.12 final release.

## New and changed features and functionality

### `dbt login`

In <Constant name="core" /> v1.12, [`dbt login`](/reference/commands/login) is used exclusively to enable [dbt State](/docs/deploy/dbt-state-about) (a paid feature available to <Constant name="core" />, <Constant name="dbt_platform" />, and <Constant name="fusion_engine" /> users). `dbt login` opens a browser window prompting you to sign in to your <Constant name="dbt_platform" /> account or create a [standalone dbt State account](https://app.state.dbt.com). It automatically sets `manage_state: true` in [`~/.dbt/user_settings.yml`](/reference/global-configs/user-settings), enabling dbt State on every `dbt run` or `dbt build`.

Run [`dbt login status`](/reference/commands/login#dbt-login-status) to view your current authentication status.

In the <Constant name="fusion_engine" />, `dbt login` unlocks a broader set of features beyond dbt State, such as advanced features in the [dbt VS Code extension](/docs/about-dbt-extension). For details, refer to [`dbt login`](/reference/commands/login).

### Opt-in v2 parser <Lifecycle status="beta" />

<Constant name="core" /> v1.12 introduces the `--use-v2-parser` flag that delegates parsing to Fusion's Rust parser instead of dbt Core's own Python parser. The Rust parser is significantly faster than the Python parser — especially on larger projects, where it can be 5–10× quicker. If you're looking to speed up your development workflow or cut down on job startup times. Using the Rust parser is a natural first step toward Fusion compatibility, so you can catch and fix any project issues gradually rather than all at once.

This is an opt-in flag that changes no behavior unless explicitly set, making it a low-risk way to test Fusion parser compatibility from within <Constant name="core" /> v1.12.

:::note
The Rust parser is beta. Its output manifest may differ from the Python parser's in edge cases, which can affect downstream behavior. Fall back by removing `--use-v2-parser`, and [report issues](https://github.com/dbt-labs/dbt-core/issues) to help us close the gap.
:::

For more information on how to enable the flag, related behaviors, and parser error types, refer to [Opt-in v2 parser](/reference/global-configs/parsing#opt-in-v2-parser).

### Native private packages in dbt Core

<Constant name="core" /> now supports [native private packages](/docs/build/packages#native-private-packages) in `packages.yml` and `dependencies.yml`, at parity with the <Constant name="fusion_engine" />. You can install packages from private GitHub, GitLab, or Azure DevOps repos using the `private` key without configuring a token or full Git URL. dbt uses your system's SSH configuration for authentication. Use the [`provider` key](/docs/build/packages#using-the-provider-key) to specify your Git provider and tell dbt which SSH URL format to construct. For example:

```yaml
packages:
  - private: your-org/your-internal-repo
    provider: "github"  # Supported values: "github", "gitlab", "ado"
```

### Extensions to UDFs <Lifecycle status="beta" />

- <Constant name="core" /> v1.12 adds support for JavaScript user-defined functions (UDFs) on Snowflake and BigQuery. Define a JavaScript UDF by creating a `.js` file in your `functions/` directory and a corresponding YAML file with the function's arguments and return type. For more information, refer to [User-defined functions](/docs/build/udfs).

- You can define multiple argument signatures for the same user-defined function (UDF) using the `overloads` property. This lets you call the same function name with different input types, without creating separate UDFs for each variant. This is supported for SQL UDFs in Snowflake and Postgres, and Python UDFs in Snowflake. Each overload references a separate file using `defined_in`, with optional `arguments` and `returns`. All overloads are grouped into one <Term id="dag">DAG</Term> node, so they're built and selected together. On retry, dbt skips overloads that succeeded and reruns only those that failed. For more information, refer to [Defining overloaded UDFs](/docs/build/udfs#defining-udfs-in-dbt#defining-overloaded-UDFs) and [`overloads`](/reference/resource-properties/overloads).

- You can specify public third-party PyPI packages for your Python UDF with the optional `packages` config. The warehouse installs these packages when it creates the UDF, which lets your UDF use functionality from external Python libraries. For more information, refer to [Defining UDFs in dbt](/docs/build/udfs#defining-udfs-in-dbt) and the [packages](/reference/resource-configs/packages) config reference.


### `latest_version_pointer` for versioned models <Lifecycle status="beta" />

For versioned models, you can configure dbt to automatically create a pointer view named after a model's base name (for example, `dim_customers`) once the latest version materializes successfully. This lets you query the current version without maintaining a view manually.

Enable this feature in your project with the [`latest_version_pointer_enabled_by_default: true`](/reference/global-configs/behavior-flag-introduction#latest-version-pointer-for-versioned-models) flag in `dbt_project.yml`, or per model using the [`latest_version_pointer.enabled`](/reference/resource-configs/latest_version_pointer) config. You can customize the pointer name per model with `latest_version_pointer.alias`, or globally by overriding the [`generate_latest_version_pointer_alias`](/docs/build/custom-aliases#generate_latest_version_pointer_alias) macro. For more information, refer to [Model versions](/docs/mesh/govern/model-versions#pointing-to-the-latest-version).

### `--sql` flag for `dbt run-operation` <Lifecycle status="beta" />

You can now use the `--sql` flag with `dbt run-operation` to execute ad hoc database statements directly against your warehouse, without defining a macro. This is useful for one-off operations like dropping or altering a table, applying grants, or running a data fix. The statement runs through dbt's full Jinja compilation pipeline, so you have access to `ref()`, `source()`, `var()`, `target`, and all other context variables. For more information, refer to [About dbt run-operation](/reference/commands/run-operation).

### `on_error` model config <Lifecycle status="beta" />

You can configure whether downstream models run when an upstream model fails using the [`on_error`](/reference/resource-configs/on_error) config. Set `on_error: continue` on a model to allow its downstream models to still attempt to run even when it fails. By default (`skip_children`), dbt skips all downstream models on failure. Note that [`--fail-fast`](/reference/global-configs/failing-fast) takes precedence &mdash; runs with `--fail-fast` stop at the first failure, even if a model is configured with `on_error: continue`.

### OSI semantic layer support <Lifecycle status="beta" />

- <Constant name="core" /> v1.12 supports the [Open Semantic Interchange (OSI)](https://github.com/open-semantic-interchange/OSI) standard for defining semantic models and metrics. You can place OSI-format `.json` files in an `OSI/` directory at the root of your project, and dbt parses them into the manifest alongside any native dbt semantic models. To use a different directory, configure [`osi-paths`](/reference/project-configs/osi-paths) in `dbt_project.yml`. OSI versions `0.1.0` and `0.1.1` are supported; any other version raises a parse error. For more information, refer to [OSI semantic layer documents](/docs/build/osi-semantic-models).
- dbt writes an `osi_document.json` file to your `target/` directory alongside `semantic_manifest.json` at parse time. This artifact provides an Open Semantic Interchange (OSI) representation of your project's <Constant name="semantic_layer" />. For more information, refer to [Semantic manifest](/reference/artifacts/sl-manifest#osi-document).


This is separate from the new <Constant name="semantic_layer" /> YAML spec below, which changes how you define semantic models and metrics in native dbt YAML.

### New Semantic Layer YAML spec

<Constant name="core" /> v1.12 adds support for the latest <Constant name="semantic_layer" /> YAML specification, which simplifies how you define metrics and dimensions by embedding semantic annotations directly alongside each model.

Key changes in the new spec:
- `semantic_model` is nested directly under each model instead of being a standalone top-level key.
- Entities and dimensions are defined at the column level.
- Measures are replaced with `type: simple` metrics defined within the model.
- `type_params` is deprecated; its parameters are now top-level keys within each metric definition.

For migration guidance and a comparison between the latest spec and the legacy spec, refer to [Migrate to the latest YAML spec](/docs/build/latest-metrics-spec). For the semantic model reference, refer to [Semantic models](/docs/build/semantic-models).

### `selector` method for named YAML selectors <Lifecycle status="beta" />

You can reference a named selector from `selectors.yml` inside `--select` or `--exclude` using the [`selector` method](/reference/node-selection/methods#selector) (for example, `selector:my_selector`). This makes it easier to compose reusable YAML selectors with other [selection methods](/reference/node-selection/methods), [graph operators](/reference/node-selection/graph-operators), and [set operators](/reference/node-selection/set-operators) on the command line without duplicating logic.

When you use the legacy `--selector` flag together with `--select` or `--exclude`, dbt only uses `--selector` for node selection and ignores `--select` and `--exclude`. Starting in <Constant name="core" /> v1.12, dbt also raises a warning when these flags are combined. If you want to combine a selector with `--select` or `--exclude`, use the new `selector:` method instead.

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

<Constant name="core" /> v1.12 introduces new flags for [managing changes to legacy behaviors](/reference/global-configs/behavior-changes). You may opt into recently introduced changes (disabled by default), or opt out of mature changes (enabled by default), by setting `true` / `false` values, respectively, for `flags` in `dbt_project.yml`.

You can read more about each of these behavior changes in the following links:

- (Introduced, disabled by default) [`require_valid_schema_from_generate_schema_name`](/reference/global-configs/behavior-flag-introduction#valid-schema-from-generate_schema_name). This flag is set to `false` by default. With this setting, dbt raises the [`GenerateSchemaNameNullValueDeprecation`](/reference/deprecations#generateschemanamenullvaluedeprecation) warning when a custom `generate_schema_name` macro returns a `null` value. When set to `true`, dbt enforces stricter validation and raises a parsing error instead of a warning.
- (Introduced, disabled by default) [`require_sql_header_in_test_configs`](/reference/global-configs/behavior-flag-introduction#sql_header-in-data-tests). When set to `true`, you can set [`sql_header`](/reference/resource-configs/sql_header) in the `config` of a generic data test at the model or column level in your `properties.yml` file. For more information, refer to [Data test configurations](/reference/data-test-configs).
- (Introduced, disabled by default) [`require_corrected_analysis_fqns`](/reference/global-configs/behavior-flag-introduction#project-level-configuration-for-analyses). When set to `true`, dbt applies project-level analysis configuration from `dbt_project.yml`. Previously, dbt silently ignored this configuration. This flag also corrects fully qualified names (FQNs) of analyses by removing the extra path segment, making them consistent with other resource types (for example, `your_project.my_analysis` instead of `your_project.analyses.my_analysis`). For more information, refer to [Analyses](/docs/build/analyses).
- (Introduced, disabled by default) [`require_source_and_semantic_model_names_without_spaces`](/reference/global-configs/behavior-flag-introduction#no-spaces-in-source-and-semantic-model-names). By default, dbt raises a [`ResourceNamesWithSpacesDeprecation`](/reference/deprecations#resourcenameswithspacesdeprecation) warning if it detects a space in a source name or semantic model name. When the flag is set to `true`, dbt raises an error.
- (Introduced, disabled by default) [`allow_jinja_file_extensions`](/reference/global-configs/behavior-flag-introduction#jinja-file-extensions). When set to `True`, dbt recognizes Jinja-style extension suffixes (`.j2`, `.jinja`, `.jinja2`) on `.sql` and `.md` files. This enables Jinja-aware syntax highlighting in IDEs that associate these suffixes with Jinja templating.
- (Introduced, disabled by default) [`latest_version_pointer_enabled_by_default`](/reference/global-configs/behavior-flag-introduction#latest-version-pointer-for-versioned-models). When set to `true`, dbt automatically creates a latest version pointer view for every versioned model in your project, without requiring per-model configuration.

## Adapter-specific features and functionalities

### Snowflake

- You can use the [`snowflake.quote_args`](/reference/resource-configs/quote_args) config on JavaScript UDFs to control whether argument names are quoted in the generated `CREATE FUNCTION` statement. When `true` (default), Snowflake quotes argument names, preserving their exact casing, so you reference arguments using the same case as defined in the YAML inside the function body. When `false`, argument names are unquoted and Snowflake uppercases them, so you must reference them in uppercase inside the function body.
- You can set the [`iceberg_version`](/docs/mesh/iceberg/snowflake-iceberg-support#adapter-properties) config on Snowflake Iceberg tables to control which Iceberg format version Snowflake uses. Set it to `3` to use Iceberg V3, which improves `VARIANT` type support and makes row-level changes more efficient by tracking deletions separately instead of rewriting data. The default value is `2`. Note that you cannot change the value of `iceberg_version` after table creation.
- You can configure the [`scheduler`](/reference/resource-configs/snowflake-configs#scheduler) parameter on Snowflake dynamic tables to control how refreshes are managed. Setting it to `ENABLE` lets Snowflake automatically refresh the dynamic table, while `DISABLE` means dbt manages refreshes during model execution. When `scheduler` is set to `ENABLE`, you must also specify [`target_lag`](/reference/resource-configs/snowflake-configs#target-lag). 

    By default, dbt sets `scheduler` to `DISABLE` (unlike Snowflake’s native default of `ENABLE`), so dbt controls the refresh schedule unless you explicitly opt in to Snowflake’s scheduler. If you specify `target_lag` without setting `scheduler`, dbt automatically sets `scheduler` to `ENABLE`.
- You can use the [`snowflake_initialization_warehouse`](/reference/resource-configs/snowflake-configs#initialization-warehouse) parameter to specify a warehouse for the initial build and reinitialization of a dynamic table, separate from `snowflake_warehouse` which is used for regular incremental refreshes.
- You can create Snowflake dynamic tables as transient (no [Fail-safe period](https://docs.snowflake.com/en/user-guide/data-failsafe)) by setting the [`transient`](/reference/resource-configs/snowflake-configs#transient-dynamic-tables) config on models. 

    When `transient` is not set on a model, the [`snowflake_default_transient_dynamic_tables`](/reference/global-configs/snowflake-changes#the-snowflake_default_transient_dynamic_tables-flag) flag controls the default. Set this flag to `true` to make all dynamic tables transient by default.

### BigQuery

- Added the [`bigquery_use_standard_sql_for_partitions`](/reference/global-configs/bigquery-changes#the-bigquery_use_standard_sql_for_partitions-flag) flag, which controls whether `get_partitions_metadata()` uses standard SQL (`INFORMATION_SCHEMA.PARTITIONS`) or legacy SQL (`$__PARTITIONS_SUMMARY__`). The flag defaulted to `false` when first introduced in this release, but has been flipped to `true` by default ahead of BigQuery's [legacy SQL deprecation on June 1, 2026](https://docs.cloud.google.com/bigquery/docs/release-notes#February_25_2026). To revert to legacy SQL, set the flag to `false` in `dbt_project.yml`.
- Added the [`bigquery_reject_wildcard_metadata_source_freshness`](/reference/global-configs/bigquery-changes#the-bigquery_reject_wildcard_metadata_source_freshness-flag) flag. When you set this flag to `true`, dbt raises a `DbtRuntimeError` if you run metadata-based source freshness checks with wildcard table identifiers (for example, `events_*`), preventing incorrect freshness results.
- You can configure BigQuery job link logging with `job_link_info_level_log`. By default, dbt logs job links at the debug level. To log job links at the info level, set `job_link_info_level_log: true` in your BigQuery profile. This makes job links visible in dbt logs for easier access to the BigQuery console. For more information, see [BigQuery setup](/docs/local/connect-data-platform/bigquery-setup#job_link_info_level_log).
- You can set `job_execution_timeout_seconds` per model, snapshot, seed, or test, in addition to the profile-level configuration. The per-resource value takes precedence over the default value set in the profile level. For more information, refer to [BigQuery setup](/docs/local/connect-data-platform/bigquery-setup#job_execution_timeout_seconds).

### Redshift

- The [`redshift_skip_autocommit_transaction_statements`](/reference/global-configs/redshift-changes#redshift_skip_autocommit_transaction_statements-flag) flag defaults to `false`, preserving legacy behavior of sending `BEGIN`/`COMMIT`/`ROLLBACK` statements even when autocommit is enabled. To skip unnecessary transaction statements and improve performance, set the flag to `true`.
- Added support for the `query_group` session parameter, allowing dbt to tag queries for Redshift Workload Manager routing and query logging. When configured in a profile, dbt sets `query_group` when opening a connection and the value applies for the duration of that session. You can also configure `query_group` at the model level to temporarily override the default value for a specific model, and dbt reverts the value at the end of model materialization. For more information, see [Redshift configurations](/reference/resource-configs/redshift-configs#session-configuration).


## Quick hits

- Macros invoked with the [`dbt run-operation`](/reference/commands/run-operation) command can now `ref()` models with `private` or `protected` [access](/reference/resource-configs/access) without raising a `DbtReferenceError`. Because macros are not part of the group and access control system, dbt doesn't enforce group membership when a macro called by `run-operation` references a model.
- `dbt seed` now supports the [`--empty`](/reference/commands/seed#the---empty-flag) flag. Use it to create seed tables with the correct schema but without loading any data.
- <Constant name="core" /> now automatically loads environment variables from a `.env` file in your current working directory. Shell environment variables take precedence over `.env` values. New projects created with `dbt init` include `.env` in the default `.gitignore`. For more information, refer to [About env_var function](/reference/dbt-jinja-functions/env_var#using-the-env-file).
- `dbt compile` writes compiled SQL for [snapshots](/docs/build/snapshots) to `target/compiled/`, consistent with models, tests, analyses, and functions. Each snapshot gets its own output file, named from the snapshot identifier, so multiple snapshot blocks in the same source file do not share one compiled path. For more information, refer to [About dbt compile](/reference/commands/compile).

