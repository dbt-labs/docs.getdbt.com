---
title: "About flags (global configs)"
id: "about-global-configs"
sidebar: "About flags (global configs)"
pagination_next: null
description: "Configure dbt flags using dbt_project.yml, environment variables, and CLI options."
---

In dbt, "flags" (also called "global configs" and often configured with [environment variables](/reference/global-configs/environment-variable-configs)) are settings for fine-tuning _how_ dbt runs your project. They differ from [resource-specific configs](/reference/configs-and-properties) that tell dbt _what_ to run.

Flags control things like the visual output of logs, whether to treat specific warning messages as errors, or whether to "fail fast" after encountering the first error. Flags are "global" configs because they are available for all dbt commands and they can be set in multiple places.

You can use flags with the <Constant name="fusion_engine"/> or <Constant name="core"/> engine through the CLI during local development or in <Constant name="dbt_platform"/>.

There is a significant overlap between dbt's flags and dbt's command line options, but there are differences:
- Certain flags can only be set in [`dbt_project.yml`](/reference/dbt_project.yml) and cannot be overridden for specific invocations by using CLI options.
- If a CLI option is supported by specific commands, rather than supported by all commands ("global"), it is generally not considered to be a "flag".

You can configure flags in `dbt_project.yml`, environment variables, and CLI options. For details, refer to [environment variable configs](/reference/global-configs/environment-variable-configs).

### Setting flags

import SettingFlags from '/snippets/_setting-flags.md';

<SettingFlags />

### Accessing flags

Custom user-defined logic, written in Jinja, can check the values of flags using [the `flags` context variable](/reference/dbt-jinja-functions/flags).

```yaml
# dbt_project.yml

on-run-start:
  - '{{ log("I will stop at the first sign of trouble", info = true) if flags.FAIL_FAST }}'
```

## Available flags

