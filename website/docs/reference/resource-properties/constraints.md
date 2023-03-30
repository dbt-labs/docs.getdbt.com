---
resource_types: [models]
datatype: "{dictionary}"
---

:::info Beta functionality
This functionality is new in v1.5! The syntax is mostly locked, but some small details are still liable to change.
:::

The structure of a constraint is:
- `type` (required): one of `not_null`, `primary_key`, `foreign_key`, `check`, `custom`
- `expression`: text input to qualify the constraint; required for certain constraint types, and optional for others
- `name` (optional): some data platforms support defining constraints with a human-friendly name

In transactional databases, it is possible to define "constraints" on the allowed values of certain columns, stricter than just the data type of those values. For example, Postgres supports and enforces all the constraints in the ANSI SQL standard (`not null`, `unique`, `primary key`, `foreign key`), plus a flexible row-level `check` constraint that evaluates to a boolean expression.

Most analytical data platforms support and enforce a `not null` constraint, but they either do not support or do not enforce the rest. It is sometimes still desirable to add an "informational" constraint, knowing it is _not_ enforced, for the purpose of integrating with legacy data catalog or entity-relation diagram tools ([dbt-core#3295](https://github.com/dbt-labs/dbt-core/issues/3295)).

To that end, there are two optional fields you can specify on any constraint:
- `warn_unenforced: False` to skip warning on constraints that are supported, but not enforced, by this data platform. The constraint will be included in templated DDL.
- `warn_unsupported: False` to skip warning on constraints that aren't supported by this data platform, and therefore won't be included in templated DDL.

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
  'My Favorite Customer' as customer_name, 
  cast('2019-01-01' as date) as first_transaction_date
```

</File>

<File name='models/schema.yml'>

```yml
models:
  - name: dim_customers
    config:
      contract:
        enforced: true
    columns:
      - name: customer_id
        data_type: int
        constraints:
          - type: not_null
          - type: primary_key
          - type: check
            expression: "id > 0"
      - name: customer_name
        data_type: text
      - name: first_transaction_date
        data_type: date
```

</File>

Expected DDL to enforce constraints:
<File name='target/run/.../constraints_example.sql'>

```sql
create table "database_name"."schema_name"."constraints_example__dbt_tmp"
( 
    id integer not null primary key check (id > 0),
    customer_name text,
    first_transaction_date date    
)
;
insert into "database_name"."schema_name"."constraints_example__dbt_tmp" 
(   
    id,
    customer_name,  
    first_transaction_date
) 
(
select 
    1 as id, 
    'My Favorite Customer' as customer_name, 
    cast('2019-01-01' as date) as first_transaction_date
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
  'My Favorite Customer' as customer_name, 
  cast('2019-01-01' as date) as first_transaction_date
```

</File>

<File name='models/schema.yml'>

```yml
models:
  - name: dim_customers
    config:
      contract:
        enforced: true
    columns:
      - name: id
        data_type: integer
        constraints:
          - type: not_null
          - type: primary_key # not enforced  -- will warn & include
          - type: check       # not supported -- will warn & skip
            expression: "id > 0"
        tests:
          - unique            # primary_key constraint is not enforced
      - name: customer_name
        data_type: varchar
      - name: first_transaction_date
        data_type: date
```

</File>

Expected DDL to enforce constraints:
<File name='target/run/.../constraints_example.sql'>

```sql

create table "database_name"."schema_name"."constraints_example__dbt_tmp"
    
(
    id integer not null,
    customer_name varchar,
    first_transaction_date date,
    primary key(id)
)    
;

insert into "database_name"."schema_name"."constraints_example__dbt_tmp"
(   
select
    1 as id,
    'My Favorite Customer' as customer_name,
    cast('2019-01-01' as date) as first_transaction_date
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
  'My Favorite Customer' as customer_name, 
  cast('2019-01-01' as date) as first_transaction_date
```

</File>

<File name='models/schema.yml'>

```yml
models:
  - name: dim_customers
    config:
      contract:
        enforced: true
    columns:
      - name: id
        data_type: integer
        description: hello
        constraints:
          - type: not_null
          - type: primary_key # not enforced  -- will warn & include
          - type: check       # not supported -- will warn & skip
            expression: "id > 0"
        tests:
          - unique            # primary_key constraint is not enforced
      - name: customer_name
        data_type: text
      - name: first_transaction_date
        data_type: date
```

</File>

Expected DDL to enforce constraints:
<File name='target/run/.../constraints_example.sql'>

```sql
create or replace transient table <database>.<schema>.constraints_model        
(
    id integer not null primary key,
    customer_name text,
    first_transaction_date date  
)
as
(
select 
  1 as id, 
  'My Favorite Customer' as customer_name, 
  cast('2019-01-01' as date) as first_transaction_date
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
  'My Favorite Customer' as customer_name, 
  cast('2019-01-01' as date) as first_transaction_date
```

</File>

<File name='models/schema.yml'>

```yml
models:
  - name: dim_customers
    config:
      contract:
        enforced: true
    columns:
      - name: id
        data_type: int
        constraints:
          - type: not_null
          - type: primary_key # not enforced  -- will warn & include
          - type: check       # not supported -- will warn & skip
            expression: "id > 0"
        tests:
          - unique            # primary_key constraint is not enforced
      - name: customer_name
        data_type: string
      - name: first_transaction_date
        data_type: date
```

</File>

Expected DDL to enforce constraints:
<File name='target/run/.../constraints_example.sql'>

```sql
create or replace table `<project>`.`<dataset>`.`constraints_model`        
(
    id integer not null,
    customer_name string,
    first_transaction_date date  
)
as
(
select 
  1 as id, 
  'My Favorite Customer' as customer_name, 
  cast('2019-01-01' as date) as first_transaction_date
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
  'My Favorite Customer' as customer_name, 
  cast('2019-01-01' as date) as first_transaction_date
```

</File>

<File name='models/schema.yml'>

```yml
models:
  - name: dim_customers
    config:
      contract:
        enforced: true
    columns:
      - name: id
        data_type: int
        constraints:
          - type: not_null
          - type: primary_key # not enforced  -- will warn & include
          - type: check       # not supported -- will warn & skip
            expression: "id > 0"
        tests:
          - unique            # primary_key constraint is not enforced
      - name: customer_name
        data_type: text
      - name: first_transaction_date
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
      'My Favorite Customer' as customer_name,
      cast('2019-01-01' as date) as first_transaction_date
```

</File>

Followed by the statements

```sql
alter table schema_name.my_model change column id set not null;
alter table schema_name.my_model add constraint 472394792387497234 check (id > 0);
```

</div>

</WHCode>
