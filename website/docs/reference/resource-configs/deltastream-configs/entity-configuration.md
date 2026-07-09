---
title: "Entity configuration"
sidebar_label: "Entity configuration"
description: "Configure a DeltaStream entity materialization within a store."
---

```yaml
- name: kinesis_entity
  config:
    materialized: entity
    store: kinesis_store
    parameters:
      'kinesis.shards': 3
```
