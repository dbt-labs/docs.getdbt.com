---
title: "Custom aliases"
description: "Read this tutorial to learn how to use custom aliases when building in dbt."
id: "custom-aliases"
---

## Overview

When dbt runs a model, it will generally create a relation (either a <Term id="table" /> or a <Term id="view" /> ) in the database, except in the case of an [ephemeral model](/docs/build/materializations), when it will create a <Term id="cte" /> for use in another model. By default, dbt uses the model's filename as the identifier for the relation or CTE it creates. This identifier can be overridden using the [`alias`](/reference/resource-configs/alias) model configuration.

### Why alias model names?
The names of schemas and tables are effectively the "user interface" of your <Term id="data-warehouse" />. Well-named schemas and tables can help provide clarity and direction for consumers of this data. In combination with [custom schemas](/docs/build/custom-schemas), model aliasing is a powerful mechanism for designing your warehouse.

The file naming scheme that you use to organize your models may also interfere with your data platform's requirements for identifiers. For example, you might wish to namespace your files using a period (`.`), but your data platform's SQL dialect may interpret periods to indicate a separation between schema names and table names in identifiers, or it may forbid periods from being used at all in CTE identifiers. In cases like these, model aliasing can allow you to retain flexibility in the way you name your model files without violating your data platform's identifier requirements.

### Usage
The `alias` config can be used to change the name of a model's identifier in the database. The following table shows examples of database identifiers for models both with and without a supplied `alias`, and with different materializations.

| Model | Config | Relation Type | Database Identifier |
| ----- | ------ | --------------| ------------------- |
| ga_sessions.sql | \{\{ config(materialization='view') \}\} | <Term id="view" /> | "analytics"."ga_sessions" |
| ga_sessions.sql | \{\{ config(materialization='view', alias='sessions') \}\} | <Term id="view" /> | "analytics"."sessions" |
| ga_sessions.sql | \{\{ config(materialization='ephemeral') \}\} | <Term id="cte" /> | "\__dbt\__cte\__ga_sessions" |
| ga_sessions.sql | \{\{ config(materialization='ephemeral', alias='sessions') \}\} | <Term id="cte" /> | "\__dbt\__cte\__sessions" |

To configure an alias for a model, supply a value for the model's `alias` configuration parameter. For example:

<File name='models/google_analytics/ga_sessions.sql'>

```sql

-- This model will be created in the database with the identifier `sessions`
-- Note that in this example, `alias` is used along with a custom schema
{{ config(alias='sessions', schema='google_analytics') }}

select * from ...
```

</File>

Or in a `schema.yml` file.

<File name='models/google_analytics/schema.yml'>

```yaml
models:
  - name: ga_sessions
    config:
      alias: sessions
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

import WhitespaceControl from '/snippets/_whitespace-control.md';

<WhitespaceControl/>

### Dispatch macro - SQL alias management for databases and dbt packages

See docs on macro `dispatch`: ["Managing different global overrides across packages"](/reference/dbt-jinja-functions/dispatch#managing-different-global-overrides-across-packages)


### Caveats

#### Ambiguous database identifiers

Using aliases, it's possible to accidentally create models with ambiguous identifiers. Given the following two models, dbt would attempt to create two <Term id="view">views</Term> with _exactly_ the same names in the database (ie. `sessions`):

<File name='models/snowplow_sessions.sql'>

```sql
{{ config(alias='sessions') }}

select * from ...
```
</File>

<File name='models/sessions.sql'>

```sql
select * from ...
```

</File>

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

**Related documentation:**
- [Model versions](/docs/collaborate/govern/model-versions)
- [`versions`](/reference/resource-properties/versions#alias)

By default, dbt will create versioned models with the alias `<model_name>_v<v>`, where `<v>` is that version's unique identifier. You can customize this behavior just like for non-versioned models by configuring a custom `alias` or re-implementing the `generate_alias_name` macro.

## Related docs

- [Customize dbt models database, schema, and alias](/guides/customize-schema-alias?step=1) to learn how to customize dbt models database, schema, and alias
- [Custom schema](/docs/build/custom-schemas) to learn how to customize dbt schema 
- [Custom database](/docs/build/custom-databases) to learn how to customize dbt database
