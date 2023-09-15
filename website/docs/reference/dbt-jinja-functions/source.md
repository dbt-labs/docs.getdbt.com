---
title: "About source function"
sidebar_label: "source"
id: "source"
description: "Read this guide to understand the source Jinja function in dbt."
---

```sql
select * from {{ source(source_name, table_name) }}
```

## Definition

This function:
- Returns a [Relation](/reference/dbt-classes#relation) for a [source](/docs/build/sources)
  - Note &mdash; Starting from dbt v1.6 or higher, `{{ {source.identifier }}` will fetch the identifier (such as table name). Previously it would only return the request.
- Creates dependencies between a source and the current model, which is useful for documentation and model selection
- Compiles to the full object name in the database


## Related guides
- [Using sources](/docs/build/sources)

## Arguments
* `source_name`: The `name:` defined under a `sources:` key
* `table_name`: The `name:` defined under a `tables:` key

## Example

Consider a source defined as follows:

<File name='models/<filename>.yml'>

```yaml
version: 2

sources:
  - name: jaffle_shop # this is the source_name
    database: raw

    tables:
      - name: customers # this is the table_name
      - name: orders
```

</File>

Select from the source in a model:

<File name='models/orders.sql'>

```sql
select
  ...

from {{ source('jaffle_shop', 'customers') }}

left join {{ source('jaffle_shop', 'orders') }} using (customer_id)

```

</File>
