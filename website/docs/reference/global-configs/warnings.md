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
      - 1088   # Package update available (informational)
```

A subset of legacy <Constant name="core" /> event names are also accepted as aliases and mapped to their corresponding <Constant name="fusion" /> codes. Any value that is not a recognized numeric code, supported legacy event name, or supported group (`all`, `*`) causes <Constant name="fusion" /> to exit with an error at startup. This is a deliberate change from <Constant name="core" />, which silently ignored unknown values.

### Supported legacy dbt-Core event name aliases

The following <Constant name="core" /> event names are recognized by Fusion and map to specific <Constant name="fusion" /> warning codes. You can use either the event name or the numeric code in your `warn_error_options` configuration:

| dbt-Core event name | Fusion code | Description |
|---|---|---|
| `NoNodesForSelectionCriteria` | 1600 | `--select` criteria matched no nodes |
| `NoNodesSelected` | 1601 | No nodes selected |
| `NothingToDo` | 1601 | No nodes selected (alias) |
| `NodeNotFoundOrDisabled` | 1087 | A test or exposure dependency references a missing or disabled node |
| `DeprecatedModel` | — | A model marked as deprecated is referenced |
| `DeprecatedReference` | — | A reference to a deprecated model is made |
| `UpcomingReferenceDeprecation` | — | A model with a future deprecation date is referenced |
| `JinjaLogWarning` | 1074 | Jinja `exceptions.warn()` called in a macro |
| `SnapshotTimestampWarning` | 1075 | Snapshot timestamp column type mismatch |
| `PackageRedirectDeprecation` | 1076 | A package has been redirected to a new name |
| `DepsUnpinned` | — | A git dependency uses an unpinned ref (`HEAD`, `main`, or `master`) |
| `FreshnessConfigProblem` | 1078 | Source has no freshness configuration |
| `WarnStateTargetEqual` | 1084 | State and target directories are the same |
| `PackageNodeDependsOnRootProjectNode` | 1085 | A package node references a root-project node |
| `WEOIncludeExcludeDeprecation` | 1086 | Deprecated `include`/`exclude` keys used in `warn_error_options` |
| `LogTestResult` | — | A test result (pass/warn/fail) is logged |

### Unsupported Core event names

When you reference a <Constant name="core" /> event name that <Constant name="fusion" /> will never support, <Constant name="fusion" /> emits a startup warning explaining why and prompts you to remove the entry. These names are recognized but intentionally have no effect in <Constant name="fusion" /> because the underlying behavior has either been removed, replaced, or is enforced unconditionally:

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

### Fusion native warnings

<Constant name="fusion" /> introduces warnings with no equivalent in <Constant name="core" />. These are configurable via `warn_error_options` using their numeric codes:

| Warning | Code | Description |
|---|---|---|
| `PackageDbtVersionIncompatible` | — | A package declares a `require-dbt-version` constraint that excludes Fusion 2.x. Fusion warns instead of hard-erroring to avoid blocking adoption of packages written for Core 1.x. Promote to error with `warn_error_options` if you want to enforce strict compatibility. |
| `DepsFoundDuplicatePackage` | — | A duplicate package name was found in dependencies. Fusion silently picks the first entry; this warning surfaces the conflict. |
| `PackageParsingCompatibility` | — | A dependency package contains YAML that Fusion cannot parse (strict key or schema violations that <Constant name="core" /> silently ignored). The first failure per package per invocation is shown as a rollup; use `--show-all-deprecations` to see individual failures. |
| `StaticAnalysisDeprecation` | 1703 | A deprecated `static_analysis:` value (`on` or `unsafe`) was used in project config, node config, or CLI arguments. Scheduled removal May 2026; use `strict` instead. |

**Note:** `DepsNotifyUpdatesAvailable` (newer package version available) was downgraded from a warning to an informational log in <Constant name="fusion" />. It is no longer configurable via `warn_error_options`.

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
