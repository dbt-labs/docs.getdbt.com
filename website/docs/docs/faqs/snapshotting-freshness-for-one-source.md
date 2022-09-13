---
title: How do I snapshot freshness for one source only?
---

:::info As of dbt Core v0.21, you need to prefix sources with the source: selection method. In previous versions of dbt, sources were specified by name only. :::

Use the `--select` flag to snapshot freshness for specific sources. Eg:

```
# Snapshot freshness for all Jaffle Shop tables:
$ dbt source freshness --select source:jaffle_shop

# Snapshot freshness for a particular source <Term id="table" />:
$ dbt source freshness --select source:jaffle_shop.orders

# Snapshot freshness for multiple particular source tables:
$ dbt source freshness --select source:jaffle_shop.orders source:jaffle_shop.customers
```

See the [`source freshness` command reference](commands/source) for more information.
