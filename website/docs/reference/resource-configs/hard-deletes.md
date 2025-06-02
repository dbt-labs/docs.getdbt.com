---
title: hard_deletes
resource_types: [snapshots]
description: "Use the `hard_deletes` config to control how deleted rows are tracked in your snapshot table."
datatype: "boolean"
default_value: {ignore}
id: "hard-deletes"
sidebar_label: "hard_deletes"
---

<VersionCallout version="1.9" />

<File name='snapshots/schema.yml'>

```yaml
snapshots:
  - name: <snapshot_name>
    config:
      hard_deletes: 'ignore' | 'invalidate' | 'new_record'
```
</File>

<File name='dbt_project.yml'>

```yml
snapshots:
  [<resource-path>](/reference/resource-configs/resource-path):
    +hard_deletes: "ignore" | "invalidate" | "new_record"
```

</File>

<File name='snapshots/<filename>.sql'>

```sql
{{
    config(
        unique_key='id',
        strategy='timestamp',
        updated_at='updated_at',
        hard_deletes='ignore' | 'invalidate' | 'new_record'
    )
}}
```

</File>


## Description

The `hard_deletes` config gives you more control on how to handle deleted rows from the source. Supported options are `ignore` (default), `invalidate` (replaces the legacy `invalidate_hard_deletes=true`), and `new_record`. Note that `new_record` will create a new metadata column in the snapshot table. 

You can use `hard_deletes` with dbt-postgres, dbt-bigquery, dbt-snowflake, and dbt-redshift adapters.

import HardDeletes from '/snippets/_hard-deletes.md';

<HardDeletes />

:::warning

If you're updating an existing snapshot to use the `hard_deletes` config, dbt _will not_ handle migrations automatically. We recommend either only using these settings for net-new snapshots, or [arranging an update](/reference/snapshot-configs#snapshot-configuration-migration) of pre-existing tables before enabling this setting.
:::

## Default

By default, if you don’t specify `hard_deletes`, it'll automatically default to `ignore`. Deleted rows will not be tracked and their `dbt_valid_to` column remains `NULL`.

The `hard_deletes` config has three methods:

| Methods | Description |
| --------- | ----------- |
| `ignore` (default) | No action for deleted records. |
| `invalidate` | Behaves the same as the existing `invalidate_hard_deletes=true`, where deleted records are invalidated by setting `dbt_valid_to` to current time. This method replaces the `invalidate_hard_deletes` config to give you more control on how to handle deleted rows from the source. |
| `new_record` | Tracks deleted records as new rows using the `dbt_is_deleted` meta field when records are deleted.|

## Considerations
- **Backward compatibility**: The `invalidate_hard_deletes` config is still supported for existing snapshots but can't be used alongside `hard_deletes`.
- **New snapshots**: For new snapshots, we recommend using `hard_deletes` instead of `invalidate_hard_deletes`.
- **Migration**: If you switch an existing snapshot to use `hard_deletes` without migrating your data, you may encounter inconsistent or incorrect results, such as a mix of old and new data formats.

## Example

<File name='snapshots/schema.yml'>

```yaml
snapshots:
  - name: my_snapshot
    config:
      hard_deletes: new_record  # options are: 'ignore', 'invalidate', or 'new_record'
      strategy: timestamp
      updated_at: updated_at
    columns:
      - name: dbt_valid_from
        description: Timestamp when the record became valid.
      - name: dbt_valid_to
        description: Timestamp when the record stopped being valid.
      - name: dbt_is_deleted
        description: Indicates whether the record was deleted.
```

</File>

The resulting snapshot table contains the `hard_deletes: new_record` configuration. If a record is deleted and later restored, the resulting snapshot table might look like this:

| id | dbt_scd_id           |   Status | dbt_updated_at       |   dbt_valid_from    |     dbt_valid_to     | dbt_is_deleted | 
| -- | -------------------- | -----    | -------------------- | --------------------| -------------------- | ----------- |
|  1 | 60a1f1dbdf899a4dd... | pending  | 2024-10-02 ...       | 2024-05-19...       | 2024-05-20 ...       | False       | 
|  1 | b1885d098f8bcff51... | pending  | 2024-10-02 ...       | 2024-05-20 ...      | 2024-06-03 ...       | True        | 
|  1 | b1885d098f8bcff53... | shipped  | 2024-10-02 ...       | 2024-06-03 ...      |                      | False       | 
|  2 | b1885d098f8bcff55... | active   | 2024-10-02 ...       | 2024-05-19 ...      |                      | False       | 
 
In this example, the `dbt_is_deleted` column is set to `True` when the record is deleted. When the record is restored, the `dbt_is_deleted` column is set to `False`.
