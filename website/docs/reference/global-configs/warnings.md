---
title: "Warnings"
id: "warnings"
sidebar: "Warnings"
toc_max_heading_level: 2
intro_text: "dbt's warnings can be converted to errors using the --warn-error flag to promote all warnings to errors or --warn-error-options for granular control through options."
---

Enabling `WARN_ERROR` config or setting the `--warn-error` flag will convert _all_ dbt warnings into errors. Any time dbt would normally warn, it will instead raise an error. Examples include `--select` criteria that selects no resources, deprecations, configurations with no associated models, invalid test configurations, or tests and freshness checks that are configured to return warnings.

You can use the `--warn-error` flag to promote all warnings to errors, such as:
* Test warnings (for example, `LogTestResults`)
* Jinja-level warnings (for example, `exceptions.warn`, or `JinjaLogWarning`)
* Selection issues (for example, `NoNodesForSelectionCriteria`)
* Adapter deprecation warnings (for example, `AdapterDeprecationWarning`)

Consider using [`--warn-error-options`](#use---warn-error-options-for-targeted-warnings) for more targeted control over which warnings are treated as errors.

<File name='Usage'>

```text
dbt --warn-error run
```

</File>

## Use `--warn-error-options` for targeted warnings

Converting any warnings to errors may suit your needs perfectly, but there may be some warnings you just don't care about, and some you care about a lot. The `WARN_ERROR_OPTIONS` config or `--warn-error-options` flag gives you more granular control over _exactly which types of warnings_ are treated as errors. 

:::info `WARN_ERROR` and `WARN_ERROR_OPTIONS` are mutually exclusive
`WARN_ERROR` and `WARN_ERROR_OPTIONS` are mutually exclusive. You can only specify one, even when you're specifying the config in multiple places (like env var or a flag), otherwise, you'll see a usage error.
:::

<VersionBlock lastVersion="1.7">

Warnings that should be treated as errors can be specified through `include` and/or `exclude` parameters. Warning names can be found in:
- [dbt-core's types.py file](https://github.com/dbt-labs/dbt-core/blob/main/core/dbt/events/types.py), where each class name that inherits from `WarnLevel` corresponds to a warning name (e.g. `AdapterDeprecationWarning`, `NoNodesForSelectionCriteria`) 
- Downloading the JSON output logs from a run and searching for the warning.

The `include` parameter can be set to "all" or "*" to treat all warnings as exceptions, or to a list of specific warning names to treat as exceptions. When include is set to "all" or "*", the optional exclude parameter can be set to exclude specific warnings from being treated as exceptions.

  :::caution Proceed with caution in production environments

  Using `warn_error_options: include: "all"` will treat _all_ current and future warnings as errors.

  This means that if a new warning is introduced in a future version of dbt Core, your production job may start failing unexpectedly. We recommend proceeding with caution when doing this in production environments, and explicitly listing only the warnings you want to treat as errors in production.

  :::

</VersionBlock>

<VersionBlock firstVersion="1.8">

- Warnings that should be treated as errors can be specified through `error` and/or `warn` parameters. Warning names can be found in:
- [dbt-core's types.py file](https://github.com/dbt-labs/dbt-core/blob/main/core/dbt/events/types.py), where each class name that inherits from `WarnLevel` corresponds to a warning name (e.g. `AdapterDeprecationWarning`, `NoNodesForSelectionCriteria`).
- Downloading the JSON output logs from a run and searching for the warning.

- The `error` parameter can be set to `"all"` or `"*"` to treat all warnings as exceptions (errors), or to a list of specific warning names to treat as exceptions. When `error` is set to `"all"` or `"*"`, the optional `warn` parameter can be set to exclude specific warnings from being treated as exceptions.
  :::caution Proceed with caution in production environments

  Using `warn_error_options: error: "all"` will treat _all_ current and future warnings as errors.

  This means that if a new warning is introduced in a future version of dbt Core, your production job may start failing unexpectedly. We recommend proceeding with caution when doing this in production environments, and explicitly listing only the warnings you want to treat as errors in production.

  :::

- Use the `silence` parameter to ignore warnings. For example, to silence deprecation warnings or certain warnings you want to ignore across your project, you can specify them in the `silence` parameter. This is useful in large projects where certain warnings aren't critical and can be ignored to keep the noise low and logs clean.

</VersionBlock>

## Configuration

You can configure warnings as errors, which can be set through command flags, environment variables, or configuration files like `dbt_project.yml` or `profiles.yml`.

<VersionBlock lastVersion="1.7"> 

- Promote all warnings to errors using `{"include": "all"}` or `--warn-error` flag.
- Promote some warnings to errors using `include`.
- Exclude warnings from being treated as errors using `exclude`.

In the following example, we're ignoring the [`NoNodesForSelectionCriteria` warning](https://github.com/dbt-labs/dbt-core/blob/main/core/dbt/events/types.py#L1227) in the `profiles.yml` file by adding it to the `exclude` parameter:

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

<VersionBlock firstVersion="1.8">
You can choose to:

- Promote all warnings to errors using `{"error": "all"}` or `--warn-error` flag.
- Promote some warnings to errors using `error` and optionally exclude others from being treated as errors with `warn`. `warn` tells dbt to continue treating the warnings as warnings.
- Ignore warnings using `silence`.

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

## Examples
Here are some examples that show you how to configure `warn_error_options` using flags or file-based configuration.

<!-- no toc -->
- [Promote all warnings to errors or target specific warnings](#promote-all-warnings-to-errors-or-target-specific-warnings) &mdash; Promote all warnings to errors or target specific warnings.
- [Ignore warnings in a YAML file](#ignore-warnings-in-a-yaml-file) &mdash; Ignores warnings using the in a YAML file.
- [Promote all warnings to errors](#promote-all-warnings-to-errors) &mdash; Promote all warnings to errors using the `WARN_ERROR` environment variable or `--warn-error` command flag.

### Promote all warnings to errors or target specific warnings
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

Values for `error`, `warn`, and/or `silence` should be passed on as arrays. For example, `dbt --warn-error-options '{"error": "all", "warn": ["NoNodesForSelectionCriteria"]}' run` not `dbt --warn-error-options '{"error": "all", "warn": "NoNodesForSelectionCriteria"}' run`.
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

</VersionBlock>
### Ignore warnings in a YAML file

<VersionBlock firstVersion="1.8">

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

<VersionBlock lastVersion="1.8">
The following example shows how to exclude warnings using the `exclude` parameter in the `profiles.yml` file:
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


### Promote all warnings to errors
Some additional examples of how to promote all warnings to errors using the `WARN_ERROR` environment variable or `--warn-error` command flag:

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
  
:::caution
Note, as mentioned earlier, using <VersionBlock firstVersion="1.8">`warn_error_options: error: "all"`</VersionBlock> <VersionBlock lastVersion="1.7">`warn_error_options: include: "all"`</VersionBlock> will treat all current and future warnings as errors.

This means that if a new warning is introduced in a future version of dbt Core, your production job may start failing unexpectedly. We recommend proceeding with caution when doing this in production environments, and explicitly listing only the warnings you want to treat as errors in production.
:::
