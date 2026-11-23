---
title: "Implicit table alias rewrite for --empty"
id: "use_v2_empty_sql_rewrite"
sidebar_label: "use v2 empty SQL rewrite"
---

| use_v2_empty_sql_rewrite | <Constant name="fusion" /> |
|---|---|
| Introduced | TBD |
| Matured (default → `true`) | — |
| Removed | — |

This flag is relevant if your models use implicit table aliases, where column names are qualified with the relation name but no `AS` alias follows the `ref()` or `source()`. For example:

```sql
select my_table.col_a
from {{ ref('my_table') }}
```

By default, the [`--empty` flag](/docs/build/empty-flag) replaces every `ref()` and `source()` with an anonymous zero-row subquery, which drops the implicit alias. The query then fails at runtime because `my_table` no longer exists as a named relation.

When you set `use_v2_empty_sql_rewrite` to `true`, dbt rewrites each `ref()`, `source()`, and `{{ this }}` into a named zero-row subquery that preserves the alias:

```sql
-- before rewrite (default --empty behavior)
from (select * from my_table where false limit 0)

-- after rewrite (use_v2_empty_sql_rewrite: true)
from (select * from my_table where false limit 0) as my_table
```

If you write an explicit alias after the `ref()`, dbt preserves that instead.

This flag works with all [v2 supported adapters](/docs/supported-data-platforms) except ClickHouse. In a multi-adapter project, if the default adapter supports the rewrite but a model targets an unsupported adapter, dbt raises an `EmptyRewriteFailed` error.

## Limitations

The following patterns cause an error when you enable this flag:

- **Snowflake Time Travel**: dbt cannot replace a `ref()` followed by `AT`, `BEFORE`, or `CHANGES` with a subquery. Remove the Time Travel clause when running with `--empty`, or disable the flag.
- **BigQuery wildcard tables without an explicit alias**: A wildcard table (`` `project.dataset.events_*` ``) has no stable name to use for the generated subquery. Add an explicit alias after the `ref()`, or disable the flag.
