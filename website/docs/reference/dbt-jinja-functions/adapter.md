---
title: "adapter"
id: "adapter"
---

## Overview

`adapter` is a wrapper around the internal database adapter used by dbt. It allows users to make calls to the database in their dbt models. The adapter methods below will be translated into specific SQL statements depending on the type of adapter your project is using.

The following functions are available:

- [adapter.dispatch](#dispatch)
- [adapter.get_missing_columns](#get_missing_columns)
- [adapter.expand_target_column_types](#expand_target_column_types)
- [adapter.get_relation](#get_relation)
- [adapter.get_columns_in_relation](#get_columns_in_relation)
- [adapter.create_schema](#create_schema)
- [adapter.drop_schema](#drop_schema)
- [adapter.drop_relation](#drop_relation)
- [adapter.rename_relation](#rename_relation)

### Deprecated adapter functions

The following adapter functions are deprecated, and will be removed in a future release.
- [adapter.get_columns_in_table](#get_columns_in_table) **(deprecated)**
- [adapter.already_exists](#already_exists) **(deprecated)**
- [adapter_macro](#adapter_macro) **(deprecated)**

## dispatch
<Changelog>New in v0.18.0</Changelog>

__Args__:

  * `macro_name`: name of macro to dynamically implement
  * `packages`: optional list (`[]`) of packages to search for implementations (defaults to root project)
  
Finds an adapter-appropriate version of a named macro. If `packages` is specified,
searches the packages in order until it finds a working implementation.

Adapter-specific macros are prefixed with the lowercase adapter name and two
underscores. For a macro named `my_macro`:
* Postgres: `postgres__my_macro`
* Redshift: `redshift__my_macro`
* Snowflake: `snowflake__my_macro`
* BigQuery: `bigquery__my_macro`
* OtherAdapter: `otheradapter__my_macro`
* _default:_ `default__my_macro`

**Usage**:

<Tabs
  defaultValue="simple"
  values={[
    { label: 'Simple', value: 'simple', },
    { label: 'Intermediate', value: 'advanced', },
  ]
}>
<TabItem value="simple">

I want to define a macro, `concat`, that compiles to the SQL function `concat()` as its
default behavior. On Redshift and Snowflake, however, I want to use the `||` operator instead.

<File name='macros/concat.sql'>

```sql
{% macro concat(fields) -%}
  {{ adapter.dispatch('concat')(fields) }}
{%- endmacro %}


{% macro default__concat(fields) -%}
    concat({{ fields|join(', ') }})
{%- endmacro %}


{% macro redshift__concat(fields) %}
    {{ fields|join(' || ') }}
{% endmacro %}


{% macro snowflake__concat(fields) %}
    {{ fields|join(' || ') }}
{% endmacro %}
```

</File>

</TabItem>

<TabItem value="advanced">

I want to define a macro, `concat`, with a specific implementation on Redshift
that handles null values. In all other cases—including the default implementation—
I want to fall back on [`dbt_utils.concat`](https://github.com/fishtown-analytics/dbt-utils/blob/master/macros/cross_db_utils/concat.sql).

<File name='macros/concat.sql'>

```sql
{% macro concat(fields) -%}
  {{ adapter.dispatch('concat', packages = ['my_project', 'dbt_utils'])(fields) }}
{%- endmacro %}


{% macro redshift__concat(fields) %}
    {% for field in fields %}
        nullif({{ field }},'') {{ ' || ' if not loop.last }}
    {% endfor %}
{% endmacro %}
```

</File>

dbt prioritizes package specificity over adapter specificity. If I call the `concat` 
macro while running on Postgres, dbt will look for the following macros in order:

1. `my_project.postgres__concat` (not found)
2. `my_project.default__concat` (not found)
3. `dbt_utils.postgres__concat` (not found)
4. `dbt_utils.default__concat` (found!)

</TabItem>
</Tabs>

## get_missing_columns
__Args__:

 * `from_relation`: The source [Relation](dbt-classes#relation)
 * `to_relation`: The target [Relation](dbt-classes#relation)

Returns a list of [Columns](dbt-classes#column) that is the difference of the columns in the `from_table`
and the columns in the `to_table`, i.e. (`set(from_relation.columns) - set(to_table.columns)`).
Useful for detecting new columns in a source table.

**Usage**:

<File name='models/example.sql'>

```sql
{%- set target_relation = api.Relation.create(
      database='database_name',
      schema='schema_name',
      identifier='table_name') -%}


{% for col in adapter.get_missing_columns(target_relation, this) %}
  alter table {{this}} add column "{{col.name}}" {{col.data_type}};
{% endfor %}
```

</File>

## expand_target_column_types
__Args__:

 * `from_relation`: The source [Relation](dbt-classes#relation) to use as a template
 * `to_relation`: The [Relation](dbt-classes#relation) to mutate

Expand the `to_relation` table's column types to match the schema of `from_relation`. Column expansion is constrained to string and numeric types on supported databases. Typical usage involves expanding column types (from eg. `varchar(16)` to `varchar(32)`) to support insert statements.

**Usage**:

<File name='example.sql'>

```sql
{% set tmp_relation = adapter.get_relation(...) %}
{% set target_relation = adapter.get_relation(...) %}

{% do adapter.expand_target_column_types(tmp_realtion, target_relation) %}
```

</File>


## get_relation
__Args__:

 * `database`: The database of the relation to fetch
 * `schema`: The schema of the relation to fetch
 * `identifier`: The identifier of the relation to fetch

Returns a [Relation](dbt-classes#relation) object identified by the `database.schema.identifier` provided to the method, or `None` if the relation does not exist.

**Usage**:

<File name='example.sql'>

```sql

{%- set source_relation = adapter.get_relation(
      database="analytics",
      schema="dbt_drew",
      identifier="orders") -%}

{{ log("Source Relation: " ~ source_relation, info=true) }}

```

</File>


## get_columns_in_relation
__Args__:

 * `relation`: The [Relation](dbt-classes#relation) to find the columns for

Returns a list of [Columns](dbt-classes#column) in a table.

**Usage**:

<File name='example.sql'>

```sql

{%- set columns = adapter.get_columns_in_relation(this) -%}

{% for column in columns %}
  {{ log("Column: " ~ column, info=true) }}
{% endfor %}

```

</File>

## create_schema
__Args__:

 * `relation`: A relation object with the database and schema to create. Any identifier on the relation will be ignored.

Creates a schema (or equivalent) in the target database. If the target schema already exists, then this method is a no-op.

**Usage:**

<File name='example.sql'>

```sql

{% do adapter.create_schema(api.Relation.create(database=target.database, schema="my_schema"))) %}
```

</File>

## drop_schema
__Args__:

 * `relation`: A relation object with the database and schema to drop. Any identifier on the relation will be ignored.

Drops a schema (or equivalent) in the target database. If the target schema does not exist, then this method is a no-op. The specific implementation is adapter-dependent, but adapters should implement a cascading drop, such that objects in the schema are also dropped. **Note**: this adapter method is destructive, so please use it with care!

**Usage:**

<File name='example.sql'>

```sql

{% do adapter.drop_schema(api.Relation.create(database=target.database, schema="my_schema"))) %}
```

</File>

## drop_relation
__Args__:

 * `relation`: The Relation to drop

Drops a Relation in the database. If the target relation does not exist, then this method is a no-op. The specific implementation is adapter-dependent, but adapters should implement a cascading drop, such that bound views downstream of the dropped relation are also dropped. **Note**: this adapter method is destructive, so please use it with care!

The `drop_relation` method will remove the specified relation from dbt's relation cache.

**Usage:**

<File name='example.sql'>

```sql

{% do adapter.drop_relation(this) %}
```

</File>

## rename_relation
__Args__:

 * `from_relation`: The Relation to rename
 * `to_relation`: The destination Relation to rename `from_relation` to

Renames a Relation the database.  The `rename_relation` method will rename the specified relation in dbt's relation cache.

**Usage:**

<File name='example.sql'>

```sql

{%- set old_relation = adapter.get_relation(
      database=this.database,
      schema=this.schema,
      identifier=this.identifier) -%}

{%- set backup_relation = adapter.get_relation(
      database=this.database,
      schema=this.schema,
      identifier=this.identifier ~ "__dbt_backup") -%}

{% do adapter.rename_relation(old_relation, backup_relation) %}
```

</File>

## get_columns_in_table

:::danger Deprecated

This method is deprecated and will be removed in a future release. Please use [get_columns_in_relation](#get_columns_in_relation) instead.

:::

__Args__:

 * `schema_name`: The schema to test
 * `table_name`: The table (or view) from which to select columns

Returns a list of [Columns](dbt-classes#column) in a table.

<File name='models/example.sql'>

```sql
{% set dest_columns = adapter.get_columns_in_table(schema, identifier) %}
{% set dest_cols_csv = dest_columns | map(attribute='quoted') | join(', ') %}

insert into {{ this }} ({{ dest_cols_csv }}) (
  select {{ dest_cols_csv }}
  from {{ref('another_table')}}
);
```

</File>

## already_exists

:::danger Deprecated

This method is deprecated and will be removed in a future release. Please use [get_relation](#get_relation) instead.

:::

__Args__:

 * `schema`: The schema to test
 * `table`: The relation to look for

Returns true if a relation named like `table` exists in schema `schema`, false otherwise.

<File name='models/example.sql'>

```text
select * from {{ref('raw_table')}}

{% if adapter.already_exists(this.schema, this.name) %}
  where id > (select max(id) from {{this}})
{% endif %}
```

</File>

## adapter_macro

:::danger Deprecated

This method is deprecated and will be removed in a future release. Please use [adapter.dispatch](#dispatch) instead.

:::

Prior to v0.18.0, dbt supported a limited version of `dispatch` functionality via
a macro named `adapter_macro`.

__Args__:

  * `name`: name of macro to implement
  * `*args`
  * `**kwargs`
  
Finds an adapter-appropriate version of a named macro and implements it with the
positional and/or keyword arguments provided. This is most relevant for macros
in open-source packages with cross-database support.

**Usage:**

<File name='macros/concat.sql'>

```sql
{% macro concat(fields) -%}
  {{ adapter_macro('concat', fields) }}
{%- endmacro %}


{% macro default__concat(fields) -%}
    concat({{ fields|join(', ') }})
{%- endmacro %}


{% macro redshift__concat(fields) %}
    {{ fields|join(' || ') }}
{% endmacro %}


{% macro snowflake__concat(fields) %}
    {{ fields|join(' || ') }}
{% endmacro %}
```

</File>
