---
resource_types: [snapshots]
description: "Snapshot meta column names"
datatype: "{<dictionary>}"
default_value: {"dbt_valid_from": "dbt_valid_from", "dbt_valid_to": "dbt_valid_to", "dbt_scd_id": "dbt_scd_id", "dbt_updated_at": "dbt_updated_at"}
id: "snapshot_meta_column_names"
---

<VersionCallout version="1.9" />

<File name='snapshots/schema.yml'>

```yaml
snapshots:
  - name: <snapshot_name>
    config:
      snapshot_meta_column_names:
        dbt_valid_from: <string>
        dbt_valid_to: <string>
        dbt_scd_id: <string>
        dbt_updated_at: <string>
        dbt_is_deleted: <string>

```

</File>

<File name='snapshots/<filename>.sql'>

```jinja2
{{
    config(
      snapshot_meta_column_names={
        "dbt_valid_from": "<string>",
        "dbt_valid_to": "<string>",
        "dbt_scd_id": "<string>",
        "dbt_updated_at": "<string>",
        "dbt_is_deleted": "<string>",
      }
    )
}}

```

</File>

<File name='dbt_project.yml'>

```yml
snapshots:
  [<resource-path>](/reference/resource-configs/resource-path):
    +snapshot_meta_column_names:
      dbt_valid_from: <string>
      dbt_valid_to: <string>
      dbt_scd_id: <string>
      dbt_updated_at: <string>
      dbt_is_deleted: <string>
```

</File>

## Description

In order to align with an organization's naming conventions, the `snapshot_meta_column_names` config can be used to customize the names of the [metadata columns](/docs/build/snapshots#snapshot-meta-fields) within each snapshot.

## Default

By default, dbt snapshots use the following column names to track change history using [Type 2 slowly changing dimension](https://en.wikipedia.org/wiki/Slowly_changing_dimension#Type_2:_add_new_row) records:

| Field          | <div style={{width:'250px'}}>Meaning</div> | Notes | Example |
| -------------- | ------- | ----- | ------- |
| `dbt_valid_from` | The timestamp when this snapshot row was first inserted and became valid. | The value is affected by the [`strategy`](/reference/resource-configs/strategy). | `snapshot_meta_column_names: {dbt_valid_from: start_date}` |
| `dbt_valid_to`   | The timestamp when this row is no longer valid. |  | `snapshot_meta_column_names: {dbt_valid_to: end_date}` |
| `dbt_scd_id`     | A unique key generated for each snapshot row. | This is used internally by dbt. | `snapshot_meta_column_names: {dbt_scd_id: scd_id}` |
| `dbt_updated_at` | The `updated_at` timestamp of the source record when this snapshot row was inserted. | This is used internally by dbt. | `snapshot_meta_column_names: {dbt_updated_at: modified_date}` |
| `dbt_is_deleted` | A string value indicating if the record has been deleted. (`True` if deleted, `False` if not deleted). |Added when `hard_deletes='new_record'` is configured.  | `snapshot_meta_column_names: {dbt_is_deleted: is_deleted}` |

All of these column names can be customized using the `snapshot_meta_column_names` config. Refer to the [Example](#example) for more details. 

:::warning  

To avoid any unintentional data modification, dbt will **not** automatically apply any column renames. So if a user applies `snapshot_meta_column_names` config for a snapshot without updating the pre-existing table, they will get an error. We recommend either only using these settings for net-new snapshots, or arranging an update of pre-existing tables prior to committing a column name change.

:::

## How [`dbt_scd_id`](/reference/resource-configs/snapshot_meta_column_names#default) is calculated

`dbt_scd_id` is a unique identifier generated for each row in a snapshot. dbt uses this identifier to detect changes in source records and manage versioning in slowly changing dimension (SCD) snapshots.

dbt's snapshot macro handles `dbt_scd_id` in [the dbt-adapters repository](https://github.com/dbt-labs/dbt-adapters/blob/b12c9870d6134905ab09bfda609ce8f81bc4b40a/dbt/include/global_project/macros/materializations/snapshots/strategies.sql#L38).

The hash is computed by concatenating values of the snapshot's [`unique_key`](/reference/resource-configs/unique_key) and either the `updated_at` timestamp (for the timestamp strategy) or the values in `check_cols` (for the check strategy), and then hashing the resulting string using the `md5` function.  This enables dbt to track whether the contents of a row have changed between runs.

Here's an example of a custom hash calculation that combines multiple fields into a single string and hashes the result using `md5`.

 ```sql
 md5(
  coalesce(cast(unique_key1 as string), '') || '|' ||
  coalesce(cast(unique_key2 as string), '') || '|' ||
  coalesce(cast(updated_at as string), '')
)
```
The exact fields included in the hash depend on the snapshot strategy:

- [`timestamp` strategy](/reference/resource-configs/strategy#use-the-timestamp-strategy): The hash typically combines the [`unique_key`](/reference/resource-configs/unique_key) columns and the `updated_at` value.
- [`check` strategy](/reference/resource-configs/strategy#use-the-check-strategy): The hash combines the `unique_key` columns and the values of the columns listed in [`check_cols`](/reference/resource-configs/check_cols).

If you don’t want to use `md5`, you can customize the [dispatched macro](https://github.com/dbt-labs/dbt-adapters/blob/4b3966efc50b1d013907a88bee4ab8ebd022d17a/dbt-adapters/src/dbt/include/global_project/macros/materializations/snapshots/strategies.sql#L42-L47).  

## Example

<File name='snapshots/schema.yml'>

```yaml
snapshots:
  - name: orders_snapshot
    relation: ref("orders")
    config:
      unique_key: id
      strategy: check
      check_cols: all
      hard_deletes: new_record
      snapshot_meta_column_names:
        dbt_valid_from: start_date
        dbt_valid_to: end_date
        dbt_scd_id: scd_id
        dbt_updated_at: modified_date
        dbt_is_deleted: is_deleted
```

</File>

The resulting snapshot table contains the configured meta column names:

| id | scd_id               |        modified_date |           start_date |             end_date | is_deleted |
| -- | -------------------- | -------------------- | -------------------- | -------------------- | ---------- |
|  1 | 60a1f1dbdf899a4dd... | 2024-10-02 ...       | 2024-10-02 ...       | 2024-10-03 ...       | False      |
|  1 | 60a1f1dbdf899a4dd... | 2024-10-03 ...       | 2024-10-03 ...       |                      | True      |
|  2 | b1885d098f8bcff51... | 2024-10-02 ...       | 2024-10-02 ...       |                      | False     |
