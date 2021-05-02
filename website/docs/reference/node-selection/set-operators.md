---
title: "Set operators"
---

### Unions
Providing multiple space-delineated arguments to the `--models`, `--exclude`, or `--selector` flags selects
the union of them all. If a resource is included in at least one selector, it will be 
included in the final set.

Run snowplow_sessions, all ancestors of snowplow_sessions, fct_orders, and all ancestors of fct_orders:
```bash
$ dbt run --models +snowplow_sessions +fct_orders
```

### Intersections
<Changelog>New in v0.18.0</Changelog>

If multiple arguments to `--models`, `--exclude`, and `--select` can be comma-separated (with no whitespace in between),
dbt will select only resources which satisfy _all_ arguments.

Run all the common ancestors of snowplow_sessions and fct_orders:
```bash
$ dbt run --models +snowplow_sessions,+fct_orders
```

Run all the common descendents of stg_invoices and stg_accounts:
```bash
$ dbt run --models stg_invoices+,stg_accounts+
```

Run models that are in the marts/finance subdirectory *and* tagged nightly:
```bash
$ dbt run --models marts.finance,tag:nightly
```
