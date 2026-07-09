---
title: "YAML-only resource configurations"
sidebar_label: "YAML-only resource configurations"
description: "Define DeltaStream infrastructure as managed resources (models) or unmanaged resources (sources) in YAML."
---

DeltaStream supports two types of model definitions for infrastructure components:

1. **Managed Resources (Models)** - Automatically included in the dbt <Term id="dag"/>
2. **Unmanaged Resources (Sources)** - Created on-demand using specific macros

### Should you use managed or unmanaged resources?

- Use managed resources if you plan to recreate all the infrastructure in different environments and/or use graph operators to execute only the creation of specific resources and downstream transformations.
- Otherwise, it might be simpler to use unmanaged resources to avoid placeholder files.

### Managed resources (models)

Managed resources are automatically included in the dbt DAG and defined as models:

```yaml
version: 2
models:
  - name: my_kafka_store
    config:
      materialized: store
      parameters:
        type: KAFKA
        access_region: "AWS us-east-1"
        uris: "kafka.broker1.url:9092,kafka.broker2.url:9092"
        tls.ca_cert_file: "@/certs/us-east-1/self-signed-kafka-ca.crt"
  
  - name: ps_store
    config:
      materialized: store
      parameters:
        type: POSTGRESQL
        access_region: "AWS us-east-1"
        uris: "postgresql://mystore.com:5432/demo"
        postgres.username: "user"
        postgres.password: "password"
  
  - name: user_events_stream
    config:
      materialized: stream
      columns:
        event_time:
          type: TIMESTAMP
          not_null: true
        user_id:
          type: VARCHAR
        action:
          type: VARCHAR
      parameters:
        topic: 'user_events'
        value.format: 'json'
        key.format: 'primitive'
        key.type: 'VARCHAR'
        timestamp: 'event_time'
  
  - name: order_changes
    config:
      materialized: changelog
      columns:
        order_id:
          type: VARCHAR
          not_null: true
        status:
          type: VARCHAR
        updated_at:
          type: TIMESTAMP
      primary_key:
        - order_id
      parameters:
        topic: 'order_updates'
        value.format: 'json'
  
  - name: pv_kinesis
    config:
      materialized: entity
      store: kinesis_store
      parameters:
        'kinesis.shards': 3
  
  - name: my_compute_pool
    config:
      materialized: compute_pool
      parameters:
        'compute_pool.size': 'small'
        'compute_pool.timeout_min': 5
  
  - name: my_function_source
    config:
      materialized: function_source
      parameters:
        file: '@/path/to/my-functions.jar'
        description: 'Custom utility functions'
  
  - name: my_descriptor_source
    config:
      materialized: descriptor_source
      parameters:
        file: '@/path/to/schemas.desc'
        description: 'Protocol buffer schemas for data structures'
  
  - name: my_custom_function
    config:
      materialized: function
      parameters:
        args:
          - name: input_text
            type: VARCHAR
        returns: VARCHAR
        language: JAVA
        source.name: 'my_function_source'
        class.name: 'com.example.TextProcessor'
  
  - name: my_schema_registry
    config:
      materialized: schema_registry
      parameters:
        type: "CONFLUENT"
        access_region: "AWS us-east-1"
        uris: "https://url.to.schema.registry.listener:8081"
        'confluent.username': 'fake_username'
        'confluent.password': 'fake_password'
        'tls.client.cert_file': '@/path/to/tls/client_cert_file'
        'tls.client.key_file': '@/path/to/tls_key'
```

**Note:** Due to current dbt limitations, managed YAML-only resources require a placeholder .sql file that doesn't contain a SELECT statement. For example, create `my_kafka_store.sql` with:

```sql
-- Placeholder
```

### Unmanaged resources (sources)

Unmanaged resources are defined as sources and created on-demand using specific macros:

```yaml
version: 2
sources:
  - name: infrastructure
    tables:
      - name: my_kafka_store
        config:
          materialized: store
          parameters:
            type: KAFKA
            access_region: "AWS us-east-1"
            uris: "kafka.broker1.url:9092,kafka.broker2.url:9092"
            tls.ca_cert_file: "@/certs/us-east-1/self-signed-kafka-ca.crt"
      
      - name: ps_store
        config:
          materialized: store
          parameters:
            type: POSTGRESQL
            access_region: "AWS us-east-1"
            uris: "postgresql://mystore.com:5432/demo"
            postgres.username: "user"
            postgres.password: "password"
      
      - name: user_events_stream
        config:
          materialized: stream
          columns:
            event_time:
              type: TIMESTAMP
              not_null: true
            user_id:
              type: VARCHAR
            action:
              type: VARCHAR
          parameters:
            topic: 'user_events'
            value.format: 'json'
            key.format: 'primitive'
            key.type: 'VARCHAR'
            timestamp: 'event_time'
      
      - name: order_changes
        config:
          materialized: changelog
          columns:
            order_id:
              type: VARCHAR
              not_null: true
            status:
              type: VARCHAR
            updated_at:
              type: TIMESTAMP
          primary_key:
            - order_id
          parameters:
            topic: 'order_updates'
            value.format: 'json'
      
      - name: pv_kinesis
        config:
          materialized: entity
          store: kinesis_store
          parameters:
            'kinesis.shards': 3
      
      - name: compute_pool_small
        config:
          materialized: compute_pool
          parameters:
            'compute_pool.size': 'small'
            'compute_pool.timeout_min': 5
      
      - name: my_function_source
        config:
          materialized: function_source
          parameters:
            file: '@/path/to/my-functions.jar'
            description: 'Custom utility functions'
      
      - name: my_descriptor_source
        config:
          materialized: descriptor_source
          parameters:
            file: '@/path/to/schemas.desc'
            description: 'Protocol buffer schemas for data structures'
      
      - name: my_custom_function
        config:
          materialized: function
          parameters:
            args:
              - name: input_text
                type: VARCHAR
            returns: VARCHAR
            language: JAVA
            source.name: 'my_function_source'
            class.name: 'com.example.TextProcessor'
      
      - name: my_schema_registry
        config:
          materialized: schema_registry
          parameters:
            type: "CONFLUENT"
            access_region: "AWS us-east-1"
            uris: "https://url.to.schema.registry.listener:8081"
            'confluent.username': 'fake_username'
            'confluent.password': 'fake_password'
            'tls.client.cert_file': '@/path/to/tls/client_cert_file'
            'tls.client.key_file': '@/path/to/tls_key'
```

To create unmanaged resources:

```bash
# Create all sources
dbt run-operation create_sources

# Create a specific source
dbt run-operation create_source_by_name --args '{source_name: infrastructure}'
```
