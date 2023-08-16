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

All of these strategies are inheirited via from dbt-postgres.

## Performance optimizations

### Using sortkey and distkey

Tables in Amazon Redshift have two powerful optimizations to improve query performance: distkeys and sortkeys. Supplying these values as model-level configurations apply the corresponding settings in the generated `CREATE TABLE` <Term id="ddl" />. Note that these settings will have no effect for models set to `view` or `ephemeral` models.

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

## Late Binding Views

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

## Materialized Views

<Changelog>

  - **v1.6.0:** Introduced support for `materialized_view`

</Changelog>

The Redshift adapter supports [materialized views](https://docs.aws.amazon.com/redshift/latest/dg/materialized-view-overview.html).
Redshift-specific configuration includes the typical `dist`, `sort_type`, `sort`, and `backup`.
For materialized views, there is also the `auto_refresh` setting, which allows Redshift to [automatically refresh](https://docs.aws.amazon.com/redshift/latest/dg/materialized-view-refresh.html) the materialized view for you.
The remaining configuration follows the general [materialized view](/docs/build/materializations#Materialized-View) configuration.
There are also some limitations that we hope to address in the next version.

### Monitored Configuration Changes

The settings below are monitored for changes applicable to `on_configuration_change`.

#### Dist

Changes to `dist` will result in a full refresh. Redshift requires a materialized view to be
dropped and recreated to apply a change to the `distkey` or `diststyle`.

#### Sort Type, Sort

Changes to `sort_type` or `sort` will result in a full refresh. Redshift requires a materialized
view to be dropped and recreated to apply a change to the `sortkey` or `sortstyle`.

#### Backup

Changes to `backup` will result in a full refresh. Redshift requires a materialized
view to be dropped and recreated to apply a change to the `backup` setting.

#### Auto Refresh

The `auto_refresh` setting can be updated via an `ALTER` statement. This setting effectively toggles
automatic refreshes on or off. The default setting for this config is off (`False`). If this
is the only configuration change for the materialized view, dbt will choose to apply
an `ALTER` statement instead of issuing a full refresh,

### Limitations

#### Changing materialization from "materialized_view" to "table" or "view"

Swapping a materialized view to a table or view is not supported.
You must manually drop the existing materialized view in the data warehouse prior to calling `dbt run`.
Normally, re-running with the `--full-refresh` flag would resolve this, but not in this case.
This would only need to be done once as the existing object would then be a materialized view.

For example, assume that a materialized view, `my_mv.sql`, has already been materialized to the underlying data platform via `dbt run`.
If the user changes the model's config to `materialized="table"`, they will get an error.
The workaround is to execute `DROP MATERIALIZED VIEW my_mv CASCADE` on the data warehouse before trying the model again.

</VersionBlock>
