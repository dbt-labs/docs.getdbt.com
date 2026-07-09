---
title: "SQL model configurations"
sidebar_label: "SQL model configurations"
description: "Configure DeltaStream SQL models as table, stream, changelog, or materialized view materializations."
---

### Table materialization

Creates a traditional batch table for aggregated data:

**Project YAML file configuration:**
```yaml
models:
  <resource-path>:
    +materialized: table
```

**SQL configuration:**
```sql
{{ config(materialized = "table") }}

SELECT 
    date,
    SUM(amount) as daily_total
FROM {{ ref('transactions') }}
GROUP BY date
```

### Stream materialization

Creates a continuous streaming transformation:

**Project YAML file configuration:**
```yaml
models:
  <resource-path>:
    +materialized: stream
    +parameters:
      topic: 'stream_topic'
      value.format: 'json'
      key.format: 'primitive'
      key.type: 'VARCHAR'
      timestamp: 'event_time'
```

**SQL configuration:**
```sql
{{ config(
    materialized='stream',
    parameters={
        'topic': 'purchase_events',
        'value.format': 'json',
        'key.format': 'primitive',
        'key.type': 'VARCHAR',
        'timestamp': 'event_time'
    }
) }}

SELECT 
    event_time,
    user_id,
    action
FROM {{ ref('source_stream') }}
WHERE action = 'purchase'
```

#### Stream configuration options

| Option         | Description                                                                                   | Required? |
|----------------|-----------------------------------------------------------------------------------------------|-----------|
| `materialized` | How the model will be materialized. Must be `stream` to create a streaming model.             | Required  |
| `topic`        | The topic name for the stream output.                                                         | Required  |
| `value.format` | Format for the stream values (like 'json', 'avro').                                          | Required  |
| `key.format`   | Format for the stream keys (like 'primitive', 'json').                                       | Optional  |
| `key.type`     | Data type for the stream keys (like 'VARCHAR', 'BIGINT').                                    | Optional  |
| `timestamp`    | Column name to use as the event timestamp.                                                    | Optional  |

### Changelog materialization

Captures changes in the data stream:

**Project YAML file configuration:**
```yaml
models:
  <resource-path>:
    +materialized: changelog
    +parameters:
      topic: 'changelog_topic'
      value.format: 'json'
    +primary_key: [column_name]
```

**SQL configuration:**
```sql
{{ config(
    materialized='changelog',
    parameters={
        'topic': 'order_updates',
        'value.format': 'json'
    },
    primary_key=['order_id']
) }}

SELECT 
    order_id,
    status,
    updated_at
FROM {{ ref('orders_stream') }}
```

#### Changelog configuration options

| Option         | Description                                                                                   | Required? |
|----------------|-----------------------------------------------------------------------------------------------|-----------|
| `materialized` | How the model will be materialized. Must be `changelog` to create a changelog model.          | Required  |
| `topic`        | The topic name for the changelog output.                                                      | Required  |
| `value.format` | Format for the changelog values (like 'json', 'avro').                                       | Required  |
| `primary_key`  | List of column names that uniquely identify rows for change tracking.                         | Required  |

### Materialized view

Creates a continuously updated view:

**SQL configuration:**
```sql
{{ config(materialized='materialized_view') }}

SELECT 
    product_id,
    COUNT(*) as purchase_count
FROM {{ ref('purchase_events') }}
GROUP BY product_id
```
