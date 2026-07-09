---
title: "Known limitations"
sidebar_label: "Known limitations"
description: "Understand the current limitations of the Confluent Cloud Flink SQL adapter, including schema management and transactions."
---

- **No schema management**: The adapter cannot create or drop schemas (Kafka clusters) or databases (environments). These must be managed in Confluent Cloud.
- **No table renames**: `ALTER TABLE RENAME` is not supported in Flink SQL.
- **Non-transactional**: Confluent Cloud Flink SQL does not support transactions. `BEGIN` and `COMMIT` are no-ops.
- **Seeds require `full_refresh`**: The adapter sets `full_refresh: true` for seeds by default.
