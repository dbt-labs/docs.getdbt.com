---
title: "about this"
sidebar_label: "this"
id: "this"
description: "Represents the current model in the database."
keywords: 
  - relation, relation object, this function, this jinja, this.database, this.schema, this.identifier
meta:
  label: 'this'
---

`this` is the database representation of the current model. It is useful when:
- Defining a `where` statement within [incremental models](/docs/build/incremental-models)
- Using [pre or post hooks](/reference/resource-configs/pre-hook-post-hook)

`this` is a [Relation](/reference/dbt-classes#relation), and as such, properties such as `{{ this.database }}` and `{{ this.schema }}` compile as expected. 
  - Note &mdash; Prior to dbt v1.6, the dbt Cloud IDE returns `request` as the result of `{{ ref.identifier }}`.

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



  