---
title: "Warnings"
id: "warnings"
sidebar: "Warnings"
---

Enabling `WARN_ERROR`config or setting the `--warn-error` flag will convert dbt warnings into errors. Any time dbt would normally warn, it will instead raise an error. Examples include `--select` criteria that selects no resources, deprecations, configurations with no associated models, invalid test configurations, or tests and freshness checks that are configured to return warnings.

 You would commonly use the `--warn-error` flag to promote test warnings from `severity: warn` to errors, but it actually affects all warning types, including:
* Test warnings (for example, `LogTestResults`)
* Jinja-level warnings (for example, `exceptions.warn`, or `JinjaLogWarning`)
* Selection issues (for example, `NoNodesForSelectionCriteria`)
* Adapter deprecation warnings (for example, `AdapterDeprecationWarning`)

Consider using [`--warn-error-options`](#using-warn_error_options-for-targeted-warnings) for more targeted control over which warnings are treated as errors.

<File name='Usage'>

```text
dbt --warn-error run
```

</File>


### Using `--warn-error-options` for targeted warnings

Converting any warnings to errors may suit your needs perfectly, but there may be some warnings you just don't care about, and some you care about a lot. The `WARN_ERROR_OPTIONS` config or `--warn-error-options` flag gives you more granular control over _exactly which types of warnings_ are treated as errors. 

:::info `WARN_ERROR` and `WARN_ERROR_OPTIONS` configs are mutually exclusive
`WARN_ERROR` and `WARN_ERROR_OPTIONS` configs are mutually exclusive. You can only specify one, even when you're specifying the config in multiple places (e.g. env var + CLI flag), otherwise, you'll see a usage error.
:::

<VersionBlock firstVersion="1.8">

- Warnings that should be treated as errors can be specified through `error` and/or `warn` parameters. Warning names can be found in [dbt-core's types.py file](https://github.com/dbt-labs/dbt-core/blob/main/core/dbt/events/types.py), where each class name that inherits from `WarnLevel` corresponds to a warning name (e.g. `AdapterDeprecationWarning`, `NoNodesForSelectionCriteria`).

- The `error` parameter can be set to `"all"` or `"*"` to treat all warnings as exceptions (errors), or to a list of specific warning names to treat as exceptions. When `error` is set to `"all"` or `"*"`, the optional `warn` parameter can be set to exclude specific warnings from being treated as exceptions.
  :::caution Proceed with caution in production environments

  Using `warn_error_options: error: "all"` will treat _all_ current and future warnings as errors.

  This means that if a new warning is introduced in a future version of dbt Core, your production job may start failing unexpectedly. We recommend proceeding with caution when doing this in production environments, and explicitly listing only the warnings you want to treat as errors in production.

  :::

- Use the `silence` parameter to ignore warnings through project flags, without needing to re-specify the silence list every time. For example, to silence deprecation warnings or certain warnings you want to ignore across your project, you can specify them in the `silence` parameter. This is useful in large projects where certain warnings aren't critical and can be ignored to keep the noise low and logs clean.

  In the following example, we're ignoring the [`NoNodesForSelectionCriteria` warning](https://github.com/dbt-labs/dbt-core/blob/main/core/dbt/events/types.py#L1227) in the `dbt_project.yml` file by adding it to the `silence` parameter:

  <File name='dbt_project.yml'>

  ```yaml
  name: "my_dbt_project"
  tests:
    +enabled: True
  flags:
    warn_error_options:
      error: # Previously called "include"
      warn: # Previously called "exclude"
      silence: # To silence or ignore warnings
        - NoNodesForSelectionCriteria
  ```

  </File>

</VersionBlock>

## Configuration

You can configure warnings as errors, which can be set through command flags, environment variables, or configuration files like `dbt_project.yml` or `profiles.yml`.

<VersionBlock lastVersion="1.7"> 

- Promote all warnings to errors using `{"include": "all"}` or `--warn-error-options` flag.
- Promote some warnings to errors using `include`.
- Exclude warnings from being treated as errors using `exclude`.

</VersionBlock>

<VersionBlock firstVersion="1.8">
You can choose to:

- Promote all warnings to errors using `{"error": "all"}` or `--warn-error` flag.
- Promote some warnings to errors using `error` and optionally exclude others from being treated as errors with `warn`. `warn` tells dbt to continue treating the warnings as warnings.
- Ignore warnings using `silence`.

</VersionBlock>

:::info `WARN_ERROR` and `WARN_ERROR_OPTIONS` are mutually exclusive
`WARN_ERROR` and `WARN_ERROR_OPTIONS` are mutually exclusive. You can only specify one, even when you're specifying the config in multiple places (like env var or a flag), otherwise, you'll see a usage error.
:::

To promote all warnings to errors, use the following:

#### dbt command flags

<VersionBlock lastVersion="1.7"> 

```bash 
dbt --warn-error run 
dbt --warn-error-options '{"include": "all"}' run 
dbt --warn-error-options '{"include": "*"}' run 
```
</VersionBlock> 

<VersionBlock firstVersion="1.8"> 

```bash 
dbt --warn-error run 
dbt --warn-error-options '{"error": "all"}' run 
dbt --warn-error-options '{"error": "*"}' run 
```
</VersionBlock>

#### Environment variables

<VersionBlock lastVersion="1.7"> 

```bash 
WARN_ERROR=true dbt run
DBT_WARN_ERROR_OPTIONS='{"include": "all"}' dbt run 
DBT_WARN_ERROR_OPTIONS='{"include": "*"}' dbt run 
```
</VersionBlock> 

<VersionBlock firstVersion="1.8"> 

```bash 
WARN_ERROR=true dbt run 
DBT_WARN_ERROR_OPTIONS='{"error": "all"}' dbt run 
DBT_WARN_ERROR_OPTIONS='{"error": "*"}' dbt run 
```

</VersionBlock>
  
Note, as mentioned earlier, using <VersionBlock firstVersion="1.8">`warn_error_options: error: "all"`</VersionBlock> <VersionBlock lastVersion="1.7">`warn_error_options: include: "all"`</VersionBlock> will treat all current and future warnings as errors.

This means that if a new warning is introduced in a future version of dbt Core, your production job may start failing unexpectedly. We recommend proceeding with caution when doing this in production environments, and explicitly listing only the warnings you want to treat as errors in production.

## Example
Here are some examples that show you how to configure `warn_error_options` using flags or file-based configuration.

Some of the examples use `NoNodesForSelectionCriteria`, which is a specific warning that occurs when your `--select` flag doesn't match any nodes/resources in your dbt project:

<VersionBlock firstVersion="1.8">

- This command promotes all warnings to errors:
  ```text
  dbt --warn-error-options '{"error": "all"}' run
  ```

- This command promotes all warnings to errors, except for `NoNodesForSelectionCriteria`:
  ```text
  dbt --warn-error-options '{"error": "all", "warn": ["NoNodesForSelectionCriteria"]}' run
  ```

- This command promotes only `NoNodesForSelectionCriteria` as an error:
  ```text
  dbt --warn-error-options '{"error": ["NoNodesForSelectionCriteria"]}' run
  ```

- This promotes only `NoNodesForSelectionCriteria` as an error, using an environment variable:
  ```text
  DBT_WARN_ERROR_OPTIONS='{"error": ["NoNodesForSelectionCriteria"]}' dbt run
  ```

The following example shows how to silence or ignore warnings using the `silence` parameter in the `profiles.yml` file:
  <File name='profiles.yml'>

  ```yaml
  config:
    warn_error_options:
      error: # Previously called "include"
      warn: # Previously called "exclude"
        - NoNodesForSelectionCriteria
      silence: # Silence or ignore warnings
        - NoNodesForSelectionCriteria
  ```

  </File>
</VersionBlock>

<VersionBlock lastVersion="1.7">
  
- This command promotes all warnings to errors:
  ```text
  dbt --warn-error-options '{"include": "all"}' run 
  ```

- This command promotes all warnings to errors, except for `NoNodesForSelectionCriteria`:
  ```text
  dbt --warn-error-options '{"include": "all", "exclude": ["NoNodesForSelectionCriteria"]}' run
  ```

- This command promotes only `NoNodesForSelectionCriteria` as an error:
  ```text
  dbt --warn-error-options '{"include": ["NoNodesForSelectionCriteria"]}' run
  ```

- This promotes only `NoNodesForSelectionCriteria` as an error, using an environment variable:
  ```text
  DBT_WARN_ERROR_OPTIONS='{"include": ["NoNodesForSelectionCriteria"]}' dbt run
  ```

Values for `error`, `warn`, and/or `silence` should be passed on as arrays. For example, `dbt --warn-error-options '{"error": "all", "warn": ["NoNodesForSelectionCriteria"]}' run` not `dbt --warn-error-options '{"error": "all", "warn": "NoNodesForSelectionCriteria"}' run`.

<File name='profiles.yml'>

```yaml
config:
  warn_error_options:
    include: all
    exclude: 
      - NoNodesForSelectionCriteria
```

</File>

</VersionBlock>


