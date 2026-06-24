---
title: "Compare SQL functions across Snowflake and BigQuery"
sidebar_label: "SQL functions: Snowflake vs BigQuery"
id: "sql-functions-comparison"
description: "Side-by-side syntax for common ANSI SQL functions that share a name on Snowflake and BigQuery — including the ones whose arguments differ."
tags: ['Snowflake', 'BigQuery', 'dbt Fusion', 'static_analysis']
---

A lot of SQL functions share the same name on Snowflake and BigQuery — but "same name" doesn't always mean "same call." Some take their arguments in a different order, make different arguments optional, or add extra ones. Those are the functions that quietly break a query when you move it between platforms.

This page lines up about 20 common ANSI SQL functions side by side so you can spot the differences at a glance. The ones most likely to trip you up come first.

The **Applies to** badge under each function shows every data platform it's available on, not just the two compared here.

:::tip Looking for the full list?
This page is a curated comparison, not an exhaustive catalog. For every built-in function and whether <Constant name="fusion"/> can typecheck it, see [Snowflake functions in Fusion](/reference/resource-configs/snowflake-function-support) and BigQuery functions in Fusion (ADD BQ SQL FUNCTIONS LINK).
:::

## Functions where the arguments differ

These functions share a name but not a signature. Read the syntax row carefully before you copy a query from one platform to the other.

### DATE_TRUNC

<AppliesTo platforms="Snowflake, BigQuery, Redshift, Trino, DuckDB" />

The arguments are in the **opposite order** on each platform. This is the classic one to watch for.

<SimpleTable>

| Property | Snowflake | BigQuery |
| --- | --- | --- |
| Syntax | `DATE_TRUNC(<date_part>, <date_or_time_expr>)` | `DATE_TRUNC(<date_expression>, <date_part>)` |
| Argument order | Part first, then the date | Date first, then the part |
| Returns | Same type as the input value | Same type as the input value |
| Example | `DATE_TRUNC('month', order_date)` | `DATE_TRUNC(order_date, MONTH)` |

</SimpleTable>

:::caution Heads up
Snowflake quotes the date part as a string (`'month'`); BigQuery passes it as a keyword (`MONTH`).
:::

### LOG

<AppliesTo platforms="Snowflake, BigQuery, Redshift, Trino, DuckDB" />

The base and the value swap positions — and on BigQuery the base is optional.

<SimpleTable>

| Property | Snowflake | BigQuery |
| --- | --- | --- |
| Syntax | `LOG(<base>, <expr>)` | `LOG(<X> [, <base>])` |
| Argument order | Base first, value second | Value first, base second |
| Default | Base is required | Omit the base for the natural log |
| Returns | `FLOAT` | `FLOAT64` |
| Example | `LOG(10, 100)` returns `2` | `LOG(100, 10)` returns `2` |

</SimpleTable>

### ROUND

<AppliesTo platforms="Snowflake, BigQuery, Redshift, Trino, DuckDB" />

Same first two arguments, but BigQuery adds an optional rounding mode.

<SimpleTable>

| Property | Snowflake | BigQuery |
| --- | --- | --- |
| Syntax | `ROUND(<input> [, <scale>])` | `ROUND(<X> [, <N> [, <rounding_mode>]])` |
| Extra argument | None | `rounding_mode`: `ROUND_HALF_AWAY_FROM_ZERO` (default) or `ROUND_HALF_EVEN` |
| Returns | Same type as input | `FLOAT64` or `NUMERIC` |
| Example | `ROUND(3.14159, 2)` returns `3.14` | `ROUND(2.5, 0, "ROUND_HALF_EVEN")` returns `2` |

</SimpleTable>

### REGEXP_REPLACE

<AppliesTo platforms="Snowflake, BigQuery, Redshift, Trino, DuckDB" />

Both replace text that matches a pattern, but Snowflake accepts several extra positional arguments that BigQuery doesn't.

<SimpleTable>

| Property | Snowflake | BigQuery |
| --- | --- | --- |
| Syntax | `REGEXP_REPLACE(<subject>, <pattern> [, <replacement>, <position>, <occurrence>, <parameters>])` | `REGEXP_REPLACE(<value>, <regexp>, <replacement>)` |
| Optional arguments | `position`, `occurrence`, and `parameters` (flags) | None — all three arguments are required |
| Returns | `VARCHAR` | `STRING` |
| Example | `REGEXP_REPLACE(email, '@.*$', '')` | `REGEXP_REPLACE(email, r'@.*$', '')` |

</SimpleTable>

### REGEXP_SUBSTR

<AppliesTo platforms="Snowflake, BigQuery, Redshift" />

<SimpleTable>

| Property | Snowflake | BigQuery |
| --- | --- | --- |
| Syntax | `REGEXP_SUBSTR(<subject>, <pattern> [, <position>, <occurrence>, <parameters>, <group_num>])` | `REGEXP_SUBSTR(<value>, <regexp> [, <position> [, <occurrence>]])` |
| Optional arguments | Up to four, including a capture-group selector | `position` and `occurrence` only |
| Returns | `VARCHAR` | `STRING` |
| Example | `REGEXP_SUBSTR(phone, '\\d{3}')` | `REGEXP_SUBSTR(phone, r'\d{3}')` |

</SimpleTable>

### SPLIT

<AppliesTo platforms="Snowflake, BigQuery, Trino, DuckDB" />

Both return an array, but the delimiter is required on Snowflake and optional on BigQuery.

<SimpleTable>

