---
title: "Behavior changes"
id: "behavior-changes"
sidebar: "Behavior changes"
---

import StateModified from '/snippets/_state-modified-compare.md';

Most flags exist to configure runtime behaviors with multiple valid choices. The right choice may vary based on the environment, user preference, or the specific invocation.

Another category of flags provides existing projects with a migration window for runtime behaviors that are changing in newer releases of dbt. These flags help us achieve a balance between these goals, which can otherwise be in tension, by:
- Providing a better, more sensible, and more consistent default behavior for new users/projects.
- Providing a migration window for existing users/projects &mdash; nothing changes overnight without warning.
- Providing maintainability of dbt software. Every fork in behavior requires additional testing & cognitive overhead that slows future development. These flags exist to facilitate migration from "current" to "better," not to stick around forever.

These flags go through three phases of development:
1. **Introduction (disabled by default):** dbt adds logic to support both 'old' and 'new' behaviors. The 'new' behavior is gated behind a flag, disabled by default, preserving the old behavior.
2. **Maturity (enabled by default):** The default value of the flag is switched, from `false` to `true`, enabling the new behavior by default. Users can preserve the 'old' behavior and opt out of the 'new' behavior by setting the flag to `false` in their projects. They may see deprecation warnings when they do so.
3. **Removal (generally enabled):** After marking the flag for deprecation, we remove it along with the 'old' behavior it supported from the dbt codebases. We aim to support most flags indefinitely, but we're not committed to supporting them forever. If we choose to remove a flag, we'll offer significant advance notice.

## What is a behavior change?

The same dbt project code and the same dbt commands return one result before the behavior change, and they return a different result after the behavior change.

