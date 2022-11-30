---
title: Can I build my models in a schema other than my target schema or split my models across multiple schemas?
description: "You can build models outside target schema"
sidebar_label: 'How to build models in schema(s) outside target schema'
id: model-custom-schemas

---

Yes! Use the [schema](reference/resource-configs/schema.md) configuration in your `dbt_project.yml` file, or using a `config` block:

<File name='dbt_project.yml'>

```yml

name: jaffle_shop
...

models:
  jaffle_shop:
    marketing:
      schema: marketing # seeds in the `models/mapping/ subdirectory will use the marketing schema
```

</File>

<File name='models/customers.sql'>

```sql
{{
  config(
    schema='core'
  )
}}
```

</File>
