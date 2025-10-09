---
title: "User-defined functions"
description: "Learn how to add user-defined functions (UDFs) to your dbt projects."
id: "udfs"
---

# User-defined functions <Lifecycle status="beta" />

User-defined functions (UDFs) enable you to define and register custom functions in your warehouse. Like [macros](/docs/build/jinja-macros), UDFs promote code reuse, but they are objects in the warehouse so you can reuse the same logic in tools outside dbt, such as BI tools, data science notebooks, and more. 

UDFs are particularly valuable for sharing logic across multiple tools, standardizing complex business calculations, improving performance for compute-intensive operations (since they're compiled and optimized by your warehouse's query engine), and version controlling custom logic within your dbt project.

dbt creates, updates, and renames UDFs as part of DAG execution. The UDF is built in the warehouse before the model that references it.

## Prerequisites

* Make sure you're using dbt platform's **Latest Fusion** or **Latest** [release track](/docs/dbt-versions/cloud-release-tracks) or dbt Core v1.11.
* Use one of the following adapters:

	<Tabs>
	
	<TabItem value="core" label="dbt Core">
	
	- BigQuery
	- Snowflake
	- Redshift
	- Postgres
	- Databricks
	
	</TabItem>
	
	<TabItem value ="fusion" label ="dbt Fusion engine">
	
	- BigQuery
	- Snowflake
	- Redshift
	- Databricks
	
	</TabItem>
	</Tabs>

## Defining UDFs in dbt

To define UDFs in dbt, refer to the following steps:

1. Create a SQL file under the `functions` directory. For example:

    <File name='functions/is_positive_int.sql'>

    ```sql

    REGEXP_CONTAINS(a_string, r'^[0-9]+$')
    ```

    </File>

    **Note**: You can specify configs in the SQL file or in the corresponding YAML file in Step 2. 

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
    - `table` - Returns a table result
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
    CREATE OR REPLACE FUNCTION udf_db.udf_schema.is_positive_int(a_string STRING)
    RETURNS BOOLEAN
    LANGUAGE SQL
    AS $$
      REGEXP_CONTAINS(a_string, r'^[0-9]+$')
    $$;
    ```
    </TabItem>

    <TabItem value="Redshift">
    ```sql
    CREATE OR REPLACE FUNCTION udf_db.udf_schema.is_positive_int(VARCHAR)
    RETURNS BOOLEAN
    VOLATILE # Technically this function could be set as STABLE, but we don't support setting volatility yet
    AS $$
      REGEXP_CONTAINS($1, r'^[0-9]+$')
    $$ LANGUAGE SQL;
    ```
    </TabItem>

    <TabItem value="BigQuery">
    ```sql
    CREATE OR REPLACE FUNCTION udf_db.udf_schema.is_positive_int(a_string STRING)
    RETURNS BOOLEAN
    AS (
      REGEXP_CONTAINS(a_string, r'^[0-9]+$')
    );
    ```
    </TabItem>

    <TabItem value="Databricks">
    ```sql
    CREATE OR REPLACE FUNCTION udf_db.udf_schema.is_positive_int(a_string STRING)
    RETURNS BOOLEAN
    LANGUAGE SQL
    RETURN
      REGEXP_CONTAINS(a_string, r'^[0-9]+$');
    ```
    </TabItem>

    <TabItem value="Postgres">
    ```sql
    CREATE OR REPLACE FUNCTION udf_db.udf_schema.is_positive_int(a_string STRING)
    RETURNS BOOLEAN
    AS $$
      REGEXP_CONTAINS(a_string, r'^[0-9]+$')
    $$ LANGUAGE SQL;
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
    from analytics.dbt_schema.a_model_i_like
    ```
    </File>

    In your DAG, a UDF node is created from the SQL and YAML definitions, and there will be a dependency between `is_positive_int` → `my_model`.
   <Lightbox src="/img/docs/building-a-dbt-project/UDF-DAG.png" width="85%" title="The DAG for the UDF node" />

After defining a UDF, if you update the SQL file that contains its function body (`is_positive_int.sql` in this example) or its configurations, your changes will be applied to the UDF in the warehouse next time you `build`. 

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

To list UDFs in your project, run `dbt list --select "resource_type:function"` or `dbt list --resource-type function`.

To select UDFs when building a project, run `dbt build --select "resource_type:function"`.

For more information about selecting UDFs, see the examples in [Node selector methods](/reference/node-selection/methods).

## Limitations
- Creating UDFs in other languages (for example, Python, Java, or Scala) is not yet supported. 
- Only <Term id="scalar">scalar</Term> functions are currently supported.

## Related FAQs

<FAQ path="Project/udfs-vs-macros" />
