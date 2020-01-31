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

## pytz
This variable is a pointer to the Python [pytz](https://pypi.org/project/pytz/) module.

**Usage**

```
{% set dt = modules.datetime.datetime(2002, 10, 27, 6, 0, 0) %}
{% set dt_local = modules.pytz.timezone('US/Eastern').localize(dt) %}
{{ dt_local }}
```