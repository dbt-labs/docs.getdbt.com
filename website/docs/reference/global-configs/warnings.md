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

In the <Constant name="fusion_engine" />, warning codes are numeric (for example, `1600`, `1074`) rather than the event class names used in <Constant name="core" />. <Constant name="fusion" /> uses numeric codes as the canonical configuration key, with a subset of legacy <Constant name="core" /> event names supported as aliases. You can find <Constant name="fusion" /> warning codes using the `--log-format json` flag, which includes the numeric code in the `code` field of each log entry. See [Supported legacy dbt-Core event name aliases](#supported-legacy-dbt-core-event-name-aliases) for the full list of supported event name aliases.

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

### Warning codes in Fusion

In <Constant name="fusion" />, every warning has a numeric error code (for example, `1600`, `1074`, `1085`). Numeric codes are the canonical configuration key and you can use them directly in `warn_error_options`:

```yaml
flags:
  warn_error_options:
    error:
      - 1600   # NoNodesForSelectionCriteria
      - 1074   # JinjaLogWarning / exceptions.warn()
    silence:
      - 1078   # FreshnessConfigProblem
```

A subset of legacy <Constant name="core" /> event names are also accepted as aliases and mapped to their corresponding <Constant name="fusion" /> codes. Any value that is not a recognized numeric code, supported legacy event name, or supported group (`all`, `*`) causes <Constant name="fusion" /> to exit with an error at startup. This is a deliberate change from <Constant name="core" />, which silently ignored unknown values.

### Supported legacy dbt-Core event name aliases

Each row lists a canonical <Constant name="fusion" /> warning code and the legacy <Constant name="core" /> event name that <Constant name="fusion" /> accepts as an alias. You can use either the numeric code or the event name in your `warn_error_options` configuration:

| Fusion code | dbt-Core event name | Description |
|---|---|---|
| 1600 | `NoNodesForSelectionCriteria` | `--select` criteria matched no nodes |
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
| _(no code)_ | `LogTestResult` | A data test result (pass/warn/fail); matched by name only |

### Unsupported Core event names

Only the legacy names in [Supported legacy dbt-Core event name aliases](#supported-legacy-dbt-core-event-name-aliases) are valid string aliases in <Constant name="fusion" />. There are many other <Constant name="core" /> warning event names; if you put one of those in `warn_error_options`, <Constant name="fusion" /> fails at startup, as described in [Warning codes in Fusion](#warning-codes-in-fusion).

The table below is not a complete list of unsupported names. It only includes <Constant name="core" /> event names that <Constant name="fusion" /> recognizes by name so it can emit a startup warning explaining why the entry has no effect and prompting you to remove it: the underlying <Constant name="core" /> behavior was removed, replaced, or made unconditional in <Constant name="fusion" />. Many other unsupported <Constant name="core" /> names are not listed here; they still fail startup validation when used in `warn_error_options`.

| dbt-Core event name | Reason not supported |
|---|---|
| `MicrobatchMacroOutsideOfBatchesDeprecation` | Fusion only supports the new behavior (hard error) |
| `GenerateSchemaNameNullValueDeprecation` | Fusion only supports the new behavior (hard error) |
| `SeedExceedsLimitSamePath` / `SeedIncreased` | Artifact of partial parsing, which Fusion does not use |
| `PackageInstallPathDeprecation` | Deprecation from 5+ years ago; not implemented |
| `InternalDeprecation` | Internal Python adapter API; not applicable to Fusion |
| `SourceFreshnessProjectHooksNotRun` | Fusion already runs hooks on source freshness; not needed |
| `SemanticValidationFailure` | Semantic models are not supported in Fusion |
| `ValidationWarning` | Fusion's strict YAML parsing already rejects invalid keys |
| `PackageMaterializationOverrideDeprecation` | Fusion enforces the new behavior; packages cannot override built-in materializations |
| `TestsConfigDeprecation` | No longer emitted by default; Fusion follows suit |
| `ProjectFlagsMovedDeprecation` | Fusion errors on this, modeling the newest dbt-Core behavior |
| `ConfigSourcePathDeprecation` / `ConfigLogPathDeprecation` / `ConfigTargetPathDeprecation` / `ConfigDataPathDeprecation` | Deprecations that happened far enough in the past to not be relevant |
| `EnvironmentVariableNamespaceDeprecation` | Fusion errors on environment variables starting with `DBT_ENGINE` |
| `UnusedTables` | Fusion does not allow source overrides |
| `WrongResourceSchemaFile` | Fusion emits `NoNodeForYamlKey` (dbt1005) instead, due to parallelism at parse time |

### Warnings that are hard errors in Fusion

Some <Constant name="core" /> warning names correspond to behaviors that <Constant name="fusion" /> enforces unconditionally as parse errors. If you reference these names in `warn_error_options`, <Constant name="fusion" /> emits a startup warning explaining that the entry has no effect. You can carry over your `warn_error_options` config from <Constant name="core" /> without breaking, but these configs do nothing:

| dbt-Core event name | Fusion behavior | Fusion error code |
|---|---|---|
| `DuplicateYAMLKeysDeprecation` | Fusion's YAML parser rejects duplicate keys as hard parse errors | `DuplicateConfigKey` (1059) |
| `CustomKeyInConfigDeprecation` | Unknown config keys are rejected via strict schema validation | `UnusedConfigKey` (1060) |
| `CustomTopLevelKeyDeprecation` | Unknown top-level schema keys are hard parse errors | `UnusedConfigKey` (1060) |
| `ResourceNamesWithSpacesDeprecation` | Resource names with spaces are rejected during name validation | `SchemaError` |
| `InvalidValueForField` | Field value failures are surfaced as hard parse errors via deserialization | `SerializationError` |
| `GenericJSONSchemaValidationDeprecation` | JSON schema validation failures are hard parse errors | `SerializationError` |
| `DuplicateNameDistinctNodeTypesDeprecation` | Caught as a hard error during node resolution | `SchemaError` |

### The `StaticAnalysis` warning group

When running in `baseline` mode, <Constant name="fusion" />'s SQL comprehension engine emits static analysis diagnostics (type errors, unresolved references, implicit coercions, etc.) as warnings. These are grouped under the `StaticAnalysis` category, which maps to all <Constant name="fusion" /> frontend warning codes below 1000.

You can promote all static analysis diagnostics to errors in CI using:

```yaml
flags:
  warn_error_options:
    error:
      - StaticAnalysis
```

Or use a numeric code range to target specific static analysis diagnostic types. See [Configuring `static_analysis`](/docs/fusion/new-concepts#configuring-static_analysis) for more on how static analysis modes work.

:::caution Enabling `--warn-error` with static analysis in `baseline` mode
If your project emits static analysis warnings and you use `--warn-error` (which promotes all warnings to errors), your project may fail unexpectedly. We recommend explicitly listing the warning categories you want to enforce rather than using `error: all` when `baseline` mode is active.
:::

### Deprecated `include` and `exclude` keys

The legacy `include` and `exclude` fields for `warn_error_options` (deprecated in dbt Core v1.8) are not supported in <Constant name="fusion" />. If you use them, <Constant name="fusion" /> emits a `WEOIncludeExcludeDeprecation` warning (code 1086) and ignores the deprecated keys. Migrate to `error`, `warn`, and `silence` instead:

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
