---
title: "About exceptions namespace"
sidebar_label: "exceptions"
id: "exceptions"
description: "Raise warnings and errors with the `exceptions` namespace."
---

The `exceptions` namespace provides callable functions you can use in models and macros to raise warnings or errors during compilation and execution.

Use these functions when you want to control how dbt responds to invalid inputs, unsupported features, or dependency problems in your own Jinja code. These are functions you call in your own Jinja code. They are different from syntax errors or undefined variable errors that Jinja may raise automatically when your template has a problem.

If you are troubleshooting an error message from dbt (not writing Jinja), refer to [Debug errors](/guides/debug-errors).

When calling these functions during `dbt run` or `dbt run-operation`, wrap them in `{% if execute %}` so they run during the execution phase, not during parsing. Learn more about the [`execute`](/reference/dbt-jinja-functions/execute) variable.

## raise_compiler_error

The `exceptions.raise_compiler_error` method raises a compilation error with the provided message. This is typically only useful in macros or <Term id="materialization">materializations</Term> when invalid arguments are provided by the calling model. Throwing an exception causes a model to fail, so use this method with care.

__Example usage__:

<File name='exceptions.sql'>

```sql
{% if number < 0 or number > 100 %}
  {{ exceptions.raise_compiler_error("Invalid `number`. Got: " ~ number) }}
{% endif %}
```

</File>

## raise_database_error

The `exceptions.raise_database_error` method raises a database-style error from Jinja. Use this method in custom macros when you need to fail with an error formatted like a database error.

The run fails with a `Database Error` and your custom message.

__Example usage__:

<File name='macros/validate_relation.sql'>

```sql
{% macro validate_relation(relation) %}
  {% if execute and not relation %}
    {{ exceptions.raise_database_error('Expected a valid relation but none was provided') }}
  {% endif %}
{% endmacro %}
```

</File>

## raise_dependency_error

The `exceptions.raise_dependency_error` method raises an error when a package or dependency requirement is not met. dbt automatically scrubs secrets from the error message.

The run fails with a `Runtime Error` and your custom message.

__Example usage__:

<File name='macros/check_package.sql'>

```sql
{% macro check_package() %}
  {% if execute and not 'my_package' in installed_packages %}
    {{ exceptions.raise_dependency_error('Missing required package: my_package') }}
  {% endif %}
{% endmacro %}
```

</File>

## raise_fail_fast_error

The `exceptions.raise_fail_fast_error` method raises an error when dbt should halt execution immediately. This is commonly used when configuration changes are detected and `on_configuration_change` is set to `fail`.

The run fails with a `FailFast Error` and your custom message.

__Example usage__:

<File name='macros/materialized_view.sql'>

```sql
{% if on_configuration_change == 'fail' %}
  {{ exceptions.raise_fail_fast_error(
    "Configuration changes were identified and `on_configuration_change` was set to `fail` for `" ~ target_relation.render() ~ "`"
  ) }}
{% endif %}
```

</File>

## raise_not_implemented

The `exceptions.raise_not_implemented` method raises an error when a macro or feature is not supported on the current adapter. Adapter and package authors commonly use this method to stub functionality that has not been implemented yet.

The run fails with a `Runtime Error` and your custom message.

__Example usage__:

<File name='macros/get_columns_in_relation.sql'>

```sql
{% macro default__get_columns_in_relation(relation) -%}
  {{ exceptions.raise_not_implemented(
    'get_columns_in_relation macro not implemented for adapter ' ~ adapter.type()) }}
{% endmacro %}
```

</File>

## warn

Use the `exceptions.warn` method to raise a compiler warning with the provided message. The model will still be successful and treated as a PASS. By default, warnings will not cause dbt runs to fail. However:

* If you use the `--warn-error` flag, all warnings will be promoted to errors.
* To promote only Jinja warnings to errors (and leave other warnings alone), use `--warn-error-options`. For example, `--warn-error-options '{"error": ["JinjaLogWarning"]}'`.

Learn more about [Warnings](/reference/global-configs/warnings).

__Example usage__:

<File name='warn.sql'>

```sql
{% if number < 0 or number > 100 %}
  {% do exceptions.warn("Invalid `number`. Got: " ~ number) %}
{% endif %}
```

</File>
