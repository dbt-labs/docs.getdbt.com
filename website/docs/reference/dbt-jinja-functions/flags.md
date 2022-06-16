---
title: "flags"
id: "flags"
---

The `flags` variable contains values of flags provided on the command line.

__Example usage:__

<File name='flags.sql'>

```sql
{% if flags.FULL_REFRESH %}
drop table ...
{% else %}
-- no-op
{% endif %}
```

</File>

The list of available flags is defined in the [`flags` module](https://github.com/dbt-labs/dbt-core/blob/HEAD/core/dbt/flags.py) within `dbt-core`.

Recommended use cases include:
- different <Term id="materialization" /> logic based on "run modes," such as `flags.FULL_REFRESH` and `flags.STORE_FAILURES`
- running hooks conditionally based on the current command / task type, via `flags.WHICH`

**Note:** It is _not_ recommended to use flags as an input to parse-time configurations, properties, or dependencies (`ref` + `source`). Flags are likely to change in every invocation of dbt, and their parsed values will become stale (and yield incorrect results) in subsequent invocations that have partial parsing enabled. For more details, see [the docs on parsing](parsing).
