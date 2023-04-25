---
title: "Oracle configurations"
id: "oracle-configs"
---

<VersionBlock firstVersion="1.3.2">

## Use `parallel` hint

Table materialization supports specifying the number of parallel executions as shown below

```sql
-- Create a dbt model using 4 parallel executions
{{config(materialized='table', parallel=4}}
SELECT c.cust_id, c.cust_first_name, c.cust_last_name
from {{ source('sh_database', 'customers') }} c
```

## Use `table_compression_clause`

Table materialization supports different compression clauses as shown below

### Advanced Row Compression

With Advanced compression enabled, Oracle Database maintains compression during all types of data manipulation operations, including conventional DML such as INSERT and UPDATE.
`ROW STORE COMPRESS ADVANCED` is recommended in OLTP systems.

```sql
-- Advanced Row compression
{{config(materialized='table', table_compression_clause='ROW STORE COMPRESS ADVANCED')}}
SELECT c.cust_id, c.cust_first_name, c.cust_last_name
from {{ source('sh_database', 'customers') }} c
```

### Hybrid Columnar Compression

#### Querying

`COLUMN STORE COMPRESS FOR QUERY` is useful in data ware house environments. Valid values are `HIGH` or `LOW`, with `HIGH` providing a higher compression ratio. The default is `HIGH`

```sql
{{config(materialized='table', table_compression_clause='COLUMN STORE COMPRESS FOR QUERY LOW')}}
SELECT c.cust_id, c.cust_first_name, c.cust_last_name
from {{ source('sh_database', 'customers') }} c
```

or

```sql
{{config(materialized='table', table_compression_clause='COLUMN STORE COMPRESS FOR QUERY HIGH')}}
SELECT c.cust_id, c.cust_first_name, c.cust_last_name
from {{ source('sh_database', 'customers') }} c
```

#### Archival

`COLUMN STORE COMPRESS FOR ARCHIVE` supports higher compression ratio than `COLUMN STORE COMPRESS FOR QUERY` and is useful for archival. Valid values are `HIGH` or `LOW` with `HIGH` providing the highest compression ratio. The default is `LOW`

```sql
{{config(materialized='table', table_compression_clause='COLUMN STORE COMPRESS FOR ARCHIVE LOW')}}
SELECT c.cust_id, c.cust_first_name, c.cust_last_name
from {{ source('sh_database', 'customers') }} c
```

or

```sql
{{config(materialized='table', table_compression_clause='COLUMN STORE COMPRESS FOR ARCHIVE HIGH')}}
SELECT c.cust_id, c.cust_first_name, c.cust_last_name
from {{ source('sh_database', 'customers') }} c
```


</VersionBlock>
