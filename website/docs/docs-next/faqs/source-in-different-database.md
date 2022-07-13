---
title: What if my source is in a different database to my target database?
---

Use the [`database` property](resource-properties/database) to define the database that the source is in.

<File name='models/<filename>.yml'>

```yml
version: 2

sources:
  - name: jaffle_shop
    database: raw
    tables:
      - name: orders
      - name: customers

```

</File>
