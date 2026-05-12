---
title: "Warnings"
id: "warnings"
sidebar: "Warnings"
toc_max_heading_level: 2
intro_text: "Use the --warn-error flag to promote all warnings to errors or --warn-error-options for granular control through options."
---

## Use `--warn-error` to promote all warnings to errors

Enabling `WARN_ERROR` config or setting the `--warn-error` flag will convert _all_ dbt warnings into errors. Any time dbt would normally warn, it will instead raise an error. Examples include `--select` criteria that selects no resources, deprecations, configurations with no associated models, invalid test configurations, or tests and freshness checks that are configured to return warnings.

<File name='Usage'>

  ```text
  dbt run --warn-error
  ```

</File>


:::caution Proceed with caution in production environments
Using the `--warn-error` flag or `--warn-error-options '{"error": "all"}'` will treat _all_ current and future warnings as errors.

This means that if a new warning is introduced in a future version of <Constant name="core" />, your production job may start failing unexpectedly. We recommend proceeding with caution when doing this in production environments, and explicitly listing only the warnings you want to treat as errors in production.
:::


## Use `--warn-error-options` for targeted warnings

In some cases, you may want to convert _all_ warnings to errors. However, when you want _some_ warnings to stay as warnings and only promote or silence specific warnings you can instead use `--warn-error-options`. The `WARN_ERROR_OPTIONS` config or `--warn-error-options` flag gives you more granular control over _exactly which types of warnings_ are treated as errors. 

:::info `WARN_ERROR` and `WARN_ERROR_OPTIONS` are mutually exclusive
`WARN_ERROR` and `WARN_ERROR_OPTIONS` are mutually exclusive. You can only specify one, even when you're specifying the config in multiple places (like env var or a flag), otherwise, you'll see a usage error.
:::

