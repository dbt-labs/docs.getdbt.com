---
title: "Implicit table alias rewrite for --empty"
id: "use_v2_empty_sql_rewrite"
sidebar_label: "use v2 empty SQL rewrite"
---

:::info <Constant name="fusion" />-only flag
This behavior change flag is specific to dbt v2.1 and has no equivalent in <Constant name="core" />.
:::

<SimpleTable>
| use_v2_empty_sql_rewrite | dbt v2.1 |
|---|---|
| Introduced | TBD |
| Matured (default → `true`) | — |
| Removed | — |
</SimpleTable>

This flag is relevant if your models use implicit table aliases, where column names are qualified with the relation name but no `AS` alias follows the `ref()` or `source()`. For example:

```sql
select
  my_table.col_a
from {{ source('ds', 'my_table') }}
```

By default, the [`--empty` flag](/docs/build/empty-flag) replaces every `ref()`, `source()`, and `{{ this }}` with an anonymous zero-row subquery, which drops the implicit alias. The query then fails at runtime because `my_table` no longer exists as a named relation.

When you set `use_v2_empty_sql_rewrite` to `true`, dbt rewrites each `ref()`, `source()`, and `{{ this }}` into a named zero-row subquery that preserves the alias.

For example:

```sql
-- before rewrite (default --empty behavior)
from {{ source('ds', 'my_table') }}
-- compiles to:
from (select * from ds.my_table where false limit 0)

-- after rewrite (use_v2_empty_sql_rewrite: true)
from {{ source('ds', 'my_table') }}
-- compiles to:
from (select * from ds.my_table where false limit 0) as my_table
```

If you write an explicit alias after the `ref()` or `source()`, dbt preserves that instead. Note if your SQL qualifies columns with a schema-prefixed name (for example, `my_schema.my_table.col_a`), the flag does not resolve the error. Use the bare table name or add an explicit alias after the `ref()` or `source()`.

This flag works with all [v2 supported adapters](/docs/supported-data-platforms) except ClickHouse. In a multi-adapter project, if the default adapter supports the rewrite but a model with `ref()`, `source()`, or `{{ this }}` targets an unsupported adapter, dbt raises an error.

## Limitations

When a rewrite fails, dbt raises the `EmptyRewriteFailed` error &mdash; it does not fall back to running the model against full data. The following patterns cause an error when you enable this flag:

- **Snowflake Time Travel**: dbt cannot replace a `ref()` followed by `AT`, `BEFORE`, or `CHANGES` with a subquery. Remove the Time Travel clause when running with `--empty`, or disable the flag.
- **BigQuery wildcard tables without an explicit alias**: A wildcard table (`` `project.dataset.events_*` ``) has no stable name to use for the generated subquery. Add an explicit alias after the `ref()`, or disable the flag.
