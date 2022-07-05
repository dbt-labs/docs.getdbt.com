---
id: "persist_docs"
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
  [<resource-path>](resource-path):
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
  [<resource-path>](resource-path):
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
  [<resource-path>](resource-path):
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

Optionally persist [resource descriptions](resource-properties/description) as
column and relation comments in the database. By default, documentation
persistence is disabled, but it can be enabled for specific resources or groups of
resources as needed.

<Changelog>

 - Support for this config on Redshift, Postgres, and Snowflake is new in 0.17.0
 - Support for column-level docs persistence is new for all databases in 0.17.0

</Changelog>

## Support

The `persist_docs` config is supported on the most widely used dbt adapters: BigQuery, Redshift, Snowflake, Postgres, and Apache Spark/Databricks. Some databases impose limitations on the types of descriptions that can be added to database objects, so their adapters may not support `persist_docs`, or may offer only partial support. For example, column-level comments are not supported for models materialized as <Term id="view">views</Term> on Spark/Databricks ([issue](https://github.com/dbt-labs/dbt-spark/issues/372))<VersionBlock lastVersion="0.21">, or Snowflake on versions older than v1.0</VersionBlock>.

## Usage

### Documenting columns and relations

Supply a [description](resource-properties/description) for a model:

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
