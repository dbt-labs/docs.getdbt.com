---
title: "Custom aliases"
description: "Read this tutorial to learn how to use custom aliases when building in dbt."
id: "custom-aliases"
---

## Overview

When dbt runs a model, it will generally create a relation (either a `table` or a `view`) in the database. By default, dbt uses the filename of the model as the identifier for this relation in the database. This identifier can optionally be overridden using the `alias` model configuration.

### Why alias model names?
The names of schemas and tables are effectively the "user interface" of your <Term id="data-warehouse" />. Well-named schemas and tables can help provide clarity and direction for consumers of this data. In combination with [custom schemas](/docs/build/custom-schemas), model aliasing is a powerful mechanism for designing your warehouse.

### Usage
The `alias` config can be used to change the name of a model's identifier in the database. The following <Term id="table" /> shows examples of database identifiers for models both with, and without, a supplied `alias`.

| Model | Config | Database Identifier |
| ----- | ------ | ------------------- |
| ga_sessions.sql | &lt;None&gt; | "analytics"."ga_sessions" |
| ga_sessions.sql | {{ config(alias='sessions') }} | "analytics"."sessions" |

To configure an alias for a model, supply a value for the model's `alias` configuration parameter. For example:

<File name='models/google_analytics/ga_sessions.sql'>

```sql

-- This model will be created in the database with the identifier `sessions`
-- Note that in this example, `alias` is used along with a custom schema
{{ config(alias='sessions', schema='google_analytics') }}

select * from ...
```

</File>

When referencing the `ga_sessions` model above from a different model, use the `ref()` function with the model's _filename_ as usual. For example:

<File name='models/combined_sessions.sql'>

```sql

-- Use the model's filename in ref's, regardless of any aliasing configs

select * from {{ ref('ga_sessions') }}
union all
select * from {{ ref('snowplow_sessions') }}
```

</File>

### generate_alias_name

The alias generated for a model is controlled by a macro called `generate_alias_name`. This macro can be overridden in a dbt project to change how dbt aliases models. This macro works similarly to the [generate_schema_name](/docs/build/custom-schemas#advanced-custom-schema-configuration) macro.

To override dbt's alias name generation, create a macro named `generate_alias_name` in your own dbt project. The `generate_alias_name` macro accepts two arguments:

1. The custom alias supplied in the model config
2. The node that a custom alias is being generated for

The default implementation of `generate_alias_name` simply uses the supplied `alias` config (if present) as the model alias, otherwise falling back to the model name. This implementation looks like this:

<VersionBlock lastVersion="1.4">

<File name='get_custom_alias.sql'>

```jinja2
{% macro generate_alias_name(custom_alias_name=none, node=none) -%}

    {%- if custom_alias_name is none -%}

        {{ node.name }}

    {%- else -%}

        {{ custom_alias_name | trim }}

    {%- endif -%}

{%- endmacro %}

```

</File>

</VersionBlock>

<VersionBlock firstVersion="1.5">

<File name='get_custom_alias.sql'>

```jinja2
{% macro generate_alias_name(custom_alias_name=none, node=none) -%}

    {%- if custom_alias_name -%}

        {{ custom_alias_name | trim }}

    {%- elif node.version -%}

        {{ return(node.name ~ "_v" ~ (node.version | replace(".", "_"))) }}

    {%- else -%}

        {{ node.name }}

    {%- endif -%}

{%- endmacro %}

```

</File>

</VersionBlock>

<VersionBlock firstVersion="1.6">

### Managing different behaviors across packages

See docs on macro `dispatch`: ["Managing different global overrides across packages"](/reference/dbt-jinja-functions/dispatch)

</VersionBlock>

### Caveats

#### Ambiguous database identifiers

Using aliases, it's possible to accidentally create models with ambiguous identifiers. Given the following two models, dbt would attempt to create two <Term id="view">views</Term> with _exactly_ the same names in the database (ie. `sessions`):

```sql
-- models/snowplow_sessions.sql

{{ config(alias='sessions') }}

select * from ...
```

```sql
-- models/sessions.sql

select * from ...
```

Whichever one of these models runs second would "win", and generally, the output of dbt would not be what you would expect. To avoid this failure mode, dbt will check if your model names and aliases are ambiguous in nature. If they are, you will be presented with an error message like this:

```
$ dbt compile
Encountered an error:
Compilation Error
  dbt found two resources with the database representation "analytics.sessions".
  dbt cannot create two resources with identical database representations. To fix this,
  change the "schema" or "alias" configuration of one of these resources:
  - model.my_project.snowplow_sessions (models/snowplow_sessions.sql)
  - model.my_project.sessions (models/sessions.sql)
```

If these models should indeed have the same database identifier, you can work around this error by configuring a [custom schema](/docs/build/custom-schemas) for one of the models.

#### Model versions

<VersionBlock lastVersion="1.4">

New in v1.5

</VersionBlock>

<VersionBlock firstVersion="1.5">

**Related documentation:**
- [Model versions](/docs/collaborate/govern/model-versions)
- [`versions`](/reference/resource-properties/versions#alias)

By default, dbt will create versioned models with the alias `<model_name>_v<v>`, where `<v>` is that version's unique identifier. You can customize this behavior just like for non-versioned models by configuring a custom `alias` or re-implementing the `generate_alias_name` macro.

</VersionBlock>
