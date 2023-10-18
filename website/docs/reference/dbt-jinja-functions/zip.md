---
title: "About zip context method"
id: "zip"
sidebar_label: "zip"
description: "Use this context method to return an iterator of tuples."
---

The `zip` context method can be used to return an iterator of tuples, where the i-th tuple contains the i-th element from each of the argument iterables. ([Python docs](https://docs.python.org/3/library/functions.html#zip))
        :param 
        :param 
        
__Args__:
- `*args`: Any number of iterables
- `default`: A default value to return if `*args` is not iterable

### Usage

```
{% set my_list_a = [1, 2] %}
{% set my_list_b = ['alice', 'bob'] %}
{% set my_zip = zip(my_list_a, my_list_b) | list %}
{% do log(my_zip) %}  {# [(1, 'alice'), (2, 'bob')] #}
```

```
{% set my_list_a = 12 %}
{% set my_list_b = ['alice', 'bob'] %}
{% set my_zip = zip(my_list_a, my_list_b, default = []) | list %}
{% do log(my_zip) %}  {# [] #}
```

### zip_strict

The `zip_strict` context method can be used to used to return an iterator of tuples, just like `zip`. The difference to the `zip` context method is that the `zip_strict` method will raise an exception on a `TypeError`, if one of the provided values is not a valid iterable.

__Args__:
- `value`: The iterable to convert (e.g. a list)

```
{% set my_list_a = [1, 2] %}
{% set my_list_b = ['alice', 'bob'] %}
{% set my_zip = zip_strict(my_list_a, my_list_b) | list %}
{% do log(my_zip) %}  {# [(1, 'alice'), (2, 'bob')] #}
```

```
{% set my_list_a = 12 %}
{% set my_list_b = ['alice', 'bob'] %}
{% set my_zip = zip_strict(my_list_a, my_list_b) %}

Compilation Error in ... (...)
  'int' object is not iterable
```
