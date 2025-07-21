---
title: "Deprecations"
---

:::note

Deprecated functionality still works in the v1.10 release, but it is no longer supported and will be removed in a future version.  

This means the deprecated features only present a warning but don't prevent runs and other commands (unless you've configured [warnings as errors](/reference/global-configs/warnings)). 

When the functionality is eventually removed, it will cause errors in your dbt runs after you upgrade if the deprecations are not addressed.


:::

As dbt runs, it generates different categories of [events](/reference/events-logging), one of which is _deprecations_. Deprecations are a special type of warning that lets you know that there are problems in parts of your project that will result in breaking changes in a future version of dbt. Although it’s just a warning for now, it is important to resolve any deprecation warnings in your project to enable you to work with more safety, feedback, and confidence going forward.

## Identify deprecation warnings

Finding deprecations that impact your code can be a daunting task when looking at the standard logs. Identifying them is the first step towards remediation. There are several methods for quickly locating deprecations and automatically remediating some of them.

### dbt CLI

To view deprecations from your CLI, run:

```bash
dbt parse --no-partial-parse --show-all-deprecations
```

The `--no-partial-parse` flag ensures that even deprecations only picked up during parsing are included. The `--show-all-deprecations` flag ensures that each occurence of the deprecations is listed instead  of just the first.

```bash

19:15:13 [WARNING]: Deprecated functionality
Summary of encountered deprecations:
- MFTimespineWithoutYamlConfigurationDeprecation: 1 occurrence

```

### The dbt platform

If you're using <Constant name="cloud" />, you can view deprecation warnings from the **Dashboard** area of your account.

    <Lightbox src="/img/docs/dbt-cloud/deprecation-warnings.png" title="The deprecation warnings listed on the dbt dashboard." />

Click into a job to view more details and locate the deprecation warnings in the logs (or run the `parse` command with flags from the <Constant name="cloud_ide" /> or <Constant name="cloud_cli" />).

    <Lightbox src="/img/docs/dbt-cloud/deprecation-list.png" title="Deprecation warnings listed in the logs." />

### Automatic remediation

