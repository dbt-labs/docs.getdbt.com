---
title: "Debug Snapshot target is not a snapshot table errors"
description: "Debugging Snapshot target is not a snapshot table"
sidebar_label: "Snapshot target is not a snapshot table"
id: snapshot-target-is-not-a-snapshot-table
---

If you see the following error when trying to snapshot:

> Snapshot target is not a snapshot table (missing `dbt_scd_id`, `dbt_valid_from`, `dbt_valid_to`)

Double check that you have not inadvertently caused your snapshot to behave like table materializations by setting its `materialized` config to be `table`. Prior to dbt version 1.4, it was possible to have a snapshot like this:

```sql
{% snapshot snappy %}
  {{ config(materialized = 'table', ...) }}
  ...
{% endsnapshot %}
```

What would happen then is dbt treated snapshots like tables (issuing `create or replace table ...` statements) **silently** instead of actually snapshotting data (SCD2 via `insert` / `merge` statements). When upgrading to dbt versions 1.4 and above, dbt now raises a Parsing Error (instead of silently treating snapshots like tables) that reads:

```
A snapshot must have a materialized value of 'snapshot'
```

This tells you to change your `materialized` config to `snapshot`. However, as soon as you do that, you may run into the error above (missing "dbt_scd_id", etc). This is because, previously, when dbt treated snapshots like tables - there were no [snapshot meta-fields](/docs/build/snapshots#snapshot-meta-fields) added to your snapshot target table - and because those meta-fields don't exist, dbt correctly identifies and tells you that you intend to snapshot into a table that isn't a snapshot.

When this happens, you have to start from scratch &mdash; re-snapshotting your source data as if it was the first time by dropping your "snapshot" which isn't a real snapshot table. Then dbt snapshot will create a new snapshot and insert the snapshot meta-fields as expected.
