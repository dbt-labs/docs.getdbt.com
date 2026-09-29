---
title: "Change data capture in dbt"
id: "1-intro"
description: "Learn how change data capture works in dbt, and how to choose incremental models, snapshots, or both."
sidebar_label: "Introduction"
hoverSnippet: "Learn how change data capture works in dbt"
availability: all_users
---

Change data capture (CDC) identifies new, updated, and deleted rows in your source data so you can process changes without rebuilding an _entire_ table.

This guide explains how you can use incremental models and snapshots in dbt to keep tables current, preserve a history of changes, or both. To find the best approach for your project, check out [Choosing incremental models or snapshots](/best-practices/how-we-handle-cdc/2-choosing-incremental-or-snapshots).

This guide is for anyone who needs to keep a table current, keep a history of changes, or do both.

The next page, [Choosing incremental models or snapshots](/best-practices/how-we-handle-cdc/2-choosing-incremental-or-snapshots), covers when to use incremental models, snapshots, or both in a <Constant name="dbt" /> project.

## How to handle CDC in dbt

When source data changes, you may want to update your table, keep old versions, or do both.

In <Constant name="dbt" />, that usually means one of two ways to build a table:

- An [incremental model](/docs/build/incremental-models-overview) keeps a table current. On each run, <Constant name="dbt" /> processes new or changed rows and _replaces_ the old row for that `unique_key`.
- A [snapshot](/docs/build/snapshots) keeps history. On each run, <Constant name="dbt" /> compares the source to the last snapshot and _adds_ a row when the record changes, with `dbt_valid_from` and `dbt_valid_to`.

- An [incremental model](/docs/build/incremental-models-overview) keeps a table current. On each run, <Constant name="dbt" /> processes new or changed rows and _replaces_ the old row for that `unique_key`.

Snapshots only capture changes when you run them, which means you should run them on a schedule or you might miss changes. Refer to the FAQ [How often should I run the snapshot command?](/faqs/Runs/snapshot-frequency), which recommends hourly to daily.

## CDC is not the same as near real-time

[Near real-time data in dbt](/best-practices/how-we-handle-real-time-data/1-intro) is about _how fresh_ a table is (minutes, not hours). CDC in this guide is about _what to keep_ (the latest row, a history of changes, or both).

That series includes [CDC with Snowflake Streams](/best-practices/how-we-handle-real-time-data/2-incremental-patterns#cdc-with-snowflake-streams): the warehouse writes a list of changes, and an incremental model reads it. That approach does not use snapshots.

Use the near-real-time guide when the question is job frequency, streams, or dynamic tables. Use this guide when the question is incremental vs snapshots.

## ## Choose an approach: latest row, history, or both

Your approach depends on how your source exposes changes and what you need to keep. Use these questions to choose:

1. Does your source provide a list of changes, or overwrite existing rows?
2. Do you need current values, historical versions, or both?
3. Can you afford to read the full source on each run?

| You need | Typical source | Use |
| --- | --- | --- |
| Latest row only | A list of changes, or a table that overwrites rows and has a reliable change timestamp | Incremental model |
| Current row plus old versions | A table that overwrites rows, and it is small enough to scan each run | Snapshot |
| Current row plus old versions, without scanning the full source each run | A table that overwrites rows, or a cleaned list of changes | An incremental staging model, then a snapshot, then a downstream model that keeps only the latest snapshot row |

<br />

For examples of each approach, refer to [Choosing incremental models or snapshots](/best-practices/how-we-handle-cdc/2-choosing-incremental-or-snapshots).

## Key recommendations

- Use incremental models when you only need the current rows and you can identify new or changed rows. An incremental model _replaces_ the old row, so runs stay small and you do not store versions you will never query.
- Use snapshots when you need to know what a record looked like at a point in the past. A snapshot _adds_ a row when the record changes, which is how you keep the old version. An incremental model would have overwritten it.
- Use both when staging should stay cheap and current, and a snapshot should store versions. The incremental model limits how much you process. The snapshot records history. Snapshot the staging models (or sources), not the final table people query, so you track the source as it changed, not a report that can change for other reasons.
- Prefer a snapshot `timestamp` strategy when `updated_at` is reliable and only moves forward. That lets <Constant name="dbt" /> detect a change from the clock instead of comparing every column. Use `check` when the timestamp is missing or untrustworthy, so a change in the row still gets recorded.
- If the warehouse already writes a list of changes (streams), use an incremental model. The warehouse already detected the change, so you do not need a snapshot to find it. Refer to [CDC with Snowflake Streams](/best-practices/how-we-handle-real-time-data/2-incremental-patterns#cdc-with-snowflake-streams) for that example.
