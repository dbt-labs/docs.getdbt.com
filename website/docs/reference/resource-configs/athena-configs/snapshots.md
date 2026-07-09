---
title: "Snapshots"
sidebar_label: "Snapshots"
description: "How the Amazon Athena adapter supports snapshots using the timestamp and check strategies, including known limitations."
---

The adapter supports snapshot materialization. It supports both the timestamp and check strategies. To create a snapshot, create a snapshot file in the `snapshots` directory. You'll need to create this directory if it doesn't already exist.

### Timestamp strategy


Refer to [Timestamp strategy](/docs/build/snapshots#timestamp-strategy-recommended) for details on how to use it. 


### Check strategy

Refer to [Check strategy](/docs/build/snapshots#check-strategy) for details on how to use it.

### Hard deletes

The materialization also supports invalidating hard deletes. For usage details, refer to [Hard deletes](/docs/build/snapshots#hard-deletes-opt-in). 

### Snapshots known issues

- Tables, schemas, and database names should only be lowercase.
- To avoid potential conflicts, make sure [`dbt-athena-adapter`](https://github.com/Tomme/dbt-athena) is not installed in the target environment.
- Snapshot does not support dropping columns from the source table. If you drop a column, make sure to drop the column from the snapshot as well. Another workaround is to NULL the column in the snapshot definition to preserve the history.
