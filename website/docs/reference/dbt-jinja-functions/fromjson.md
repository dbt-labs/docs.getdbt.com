---
title: "About fromjson context method"
sidebar_label: "fromjson"
id: "fromjson"
description: "Deserialize a json string into python with `fromjson` context method."
---

The `fromjson` context method can be used to deserialize a json string into a Python object primitive, eg. a `dict` or `list`.

__Args__:
 * `string`: The json string to deserialize (required)
 * `default`: A default value to return if the `string` argument cannot be deserialized (optional)

### Usage:
```
{% set my_json_str = '{"abc": 123}' %}
{% set my_dict = fromjson(my_json_str) %}

{% do log(my_dict['abc']) %}
```
