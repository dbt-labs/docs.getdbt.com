---
title: "User-defined functions"
description: "Learn how to add user-defined functions (UDFs) to your dbt projects."
id: "udfs"
---

# User-defined functions <Lifecycle status="beta" />

:::info
UDFs are not yet supported in the dbt Fusion engine.
:::

User-defined functions (UDFs) enable users to define and register custom functions in your warehouse. Like [macros](/docs/build/jinja-macros), UDFs promote code reuse. They run natively in the warehouse so you can reuse the same logic in tools outside dbt.

dbt creates, updates, and renames UDFs as part of DAG execution. The UDF file is created before building the model that references it.

## Supported adapters

UDFs are supported in the following adapters:

<Tabs>

<TabItem value="core" label="dbt Core local install">

- BigQuery
- Snowflake
- Redshift
- Postgres

</TabItem>

<TabItem value ="dbt platform" label ="dbt Core in the dbt platform">

- BigQuery
- Snowflake
- Redshift

</TabItem>
</Tabs>

## Defining UDFs in dbt

To define UDFs in dbt, refer to the following steps:

1. Create a SQL file under the `functions` directory. For example:

    <File name='functions/is_positive_int.sql'>

    ```sql
    {{ config(
        database='udf_db'
    ) }}

    REGEXP_CONTAINS(a_string, r'^[0-9]+$')
    ```

    </File>

2. Specify the function name and define the config, properties, return type, and optional arguments in a corresponding YAML file. For example:


    <File name='functions/schema.yml'>

    ```yml
    functions:
      - name: is_positive_int # required
        description: My UDF that determines if a string represents a positive (+) integer # required
        config:
            schema: udf_schema
            database: udf_db
        arguments: # optional
            - name: a_string # required if arguments is specified
              data_type: string # required if arguments is specified
              description: The string that I want to check if it's representing a positive integer (like "10") 
        returns: # required
            data_type: boolean # required
    ```
    </File>

    <!--other types not yet supported
    <Expandable alt_header="Supported UDF types">

    You can use these values for the `type` property when you define a function in a YAML file.

    - `scalar` - Returns a single value per row
    - `aggregate` - Returns a single value per group, aggregating several rows
    - `table functions` - Returns a table result
    <br></br>
    For example:

    ```yml
    functions:
	  - name: string 
	    description: string
	    type: scalar # default value
    ```

    If not explicitly specified, the `type` property defaults to `scalar`.

    </Expandable>
    -->
    
    The rendered `CREATE` UDF statement depends on which adapter you’re using. For example:

    <Tabs>

    <TabItem value="Snowflake">
    ```sql
    CREATE OR REPLACE FUNCTION my_schema.is_positive_int(a_string STRING)
    RETURNS BOOLEAN
    AS (
    REGEXP_CONTAINS(a_string, r'^[0-9]+$')
    );
    ```
    </TabItem>

    <TabItem value="Redshift">
    ```sql
    CREATE OR REPLACE FUNCTION repeat_n(s VARCHAR, n INTEGER)
    RETURNS VARCHAR
    VOLATILE
    AS $$ SELECT repeat(s, n); $$
    LANGUAGE SQL;
    ```
    </TabItem>
    </Tabs>

3. Reference the UDF in a model using the `{{ function(...) }}` macro. For example:

    <File name="models/my_model.sql">

    ```sql
    select

    maybe_positive_int_column,
        {{ function('is_positive_int') }}(maybe_positive_int_column)

    from {{ ref('a_model_i_like') }}
    ```
    </File>

4. Run `dbt compile`. In the following example, the `{{ function('is_positive_int') }}` is replaced by the UDF name `udf_db.udf_schema.is_positive_int`.

    <File name="models/my_model.sql">

    ```sql
    select

    maybe_positive_int_column,
	udf_db.udf_schema.is_positive_int(maybe_positive_int_column) as is_positive

    from analytics.<dbt_schema>.a_model_i_like
    ```
    </File>

    In your DAG, there should be a dependency between `is_positive_int` → `my_model` and a UDF node is created from the SQL and YAML definitions.

After defining a UDF, you can update the SQL file that contains its function body (`is_positive_int.sql` in this example). When you rebuild, your changes will be applied everywhere the UDF is referenced. 

## Using UDFs in unit tests

You can use [unit tests](/docs/build/unit-tests) to validate models that reference UDFs. Before running unit tests, make sure the function exists in your warehouse. To ensure that the function exists for a unit test, run:

```bash
dbt build --select "+my_model_to_test" --empty
```

Following the example in [Defining UDFs in dbt](#defining-udfs-in-dbt), here's an example of a unit test that validates a model that calls a UDF:

<File name="tests/test_is_positive_int.yml">

```yml
unit_tests:
  - name: test_is_positive_int 
    description: "Check my is_positive_int logic captures edge cases"
    model: my_model
    given:
      - input: ref('a_model_i_like')
        rows:
          - { maybe_positive_int_column: 10 }
          - { maybe_positive_int_column: -4 }
          - { maybe_positive_int_column: +8 }
          - { maybe_positive_int_column: 1.0 }
    expect:
      rows:
        - { maybe_positive_int_column: 10,  is_positive: true }
        - { maybe_positive_int_column: -4,  is_positive: false }
        - { maybe_positive_int_column: +8,  is_positive: true }
        - { maybe_positive_int_column: 1.0, is_positive: true }
```
</File>

## Listing and selecting UDFs

To list UDFs in your project, run `dbt list`. 

To select UDFs when running a project, use the following commands:

- `dbt run --resource_type function` &mdash; Use this command to only run UDFs in your project.
- `dbt run --select resource_type:function` &mdash; Use this command to reinitialize all UDFs in your project.
- `dbt run --select path/to/my_function.sql` &mdash; Use this command to select a function by file path.
- `dbt run --select my_function` &mdash; Use this command if you modified a UDF and you want to replace it in the data warehouse. To update all models that use the UDF, run `dbt run --select my_function+`.

## Limitations
- Creating UDFs in other languages (for example, Python, Java, or Scala) is not yet supported. 
- Only <Term id="scalar">scalar</Term> functions are currently supported.
