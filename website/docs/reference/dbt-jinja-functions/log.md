---
title: "log"
id: "log"
description: "Use `log` to log a line to either the log file or stdout."
---

__Args__:

 * `msg`: The message (string) to log
 * `info`: If False, write to the log file. If True, write to both the log file and stdout (default=False)

Logs a line to either the log file or stdout.

([Source on GitHub](https://github.com/dbt-labs/dbt-core/blob/HEAD/core/dbt/context/base.py#L432))

```sql

{% macro some_macro(arg1, arg2) %}

	{{ log("Running some_macro: " ~ arg1 ~ ", " ~ arg2) }}

{% endmacro %}
```
