---
title: "SingleStore configurations"
id: "singlestore-configs"
---

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