---
title: "CDC in dbt"
id: "1-intro"
description: "Learn how change data capture works in dbt, and how to choose incremental models, snapshots, or both."
sidebar_label: "Introduction"
hoverSnippet: "Learn how change data capture works in dbt"
availability: all_users
---

A <Constant name="dbt" /> run has a start and an end. Change data capture (CDC) still fits that model. You pick up what changed in a source (new rows, updates, and deletes), then transform only that change instead of rebuilding the whole table.

This guide is for anyone who needs to keep a table current, keep a history of changes, or do both. It applies to <Constant name="core" /> and the <Constant name="fusion_engine" />.

The next page, [Choosing incremental models or snapshots](/best-practices/how-we-handle-cdc/2-choosing-incremental-or-snapshots), covers when to use incremental models, snapshots, or both in a <Constant name="dbt" /> project.

## What CDC means in dbt

CDC means you record that a row changed, and you decide what to do with that change.

In <Constant name="dbt" />, that usually means one of two ways to build a table:

- An [incremental model](/docs/build/incremental-models-overview) keeps a table current. On each run, <Constant name="dbt" /> processes new or changed rows and _replaces_ the old row for that `unique_key`.
- A [snapshot](/docs/build/snapshots) keeps history. On each run, <Constant name="dbt" /> compares the source to the last snapshot and _adds_ a row when the record changes, with `dbt_valid_from` and `dbt_valid_to`.

The same `unique_key` does different jobs in each case. Refer to [`unique_key`](/reference/resource-configs/unique_key) for that config, or read [Strategies for change data capture in dbt](/blog/change-data-capture) for a longer example of that split.

Snapshots only capture changes when you run them. You must run them on a schedule, or you miss changes. [How often should I run the snapshot command?](/faqs/Runs/snapshot-frequency) recommends hourly to daily.

## CDC is not the same as near real-time

[Near real-time data in dbt](/best-practices/how-we-handle-real-time-data/1-intro) is about _how fresh_ a table is (minutes, not hours). CDC in this guide is about _what to keep_ (the latest row, a history of changes, or both).

That series includes [CDC with Snowflake Streams](/best-practices/how-we-handle-real-time-data/2-incremental-patterns#cdc-with-snowflake-streams): the warehouse writes a list of changes, and an incremental model reads it. That approach does not use snapshots.

Use the near-real-time guide when the question is job frequency, streams, or dynamic tables. Use this guide when the question is incremental vs snapshots.

## Choose the latest row, history, or both

How your source stores data, and what you need to keep, determine the approach. Before you add an incremental model, a snapshot, or both, use these questions to choose:

1. Does the source already send a list of changes (from a loading tool, a stream, or a table that only adds rows), or does it overwrite existing rows in place?
2. Do you need the latest row per id, a full history, or both?
3. Is reading every source row cheap enough, or do you need to process only new or changed rows so runs stay small?

| You need | Typical source | Use |
| --- | --- | --- |
| Latest row only | A list of changes, or a table that overwrites rows and has a reliable change timestamp | Incremental model |
| History only | A table that overwrites rows, and it is small enough to scan each run | Snapshot |
| Latest row and history | A table that overwrites rows, or a cleaned list of changes | An incremental staging model, then a snapshot, then a model that keeps only the latest snapshot row |

<br />

These are three ways to use incremental models and snapshots. CDC is not a separate <Constant name="dbt" /> product. [Choosing incremental models or snapshots](/best-practices/how-we-handle-cdc/2-choosing-incremental-or-snapshots) walks through each approach.

## Key recommendations

- Use incremental models when you only need the current table and you can identify new or changed rows. An incremental model _replaces_ the old row, so runs stay small and you do not store versions you will never query.
- Use snapshots when you need to know what a record looked like at a point in the past. A snapshot _adds_ a row when the record changes, which is how you keep the old version. An incremental model would have overwritten it.
- Use both when staging should stay cheap and current, and a snapshot should store versions. The incremental model limits how much you process. The snapshot records history. Snapshot the staging models (or sources), not the final table people query, so you track the source as it changed, not a report that can change for other reasons.
- Prefer a snapshot `timestamp` strategy when `updated_at` is reliable and only moves forward. That lets <Constant name="dbt" /> detect a change from the clock instead of comparing every column. Use `check` when the timestamp is missing or untrustworthy, so a change in the row still gets recorded.
- If the warehouse already writes a list of changes (streams), use an incremental model. The warehouse already detected the change, so you do not need a snapshot to find it. Refer to [CDC with Snowflake Streams](/best-practices/how-we-handle-real-time-data/2-incremental-patterns#cdc-with-snowflake-streams) for that example.