| Property | Snowflake | BigQuery |
| --- | --- | --- |
| Syntax | `SPLIT(<string>, <separator>)` | `SPLIT(<value> [, <delimiter>])` |
| Default | Separator is required | Defaults to a comma for strings |
| Returns | `ARRAY` | `ARRAY` |
| Example | `SPLIT('a,b,c', ',')` | `SPLIT('a,b,c')` |

</SimpleTable>

### ARRAY_TO_STRING

<AppliesTo platforms="Snowflake, BigQuery, DuckDB" />

BigQuery adds a third argument that controls how `NULL` elements are rendered.

<SimpleTable>

| Property | Snowflake | BigQuery |
| --- | --- | --- |
| Syntax | `ARRAY_TO_STRING(<array>, <separator>)` | `ARRAY_TO_STRING(<array_expression>, <delimiter> [, <null_text>])` |
| Extra argument | None — `NULL` elements are dropped | `null_text`: the string to substitute for `NULL` elements |
| Returns | `VARCHAR` | `STRING` |
| Example | `ARRAY_TO_STRING(tags, ', ')` | `ARRAY_TO_STRING(tags, ', ', 'n/a')` |

</SimpleTable>

### LPAD and RPAD

<AppliesTo platforms="Snowflake, BigQuery, Trino, DuckDB" />

Same argument order on both, but the pad string is optional on each (it defaults to a space) — worth confirming when a query relies on the default.

<SimpleTable>

| Property | Snowflake | BigQuery |
| --- | --- | --- |
| Syntax | `LPAD(<expr>, <length> [, <pad>])` | `LPAD(<original_value>, <return_length> [, <pattern>])` |
| Default pad | Single space | Single space |
| Returns | `VARCHAR` | `STRING` or `BYTES` |
| Example | `LPAD(id, 6, '0')` | `LPAD(id, 6, '0')` |

</SimpleTable>

`RPAD` follows the same pattern on both platforms.

### TRIM

<AppliesTo platforms="Snowflake, BigQuery, Redshift, Trino, DuckDB" />

The signatures match, but note that the optional character set is positional on both.

<SimpleTable>

| Property | Snowflake | BigQuery |
| --- | --- | --- |
| Syntax | `TRIM(<expr> [, <characters>])` | `TRIM(<value> [, <set_of_characters>])` |
| Default | Trims spaces | Trims spaces |
| Returns | `VARCHAR` | `STRING` or `BYTES` |
| Example | `TRIM('  hi  ')` returns `'hi'` | `TRIM('xxhixx', 'x')` returns `'hi'` |

</SimpleTable>

### LAG and LEAD

<AppliesTo platforms="Snowflake, BigQuery, Trino, DuckDB" />

These window functions line up, but double-check the offset and default arguments when you port a query.

<SimpleTable>

| Property | Snowflake | BigQuery |
| --- | --- | --- |
| Syntax | `LAG(<expr> [, <offset> [, <default>]])` | `LAG(<value_expression> [, <offset> [, <default_expression>]])` |
| Offset default | `1` | `1` |
| Returns | Same type as `expr` | Same type as `value_expression` |
| Example | `LAG(revenue, 1, 0) OVER (ORDER BY day)` | `LAG(revenue, 1, 0) OVER (ORDER BY day)` |

</SimpleTable>

`LEAD` mirrors `LAG` on both platforms.

## Functions with matching signatures

These share a name *and* call the same way on both platforms, so they port over cleanly. Syntax is shown once since it's identical. The Platforms column lists every data platform the function is available on.

| Function | Syntax | What it does | Platforms |
| --- | --- | --- | --- |
| `LOWER` / `UPPER` | `LOWER(<expr>)` | Changes string case | Snowflake, BigQuery, Redshift, Trino, DuckDB |
| `ABS` | `ABS(<expr>)` | Returns the absolute value | Snowflake, BigQuery, Redshift, Trino, DuckDB |
| `CEIL` | `CEIL(<expr>)` | Rounds up to the nearest integer | Snowflake, BigQuery, Trino, DuckDB |
| `FLOOR` | `FLOOR(<expr>)` | Rounds down to the nearest integer | Snowflake, BigQuery, Redshift, Trino, DuckDB |
| `SQRT` | `SQRT(<expr>)` | Returns the square root | Snowflake, BigQuery, Redshift, Trino, DuckDB |
| `MOD` | `MOD(<x>, <y>)` | Returns the remainder of `x / y` | Snowflake, BigQuery, Redshift, Trino |
| `GREATEST` / `LEAST` | `GREATEST(<expr1>, <expr2>, ...)` | Returns the largest or smallest argument | Snowflake, BigQuery, Trino, DuckDB |
| `COUNT` / `SUM` / `AVG` / `MIN` / `MAX` | `COUNT(<expr>)` | Standard aggregates | Snowflake, BigQuery, Redshift, Trino, DuckDB |
| `ANY_VALUE` | `ANY_VALUE(<expr>)` | Returns an arbitrary value from the group | Snowflake, BigQuery, Redshift, Trino, DuckDB |
| `ROW_NUMBER` | `ROW_NUMBER() OVER (...)` | Assigns a sequential row number | Snowflake, BigQuery, Trino, DuckDB |
| `RANK` / `DENSE_RANK` | `RANK() OVER (...)` | Ranks rows within a partition | Snowflake, BigQuery, Trino, DuckDB |
| `NTILE` | `NTILE(<n>) OVER (...)` | Splits rows into `n` buckets | Snowflake, BigQuery, Trino, DuckDB |

:::note
Even when the syntax matches, edge-case behavior (NULL handling, overflow, type coercion) can still differ. When in doubt, check the platform's own reference — linked above.
:::
