---
title: "Materialized views and streaming tables"
sidebar_label: "Materialized views and streaming tables"
description: "Configure Databricks materialized views and streaming tables, including partitioning, clustering, tags, and schedules."
---

[Materialized views](https://docs.databricks.com/en/sql/user/materialized-views.html) and [streaming tables](https://docs.databricks.com/en/sql/load-data-streaming-table.html) are alternatives to incremental tables that are powered by [Delta Live Tables](https://docs.databricks.com/en/delta-live-tables/index.html).

Refer to [What are Delta Live Tables?](https://docs.databricks.com/en/delta-live-tables/index.html#what-are-delta-live-tables-datasets) for more information and use cases.

In order to adopt these materialization strategies, you will need a workspace that is enabled for Unity Catalog and serverless SQL Warehouses.

<File name='materialized_view.sql'>

```sql
{{ config(
   materialized = 'materialized_view'
 ) }}
```

</File>

or

<File name='streaming_table.sql'>

```sql
{{ config(
   materialized = 'streaming_table'
 ) }}
```

</File>

We support [on_configuration_change](/reference/resource-configs/on_configuration_change) for most available properties of these materializations. The following table summarizes our configuration support. Refer to [Configuration details](/reference/resource-configs/databricks-configs/materialized-views-and-streaming-tables#configuration-details) for more details on each config:

<SimpleTable>

| Databricks Concept | Config Name | MV/ST support | Version |
| ------------------ | ------------| ------------- | ------- |
| [PARTITIONED BY](https://docs.databricks.com/en/sql/language-manual/sql-ref-partition.html#partitioned-by) | `partition_by` | MV/ST | All |
| [CLUSTER BY](https://docs.databricks.com/en/delta/clustering.html) | `liquid_clustered_by` | MV/ST | v1.11+ |
| COMMENT | [`description`](/reference/resource-properties/description) | MV/ST | All |
| [TBLPROPERTIES](https://docs.databricks.com/en/sql/language-manual/sql-ref-syntax-ddl-tblproperties.html#tblproperties) | `tblproperties` | MV/ST | All |
| [TAGS](https://docs.databricks.com/en/data-governance/unity-catalog/tags.html) | `databricks_tags` | MV/ST | v1.11+ |
| [SCHEDULE CRON](https://docs.databricks.com/en/sql/language-manual/sql-ref-syntax-ddl-create-materialized-view.html#parameters) | `schedule: { 'cron': '\<cron schedule\>', 'time_zone_value': '\<time zone value\>' }` | MV/ST | All |
| [SCHEDULE EVERY](https://docs.databricks.com/aws/en/sql/language-manual/sql-ref-syntax-ddl-create-materialized-view#parameters) | `schedule: { 'every': '\<n\> \<unit\>' }` | MV/ST | v1.12+ |
| [TRIGGER ON UPDATE](https://docs.databricks.com/aws/en/sql/language-manual/sql-ref-syntax-ddl-create-materialized-view#parameters) | `schedule: { 'on_update': true, 'at_most_every': '\<n\> \<unit\>' }` | MV/ST | v1.12+ |
| [WITH ROW FILTER](https://docs.databricks.com/aws/en/tables/row-and-column-filters) | `row_filter` | MV/ST | v1.12+ |
| query | defined by your model SQL | on_configuration_change for MV only | All |
</SimpleTable>

<File name='mv_example.sql'>

```sql

{{ config(
    materialized='materialized_view',
    partition_by='id',
    schedule = {
        'cron': '0 0 * * * ? *',
        'time_zone_value': 'Etc/UTC'
    },
    tblproperties={
        'key': 'value'
    },
) }}
select * from {{ ref('my_seed') }}

```

</File>

### Configuration details

#### partition_by
`partition_by` works the same as for views and tables, i.e. can be a single column, or an array of columns to partition by.

#### liquid_clustered_by
_Available in versions 1.11 or higher_

`liquid_clustered_by` enables [liquid clustering](https://docs.databricks.com/en/delta/clustering.html) for materialized views and streaming tables. Liquid clustering optimizes query performance by co-locating similar data within the same files, particularly beneficial for queries with selective filters on the clustered columns.

**Note:** You cannot use both `partition_by` and `liquid_clustered_by` on the same materialization, as Databricks doesn't allow combining these features.

#### databricks_tags
_Available in versions 1.11 or higher_

`databricks_tags` allows you to apply [Unity Catalog tags](https://docs.databricks.com/en/data-governance/unity-catalog/tags.html) to your materialized views and streaming tables for data governance and organization. Tags are key-value pairs that can be used for data classification, access control policies, and metadata management.

```sql
{{ config(
    materialized='streaming_table',
    databricks_tags={'pii': 'contains_email', 'team': 'analytics'}
) }}
```

`dbt-databricks` v1.12+ adds support for key-only tags. To set a tag that has a key but no value, set the tag's value to an empty string `''` or to `None`:

```sql
{{ config(
    materialized='streaming_table',
    databricks_tags={'sensitive': '', 'reviewed': None}
) }}
```

This applies to both table-level and column-level `databricks_tags`. Non-string values, such as numbers or booleans, are converted to strings.

Tags are applied via `ALTER` statements after the materialization is created. Once applied, tags cannot be removed through dbt-databricks configuration changes. To remove tags, you must use Databricks directly or a post-hook.

:::caution Behavior change in v1.12
Starting in `dbt-databricks` v1.12.0, `databricks_tags` configurations are merged additively across config hierarchy levels (for example, project-level and model-level), rather than having lower-level configs completely replace higher-level ones.

When the same tag key is defined at multiple levels, the lower-level value takes precedence. Tag keys defined only at higher levels are retained.

This behavior applies anywhere `databricks_tags` can be configured, including tables, columns, materialized views, and streaming tables.
:::

For example, with the following project-level and model-level configs:

<File name='dbt_project.yml'>

```yaml
models:
  my_project:
    +databricks_tags:
      a: "b"
      c: "project_value"
```

</File>

<File name='models/my_model.sql'>

```sql
{{ config(
    databricks_tags={'c': 'model_value', 'k': 'v'}
) }}
```

</File>

The resulting tags are:

- `a: b` — retained from the project level
- `c: model_value` — the model-level value overrides the project-level `c`
- `k: v` — added at the model level

#### description
As with views and tables, adding a `description` to your configuration will lead to a table-level comment getting added to your materialization.

#### tblproperties
`tblproperties` works the same as for views and tables with an important exception: the adapter maintains a list of keys that are set by Databricks when making an materialized view or streaming table which are ignored for the purpose of determining configuration changes.

#### schedule
Set the refresh schedule for the model using one of three mutually exclusive modes:
 
| Mode | Config | Format | Version |
|------|--------|--------|---------|
| `cron` | `schedule: { 'cron': '...', 'time_zone_value': '...' }` | Cron string ([Databricks format](https://docs.databricks.com/aws/en/sql/language-manual/sql-ref-syntax-ddl-create-materialized-view#parameters)). `time_zone_value` is optional. | All |
| `every` | `schedule: { 'every': '<n> <unit>' }` | `'<n> <unit>'` where unit is `HOURS`, `DAYS`, or `WEEKS` — for example, `'2 HOURS'` | v1.12+ |
| `on_update` | `schedule: { 'on_update': true, 'at_most_every': '<n> <unit>' }` | Set to `true` to refresh when upstream data changes. `at_most_every` is optional and rate-limits refreshes (minimum 60 seconds). For example, `'15 MINUTES'` | v1.12+ |
 
**Refresh behavior by mode:**
- `cron`: dbt requests a manual refresh on every run.
- `every` and `on_update`: Databricks auto-manages the refresh; dbt does not trigger a manual refresh on a no-op re-run.
If a schedule exists in Databricks but your dbt project doesn't specify one, the schedule resets to manual on your next run (when `on_configuration_change` is set to `apply`).
 
#### query
For materialized views, if the compiled query differs from what's in the database, dbt takes the configured `on_configuration_change` action. Query changes aren't currently detectable for streaming tables. Refer to [on_configuration_change](/reference/resource-configs/databricks-configs/materialized-views-and-streaming-tables#on_configuration_change) for details.

#### row_filter
_Available in versions 1.12 or higher_

`row_filter` applies a [Unity Catalog row filter](https://docs.databricks.com/aws/en/tables/row-and-column-filters) to a model. It is supported on `table`, `incremental`, `materialized_view`, and `streaming_table` materializations. Refer to [Setting row filters](/reference/resource-configs/databricks-configs/setting-row-filters) for the full config reference and examples.

### on_configuration_change
 
| Materialization | Drop and recreate required? | Notes |
|----------------|----------------------------|-------|
| Materialized views | Yes, for all changes except schedule updates | Databricks SQL API limitation |
| Streaming tables | Only when `partition_by` changes | All other supported changes use `CREATE OR REFRESH` plus an `ALTER` for schedule changes |
 
Note on streaming table query changes: there's currently no way for the adapter to detect if a streaming table query has changed. Regardless of `on_configuration_change` behavior, dbt uses `CREATE OR REFRESH`, which applies the updated query to future rows only &mdash; previously processed rows aren't reprocessed.
 
To reprocess available source data with an updated query, run with `--full-refresh`.
 
