---
title: "print"
id: "print"
---

__Args__:

 * `msg`: The message to print
 * `info`: If False, only write to the log file. If True, write to both the log file and stdout (default=False)

Prints the print() statement and nothing else but the logs all still go to the log file.

([Source on Github](https://github.com/dbt-labs/dbt-core/blob/HEAD/core/dbt/context/base.py#L574))

```sql
  {% macro some_macro(arg1, arg2) %}
    {{ print("Running some_macro: " ~ arg1 ~ ", " ~ arg2) }}
  {% endmacro %}"
```
