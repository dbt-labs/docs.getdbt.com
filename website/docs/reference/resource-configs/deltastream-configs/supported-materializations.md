---
title: "Supported materializations"
sidebar_label: "Supported materializations"
description: "Review the standard, streaming, and infrastructure materializations that the DeltaStream adapter supports."
---

DeltaStream supports several unique materialization types that align with its streaming processing capabilities:

### Standard materializations

| Materialization     | Description                                                                                              |
|---------------------|----------------------------------------------------------------------------------------------------------|
| `ephemeral`         | This materialization uses common table expressions in DeltaStream under the hood.                        |
| `table`             | Traditional batch table materialization                                                                  |
| `materialized_view` | Continuously updated view that automatically refreshes as underlying data changes                        |

### Streaming materializations

| Materialization | Description                                                                                              |
|-----------------|----------------------------------------------------------------------------------------------------------|
| `stream`        | Pure streaming transformation that processes data in real-time                                           |
| `changelog`     | Change data capture (CDC) stream that tracks changes in data                                             |

### Infrastructure materializations

| Materialization      | Description                                                                                              |
|----------------------|----------------------------------------------------------------------------------------------------------|
| `store`              | External system connection (Kafka, PostgreSQL, etc.)                                                     |
| `entity`             | Entity definition within a store                                                                         |
| `database`           | Database definition                                                                                      |
| `compute_pool`       | Compute pool definition for resource management                                                          |
| `function`           | User-defined functions (UDFs) in Java                                                                    |
| `function_source`    | JAR file sources for UDFs                                                                                |
| `descriptor_source`  | Protocol buffer schema sources                                                                           |
| `schema_registry`    | Schema registry connections (Confluent, and so on.)                                                            |
