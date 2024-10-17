---
resource_types: [snapshots]
description: "Snapshot dbt_valid_to_current custom date"
datatype: "{<dictionary>}"
default_value: {"dbt_valid_from": "dbt_valid_from", "dbt_valid_to": "dbt_valid_to", "dbt_scd_id": "dbt_scd_id", "dbt_updated_at": "dbt_updated_at"}
id: "dbt_valid_to_current"
---

Available in 1.9 or with [Versionless](/docs/dbt-versions/upgrade-dbt-version-in-cloud#versionless) dbt Cloud.

<File name='snapshots/schema.yml'>

```yaml:
snapshots:
  my_project:
    +dbt_valid_to_current: "to_date('9999-12-31')"

```

</File>

<File name='snapshots/<filename>.sql'>

```sql
{{
    config(
        unique_key='id',
        strategy='timestamp',
        updated_at='updated_at',
        dbt_valid_to_current='to_date('9999-12-31')'
    )
}}


```

</File>

<File name='dbt_project.yml'>

```yml
snapshots:
  [<resource-path>](/reference/resource-configs/resource-path):
    +dbt_valid_to_current: "to_date('9999-12-31')"
```

</File>

## Description

Use the `dbt_valid_to_current` config to set a custom future date for `dbt_valid_to` in new snapshot columns. When set, dbt will use this specified value instead of `NULL` for `dbt_valid_to` in the snapshot table.

This simplifies makes it easier to assign date and range-based filtering with a concrete end date.

## Default

By default, `dbt_valid_to` is set to `NULL` for current (most recent) records in your snapshot table. This indicates that these records are still valid and have no defined end date.

If you prefer to use a specific value instead of `NULL` for `dbt_valid_to` in current and future records (such as a date set in the far future, '9999-12-31'), you can use the `dbt_valid_to_current` configuration option.

The value assigned to `dbt_valid_to_current` should be a string representing a valid date or timestamp, depending on your database's requirements.

:::info
For existing records &mdash; To avoid any unintentional data modification, dbt will **not** automatically adjust the current value in the existing `dbt_valid_to` column. Existing current records will still have `dbt_valid_to` set to `NULL`.

For new records &mdash;  Any new records inserted after applying the `dbt_valid_to_current` configuration will have `dbt_valid_to` set to the specified value (for example, '9999-12-31'), instead of `NULL`.

This means your snapshot table will have current records with `dbt_valid_to` values of both `NULL` (from existing data) and the new specified value (from new data). If you'd rather have consistent `dbt_valid_to` values for current records, you can either manually update existing records in your snapshot table where `dbt_valid_to` is `NULL` to match your `dbt_valid_to_current` value or rebuild your snapshot table.
:::

## Example

<File name='snapshots/schema.yml'>

```yaml
snapshots:
  - name: my_snapshot
    config:
      strategy: timestamp
      updated_at: updated_at
      dbt_valid_to_current: "to_date('9999-12-31')"
    columns:
      - name: dbt_valid_from
        description: The timestamp when the record became valid.
      - name: dbt_valid_to
        description: >
          The timestamp when the record ceased to be valid. For current records,
          this is either `NULL` or the value specified in `dbt_valid_to_current`
          (e.g., `'9999-12-31'`).
```

</File>

The resulting snapshot table contains the configured dbt_valid_to column value:

| id | dbt_scd_id           |    dbt_updated_at    |       dbt_valid_from |     dbt_valid_to     |
| -- | -------------------- | -------------------- | -------------------- | -------------------- |
|  1 | 60a1f1dbdf899a4dd... | 2024-10-02 ...       | 2024-10-02 ...       | 9999-12-31 ...       |
|  2 | b1885d098f8bcff51... | 2024-10-02 ...       | 2024-10-02 ...       | 9999-12-31 ...       |
