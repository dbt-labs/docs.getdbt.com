---
title: Can I build my seeds in a schema other than my target schema?
---
## Or: Can I split my seeds across multiple schemas?

Yes! Use the [schema](reference/resource-configs/schema.md) configuration in your `dbt_project.yml` file.

<File name='dbt_project.yml'>

```yml

name: jaffle_shop
...

seeds:
  jaffle_shop:
    schema: mappings # all seeds in this project will use the mapping schema by default
    marketing:
      schema: marketing # seeds in the `seeds/mapping/ subdirectory will use the marketing schema
```

</File>
