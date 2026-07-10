---
title: "Model contracts"
sidebar_label: "Model contracts"
description: "Learn how the SingleStore adapter supports model contracts, including which constraint types are supported and enforced."
---

Starting from 1.5, the `dbt-singlestore` adapter supports model contracts.

| Constraint type | Support         | Platform enforcement |
|:----------------|:----------------|:------------------|
| not_null        | ✅  Supported    | ✅ Enforced     |
| primary_key     | ✅  Supported    | ❌ Not enforced  |
| foreign_key     | ❌  Not supported | ❌ Not enforced  |
| unique          | ✅  Supported    | ❌ Not enforced  |
| check           | ❌ Not supported | ❌  Not enforced |


Consider the following restrictions while using contracts with the `dbt-singlestore` adapter:

### Model and Column Definitions:
   - The `unique` constraint can only be set at the model level. Hence, do not set it at the column level.
   - Repeating constraints will return an error. For example, setting `primary_key` in both column and model settings returns an error.

### Overwriting Settings:

The contract setting overrides the configuration setting. For example, if you define a `primary_key` or `unique_table_key` in the config and then also set it in the contract, the contract setting replaces the configuration setting.

### Working with constants:

<File name='dim_customers.yml'>

```sql
models:
  - name: dim_customers
    config:
      materialized: table
      contract:
        enforced: true
    columns:
      - name: customer_id
        data_type: int
        constraints:
          - type: not_null
      - name: customer_name
        data_type: text
```

</File>

Let's say your model is defined as:

<File name='dim_customers.sql'>

```sql
select
  'abc123' as customer_id,
  'My Best Customer' as customer_name
```

</File>

When using constants, you must specify the data types directly. If not, SingleStoreDB will automatically choose what it thinks is the most appropriate data type.

<File name='dim_customers.sql'>

```sql
select
  ('abc123' :> int) as customer_id,
  ('My Best Customer' :> text) as customer_name
```

</File>

### Misleading datatypes

Using `model contracts` ensures that you don't accidentally add the wrong type of data into a column. For instance, if you expect a number in a column, but accidentally specify text to be added, the model contract catches it and returns an error.

The error message may occasionally show a different data type name than expected, because of how the `singlestoredb-python` connector works. For instance,

<File name='dim_customers.sql'>

```sql
select
  'abc123' as customer_id,
  ('My Best Customer' :> text) as customer_name
```

</File>

will result in

```sql
Please ensure the name, data_type, and number of columns in your contract match the columns in your model's definition.
| column_name | definition_type | contract_type | mismatch_reason       |
| customer_id | LONGBLOB        | LONG          | data type mismatch    |
```

It's important to note that certain data type mappings might show up differently in error messages, but this doesn't affect how they work. Here's a quick list of what you might see:

| Data type  | Data type returned by<br/>singlestoredb-python |
|:-----------|:-----------------------------------------------|
| BOOL       | TINY                                           |
| INT        | LONG                                           |
| CHAR       | BINARY                                         |
| VARCHAR    | VARBINARY                                      |
| TEXT       | BLOB                                           |
| TINYTEXT   | TINYBLOB                                       |
| MEDIUMTEXT | MEDIUMBLOB                                     |
| LONGTEXT   | LONGBLOB                                       |


Just keep these points in mind when setting up and using your `dbt-singlestore` adapter, and you'll avoid common pitfalls!
