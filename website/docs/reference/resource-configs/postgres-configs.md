---
title: "Postgres configurations"
description: "Postgres Configurations - Read this in-depth guide to learn about configurations in dbt."
id: "postgres-configs"
---

## Incremental materialization strategies

In dbt-postgres, the following incremental materialization strategies are supported:

- `append` (default)
- `merge`
- `delete+insert`


## Performance Optimizations

### Unlogged

<Changelog>

  - **v0.14.1:** Introduced native support for `unlogged` config

</Changelog>

"Unlogged" tables can be considerably faster than ordinary tables, as they are not written to the write-ahead log nor replicated to read replicas. They are also considerably less safe than ordinary tables. See [Postgres docs](https://www.postgresql.org/docs/current/sql-createtable.html#SQL-CREATETABLE-UNLOGGED) for details.

<File name='my_table.sql'>

```sql
{{ config(materialized='table', unlogged=True) }}

select ...
```

</File>

<File name='dbt_project.yml'>

```yaml
models:
  +unlogged: true
```

</File>

### Indexes

While Postgres works reasonably well for datasets smaller than about 10m rows, database tuning is sometimes required. It's important to create indexes for columns that are commonly used in joins or where clauses.

<Changelog>

  - **v0.20.0:** Introduced native support for `indexes` config

</Changelog>

Table models, incremental models, seeds, and snapshots may have a list of `indexes` defined. Each Postgres index can have three components:
- `columns` (list, required): one or more columns on which the index is defined
- `unique` (boolean, optional): whether the index should be [declared unique](https://www.postgresql.org/docs/9.4/indexes-unique.html)
- `type` (string, optional): a supported [index type](https://www.postgresql.org/docs/current/indexes-types.html) (B-tree, Hash, GIN, etc)

<File name='my_table.sql'>

```sql
{{ config(
    materialized = 'table',
    indexes=[
      {'columns': ['column_a'], 'type': 'hash'},
      {'columns': ['column_a', 'column_b'], 'unique': True},
    ]
)}}

select ...
```

</File>

If one or more indexes are configured on a resource, dbt will run `create index` <Term id="ddl" /> statement(s) as part of that resource's <Term id="materialization" />, within the same transaction as its main `create` statement. For the index's name, dbt uses a hash of its properties and the current timestamp, in order to guarantee uniqueness and avoid namespace conflict with other indexes.

```sql
create index if not exists
"3695050e025a7173586579da5b27d275"
on "my_target_database"."my_target_schema"."indexed_model" 
using hash
(column_a);

create unique index if not exists
"1bf5f4a6b48d2fd1a9b0470f754c1b0d"
on "my_target_database"."my_target_schema"."indexed_model" 
(column_a, column_b);
```

You can also configure indexes for a number of resources at once:

<File name='dbt_project.yml'>

```yaml
models:
  project_name:
    subdirectory:
      +indexes:
        - columns: ['column_a']
          type: hash
```

</File>

<VersionBlock firstVersion="1.6">

## Materialized view

The Postgres adapter supports [materialized views](https://www.postgresql.org/docs/current/rules-materializedviews.html) and refreshes them for every subsequent `dbt run` you execute. For more information, see [Refresh Materialized Views](https://www.postgresql.org/docs/15/sql-refreshmaterializedview.html) in the Postgres docs.

Materialized views support the optional configuration `on_configuration_change` with the following values: 
- `apply` (default) &mdash; attempts to update the existing database object if possible, avoiding a complete rebuild. The following index action can be applied without the need to rebuild the materialized view:
  - Added
  - Dropped
  - Updated
- `skip` &mdash; allows runs to continue while also providing a warning that the model was skipped
- `fail` &mdash; forces runs to fail if a change is detected in a materialized view 

You can create a materialized view by editing _one_ of these files:
- the SQL file for your model
- the `dbt_project.yml` configuration file

The following examples create a materialized view: 

<File name='models/YOUR_MODEL_NAME.sql'>

```sql
{{
  config(
    materialized = 'materialized_view',
    on_configuration_change = 'apply',
  )
}}
```

</File>


<File name='dbt_project.yml'>

```yaml 
models:
  path:
    materialized: materialized_view
```
</File>

### Limitations

Below are current limitations that we hope to address in a future release.
#### Changing materialization to and from "materialized_view"

Swapping an already materialized model to a materialized view and vice versa. The workaround is manually dropping the existing materialization in the data warehouse before calling `dbt run` again. Normally, re-running with the `--full-refresh` flag would resolve this, but not in this case.

For example, assume the model below, `my_model`, has already been materialized to the underlying data platform via `dbt run`. If a user changes the model's config to `materialized="materialized_view"`, they will get an error. The solution is to execute `DROP TABLE my_model` on the data warehouse before trying the model again.

<File name='my_model.sql'>

```yaml

{{ config(
    materialized="table" # or any model type eg view, incremental
) }}

```

</File>

</VersionBlock>
