---
resource_types: sources
datatype: table_identifier
---

<File name='models/<filename>.yml'>

```yml
version: 2

sources:
  - name: <source_name>
    database: <database_name>
    tables:
      - name: <table_name>
        identifier: <table_identifier>

```

</File>

## Definition
The <Term id="table" /> name as stored in the database.

This parameter is useful if you want to use a source table name that differs from the table name in the database.

## Default
By default, dbt will use the table's `name` parameter as the identifier.

## Examples
### Use a simpler name for a source table than the one in your database

<File name='models/<filename>.yml'>

```yml
version: 2

sources:
  - name: jaffle_shop
    tables:
      - name: orders
        identifier: api_orders

```

</File>


In a downstream model:
```sql
select * from {{ source('jaffle_shop', 'orders') }}
```

Will get compiled to:
```sql
select * from jaffle_shop.api_orders
```

### Reference sharded tables as a source in BigQuery

<File name='models/<filename>.yml'>

```yml
version: 2

sources:
  - name: ga
    tables:
      - name: events
        identifier: "events_*"

```

</File>


In a downstream model:
```sql
select * from {{ source('ga', 'events') }}

-- filter on shards by suffix
where _table_suffix > '20200101'
```

Will get compiled to:
```sql
select * from `my_project`.`ga`.`events_*`

-- filter on shards by suffix
where _table_suffix > '20200101'
```
