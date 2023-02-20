---
resource_types: [models]
datatype: "{dictionary}"
---

:::caution Under construction 🚧
These docs are liable to change!
:::

:::info Beta functionality
This functionality is new in v1.5! These docs exist to provide a high-level overview of what's to come. Specific syntax is liable to change.

For more details, and to leave your feedback, check out this GitHub issue:
* ["Unify constraints and constraints_check configs" (dbt-core#6750)](https://github.com/dbt-labs/dbt-core/issues/6750)
:::

In transactional databases, it is possible to define "constraints" on the allowed values of certain columns, stricter than just the data type of those values. Because Postgres is a transactional database, it supports and enforces all the constraints in the ANSI SQL standard (`not null`, `unique`, `primary key`, `foreign key`), plus a flexible row-level `check` constraint that evaluates to a boolean expression.

Most analytical data platforms support and enforce a `not null` constraint, but they either do not support or do not enforce the rest. It is sometimes still desirable to add an "informational" constraint, knowing it is _not_ enforced, for the purpose of integrating with legacy data catalog or entity-relation diagram tools ([dbt-core#3295](https://github.com/dbt-labs/dbt-core/issues/3295)).

<WHCode>

<div warehouse="Postgres">

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
create table "database_name"."schema_name"."constraints_example__dbt_tmp"
( 
    id integer not null primary key check (id > 0),
    color text,
    date_day date    
)
;
insert into "database_name"."schema_name"."constraints_example__dbt_tmp" 
(   
    id,
    color,  
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

create table "database_name"."schema_name"."constraints_example__dbt_tmp"
    
(
    id integer not null,
    color varchar,
    date_day date,
    primary key(id)
)    
;

insert into "database_name"."schema_name"."constraints_example__dbt_tmp"
(   
select
    1 as id,
    'blue' as color,
    cast('2019-01-01' as date) as date_day
); 
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
create or replace transient table <database>.<schema>.constraints_model        
(
    id integer not null primary key,
    color text,
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

<div warehouse="BigQuery">

BigQuery allows defining `not null` constraints. However, it does _not_ support or enforce the definition of unenforced constraints, such as `primary key`.

Documentation: https://cloud.google.com/bigquery/docs/reference/standard-sql/data-definition-language

Data types: https://cloud.google.com/bigquery/docs/reference/standard-sql/data-types

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
        constraints: ['not null'] # 'primary key' is not supported
        tests:
          - unique
      - name: color
        data_type: string
      - name: date_day
        data_type: date
```

</File>

Expected DDL to enforce constraints:
<File name='target/run/.../constraints_example.sql'>

```sql
create or replace table `<project>`.`<dataset>`.`constraints_model`        
(
    id integer not null,
    color string,
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

<div warehouse="Databricks">

Databricks allows you to define:

- a `not null` constraint
- and/or additional `check` constraints, with conditional expressions including one or more columns

As Databricks does not support transactions nor allows using `create or replace table` with a column schema, the table is first created without a schema and `alter` statements are then executed to add the different constraints. 

This means that:

- The names and order of columns is checked but not their type
- If the `constraints` and/or `constraint_check` fails, the table with the failing data will still exist in the Warehouse

See [this page](https://docs.databricks.com/tables/constraints.html) with more details about the support of constraints on Databricks.

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

</WHCode>