---
title: "About config variable"
sidebar_label: "config"
id: "config"
description: "Read this guide to understand the config Jinja function in dbt."
---

The `config` variable exists to handle end-user configuration for custom <Term id="materialization">materializations</Term>. Configs like  `unique_key` can be implemented using the `config` variable in your own materializations.

For example, code in the `incremental` materialization like this:
```
{% materialization incremental, default -%}
  {%- set unique_key = config.get('unique_key') -%}
  ...
```

is responsible for handling model code that looks like this:
```
{{
  config(
    materialized='incremental',
    unique_key='id'
  )
}}
```

Review [Model configurations](/reference/model-configs) for examples and more information on valid arguments.

## config.get
__Args__:

 * `name`: The name of the configuration variable (required)
 * `default`: The default value to use if this configuration is not provided (optional)

The `config.get` function is used to get configurations for a model from the end-user. Configs defined in this way are optional, and a default value can be provided.

There are 3 cases:
1. The configuration variable exists, it is not `None`
1. The configuration variable exists, it is `None`
1. The configuration variable does not exist

:::warning Deprecation warning for meta fallback
Starting in dbt Core v1.10, `config.get()` emits a deprecation warning when it finds a value in `config.meta` instead of at the top level. This fallback behavior will be removed in a future version.

To access custom configurations stored under `meta`, use [`config.meta_get()`](#configmeta_get) instead.
:::

Example usage:
```sql
{% materialization incremental, default -%}
  -- Example w/ no default. unique_key will be None if the user does not provide this configuration
  {%- set unique_key = config.get('unique_key') -%}

  -- Example w/ alternate value. Use alternative of 'id' if 'unique_key' config is provided, but it is None
  {%- set unique_key = config.get('unique_key') or 'id' -%}

  -- Example w/ default value. Default to 'id' if the 'unique_key' config does not exist
  {%- set unique_key = config.get('unique_key', default='id') -%}
  ...
```

## config.require
__Args__:

 * `name`: The name of the configuration variable (required)

The `config.require` function is used to get configurations for a model from the end-user. Configs defined using this function are required, and failure to provide them will result in a compilation error.

:::warning Deprecation warning for meta fallback
Starting in dbt Core v1.10 and the <Constant name="fusion_engine" />, `config.require()` emits a deprecation warning when it finds a value in `config.meta` instead of at the top level. This fallback behavior will be removed in a future version.

To access custom configurations stored under `meta`, use [`config.meta_require()`](#configmeta_require) instead.
:::

Example usage:
```sql
{% materialization incremental, default -%}
  {%- set unique_key = config.require('unique_key') -%}
  ...
```

## config.meta_get

<VersionBlock lastVersion="1.9">

This functionality is new in dbt Core v1.10 and the <Constant name="fusion_engine" />.

</VersionBlock>

__Args__:

 * `name`: The name of the configuration variable to retrieve from `meta` (required)
 * `default`: The default value to use if this configuration is not provided (optional)

The `config.meta_get` function retrieves custom configurations stored under the `meta` dictionary. Unlike `config.get()`, this function exclusively checks `config.meta` and does not emit deprecation warnings.

Use this function when accessing custom configurations that you've defined under `meta` in your model or resource configuration.

Example usage:
```sql
{% materialization custom_materialization, default -%}
  -- Retrieve a custom config from meta, returns None if not found
  {%- set custom_setting = config.meta_get('custom_setting') -%}

  -- Retrieve with a default value
  {%- set custom_setting = config.meta_get('custom_setting', default='default_value') -%}
  ...
```

Example model configuration:
```yaml
models:
  - name: my_model
    config:
      meta:
        custom_setting: "my_value"
```

## config.meta_require

<VersionBlock lastVersion="1.9">

This functionality is new in dbt Core v1.10 and the <Constant name="fusion_engine" />.

</VersionBlock>

__Args__:

 * `name`: The name of the configuration variable to retrieve from `meta` (required)

The `config.meta_require` function retrieves custom configurations stored under the `meta` dictionary. Unlike `config.require()`, this function exclusively checks `config.meta` and does not emit deprecation warnings. If the configuration is not found, dbt raises a compilation error.

Use this function when you need to ensure a custom configuration exists under `meta`.

Example usage:
```sql
{% materialization custom_materialization, default -%}
  -- Require a custom config from meta, throws error if not found
  {%- set required_setting = config.meta_require('required_setting') -%}
  ...
```