Some deprecations can be automatically fixed with a script. Read more about it in [this dbt blog post](https://www.getdbt.com/blog/how-to-get-ready-for-the-new-dbt-engine#:~:text=2.%20Resolve%20deprecation%20warnings). [Download the script](https://github.com/dbt-labs/dbt-autofix) and follow the installation instructions to get started. 

**Coming soon**: The IDE will soon have an interface for running this same script to remediate deprecation warnings in <Constant name="cloud" />.


## List of Deprecation Warnings

The following are deprecation warnings in dbt today and the associated version number in which they first appear.

### ConfigDataPathDeprecation

In [dbt v1.0](/docs/dbt-versions/core-upgrade/Older%20versions/upgrading-to-v1.0) `data-paths` has been renamed to [seed-paths](/reference/project-configs/model-paths). If you receive this deprecation warning, it means that `data-paths` is still being used in your project's `dbt_project.yml`.

Example warning:

<File name='CLI'>
```bash
23:14:58  [WARNING]: Deprecated functionality
The `data-paths` config has been renamed to `seed-paths`. Please update your
`dbt_project.yml` configuration to reflect this change.
```
</File>

#### ConfigDataPathDeprecation warning resolution

Change `data-paths` to `seed-paths` in your `dbt_project.yml`.

### ConfigLogPathDeprecation

[dbt v1.5](/docs/dbt-versions/core-upgrade/Older%20versions/upgrading-to-v1.5) specifying `log-path` in `dbt_project.yml` was deprecated. Receiving this deprecation warning means that `log-path` is still specified in your `dbt_project.yml` and it's not set to the default value `logs`.

Example:

<File name='CLI'>
```bash
23:39:18  [WARNING]: Deprecated functionality
The `log-path` config in `dbt_project.yml` has been deprecated and will no
longer be supported in a future version of dbt-core. If you wish to write dbt
logs to a custom directory, please use the --log-path CLI flag or DBT_LOG_PATH
env var instead.
```
</File>

#### ConfigLogPathDeprecation warning resolution

Remove `log-path` from your `dbt_project.yml` and specify it via either the CLI flag `--log-path` or environment variable `DBT_LOG_PATH`  [as documented here](/reference/global-configs/logs#log-and-target-paths)


### ConfigSourcePathDeprecation

In [dbt v1.0](/docs/dbt-versions/core-upgrade/Older%20versions/upgrading-to-v1.0) `source-paths` has been renamed to [model-paths](/reference/project-configs/model-paths). Receiving this deprecation warning means that `source-paths` is still being used in your project's `dbt_project.yml`.

Example: 

<File name='CLI'>
```bash
23:03:47  [WARNING]: Deprecated functionality
The `source-paths` config has been renamed to `model-paths`. Please update your
`dbt_project.yml` configuration to reflect this change.
23:03:47  Registered adapter: postgres=1.9.0
```
</File>

#### ConfigSourcePathDeprecation warning resolution

Change `source-paths` to `model-paths` in your `dbt_project.yml`.

### ConfigTargetPathDeprecation

In [dbt 1.5](/docs/dbt-versions/core-upgrade/Older%20versions/upgrading-to-v1.5) specifying  `target-path` in `dbt_project.yml` was deprecated. Receiving this deprecation warning means that `target-path` is still specified in your `dbt_project.yml` and it's not set to the default value, `target`.

Example:

<File name='CLI'>
```bash
23:22:01  [WARNING]: Deprecated functionality
The `target-path` config in `dbt_project.yml` has been deprecated and will no
longer be supported in a future version of dbt-core. If you wish to write dbt
artifacts to a custom directory, please use the --target-path CLI flag or
DBT_TARGET_PATH env var instead.
```
</File>

#### ConfigTargetPathDeprecation warning resolution

Remove `target-path` from your `dbt_project.yml` and specify it via either the CLI flag `--target-path` or environment variable [`DBT_TARGET_PATH`](/reference/global-configs/logs#log-and-target-paths).

### CustomOutputPathInSourceFreshnessDeprecation

dbt has deprecated the `--output` (or `-o`) flag for overriding the location of source freshness results from the `sources.json` file destination.

#### CustomOutputPathInSourceFreshnessDeprecation warning resolution

Remove the `--output` or `-o` flag and associated path configuration from any jobs running dbt source freshness commands.
There is no alternative for changing the location of only the source freshness results. However, you can still use `--target-path` to write _all_ artifacts from the step to a custom location.

### ExposureNameDeprecation

#### Description

In [dbt 1.3](/docs/dbt-versions/core-upgrade/Older%20versions/upgrading-to-v1.3#new-and-changed-documentation), dbt began allowing only letters, numbers, and underscores in the `name` property of [exposures](/reference/exposure-properties).

Example:

<File name='CLI'>
```bash
23:55:00  [WARNING]: Deprecated functionality
Starting in v1.3, the 'name' of an exposure should contain only letters,
numbers, and underscores. Exposures support a new property, 'label', which may
contain spaces, capital letters, and special characters. stg_&customers does not
follow this pattern. Please update the 'name', and use the 'label' property for
a human-friendly title. This will raise an error in a future version of
dbt-core.
```
</File>

#### ExposureNameDeprecation warning resolution

Ensure your exposure names only contain letters, numbers, and underscores. A more human-readable name can be put in the [`label`](/reference/exposure-properties#overview) property of exposures.

### GenericJSONSchemaValidationDeprecation


This deprecation type is a catch-all/fallback. dbt attempts to handle all JSON schema validation errors with specific deprecation event types, but it is possible that we missed something. Missing something means that either dbt failed to handle a specific case with a deprecation event _or_ the JSON schema is incorrect in a particular area.

#### GenericJSONSchemaValidationDeprecation warning resolution

If you are seeing this warning, unfortunately, there isn't much you can do at this time, but we are continuing to work on reducing instances of this deprecation. If you would like guidance on a specific instance you are seeing, please [contact support](mailto:support@getdbt.com) (available for cloud-based dbt platform customers) or the [community Slack](https://www.getdbt.com/community) (for dbt Core users).

### MFCumulativeTypeParamsDeprecation

In dbt [v1.9](/docs/dbt-versions/core-upgrade/upgrading-to-v1.9) implementing `window` and `time_to_grain` directly on the `type_params` of a [metric](/reference/global-configs/behavior-changes#cumulative-metrics) was deprecated. 

Example:

<File name='CLI'>
```bash
15:36:22  [WARNING]: Cumulative fields `type_params.window` and
`type_params.grain_to_date` has been moved and will soon be deprecated. Please
nest those values under `type_params.cumulative_type_params.window` and
`type_params.cumulative_type_params.grain_to_date`. See documentation on
behavior changes:
https://docs.getdbt.com/reference/global-configs/behavior-changes.
```
</File>

#### MFCumulativeTypeParamsDeprecation warning resolution

Nest your `window` and `time_to_grain` under the `cumulative_type_params` property within the `type_params` of the relevant metric.

### MFTimespineWithoutYamlConfigurationDeprecation

Before dbt v1.9, the MetricFlow time spine configuration was stored in a `metricflow_time_spine.sql` file. In [v1.9](/docs/dbt-versions/core-upgrade/upgrading-to-v1.9) dbt introduced the [YAML timespine defintion](/docs/build/metricflow-time-spine#configuring-time-spine-in-yaml) for MetricFlow. It was then decided that it would be the standard going forward. If you see this deprecation warning, you don't have a YAML timespine definition for Metricflow.

Example:

<File name='CLI'>
```bash
19:56:41  [WARNING]: Time spines without YAML configuration are in the process of
deprecation. Please add YAML configuration for your 'metricflow_time_spine'
model. See documentation on MetricFlow time spines:
https://docs.getdbt.com/docs/build/metricflow-time-spine and behavior change
documentation:
https://docs.getdbt.com/reference/global-configs/behavior-changes
```
</File>

#### MFTimespineWithoutYamlConfigurationDeprecation warning resolution

Define your MetricFlow timespine in [YAML](/docs/build/metricflow-time-spine#creating-a-time-spine-table).

### MissingPlusPrefixDeprecation

import MissingPrefix from '/snippets/_missing-prefix.md';

<MissingPrefix />

Example: 
<File name='CLI'>
```bash
18:16:06  [WARNING][MissingPlusPrefixDeprecation]: Deprecated functionality
Missing '+' prefix on `tags` found at `my_path.sub_path.another_path.tags` in
file `dbt_project.yml`. Hierarchical config
values without a '+' prefix are deprecated in dbt_project.yml.
```
</File>

#### MissingPlusPrefixDeprecation warning resolution

If you previously set one of the impacted configurations without a `+`, such as `materialized`:

<File name='dbt_project.yml'>

```yaml
models: 
  marts:
    materialized: table
```

</File>

You should now set it with the `+` prefix to disambiguate between paths:

<File name='dbt_project.yml'>

```yaml
models: 
  marts:
    +materialized: table
```

</File>

### ModelParamUsageDeprecation

The `--models` / `--model` / `-m` flag was renamed to `--select` / `--s` way back in dbt Core v0.21 (Oct 2021). Silently skipping this flag means ignoring your command's selection criteria, which could mean building your entire DAG when you only meant to select a small subset. For this reason, the `--models` / `--model` / `-m` flag will raise a warning in dbt Core v1.10, and an error in Fusion. Please update your job definitions accordingly.

#### ModelParamUsageDeprecation warning resolution

Update your job definitions and remove the `--models` / `--model` / `-m` flag and replace it with `--select` / `--s`.

### PackageInstallPathDeprecation

The default location where packages are installed when running `dbt deps` has been updated from `dbt_modules` to `dbt_packages`. During a `dbt clean` dbt detected that `dbt_modules` is defined in the [clean-targets](/reference/project-configs/clean-targets) property in `dbt_project.yml` even though `dbt_modules` is not the [`packages-install-path`](/reference/project-configs/packages-install-path).

Example:

<File name='CLI'>
```bash
22:48:01  [WARNING]: Deprecated functionality
The default package install path has changed from `dbt_modules` to
`dbt_packages`. Please update `clean-targets` in `dbt_project.yml` and
check `.gitignore`. Or, set `packages-install-path: dbt_modules`
If you'd like to keep the current value.
```
</File>

#### PackageInstallPathDeprecation warning resolution

The following are recommended approaches:
1. Replace `dbt_modules` with `dbt_packages` in your `clean-targets` spec (and `.gitignore`).
2. Set `packages-install-path: dbt_modules` if you want to keep having packages installed in `dbt_modules`.

### PackageMaterializationOverrideDeprecation

The behavior where installed packages could override built-in materializations without your explicit opt-in is deprecated. Setting the [`require_explicit_package_overrides_for_builtin_materializations` flag](/reference/global-configs/behavior-changes#package-override-for-built-in-materialization) to `false` in your `dbt_project.yml` allowed packages that matched the name of a built-in materialization to continue to be included in the search and resolution order.

#### PackageMaterializationOverrideDeprecation warning resolution

Explicitly override built-in materializations, in favor of a materialization defined in a package, by reimplementing the built-in materialization in your root project and wrapping the package implementation.

For example: 

```jinja

{% materialization table, snowflake %}
    {{ return (package_name.materialization_table_snowflake()) }}
{% endmaterialization %}

```

Once you've added the override for your package, remove the `require_explicit_package_overrides_for_builtin_materializations: false` flag from your `dbt_project.yml` to resolve the warning.

### PackageRedirectDeprecation

This deprecation warning means a package currently used in your project, defined in `packages.yml`, has been renamed. This generally happens when the ownership of a package has changed or the scope of the package has changed. It is likely that the package currently referenced in your `packages.yml` has stopped being actively maintained (as development has been moved to the new package name), and at some point, the named package will cease working with dbt.

<File name='CLI'>
```bash
22:31:38  [WARNING]: Deprecated functionality
The `fishtown-analytics/dbt_utils` package is deprecated in favor of
`dbt-labs/dbt_utils`. Please update your `packages.yml` configuration to use
`dbt-labs/dbt_utils` instead.
```
</File>

#### PackageRedirectDeprecation warning resolution

Begin referencing the new package in your `packages.yml` instead of the old package.

### ProjectFlagsMovedDeprecation

The `config` property that had been configurable in `profiles.yml` was deprecated in favor of `flags` in the `dbt_project.yaml`. If you see this deprecation warning, dbt detected the `config` property in your `profiles.yml`.

Example:

<File name='CLI'>
```bash
00:08:12  [WARNING]: Deprecated functionality
User config should be moved from the 'config' key in profiles.yml to the 'flags' key in dbt_project.yml.
```
</File>

#### ProjectFlagsMovedDeprecation warning resolution

Remove `config` from `profiles.yml`. Add any previous [`config`](/reference/global-configs/about-global-configs) in `profiles.yml` to `flags` in `dbt_project.yml`.

### PropertyMovedToConfigDeprecation 

Some historical properties are moving entirely to configs.

This will include: `freshness`, `meta`, `tags`, `docs`, `group`, and `access`

Changing certain properties to configs is beneficial because you can set them for many resources at once in `dbt_project.yml` (project-level/folder-level defaults). More info on the difference between properties and configs [here](/reference/configs-and-properties).

#### PropertyMovedToConfigDeprecation warning resolution

If you previously set one of the impacted properties, such as `freshness`:

```yaml

sources: 
  - name: ecom
    schema: raw
    description: E-commerce data for the Jaffle Shop
    freshness:
      warn_after:
        count: 24
        period: hour

```

You should now set it under `config`:

```yaml

sources: 
  - name: ecom
    schema: raw
    description: E-commerce data for the Jaffle Shop
    config:
      freshness:
        warn_after:
          count: 24
          period: hour

```

### ResourceNamesWithSpacesDeprecation

In [dbt 1.8](/docs/dbt-versions/core-upgrade/upgrading-to-v1.8#managing-changes-to-legacy-behaviors), allowing resource names to have spaces in them was deprecated. If you get this deprecation warning, dbt detected a resource name with a space in it.

Example: 

<File name='CLI'>
```bash
16:37:58  [WARNING]: Found spaces in the name of `model.jaffle_shop.stg supplies`
```
</File>

#### ResourceNamesWithSpacesDeprecation warning resolution

Rename the resource in violation so it no longer contains a space in its name.

### SourceFreshnessProjectHooksNotRun

If you are seeing this, it means that the behavior flag `source_freshness_run_project_hooks` is set to `false` and either `on-run-start` or `on-run-end` is defined ([docs](/reference/global-configs/behavior-changes#project-hooks-with-source-freshness)). Previously, project hooks wouldn't be run on sources when `dbt source freshness` was run. 

Example: 

<File name='CLI'>
```bash
19:51:56  [WARNING]: In a future version of dbt, the `source freshness` command
will start running `on-run-start` and `on-run-end` hooks by default. For more
information: https://docs.getdbt.com/reference/global-configs/legacy-behaviors
```
</File>

#### SourceFreshnessProjectHooksNotRun warning resolution

Set `source_freshness_run_project_hooks` to `true`. For instructions on skipping project hooks during a `dbt source freshness` invocation, check out the [behavior change documentation](/reference/global-configs/behavior-changes#project-hooks-with-source-freshness).

### UnexpectedJinjaBlockDeprecation

If you have an unexpected Jinja block - an orphaned Jinja block or a Jinja block outside of a macro context - you will receive a warning, and in a future version, dbt will stop supporting unexpected Jinja blocks. Previously, these unexpected Jinja blocks were silently ignored.

<File name='macros/my_macro.sql'>

```sql

{% endmacro %} # orphaned endmacro jinja block

{% macro hello() %}
hello!
{% endmacro %}

```
</File>

#### UnexpectedJinjaBlockDeprecation warning resolution

Delete the unexpected Jinja blocks.

### WEOIncludeExcludeDeprecation

The `include` and `exclude` options for `warn_error_options` have been deprecated and replaced with `error` and `warn`, respectively.

#### WEOIncludeExcludeDeprecation warning resolution

Anywhere `warn_error_options` is configured, replace:
- `include` with `error`
- `exclude` with `warn`

For example:

```yaml
...
  flags:
    warn_error_options:
      include:
        - NoNodesForSelectionCriteria
```

Should now be configured as:

```yaml
...
  flags:
    warn_error_options:
      error:
        - NoNodesForSelectionCriteria
```
