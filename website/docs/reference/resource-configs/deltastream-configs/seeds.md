---
title: "Seeds"
sidebar_label: "Seeds"
description: "Load CSV data into existing DeltaStream entities using the seed materialization."
---

Load CSV data into existing DeltaStream entities using the `seed` materialization. Unlike traditional dbt seeds that create new tables, DeltaStream seeds insert data into pre-existing entities.

### Configuration

Seeds must be configured in YAML with the following properties:

**Required:**

- `entity`: The name of the target entity to insert data into

**Optional:**

- `store`: The name of the store containing the entity (omit if entity is not in a store)
- `with_params`: A dictionary of parameters for the WITH clause
- `quote_columns`: Control which columns get quoted. Default: `false` (no columns quoted). Can be:
  - `true`: Quote all columns
  - `false`: Quote no columns (default)
  - `string`: If set to `'*'`, quote all columns
  - `list`: List of column names to quote

### Example configuration

**With Store (quoting enabled):**

```yaml
# seeds.yml
version: 2

seeds:
  - name: user_data_with_store_quoted
    config:
      entity: 'user_events'
      store: 'kafka_store'
      with_params:
        kafka.topic.retention.ms: '86400000'
        partitioned: true
      quote_columns: true  # Quote all columns
```

### Usage

1. Place CSV files in your `seeds/` directory
2. Configure seeds in YAML with the required `entity` parameter
3. Optionally specify `store` if the entity is in a store
4. Run `dbt seed` to load the data

:::info Important
The target entity must already exist in DeltaStream before running seeds. Seeds only insert data, they do not create entities.
:::
