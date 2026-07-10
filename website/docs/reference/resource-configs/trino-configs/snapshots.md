---
title: "Snapshots"
sidebar_label: "Snapshots"
description: "Learn how dbt snapshots use the current_timestamp macro in Trino and how to override it to change timestamp precision."
---

[Snapshots in dbt](/docs/build/snapshots) depend on the `current_timestamp` macro, which returns a timestamp with millisecond precision (3 digits) by default. There are some connectors for Trino that don't support this timestamp precision (`TIMESTAMP(3) WITH TIME ZONE`), like Iceberg.

To change timestamp precision, you can define your own [macro](/docs/build/jinja-macros). For example, this defines a new `trino__current_timestamp()` macro with microsecond precision (6 digits): 

<File name='macros/YOUR_MACRO_NAME.sql'>

```sql
{% macro trino__current_timestamp() %}
    current_timestamp(6)
{% endmacro %}
```
</File>
