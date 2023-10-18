---
title: What if my source is in a poorly named schema or table?
description: "Use schema and identifier properities to define names"
sidebar_label: 'Source is in a poorly-named scheme or table'
id: source-has-bad-name

---

By default, dbt will use the `name:` parameters to construct the source reference.

If these names are a little less-than-perfect, use the [schema](/reference/resource-properties/schema) and [identifier](/reference/resource-properties/identifier) properties to define the names as per the database, and use your `name:` property for the name that makes sense!

<File name='models/<filename>.yml'>

```yml
version: 2

sources:
  - name: jaffle_shop
    schema: postgres_backend_public_schema
    database: raw
    tables:
      - name: orders
        identifier: api_orders


```

</File>


In a downstream model:
```sql
select * from {{ source('jaffle_shop', 'orders') }}
```

Will get compiled to:
```sql
select * from raw.postgres_backend_public_schema.api_orders
```
