---
title: "Compare SQL functions across Snowflake and BigQuery"
sidebar_label: "SQL functions: Snowflake vs BigQuery"
id: "sql-functions-comparison"
description: "Side-by-side syntax for common ANSI SQL functions that share a name on Snowflake and BigQuery — including the ones whose arguments differ."
tags: ['Snowflake', 'BigQuery', 'dbt Fusion', 'static_analysis']
---

A lot of SQL functions share the same name on Snowflake and BigQuery — but "same name" doesn't always mean "same call." Some take their arguments in a different order, make different arguments optional, or add extra ones. Those are the functions that quietly break a query when you move it between platforms.

This page lines up about 20 common ANSI SQL functions side by side so you can spot the differences at a glance. The ones most likely to trip you up come first.

:::tip Looking for the full list?
This page is a curated comparison, not an exhaustive catalog. For every built-in function and whether <Constant name="fusion"/> can typecheck it, see [Snowflake functions in Fusion](/reference/resource-configs/snowflake-function-support) and [BigQuery functions in Fusion](/reference/resource-configs/bigquery-function-support).
:::

## Functions where the arguments differ

These functions share a name but not a signature. Read the syntax row carefully before you copy a query from one platform to the other.

### DATE_TRUNC

The arguments are in the **opposite order** on each platform. This is the classic one to watch for.

| Property | Snowflake | BigQuery |
| --- | --- | --- |
| Syntax | `DATE_TRUNC(<date_part>, <date_or_time_expr>)` | `DATE_TRUNC(<date_expression>, <date_part>)` |
| Argument order | Part first, then the date | Date first, then the part |
| Returns | Same type as the input value | Same type as the input value |
| Example | `DATE_TRUNC('month', order_date)` | `DATE_TRUNC(order_date, MONTH)` |

:::caution Heads up
Snowflake quotes the date part as a string (`'month'`); BigQuery passes it as a keyword (`MONTH`).
:::

### LOG

The base and the value swap positions — and on BigQuery the base is optional.

| Property | Snowflake | BigQuery |
| --- | --- | --- |
| Syntax | `LOG(<base>, <expr>)` | `LOG(<X> [, <base>])` |
| Argument order | Base first, value second | Value first, base second |
| Default | Base is required | Omit the base for the natural log |
| Returns | `FLOAT` | `FLOAT64` |
| Example | `LOG(10, 100)` returns `2` | `LOG(100, 10)` returns `2` |

### ROUND

Same first two arguments, but BigQuery adds an optional rounding mode.

| Property | Snowflake | BigQuery |
| --- | --- | --- |
| Syntax | `ROUND(<input> [, <scale>])` | `ROUND(<X> [, <N> [, <rounding_mode>]])` |
| Extra argument | None | `rounding_mode`: `ROUND_HALF_AWAY_FROM_ZERO` (default) or `ROUND_HALF_EVEN` |
| Returns | Same type as input | `FLOAT64` or `NUMERIC` |
| Example | `ROUND(3.14159, 2)` returns `3.14` | `ROUND(2.5, 0, "ROUND_HALF_EVEN")` returns `2` |

### REGEXP_REPLACE

Both replace text that matches a pattern, but Snowflake accepts several extra positional arguments that BigQuery doesn't.

| Property | Snowflake | BigQuery |
| --- | --- | --- |
| Syntax | `REGEXP_REPLACE(<subject>, <pattern> [, <replacement>, <position>, <occurrence>, <parameters>])` | `REGEXP_REPLACE(<value>, <regexp>, <replacement>)` |
| Optional arguments | `position`, `occurrence`, and `parameters` (flags) | None — all three arguments are required |
| Returns | `VARCHAR` | `STRING` |
| Example | `REGEXP_REPLACE(email, '@.*$', '')` | `REGEXP_REPLACE(email, r'@.*$', '')` |

### REGEXP_SUBSTR

| Property | Snowflake | BigQuery |
| --- | --- | --- |
| Syntax | `REGEXP_SUBSTR(<subject>, <pattern> [, <position>, <occurrence>, <parameters>, <group_num>])` | `REGEXP_SUBSTR(<value>, <regexp> [, <position> [, <occurrence>]])` |
| Optional arguments | Up to four, including a capture-group selector | `position` and `occurrence` only |
| Returns | `VARCHAR` | `STRING` |
| Example | `REGEXP_SUBSTR(phone, '\\d{3}')` | `REGEXP_SUBSTR(phone, r'\d{3}')` |

### SPLIT

