---
resource_types: [models]
datatype: "{dictionary}"
---

Constraints are a feature of many data platforms. When specified, the platform will perform additional validation on data as it is being populated in a new table or inserted into a preexisting table. If the validation fails, the table creation or update fails, the operation is rolled back, and you will see a clear error message.

When enforced, a constraint guarantees that you will never see invalid data in the table materialized by your model. Enforcement varies significantly by data platform.

Constraints require the declaration and enforcement of a model [contract](/reference/resource-configs/contract).

**Constraints are never applied on `ephemeral` models or those materialized as `view`**. Only `table` and `incremental` models support applying and enforcing constraints.

## Defining constraints

Constraints may be defined for a single column, or at the model level for one or more columns. As a general rule, we recommend defining single-column constraints directly on those columns.

If you define multiple `primary_key` constraints for a single model, those _must_ be defined at the model level. Defining multiple `primary_key` constraints at the column level is not supported. 

The structure of a constraint is:
- `type` (required): one of `not_null`, `unique`, `primary_key`, `foreign_key`, `check`, `custom`
- `expression`: Free text input to qualify the constraint. Required for certain constraint types, and optional for others.
- `name` (optional): Human-friendly name for this constraint. Supported by some data platforms.
- `columns` (model-level only): List of column names to apply the constraint over.

<VersionBlock firstVersion="1.9">

Foreign key constraints accept two additional inputs:
- `to`: A relation input, likely `ref()`, indicating the referenced table.
- `to_columns`: A list of column(s) in that table containing the corresponding primary or unique key.

This syntax for defining foreign keys uses `ref`, meaning it will capture dependencies and works across different environments. It's available in [dbt Cloud Versionless](/docs/dbt-versions/upgrade-dbt-version-in-cloud#versionless) and versions of dbt Core starting with v1.9.

<File name='models/schema.yml'>

```yml
models:
  - name: <model_name>
    
    # required
    config:
      contract: {enforced: true}
    
    # model-level constraints
    constraints:
      - type: primary_key
        columns: [first_column, second_column, ...]
      - type: foreign_key # multi_column
        columns: [first_column, second_column, ...]
        to: ref('other_model_name')
        to_columns: [other_model_first_column, other_model_second_columns, ...]
      - type: check
        columns: [first_column, second_column, ...]
        expression: "first_column != second_column"
        name: human_friendly_name
      - type: ...
    
    columns:
      - name: first_column
        data_type: string
        
        # column-level constraints
        constraints:
          - type: not_null
          - type: unique
          - type: foreign_key
            to: ref('other_model_name')
            to_columns: [other_model_column]
          - type: ...
```

</File>
</VersionBlock>

<VersionBlock lastVersion="1.8">

In older versions of dbt Core, when defining a `foreign_key` constraint, you need to manually specify the referenced table in the `expression` field. You can use `{{ target }}` variables to make this expression environment-aware, but the dependency between this model and the referenced table is not captured. Starting in dbt Core v1.9, you can specify the referenced table using the `ref()` function.

<File name='models/schema.yml'>

```yml
models:
  - name: <model_name>
    
    # required
    config:
      contract: {enforced: true}
    
    # model-level constraints
    constraints:
      - type: primary_key
        columns: [first_column, second_column, ...]
      - type: foreign_key # multi_column
        columns: [first_column, second_column, ...]
        expression: "{{ target.schema }}.other_model_name (other_model_first_column, other_model_second_column, ...)"
      - type: check
        columns: [first_column, second_column, ...]
        expression: "first_column != second_column"
        name: human_friendly_name
      - type: ...
    
    columns:
      - name: first_column
        data_type: string
        
        # column-level constraints
        constraints:
          - type: not_null
          - type: unique
          - type: foreign_key
            expression: "{{ target.schema }}.other_model_name (other_model_column)"
          - type: ...
```

</File>

</VersionBlock>

## Platform-specific support

In transactional databases, it is possible to define "constraints" on the allowed values of certain columns, stricter than just the data type of those values. For example, Postgres supports and enforces all the constraints in the ANSI SQL standard (`not null`, `unique`, `primary key`, `foreign key`), plus a flexible row-level `check` constraint that evaluates to a boolean expression.

