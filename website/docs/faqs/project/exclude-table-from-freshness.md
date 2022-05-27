---
title: How do I exclude a table from a freshness snapshot?
description: "Use null to exclude a table from a freshness snapshot"
sidebar_label: 'Exclude a table from freshness snapshot '
id: exclude-table-from-freshness

---

Some tables in a data source may be updated infrequently. If you've set a `freshness` property at the source level, this <Term id="table" /> is likely to fail checks.

To work around this, you can set the table's freshness to null (`freshness: null`) to "unset" the freshness for a particular table:

<File name='models/<filename>.yml'>

```yaml

version: 2

sources:
  - name: jaffle_shop
    database: raw

    freshness:
      warn_after: {count: 12, period: hour}
      error_after: {count: 24, period: hour}

    loaded_at_field: _etl_loaded_at

    tables:
      - name: orders
      - name: product_skus
        freshness: null # do not check freshness for this table
```

</File>
