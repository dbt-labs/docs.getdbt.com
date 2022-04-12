---
title: "print"
id: "print"
---

## About print

Use the `print()` function when you want to print messages to both the log file and standard output (stdout).

When used in conjunction with the `QUIET` global config, which suppresses non-error logs, you will only see error logs and the print messages in stdout. For more information, see [Global configs](/reference/global-configs).

([Source on Github](https://github.com/dbt-labs/dbt-core/blob/HEAD/core/dbt/context/base.py#L574))

## Arguments

 * `msg`: The message to print
 * `info`: If False, only write to the log file. If True, write to both the log file and stdout (default=False)

## Example 

```sql
  {% macro some_macro(arg1, arg2) %}
    {{ print("Running some_macro: " ~ arg1 ~ ", " ~ arg2) }}
  {% endmacro %}"
```
