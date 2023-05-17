---
title: I need to use quotes to select from my source, what should I do?
description: "Use quoting property to quote values"
sidebar_label: 'How to quote values'
id: source-quotes

---

This is reasonably common on Snowflake in particular.

By default, dbt will not quote the database, schema, or identifier for the source tables that you've specified.

To force dbt to quote one of these values, use the [`quoting` property](/reference/resource-properties/quoting):

<File name='models/<filename>.yml'>

```yaml
version: 2

sources:
  - name: jaffle_shop
    database: raw
    quoting:
      database: true
      schema: true
      identifier: true

    tables:
      - name: order_items
      - name: orders
        # This overrides the `jaffle_shop` quoting config
        quoting:
          identifier: false
```

</File>
