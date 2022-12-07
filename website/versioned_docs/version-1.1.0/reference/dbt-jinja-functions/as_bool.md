---
title: "as_bool"
id: "as_bool"
---

The `as_bool` Jinja filter will coerce Jinja-compiled output into a boolean
value (`True` or `False`), or return an error if it cannot be represented
as a bool.

### Usage:

In the example below, the `as_bool` filter is used to coerce a Jinja 
expression to enable or disable a set of models based on the `target`.

<File name='dbt_project.yml'>

```yml
models:
  my_project:
    for_export:
      enabled: "{{ (target.name == 'prod') | as_bool }}"
```

</File>

<Changelog>

* `v0.17.1`: Native rendering is disabled by default. The `as_bool` filter was 
introduced.

</Changelog>
