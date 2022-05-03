---
title: "log"
id: "log"
---

__Args__:

 * `msg`: The message (string) to log
 * `info`: If False, write to the log file. If True, write to both the log file and stdout (default=False)

Logs a line to either the log file or stdout.

([Source on Github](https://github.com/dbt-labs/dbt-core/blob/f87c7819fb0c0865bf4b3314525b473d550a4e27/core/dbt/context/base.py#L487))

```sql

{% macro some_macro(arg1, arg2) %}

	{{ log("Running some_macro: " ~ arg1 ~ ", " ~ arg2) }}

{% endmacro %}
```
