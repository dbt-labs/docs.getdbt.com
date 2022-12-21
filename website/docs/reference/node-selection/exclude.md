---
title: "Exclude"
---

### Excluding models
dbt provides an `--exclude` flag with the same semantics as `--select`. Models specified with the `--exclude` flag will be removed from the set of models selected with `--select`.

<VersionBlock firstVersion="0.21">

```bash
$ dbt run --select my_package.*+ --exclude my_package.a_big_model+    # select all models in my_package and their children except a_big_model and its children
```

</VersionBlock>
<VersionBlock lastVersion="0.20">

```bash
$ dbt run --models my_package.*+ --exclude my_package.a_big_model+
```

</VersionBlock>

Exclude a specific resource by its name or lineage:

```bash
# test
$ dbt test --exclude not_null_orders_order_id   # test all models except the not_null_orders_order_id test
$ dbt test --exclude orders                     # test all models except tests associated with the orders model

# seed
$ dbt seed --exclude account_parent_mappings    # load all seeds except account_parent_mappings

# snapshot
$ dbt snapshot --exclude snap_order_statuses    # execute all snapshots except snap_order_statuses
```
