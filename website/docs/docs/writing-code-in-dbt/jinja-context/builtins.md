---
title: "builtins"
id: "builtins"
---

<Changelog>New in 0.16.0</Changelog>

The `builtins` variable exists to provide references to builtin dbt context methods. This allows macros to be created with names that _mask_ dbt builtin context methods, while still making those methods accessible in the dbt compilation context.

The `builtins` variable is a dictionary containing the following keys:

- [ref](ref)
- [source](source)
- [config](config)
- [execute](execute)

## Usage
The following macro overrides the `ref` method available in the model compilation context to return a [Relation](class-reference#relation) with the database name overriden to `dev`.

```
{% macro ref(model_name) %}

  {% set rel = builtins.ref(modelname) %}
  {% set newrel = rel.replace_path(database="dev") %}
  {% do return(newrel) %}

{% endmacro %}
```
