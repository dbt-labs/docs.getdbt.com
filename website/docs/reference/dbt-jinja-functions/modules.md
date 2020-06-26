---
title: "modules"
id: "modules"
---

The `modules` variable in the Jinja context contains useful Python modules for operating on data.

## datetime
This variable is a pointer to the Python [datetime](https://docs.python.org/3/library/datetime.html) module.

**Usage**

```
{% set dt = modules.datetime.datetime.now() %}
```
This module will return the current date and time on every Jinja evaluation. For the date and time of the
start of the run, please see [run_started_at](run_started_at).

## pytz
This variable is a pointer to the Python [pytz](https://pypi.org/project/pytz/) module.

**Usage**

```
{% set dt = modules.datetime.datetime(2002, 10, 27, 6, 0, 0) %}
{% set dt_local = modules.pytz.timezone('US/Eastern').localize(dt) %}
{{ dt_local }}
```
