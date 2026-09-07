---
title: How often should I run the snapshot command?
description: "Snapshot command intended to run on hourly/daily schedule "
sidebar_label: 'Snapshot command schedule'
id: snapshot-frequency

---

Snapshots are a batch-based approach to [change data capture](https://en.wikipedia.org/wiki/Change_data_capture). The `dbt snapshot` command must be run on a schedule to ensure that changes to tables are actually recorded! While individual use-cases may vary, snapshots are intended to be run between hourly and daily. If you find yourself snapshotting more frequently than that, consider if there isn't a more appropriate way to capture changes in your source data tables.

For guidance on when to use snapshots vs incremental models, refer to [Choosing incremental models or snapshots](/best-practices/how-we-handle-cdc/2-choosing-incremental-or-snapshots).