Because the values of `flags` can differ across invocations, we strongly advise against using `flags` as an input to configurations or dependencies (`ref` + `source`) that dbt resolves [during parsing](/reference/parsing#known-limitations).

### Common flag examples

Use the `--target` flag to specify which target (environment) to use when running dbt commands. For example:

```bash
dbt run --target dev
dbt run --target prod
dbt build --target staging
```

The `--target` flag allows you to run the same dbt project against different environments without modifying your configuration files. Define the target in your `profiles.yml` file. Learn more about [connection profiles and targets](/docs/local/profiles.yml#understanding-targets-in-profiles).

Use this table to compare all available flags and how to configure them across interfaces:

- **<Constant name="dbt" /> CLI**: Indicates whether the flag is supported in the [<Constant name="dbt_platform" />-supported CLI](/docs/platform/cloud-cli-installation).
- **Type / default**: Shows the accepted value type and default.
- **In project**: Indicates whether you can set the flag in `dbt_project.yml`.
- **Env var**: Shows the corresponding environment variable name, when available. In general, v1.10 and earlier use the `DBT_` prefix, while v1.11+ uses the `DBT_ENGINE_` prefix.
- **CLI flags**: Lists command-line options for setting the flag for a specific invocation.

<VersionBlock lastVersion="1.10">


| Flag | <Constant name="dbt" /> CLI? | Type / default | In project? | Env var | <div style={{width:'200px'}}>CLI flags</div> |
|------|----------------|----------------|-------------|---------|-----------|
| [cache_selected_only](/reference/global-configs/cache) | ✅ | boolean <br /> default: False | ✅ | `DBT_CACHE_SELECTED_ONLY` | `--cache-selected-only` <br /> `--no-cache-selected-only` |
| [clean_project_files_only](/reference/commands/clean#--clean-project-files-only) | ❌ | boolean <br /> default: True | ❌ | `DBT_CLEAN_PROJECT_FILES_ONLY` | `--clean-project-files-only` <br /> `--no-clean-project-files-only` |
| [debug](/reference/global-configs/logs#debug-level-logging) | ✅ | boolean <br /> default: False | ✅ | `DBT_DEBUG` | `--debug` <br /> `--no-debug` |
| [defer](/reference/node-selection/defer) | ✅ (default) | boolean <br /> default: False | ❌ | `DBT_DEFER` | `--defer` <br /> `--no-defer` |
| [defer_state](/reference/node-selection/defer) | ❌ | path <br /> default: None | ❌ | `DBT_DEFER_STATE` | `--defer-state` |
| [favor_state](/reference/node-selection/defer#favor-state) | ✅ | boolean <br /> default: False | ❌ | `DBT_FAVOR_STATE` | `--favor-state` <br /> `--no-favor-state` |
| [empty](/docs/build/empty-flag) | ✅ | boolean <br /> default: False | ❌ | `DBT_EMPTY` | `--empty` <br /> `--no-empty` |
| [event_time_start](/reference/dbt-jinja-functions/model#batch-properties-for-microbatch-models) | ✅ | datetime <br /> default: None | ❌ | `DBT_EVENT_TIME_START` | `--event-time-start` |
| [event_time_end](/reference/dbt-jinja-functions/model#batch-properties-for-microbatch-models) | ✅ | datetime <br /> default: None | ❌ | `DBT_EVENT_TIME_END` | `--event-time-end` |
| [fail_fast](/reference/global-configs/failing-fast) | ✅ | boolean <br /> default: False | ✅ | `DBT_FAIL_FAST` | `--fail-fast` <br /> `-x` <br /> `--no-fail-fast` |
| [full_refresh](/reference/resource-configs/full_refresh) | ✅ | boolean <br /> default: False | ✅ (as resource config) | `DBT_FULL_REFRESH` | `--full-refresh` <br /> `--no-full-refresh` |
| [indirect_selection](/reference/node-selection/test-selection-examples#syntax-examples) | ❌ | enum <br /> default: eager | ✅ | `DBT_INDIRECT_SELECTION` | `--indirect-selection` |
| [introspect](/reference/commands/compile#introspective-queries) | ❌ | boolean <br /> default: True | ❌ | `DBT_INTROSPECT` | `--introspect` <br /> `--no-introspect` |
| [log_cache_events](/reference/global-configs/logs#logging-relational-cache-events) | ❌ | boolean <br /> default: False | ❌ | `DBT_LOG_CACHE_EVENTS` | `--log-cache-events` <br /> `--no-log-cache-events` |
| [log_format_file](/reference/global-configs/logs#log-formatting) | ❌ | enum <br /> default: default (text) | ✅ | `DBT_LOG_FORMAT_FILE` | `--log-format-file` |
| [log_format](/reference/global-configs/logs#log-formatting) | ❌ | enum <br /> default: default (text) | ✅ | `DBT_LOG_FORMAT` | `--log-format` |
| [log_level_file](/reference/global-configs/logs#log-level) | ❌ | enum <br /> default: debug | ✅ | `DBT_LOG_LEVEL_FILE` | `--log-level-file` |
| [log_level](/reference/global-configs/logs#log-level) | ❌ | enum <br /> default: info | ✅ | `DBT_LOG_LEVEL` | `--log-level` |
| [log_path](/reference/global-configs/logs) | ❌ | path <br /> default: None (uses `logs/`) | ❌ | `DBT_LOG_PATH` | `--log-path` |
| [partial_parse](/reference/global-configs/parsing#partial-parsing) | ✅ | boolean <br /> default: True | ✅ | `DBT_PARTIAL_PARSE` | `--partial-parse` <br /> `--no-partial-parse` |
| [populate_cache](/reference/global-configs/cache) | ✅ | boolean <br /> default: True | ✅ | `DBT_POPULATE_CACHE` | `--populate-cache` <br /> `--no-populate-cache` |
| [print](/reference/global-configs/print-output#suppress-print-messages-in-stdout) | ❌ | boolean <br /> default: True | ❌ | `DBT_PRINT` | `--print` <br /> `--no-print` |
| [printer_width](/reference/global-configs/print-output#printer-width) | ❌ | int <br /> default: 80 | ✅ | `DBT_PRINTER_WIDTH` | `--printer-width` |
| [profile](/docs/local/profiles.yml#about-profiles) | ❌ | string <br /> default: None | ✅ (as top-level key) | `DBT_PROFILE`  | [`--profile`](/docs/local/profiles.yml#overriding-profiles-and-targets) |
| [profiles_dir](/docs/local/profiles.yml#about-profiles) | ❌ | path <br /> default: None (current dir, then HOME dir) | ❌ | `DBT_PROFILES_DIR` | `--profiles-dir` |
| [project_dir](/reference/dbt_project.yml) | ❌ | path <br /> default: (empty) | ❌ | `DBT_PROJECT_DIR` | `--project-dir` |
| [quiet](/reference/global-configs/logs#suppress-non-error-logs-in-output) | ✅ | boolean <br /> default: False | ❌ | `DBT_QUIET` | `--quiet` |
| [resource-type](/reference/global-configs/resource-type) (v1.8+) | ✅ | string <br /> default: None | ❌ | `DBT_RESOURCE_TYPES` <br></br> `DBT_EXCLUDE_RESOURCE_TYPES` | `--resource-type` <br></br> `--exclude-resource-type` |
| [sample](/docs/build/sample-flag) | ✅ | string <br /> default: None | ❌ | `DBT_SAMPLE` | `--sample` |
| [send_anonymous_usage_stats](/reference/global-configs/usage-stats) | ❌ | boolean <br /> default: True | ✅ | `DBT_SEND_ANONYMOUS_USAGE_STATS` | `--send-anonymous-usage-stats` <br /> `--no-send-anonymous-usage-stats` |
| [source_freshness_run_project_hooks](/reference/global-configs/behavior-changes#source_freshness_run_project_hooks) | ❌ | boolean <br /> default: True | ✅ | ❌ | ❌ |
| [state](/reference/node-selection/defer) | ❌ | path <br /> default: none | ❌ | `DBT_STATE`, `DBT_DEFER_STATE` | `--state` <br /> `--defer-state` |
| [static_parser](/reference/global-configs/parsing#static-parser) | ❌ | boolean <br /> default: True | ✅ | `DBT_STATIC_PARSER` | `--static-parser` <br /> `--no-static-parser` |
| [store_failures](/reference/resource-configs/store_failures) | ✅ | boolean <br /> default: False | ✅ (as resource config) | `DBT_STORE_FAILURES` | `--store-failures` <br /> `--no-store-failures` |
| [target_path](/reference/global-configs/json-artifacts) | ❌ | path <br /> default: None (uses `target/`) | ❌ | `DBT_TARGET_PATH` | `--target-path` |
| [target](/docs/local/profiles.yml#about-profiles) | ❌ | string <br /> default: None | ❌ | `DBT_TARGET` | [`--target`](/docs/local/profiles.yml#overriding-profiles-and-targets) |
| [use_colors_file](/reference/global-configs/logs#color) | ❌ | boolean <br /> default: True | ✅ | `DBT_USE_COLORS_FILE` | `--use-colors-file` <br /> `--no-use-colors-file` |
| [use_colors](/reference/global-configs/print-output#print-color) | ❌ | boolean <br /> default: True | ✅ | `DBT_USE_COLORS` | `--use-colors` <br /> `--no-use-colors` |
| [use_experimental_parser](/reference/global-configs/parsing#experimental-parser) | ❌ | boolean <br /> default: False | ✅ | `DBT_USE_EXPERIMENTAL_PARSER` | `--use-experimental-parser` <br /> `--no-use-experimental-parser` |
| [version_check](/reference/global-configs/version-compatibility) | ❌ | boolean <br /> default: varies | ✅ | `DBT_VERSION_CHECK` | `--version-check` <br /> `--no-version-check` |
| [warn_error_options](/reference/global-configs/warnings) | ✅ | dict <br /> default: {} | ✅ | `DBT_WARN_ERROR_OPTIONS` | `--warn-error-options` |
| [warn_error](/reference/global-configs/warnings) | ✅ | boolean <br /> default: False | ✅ | `DBT_WARN_ERROR` | `--warn-error` |
| [write_json](/reference/global-configs/json-artifacts) | ✅ | boolean <br /> default: True | ✅ | `DBT_WRITE_JSON` | `--write-json` <br /> `--no-write-json` |


</VersionBlock>

<VersionBlock firstVersion="1.11">


| Flag | <Constant name="dbt" /> CLI? | Type / default | In project? | Env var | <div style={{width:'200px'}}>CLI flags</div> |
|------|----------------|----------------|-------------|---------|-----------|
| [cache_selected_only](/reference/global-configs/cache) | ✅ | boolean <br /> default: False | ✅ | `DBT_ENGINE_CACHE_SELECTED_ONLY` | `--cache-selected-only` <br /> `--no-cache-selected-only` |
| [clean_project_files_only](/reference/commands/clean#--clean-project-files-only) | ❌ | boolean <br /> default: True | ❌ | `DBT_ENGINE_CLEAN_PROJECT_FILES_ONLY` | `--clean-project-files-only` <br /> `--no-clean-project-files-only` |
| [debug](/reference/global-configs/logs#debug-level-logging) | ✅ | boolean <br /> default: False | ✅ | `DBT_ENGINE_DEBUG` | `--debug` <br /> `--no-debug` |
| [defer](/reference/node-selection/defer) | ✅ (default) | boolean <br /> default: False | ❌ | `DBT_ENGINE_DEFER` | `--defer` <br /> `--no-defer` |
| [defer_state](/reference/node-selection/defer) | ❌ | path <br /> default: None | ❌ | `DBT_ENGINE_DEFER_STATE` | `--defer-state` |
| [favor_state](/reference/node-selection/defer#favor-state) | ✅ | boolean <br /> default: False | ❌ | `DBT_ENGINE_FAVOR_STATE` | `--favor-state` <br /> `--no-favor-state` |
| [empty](/docs/build/empty-flag) | ✅ | boolean <br /> default: False | ❌ | `DBT_ENGINE_EMPTY` | `--empty` <br /> `--no-empty` |
| [event_time_start](/reference/dbt-jinja-functions/model#batch-properties-for-microbatch-models) | ✅ | datetime <br /> default: None | ❌ | `DBT_ENGINE_EVENT_TIME_START` | `--event-time-start` |
| [event_time_end](/reference/dbt-jinja-functions/model#batch-properties-for-microbatch-models) | ✅ | datetime <br /> default: None | ❌ | `DBT_ENGINE_EVENT_TIME_END` | `--event-time-end` |
| [fail_fast](/reference/global-configs/failing-fast) | ✅ | boolean <br /> default: False | ✅ | `DBT_ENGINE_FAIL_FAST` | `--fail-fast` <br /> `-x` <br /> `--no-fail-fast` |
| [full_refresh](/reference/resource-configs/full_refresh) | ✅ | boolean <br /> default: False | ✅ (as resource config) | `DBT_ENGINE_FULL_REFRESH` | `--full-refresh` <br /> `--no-full-refresh` |
| [indirect_selection](/reference/node-selection/test-selection-examples#syntax-examples) | ❌ | enum <br /> default: eager | ✅ | `DBT_ENGINE_INDIRECT_SELECTION` | `--indirect-selection` |
| [introspect](/reference/commands/compile#introspective-queries) | ❌ | boolean <br /> default: True | ❌ | `DBT_ENGINE_INTROSPECT` | `--introspect` <br /> `--no-introspect` |
| [log_cache_events](/reference/global-configs/logs#logging-relational-cache-events) | ❌ | boolean <br /> default: False | ❌ | `DBT_ENGINE_LOG_CACHE_EVENTS` | `--log-cache-events` <br /> `--no-log-cache-events` |
| [log_format_file](/reference/global-configs/logs#log-formatting) | ❌ | enum <br /> default: default (text) | ✅ | `DBT_ENGINE_LOG_FORMAT_FILE` | `--log-format-file` |
| [log_format](/reference/global-configs/logs#log-formatting) | ❌ | enum <br /> default: default (text) | ✅ | `DBT_ENGINE_LOG_FORMAT` | `--log-format` |
| [log_level_file](/reference/global-configs/logs#log-level) | ❌ | enum <br /> default: debug | ✅ | `DBT_ENGINE_LOG_LEVEL_FILE` | `--log-level-file` |
| [log_level](/reference/global-configs/logs#log-level) | ❌ | enum <br /> default: info | ✅ | `DBT_ENGINE_LOG_LEVEL` | `--log-level` |
| [log_path](/reference/global-configs/logs) | ❌ | path <br /> default: None (uses `logs/`) | ❌ | `DBT_ENGINE_LOG_PATH` | `--log-path` |
| [partial_parse](/reference/global-configs/parsing#partial-parsing) | ✅ | boolean <br /> default: True | ✅ | `DBT_ENGINE_PARTIAL_PARSE` | `--partial-parse` <br /> `--no-partial-parse` |
| [populate_cache](/reference/global-configs/cache) | ✅ | boolean <br /> default: True | ✅ | `DBT_ENGINE_POPULATE_CACHE` | `--populate-cache` <br /> `--no-populate-cache` |
| [print](/reference/global-configs/print-output#suppress-print-messages-in-stdout) | ❌ | boolean <br /> default: True | ❌ | `DBT_ENGINE_PRINT` | `--print` <br /> `--no-print` |
| [printer_width](/reference/global-configs/print-output#printer-width) | ❌ | int <br /> default: 80 | ✅ | `DBT_ENGINE_PRINTER_WIDTH` | `--printer-width` |
| [profile](/docs/core/connect-data-platform/connection-profiles#about-profiles) | ❌ | string <br /> default: None | ✅ (as top-level key) | `DBT_ENGINE_PROFILE`  | [`--profile`](/docs/core/connect-data-platform/connection-profiles#overriding-profiles-and-targets) |
| [profiles_dir](/docs/core/connect-data-platform/connection-profiles#about-profiles) | ❌ | path <br /> default: None (current dir, then HOME dir) | ❌ | `DBT_ENGINE_PROFILES_DIR` | `--profiles-dir` |
| [project_dir](/reference/dbt_project.yml) | ❌ | path <br /> default: (empty) | ❌ | `DBT_ENGINE_PROJECT_DIR` | `--project-dir` |
| [quiet](/reference/global-configs/logs#suppress-non-error-logs-in-output) | ✅ | boolean <br /> default: False | ❌ | `DBT_ENGINE_QUIET` | `--quiet` |
| [resource-type](/reference/global-configs/resource-type) (v1.8+) | ✅ | string <br /> default: None | ❌ | `DBT_ENGINE_RESOURCE_TYPES` <br></br> `DBT_ENGINE_EXCLUDE_RESOURCE_TYPES` | `--resource-type` <br></br> `--exclude-resource-type` |
| [sample](/docs/build/sample-flag) | ✅ | string <br /> default: None | ❌ | `DBT_ENGINE_SAMPLE` | `--sample` |
| [send_anonymous_usage_stats](/reference/global-configs/usage-stats) | ❌ | boolean <br /> default: True | ✅ | `DBT_ENGINE_SEND_ANONYMOUS_USAGE_STATS` | `--send-anonymous-usage-stats` <br /> `--no-send-anonymous-usage-stats` |
| [source_freshness_run_project_hooks](/reference/global-configs/behavior-changes#source_freshness_run_project_hooks) | ❌ | boolean <br /> default: True | ✅ | ❌ | ❌ |
| [sqlparse](/reference/global-configs/sqlparse) | ❌ | YAML map <br /> default: MAX_GROUPING_DEPTH and MAX_GROUPING_TOKENS set to null | ❌ | `DBT_ENGINE_SQLPARSE` | `--sqlparse` |
| [state](/reference/node-selection/defer) | ❌ | path <br /> default: none | ❌ | `DBT_ENGINE_STATE`, `DBT_ENGINE_DEFER_STATE` | `--state` <br /> `--defer-state` |
| [static_parser](/reference/global-configs/parsing#static-parser) | ❌ | boolean <br /> default: True | ✅ | `DBT_ENGINE_STATIC_PARSER` | `--static-parser` <br /> `--no-static-parser` |
| [store_failures](/reference/resource-configs/store_failures) | ✅ | boolean <br /> default: False | ✅ (as resource config) | `DBT_ENGINE_STORE_FAILURES` | `--store-failures` <br /> `--no-store-failures` |
| [target_path](/reference/global-configs/json-artifacts) | ❌ | path <br /> default: None (uses `target/`) | ❌ | `DBT_ENGINE_TARGET_PATH` | `--target-path` |
| [target](/docs/core/connect-data-platform/connection-profiles#about-profiles) | ❌ | string <br /> default: None | ❌ | `DBT_ENGINE_TARGET` | [`--target`](/docs/core/connect-data-platform/connection-profiles#overriding-profiles-and-targets) |
| [use_colors_file](/reference/global-configs/logs#color) | ❌ | boolean <br /> default: True | ✅ | `DBT_ENGINE_USE_COLORS_FILE` | `--use-colors-file` <br /> `--no-use-colors-file` |
| [use_colors](/reference/global-configs/print-output#print-color) | ❌ | boolean <br /> default: True | ✅ | `DBT_ENGINE_USE_COLORS` | `--use-colors` <br /> `--no-use-colors` |
| [use_experimental_parser](/reference/global-configs/parsing#experimental-parser) | ❌ | boolean <br /> default: False | ✅ | `DBT_ENGINE_USE_EXPERIMENTAL_PARSER` | `--use-experimental-parser` <br /> `--no-use-experimental-parser` |
| [version_check](/reference/global-configs/version-compatibility) | ❌ | boolean <br /> default: varies | ✅ | `DBT_ENGINE_VERSION_CHECK` | `--version-check` <br /> `--no-version-check` |
| [warn_error_options](/reference/global-configs/warnings) | ✅ | dict <br /> default: {} | ✅ | `DBT_ENGINE_WARN_ERROR_OPTIONS` | `--warn-error-options` |
| [warn_error](/reference/global-configs/warnings) | ✅ | boolean <br /> default: False | ✅ | `DBT_ENGINE_WARN_ERROR` | `--warn-error` |
| [write_json](/reference/global-configs/json-artifacts) | ✅ | boolean <br /> default: True | ✅ | `DBT_ENGINE_WRITE_JSON` | `--write-json` <br /> `--no-write-json` |

</VersionBlock>
