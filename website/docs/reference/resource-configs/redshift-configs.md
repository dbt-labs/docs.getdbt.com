---
title: "Redshift configurations"
description: "Redshift Configurations - Read this in-depth guide to learn about configurations in dbt."
id: "redshift-configs"
---

<!----
To-do:
- use the reference doc structure for this article/split into separate articles
- think about whether some of these should be outside of models
--->

## Incremental materialization strategies

In dbt-redshift, the following incremental materialization strategies are supported:

<VersionBlock lastVersion="1.5">

- `append` (default)
- `delete+insert`
  
</VersionBlock>

<VersionBlock firstVersion="1.6">

- `append` (default)
- `merge`
- `delete+insert`

</VersionBlock>

All of these strategies are inherited from dbt-postgres.

## Performance optimizations

### Using sortkey and distkey

Tables in Amazon Redshift have two powerful optimizations to improve query performance: distkeys and sortkeys. Supplying these values as model-level configurations apply the corresponding settings in the generated `CREATE TABLE` <Term id="ddl" />. Note that these settings will have no effect on models set to `view` or `ephemeral` models.

- `dist` can have a setting of `all`, `even`, `auto`, or the name of a key.
- `sort` accepts a list of sort keys, for example: `['timestamp', 'userid']`. dbt will build the sort key in the same order the fields are supplied.
- `sort_type` can have a setting of `interleaved` or `compound`. if no setting is specified, sort_type defaults to `compound`.

Sort and dist keys should be added to the `{{ config(...) }}` block in model `.sql` files, eg:

<File name='my_model.sql'>

```sql
-- Example with one sort key
{{ config(materialized='table', sort='id', dist='received_at') }}

select ...


-- Example with multiple sort keys
{{ config(materialized='table', sort=['id', 'category'], dist='received_at') }}

select ...


-- Example with interleaved sort keys
{{ config(materialized='table',
          sort_type='interleaved'
          sort=['id', 'category'],
          dist='received_at')
}}

select ...
```

</File>

For more information on distkeys and sortkeys, view Amazon's docs:

