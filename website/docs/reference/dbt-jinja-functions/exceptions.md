---
title: "exceptions"
id: "exceptions"
---

The `exceptions` namespace can be used to raise warnings and errors in dbt userspace.

## raise_compiler_error

The `exceptions.raise_compiler_error` method will raise a compiler error with the provided message. This is typically only useful in macros or <Term id="materialization">materializations</Term> when invalid arguments are provided by the calling model. Note that throwing an exception will cause a model to fail, so please use this variable with care!

__Example usage__:

<File name='exceptions.sql'>

```sql
{% if number < 0 or number > 100 %}
  {{ exceptions.raise_compiler_error("Invalid `number`. Got: " ~ number) }}
{% endif %}
```

</File>

## warn

The `exceptions.warn` method will raise a compiler warning with the provided message. If the `--warn-error`  flag is provided to dbt, then this warning will be elevated to an exception, which is raised.

__Example usage__:

<File name='warn.sql'>

```sql
{% if number < 0 or number > 100 %}
  {% do exceptions.warn("Invalid `number`. Got: " ~ number) %}
{% endif %}
```

</File>
