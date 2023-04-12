---
resource_types: [models]
title: include
required: no
---


<File name='models/<schema>.yml'>

```yml
version: 2

models:
  - name: model_name
    columns:
      - name: <base_column_name> # required
    versions: 
      - v: <version_identifier> # required
        columns:
          - include: '*' | 'all' | [<base_column_name>, ...]
            exclude:
              - <excluded_base_column_name>
              - ... # declare additional column names to exclude

```

</File>

## Definition
The specification of which columns defined in a base model to include or exclude in a versioned model.

`include` is either a list of specific column names to include, or one of: "*" or "all" - indicating that all columns from the base model should be included in the versioned model.

`exclude` is a list of column names to exclude, and can only be declared if `include` is set to one of "*" or "all".  

The `columns` list of a versioned model can have _at most one_ `include/exclude` element. Whether the `columns` list contains an `include/exclude` element or not, _additional_ column names can be declared in the model version's `column` list.

## Default
By default, `include` is "all", and `exclude` is the empty list. This has the effect of including all columns from the base model in the versioned model.