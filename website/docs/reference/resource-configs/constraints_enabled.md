---
resource_types: [models]
datatype: "{<dictionary>}"
default_value: {constraints_enabled: false}
id: "constraints_enabled"
---
<!-- <VersionBlock firstVersion="1.4"> -->

# Definition

You can manage data type constraints on your models using the `constraints_enabled` configuration. This configuration is available on all models, and is disabled by default. When enabled, dbt will automatically add constraints to your models based on the data types of the columns in your model's schema. This is a great way to ensure that your data is always in the correct format. For example, if you have a column in your model that is defined as a `date` data type, dbt will automatically add a data type constraint to that column to ensure that the data in that column is always a valid date. Also, if you want to add a not null constraint to a column, you can do so by adding the `not_null` value to the column definition in your model's schema: `constraints: ['not_null']`.

## Configuring Constraints

You can configure `constraints_enabled` in `dbt_project.yml` to apply constraints to many resources at once—all models in your project, a package, or a subfolder—and you can also configure grants one-by-one for specific resources, in yaml config: blocks or right within their .sql files.

<Tabs
  defaultValue="models"
  values={[
    { label: 'Models', value: 'models', },
  ]
}>

<TabItem value="models">

<File name='models/schema.yml'>

```yml
models:
  - name: constraints_example
    docs:
      node_color: black
    config:
      constraints_enabled: true
    columns:
      - name: id
        data_type: integer
        description: hello
        constraints: ['not null','primary key']
        check: (id > 0)
        tests:
          - unique
      - name: color
        data_type: string
      - name: date_day
        data_type: date
```

</File>

The `grants` config can also be defined:

- under the `models` config block in `dbt_project.yml`
- in a `config()` Jinja macro within a model's SQL file

See [configs and properties](configs-and-properties) for details.

</TabItem>
</Tabs>

## Constraints Enabled Inheritance

### General Examples

### Database-specific Requirements and Notes

<WHCode>

<div warehouse="BigQuery">

On BigQuery, "privileges" are called "roles," and they take the form `roles/service.roleName`. For instance, instead of granting `select` on a model, you would grant `roles/bigquery.dataViewer`.

Grantees can be users, groups, service accounts, domains—and each needs to be clearly demarcated as such with a prefix. For instance, to grant access on a model to `someone@yourcompany.com`, you need to specify them as `user:someone@yourcompany.com`.

We encourage you to read Google's documentation for more context:
- [Understanding GCP roles](https://cloud.google.com/iam/docs/understanding-roles)
- [How to format grantees](https://cloud.google.com/bigquery/docs/reference/standard-sql/data-control-language#user_list)

<Snippet src="grants-vs-access-to" />

### BigQuery examples

Granting permission using SQL and BigQuery:

```sql
{{ config(grants = {'roles/bigquery.dataViewer': ['user:someone@yourcompany.com']}) }}
```

Granting permission in a model schema using BigQuery:

<File name='models/schema.yml'>

```yml
models:
  - name: specific_model
    config:
      grants:
        roles/bigquery.dataViewer: ['user:someone@yourcompany.com']
```

</File>

</div>

<div warehouse="Databricks">

- OSS Apache Spark / Delta Lake do not support `grants`.
- Databricks automatically enables `grants` on SQL endpoints. For interactive clusters, admins should enable grant functionality using these two setup steps in the Databricks documentation:
  - [Enable table access control for your workspace](https://docs.databricks.com/administration-guide/access-control/table-acl.html)
  - [Enable table access control for a cluster](https://docs.databricks.com/security/access-control/table-acls/table-acl.html)

</div>

<div warehouse="Redshift">

* No special requirements at this time.

</div>

<div warehouse="Snowflake">

* dbt accounts for the [`copy_grants` configuration](/reference/resource-configs/snowflake-configs#copying-grants) when calculating which grants need to be added or removed.

</div>

<div warehouse="PostgreSQL">

* PostgreSQL constraints documentation: [here](https://www.postgresql.org/docs/current/ddl-constraints.html#id-1.5.4.6.6)

<File name='models/constraints_example.sql'>

```sql
{{
  config(
    materialized = "table"
  )
}}

select 
  1 as id, 
  'blue' as color, 
  cast('2019-01-01' as date) as date_day
```

</File>

<File name='models/schema.yml'>

```yml
models:
  - name: constraints_example
    docs:
      node_color: black
    config:
      constraints_enabled: true
    columns:
      - name: id
        data_type: integer
        description: hello
        constraints: ['not null','primary key']
        check: (id > 0)
        tests:
          - unique
      - name: color
        data_type: string
      - name: date_day
        data_type: date
```

</File>

<File name='target/run/.../constraints_example.sql'>

Expected DDL to enforce constraints:

```sql
  create  table "sungwonchung3/constraints"."dbt_sung"."constraints_example__dbt_tmp"
  
    
  (
    
      
      
      
      id integer  not null  primary key  check (id > 0) ,
    
      
      
      
      color text   ,
    
      
      
      
      date_day date   
    
  )
 ;
    insert into "sungwonchung3/constraints"."dbt_sung"."constraints_example__dbt_tmp" 
  (
    
      
      id ,
    
      
      color ,
    
      
      date_day 
    
  )

    
    (
    

select 
  null as id, 
  'blue' as color, 
  cast('2019-01-01' as date) as date_day
  );
```

</File>

</div>

</WHCode>

<!-- </VersionBlock>  -->