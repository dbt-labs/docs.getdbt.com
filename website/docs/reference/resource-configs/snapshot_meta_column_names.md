---
resource_types: [snapshots]
description: "Snapshot meta column names"
---

## Description

In order to align with an organization's naming conventions, the `snapshot_meta_column_names` config can be used to customize the names of the metadata columns within each dbt snapshot.

## Default

By default, dbt snapshots use the following column names to track change history using a Type 2 Slowly Changing dimension:

| Field          | Meaning | Notes |
| -------------- | ------- | ----- |
| `dbt_valid_from` | The timestamp when this snapshot row was first inserted and became valid. | The value is affected by the [`strategy`](/reference/resource-configs/strategy). |
| `dbt_valid_to`   | The timestamp when this row is no longer valid. | The value is affected by the [`dbt_valid_to_current`](/reference/resource-configs/dbt_valid_to_current) config. |
| `dbt_scd_id`     | A unique key generated for each snapshot row. | This is used internally by dbt. |
| `dbt_updated_at` | The `updated_at` timestamp of the source record when this snapshot row was inserted. | This is used internally by dbt. |

However, these column names can be customized using the `snapshot_meta_column_names` config.

:::note

To avoid any uninentional data modification, dbt will **not** automatically apply any column renames. So if a user applyies `snapshot_meta_column_names` config for a snapshot without updating the pre-existing table, they will get an error. Our recommendation is to either only use these settings for net-new snapshots, or to arrange an update of pre-existing tables prior to committing a column name change.

:::

## Examples

Suppose your organization standarizes on the following column names instead of the default values:
- `start_date`
- `end_date`
- `scd_id`
- `modified_date`

Then your configuration in a SQL snapshot file would look like:

`snapshots/dim_customers.sql`

```sql
{{
    config(
      snapshot_meta_column_names={
        dbt_valid_from: start_date,
        dbt_valid_to: end_date,
        dbt_scd_id: scd_id,
        dbt_updated_at: modified_date
      }
    )
}}
```

Alternatively, your configuration in a YAML snapshot configuration file would look like:

```yaml
      snapshot_meta_column_names:
        dbt_valid_from: start_date
        dbt_valid_to: end_date
        dbt_scd_id: scd_id
        dbt_updated_at: modified_date
```

```yaml
snapshots:
  - name: snapshot_name
    config:
      snapshot_meta_column_names:
        dbt_valid_from: start_date
        dbt_valid_to: end_date
        dbt_scd_id: scd_id
        dbt_updated_at: modified_date
```

Here's a more fleshed out example:

```yaml
snapshots:
  - name: orders_snapshot
    relation: ref("my_model")
    config:
      unique_key: id
      strategy: timestamp_with_deletes
      check_cols: all
      snapshot_meta_column_names:
        dbt_valid_from: start_date
        dbt_valid_to: end_date
        dbt_scd_id: scd_id
        dbt_updated_at: modified_date
```
