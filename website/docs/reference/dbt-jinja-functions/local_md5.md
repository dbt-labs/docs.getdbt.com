---
title: "local_md5"
id: "local_md5"
---
<Changelog>New in 1.4.0</Changelog>

The `local_md5` context variable calculates an MD5 hash of the given string. It's called "local_md5" to emphasize that it runs locally in dbt (in jinja context) and not an MD5 SQL command.

Usage:
```
{% set value_hash = local_md5("hello world") %}
```
