---
title: "About modules variable"
sidebar_label: "modules"
id: "modules"
description: "`modules` Jinja variable exposes useful Python modules for operating on data."
---

The `modules` variable in the Jinja context is a predefined namespace that contains only a limited set of supported Python modules for operating on data. You cannot import or access arbitrary Python modules (for example, `os`, `requests`, or custom third-party libraries) from within Jinja.

There is no user-facing configuration to modify or extend the `modules` namespace. This restriction helps ensure consistent behavior, security, and portability across environments.

If your workflow requires functionality from additional Python libraries, use a [Python model](/docs/build/python-models) (where supported) instead of Jinja. Python models run in a different execution context and allow you to import and use external libraries as needed.

## datetime
This variable is a pointer to the Python [`datetime`](https://docs.python.org/3/library/datetime.html) module, which supports complex date and time logic.

It includes the modules contexts of `date`, `datetime`, `time`, `timedelta`, and `tzinfo`.

**Usage**

```
{% set now = modules.datetime.datetime.now() %}
{% set three_days_ago_iso = (now - modules.datetime.timedelta(3)).isoformat() %}
```
This module will return the current date and time on every Jinja evaluation. 
For the date and time of the start of the run, please see
[run_started_at](/reference/dbt-jinja-functions/run_started_at).

## pytz
This variable is a pointer to the Python [`pytz`](https://pypi.org/project/pytz/) module, which supports timezone logic.

**Usage**

```
{% set dt = modules.datetime.datetime(2002, 10, 27, 6, 0, 0) %}
{% set dt_local = modules.pytz.timezone('US/Eastern').localize(dt) %}
{{ dt_local }}
```

## re
This variable is a pointer to the Python [`re`](https://docs.python.org/3/library/re.html) module, which supports regular expressions.

**Usage**

```
{% set my_string = 's3://example/path' %}
{% set s3_path_pattern = 's3://[a-z0-9-_/]+' %}

{% set re = modules.re %}
{% set is_match = re.match(s3_path_pattern, my_string, re.IGNORECASE) %}
{% if not is_match %}
    {%- do exceptions.raise_compiler_error(
        my_string ~ ' is not a valid s3 path'
    ) -%}
{% endif %}
```

## itertools

:::info Note
Starting in `dbt-core==1.10.6`, using `modules.itertools` raises a deprecation warning. For more information and suggested workarounds, refer to the [documentation on `ModulesItertoolsUsageDeprecation`](/reference/deprecations.md#modulesitertoolsusagedeprecation).
:::

This variable is a pointer to the Python [`itertools`](https://docs.python.org/3/library/itertools.html) module, which includes useful functions for working with iterators (loops, lists, and the like).

The supported functions are:
- `count`
- `cycle`
- `repeat`
- `accumulate`
- `chain`
- `compress`
- `islice`
- `starmap`
- `tee`
- `zip_longest`
- `product`
- `permutations`
- `combinations`
- `combinations_with_replacement`

**Usage**

```
{%- set A = [1, 2] -%}
{%- set B = ['x', 'y', 'z'] -%}
{%- set AB_cartesian = modules.itertools.product(A, B) -%}

{%- for item in AB_cartesian %}
  {{ item }}
{%- endfor -%}
```
```
  (1, 'x')
  (1, 'y')
  (1, 'z')
  (2, 'x')
  (2, 'y')
  (2, 'z')
```