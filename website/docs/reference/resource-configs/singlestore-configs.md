---
title: "SingleStore configurations"
id: "singlestore-configs"
---

## Incremental materialization strategies
The [`incremental_strategy` config](/docs/build/incremental-models#about-incremental_strategy) controls how dbt builds incremental models. Currently, SingleStoreDB supports only the `delete+insert` configuration.

The `delete+insert` incremental strategy directs dbt to follow a two-step incremental approach. Initially, it identifies and removes the records flagged by the configured `is_incremental()` block. Subsequently, it re-inserts these records.

## Performance Optimizations
[SingleStore Physical Database Schema Design documentation](https://docs.singlestore.com/managed-service/en/create-a-database/physical-database-schema-design/concepts-of-physical-database-schema-design.html) is helpful if you want to use specific options (that are described below) in your dbt project.

### Storage type
SingleStore supports two storage types: **In-Memory Rowstore** and **Disk-based Columnstore** (the latter is default). See [the docs](https://docs.singlestore.com/managed-service/en/create-a-database/physical-database-schema-design/concepts-of-physical-database-schema-design/choosing-a-table-storage-type.html) for details. The dbt-singlestore adapter allows you to specify which storage type your table materialization would rely on using `storage_type` config parameter. 

<File name='rowstore_model.sql'>

```sql
{{ config(materialized='table', storage_type='rowstore') }}

select ...
```

</File>

### Keys

SingleStore tables are [sharded](https://docs.singlestore.com/managed-service/en/getting-started-with-managed-service/about-managed-service/sharding.html) and can be created with various column definitions. The following options are supported by the dbt-singlestore adapter, each of them accepts `column_list` (a list of column names) as an option value. Please refer to [Creating a Columnstore Table](https://docs.singlestore.com/managed-service/en/create-a-database/physical-database-schema-design/procedures-for-physical-database-schema-design/creating-a-columnstore-table.html) for more informartion on various key types in SingleStore.
- `primary_key` (translated to `PRIMARY KEY (column_list)`)
- `sort_key` (translated to `KEY (column_list) USING CLUSTERED COLUMNSTORE`)
- `shard_key` (translated to `SHARD KEY (column_list)`)
- `unique_table_key` (translated to `UNIQUE KEY (column_list)`)

<File name='primary_and_shard_model.sql'>

```sql
{{
    config(
        primary_key=['id', 'user_id'],
        shard_key=['id']
    )
}}

select ...
```

</File>

<File name='unique_and_sort_model.sql'>

```sql
{{
    config(
        materialized='table',
        unique_table_key=['id'],
        sort_key=['status'],
    )
}}

select ...
```

</File>

### Indexes
Similarly to the Postgres adapter, table models, incremental models, seeds, and snapshots may have a list of `indexes` defined. Each index can have the following components:
- `columns` (list, required): one or more columns on which the index is defined
- `unique` (boolean, optional): whether the index should be declared unique
- `type` (string, optional): a supported [index type](https://docs.singlestore.com/managed-service/en/reference/sql-reference/data-definition-language-ddl/create-index.html), `hash` or `btree`

As SingleStore tables are sharded, there are certain limitations to indexes creation, see the [docs](https://docs.singlestore.com/managed-service/en/create-a-database/physical-database-schema-design/concepts-of-physical-database-schema-design/understanding-keys-and-indexes-in-singlestore.html) for more details.

<File name='indexes_model.sql'>

```sql
{{
    config(
        materialized='table',
        shard_key=['id'],
        indexes=[{'columns': ['order_date', 'id']}, {'columns': ['status'], 'type': 'hash'}]
    )
}}

select ...
```

</File>


### Other options

You can specify the character set and collation for the table using `charset` and/or `collation` options. Supported values for `charset` are `binary`, `utf8`, and `utf8mb4`.  Supported values for `collation` can be viewed as the output of `SHOW COLLATION` SQL query. Default collations for the corresponding charcter sets are `binary`, `utf8_general_ci`, and `utf8mb4_general_ci`.

<File name='utf8mb4_model.sql'>

```sql
{{
    config(
        charset='utf8mb4',
        collation='utf8mb4_general_ci'
    )
}}

select ...
```

</File>

## Model contracts

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
