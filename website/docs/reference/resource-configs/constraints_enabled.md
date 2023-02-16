---
resource_types: [models]
datatype: "{<dictionary>}"
default_value: {constraints_enabled: false}
id: "constraints_enabled"
---
<!-- <VersionBlock firstVersion="1.4"> -->

# Definition

You can manage data type constraints on your models using the `constraints_enabled` configuration. This configuration is available on all models, and is disabled by default. When enabled, dbt will automatically add constraints to your models based on the data types of the columns in your model's schema. This is a great way to ensure your data is always in the correct format. For example, if you have a column in your model that is defined as a `date` data type, dbt will automatically add a data type constraint to that column to ensure the data in that column is always a valid date. If you want to add a `not null` constraint to a column in a preventative manner rather than as a test, you can add the `not null` value to the column definition in your model's schema: `constraints: ['not null']`.

## When to use constraints vs. tests

Constraints serve as a **preventative** measure against bad data quality **before** the dbt model is (re)built. It is only limited by the respective database's funcionality and the data types that are supported. Examples of a constraint: `not null`, `unique`, `primary key`, `foreign key`, `check`

Tests serve as a **detective** measure against bad data quality **after** the dbt model is (re)built.

Constraints are great when you define `constraints: ['not null']` for a column in your model's schema because it'll prevent `null` values being inserted into that column at dbt model creation time. AND it'll prevent other unintended values from being inserted into that column without dbt's intervention as it relies on the database to enforce the constraint. This can **replace** the `not_null` test. However, performance issues may arise depending on your database.

Tests should be used in addition to and instead of constraints when you want to test things like `accepted_values` and `relationships`. These are usually not enforced with built-in database functionality and are not possible with constraints. Also, custom tests will allow more flexibility and address nuanced data quality issues that may not be possible with constraints.

## Configuring Constraints

You can configure `constraints_enabled` in `schema.yml` files to apply constraints one-by-one for specific dbt models in `yml` config blocks. You'll receive dynamic error messages if you do not configure constraints based on the criteria below.

- Constraints must be defined in a `yml` schema configuration file like `schema.yml`.

- Only the `SQL` **table** materialization is supported for constraints.

```txt
Parsing Error
  Original File Path: (models/constraints_examples/constraints_example.sql)
  Constraints must be defined in a `yml` schema configuration file like `schema.yml`.
  Only the SQL table materialization is supported for constraints. 
  `data_type` values must be defined for all columns and NOT be null or blank.
      Materialization Error: {'materialization': 'snapshot'}
```

- `data_type` values must be defined for all columns and NOT be null or blank.

```txt
Parsing Error
  Original File Path: (models/constraints_examples/constraints_example.sql)
  Constraints must be defined in a `yml` schema configuration file like `schema.yml`.
  Only the SQL table materialization is supported for constraints. 
  `data_type` values must be defined for all columns and NOT be null or blank.
      Columns with `data_type` Blank/Null Errors: {'id'}
```

- `constraints_enabled=true` can only be configured within `schema.yml` files NOT within a model file(ex: .sql, .py) or `dbt_project.yml`. *(Note: Current parsing mechanics require all constraints configs be written in schema files to be implemented exactly as configured. This may change in the future.)*

```txt
Parsing Error
  Original File Path: (models/constraints_examples/constraints_example.sql)
  Constraints must be defined in a `yml` schema configuration file like `schema.yml`.
  Only the SQL table materialization is supported for constraints. 
  `data_type` values must be defined for all columns and NOT be null or blank.
      `constraints_enabled=true` can only be configured within `schema.yml` files
        NOT within a model file(ex: .sql, .py) or `dbt_project.yml`.
```

- Please ensure the name, order, and number of columns in your `yml` file match the columns in your SQL file.

```txt
# example error message
Compilation Error in model constraints_example (models/constraints_examples/constraints_example.sql)
  Please ensure the name, order, and number of columns in your `yml` file match the columns in your SQL file.
  Schema File Columns: ['ID', 'COLOR', 'DATE_DAY']
  SQL File Columns: ['ERROR', 'COLOR', 'DATE_DAY'] 
```

> Note: Constraints and data type inheritance across downstream tables depends on database-specific functionality. We recommend defining constraints for all tables in scope where desired.
> Constraints can be defined as a list or in bullet form. Both are valid.

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
        constraints_check: (id > 0)
        tests:
          - unique
      - name: color
        constraints: 
          - not null
          - primary key
        data_type: string
      - name: date_day
        data_type: date
```

</File>

The `constraints_enabled` config can also be defined:

- under the `models` config block in `dbt_project.yml` only for `false` configs

<File name='dbt_project.yml'>

```yml
models:
  tpch:
    staging:
      +materialized: view
      +docs:
        node_color: "#cd7f32"

    marts:
      core:
        +constraints_enabled: false # enforce data type constraints across all models in the "/marts/core" subfolder
        materialized: table
```

</File>

- in a `config()` Jinja macro within a model's SQL file only for `false` configs

<File name='models/constraints_example.sql'>

```sql
{{
  config(
    materialized = "table",
    constraints_enabled = false
  )
}}

select 
  1 as id, 
  'blue' as color, 
  cast('2019-01-01' as date) as date_day
```

</File>

See [configs and properties](configs-and-properties) for details.

</TabItem>
</Tabs>

### Database-specific Examples and Notes

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

Spark allows you to define:

- a `not null` constraint
- and/or additional constraint checks on your columns

As Spark does not support transactions nor allows using `create or replace table` with a schema, the table is first created without a schema and `alter` statements are then executed to add the different constraints. 

This means that:

- the names and order of columns is checked but not their type
- if the `constraints` and/or `constraint_check` fails, the table with the failing data will still exist in the Warehouse

See [this page](https://docs.databricks.com/tables/constraints.html) with more details about the support of constraints on Spark.

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
        constraints: ['not null']
        constraints_check: "(id > 0)"
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
  create or replace table schema_name.my_model 
  using delta 
  as
    select
      1 as id,
      'blue' as color,
      cast('2019-01-01' as date) as date_day
```

</File>

Followed by the statements

```sql
alter table schema_name.my_model change column id set not null;
alter table schema_name.my_model add constraint 472394792387497234 check (id > 0);
```

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
        constraints_check: (id > 0)
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
        constraints_check: (id > 0)
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