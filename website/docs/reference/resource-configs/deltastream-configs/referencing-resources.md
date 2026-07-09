---
title: "Referencing resources"
sidebar_label: "Referencing resources"
description: "Reference managed resources with the ref() function and unmanaged resources with the source() function in DeltaStream."
---

### Managed resources

Use the standard `ref()` function:

```sql
select * from {{ ref('my_kafka_stream') }}
```

### Unmanaged resources

Use the `source()` function:

```sql
SELECT * FROM {{ source('infrastructure', 'user_events_stream') }}
```
