---
title: "About adapter object"
sidebar_label: "adapter"
id: "adapter"
description: "Wrap the internal database adapter with the Jinja object `adapter`."
---

Your database communicates with dbt using an internal database adapter object. For example, BaseAdapter and SnowflakeAdapter. The Jinja object `adapter` is a wrapper around this internal database adapter object.

`adapter` grants the ability to invoke adapter methods of that internal class via:
* `{% do adapter.<method name> %}` -- invoke internal adapter method 
* `{{ adapter.<method name> }}` -- invoke internal adapter method and capture its return value for use in materialization or other macros

For example, the adapter methods below will be translated into specific SQL statements depending on the type of adapter your project is using:

- [adapter.dispatch](/reference/dbt-jinja-functions/dispatch)
- [adapter.get_missing_columns](#get_missing_columns)
- [adapter.expand_target_column_types](#expand_target_column_types)
- [adapter.get_relation](#get_relation) or [load_relation](#load_relation)
- [adapter.get_columns_in_relation](#get_columns_in_relation)
- [adapter.create_schema](#create_schema)
- [adapter.drop_schema](#drop_schema)
- [adapter.drop_relation](#drop_relation)
- [adapter.rename_relation](#rename_relation)
- [adapter.quote](#quote)

### Deprecated adapter functions

The following adapter functions are deprecated, and will be removed in a future release.
- [adapter.get_columns_in_table](#get_columns_in_table) **(deprecated)**
- [adapter.already_exists](#already_exists) **(deprecated)**
- [adapter_macro](#adapter_macro) **(deprecated)**

## dispatch

Moved to separate page: [dispatch](/reference/dbt-jinja-functions/dispatch)

## get_missing_columns
__Args__:

 * `from_relation`: The source [Relation](/reference/dbt-classes#relation)
 * `to_relation`: The target [Relation](/reference/dbt-classes#relation)

Returns a list of [Columns](/reference/dbt-classes#column) that is the difference of the columns in the `from_table`
and the columns in the `to_table`, i.e. (`set(from_relation.columns) - set(to_table.columns)`).
Useful for detecting new columns in a source <Term id="table" />.

**Usage**:

<File name='models/example.sql'>

```sql
{%- set target_relation = api.Relation.create(
      database='database_name',
      schema='schema_name',
      identifier='table_name') -%}


{% for col in adapter.get_missing_columns(target_relation, this) %}
  alter <Term id="table" /> {{this}} add column "{{col.name}}" {{col.data_type}};
{% endfor %}
```

</File>

## expand_target_column_types
__Args__:

 * `from_relation`: The source [Relation](/reference/dbt-classes#relation) to use as a template
 * `to_relation`: The [Relation](/reference/dbt-classes#relation) to mutate

Expand the `to_relation` <Term id="table" />'s column types to match the schema of `from_relation`. Column expansion is constrained to string and numeric types on supported databases. Typical usage involves expanding column types (from eg. `varchar(16)` to `varchar(32)`) to support insert statements.

**Usage**:

<File name='example.sql'>

```sql
{% set tmp_relation = adapter.get_relation(...) %}
{% set target_relation = adapter.get_relation(...) %}

{% do adapter.expand_target_column_types(tmp_relation, target_relation) %}
```

</File>


## get_relation
__Args__:

 * `database`: The database of the relation to fetch
 * `schema`: The schema of the relation to fetch
 * `identifier`: The identifier of the relation to fetch

Returns a cached [Relation](/reference/dbt-classes#relation) object identified by the `database.schema.identifier` provided to the method, or `None` if the relation does not exist.

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

## load_relation
__Args__:

 * `relation`: The [Relation](/reference/dbt-classes#relation) to try to load

A convenience wrapper for [get_relation](#get_relation). Returns the cached version of the [Relation](/reference/dbt-classes#relation) object, or `None` if the relation does not exist.

**Usage**:

<File name='example.sql'>

```sql

{% set relation_exists = load_relation(ref('my_model')) is not none %}
{% if relation_exists %}
      {{ log("my_model has already been built", info=true) }}
{% else %}
      {{ log("my_model doesn't exist in the warehouse. Maybe it was dropped?", info=true) }}
{% endif %}

```

</File>


## get_columns_in_relation
__Args__:

 * `relation`: The [Relation](/reference/dbt-classes#relation) to find the columns for

Returns a list of [Columns](/reference/dbt-classes#column) in a <Term id="table" />.

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

{% do adapter.create_schema(api.Relation.create(database=target.database, schema="my_schema")) %}
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

Drops a Relation in the database. If the target relation does not exist, then this method is a no-op. The specific implementation is adapter-dependent, but adapters should implement a cascading drop, such that bound <Term id="view">views</Term> downstream of the dropped relation are also dropped. **Note**: this adapter method is destructive, so please use it with care!

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


## quote
__Args__:

 * `identifier`: A string to quote

Encloses `identifier` in the correct quotes for the adapter when escaping reserved column names etc.

**Usage:**

<File name='example.sql'>

```sql
select 
      'abc' as {{ adapter.quote('table_name') }},
      'def' as {{ adapter.quote('group by') }} 
```

</File>

## get_columns_in_table

:::danger Deprecated

This method is deprecated and will be removed in a future release. Please use [get_columns_in_relation](#get_columns_in_relation) instead.

:::

__Args__:

 * `schema_name`: The schema to test
 * `table_name`: The <Term id="table" /> (or view) from which to select columns

Returns a list of [Columns](/reference/dbt-classes#column) in a <Term id="table" />.

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
 * `<Term id="table" />`: The relation to look for

Returns true if a relation named like `<Term id="table" />` exists in schema `schema`, false otherwise.

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
