---
title: "About graph context variable"
sidebar_label: "graph"
id: "graph"
description: "The `graph` context variable contains info about nodes in your project."
---

The `graph` context variable contains information about the _nodes_ in your dbt
project. Models, sources, tests, and snapshots are all examples of nodes in dbt
projects.

:::danger Heads up

dbt actively builds the `graph` variable during the [parsing phase](/reference/dbt-jinja-functions/execute) of
running dbt projects, so some properties of the `graph` context variable will be
missing or incorrect during parsing. Please read the information below carefully
to understand how to effectively use this variable.

:::

### The graph context variable

The `graph` context variable is a dictionary which maps node ids onto dictionary
representations of those nodes. A simplified example might look like:

<VersionBlock lastVersion="1.4">

```json
{
  "nodes": {
    "model.my_project.model_name": {
      "unique_id": "model.my_project.model_name",
      "config": {"materialized": "table", "sort": "id"},
      "tags": ["abc", "123"],
      "path": "models/path/to/model_name.sql",
      ...
    },
    ...
  },
  "sources": {
    "source.my_project.snowplow.event": {
      "unique_id": "source.my_project.snowplow.event",
      "database": "analytics",
      "schema": "analytics",
      "tags": ["abc", "123"],
      "path": "models/path/to/schema.yml",
      ...
    },
    ...
  },
  "exposures": {
    "exposure.my_project.traffic_dashboard": {
      "unique_id": "source.my_project.traffic_dashboard",
      "type": "dashboard",
      "maturity": "high",
      "path": "models/path/to/schema.yml",
      ...
    },
    ...
  },
  "metrics": {
    "metric.my_project.count_all_events": {
      "unique_id": "metric.my_project.count_all_events",
      "type": "count",
      "path": "models/path/to/schema.yml",
      ...
    },
    ...
  }
}
```

</VersionBlock>

<VersionBlock firstVersion="1.5">

```json
{
  "nodes": {
    "model.my_project.model_name": {
      "unique_id": "model.my_project.model_name",
      "config": {"materialized": "table", "sort": "id"},
      "tags": ["abc", "123"],
      "path": "models/path/to/model_name.sql",
      ...
    },
    ...
  },
  "sources": {
    "source.my_project.snowplow.event": {
      "unique_id": "source.my_project.snowplow.event",
      "database": "analytics",
      "schema": "analytics",
      "tags": ["abc", "123"],
      "path": "models/path/to/schema.yml",
      ...
    },
    ...
  },
  "exposures": {
    "exposure.my_project.traffic_dashboard": {
      "unique_id": "exposure.my_project.traffic_dashboard",
      "type": "dashboard",
      "maturity": "high",
      "path": "models/path/to/schema.yml",
      ...
    },
    ...
  },
  "metrics": {
    "metric.my_project.count_all_events": {
      "unique_id": "metric.my_project.count_all_events",
      "type": "count",
      "path": "models/path/to/schema.yml",
      ...
    },
    ...
  },
  "groups": {
    "group.my_project.finance": {
      "unique_id": "group.my_project.finance",
      "name": "finance",
      "owner": {
        "email": "finance@jaffleshop.com"
      }
      ...
    },
    ...
  }
}
```

</VersionBlock>

The exact contract for these model and source nodes is not currently documented,
but that will change in the future.

### Accessing models

The `model` entries in the `graph` dictionary will be incomplete or incorrect
during parsing. If accessing the models in your project via the `graph`
variable, be sure to use the [execute](/reference/dbt-jinja-functions/execute) flag to ensure that this code
only executes at run-time and not at parse-time. Do not use the `graph` variable
to build your DAG, as the resulting dbt behavior will be undefined and likely
incorrect. Example usage:

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

To access the sources in your dbt project programmatically, use the `sources`
attribute of the `graph` object.

Example usage:

<File name='models/events_unioned.sql'>

```sql
/*
  Union all of the Snowplow sources defined in the project
  which begin with the string "event_"
*/

{% set sources = [] -%}
{% for node in graph.sources.values() -%}
  {%- if node.name.startswith('event_') and node.source_name == 'snowplow' -%}
    {%- do sources.append(source(node.source_name, node.name)) -%}
  {%- endif -%}
{%- endfor %}

select * from (
  {%- for source in sources %}
    select * from {{ source }} {% if not loop.last %} union all {% endif %}
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

### Accessing exposures

To access the exposures in your dbt project programmatically, use the `exposures`
attribute of the `graph` object.

Example usage:

<File name='models/my_important_view_model.sql'>

```sql
{# Include a SQL comment naming all of the exposures that this model feeds into #}

{% set exposures = [] -%}
{% for exposure in graph.exposures.values() -%}
  {%- if model['unique_id'] in exposure.depends_on.nodes -%}
    {%- do exposures.append(exposure) -%}
  {%- endif -%}
{%- endfor %}

-- HELLO database administrator! Before dropping this view,
-- please be aware that doing so will affect:

{% for exposure in exposures %}
--   * {{ exposure.name }} ({{ exposure.type }})
{% endfor %}

/*
  Example compiled SQL
---------------------------------------------------------------
-- HELLO database administrator! Before dropping this view,
-- please be aware that doing so will affect:

--   * our_metrics (dashboard)
--   * my_sync (application)
*/

```

</File>

### Accessing metrics

To access the metrics in your dbt project programmatically, use the `metrics` attribute of the `graph` object.

Example usage:

<File name='macros/get_metric.sql'>

```sql
{% macro get_metric_sql_for(metric_name) %}

  {% set metrics = graph.metrics.values() %}
  
  {% set metric = (metrics | selectattr('name', 'equalto', metric_name) | list).pop() %}

  /* Elsewhere, I've defined a macro, get_metric_timeseries_sql, that will return 
     the SQL needed to perform a time-based rollup of this metric's calculation */

  {% set metric_sql = get_metric_timeseries_sql(
      relation = metric['model'],
      type = metric['type'],
      expression = metric['sql'],
      ...
  ) %}

  {{ return(metric_sql) }}

{% endmacro %}
```

</File>

### Accessing groups

To access the groups in your dbt project programmatically, use the `groups` attribute of the `graph` object.

Example usage:

<File name='macros/get_group.sql'>

```sql

{% macro get_group_owner_for(group_name) %}

  {% set groups = graph.groups.values() %}
  
  {% set owner = (groups | selectattr('owner', 'equalto', group_name) | list).pop() %}

  {{ return(owner) }}

{% endmacro %}
```

</File>
