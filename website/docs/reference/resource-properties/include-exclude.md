---
resource_types: [models]
title: include
required: no
---


<File name='models/<schema>.yml'>

```yml
version: 2

models:
  
  # top-level model properties
  - name: <model_name>
    [columns](/reference/resource-properties/columns):
      - name: <column_name> # required
    
    # versions of this model
    [versions](/reference/resource-properties/versions):
      - v: <version_identifier> # required
        columns:
          - include: '*' | 'all' | [<column_name>, ...]
            exclude:
              - <column_name>
              - ... # declare additional column names to exclude
          
          # declare more columns -- can be overrides from top-level, or in addition
          - name: <column_name>
            ...

```

</File>

## Definition
The specification of which columns are defined in a model's top-level `columns` property to include or exclude in a versioned implementation of that model.

`include` is either:
- a list of specific column names to include
- `'*'` or `'all'`, indicating that **all** columns from the top-level `columns` property should be included in the versioned model

`exclude` is a list of column names to exclude. It can only be declared if `include` is set to one of `'*'` or `'all'`. 

The `columns` list of a versioned model can have _at most one_ `include/exclude` element.

You may declare additional columns within the version's `columns` list. If a version-specific column's `name` matches a column included from the top level, the version-specific entry will override that column for that version.

## Default

By default, `include` is "all", and `exclude` is the empty list. This has the effect of including all columns from the base model in the versioned model.

## Example

<File name='models/customers.yml'>

```yml
models:
  - name: customers
    columns:
      - name: customer_id
        description: Unique identifier for this table
        data_type: text
        constraints:
          - type: not_null
        tests:
          - unique
      - name: customer_country
        data_type: text
        description: "Country where the customer currently lives"
      - name: first_purchase_date
        data_type: date
    
    versions:
      - v: 4
      
      - v: 3
        columns:
          - include: "*"
          - name: customer_country
            data_type: text
            description: "Country where the customer first lived at time of first purchase"
      
      - v: 2
        columns:
          - include: "*"
            exclude:
              - customer_country
      
      - v: 1
        columns:
          - include: []
          - name: id
            data_type: int
```

</File>

Because `v4` has not specified any `columns`, it will include all of the top-level `columns`.

Each other version has declared a modification from the top-level property:
- `v3` will include all columns, but it reimplements the `customer_country` column with a different `description`
- `v2` will include all columns *except* `customer_country`
- `v1` doesn't include *any* of the top-level `columns`. Instead, it declares only a single integer column named `id`.
