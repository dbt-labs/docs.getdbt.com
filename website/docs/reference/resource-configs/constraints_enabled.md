---
resource_types: [models]
datatype: "{<dictionary>}"
default_value: {constraints_enabled: false}
id: "constraints_enabled"
---
<!-- <VersionBlock firstVersion="1.4"> -->

# Definition

You can manage data type constraints on your models using the `constraints_enabled` configuration. This configuration is available on all models, and is disabled by default. When enabled, dbt will automatically add constraints to your models based on the data types of the columns in your model's schema. This is a great way to ensure that your data is always in the correct format. For example, if you have a column in your model that is defined as a `date` data type, dbt will automatically add a data type constraint to that column to ensure that the data in that column is always a valid date. Also, if you want to add a not null constraint to a column, you can do so by adding the `not null` value to the column definition in your model's schema: `constraints: ['not null']`.

## Configuring Constraints

You can configure `constraints_enabled` in `dbt_project.yml` to apply constraints to many resources at once—all models in your project, a package, or a subfolder—and you can also configure grants one-by-one for specific resources, in yaml config: blocks or right within their `.sql` files. You'll receive dynamic error messages if you do not configure constraints based on the criteria below.

- Constraints must be defined in a `yml` schema configuration file like `schema.yml`.
- Only the `SQL` **table** materialization is supported for constraints.
- `data_type` values must be defined for all columns and NOT be null or blank.

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

The `constraints_enabled` config can also be defined:

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

<div warehouse="Spark">

- OSS Apache Spark / Delta Lake do not support `grants`.
- Databricks automatically enables `grants` on SQL endpoints. For interactive clusters, admins should enable grant functionality using these two setup steps in the Databricks documentation:
  - [Enable table access control for your workspace](https://docs.databricks.com/administration-guide/access-control/table-acl.html)
  - [Enable table access control for a cluster](https://docs.databricks.com/security/access-control/table-acls/table-acl.html)

</div>

<div warehouse="Redshift">

Redshift currently only enforces `not null` constraints; all other constraints are metadata only. Additionally, Redshift does not allow column checks at the time of table creation. See more in the Redshift documentation [here](https://docs.aws.amazon.com/redshift/latest/dg/t_Defining_constraints.html).

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
        data_type: varchar
      - name: date_day
        data_type: date
```

</File>

Expected DDL to enforce constraints:
<File name='target/run/.../constraints_example.sql'>

```sql

create  table
    "database_name"."schema_name"."my_model__dbt_tmp"
    
    (
        id integer not null,
        color varchar,
        date_day date,
        primary key(id)
    )
    
    
    
  ;
  insert into "database_name"."schema_name"."my_model__dbt_tmp"
    (
      
select
  1 as id,
  'blue' as color,
  cast('2019-01-01' as date) as date_day
    )
  ;
  
```

</File>


</div>

<div warehouse="Snowflake">

- Snowflake constraints documentation: [here](https://docs.snowflake.com/en/sql-reference/constraints-overview.html)
- Snowflake data types: [here](https://docs.snowflake.com/en/sql-reference/intro-summary-data-types.html)

Snowflake suppports four types of constraints: `unique`, `not null`, `primary key` and `foreign key`.

It is important to note that only the `not null` (and the `not null` property of `primary key`) are actually checked today.
There rest of the constraints are purely metadata, not verified when inserting data.

Currently, Snowflake doesn't support the `check` syntax and dbt will skip the `check` config and raise a warning message if it is set on some models in the dbt project.

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
        tests:
          - unique
      - name: color
        data_type: text
      - name: date_day
        data_type: date
```

</File>

Expected DDL to enforce constraints:
<File name='target/run/.../constraints_example.sql'>

```sql
        create or replace transient table AD_HOC.dbt_bperigaud.constraints_model
        
  
  (
    
      id integer  not null  primary key  ,
      color text  ,
      date_day date  
  )
  

         as
        (

select 
  1 as id, 
  'blue' as color, 
  cast('2019-01-01' as date) as date_day
        );
```

</File>

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
        tests:
          - unique
      - name: color
        data_type: text
      - name: date_day
        data_type: date
```

</File>

Expected DDL to enforce constraints:
<File name='target/run/.../constraints_example.sql'>

```sql
  create  table "database_name"."schema_name"."constraints_example__dbt_tmp"
  
    
  (
    
      
      
      
      id integer  not null  primary key  check (id > 0) ,
    
      
      
      
      color text   ,
    
      
      
      
      date_day date   
    
  )
 ;
    insert into "database_name"."schema_name"."constraints_example__dbt_tmp" 
  (
    
      
      id ,
    
      
      color ,
    
      
      date_day 
    
  )

    
    (
    

select 
  1 as id, 
  'blue' as color, 
  cast('2019-01-01' as date) as date_day
  );
```

</File>

</div>

</WHCode>

<!-- </VersionBlock>  -->