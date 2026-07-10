---
title: "Incremental materialization strategies"
sidebar_label: "Incremental materialization strategies"
description: "Learn how the incremental_strategy config controls incremental models in SingleStore, supporting delete+insert, append, and microbatch."
---

The [`incremental_strategy` config](/docs/build/incremental-models#about-incremental_strategy) controls how dbt builds incremental models. Currently, SingleStoreDB supports `delete+insert`, `append`, and `microbatch` configurations.

The `delete+insert` incremental strategy directs dbt to follow a two-step incremental approach. Initially, it identifies and removes the records flagged by the configured `is_incremental()` block. Subsequently, it re-inserts these records.