Examples of behavior changes:
- dbt begins raising a validation _error_ that it didn't previously.
- dbt changes the signature of a built-in macro. Your project has a custom reimplementation of that macro. This could lead to errors, because your custom reimplementation will be passed arguments it cannot accept.
- A dbt adapter renames or removes a method that was previously available on the `{{ adapter }}` object in the dbt-Jinja context.
- dbt makes a breaking change to contracted metadata artifacts by deleting a required field, changing the name or type of an existing field, or removing the default value of an existing field ([README](https://github.com/dbt-labs/dbt-core/blob/37d382c8e768d1e72acd767e0afdcb1f0dc5e9c5/core/dbt/artifacts/README.md#breaking-changes)).
- dbt removes one of the fields from [structured logs](/reference/events-logging#structured-logging).

The following are **not** behavior changes:
- Fixing a bug where the previous behavior was defective, undesirable, or undocumented.
- dbt begins raising a _warning_ that it didn't previously.
- dbt updates the language of human-friendly messages in log events.
- dbt makes a non-breaking change to contracted metadata artifacts by adding a new field with a default, or deleting a field with a default ([README](https://github.com/dbt-labs/dbt-core/blob/37d382c8e768d1e72acd767e0afdcb1f0dc5e9c5/core/dbt/artifacts/README.md#non-breaking-changes)).

The vast majority of changes are not behavior changes. Because introducing these changes does not require any action on the part of users, they are included in continuous releases of dbt Cloud and patch releases of dbt Core.

By contrast, behavior change migrations happen slowly, over the course of months, facilitated by behavior change flags. The flags are loosely coupled to the specific dbt runtime version. By setting flags, users have control over opting in (and later opting out) of these changes.

## Behavior change flags

These flags _must_ be set in the `flags` dictionary in `dbt_project.yml`. They configure behaviors closely tied to project code, which means they should be defined in version control and modified through pull or merge requests, with the same testing and peer review.

The following example displays the current flags and their current default values in the latest dbt Cloud and dbt Core versions. To opt out of a specific behavior change, set the values of the flag to `False` in `dbt_project.yml`. You will continue to see warnings for legacy behaviors you’ve opted out of, until you either:

- Resolve the issue (by switching the flag to `True`)
- Silence the warnings using the `warn_error_options.silence` flag

Here's an example of the available behavior change flags with their default values:

<File name='dbt_project.yml'>

```yml
flags:
  require_explicit_package_overrides_for_builtin_materializations: False
  require_model_names_without_spaces: False
  source_freshness_run_project_hooks: False
  restrict_direct_pg_catalog_access: False
  require_yaml_configuration_for_mf_time_spines: False
  require_batched_execution_for_custom_microbatch_strategy: False
```

</File>

This table outlines which month of the "Latest" release track in dbt Cloud and which version of dbt Core contains the behavior change's introduction (disabled by default) or maturity (enabled by default).

| Flag                                                            | dbt Cloud "Latest": Intro | dbt Cloud "Latest": Maturity | dbt Core: Intro | dbt Core: Maturity | 
|-----------------------------------------------------------------|------------------|---------------------|-----------------|--------------------|
| [require_explicit_package_overrides_for_builtin_materializations](#package-override-for-built-in-materialization) | 2024.04          | 2024.06             | 1.6.14, 1.7.14  | 1.8.0             |
| [require_resource_names_without_spaces](#no-spaces-in-resource-names)                           | 2024.05          | TBD*                | 1.8.0           | 1.10.0             |
| [source_freshness_run_project_hooks](#project-hooks-with-source-freshness)                              | 2024.03          | TBD*                | 1.8.0           | 1.10.0             |
| [Redshift] [restrict_direct_pg_catalog_access](/reference/global-configs/redshift-changes#the-restrict_direct_pg_catalog_access-flag)    | 2024.09          | TBD*                | dbt-redshift v1.9.0           | 1.9.0             |
| [skip_nodes_if_on_run_start_fails](#failures-in-on-run-start-hooks)                                | 2024.10          | TBD*                | 1.9.0           | TBD*              |
| [state_modified_compare_more_unrendered_values](#source-definitions-for-state)                   | 2024.10          | TBD*                | 1.9.0           | TBD*              |
| [require_yaml_configuration_for_mf_time_spines](#metricflow-time-spine-yaml)                  | 2024.10          | TBD*                | 1.9.0           | TBD*              |
| [require_batched_execution_for_custom_microbatch_strategy](#custom-microbatch-strategy)                  | 2024.11         | TBD*                | 1.9.0           | TBD*              |
| [cumulative_type_params](#cumulative-metrics-parameter)         |   2024.11         | TBD*                 | 1.9.0           | TBD*            |

When the dbt Cloud Maturity is "TBD," it means we have not yet determined the exact date when these flags' default values will change. Affected users will see deprecation warnings in the meantime, and they will receive emails providing advance warning ahead of the maturity date. In the meantime, if you are seeing a deprecation warning, you can either:
- Migrate your project to support the new behavior, and then set the flag to `True` to stop seeing the warnings.
- Set the flag to `False`. You will continue to see warnings, and you will retain the legacy behavior even after the maturity date (when the default value changes).

### Failures in on-run-start hooks

The flag is `False` by default.

Set the `skip_nodes_if_on_run_start_fails` flag to `True` to skip all selected resources from running if there is a failure on an `on-run-start` hook. 

### Source definitions for state:modified

:::info

<StateModified features={'/snippets/_state-modified-compare.md'}/>

:::

The flag is `False` by default.

Set `state_modified_compare_more_unrendered_values` to `True` to reduce false positives during `state:modified` checks (especially when configs differ by target environment like `prod` vs. `dev`).

Setting the flag to `True` changes the `state:modified` comparison from using rendered values to unrendered values instead. It accomplishes this by persisting `unrendered_config` during model parsing and `unrendered_database` and `unrendered_schema` configs during source parsing.

###  Package override for built-in materialization 

Setting the `require_explicit_package_overrides_for_builtin_materializations` flag to `True` prevents this automatic override. 

We have deprecated the behavior where installed packages could override built-in materializations without your explicit opt-in. When this flag is set to `True`, a materialization defined in a package that matches the name of a built-in materialization will no longer be included in the search and resolution order. Unlike macros, materializations don't use the `search_order` defined in the project `dispatch` config.

The built-in materializations are `'view'`, `'table'`, `'incremental'`, `'materialized_view'` for models as well as `'test'`, `'unit'`, `'snapshot'`, `'seed'`, and `'clone'`.

You can still explicitly override built-in materializations, in favor of a materialization defined in a package, by reimplementing the built-in materialization in your root project and wrapping the package implementation.

<File name='macros/materialization_view.sql'>

```sql
{% materialization view, snowflake %}
  {{ return(my_installed_package_name.materialization_view_snowflake()) }}
{% endmaterialization %}
```

</File>

In the future, we may extend the project-level [`dispatch` configuration](/reference/project-configs/dispatch-config) to support a list of authorized packages for overriding built-in materialization.

<VersionBlock lastVersion="1.7">

The following flags were introduced in a future version of dbt Core. If you're still using an older version, then you have the legacy behavior by default (when each flag is `False`). 

</VersionBlock>

### No spaces in resource names

The `require_resource_names_without_spaces` flag enforces using resource names without spaces. 

The names of dbt resources (models, sources, etc) should contain letters, numbers, and underscores. We highly discourage the use of other characters, especially spaces. To that end, we have deprecated support for spaces in resource names. When the `require_resource_names_without_spaces` flag is set to `True`, dbt will raise an exception (instead of a deprecation warning) if it detects a space in a resource name.

<File name='models/model name with spaces.sql'>

```sql
-- This model file should be renamed to model_name_with_underscores.sql
```

</File>

### Project hooks with source freshness 

Set the `source_freshness_run_project_hooks` flag to `True` to include "project hooks" ([`on-run-start` / `on-run-end`](/reference/project-configs/on-run-start-on-run-end)) in the `dbt source freshness` command execution.

If you have a specific project [`on-run-start` / `on-run-end`](/reference/project-configs/on-run-start-on-run-end) hooks that should not run before/after `source freshness` command, you can add a conditional check to those hooks:

<File name='dbt_project.yml'>

```yaml
on-run-start:
  - '{{ ... if flags.WHICH != 'freshness' }}'
```
</File>


### MetricFlow time spine YAML
The `require_yaml_configuration_for_mf_time_spines` flag is set to `False` by default.

In previous versions (dbt Core 1.8 and earlier), the MetricFlow time spine configuration was stored in a `metricflow_time_spine.sql` file.

When the flag is set to `True`, dbt will continue to support the SQL file configuration. When the flag is set to `False`, dbt will raise a deprecation warning if it detects a MetricFlow time spine configured in a SQL file. 

The MetricFlow YAML file should have the `time_spine:` field. Refer to [MetricFlow timespine](/docs/build/metricflow-time-spine) for more details. 

### Custom microbatch strategy
The `require_batched_execution_for_custom_microbatch_strategy` flag is set to `False` by default and is only relevant if you already have a custom microbatch macro in your project.  If you don't have a custom microbatch macro, you don't need to set this flag as dbt will handle microbatching automatically for any model using the [microbatch strategy](/docs/build/incremental-microbatch#how-microbatch-compares-to-other-incremental-strategies).

Set the flag is set to `True` if you have a custom microbatch macro set up in your project. When the flag is set to `True`, dbt will execute the custom microbatch strategy in batches. 

If you have a custom microbatch macro and the flag is left as `False`, dbt will issue a deprecation warning.

Previously, users needed to set the `DBT_EXPERIMENTAL_MICROBATCH` environment variable to `True` to prevent unintended interactions with existing custom incremental strategies. But this is no longer necessary, as setting `DBT_EXPERMINENTAL_MICROBATCH` will no longer have an effect on runtime functionality.

### Cumulative metrics

[Cumulative-type metrics](/docs/build/cumulative#parameters) are nested under the `cumulative_type_params` field in [the dbt Cloud "Latest" release track](/docs/dbt-versions/cloud-release-tracks), dbt Core v1.9 and newer. Currently, dbt will warn users if they have cumulative metrics improperly nested. To enforce the new format (resulting in an error instead of a warning), set the `require_nested_cumulative_type_params` to `True`.

Use the following metric configured with the syntax before v1.9 as an example:

```yaml

    type: cumulative
    type_params:
      measure: order_count
      window: 7 days

```

If you run `dbt parse` with that syntax on Core v1.9 or [the dbt Cloud "Latest" release track](/docs/dbt-versions/cloud-release-tracks), you will receive a warning like: 

```bash

15:36:22  [WARNING]: Cumulative fields `type_params.window` and
`type_params.grain_to_date` has been moved and will soon be deprecated. Please
nest those values under `type_params.cumulative_type_params.window` and
`type_params.cumulative_type_params.grain_to_date`. See documentation on
behavior changes:
https://docs.getdbt.com/reference/global-configs/behavior-changes.

```

If you set `require_nested_cumulative_type_params` to `True` and re-run `dbt parse` you will now receive an error like:

```bash

21:39:18  Cumulative fields `type_params.window` and `type_params.grain_to_date` should be nested under `type_params.cumulative_type_params.window` and `type_params.cumulative_type_params.grain_to_date`. Invalid metrics: orders_last_7_days. See documentation on behavior changes: https://docs.getdbt.com/reference/global-configs/behavior-changes.

```

Once the metric is updated, it will work as expected:

```yaml

    type: cumulative
    type_params:
      measure:
        name: order_count
      cumulative_type_params:
        window: 7 days

```
