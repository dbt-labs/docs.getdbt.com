---
title: How do I set a datatype for a column in my seed?
description: "Use column_types to set a datatype"
sidebar_label: 'Set a datatype for a column in seed'
id: seed-datatypes

---
dbt will infer the datatype for each column based on the data in your CSV.

You can also explicitly set a datatype using the `column_types` [configuration](reference/resource-configs/column_types.md) like so:

<File name='dbt_project.yml'>

```yml
seeds:
  jaffle_shop: # you must include the project name
    warehouse_locations:
      +column_types:
        zipcode: varchar(5)
```

</File>
