---
title: "dbt State usage"
id: dbt-state-usage
description: "Learn how dbt State usage and pricing works."
sidebar_label: "dbt State usage"
---

[dbt state](/docs/deploy/dbt-state-about) enables dbt to reuse nodes by cloning from another location or skipping a rebuild when the logic and data haven't changed.

### About free trial

Eligible new organizations receive 30 days of free use with no usage limit. After the free period, a credit card or enterprise contract (for dbt platform managed plans) is required to continue.

### dbt State pricing

dbt State is a separate, usage-based product available to dbt Core, dbt platform, and dbt Fusion engine users.

### Cancellation

Usage is tracked through your cancellation date. You're billed at month end for usage incurred before cancellation and not charged for usage after.

### Daily active target tables

For purposes of pricing, daily active target tables (DATT) are measured as the number of distinct target tables (as defined below) for which dbt State performs at least one of the following unique operations on a given day (based on UTC time): a skip, clone, or test reuse.

A target table is a database object managed by your dbt project for a given database and schema name. It includes seeds, snapshots, dbt models (including incremental models). It also includes each distinct test (even if the tests are not built into the database because `store_failures` is disabled). For example, if `stg_customers` has `not_null` and `unique` tests on its `id` column, that's three target tables: the model and its two tests.

When you run `dbt build` or a similar command, a target table is selected for execution. It counts as an active target table if dbt State is able to reuse it based on your configuration rules. All reuses of the same active target table in a single day (based on UTC time) are counted as a single daily active target table (DATT).

### Monthly cost calculation

dbt State cost per billing period is the unit price multiplied by the sum of daily active target tables (DATT) across all account users and all days in that billing period. Refer to the [pricing page](https://www.getdbt.com/pricing) for current rates.
