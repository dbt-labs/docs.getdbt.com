---
resource_types: [snapshots]
description: "Use the `dbt_valid_to_current` config to set a custom indicator for the value of `dbt_valid_to` in current snapshot records"
datatype: "{<dictionary>}"
default_value: {NULL}
id: "dbt_valid_to_current"
---

<VersionCallout version="1.9" />

<File name='snapshots/schema.yml'>

```yaml
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

Use the `dbt_valid_to_current` config to set a custom indicator for the value of `dbt_valid_to` in current snapshot records (like a future date). By default, this value is `NULL`. When set, dbt will use this specified value instead of `NULL` for `dbt_valid_to` for current records in the snapshot table.

This approach makes it easier to assign a custom date, work in a join, or perform range-based filtering that requires an end date.

:::warning

To avoid any unintentional data modification, dbt will _not_ automatically adjust the current value in the existing `dbt_valid_to` column. Existing current records will still have `dbt_valid_to` set to `NULL`.

Any new records inserted _after_ applying the `dbt_valid_to_current` configuration will have `dbt_valid_to` set to the specified value (like '9999-12-31'), instead of the default `NULL` value.

:::

### Considerations

- **Date expressions** &mdash; Provide a hardcoded date expression compatible with your data platform, such as to_date`('9999-12-31')`. Note that syntax may vary by warehouse (for example, `to_date('YYYY-MM-DD'`) or `date(YYYY, MM, DD)`).

- **Jinja limitation** &mdash; `dbt_valid_to_current` only accepts static SQL expressions. Jinja expressions (like `{{ var('my_future_date') }}`) are not supported.

- **Deferral and `state:modified`** &mdash; Changes to `dbt_valid_to_current` are compatible with deferral and `--select state:modified`. When this configuration changes, it'll appear in `state:modified` selections, raising a warning to manually make the necessary snapshot updates.

## Default

By default, `dbt_valid_to` is set to `NULL` for current (most recent) records in your snapshot table. This means that these records are still valid and have no defined end date.

If you prefer to use a specific value instead of `NULL` for `dbt_valid_to` in current and future records, you can use the `dbt_valid_to_current` configuration option. For example, setting a date in the far future, `9999-12-31`.

The value assigned to `dbt_valid_to_current` should be a string representing a valid date or timestamp, depending on your database's requirements. Use expressions that work within the data platform.


## Impact on snapshot records

When you set `dbt_valid_to_current`, it affects how dbt manages the `dbt_valid_to` column in your snapshot table:

- **For existing records** &mdash; To avoid any unintentional data modification, dbt will _not_ automatically adjust the current value in the existing `dbt_valid_to` column. Existing current records will still have `dbt_valid_to` set to `NULL`.

- **For new records** &mdash;  Any new records inserted after applying the `dbt_valid_to_current` configuration will have `dbt_valid_to` set to the specified value (for example, '9999-12-31'), instead of `NULL`.

This means your snapshot table will have current records with `dbt_valid_to` values of both `NULL` (from existing data) and the new specified value (from new data). If you'd rather have consistent `dbt_valid_to` values for current records, you can manually update existing records in your snapshot table (where `dbt_valid_to` is `NULL`) to match your `dbt_valid_to_current` value.

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
          (like `'9999-12-31'`).
```

</File>

The resulting snapshot table contains the configured dbt_valid_to column value:

| id | dbt_scd_id           |    dbt_updated_at    |       dbt_valid_from |     dbt_valid_to     |
| -- | -------------------- | -------------------- | -------------------- | -------------------- |
|  1 | 60a1f1dbdf899a4dd... | 2024-10-02 ...       | 2024-10-02 ...       | 9999-12-31 ...       |
|  2 | b1885d098f8bcff51... | 2024-10-02 ...       | 2024-10-02 ...       | 9999-12-31 ...       |
