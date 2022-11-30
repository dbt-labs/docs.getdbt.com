---
title: Can I test the uniqueness of two columns?
description: "Options to test uniqueness of two columns"
sidebar_label: 'Test the uniqueness of two columns'
id: uniqueness-two-columns

---

Yes, There's a few different options.


Consider an orders <Term id="table" /> that contains records from multiple countries, and the combination of ID and country code is unique:

| order_id | country_code |
|----------|--------------|
| 1        | AU           |
| 2        | AU           |
| ...      | ...          |
| 1        | US           |
| 2        | US           |
| ...      | ...          |


Here are some approaches:

#### 1. Create a unique key in the model and test that

<File name='models/orders.sql'>

```sql

select
  country_code || '-' || order_id as surrogate_key,
  ...

```

</File>

<File name='models/orders.yml'>

```yml
version: 2

models:
  - name: orders
    columns:
      - name: surrogate_key
        tests:
          - unique

```

</File>


#### 2. Test an expression

<File name='models/orders.yml'>

```yml
version: 2

models:
  - name: orders
    tests:
      - unique:
          column_name: "(country_code || '-' || order_id)"
```

</File>


#### 3. Use the `dbt_utils.unique_combination_of_columns` test

This is especially useful for large datasets since it is more performant. Check out the docs on [packages](/docs/build/packages) for more information.

<File name='models/orders.yml'>

```yml
version: 2

models:
  - name: orders
    tests:
      - dbt_utils.unique_combination_of_columns:
          combination_of_columns:
            - country_code
            - order_id
```

</File>
