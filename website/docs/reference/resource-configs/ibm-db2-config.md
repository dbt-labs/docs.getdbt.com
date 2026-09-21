---
title: "IBM Db2 configurations"
description: "Configure IBM Db2-specific settings for dbt models, including instance requirements and adapter permissions."
id: "ibm-db2-config"
---

## Instance requirements

To use IBM Db2 with the `ibm-dbt-db2` adapter, ensure the instance has an attached database that supports creating, renaming, altering, and dropping objects such as tables and views. The user connecting to the instance via the `ibm-dbt-db2` adapter must have the necessary permissions for the target database and schema.

For more details, please visit the official [IBM Db2 documentation](https://www.ibm.com/docs/en/db2)


## Supported Db2 platforms

The `ibm-dbt-db2` adapter supports the following IBM Db2 platforms:

- **Db2 for Linux, Unix, and Windows (LUW)** - Version 9.7 and higher
- **Db2 for z/OS** - Version 11 and higher
- **Db2 for iSeries** - Compatible versions

## Seeds and data types

The `ibm-dbt-db2` adapter offers comprehensive support for all Db2 data types in seed files. To leverage this functionality, you must explicitly define the data types for each column in your seed configuration.

You can configure column data types either in the `dbt_project.yml` file or in property files, as supported by dbt. For more details on seed configuration and best practices, refer to the [dbt seed configuration documentation](/reference/seed-configs).

### Example seed configuration

In your `dbt_project.yml`:

```yaml
seeds:
  my_project:
    raw_customers:
      +column_types:
        id: INTEGER
        name: VARCHAR(100)
        email: VARCHAR(255)
        created_at: TIMESTAMP
        is_active: BOOLEAN
```

### Supported Db2 data types

| Db2 Data Type | Description | Example Usage |
|---------------|-------------|---------------|
| INTEGER | 32-bit integer | `id: INTEGER` |
| BIGINT | 64-bit integer | `large_id: BIGINT` |
| SMALLINT | 16-bit integer | `status_code: SMALLINT` |
| DECIMAL(p,s) | Fixed-point decimal | `price: DECIMAL(10,2)` |
| FLOAT | Floating-point number | `rate: FLOAT` |
| DOUBLE | Double precision float | `measurement: DOUBLE` |
| VARCHAR(n) | Variable-length string | `name: VARCHAR(100)` |
| CHAR(n) | Fixed-length string | `code: CHAR(10)` |
| CLOB | Character large object | `description: CLOB` |
| BLOB | Binary large object | `image_data: BLOB` |
| DATE | Date value | `birth_date: DATE` |
| TIME | Time value | `start_time: TIME` |
| TIMESTAMP | Date and time | `created_at: TIMESTAMP` |
| BOOLEAN | Boolean value | `is_active: BOOLEAN` |
| XML | XML document | `config: XML` |
| GRAPHIC(n) | Fixed-length graphic string | `unicode_text: GRAPHIC(50)` |
| VARGRAPHIC(n) | Variable-length graphic string | `unicode_name: VARGRAPHIC(100)` |
| DBCLOB | Double-byte CLOB | `large_unicode: DBCLOB` |


## Materialization strategies

The `ibm-dbt-db2` adapter supports all standard dbt materializations:

### Table materialization

Creates a physical table in the database. This is the default materialization if not specified.

```sql
{{ config(materialized='table') }}

SELECT * FROM source_table
```

### View materialization

Creates a database view. Views are virtual tables that don't store data physically.

```sql
{{ config(materialized='view') }}

SELECT * FROM source_table
```

### Incremental materialization

Builds tables incrementally, processing only new or changed records. The `ibm-dbt-db2` adapter supports two incremental strategies:

#### Merge strategy (default)

Uses Db2's MERGE statement for efficient upserts:

```sql
{{
  config(
    materialized='incremental',
    unique_key='id',
    incremental_strategy='merge'
  )
}}

SELECT * FROM source_table
{% if is_incremental() %}
WHERE updated_at > (SELECT MAX(updated_at) FROM {{ this }})
{% endif %}
```

#### Delete+insert strategy

Deletes matching records then inserts new ones:

```sql
{{
  config(
    materialized='incremental',
    unique_key='id',
    incremental_strategy='delete+insert'
  )
}}

SELECT * FROM source_table
{% if is_incremental() %}
WHERE updated_at > (SELECT MAX(updated_at) FROM {{ this }})
{% endif %}
```

### Ephemeral materialization

Creates a Common Table Expression (CTE) that exists only for the duration of a single dbt run:

```sql
{{ config(materialized='ephemeral') }}

SELECT * FROM source_table
```


## Snapshots

The `ibm-dbt-db2` adapter supports dbt snapshots for tracking slowly changing dimensions (SCD Type 2). Snapshots capture the state of your data at different points in time.

Example snapshot:

```sql
{% snapshot customers_snapshot %}

{{
  config(
    target_schema='snapshots',
    unique_key='id',
    strategy='timestamp',
    updated_at='updated_at'
  )
}}

SELECT * FROM {{ source('raw', 'customers') }}

{% endsnapshot %}
```


## Constraints

The `ibm-dbt-db2` adapter supports defining constraints in your models, but enforcement varies:

| Constraint Type | Support Level | Notes |
|----------------|---------------|-------|
| NOT NULL | ✅ Enforced | Fully supported and enforced by Db2 |
| CHECK | ⚠️ Not Enforced | Defined but not enforced in dbt context |
| UNIQUE | ⚠️ Not Enforced | Defined but not enforced in dbt context |
| PRIMARY KEY | ⚠️ Not Enforced | Defined but not enforced in dbt context |
| FOREIGN KEY | ⚠️ Not Enforced | Defined but not enforced in dbt context |

Example with constraints:

```sql
{{
  config(
    materialized='table'
  )
}}

SELECT
  id,
  name,
  email,
  created_at
FROM source_table
```

Define constraints in your schema YAML:

```yaml
models:
  - name: customers
    columns:
      - name: id
        constraints:
          - type: not_null
          - type: primary_key
      - name: email
        constraints:
          - type: not_null
```


## Performance optimization

### Indexing

While dbt doesn't directly manage indexes, you can create them using post-hooks:

```sql
{{
  config(
    materialized='table',
    post_hook=[
      "CREATE INDEX idx_customer_email ON {{ this }} (email)",
      "CREATE INDEX idx_customer_created ON {{ this }} (created_at)"
    ]
  )
}}

SELECT * FROM source_table
```

### Table organization

Db2 supports different table organization types. You can specify these using post-hooks:

```sql
{{
  config(
    materialized='table',
    post_hook=[
      "ALTER TABLE {{ this }} ORGANIZE BY ROW"
    ]
  )
}}

SELECT * FROM source_table
```


## Grants management

The `ibm-dbt-db2` adapter supports managing grants on database objects:

```sql
{{
  config(
    materialized='table',
    grants={
      'select': ['reporting_role', 'analyst_user'],
      'insert': ['etl_role'],
      'update': ['etl_role']
    }
  )
}}

SELECT * FROM source_table
```


## Case sensitivity

Db2 uppercases unquoted identifiers by default. The adapter handles this automatically, but keep in mind:

- Unquoted table and column names will be uppercased
- Use double quotes to preserve case: `"MyTable"` vs `MYTABLE`
- The adapter automatically handles case conversion for dbt operations


## Recommendations

- **Check SQL Documentation**: Review IBM Db2 [SQL Reference](https://www.ibm.com/docs/en/db2) to understand platform-specific features and limitations.
- **Use Incremental Models**: For large datasets, use incremental materializations with the `merge` strategy for optimal performance.
- **Explicit Data Types**: Always define data types explicitly in seed configurations to ensure correct data loading.
- **Connection Pooling**: Use appropriate thread counts in your profile to balance parallelism and connection overhead.
- **SSL/TLS in Production**: Enable SSL/TLS security for production databases to protect data in transit.
- **Monitor Performance**: Use Db2's built-in monitoring tools to track query performance and optimize your models.
- **Test Incrementally**: When developing incremental models, test with small data samples before running on full datasets.
