---
title: "log"
sibebar_label: "About log function"
id: "log"
description: "Learn more about the log Jinja function in dbt."
---

__Args__:

 * `msg`: The message (string) to log
 * `info`: If False, write to the log file. If True, write to both the log file and stdout (default=False)

Logs a line to either the log file or stdout.

<details>
	<summary>Code source</summary>
	Refer to <a href="https://github.com/dbt-labs/dbt-core/blob/HEAD/core/dbt/context/base.py#L549-L566">GitHub</a> or the following code as a source: <br />
	<code>
     def log(msg: str, info: bool = False) -> str:
        """Logs a line to either the log file or stdout.

        :param msg: The message to log
        :param info: If `False`, write to the log file. If `True`, write to
            both the log file and stdout.

        > macros/my_log_macro.sql

            {% macro some_macro(arg1, arg2) %}
              {{ log("Running some_macro: " ~ arg1 ~ ", " ~ arg2) }}
            {% endmacro %}"
        """
        if info:
            fire_event(JinjaLogInfo(msg=msg, node_info=get_node_info()))
        else:
            fire_event(JinjaLogDebug(msg=msg, node_info=get_node_info()))
        return ""
  
	</code>

</details>

```sql

{% macro some_macro(arg1, arg2) %}

	{{ log("Running some_macro: " ~ arg1 ~ ", " ~ arg2) }}

{% endmacro %}
```