Warnings that should be treated as errors can be specified through the `error` parameter. Warning names can be found in:
  - [dbt-core's types.py file](https://github.com/dbt-labs/dbt-core/blob/main/core/dbt/events/types.py), where each class name that inherits from `WarnLevel` corresponds to a warning name (e.g. `AdapterDeprecationWarning`, `NoNodesForSelectionCriteria`).
  - Using the `--log-format json` flag.

<VersionBlock firstVersion="2.0">

In the <Constant name="fusion_engine" />, every warning has both a numeric code (for example, `1092`) and an event name (for example, `NoNodesForSelectionCriteria`). You can use either form interchangeably in `warn_error_options`. Messages printed at runtime include both the name and the code. See [Supported legacy dbt-Core event name aliases](#supported-legacy-dbt-core-event-name-aliases) for the full list of supported event names and their corresponding codes.

</VersionBlock>

The `error` parameter can be set to `"all"` or `"*"` to treat all warnings as errors (this behavior is the same as using the `--warn-error` flag), or to a list of specific warning names to treat as exceptions.
- When `error` is set to `"all"` or `"*"`, the optional `warn` parameter can be set to exclude specific warnings from being treated as exceptions.
- Use the `silence` parameter to ignore warnings. To silence certain warnings you want to ignore, you can specify them in the `silence` parameter. This is useful in large projects where certain warnings aren't critical and can be ignored to keep the noise low and logs clean.

Here's how you can use the [`--warn-error-options`](#use---warn-error-options-for-targeted-warnings) flag to promote _specific_ warnings to errors:
- [Test warnings](/reference/resource-configs/severity) with the `--warn-error-options '{"error": ["LogTestResult"]}'` flag.
- Jinja [exception warnings](/reference/dbt-jinja-functions/exceptions#warn) with `--warn-error-options '{"error": ["JinjaLogWarning"]}'`.
- No nodes selected with `--warn-error-options '{"error": ["NoNodesForSelectionCriteria"]}'`.
- Deprecation warnings with `--warn-error-options '{"error": ["Deprecations"]}'` (new in v1.10).

### Configuration

You can configure warnings as errors or which warnings to silence, by warn error options through command flag, environment variable, or `dbt_project.yml`.

You can choose to:

- Promote all warnings to errors using `{"error": "all"}` or `--warn-error` flag.
- Promote specific warnings to errors using `error` and optionally exclude others from being treated as errors with `--warn-error-options` flag. `warn` tells dbt to continue treating the warnings as warnings.
- Ignore warnings using `silence` with `--warn-error-options` flag.

In the following example, we're silencing the [`NoNodesForSelectionCriteria` warning](https://github.com/dbt-labs/dbt-core/blob/main/core/dbt/events/types.py#L1227) in the `dbt_project.yml` file by adding it to the `silence` parameter:

  <File name='dbt_project.yml'>

  ```yaml
...
  flags:
    warn_error_options:
      error: # Previously called "include"
      warn: # Previously called "exclude"
      silence: # To silence or ignore warnings
        - NoNodesForSelectionCriteria
  ```

  </File>

### Examples
Here are some examples that show you how to configure `warn_error_options` using flags or file-based configuration.

#### Target specific warnings
Some of the examples use `NoNodesForSelectionCriteria`, which is a specific warning that occurs when your `--select` flag doesn't match any nodes/resources in your dbt project:


- This command promotes all warnings to errors, except for `NoNodesForSelectionCriteria`:
  ```text
  dbt run --warn-error-options '{"error": "all", "warn": ["NoNodesForSelectionCriteria"]}'
  ```

- This command promotes all warnings to errors, except for deprecation warnings:
  ```text
  dbt run --warn-error-options '{"error": "all", "warn": ["Deprecations"]}'
  ```

- This command promotes only `NoNodesForSelectionCriteria` as an error:
  ```text
  dbt run --warn-error-options '{"error": ["NoNodesForSelectionCriteria"]}'
  ```

- This promotes only `NoNodesForSelectionCriteria` as an error, using an environment variable:

  <VersionBlock lastVersion="1.10">

  ```text
  DBT_WARN_ERROR_OPTIONS='{"error": ["NoNodesForSelectionCriteria"]}' dbt run
  ```

  </VersionBlock>

  <VersionBlock firstVersion="1.11">

  ```text
  DBT_ENGINE_WARN_ERROR_OPTIONS='{"error": ["NoNodesForSelectionCriteria"]}' dbt run
  ```

  </VersionBlock>

Values for `error`, `warn`, and/or `silence` should be passed on as arrays. For example, `dbt run --warn-error-options '{"error": "all", "warn": ["NoNodesForSelectionCriteria"]}'` not `dbt run --warn-error-options '{"error": "all", "warn": "NoNodesForSelectionCriteria"}'`.

The following example shows how to promote all warnings to errors, except for the `NoNodesForSelectionCriteria` warning using the `silence` and `warn` parameters in the `dbt_project.yml` file:
  <File name='dbt_project.yml'>

  ```yaml
  ...
  flags:
    warn_error_options:
      error: all # Previously called "include"
      warn:      # Previously called "exclude"
        - NoNodesForSelectionCriteria
      silence:   # To silence or ignore warnings
        - NoNodesForSelectionCriteria
  ```

  </File>

#### Promote all warnings to errors
Some examples of how to promote all warnings to errors:

##### using dbt command flags

```bash 
dbt run --warn-error
dbt run --warn-error-options '{"error": "all"}'
dbt run --warn-error-options '{"error": "*"}'
```

##### using environment variables

<VersionBlock lastVersion="1.10">

```bash 
WARN_ERROR=true dbt run 
DBT_WARN_ERROR_OPTIONS='{"error": "all"}' dbt run 
DBT_WARN_ERROR_OPTIONS='{"error": "*"}' dbt run 
```

</VersionBlock>

<VersionBlock firstVersion="1.11">

```bash 
WARN_ERROR=true dbt run 
DBT_ENGINE_WARN_ERROR_OPTIONS='{"error": "all"}' dbt run 
DBT_ENGINE_WARN_ERROR_OPTIONS='{"error": "*"}' dbt run 
```

</VersionBlock>

  
:::caution
Note, using `warn_error_options: error: "all"` will treat all current and future warnings as errors.

This means that if a new warning is introduced in a future version of <Constant name="core" />, your production job may start failing unexpectedly. We recommend proceeding with caution when doing this in production environments, and explicitly listing only the warnings you want to treat as errors in production.
:::

<VersionBlock firstVersion="2.0">

## Fusion behavior and warning codes

The <Constant name="fusion_engine" /> fully supports `warn_error_options`. This section describes important differences from <Constant name="core" /> behavior.

Existing dbt-core event names fall into three categories:

- **Supported** Mapped to similar <Constant name="fusion" /> warning and behave approximately the same.
- **Won't be supported:** Those that we deliberately decided to not ever support.
- **Not supported yet:** Parsed, but do nothing yet.

### Warning codes in Fusion

In <Constant name="fusion" />, every warning has both a numeric code (for example, `1092`) and an event name (for example, `NoNodesForSelectionCriteria`). You should only use the name in the `warn_error_options`, even though both will appear in any warning messages printed at runtime:

```yaml
flags:
  warn_error_options:
    error:
      - NothingToDo   # by name
    silence:
      - FreshnessConfigProblem   # by name
```

Any value that is not a recognized numeric code, supported legacy event name, Fusion-native name, or supported group (`all`, `*`) causes <Constant name="fusion" /> to exit with an error at startup.

### Supported legacy dbt-core event name aliases

Each row lists a <Constant name="fusion" /> warning code and the legacy <Constant name="core" /> event name. You can use either the numeric code or the event name interchangeably in your `warn_error_options` configuration:

| Fusion code | dbt-core event name | Description |
|---|---|---|
| 1601 | `NoNodesSelected` | No nodes selected |
| 1601 | `NothingToDo` | No nodes selected (alias) |
| 1087 | `NodeNotFoundOrDisabled` | A test or exposure dependency references a missing or disabled node |
| 1085 | `DeprecatedModel` | A model has passed its deprecation date and should be removed |
| 1072 | `DeprecatedReference` | A reference to a model that has already been deprecated |
| 1073 | `UpcomingReferenceDeprecation` | A reference to a model that will be deprecated on a future date |
| 1074 | `JinjaLogWarning` | Jinja `exceptions.warn()` called in a macro |
| 1075 | `SnapshotTimestampWarning` | Snapshot timestamp column type mismatch |
| 1076 | `PackageRedirectDeprecation` | A package has been redirected to a new name; update your `packages.yml` |
| 1077 | `DepsUnpinned` | A git-sourced package uses an unpinned revision (`HEAD`, `main`, or `master`) |
| 1078 | `FreshnessConfigProblem` | A source has no freshness configuration; freshness check was skipped |
| 1084 | `WarnStateTargetEqual` | The `--state` and `--target` directories are the same path |
| 1086 | `WEOIncludeExcludeDeprecation` | Deprecated `include`/`exclude` keys were used in `warn_error_options`; use `error`/`warn` instead |
| 1089 | `NoNodeForYamlKey` | A YAML key references a node that doesn't exist in the project |
| 1090 | `MacroNotFoundForPatch` | A `patches:` entry in a YAML file references a macro that doesn't exist |
| 1091 | `InvalidConcurrentBatchesConfig` | `concurrent_batches` is configured but not supported for this model |
| 1092 | `NoNodesForSelectionCriteria` | `--select` criteria matched no nodes |
| 1093 | `MicrobatchModelNoEventTimeInputs` | A microbatch model has no upstream inputs with `event_time` configured |
| 1094 | `UnversionedBreakingChange` | A breaking change was made to an unversioned model |
| 1095 | `UnsupportedConstraintMaterialization` | A constraint was defined on a materialization that doesn't support it |
| 1097 | `UnusedResourceConfigPath` | A `+config` path in `dbt_project.yml` doesn't match any resources |
| 1098 | `DepsScrubbedPackageName` | A package name contained characters that were scrubbed during install |
| 1099 | `DepsFoundDuplicatePackage` | The same package was found more than once in `packages.yml` |
| 1506 | `InvalidMacroAnnotation` | A macro's YAML annotation (argument name or type) doesn't match its Jinja definition |
| _no code_ | `LogTestResult` | A data test result (pass/warn/fail) |
| _no code_ | `RunResultWarning` | A model or test run completed with `warn` status |
| _no code_ | `RunResultWarningMessage` | The message accompanying a `warn`-status run result |

### Unsupported Core event names

Only the legacy names in [Supported legacy dbt-Core event name aliases](#supported-legacy-dbt-core-event-name-aliases) are valid string aliases in <Constant name="fusion" />. There are many other <Constant name="core" /> warning event names; if you put one of those in `warn_error_options`, <Constant name="fusion" /> will throw a warning at startup.

The table below is not a complete list of unsupported names. It only includes <Constant name="core" /> event names that <Constant name="fusion" /> recognizes by name so it can emit a startup warning explaining why the entry has no effect and prompting you to remove it: the underlying <Constant name="core" /> behavior was removed, replaced, or made unconditional in <Constant name="fusion" />. Many other unsupported <Constant name="core" /> names are not listed here; they still warn during startup validation when used in `warn_error_options`.

| dbt-core event name | Message |
|---|---|
| `MicrobatchMacroOutsideOfBatchesDeprecation` | Fusion only supports the newer behavior-change flag, where this case is a hard error. |
| `SeedExceedsLimitSamePath` | This warning comes from partial parsing in dbt Core, which Fusion does not support. |
| `SeedIncreased` | This warning comes from partial parsing in dbt Core, which Fusion does not support. |
| `GenerateSchemaNameNullValueDeprecation` | Fusion only supports the newer behavior-change flag, where this case is a hard error. |
| `GenericSemanticLayerDeprecation` | Fusion already implements the new semantic layer spec, so this legacy warning no longer applies. |
| `MFCumulativeTypeParamsDeprecation` | Fusion already implements the new semantic layer spec, so this legacy warning no longer applies. |
| `MFTimespineWithoutYamlConfigurationDeprecation` | Fusion already implements the new semantic layer spec, so this legacy warning no longer applies. |
| `MetricAttributesRenamed` | Fusion already implements the new semantic layer spec, so this legacy warning no longer applies. |
| `TimeDimensionsRequireGranularityDeprecation` | Fusion already implements the new semantic layer spec, so this legacy warning no longer applies. |
| `SourceFreshnessProjectHooksNotRun` | Fusion already uses the newer source freshness behavior, so this legacy warning does not apply. |
| `SemanticValidationFailure` | Fusion does not support semantic models, so this warning does not apply. |
| `ValidationWarning` | Fusion already validates allowed YAML keys strictly, so this warning would be redundant. |
| `PackageMaterializationOverrideDeprecation` | Fusion already enforces the latest behavior, which prevents packages from overriding built-in materializations. |
| `TestsConfigDeprecation` | Fusion does not surface this warning by default, which matches current dbt Core behavior. |
| `ProjectFlagsMovedDeprecation` | Fusion already errors on this configuration, which matches newer dbt Core behavior. |
| `ConfigSourcePathDeprecation` | This is now fully deprecated in Fusion. |
| `ConfigLogPathDeprecation` | This is now fully deprecated in Fusion. |
| `ConfigTargetPathDeprecation` | This is now fully deprecated in Fusion. |
| `ConfigDataPathDeprecation` | This is now fully deprecated in Fusion. |
| `EnvironmentVariableNamespaceDeprecation` | Fusion reserves the `DBT_ENGINE_` prefix and rejects unknown environment variables that use it. |
| `UnusedTables` | Fusion does not allow source overrides, so packages must disable a source explicitly instead. |
| `WrongResourceSchemaFile` | Fusion reports this case under `NoNodeForYamlKey` instead. |
| `PackageNodeDependsOnRootProjectNode` | Fusion only supports the newer behavior-change flag `require_ref_searches_node_package_before_root`, where this case is a hard error. |

### Warnings that are hard errors in Fusion

Some <Constant name="core" /> warning names correspond to behaviors that <Constant name="fusion" /> enforces unconditionally as parse errors. If you reference these names in `warn_error_options`, <Constant name="fusion" /> emits a startup warning explaining that the entry has no effect. You can carry over your `warn_error_options` config from <Constant name="core" /> without breaking, but these configs do nothing (They will throw a warning as `unsupported` and should be removed from the config):

| dbt-Core event name | Fusion behavior | Fusion error code |
|---|---|---|
| `DuplicateYAMLKeysDeprecation` | Fusion's YAML parser rejects duplicate keys as hard parse errors | `DuplicateConfigKey` (1059) |
| `CustomKeyInConfigDeprecation` | Unknown config keys are rejected via strict schema validation | `UnusedConfigKey` (1060) |
| `CustomTopLevelKeyDeprecation` | Unknown top-level schema keys are hard parse errors | `UnusedConfigKey` (1060) |
| `ResourceNamesWithSpacesDeprecation` | Resource names with spaces are rejected during name validation | `SchemaError` |
| `InvalidValueForField` | Field value failures are surfaced as hard parse errors via deserialization | `SerializationError` |
| `GenericJSONSchemaValidationDeprecation` | JSON schema validation failures are hard parse errors | `SerializationError` |
| `DuplicateNameDistinctNodeTypesDeprecation` | Caught as a hard error during node resolution | `SchemaError` |

### Enabling `--warn-error` with static analysis in `baseline` mode

If your project emits static analysis warnings and you use `--warn-error` (which promotes all warnings to errors), your project may fail unexpectedly. We recommend explicitly listing the warning categories you want to enforce rather than using `error: all` when `baseline` mode is active.


### Deprecated `include` and `exclude` keys

The legacy `include` and `exclude` fields for `warn_error_options` were deprecated in dbt Core v1.8 but are still supported in <Constant name="fusion" />. If you use them, <Constant name="fusion" /> emits a `WEOIncludeExcludeDeprecation` warning (code 1086) and ignores the deprecated keys. Migrate to `error`, `warn`, and `silence` instead:

```yaml
# Before (Core ≤1.7)
flags:
  warn_error_options:
    include: all
    exclude:
      - NoNodesForSelectionCriteria

# After (Core ≥1.8 and Fusion)
flags:
  warn_error_options:
    error: all
    warn:
      - NoNodesForSelectionCriteria
```

</VersionBlock>
