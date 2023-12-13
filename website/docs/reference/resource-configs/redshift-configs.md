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

| Parameter                                                                        | Type         | Required | Default                                        | Change Monitoring Support |
|----------------------------------------------------------------------------------|--------------|----------|------------------------------------------------|---------------------------|
| [`on_configuration_change`](/reference/resource-configs/on_configuration_change) | `<string>`   | no       | `apply`                                        | n/a                       |
| [`dist`](#using-sortkey-and-distkey)                                             | `<string>`   | no       | `even`                                         | drop/create               |
| [`sort`](#using-sortkey-and-distkey)                                             | `[<string>]` | no       | `none`                                         | drop/create               |
| [`sort_type`](#using-sortkey-and-distkey)                                        | `<string>`   | no       | `auto` if no `sort` <br />`compound` if `sort` | drop/create               |
| [`auto_refresh`](#auto-refresh)                                                  | `<boolean>`  | no       | `false`                                        | alter                     |
| [`backup`](#backup)                                                              | `<string>`   | no       | `true`                                         | n/a                       |

<Tabs
  groupId="config-languages"
  defaultValue="project-yaml"
  values={[
    { label: 'Project file', value: 'project-yaml', },
    { label: 'Property file', value: 'property-yaml', },
    { label: 'Config block', value: 'config', },
  ]
}>


<TabItem value="project-yaml">

<File name='dbt_project.yml'>

```yaml
models:
  [<resource-path>](/reference/resource-configs/resource-path):
    [+](/reference/resource-configs/plus-prefix)[materialized](/reference/resource-configs/materialized): materialized_view
    [+](/reference/resource-configs/plus-prefix)[on_configuration_change](/reference/resource-configs/on_configuration_change): apply | continue | fail
    [+](/reference/resource-configs/plus-prefix)[dist](#using-sortkey-and-distkey): all | auto | even | <field-name>
    [+](/reference/resource-configs/plus-prefix)[sort](#using-sortkey-and-distkey): <field-name> | [<field-name>]
    [+](/reference/resource-configs/plus-prefix)[sort_type](#using-sortkey-and-distkey): auto | compound | interleaved
    [+](/reference/resource-configs/plus-prefix)[auto_refresh](#auto-refresh): true | false
    [+](/reference/resource-configs/plus-prefix)[backup](#backup): true | false
```

</File>

</TabItem>


<TabItem value="property-yaml">

<File name='models/properties.yml'>

```yaml
version: 2

models:
  - name: [<model-name>]
    config:
      [materialized](/reference/resource-configs/materialized): materialized_view
      [on_configuration_change](/reference/resource-configs/on_configuration_change): apply | continue | fail
      [dist](#using-sortkey-and-distkey): all | auto | even | <field-name>
      [sort](#using-sortkey-and-distkey): <field-name> | [<field-name>]
      [sort_type](#using-sortkey-and-distkey): auto | compound | interleaved
      [auto_refresh](#auto-refresh): true | false
      [backup](#backup): true | false
```

</File>

</TabItem>


<TabItem value="config">

<File name='models/<model_name>.sql'>

```jinja
{{ config(
    [materialized](/reference/resource-configs/materialized)="materialized_view",
    [on_configuration_change](/reference/resource-configs/on_configuration_change)="apply" | "continue" | "fail",
    [dist](#using-sortkey-and-distkey)="all" | "auto" | "even" | "<field-name>",
    [sort](#using-sortkey-and-distkey)=["<field-name>"],
    [sort_type](#using-sortkey-and-distkey)="auto" | "compound" | "interleaved",
    [auto_refresh](#auto-refresh)=true | false,
    [backup](#backup)=true | false,
) }}
```

</File>

</TabItem>

</Tabs>

Many of these parameters correspond to their table counterparts and have been linked above.
The parameters unique to materialized views are the [auto-refresh](#auto-refresh) and [backup](#backup) functionality, which are covered below.

Learn more about these parameters in Redshift's [docs](https://docs.aws.amazon.com/redshift/latest/dg/materialized-view-create-sql-command.html).

#### Auto-refresh

| Parameter      | Type        | Required | Default | Change Monitoring Support |
|----------------|-------------|----------|---------|---------------------------|
| `auto_refresh` | `<boolean>` | no       | `false` | alter                     |

Redshift supports [automatic refresh](https://docs.aws.amazon.com/redshift/latest/dg/materialized-view-refresh.html#materialized-view-auto-refresh) configuration for materialized views.
By default, a materialized view does not automatically refresh.
dbt monitors this parameter for changes and applies them using an `ALTER` statement.

Learn more information about the [parameters](https://docs.aws.amazon.com/redshift/latest/dg/materialized-view-create-sql-command.html#mv_CREATE_MATERIALIZED_VIEW-parameters) in the Redshift docs.

#### Backup

| Parameter | Type        | Required | Default | Change Monitoring Support |
|-----------|-------------|----------|---------|---------------------------|
| `backup`  | `<boolean>` | no       | `true`  | n/a                       |

Redshift supports [backup](https://docs.aws.amazon.com/redshift/latest/mgmt/working-with-snapshots.html) configuration of clusters at the object level.
This parameter identifies if the materialized view should be backed up as part of the cluster snapshot.
By default, a materialized view will be backed up during a cluster snapshot.
dbt cannot monitor this parameter as it is not queryable within Redshift.
If the value is changed, the materialized view will need to go through a `--full-refresh` in order to set it.

Learn more about these parameters in Redshift's [docs](https://docs.aws.amazon.com/redshift/latest/dg/materialized-view-create-sql-command.html#mv_CREATE_MATERIALIZED_VIEW-parameters).

### Limitations

As with most data platforms, there are limitations associated with materialized views. Some worth noting include:

- Materialized views cannot reference views, temporary tables, user-defined functions, or late-binding tables.
- Auto-refresh cannot be used if the materialized view references mutable functions, external schemas, or another materialized view.

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
