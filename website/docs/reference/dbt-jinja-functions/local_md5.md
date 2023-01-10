---
title: "local_md5"
id: "local_md5"
---
<Changelog>New in 1.4.0</Changelog>

The `local_md5` context variable calculates an [MD5 hash](https://en.wikipedia.org/wiki/MD5) of the given string. It's called `local_md5` to emphasize that the hash is calculated _locally_, in the dbt-Jinja context. This function is intended for generally advanced use cases: generating unique identifiers within custom materialization or operational logic, such as to avoid collisions between temporary relations, or to identify changes by comparing checksums.

It should not be confused with the `md5` SQL function, supported by many SQL dialects, which runs remotely in the data platform. You should always use SQL hashing functions when generating <Term id="surrogate-key">surrogate keys</Term>.

Usage:
```sql
-- source
{%- set value_hash = local_md5("hello world") -%}
'{{ value_hash }}'

-- compiled
'5eb63bbbe01eeed093cb22bb8f5acdc3'
```
