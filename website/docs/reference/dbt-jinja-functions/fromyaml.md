---
title: "About fromyaml context method"
sidebar_label: "fromyaml"
id: "fromyaml"
description: "Deserialize a YAML string into python with `fromyaml` context method."
---

The `fromyaml` context method can be used to deserialize a YAML string into a Python object primitive, eg. a `dict` or `list`.

__Args__:
 * `string`: The YAML string to deserialize (required)
 * `default`: A default value to return if the `string` argument cannot be deserialized (optional)

### Usage:
```
{% set my_yml_str -%}

dogs:
 - good
 - bad

{%- endset %}

{% set my_dict = fromyaml(my_yml_str) %}

{% do log(my_dict['dogs'], info=true) %}
-- ["good", "bad"]

{% do my_dict['dogs'].pop() %}
{% do log(my_dict['dogs'], info=true) %}
-- ["good"]
```
