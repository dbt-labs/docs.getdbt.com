---
resource_types: [snapshots]
description: "Snapshot meta column names"
datatype: "{<dictionary>}"
default_value: {"dbt_valid_from": "dbt_valid_from", "dbt_valid_to": "dbt_valid_to", "dbt_scd_id": "dbt_scd_id", "dbt_updated_at": "dbt_updated_at"}
id: "snapshot_meta_column_names"
---

Starting in 1.9 or with [versionless](/docs/dbt-versions/upgrade-dbt-version-in-cloud#versionless) dbt Cloud.

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

```

</File>

## Description

In order to align with an organization's naming conventions, the `snapshot_meta_column_names` config can be used to customize the names of the [metadata columns](/docs/build/snapshots#snapshot-meta-fields) within each snapshot.

## Default

By default, dbt snapshots use the following column names to track change history using [Type 2 slowly changing dimension](https://en.wikipedia.org/wiki/Slowly_changing_dimension#Type_2:_add_new_row) records:

| Field          | Meaning | Notes |
| -------------- | ------- | ----- |
| `dbt_valid_from` | The timestamp when this snapshot row was first inserted and became valid. | The value is affected by the [`strategy`](/reference/resource-configs/strategy). |
| `dbt_valid_to`   | The timestamp when this row is no longer valid. |  |
| `dbt_scd_id`     | A unique key generated for each snapshot row. | This is used internally by dbt. |
| `dbt_updated_at` | The `updated_at` timestamp of the source record when this snapshot row was inserted. | This is used internally by dbt. |

However, these column names can be customized using the `snapshot_meta_column_names` config.

:::warning

To avoid any unintentional data modification, dbt will **not** automatically apply any column renames. So if a user applies `snapshot_meta_column_names` config for a snapshot without updating the pre-existing table, they will get an error. We recommend either only using these settings for net-new snapshots, or arranging an update of pre-existing tables prior to committing a column name change.

:::

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
      snapshot_meta_column_names:
        dbt_valid_from: start_date
        dbt_valid_to: end_date
        dbt_scd_id: scd_id
        dbt_updated_at: modified_date
```

</File>

The resulting snapshot table contains the configured meta column names:

| id | scd_id               |        modified_date |           start_date |             end_date |
| -- | -------------------- | -------------------- | -------------------- | -------------------- |
|  1 | 60a1f1dbdf899a4dd... | 2024-10-02 ...       | 2024-10-02 ...       | 2024-10-02 ...       |
|  2 | b1885d098f8bcff51... | 2024-10-02 ...       | 2024-10-02 ...       |                      |
