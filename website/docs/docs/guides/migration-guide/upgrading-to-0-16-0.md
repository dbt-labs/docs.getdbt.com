---
title: "Upgrading to 0.16.0"
id: "upgrading-to-0-16-0"
---

## Upgrading BigQuery Partition Configs

As of dbt v0.16.0, the `partition_by` config for BigQuery models accepts a dictionary containing two keys:
- `field`: The field name in the table to partition by
- `data_type`: The data type for the partitioning field (`date`, `timestamp`, `datetime`, `int64`)

Docs to come.