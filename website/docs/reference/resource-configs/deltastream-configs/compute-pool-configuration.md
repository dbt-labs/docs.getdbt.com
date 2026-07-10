---
title: "Compute pool configuration"
sidebar_label: "Compute pool configuration"
description: "Configure a DeltaStream compute pool materialization for resource management."
---

```yaml
- name: processing_pool
  config:
    materialized: compute_pool
    parameters:
      'compute_pool.size': 'small'
      'compute_pool.timeout_min': 5
```
