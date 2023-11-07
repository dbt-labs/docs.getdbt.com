---
title: Debugging schema names
id: debugging-schema-names
description: Learn how to debug schema names when models build under unexpected schemas
displayText: Debugging schema names
hoverSnippet: Learn how to debug schema names dbt.
# time_to_complete: '30 minutes' commenting out until we test
platform: 'dbt-core'
icon: 'guides'
hide_table_of_contents: true
tags: ['dbt Core']
level: 'Advanced'
recently_updated: true
---

## Introduction

If a model uses the [`schema` config](/reference/resource-properties/schema) but builds under an unexpected schema, here are some steps for debugging the issue.

:::info
The full explanation on custom schemas can be found [here](/docs/build/custom-schemas).
:::

You can also follow along via this video:

<LoomVideo id="1c6e33b504da432dbd07c4cb7f35478e" />

## Search for a macro named `generate_schema_name`
Do a file search to check if you have a macro named `generate_schema_name` in the `macros` directory of your project.

### I do not have a macro named `generate_schema_name` in my project
This means that you are using dbt's default implementation of the macro, as defined [here](https://github.com/dbt-labs/dbt-core/blob/main/core/dbt/include/global_project/macros/get_custom_name/get_custom_schema.sql#L47C1-L60)

```sql
{% macro generate_schema_name(custom_schema_name, node) -%}

    {%- set default_schema = target.schema -%}
    {%- if custom_schema_name is none -%}

        {{ default_schema }}

    {%- else -%}

        {{ default_schema }}_{{ custom_schema_name | trim }}

    {%- endif -%}

{%- endmacro %}
```

Note that this logic is designed so that two dbt users won't accidentally overwrite each other's work by writing to the same schema.

### I have a `generate_schema_name` macro in my project that calls another macro
If your `generate_schema_name` macro looks like so:
```sql
{% macro generate_schema_name(custom_schema_name, node) -%}
    {{ generate_schema_name_for_env(custom_schema_name, node) }}
{%- endmacro %}
```
Your project is switching out the `generate_schema_name` macro for another macro, `generate_schema_name_for_env`. Similar to the above example, this is a macro which is defined in dbt's global project, [here](https://github.com/dbt-labs/dbt-core/blob/main/core/dbt/include/global_project/macros/get_custom_name/get_custom_schema.sql#L47-L60).
```sql
{% macro generate_schema_name_for_env(custom_schema_name, node) -%}

    {%- set default_schema = target.schema -%}
    {%- if target.name == 'prod' and custom_schema_name is not none -%}

        {{ custom_schema_name | trim }}

    {%- else -%}

        {{ default_schema }}

    {%- endif -%}

{%- endmacro %}
```
### I have a `generate_schema_name` macro with custom logic

If this is the case — it might be a great idea to reach out to the person who added this macro to your project, as they will have context here — you can use [GitHub's blame feature](https://docs.github.com/en/free-pro-team@latest/github/managing-files-in-a-repository/tracking-changes-in-a-file) to do this.

In all cases take a moment to read through the Jinja to see if you can follow the logic.


## Confirm your `schema` config
Check if you are using the [`schema` config](/reference/resource-properties/schema) in your model, either via a `{{ config() }}` block, or from `dbt_project.yml`. In both cases, dbt passes this value as the `custom_schema_name` parameter of the `generate_schema_name` macro.


## Confirm your target values
Most `generate_schema_name` macros incorporate logic from the [`target` variable](/reference/dbt-jinja-functions/target), in particular `target.schema` and `target.name`. Use the docs [here](/reference/dbt-jinja-functions/target) to help you find the values of each key in this dictionary.


## Put the two together

Now, re-read through the logic of your `generate_schema_name` macro, and mentally plug in your `customer_schema_name` and `target` values.

You should find that the schema dbt is constructing for your model matches the output of your `generate_schema_name` macro.

:::info
Note that snapshots do not follow this behavior, check out the docs on [target_schema](/reference/resource-configs/target_schema) instead.
:::

## Adjust as necessary

Now that you understand how a model's schema is being generated, you can adjust as necessary:
- You can adjust the logic in your `generate_schema_name` macro (or add this macro to your project if you don't yet have one and adjust from there)
- You can also adjust your `target` details (for example, changing the name of a target)

If you change the logic in `generate_schema_name`, it's important that you consider whether two users will end up writing to the same schema when developing dbt models. This consideration is the reason why the default implementation of the macro concatenates your target schema and custom schema together — we promise we were trying to be helpful by implementing this behavior, but acknowledge that the resulting schema name is unintuitive.
