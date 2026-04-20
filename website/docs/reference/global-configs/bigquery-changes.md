---
title: "BigQuery adapter behavior changes"
id: "bigquery-changes"
sidebar: "BigQuery"
---

## The `bigquery_use_batch_source_freshness` flag

The `bigquery_use_batch_source_freshness` flag is `False` by default. Setting it to `True` in your `dbt_project.yml` file enables dbt to compute `source freshness` results with a single batched query to BigQuery's [`INFORMATION_SCHEMA.TABLE_STORAGE`](https://cloud.google.com/bigquery/docs/information-schema-table-storage) view as opposed to sending a metadata request for each source.

Setting this flag to `True` improves the performance of the `source freshness` command significantly, especially when a project contains a large (1000+) number of sources.

:::caution Using `loaded_at_field` with batch freshness
With `bigquery_use_batch_source_freshness` enabled, dbt determines freshness from BigQuery metadata tables.

When you configure a `loaded_at_field` on a source, dbt runs a column-based freshness check for that source instead of metadata-based freshness.

However, if `loaded_at_field` is set on _all_ sources, freshness fails with a compilation error (`list object has no element 0` in `get_relation_last_modified`). This occurs because the `bigquery_use_batch_source_freshness` flag assumes at least one source uses metadata-based freshness; configuring `loaded_at_field` on all sources breaks this assumption.

To avoid this, remove `loaded_at_field` from any sources you want checked using batch freshness.
:::

<VersionBlock firstVersion="1.12">

## The `bigquery_reject_wildcard_metadata_source_freshness` flag

When a BigQuery source uses a wildcard table identifier (for example, `events_*`), metadata-based source freshness checks return incorrect results. BigQuery's `client.get_table()` method creates a temporary union table for wildcard identifiers whose modified timestamp reflects the current time &mdash; not the actual modification time of the underlying tables. This makes freshness checks report an age of approximately 0 seconds, masking stale data without any warning.

The `bigquery_reject_wildcard_metadata_source_freshness` flag controls how dbt handles metadata-based source freshness checks for BigQuery sources that use wildcard table identifiers.

By default, this flag is set to `False`. Tables with wildcard identifiers continue to run metadata-based freshness checks, but dbt emits a deprecation warning advising users to opt in to the new behavior. For example:

```
WARNING: Raise an error when metadata-based source freshness is used with a
wildcard table identifier (e.g. 'events_*'). BigQuery returns the current time
as the modified timestamp for wildcard tables, causing freshness checks to
always report ~0 seconds.
You may opt into the new behavior sooner by setting
`flags.bigquery_reject_wildcard_metadata_source_freshness` to `True` in `dbt_project.yml`.
```

When you set this flag to `True`, dbt raises a `DbtRuntimeError` when you run metadata-based source freshness checks with wildcard table identifiers. For example:

```
Runtime Error in source my_* (models/schema.yml)
  Metadata-based source freshness is not supported for wildcard table
  '`dbt-test-env`.`dbt_username`.`events_*`'. Please set 'loaded_at_field' on
  this source to use a query-based freshness check instead.
```

To calculate freshness for wildcard tables, configure [`loaded_at_field`](/reference/resource-properties/freshness#loaded_at_field) on the source to use query-based freshness checks instead. 

Example configuration:

<File name='models/schema.yml'>

```yaml
sources:
  - name: events
    database: dbt-test-env
    schema: dbt_username
    tables:
      - name: events           
        identifier: "events_*"  # wildcard table identifier in BigQuery
        config:
          freshness:
            warn_after: {count: 12, period: hour}
            error_after: {count: 24, period: hour}
          loaded_at_field: _etl_loaded_at
```

</File>

</VersionBlock>

