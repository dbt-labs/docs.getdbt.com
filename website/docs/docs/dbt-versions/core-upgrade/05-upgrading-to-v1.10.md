---
title: "Upgrading to v1.10"
id: upgrading-to-v1.10
description: New features and changes in dbt Core v1.10
displayed_sidebar: "docs"
---
 
## Resources 

- <Constant name="core" /> [v1.10 changelog](https://github.com/dbt-labs/dbt-core/blob/1.10.latest/CHANGELOG.md)
- [<Constant name="core" /> CLI Installation guide](/docs/core/installation-overview)
- [Cloud upgrade guide](/docs/dbt-versions/upgrade-dbt-version-in-cloud#release-tracks)

## What to know before upgrading

dbt Labs is committed to providing backward compatibility for all versions 1.x. Any behavior changes will be accompanied by a [behavior change flag](/reference/global-configs/behavior-changes#behavior-change-flags) to provide a migration window for existing projects. If you encounter an error upon upgrading, please let us know by [opening an issue](https://github.com/dbt-labs/dbt-core/issues/new).

Starting in 2024, <Constant name="cloud" /> provides the functionality from new versions of <Constant name="core" /> via [release tracks](/docs/dbt-versions/cloud-release-tracks) with automatic upgrades. If you have selected the "Latest" release track in <Constant name="cloud" />, you already have access to all the features, fixes, and other functionality that is included in <Constant name="core" /> v1.10! If you have selected the "Compatible" release track, you will have access in the next monthly "Compatible" release after the <Constant name="core" /> v1.10 final release.

For users of dbt Core, since v1.8, we recommend explicitly installing both `dbt-core` and `dbt-<youradapter>`. This may become required for a future version of dbt. For example:

```sql
python3 -m pip install dbt-core dbt-snowflake
```

## New and changed features and functionality

New features and functionality available in <Constant name="core" /> v1.10

### The `--sample` flag

Large data sets can slow down dbt build times, making it harder for developers to test new code efficiently. The [`--sample` flag](/docs/build/sample-flag), available for the `run` and `build` commands, helps reduce build times and warehouse costs by running dbt in sample mode. It generates filtered refs and sources using time-based sampling, allowing developers to validate outputs without building entire models.

### Parsing `catalogs.yml`

dbt Core can now parse the `catalogs.yml` file. This is an important milestone in the journey to supporting external catalogs for Iceberg tables, as it enables write integrations. You'll be able to provide a config specifying a catalog integration for your producer model:

For example: 

```yml

catalogs:
  - name: catalog_dave
    # materializing the data to an external location, and metadata to that data catalog
    write_integrations: 
      - name: databricks_glue_write_integration
          external_volume: databricks_external_volume_prod
          table_format: iceberg
          catalog_type: unity 

```

The implementation for the model would look like this:

<File name='models/schemas.yml'>

```yaml

models:
  - name: my_second_public_model
    config:
      catalog_name: catalog_dave

```

</File>

Check out our [docs on external catalog support](/docs/mesh/iceberg/about-catalogs) today! We'll have more information about this in the coming weeks, but this is an exciting step in journey to cross-platform support. 

### Integrating dbt Core artifacts with dbt projects

With [hybrid projects](/docs/deploy/hybrid-projects), <Constant name="core"/> users working in the command line interface (CLI) can execute runs that seamlessly upload [artifacts](/reference/artifacts/dbt-artifacts) into <Constant name="cloud"/>. This enhances hybrid <Constant name="core"/>/<Constant name="cloud"/> deployments by:

- Fostering collaboration between <Constant name="cloud"/> + <Constant name="core"/> users by enabling them to visualize and perform [cross-project references](/docs/mesh/govern/project-dependencies#how-to-write-cross-project-ref) to models defined in <Constant name="core"/> projects. This feature unifies <Constant name="cloud"/> + <Constant name="core"/> workflows for a more connected dbt experience.
- Giving <Constant name="cloud"/> and <Constant name="core"/> users insights into their models and assets in [<Constant name="explorer"/>](/docs/explore/explore-projects). To view <Constant name="explorer"/>, you must have have a [developer or read-only license](/docs/cloud/manage-access/seats-and-users).
- (Coming soon) Enabling users working in the [<Constant name="visual_editor"/>](/docs/cloud/canvas) to build off of models already created by a central data team in <Constant name="core"/> rather than having to start from scratch.

Hybrid projects are available as a private beta to [<Constant name="cloud"/> Enterprise accounts](https://www.getdbt.com/pricing). Contact your account representative to register your interest in the beta.

### Managing changes to legacy behaviors

dbt Core v1.10 introduces new flags for [managing changes to legacy behaviors](/reference/global-configs/behavior-changes). You may opt into recently introduced changes (disabled by default), or opt out of mature changes (enabled by default), by setting `True` / `False` values, respectively, for `flags` in `dbt_project.yml`.

You can read more about each of these behavior changes in the following links:

- (Introduced, disabled by default) [`validate_macro_args`](/reference/global-configs/behavior-changes#macro-argument-validation). If the flag is set to `True`, dbt will raise a warning if the argument `type` names you've added in your macro YAMLs don't match the argument names in your macro or if the argument types aren't valid according to the [supported types](/reference/resource-properties/arguments#supported-types).

### Deprecation warnings

Starting in `v1.10`, you will receive deprecation warnings for dbt code that will become invalid in the future, including: 

- Custom inputs (for example, unrecognized resource properties, configurations, and top-level keys)
- Duplicate YAML keys in the same file
- Unexpected Jinja blocks (for example, `{% endmacro %}` tags without a corresponding `{% macro %}` tag)
- Some `properties` are moving to `configs`
- And more


dbt will start raising these warnings in version `1.10`, but making these changes will not be a prerequisite for using it. We at dbt Labs understand that it will take existing users time to migrate their projects, and it is not our goal to disrupt anyone with this update. The goal is to enable you to work with more safety, feedback, and confidence going forward.

What does this mean for you?

1. If your project (or dbt package) encounters a new deprecation warning in `v1.10`, plan to update your invalid code soon. Although it’s just a warning for now, in a future version, dbt will enforce stricter validation of the inputs in your project. Check out the [`dbt-autofix` tool](https://github.com/dbt-labs/dbt-autofix) to autofix many of these!
2. In the future, the [`meta` config](/reference/resource-configs/meta) will be the only place to put custom user-defined attributes. Everything else will be strongly typed and strictly validated. If you have an extra attribute you want to include in your project, or a model config you want to access in a custom materialization, you must nest it under `meta` moving forward.
3. If you are using the [`—-warn-error` flag](/reference/global-configs/warnings) (or `--warn-error-options '{"error": "all"}'`) to promote all warnings to errors, this will include new deprecation warnings coming to dbt Core. If you don’t want these to be promoted to errors, the `--warn-error-options` flag gives you more granular control over exactly which types of warnings are treated as errors. You can set `"warn": ["Deprecations"]` (new as of `v1.10`) to continue treating the deprecation warnings as warnings.
4. The `--models` / `--model` / `-m` flag was renamed to `--select` / `--s` way back in dbt Core v0.21 (Oct 2021). Silently skipping this flag means ignoring your command's selection criteria, which could mean building your entire DAG when you only meant to select a small subset. For this reason, the `--models` / `--model` / `-m` flag **will raise a warning** in dbt Core v1.10, and an error in Fusion. Please update your job definitions accordingly.

#### Custom inputs
  
Historically, dbt has allowed you to configure inputs largely unconstrained. A common example of this is setting custom YAML properties:

```yml

models:
  - name: my_model
    description: A model in my project.
    dbt_is_awesome: true # a custom property

```

dbt detects the unrecognized custom property (`dbt_is_awesome`) and silently continues. Without a set of strictly defined inputs, it becomes challenging to validate your project's configuration. This creates unintended issues such as:
- Silently ignoring misspelled properties and configurations (for example, `desciption:` instead of `description:`).
- Unintended collisions with user code when dbt introduces a new “reserved” property or configuration.

If you have an unrecognized custom property, you will receive a warning, and in a future version, dbt will cease to support custom properties. Moving forward, these should be nested under the [`meta` config](/reference/resource-configs/meta), which will be the only place to put custom user-defined attributes:

```yml

models:
  - name: my_model
    description: A model in my project.
    config:
      meta:
        dbt_is_awesome: true 

```

#### Duplicate keys in the same yaml file

If two identical keys exist in the same YAML file, you will get a warning, and in a future version, dbt will stop supporting duplicate keys. Previously, if identical keys existed in the same YAML file, dbt silently overwrite, using the last configuration listed in the file. 

<File name='profiles.yml'>

```yml

my_profile:
  target: my_target
  outputs:
...

my_profile: # dbt would use only this profile key
  target: my_other_target
  outputs:
...

```

</File>

Moving forward, you should delete unused keys or move them to a separate YAML file.

#### Unexpected Jinja blocks

If you have an orphaned Jinja block, you will receive a warning, and in a future version, dbt will stop supporting unexpected Jinja blocks. Previously, these orphaned Jinja blocks were silently ignored.

<File name='macros/my_macro.sql'>

```sql

{% endmacro %} # orphaned endmacro jinja block

{% macro hello() %}
hello!
{% endmacro %}

```
</File>

Moving forward, you should delete these orphaned Jinja blocks.

#### Properties moving to configs

Some historical properties are moving entirely to configs.

This will include: `freshness`, `meta`, `tags`, `docs`, `group`, and `access`

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

#### Custom output path for source freshness

The ability to override the default path for `sources.json` via the `--output` or `-o` flags has been deprecated. You can still set the path for all artifacts in the step with `--target-path`, but will receive a warning if trying to set the path for just source freshness.

#### Warn error options

The `warn_error_option` options for `include` and `exclude` have been deprecated and replaced with `error` and `warn`, respectively.

  ```yaml
...
  flags:
    warn_error_options:
      error: # Previously called "include"
      warn: # Previously called "exclude"
      silence: # To silence or ignore warnings
        - NoNodesForSelectionCriteria
  ```

## Quick hits

- Provide the [`loaded_at_query`](/reference/resource-properties/freshness#loaded_at_query) property for source freshness to specify custom SQL to generate the `maxLoadedAt` time stamp on the source (versus the [built-in query](https://github.com/dbt-labs/dbt-adapters/blob/6c41bedf27063eda64375845db6ce5f7535ef6aa/dbt/include/global_project/macros/adapters/freshness.sql#L4-L16), which uses the `loaded_at_field`). You cannot define `loaded_at_query` if the `loaded_at_field` config is also provided.

- Provide validation for macro arguments using the [`validate_macro_args`](/reference/global-configs/behavior-changes#macro-argument-validation) flag, which is disabled by default. When enabled, this flag checks that documented macro argument names match those in the macro definition and validates their types against a supported format. Previously, dbt did not enforce standard argument types, treating the type field as documentation-only. If no arguments are documented, dbt infers them from the macro and includes them in the manifest.json file. Learn more about [supported types](/reference/resource-properties/arguments#supported-types). 

- [Cost management](/docs/cloud/cost-management) is coming soon to <Constant name="core" />! Select features will be introduced in <Constant name="core" /> v1.10, with many more to follow in v1.11. Be sure to upgrade so you can take advantage of these features when they launch in 2025.