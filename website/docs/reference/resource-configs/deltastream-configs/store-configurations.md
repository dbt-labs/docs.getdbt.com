---
title: "Store configurations"
sidebar_label: "Store configurations"
description: "Configure DeltaStream store materializations for Kafka and PostgreSQL external connections."
---

### Kafka store

```yaml
- name: my_kafka_store
  config:
    materialized: store
    parameters:
      type: KAFKA
      access_region: "AWS us-east-1"
      uris: "kafka.broker1.url:9092,kafka.broker2.url:9092"
      tls.ca_cert_file: "@/certs/us-east-1/self-signed-kafka-ca.crt"
```

### PostgreSQL store

```yaml
- name: postgres_store
  config:
    materialized: store
    parameters:
      type: POSTGRESQL
      access_region: "AWS us-east-1"
      uris: "postgresql://mystore.com:5432/demo"
      postgres.username: "user"
      postgres.password: "password"
```
