---
id: "persist_docs"
datatype: Dict[Str, Bool]
---

<File name='models/<modelname>.sql'>

```jinja2

{{ config(
  persist_docs={"relation": true, "columns": true}
) }}

select ...

```

</File>

<File name='dbt_project.yml'>

```yml
models:
  [<resource-path>](resource-path):
    persist_docs:
      relation: true
      columns: true

```

</File>

## Definition

Optionally persist [resource documentation](resource-properties/description) as
column and relation comments in the database. By default, documentation
persistence is disabled, but it can be enabled for specific resources or groups of
resources as needed.

<Changelog>

 - Support for this config on Redshift, Postgres, and Snowflake is new in 0.17.0
 - Support for column-level docs persistence is new for all databases in 0.17.0

</Changelog>

## Support

The `persist_docs` config is supported on all core dbt plugins: BigQuery,
Redshift, Snowflake, and Postgres. Some databases impose limitations on the
types of descriptions that can be added to database objects. At present, the
`persist_docs` flag has the following known limitations:
 - Column-level comments are not supported on Snowflake views

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
  persist_docs:
    relation: true
    columns: true
```

</File>

<File name='dbt_project.yml'>

Note that when using `config-version: 2` you will need to use the `+persist_docs`

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
