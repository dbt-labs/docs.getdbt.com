---
id: "persist_docs"
description: "Persist_docs - Read this in-depth guide to learn about configurations in dbt."
datatype: Dict[Str, Bool]
---


<Tabs
  defaultValue="models"
  values={[
    { label: 'Models', value: 'models', },
    { label: 'Sources', value:'sources', },
    { label: 'Seeds', value: 'seeds', },
    { label: 'Snapshots', value: 'snapshots', },
  ]
}>

<TabItem value="models">

<File name='dbt_project.yml'>

```yml
models:
  [<resource-path>](/reference/resource-configs/resource-path):
    +persist_docs:
      relation: true
      columns: true

```

</File>

<File name='models/<modelname>.sql'>

```sql

{{ config(
  persist_docs={"relation": true, "columns": true}
) }}

select ...

```

</File>

</TabItem>

<TabItem value="sources">

This config is not implemented for sources.

</TabItem>

<TabItem value="seeds">

<File name='dbt_project.yml'>

```yml
seeds:
  [<resource-path>](/reference/resource-configs/resource-path):
    +persist_docs:
      relation: true
      columns: true

```

</File>

</TabItem>

<TabItem value="snapshots">

<File name='dbt_project.yml'>

```yml
snapshots:
  [<resource-path>](/reference/resource-configs/resource-path):
    +persist_docs:
      relation: true
      columns: true

```

</File>

<File name='snapshots/<filename>.sql'>

```sql
{% snapshot [snapshot_name](snapshot_name) %}

{{ config(
  persist_docs={"relation": true, "columns": true}
) }}

select ...

{% endsnapshot %}

```

</File>

</TabItem>

</Tabs>

## Definition

Optionally persist [resource descriptions](/reference/resource-properties/description) as
column and relation comments in the database. By default, documentation
persistence is disabled, but it can be enabled for specific resources or groups of
resources as needed.

<Changelog>

 - Support for this config on Redshift, Postgres, and Snowflake is new in 0.17.0
 - Support for column-level docs persistence is new for all databases in 0.17.0

</Changelog>

## Support

The `persist_docs` config is supported on the most widely used dbt adapters:
- Postgres
- Redshift
- Snowflake
- BigQuery
- Databricks 
- Apache Spark

However, some databases limit where and how descriptions can be added to database objects. Those database adapters might not support `persist_docs`, or might offer only partial support.

Some known issues and limitations:

<WHCode>

<div warehouse="Databricks">

- Column-level comments require `file_format: delta` (or another "v2 file format")
- Column-level comments aren't supported for models materialized as <Term id="view">views</Term> ([issue](https://github.com/dbt-labs/dbt-spark/issues/372))


</div>

<div warehouse="Snowflake">

<VersionBlock firstVersion="1.2">

- No known issues

</VersionBlock>

<VersionBlock lastVersion="1.1">

- Column names that must be quoted, such as column names containing special characters, will cause runtime errors if column-level `persist_docs` is enabled. This is fixed in v1.2.

</VersionBlock>

</div>

</WHCode>

## Usage

### Documenting columns and relations

Supply a [description](/reference/resource-properties/description) for a model:

<File name='models/schema.yml'>

```yml
version: 2

models:
  - name: dim_customers
    description: One record per customer
    columns:
      - name: customer_id
        description: Primary key

```

</File>

Enable `persist_docs` for columns and relations in your project:

<File name='dbt_project.yml'>

```yml
models:
  +persist_docs:
    relation: true
    columns: true
```

</File>

Run dbt and observe that the created relation and columns are annotated with
your descriptions:

<Lightbox src="/img/reference/persist_docs_relation.png"
          title="Relation descriptions in BigQuery"/>

<Lightbox src="/img/reference/persist_docs_columns.png"
          title="Column descriptions in BigQuery"/>
