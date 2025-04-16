---
title: How do I snapshot freshness for one source only?
description: "Use select flag to snapshot for specific sources"
sidebar_label: 'Snapshot freshness for specific sources.'
id: snapshotting-freshness-for-one-source

---


Use the `--select` flag to snapshot freshness for specific sources. Eg:

```shell
# Snapshot freshness for all Jaffle Shop tables:
$ dbt source freshness --select source:jaffle_shop

# Snapshot freshness for a particular source <Term id="table" />:
$ dbt source freshness --select source:jaffle_shop.orders

# Snapshot freshness for multiple particular source tables:
$ dbt source freshness --select source:jaffle_shop.orders source:jaffle_shop.customers
```

See the [`source freshness` command reference](/reference/commands/source) for more information.