Most analytical data platforms support and enforce a `not null` constraint, but they either do not support or do not enforce the rest. It is sometimes still desirable to add an "informational" constraint, knowing it is _not_ enforced, for the purpose of integrating with legacy data catalog or entity-relation diagram tools ([dbt-core#3295](https://github.com/dbt-labs/dbt-core/issues/3295)). Some data platforms can optionally use primary or foreign key constraints for query optimization if you specify an additional keyword.

To that end, there are two optional fields you can specify on any filter:
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
      - name: id
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

Note that Redshift limits the maximum length of the `varchar` values to 256 characters by default (or when specified without a length). This means that any string data exceeding 256 characters might get truncated _or_ return a "value too long for character type" error. To allow the maximum length, use `varchar(max)`. For example, `data_type: varchar(max)`.  

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

Snowflake suppports four types of constraints: `unique`, `not null`, `primary key`, and `foreign key`.

It is important to note that only the `not null` (and the `not null` property of `primary key`) are actually checked at present.
The rest of the constraints are purely metadata, not verified when inserting data. Although Snowflake does not validate `unique`, `primary`, or `foreign_key` constraints, you may optionally instruct Snowflake to use them for query optimization by specifying [`rely`](https://docs.snowflake.com/en/user-guide/join-elimination) in the constraint `expression` field.

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
          - unique            # need this test because primary_key constraint is not enforced
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

BigQuery allows defining and enforcing `not null` constraints, and defining (but _not_ enforcing) `primary key` and `foreign key` constraints (which can be used for query optimization). BigQuery does not support defining or enforcing other constraints. For more information, refer to [Platform constraint support](/docs/collaborate/govern/model-contracts#platform-constraint-support)

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

### Column-level constraint on nested column:

<File name='models/nested_column_constraints_example.sql'>

```sql
{{
  config(
    materialized = "table"
  )
}}

select
  'string' as a,
  struct(
    1 as id,
    'name' as name,
    struct(2 as id, struct('test' as again, '2' as even_more) as another) as double_nested
  ) as b
```

</File>

<File name='models/nested_fields.yml'>

```yml
version: 2

models:
  - name: nested_column_constraints_example
    config:
      contract: 
        enforced: true
    columns:
      - name: a
        data_type: string
      - name: b.id
        data_type: integer
        constraints:
          - type: not_null
      - name: b.name
        description: test description
        data_type: string
      - name: b.double_nested.id
        data_type: integer
      - name: b.double_nested.another.again
        data_type: string
      - name: b.double_nested.another.even_more
        data_type: integer
        constraints: 
          - type: not_null
```

</File>

### Expected DDL to enforce constraints:

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

As Databricks does not support transactions nor allows using `create or replace table` with a column schema, the table is first created without a schema, and `alter` statements are then executed to add the different constraints. 

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

## Custom constraints 

In dbt Cloud and dbt Core, you can use custom constraints on models for the advanced configuration of tables. Different data warehouses support different syntax and capabilities. 

Custom constraints allow you to add configuration to specific columns. For example:

  - Set [masking policies](https://docs.snowflake.com/en/user-guide/security-column-intro#what-are-masking-policies) in Snowflake when using a Create Table As Select (CTAS).
  
  - Other data warehouses (such as [Databricks](https://docs.databricks.com/en/sql/language-manual/sql-ref-syntax-ddl-create-table-using.html) and [BigQuery](https://cloud.google.com/bigquery/docs/reference/standard-sql/data-definition-language#column_name_and_column_schema) have their own set of parameters that can be set for columns in their CTAS statements.


You can implement constraints in a couple of different ways:

<Expandable alt_header="Custom constraints with tags">

Here's an example of how to implement tag-based masking policies with contracts and constraints using the following syntax:

<File name='models/constraints_example.yml'>

```yaml

models:
  - name: my_model
    config:
      contract:
        enforced: true
      materialized: table
    columns:
      - name: id
        data_type: int
        constraints:
          - type: custom
            expression: "tag (my_tag = 'my_value')" #  A custom SQL expression used to enforce a specific constraint on a column.

```

</File>

Using this syntax requires configuring all the columns and their types as it’s the only way to send a create or replace `<cols_info_with_masking> mytable as ...`. It’s not possible to do it with just a partial list of columns. This means making sure the columns and constraints fields are fully defined.

To generate a YAML with all the columns, you can use `generate_model_yaml` from [dbt-codegen](https://github.com/dbt-labs/dbt-codegen/tree/0.12.1/?tab=readme-ov-file#generate_model_yaml-source).
</Expandable>

<Expandable alt_header="Custom constraints without tags">

Alternatively, you can add a masking policy without tags:

<File name='models/constraints_example.yml'>
 
```yaml

models:
  - name: my_model
    config:
      contract:
        enforced: true
      materialized: table
    columns:
      - name: id
        data_type: int
        constraints:
          - type: custom
            expression: "masking policy my_policy"

```

</File>
</Expandable>