- [AWS Documentation » Amazon Redshift » Database Developer Guide » Designing Tables » Choosing a Data Distribution Style](https://docs.aws.amazon.com/redshift/latest/dg/t_Distributing_data.html)
- [AWS Documentation » Amazon Redshift » Database Developer Guide » Designing Tables » Choosing Sort Keys](https://docs.aws.amazon.com/redshift/latest/dg/t_Sorting_data.html)

## Late binding views

Redshift supports <Term id="view">views</Term> unbound from their dependencies, or [late binding views](https://docs.aws.amazon.com/redshift/latest/dg/r_CREATE_VIEW.html#late-binding-views). This DDL option "unbinds" a view from the data it selects from. In practice, this means that if upstream views or tables are dropped with a cascade qualifier, the late-binding view does not get dropped as well.

Using late-binding views in a production deployment of dbt can vastly improve the availability of data in the warehouse, especially for models that are materialized as late-binding views and are queried by end-users, since they won’t be dropped when upstream models are updated. Additionally, late binding views can be used with [external tables](https://docs.aws.amazon.com/redshift/latest/dg/r_CREATE_EXTERNAL_TABLE.html) via Redshift Spectrum.

To materialize a dbt model as a late binding view, use the `bind: false` configuration option:

<File name='my_view.sql'>

```sql
{{ config(materialized='view', bind=False) }}

select *
from source.data
```

</File>

To make all views late-binding, configure your `dbt_project.yml` file like this:

<File name='dbt_project.yml'>

```yaml
models:
  +bind: false # Materialize all views as late-binding
  project_name:
    ....
```

</File>

<VersionBlock firstVersion="1.6">

## Materialized views

The Redshift adapter supports [materialized views](https://docs.aws.amazon.com/redshift/latest/dg/materialized-view-overview.html)
with the following configuration parameters:

| Parameter      | Type         | Default                | Change Monitoring Support | Reference                                       |
|----------------|--------------|------------------------|---------------------------|-------------------------------------------------|
| `dist`         | STRING       | `'EVEN'`               | DROP/CREATE               | [Sortkey / Distkey](#using-sortkey-and-distkey) |
| `sort`         | LIST[STRING] | `None`                 | DROP/CREATE               | [Sortkey / Distkey](#using-sortkey-and-distkey) |
| `sort_type`    | STRING       | `'AUTO'` if no `sort`  | DROP/CREATE               | [Sortkey / Distkey](#using-sortkey-and-distkey) |
|                |              | `'COMPOUND'` if `sort` |                           |                                                 |
| `auto_refresh` | BOOLEAN      | `False`                | ALTER                     | [Auto refresh](#auto-refresh)                   |
| `backup`       | BOOLEAN      | `True`                 | N/A                       | [Backup](#backup)                               |

#### Sample model file:

<File name='redshift_materialized_view.sql'>

```sql
{{ config(
    materialized='materialized_view',
    dist='{ ALL | AUTO | EVEN | <field_name> }',
    sort=['<field_name>', ...],
    sort_type='{ AUTO | COMPOUND | INTERLEAVED }'
    auto_refresh=<bool>,
    backup=<bool>,
) }}

select * from {{ ref('my_base_table') }}
```

</File>

Many of these parameters correspond to their table counterparts and have been linked above.
The set of parameters which are unique to materialized views covers auto-refresh and backup functionality, which is covered below.

Find more information about these parameters in the Redshift docs:
- [CREATE MATERIALIZED VIEW](https://docs.aws.amazon.com/redshift/latest/dg/materialized-view-create-sql-command.html)

#### Auto-refresh

| Parameter      | Type    | Default | Change Monitoring Support |
|----------------|---------|---------|---------------------------|
| `auto_refresh` | BOOLEAN | `False` | ALTER                     |

Redshift supports [automatic refresh](https://docs.aws.amazon.com/redshift/latest/dg/materialized-view-refresh.html#materialized-view-auto-refresh) configuration for materialized views.
By default, a materialized view will not automatically refresh.
dbt will monitor this parameter for changes and apply them using an `ALTER` statement.

Find more information about this parameter in the Redshift docs:
- [Parameters](https://docs.aws.amazon.com/redshift/latest/dg/materialized-view-create-sql-command.html#mv_CREATE_MATERIALIZED_VIEW-parameters)

#### Backup

| Parameter | Type    | Default | Change Monitoring Support |
|-----------|---------|---------|---------------------------|
| `backup`  | BOOLEAN | `True`  | N/A                       |

Redshift supports [backup](https://docs.aws.amazon.com/redshift/latest/mgmt/working-with-snapshots.html) configuration of clusters at the object level.
This parameter identifies if the materialized view should be backed up as part of the cluster snapshot.
By default, a materialized view will be backed up during a cluster snapshot.
dbt cannot monitor this parameter as it is not queryable within Redshift.
If the value is changed, the materialized view will need to go through a `--full-refresh` in order to set it.

Find more information about this parameter in the Redshift docs:
- [Parameters](https://docs.aws.amazon.com/redshift/latest/dg/materialized-view-create-sql-command.html#mv_CREATE_MATERIALIZED_VIEW-parameters)

### Limitations

As with most data platforms, there are limitations associated with materialized views. Some worth noting include:

- Materialized views cannot reference: views, temporary tables, user defined functions, late-binding tables
- Auto-refresh cannot be used if the materialized view references: mutable functions, external schemas, another materialized view

Find more information about materialized view limitations in Redshift's [docs](https://docs.aws.amazon.com/redshift/latest/dg/materialized-view-create-sql-command.html#mv_CREATE_MATERIALIZED_VIEW-limitations).

<VersionBlock firstVersion="1.6" lastVersion="1.6">

#### Changing materialization from "materialized_view" to "table" or "view"

Swapping a materialized view to a table or view is not supported.
You must manually drop the existing materialized view in the data warehouse prior to calling `dbt run`.
Normally, re-running with the `--full-refresh` flag would resolve this, but not in this case.
This would only need to be done once as the existing object would then be a materialized view.

For example, assume that a materialized view, `my_mv.sql`, has already been materialized to the underlying data platform via `dbt run`.
If the user changes the model's config to `materialized="table"`, they will get an error.
The workaround is to execute `DROP MATERIALIZED VIEW my_mv CASCADE` on the data warehouse before trying the model again.

</VersionBlock>

</VersionBlock>
