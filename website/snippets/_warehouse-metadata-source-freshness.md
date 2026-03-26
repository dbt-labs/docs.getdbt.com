### Warehouse metadata used for source freshness

When you do not set `loaded_at_field` or `loaded_at_query`, state-aware orchestration and the `dbt source freshness` command use adapter-specific warehouse metadata to detect when source data changed. The exact table or column used varies by warehouse.

| Warehouse | Metadata table | Column |
| --------- | -------------- | ------ |
| BigQuery | `INFORMATION_SCHEMA.TABLE_STORAGE` | `storage_last_modified_time` |
| Databricks | `system.information_schema.tables` | `last_altered` |
| Redshift | `SHOW TABLES FROM SCHEMA` | `last_modified_time` |
| Snowflake | `INFORMATION_SCHEMA.TABLES` | `LAST_ALTERED` |
<br/>
For sources that are views, dbt cannot determine freshness from warehouse metadata; use `loaded_at_field` or `loaded_at_query` instead.
