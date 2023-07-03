---
title: "Debug Snapshot target is not a snapshot table errors"
description: "Debugging Snapshot target is not a snapshot table"
sidebar_label: "Snapshot target is not a snapshot table"
id: snapshot-target-is-not-a-snapshot-table
---

If you see the following error when you try executing the snapshot command:

> Snapshot target is not a snapshot table (missing `dbt_scd_id`, `dbt_valid_from`, `dbt_valid_to`)

Double check that you haven't inadvertently caused your snapshot to behave like table materializations by setting its `materialized` config to be `table`. Prior to dbt version 1.4, it was possible to have a snapshot like this:

```sql
{% snapshot snappy %}
  {{ config(materialized = 'table', ...) }}
  ...
{% endsnapshot %}
```

dbt is treating snapshots like tables (issuing `create or replace table ...` statements) **silently** instead of actually snapshotting data (SCD2 via `insert` / `merge` statements). When upgrading to dbt versions 1.4 and higher, dbt now raises a Parsing Error (instead of silently treating snapshots like tables) that reads:

```
A snapshot must have a materialized value of 'snapshot'
```

This tells you to change your `materialized` config to `snapshot`. But when you make that change, you might encounter an error message saying that certain fields like `dbt_scd_id` are missing. This error happens because, previously, when dbt treated snapshots as tables, it didn't include the necessary [snapshot meta-fields](/docs/build/snapshots#snapshot-meta-fields) in your target table. Since those meta-fields don't exist, dbt correctly identifies that you're trying to create a snapshot in a table that isn't actually a snapshot.

When this happens, you have to start from scratch &mdash; re-snapshotting your source data as if it was the first time by dropping your "snapshot" which isn't a real snapshot table. Then dbt snapshot will create a new snapshot and insert the snapshot meta-fields as expected.