Both return an array, but the delimiter is required on Snowflake and optional on BigQuery.

| Property | Snowflake | BigQuery |
| --- | --- | --- |
| Syntax | `SPLIT(<string>, <separator>)` | `SPLIT(<value> [, <delimiter>])` |
| Default | Separator is required | Defaults to a comma for strings |
| Returns | `ARRAY` | `ARRAY` |
| Example | `SPLIT('a,b,c', ',')` | `SPLIT('a,b,c')` |

### ARRAY_TO_STRING

BigQuery adds a third argument that controls how `NULL` elements are rendered.

| Property | Snowflake | BigQuery |
| --- | --- | --- |
| Syntax | `ARRAY_TO_STRING(<array>, <separator>)` | `ARRAY_TO_STRING(<array_expression>, <delimiter> [, <null_text>])` |
| Extra argument | None — `NULL` elements are dropped | `null_text`: the string to substitute for `NULL` elements |
| Returns | `VARCHAR` | `STRING` |
| Example | `ARRAY_TO_STRING(tags, ', ')` | `ARRAY_TO_STRING(tags, ', ', 'n/a')` |

### LPAD and RPAD

Same argument order on both, but the pad string is optional on each (it defaults to a space) — worth confirming when a query relies on the default.

| Property | Snowflake | BigQuery |
| --- | --- | --- |
| Syntax | `LPAD(<expr>, <length> [, <pad>])` | `LPAD(<original_value>, <return_length> [, <pattern>])` |
| Default pad | Single space | Single space |
| Returns | `VARCHAR` | `STRING` or `BYTES` |
| Example | `LPAD(id, 6, '0')` | `LPAD(id, 6, '0')` |

`RPAD` follows the same pattern on both platforms.

### TRIM

The signatures match, but note that the optional character set is positional on both.

| Property | Snowflake | BigQuery |
| --- | --- | --- |
| Syntax | `TRIM(<expr> [, <characters>])` | `TRIM(<value> [, <set_of_characters>])` |
| Default | Trims spaces | Trims spaces |
| Returns | `VARCHAR` | `STRING` or `BYTES` |
| Example | `TRIM('  hi  ')` returns `'hi'` | `TRIM('xxhixx', 'x')` returns `'hi'` |

### LAG and LEAD

These window functions line up, but double-check the offset and default arguments when you port a query.

| Property | Snowflake | BigQuery |
| --- | --- | --- |
| Syntax | `LAG(<expr> [, <offset> [, <default>]])` | `LAG(<value_expression> [, <offset> [, <default_expression>]])` |
| Offset default | `1` | `1` |
| Returns | Same type as `expr` | Same type as `value_expression` |
| Example | `LAG(revenue, 1, 0) OVER (ORDER BY day)` | `LAG(revenue, 1, 0) OVER (ORDER BY day)` |

`LEAD` mirrors `LAG` on both platforms.

## Functions with matching signatures

These share a name *and* call the same way on both platforms, so they port over cleanly. Syntax shown once since it's identical.

| Function | Syntax | What it does |
| --- | --- | --- |
| `LOWER` / `UPPER` | `LOWER(<expr>)` | Changes string case |
| `ABS` | `ABS(<expr>)` | Returns the absolute value |
| `CEIL` / `FLOOR` | `CEIL(<expr>)` | Rounds up or down to the nearest integer |
| `SQRT` | `SQRT(<expr>)` | Returns the square root |
| `MOD` | `MOD(<x>, <y>)` | Returns the remainder of `x / y` |
| `GREATEST` / `LEAST` | `GREATEST(<expr1>, <expr2>, ...)` | Returns the largest or smallest argument |
| `COUNT` / `SUM` / `AVG` / `MIN` / `MAX` | `COUNT(<expr>)` | Standard aggregates |
| `ANY_VALUE` | `ANY_VALUE(<expr>)` | Returns an arbitrary value from the group |
| `ROW_NUMBER` | `ROW_NUMBER() OVER (...)` | Assigns a sequential row number |
| `RANK` / `DENSE_RANK` | `RANK() OVER (...)` | Ranks rows within a partition |
| `NTILE` | `NTILE(<n>) OVER (...)` | Splits rows into `n` buckets |
| `CURRENT_DATE` / `CURRENT_TIMESTAMP` | `CURRENT_DATE()` | Returns the current date or timestamp |

:::note
Even when the syntax matches, edge-case behavior (NULL handling, overflow, type coercion) can still differ. When in doubt, check the platform's own reference — linked above.
:::
