---
title: "Create new materializations"
id: create-new-materializations
description: Learn how to create your own materializations.
displayText: Creating new materializations
hoverSnippet: Learn how to create your own materializations.
# time_to_complete: '30 minutes' commenting out until we test
icon: 'guides'
hide_table_of_contents: true
level: 'Advanced'
recently_updated: true
---

## Introduction

The model <Term id="materialization">materializations</Term> you're familiar with, `table`, `view`, and `incremental` are implemented as macros in a package that's distributed along with dbt. You can check out the [source code for these materializations](https://github.com/dbt-labs/dbt-core/tree/main/core/dbt/include/global_project/macros/materializations). If you need to create your own materializations, reading these files is a good place to start. Continue reading below for a deep-dive into dbt materializations.

:::caution 

This is an advanced feature of dbt. Let us know if you need a hand! We're always happy to  [chat](http://community.getdbt.com/).

:::

## Creating a materialization

Materialization blocks make it possible for dbt to load custom materializations from packages. The materialization blocks work very much like `macro` blocks, with a couple of key exceptions. Materializations are defined as follows:

```sql
{% materialization [materialization name], ["specified adapter" | default] %}
...
{% endmaterialization %}
```

Materializations can be given a name, and they can be tied to a specific adapter. dbt will pick the materialization tied to the currently-in-use adapter if one exists, or it will fall back to the `default` adapter. In practice, this looks like:

<File name='macros/my_materialization.sql'>

```sql
{% materialization my_materialization_name, default %}
 -- cross-adapter materialization... assume Redshift is not supported
{% endmaterialization %}


{% materialization my_materialization_name, adapter='redshift' %}
-- override the materialization for Redshift
{% endmaterialization %}
```

</File>



:::info 

dbt's ability to dynamically pick the correct materialization based on the active database target is called [multiple dispatch](https://en.wikipedia.org/wiki/Multiple_dispatch). This feature unlocks a whole world of cross-database compatibility features -- if you're interested in this, please let us know on Slack!

:::

### Anatomy of a materialization

Materializations are responsible for taking a dbt model sql statement and turning it into a transformed dataset in a database. As such, materializations generally take the following shape:

1. Prepare the database for the new model
2. Run pre-hooks
3. Execute any sql required to implement the desired materialization
4. Run post-model hooks
5. Clean up the database as required
6. Update the Relation cache

Each of these tasks are explained in sections below.

### Prepare the database

Materializations are responsible for creating new tables or <Term id="view">views</Term> in the database, or inserting/updating/deleting data from existing tables. As such, materializations need to know about the state of the database to determine exactly what sql they should run. Here is some pseudocode for the "setup" phase of the **<Term id="table" />** materialization:

```sql
-- Refer to the table materialization (linked above) for an example of real syntax
-- This code will not work and is only intended for demonstration purposes
{% set existing = adapter.get_relation(this) %}
{% if existing and existing.is_view  %}
  {% do adapter.drop_relation(existing) %}
{% endif %}
```

In this example, the `get_relation` method is used to fetch the state of the currently-executing model from the database. If the model exists as a view, then the view is dropped to make room for the table that will be built later in the materialization.

This is a simplified example, and the setup phase for a materialization can become quite complicated indeed! When building a materialization, be sure to consider the state of the database and any supplied [flags](/reference/dbt-jinja-functions/flags) (ie. `--full-refresh`) to ensure that the materialization code behaves correctly in different scenarios.

### Run pre-hooks

Pre- and post-hooks can be specified for any model -- be sure that your materialization plays nicely with these settings. Two variables, `pre_hooks` and `post_hooks` are automatically injected into the materialization context. Invoke these hooks at the appropriate time with:

```sql
...
{{ run_hooks(pre_hooks) }}
....
```
### Executing SQL

Construct your materialization <Term id="dml" /> to account for the different permutations of <Term id="table" /> existence, materialization flags, etc. There are a number of [adapter functions](/reference/dbt-jinja-functions/adapter) and context variables that can help you here. Be sure to consult the Reference section of this site for a full list of variables and functions at your disposal.

### Run post-hooks

See the section above on pre-hooks for more information on running post-hooks.

### Clean up

The "cleanup" phase of the materialization typically renames or drops relations and commits the transaction opened in "preparation" step above. The `table` materialization, for instance, executes the following cleanup code:

```
{{ drop_relation_if_exists(backup_relation) }}
```

Be sure to `commit` the transaction in the `cleanup` phase of the materialization with `{{ adapter.commit() }}`. If you do not commit this transaction, it will be rolled back by dbt and the transformations applied in your materialization will be discarded.

### Update the Relation cache

Materializations should [return](/reference/dbt-jinja-functions/return) the list of Relations that they have created at the end of execution. dbt will use this list of Relations to update the relation cache in order to reduce the number of queries executed against the database's `information_schema`. If a list of Relations is not returned, then dbt will raise a Deprecation Warning and infer the created relation from the model's configured database, schema, and alias.

<File name='macros/my_view_materialization.sql'>

```sql
{%- materialization my_view, default -%}

  {%- set target_relation = api.Relation.create(
        identifier=identifier, schema=schema, database=database,
        type='view') -%}

  -- ... setup database ...
  -- ... run pre-hooks...

  -- build model
  {% call statement('main') -%}
    {{ create_view_as(target_relation, sql) }}
  {%- endcall %}
  
  -- ... run post-hooks ...
  -- ... clean up the database...

  -- Return the relations created in this materialization
  {{ return({'relations': [target_relation]}) }}

{%- endmaterialization -%}


```

</File>

If a materialization solely creates a single relation, then returning that relation at the end of the materialization is sufficient to synchronize the dbt Relation cache. If the materialization *renames* or *drops* Relations other than the relation returned by the materialization, then additional work is required to keep the cache in sync with the database.

To explicitly remove a relation from the cache, use [adapter.drop_relation](/reference/dbt-jinja-functions/adapter). To explicitly rename a relation in the cache, use [adapter.rename_relation](/reference/dbt-jinja-functions/adapter). Calling these methods is preferable to executing the corresponding SQL directly, as they will mutate the cache as required. If you do need to execute the SQL to drop or rename relations directly, use the `adapter.cache_dropped` and `adapter.cache_renamed` methods to synchronize the cache.

## Materialization Configuration

Materializations support custom configuration. You might be familiar with some of these configs from materializations like `unique_key` in [incremental models](/docs/build/incremental-models)  or `strategy` in [snapshots](/docs/build/snapshots) .

### Specifying configuration options

Materialization configurations can either be "optional" or "required". If a user fails to provide required configurations, then dbt will raise a compilation error. You can define these configuration options with the `config.get` and `config.require` functions.

```
# optional
config.get('optional_config_name', default="the default") 
# required
config.require('required_config_name')
```

For more information on the `config` dbt Jinja function, see the [config](/reference/dbt-jinja-functions/config) reference.

## Materialization precedence

dbt will pick the materialization macro in the following order (lower takes priority):

1. global project - default
2. global project - plugin specific
3. imported package - default
4. imported package - plugin specific
5. local project - default
6. local project - plugin specific

In each of the stated search spaces, a materialization can only be defined once. Two different imported packages may not supply the same materialization - an error will be raised.

Specific materializations can be selected by using the dot-notation when selecting a materialization from the context.

We recommend _not_ overriding materialization names directly, and instead using a prefix or suffix to denote that the materialization changes the behavior of the default implementation (eg. my_project_incremental).
