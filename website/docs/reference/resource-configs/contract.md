---
resource_types: [models]
datatype: "{<dictionary>}"
default_value: {contract: false}
id: "contract"
---


## Related documentation
- [What is a model contract?](publish/model-contracts)
- [Defining `columns`](resource-properties/columns)
- [Defining `constraints`](resource-properties/constraints)

<!-- TODO: move some of this content elsewhere, and update to reflect new proposed syntax -->

:::info Beta functionality
This functionality is new in v1.5! These docs exist to provide a high-level overview of what's to come. Specific syntax is liable to change.

In particular:
- The current name of the `contract` config is `constraints_enabled`.
- "Prerequisite check includes column `name` only and is order-sensitive. The goal is to add `data_type` and make it insensitive to column order.
:::

# Definition

When the `contract` configuration is enabled, dbt will ensure that your model's returned dataset exactly matches the attributes you have defined in yaml:
- `name` and `data_type` for every column
- additional [`constraints`](resource-properties/constraints), as supported for this materialization + data platform

:::caution Under construction 🚧
More to come!
:::

You can manage data type constraints on your models using the `constraints_enabled` configuration. This configuration is available on all models, and is disabled by default. When enabled, dbt will automatically add constraints to your models based on the data types of the columns in your model's schema. This is a great way to ensure your data is always in the correct format. For example, if you have a column in your model that is defined as a `date` data type, dbt will automatically add a data type constraint to that column to ensure the data in that column is always a valid date. If you want to add a `not null` constraint to a column in a preventative manner rather than as a test, you can add the `not null` value to the column definition in your model's schema: `constraints: ['not null']`.

## When to use constraints vs. tests

Constraints serve as a **preventative** measure against bad data quality **before** the dbt model is (re)built. It is only limited by the respective database's funcionality and the data types that are supported. Examples of a constraint: `not null`, `unique`, `primary key`, `foreign key`, `check`

Tests serve as a **detective** measure against bad data quality **after** the dbt model is (re)built.

Constraints are great when you define `constraints: ['not null']` for a column in your model's schema because it'll prevent `null` values being inserted into that column at dbt model creation time. AND it'll prevent other unintended values from being inserted into that column without dbt's intervention as it relies on the database to enforce the constraint. This can **replace** the `not_null` test. However, performance issues may arise depending on your database.

Tests should be used in addition to and instead of constraints when you want to test things like `accepted_values` and `relationships`. These are usually not enforced with built-in database functionality and are not possible with constraints. Also, custom tests will allow more flexibility and address nuanced data quality issues that may not be possible with constraints.

## Current Limitations

- `contract` (a.k.a. `constraints_enabled`) must be configured in the yaml [`config`] property _only_. Setting this configuration via in-file config or in `dbt_project.yml` is not supported.
- `contract` (a.k.a. `constraints_enabled`) is supported only for a SQL model materialized as `table`.
- "Pre flight" checks include the column `name`, but not yet their `data_type`. It is our intent to support `data_type` verification in a forthcoming beta prerelease.
- The order of columns in your `yml` file must match exactly the order of columns as returned by your model's SQL query.
- While most data platforms support `not_null` checks, support for [additional `constraints`](resource-properties/constraints) varies by data platform.

```txt
# example error message
Compilation Error in model constraints_example (models/constraints_examples/constraints_example.sql)
  Please ensure the name, order, and number of columns in your `yml` file match the columns in your SQL file.
  Schema File Columns: ['id', 'date_day', 'color']
  SQL File Columns: ['id', 'color', 'date_day'] 
```

## Example

<File name='models/schema.yml'>

```yml
models:
  - name: constraints_example
    config:
      constraints_enabled: true
    columns:
      - name: id
        data_type: integer
        description: hello
        constraints: ['not null', 'primary key']
        constraints_check: (id > 0)
        tests:
          - unique
      - name: color
        constraints:
          - not null
          - primary key
        data_type: string
      - name: date_day
        data_type: date
```

</File>