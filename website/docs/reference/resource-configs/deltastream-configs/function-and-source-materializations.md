---
title: "Function and source materializations"
sidebar_label: "Function and source materializations"
description: "Create DeltaStream user-defined functions, function sources, descriptor sources, and schema registry connections."
---

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
