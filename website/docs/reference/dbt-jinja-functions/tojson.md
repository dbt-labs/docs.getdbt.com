---
title: "About tojson context method"
sidebar_label: "tojson"
id: "tojson"
description: "Use this context method to serialize a Python object primitive."
---

The `tojson` context method can be used to serialize a Python object primitive, eg. a `dict` or `list` to a JSON string.

__Args__:
 * `value`: The value to serialize to json (required)
 * `default`: A default value to return if the `value` argument cannot be serialized (optional)

### Usage:
```
{% set my_dict = {"abc": 123} %}
{% set my_json_string = tojson(my_dict) %}

{% do log(my_json_string) %}
```
