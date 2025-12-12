---
title: "BigQuery adapter behavior changes"
id: "bigquery-changes"
sidebar: "BigQuery"
---

## The `bigquery_use_batch_source_freshness` flag

The `bigquery_use_batch_source_freshness` flag is `False` by default. Setting it to `True` in your `dbt_project.yml` file enables dbt to compute `source freshness` results with a single batched query to BigQuery's [`INFORMATION_SCHEMA.TABLE_STORAGE`](https://cloud.google.com/bigquery/docs/information-schema-table-storage) view as opposed to sending a metadata request for each source.

Setting this flag to `True` improves the performance of the `source freshness` command significantly, especially when a project contains a large (1000+) number of sources.
