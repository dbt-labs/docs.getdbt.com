---
title: "About local_md5 context variable"
sidebar_label: "local_md5"
id: "local_md5"
description: "Calculate an MD5 hash of a string with `local_md5` context variable."
---

The `local_md5` context variable calculates an [MD5 hash](https://en.wikipedia.org/wiki/MD5) of the given string. The string `local_md5` emphasizes that the hash is calculated _locally_, in the dbt-Jinja context. This variable is typically useful for advanced use cases. For example, when you generate unique identifiers within custom materialization or operational logic, you can either avoid collisions between temporary relations or identify changes by comparing checksums.

It is different than the `md5` SQL function, supported by many SQL dialects, which runs remotely in the data platform. You want to always use SQL hashing functions when generating <Term id="surrogate-key">surrogate keys</Term>.

Usage:
```sql
-- source
{%- set value_hash = local_md5("hello world") -%}
'{{ value_hash }}'

-- compiled
'5eb63bbbe01eeed093cb22bb8f5acdc3'
```
