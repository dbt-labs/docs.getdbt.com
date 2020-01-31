---
title: "graph"
id: "graph"
---

The `graph` context variable contains information about the _nodes_ in your dbt project. Models, sources, tests, and snapshots are all examples of nodes in dbt projects.

<Callout type="danger" title="Heads up">

dbt actively builds the `graph` variable during the [parsing phase](execute) of running dbt projects, so some properties of the `graph` context variable will be missing or incorrect during parsing. Please read the information below carefully to understand how to effectively use this variable.

</Callout>

### The graph context variable

The `graph` context variable is a dictionary which maps node ids onto dictionary representations of those nodes. A simplified example might look like:
```
{
  "model.project_name.model_name": {
    "config": {"materialzed": "table", "sort": "id"},
    "tags": ["abc", "123"],
    "path": "models/path/to/model_name.sql",
    ...
  },
  "source.project_name.source_name": {
    "path": "models/path/to/schema.yml",
    "columns": {
      "id": { .... },
      "first_name": { .... },
    },
    ...
  }
}
```

The exact contract for these model and source nodes is not currently documented, but that will change in the future.

### Accessing models
The `model` entries in the `graph` dictionary will be incomplete or incorrect during parsing. If accessing the models in your project via the `graph` variable, be sure to use the [execute](execute) flag to ensure that this code only executes at run-time and not at parse-time. Do not use the `graph` variable to build you DAG, as the resulting dbt behavior will be undefined and likely incorrect. Example usage:

<File name='graph-usage.sql'>

```sql

/*
  Print information about all of the models in the Snowplow package
*/

{% if execute %}
  {% for node in graph.nodes.values()
     | selectattr("resource_type", "equalto", "model")
     | selectattr("package_name", "equalto", "snowplow") %}
  
    {% do log(node.unique_id ~ ", materialized: " ~ node.config.materialized, info=true) %}
  
  {% endfor %}
{% endif %}

/*
  Example output
---------------------------------------------------------------
model.snowplow.snowplow_id_map, materialized: incremental
model.snowplow.snowplow_page_views, materialized: incremental
model.snowplow.snowplow_web_events, materialized: incremental
model.snowplow.snowplow_web_page_context, materialized: table
model.snowplow.snowplow_web_events_scroll_depth, materialized: incremental
model.snowplow.snowplow_web_events_time, materialized: incremental
model.snowplow.snowplow_web_events_internal_fixed, materialized: ephemeral
model.snowplow.snowplow_base_web_page_context, materialized: ephemeral
model.snowplow.snowplow_base_events, materialized: ephemeral
model.snowplow.snowplow_sessions_tmp, materialized: incremental
model.snowplow.snowplow_sessions, materialized: table
*/
```

</File>

### Accessing sources

To access the sources in your dbt project programatically, filter for nodes where the `resource_type == 'source'`.

Example usage:

<File name='models/events_unioned.sql'>

```sql
/*
  Union all of the Snowplow sources defined in the project
  which begin with the string "event_"
*/

{% set sources = [] -%}
{% for node in graph.nodes.values() | selectattr("resource_type", "equalto", "source") -%}
  {%- if node.name.startswith('event_') and node.source_name == 'snowplow' -%}
    {%- do sources.append(source(node.source_name, node.name)) -%}
  {%- endif -%}
{%- endfor %}

select * from (
  {%- for source in sources %}
    {{ source }} {% if not loop.last %} union all {% endif %}
  {% endfor %}
)

/*
  Example compiled SQL
---------------------------------------------------------------
select * from (
  select * from raw.snowplow.event_add_to_cart union all
  select * from raw.snowplow.event_remove_from_cart union all
  select * from raw.snowplow.event_checkout
)
*/

```

</File>
