---
title: "About builtins Jinja function"
sidebar_label: "builtins"
id: "builtins"
description: "Read this guide to understand the builtins Jinja function in dbt."
---

The `builtins` variable exists to provide references to builtin dbt context methods. This allows macros to be created with names that _mask_ dbt builtin context methods, while still making those methods accessible in the dbt compilation context.

The `builtins` variable is a dictionary containing the following keys:

- [ref](/reference/dbt-jinja-functions/ref)
- [source](/reference/dbt-jinja-functions/source)
- [config](/reference/dbt-jinja-functions/config)

## Usage

<VersionBlock firstVersion="1.6">
  
The following macro extracts user-provided arguments, including `version`, and calls the `builtins.ref()` function with either a single `modelname` argument or both `packagename` and `modelname` arguments, based on the number of positional arguments in `varargs`:
  
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
{% if packagename is not none %}
    {% do return(builtins.ref(packagename, modelname, version=version)) %}
{% else %}
    {% do return(builtins.ref(modelname, version=version)) %}
{% endif %}

{% endmacro %}
```

</VersionBlock>

<VersionBlock lastVersion="1.5">

The following macro overrides the `ref` method available in the model compilation context to return a [Relation](/reference/dbt-classes#relation) with the database name overriden to `dev`:

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
