---
title: "About builtins Jinja variable"
sidebar_label: "builtins"
id: "builtins"
description: "Read this guide to understand the builtins Jinja variable in dbt."
---


The `builtins` variable exists to provide references to builtin dbt context methods. This allows macros to be created with names that _mask_ dbt builtin context methods, while still making those methods accessible in the dbt compilation context.

The `builtins` variable is a dictionary containing the following keys:

- [ref](/reference/dbt-jinja-functions/ref)
- [source](/reference/dbt-jinja-functions/source)
- [config](/reference/dbt-jinja-functions/config)

## Usage

:::important

Using the `builtins` variable in this way is an advanced development workflow. Users should be ready to maintain and update these overrides when upgrading in the future.
:::

<VersionBlock firstVersion="1.5">
  
From dbt v1.5 and higher, use the following macro to extract user-provided arguments, including <code>version</code>, and call the <code>builtins.ref()</code> function with either a single <code>modelname</code> argument or both <code>packagename</code> and <code>modelname</code> arguments, based on the number of positional arguments in <code>varargs</code>:

<br /><br />

  
```
{% macro ref() %}
-- extract user-provided positional and keyword arguments
  {% set version = kwargs.get('version') %}
  {% set packagename = none %}
  {%- if (varargs | length) == 1 -%}
    {% set modelname = varargs[0] %}
{%- else -%}
    {% set packagename = varargs[0] %}
    {% set modelname = varargs[1] %}
{% endif %}
-- call builtins.ref based on provided positional arguments
{% set rel = None %}
{% if packagename is not none %}
    {% set rel = return(builtins.ref(packagename, modelname, version=version)) %}
{% else %}
    {% set rel = return(builtins.ref(modelname, version=version)) %}
{% endif %}

-- finally, override the database name with "dev"
{% set newrel = rel.replace_path(database="dev") %}
{% do return(newrel) %}

{% endmacro %}
```
</VersionBlock>

<VersionBlock lastVersion="1.4">

From dbt v1.4 and lower, use the following macro to override the `ref` method available in the model compilation context to return a [Relation](/reference/dbt-classes#relation) with the database name overriden to `dev`:

```

{% macro ref(model_name) %}

  {% set rel = builtins.ref(model_name) %}
  {% set newrel = rel.replace_path(database="dev") %}
  {% do return(newrel) %}

{% endmacro %}
```
</VersionBlock>

The ref macro can also be used to control which elements of the model path are rendered when run, for example the following macro overrides the `ref` method to render only the schema and object identifier, but not the database reference i.e. `my_schema.my_model` rather than `my_database.my_schema.my_model`. This is especially useful when using snowflake as a warehouse, if you intend to change the name of the database post-build and wish the references to remain accurate.

```
-- Macro to override ref and to render identifiers without a database.

{% macro ref(model_name) %}

  {% do return(builtins.ref(model_name).include(database=false)) %}

{% endmacro %}
```
