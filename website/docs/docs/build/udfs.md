---
title: "User-defined functions"
description: "Learn how to add user-defined functions (UDFs) to your dbt projects."
id: "udfs"
---


User-defined functions (UDFs) enable users to define and register custom functions within the warehouse. Like [macros](/docs/build/jinja-macros), UDFs enable reuse of code; however, unlike macros, you can define UDFs in languages other than SQL (for example, Python, Java, Scala) and you can use them in queries outside <Constant name="core" />.

Note that only basic SQL UDFs are currently supported in <Constant name="core" />.

<Constant name="core" /> creates, updates, and renames UDFs as part of DAG execution. The UDF file is created before building the model that references it.

## Defining UDFs in dbt

To define UDFs in <Constant name="core" />, refer to the following steps:

1. Create a SQL file under the `functions` directory. For example:
    <!--Please check if the sample is correct-->
    <File name='functions/is_positive_int.sql'>

    ```sql
    {{ config(
        database='udf_db'
    ) }}

    REGEXP_CONTAINS(a_string, r'^[0-9]+$')
    ```

    </File>

2. Define your argument, output types, properties, and configs in a corresponding YAML file. For example:


    <File name='functions/schema.yml'>

    ```yml
    functions:
    - name: is_positive_int # required
        description: My UDF that determines if a string represents a positive (+) integer # required
        config:
            schema: udf_schema
            database: udf_db
        arguments: 
            - name: a_string
                type: string
                description: The string that I want to check if it's representing a positive integer (like "10") 
        return_type: # required
            type: boolean # required
    ```
    </File>

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
    IMMUTABLE
    AS $$ SELECT repeat(s, n); $$
    LANGUAGE SQL;
    ```
    </TabItem>
    </Tabs>
<!-- Are steps 3-4 now supported?-->
3. Reference the UDF in a model using the `{{ ref(…) }}` macro. For example:

    <File name="models/my_model.sql">

    ```sql
    select

    maybe_positive_int_column,
        {{ ref('is_positive_int') }}('maybe_positive_int_column')

    from {{ ref('a_model_i_like') }}
    ```
    </File>

4. Run `dbt compile`. In the following example, the `{{ ref('is_positive_int') }}` is replaced by the UDF name `udf_db.udf_schema.is_positive_int`.

    <File name="models/my_model.sql">

    ```sql
    select

    maybe_positive_int_column,
	udf_db.udf_schema.is_positive_int(maybe_positive_int_column) as is_positive

    from analytics.<dbt_schema>.a_model_i_like
    ```
    </File>

    In your DAG, there should be a dependency between `is_positive_int` → `my_model` and a UDF node is created from the SQL and YAML definition.

## Listing and selecting UDFs

To list UDFs in your project, run `dbt list`. 

To select UDFs when running a project, use the following commands:

- `dbt run --resource_type function` &mdash; Use this command to only run UDFs in your project. <!--Confirm if correct-->
- `dbt run --select resource_type:function` &mdash; Use this command to reinitialize all UDFs in your project.
- `dbt run --select path/to/my_function.sql` &mdash; Use this command to select a function by file path.
- `dbt run --select my_function` &mdash; Use this command if you modified a UDF and you want to replace it in the data warehouse. To update all models that use the UDF, run `dbt run --select my_function+`.
