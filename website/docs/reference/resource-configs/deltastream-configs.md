---
title: "DeltaStream configurations"
description: "DeltaStream Configurations - Read this in-depth guide to learn about configurations in dbt."
id: "deltastream-configs"
---

# DeltaStream resource configurations

## Supported materializations

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

## SQL model configurations

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

## YAML-only resource configurations

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

## Store configurations

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

## Entity configuration

```yaml
- name: kinesis_entity
  config:
    materialized: entity
    store: kinesis_store
    parameters:
      'kinesis.shards': 3
```

## Compute pool configuration

```yaml
- name: processing_pool
  config:
    materialized: compute_pool
    parameters:
      'compute_pool.size': 'small'
      'compute_pool.timeout_min': 5
```

## Referencing resources

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

## Seeds

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

## Function and source materializations

DeltaStream supports user-defined functions (UDFs) and their dependencies through specialized materializations.

### File attachment support

The adapter provides seamless file attachment for function sources and descriptor sources:

- **Standardized Interface**: Common file handling logic for both function sources and descriptor sources
- **Path Resolution**: Supports both absolute paths and relative paths (including `@` syntax for project-relative paths)
- **Automatic Validation**: Files are validated for existence and accessibility before attachment

### Function source

Creates a function source from a JAR file containing Java functions:

**SQL configuration:**

```sql
{{ config(
    materialized='function_source',
    parameters={
        'file': '@/path/to/my-functions.jar',
        'description': 'Custom utility functions'
    }
) }}

SELECT 1 as placeholder
```

### Descriptor source

Creates a descriptor source from compiled protocol buffer descriptor files:

**SQL configuration:**

```sql
{{ config(
    materialized='descriptor_source',
    parameters={
        'file': '@/path/to/schemas.desc',
        'description': 'Protocol buffer schemas for data structures'
    }
) }}

SELECT 1 as placeholder
```

:::info Note
Descriptor sources require compiled `.desc` files, not raw `.proto` files. Compile your protobuf schemas using:

```bash
protoc --descriptor_set_out=schemas/my_schemas.desc schemas/my_schemas.proto
```

:::

### Function

Creates a user-defined function that references a function source:

**SQL configuration:**

```sql
{{ config(
    materialized='function',
    parameters={
        'args': [
            {'name': 'input_text', 'type': 'VARCHAR'}
        ],
        'returns': 'VARCHAR',
        'language': 'JAVA',
        'source.name': 'my_function_source',
        'class.name': 'com.example.TextProcessor'
    }
) }}

SELECT 1 as placeholder
```

### Schema registry

Creates a schema registry connection:

**SQL configuration:**

```sql
{{ config(
    materialized='schema_registry',
    parameters={
        'type': 'CONFLUENT',
        'access_region': 'AWS us-east-1',
        'uris': 'https://url.to.schema.registry.listener:8081',
        'confluent.username': 'fake_username',
        'confluent.password': 'fake_password',
        'tls.client.cert_file': '@/path/to/tls/client_cert_file',
        'tls.client.key_file': '@/path/to/tls_key'
    }
) }}

SELECT 1 as placeholder
```

## Query management macros

DeltaStream dbt adapter provides macros to help you manage and terminate running queries directly from dbt.

### List all queries

The `list_all_queries` macro displays all queries currently known to DeltaStream, including their state, owner, and SQL:

```bash
dbt run-operation list_all_queries
```

### Describe query

Use the `describe_query` macro to check the logs and details of a specific query:

```bash
dbt run-operation describe_query --args '{query_id: "<QUERY_ID>"}'
```

### Terminate a specific query

Use the `terminate_query` macro to terminate a query by its ID:

```bash
dbt run-operation terminate_query --args '{query_id: "<QUERY_ID>"}'
```

### Terminate all running queries

Use the `terminate_all_queries` macro to terminate all currently running queries:

```bash
dbt run-operation terminate_all_queries
```

### Restart a query

Use the `restart_query` macro to restart a failed query by its ID:

```bash
dbt run-operation restart_query --args '{query_id: "<QUERY_ID>"}'
```

## Application macro

### Execute multiple statements as a unit

The `application` macro allows you to execute multiple DeltaStream SQL statements as a single unit of work with all-or-nothing semantics:

```bash
dbt run-operation application --args '{
  application_name: "my_data_pipeline",
  statements: [
    "USE DATABASE my_db",
    "CREATE STREAM user_events WITH (topic='"'"'events'"'"', value.format='"'"'json'"'"')",
    "CREATE MATERIALIZED VIEW user_counts AS SELECT user_id, COUNT(*) FROM user_events GROUP BY user_id"
  ]
}'
```

## Troubleshooting

### Function source readiness

If you encounter "function source is not ready" errors when creating functions:

1. **Automatic Retry**: The adapter automatically retries function creation with exponential backoff
2. **Timeout Configuration**: The default 30-second timeout can be extended if needed for large JAR files
3. **Dependency Order**: Ensure function sources are created before dependent functions
4. **Manual Retry**: If automatic retry fails, wait a few minutes and retry the operation

### File attachment issues

For problems with file attachments in function sources and descriptor sources:

1. **File Paths**: Use `@/path/to/file` syntax for project-relative paths
2. **File Types**:
   - Function sources require `.jar` files
   - Descriptor sources require compiled `.desc` files (not `.proto`)
3. **File Validation**: The adapter validates file existence before attempting attachment
4. **Compilation**: For descriptor sources, ensure protobuf files are compiled:

   ```bash
   protoc --descriptor_set_out=output.desc input.proto
   ```

