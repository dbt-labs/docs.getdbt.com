---
title: "about this"
sidebar_label: "this"
id: "this"
description: "Represents the current model in the database."
keywords: 
  - relation, relation object, this function, this jinja, this.database, this.schema, this.identifier
---

`this` is the database representation of the current model. It is useful when:
- Defining a `where` statement within [incremental models](/docs/build/incremental-models)
- Using [pre or post hooks](/reference/resource-configs/pre-hook-post-hook)

`this` is a [Relation](/reference/dbt-classes#relation), and as such, properties such as `{{ this.database }}` and `{{ this.schema }}` compile as expected. Refer to [using relation objects](#using-relation-objects) for more examples. 

`this` can be thought of as equivalent to `ref('<the_current_model>')`, and is a neat way to avoid circular dependencies.

## Examples

<Snippet path="hooks-to-grants" />

<VersionBlock lastVersion="1.1">

### Grant permissions on a model in a post-hook

<File name='dbt_project.yml'>

```yaml
models:
  project-name:
    +post-hook:
      - "grant select on {{ this }} to db_reader"
```

</File>

</VersionBlock>


### Configuring incremental models

<File name='models/stg_events.sql'>

```sql
{{ config(materialized='incremental') }}

select
    *,
    my_slow_function(my_column)

from raw_app_data.events

{% if is_incremental() %}
  where event_time > (select max(event_time) from {{ this }})
{% endif %}
```

</File>


### Using relation objects

`{{ this }}` is a [relation object](/reference/dbt-classes#relation_) built in dbt that simplifies the handling of database schema and table names while ensuring appropriate quoting in SQL code. You can use `{{ this }}` for various tasks, such as accessing attributes or validating relation types. 

The following command examples print out the database, schema, and identifier and also validate the relation type using the **Compile** button.

   <VersionBlock firstVersion="1.6">

  <File name='relation_usage.sql'>

  ```sql
  -- Accessing attributes

  {{ this.database }} # Fetches the database name
  {{ this.schema }} # Fetches the schema
  {{ this.identifier }} # Fetches the identifier (For example, table name)

  -- Validating relation type
  
  Is Table: {{ this.is_table }} # Validate if it's a table
  Is View: {{ this.is_view }} # Validate if it's a view
  Is CTE: {{ this.is_cte }} # Validate if it's a CTE
  ```
  </File>

   </VersionBlock>

   <VersionBlock lastVersion="1.5">

  <File name='relation_usage.sql'>

  ```sql
  -- Accessing attributes

  {{ this.database }} # Fetches the database name
  {{ this.schema }} # Fetches the schema
  {{ this.identifier }} # Returns the request

  -- Validating relation type
  
  Is Table: {{ this.is_table }} # Validate if it's a table
  Is View: {{ this.is_view }} # Validate if it's a view
  Is CTE: {{ this.is_cte }} # Validate if it's a CTE
  ```
  </File>

   </VersionBlock>

