---
title: "toyaml"
id: "toyaml"
---

The `toyaml` context method can be used to serialize a Python object primitive, eg. a `dict` or `list` to a yaml string.

__Args__:
 * `value`: The value to serialize to yaml (required)
 * `default`: A default value to return if the `value` argument cannot be serialized (optional)

### Usage:
```
{% set my_dict = {"abc": 123} %}
{% set my_yaml_string = toyaml(my_dict) %}

{% do log(my_yaml_string) %}
```
