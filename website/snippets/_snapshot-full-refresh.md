:::info Snapshots ignore full refresh

Snapshots ignore both the `full_refresh` config and the `--full-refresh` flag. A command such as `dbt build --full-refresh` or `dbt snapshot --full-refresh` that includes a snapshot node runs the snapshot as normal — it won't drop or recreate the snapshot table, so existing snapshot history is preserved.

:::
