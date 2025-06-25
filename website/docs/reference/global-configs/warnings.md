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
  dbt --warn-error run
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

Warnings that should be treated as errors can be specified through `error` parameter. Warning names can be found in:
  - [dbt-core's types.py file](https://github.com/dbt-labs/dbt-core/blob/main/core/dbt/events/types.py), where each class name that inherits from `WarnLevel` corresponds to a warning name (e.g. `AdapterDeprecationWarning`, `NoNodesForSelectionCriteria`).
  - Using the `--log-format json` flag.

The `error` parameter can be set to `"all"` or `"*"` to treat all warnings as errors (this behavior is the same as using the `--warn-error` flag), or to a list of specific warning names to treat as exceptions.
- When `error` is set to `"all"` or `"*"`, the optional `warn` parameter can be set to exclude specific warnings from being treated as exceptions.
- Use the `silence` parameter to ignore warnings. To silence certain warnings you want to ignore, you can specify them in the `silence` parameter. This is useful in large projects where certain warnings aren't critical and can be ignored to keep the noise low and logs clean.

Here's how you can use the [`--warn-error-options`](#use---warn-error-options-for-targeted-warnings) flag to promote _specific_ warnings to errors:
- [Test warnings](/reference/resource-configs/severity) with the `--warn-error-options '{"error": ["LogTestResults"]}'` flag.
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
  dbt --warn-error-options '{"error": "all", "warn": ["NoNodesForSelectionCriteria"]}' run
  ```

- This command promotes all warnings to errors, except for deprecation warnings:
  ```text
  dbt --warn-error-options '{"error": "all", "warn": ["Deprecations"]}' run
  ```

- This command promotes only `NoNodesForSelectionCriteria` as an error:
  ```text
  dbt --warn-error-options '{"error": ["NoNodesForSelectionCriteria"]}' run
  ```

- This promotes only `NoNodesForSelectionCriteria` as an error, using an environment variable:
  ```text
  DBT_WARN_ERROR_OPTIONS='{"error": ["NoNodesForSelectionCriteria"]}' dbt run
  ```

Values for `error`, `warn`, and/or `silence` should be passed on as arrays. For example, `dbt --warn-error-options '{"error": "all", "warn": ["NoNodesForSelectionCriteria"]}' run` not `dbt --warn-error-options '{"error": "all", "warn": "NoNodesForSelectionCriteria"}' run`.

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
dbt --warn-error run 
dbt --warn-error-options '{"error": "all"}' run 
dbt --warn-error-options '{"error": "*"}' run 
```

##### using environment variables


```bash 
WARN_ERROR=true dbt run 
DBT_WARN_ERROR_OPTIONS='{"error": "all"}' dbt run 
DBT_WARN_ERROR_OPTIONS='{"error": "*"}' dbt run 
```

  
:::caution
Note, using `warn_error_options: error: "all"` will treat all current and future warnings as errors.

This means that if a new warning is introduced in a future version of <Constant name="core" />, your production job may start failing unexpectedly. We recommend proceeding with caution when doing this in production environments, and explicitly listing only the warnings you want to treat as errors in production.
:::
