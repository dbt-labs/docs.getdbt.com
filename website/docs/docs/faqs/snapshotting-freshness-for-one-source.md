---
title: How do I snapshot freshness for one source only?
---


Use the `--select` flag to snapshot freshness for specific sources. Eg:

```
# Snapshot freshness for all Snowplow tables:
$ dbt source freshness --select jaffle_shop

# Snapshot freshness for a particular source <Term id="table" />:
$ dbt source freshness --select jaffle_shop.orders

# Snapshot freshness for multiple particular source tables:
$ dbt source freshness --select jaffle_shop.orders jaffle_shop.customers
```

See the [`source freshness` command reference](commands/source) for more information.
