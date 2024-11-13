---
title: "Python models"
id: "python-models"
---

Note that only [specific data platforms](#specific-data-platforms) support dbt-py models.

We encourage you to:
- Read [the original discussion](https://github.com/dbt-labs/dbt-core/discussions/5261) that proposed this feature.
- Contribute to [best practices for developing Python models in dbt](https://discourse.getdbt.com/t/dbt-python-model-dbt-py-best-practices/5204).
- Share your thoughts and ideas on [next steps for Python models](https://github.com/dbt-labs/dbt-core/discussions/5742).
- Join the **#dbt-core-python-models** channel in the [dbt Community Slack](https://www.getdbt.com/community/join-the-community/).


## Overview

dbt Python (`dbt-py`) models can help you solve use cases that can't be solved with SQL. You can perform analyses using tools available in the open-source Python ecosystem, including state-of-the-art packages for data science and statistics. Before, you would have needed separate infrastructure and orchestration to run Python transformations in production. Python transformations defined in dbt are models in your project with all the same capabilities around testing, documentation, and lineage.


<File name='models/my_python_model.py'>

```python
import ...

def model(dbt, session):

    my_sql_model_df = dbt.ref("my_sql_model")

    final_df = ...  # stuff you can't write in SQL!

    return final_df
```

</File>

<File name='models/config.yml'>

```yml
version: 2

models:
  - name: my_python_model

    # Document within the same codebase
    description: My transformation written in Python

    # Configure in ways that feel intuitive and familiar
    config:
      materialized: table
      tags: ['python']

    # Test the results of my Python transformation
    columns:
      - name: id
        # Standard validation for 'grain' of Python results
        tests:
          - unique
          - not_null
    tests:
      # Write your own validation logic (in SQL) for Python results
      - [custom_generic_test](/best-practices/writing-custom-generic-tests)
```

</File>

<!--- TODO: how to make this image preview bigger? --->
<Lightbox src="/img/docs/building-a-dbt-project/building-models/python-models/python-model-dag.png" title="SQL + Python, together at last" style="width:200%"/>

The prerequisites for dbt Python models include using an adapter for a data platform that supports a fully featured Python runtime. In a dbt Python model, all Python code is executed remotely on the platform. None of it is run by dbt locally. We believe in clearly separating _model definition_ from _model execution_. In this and many other ways, you'll find that dbt's approach to Python models mirrors its longstanding approach to modeling data in SQL.

We've written this guide assuming that you have some familiarity with dbt. If you've never before written a dbt model, we encourage you to start by first reading [dbt Models](/docs/build/models). Throughout, we'll be drawing connections between Python models and SQL models, as well as making clear their differences.

### What is a Python model?

A dbt Python model is a function that reads in dbt sources or other models, applies a series of transformations, and returns a transformed dataset. <Term id="dataframe">DataFrame</Term> operations define the starting points, the end state, and each step along the way.

This is similar to the role of <Term id="cte">CTEs</Term> in dbt SQL models. We use CTEs to pull in upstream datasets, define (and name) a series of meaningful transformations, and end with a final `select` statement. You can run the compiled version of a dbt SQL model to see the data included in the resulting view or table. When you `dbt run`, dbt wraps that query in `create view`, `create table`, or more complex DDL to save its results in the database.

Instead of a final `select` statement, each Python model returns a final DataFrame. Each DataFrame operation is "lazily evaluated." In development, you can preview its data, using methods like `.show()` or `.head()`. When you run a Python model, the full result of the final DataFrame will be saved as a table in your data warehouse.

dbt Python models have access to almost all of the same configuration options as SQL models. You can test and document them, add `tags` and `meta` properties, and grant access to their results to other users. You can select them by their name, file path, configurations, whether they are upstream or downstream of another model, or if they have been modified compared to a previous project state.

### Defining a Python model

Each Python model lives in a `.py` file in your `models/` folder. It defines a function named **`model()`**, which takes two parameters:
- **`dbt`**: A class compiled by dbt Core, unique to each model, enables you to run your Python code in the context of your dbt project and DAG.
- **`session`**: A class representing your data platform’s connection to the Python backend. The session is needed to read in tables as DataFrames, and to write DataFrames back to tables. In PySpark, by convention, the `SparkSession` is named `spark`, and available globally. For consistency across platforms, we always pass it into the `model` function as an explicit argument called `session`.

The `model()` function must return a single DataFrame. On Snowpark (Snowflake), this can be a Snowpark or pandas DataFrame. Via PySpark (Databricks + BigQuery), this can be a Spark, pandas, or pandas-on-Spark DataFrame. For more about choosing between pandas and native DataFrames, see [DataFrame API + syntax](#dataframe-api-and-syntax).

When you `dbt run --select python_model`, dbt will prepare and pass in both arguments (`dbt` and `session`). All you have to do is define the function. This is how every single Python model should look:

<File name='models/my_python_model.py'>

```python
def model(dbt, session):

    ...

    return final_df
```

</File>


### Referencing other models

Python models participate fully in dbt's directed acyclic graph (DAG) of transformations. Use the `dbt.ref()` method within a Python model to read data from other models (SQL or Python). If you want to read directly from a raw source table, use `dbt.source()`. These methods return DataFrames pointing to the upstream source, model, seed, or snapshot.

<File name='models/my_python_model.py'>

```python
def model(dbt, session):

    # DataFrame representing an upstream model
    upstream_model = dbt.ref("upstream_model_name")

    # DataFrame representing an upstream source
    upstream_source = dbt.source("upstream_source_name", "table_name")

    ...
```

</File>

Of course, you can `ref()` your Python model in downstream SQL models, too:

<File name='models/downstream_model.sql'>

```sql
with upstream_python_model as (

    select * from {{ ref('my_python_model') }}

),

...
```

</File>

:::caution

Referencing [ephemeral](/docs/build/materializations#ephemeral) models is currently not supported (see [feature request](https://github.com/dbt-labs/dbt-core/issues/7288)) 
:::

<VersionBlock firstVersion="1.8">

From dbt version 1.8, Python models also support dynamic configurations within Python f-strings. This allows for more nuanced and dynamic model configurations directly within your Python code. For example:

<File name='models/my_python_model.py'>

```python
# Previously, attempting to access a configuration value like this would result in None
print(f"{dbt.config.get('my_var')}")  # Output before change: None

# Now you can access the actual configuration value
# Assuming 'my_var' is configured to 5 for the current model
print(f"{dbt.config.get('my_var')}")  # Output after change: 5
```

This also means you can use `dbt.config.get()` within Python models to ensure that configuration values are effectively retrievable and usable within Python f-strings.

</File>
</VersionBlock>

## Configuring Python models

Just like SQL models, there are three ways to configure Python models:
1. In `dbt_project.yml`, where you can configure many models at once
2. In a dedicated `.yml` file, within the `models/` directory
3. Within the model's `.py` file, using the `dbt.config()` method

Calling the `dbt.config()` method will set configurations for your model within your `.py` file, similar to the `{{ config() }}` macro in `.sql` model files:

<File name='models/my_python_model.py'>

```python
def model(dbt, session):

    # setting configuration
    dbt.config(materialized="table")
```

</File>

There's a limit to how complex you can get with the `dbt.config()` method. It accepts _only_ literal values (strings, booleans, and numeric types) and dynamic configuration. Passing another function or a more complex data structure is not possible. The reason is that dbt statically analyzes the arguments to `config()` while parsing your model without executing your Python code. If you need to set a more complex configuration, we recommend you define it using the [`config` property](/reference/resource-properties/config) in a YAML file.

#### Accessing project context

dbt Python models don't use Jinja to render compiled code. Python models have limited access to global project contexts compared to SQL models. That context is made available from the `dbt` class, passed in as an argument to the `model()` function.

Out of the box, the `dbt` class supports:
- Returning DataFrames referencing the locations of other resources: `dbt.ref()` + `dbt.source()`
- Accessing the database location of the current model: `dbt.this()` (also: `dbt.this.database`, `.schema`, `.identifier`)
- Determining if the current model's run is incremental: `dbt.is_incremental`

It is possible to extend this context by "getting" them with `dbt.config.get()` after they are configured in the [model's config](/reference/model-configs). Starting from dbt v1.8, the `dbt.config.get()` method supports dynamic access to configurations within Python models, enhancing flexibility in model logic. This includes inputs such as `var`, `env_var`, and `target`. If you want to use those values for the conditional logic in your model, we require setting them through a dedicated YAML file config:

<File name='models/config.yml'>

```yml
version: 2

models:
  - name: my_python_model
    config:
      materialized: table
      target_name: "{{ target.name }}"
      specific_var: "{{ var('SPECIFIC_VAR') }}"
      specific_env_var: "{{ env_var('SPECIFIC_ENV_VAR') }}"
```

</File>

Then, within the model's Python code, use the `dbt.config.get()` function to _access_ values of configurations that have been set:

<File name='models/my_python_model.py'>

```python
def model(dbt, session):
    target_name = dbt.config.get("target_name")
    specific_var = dbt.config.get("specific_var")
    specific_env_var = dbt.config.get("specific_env_var")

    orders_df = dbt.ref("fct_orders")

    # limit data in dev
    if target_name == "dev":
        orders_df = orders_df.limit(500)
```

</File>

<VersionBlock firstVersion="1.8">

#### Dynamic configurations

In addition to the existing methods of configuring Python models, you also have dynamic access to configuration values set with `dbt.config()` within Python models using f-strings. This increases the possibilities for custom logic and configuration management.

<File name='models/my_python_model.py'>

```python
def model(dbt, session):
    dbt.config(materialized="table")
    
    # Dynamic configuration access within Python f-strings, 
    # which allows for real-time retrieval and use of configuration values.
    # Assuming 'my_var' is set to 5, this will print: Dynamic config value: 5
    print(f"Dynamic config value: {dbt.config.get('my_var')}")
```

</File>
</VersionBlock>

### Materializations

Python models support these materializations:
- `table` (default)
- `incremental`

Incremental Python models support all the same [incremental strategies](/docs/build/incremental-strategy) as their SQL counterparts. The specific strategies supported depend on your adapter. As an example, incremental models are supported on BigQuery with Dataproc for the `merge` incremental strategy; the `insert_overwrite` strategy is not yet supported.

Python models can't be materialized as `view` or `ephemeral`. Python isn't supported for non-model resource types (like tests and snapshots).

For incremental models, like SQL models, you need to filter incoming tables to only new rows of data:

<WHCode>

<div warehouse="Snowpark">

<File name='models/my_python_model.py'>

```python
import snowflake.snowpark.functions as F

def model(dbt, session):
    dbt.config(materialized = "incremental")
    df = dbt.ref("upstream_table")

    if dbt.is_incremental:

        # only new rows compared to max in current table
        max_from_this = f"select max(updated_at) from {dbt.this}"
        df = df.filter(df.updated_at >= session.sql(max_from_this).collect()[0][0])

        # or only rows from the past 3 days
        df = df.filter(df.updated_at >= F.dateadd("day", F.lit(-3), F.current_timestamp()))

    ...

    return df
```

</File>

</div>

<div warehouse="PySpark">

<File name='models/my_python_model.py'>

```python
import pyspark.sql.functions as F

def model(dbt, session):
    dbt.config(materialized = "incremental")
    df = dbt.ref("upstream_table")

    if dbt.is_incremental:

        # only new rows compared to max in current table
        max_from_this = f"select max(updated_at) from {dbt.this}"
        df = df.filter(df.updated_at >= session.sql(max_from_this).collect()[0][0])

        # or only rows from the past 3 days
        df = df.filter(df.updated_at >= F.date_add(F.current_timestamp(), F.lit(-3)))

    ...

    return df
```

</File>

</div>

</WHCode>

## Python-specific functionality

### Defining functions

In addition to defining a `model` function, the Python model can import other functions or define its own. Here's an example on Snowpark, defining a custom `add_one` function:

<File name='models/my_python_model.py'>

```python
def add_one(x):
    return x + 1

def model(dbt, session):
    dbt.config(materialized="table")
    temps_df = dbt.ref("temperatures")

    # warm things up just a little
    df = temps_df.withColumn("degree_plus_one", add_one(temps_df["degree"]))
    return df
```

</File>

Currently, Python functions defined in one dbt model can't be imported and reused in other models. Refer to [Code reuse](#code-reuse) for the potential patterns being considered.

### Using PyPI packages

You can also define functions that depend on third-party packages so long as those packages are installed and available to the Python runtime on your data platform. See notes on "Installing Packages" for [specific data platforms](#specific-data-platforms).

In this example, we use the `holidays` package to determine if a given date is a holiday in France. The code below uses the pandas API for simplicity and consistency across platforms. The exact syntax, and the need to refactor for multi-node processing, still vary.

<WHCode>

<div warehouse="Snowpark">

<File name='models/my_python_model.py'>

```python
import holidays

def is_holiday(date_col):
    # Chez Jaffle
    french_holidays = holidays.France()
    is_holiday = (date_col in french_holidays)
    return is_holiday

def model(dbt, session):
    dbt.config(
        materialized = "table",
        packages = ["holidays"]
    )

    orders_df = dbt.ref("stg_orders")

    df = orders_df.to_pandas()

    # apply our function
    # (columns need to be in uppercase on Snowpark)
    df["IS_HOLIDAY"] = df["ORDER_DATE"].apply(is_holiday)
    df["ORDER_DATE"].dt.tz_localize('UTC') # convert from Number/Long to tz-aware Datetime

    # return final dataset (Pandas DataFrame)
    return df
```

</File>

</div>

<div warehouse="PySpark">

<File name='models/my_python_model.py'>

```python
import holidays

def is_holiday(date_col):
    # Chez Jaffle
    french_holidays = holidays.France()
    is_holiday = (date_col in french_holidays)
    return is_holiday

def model(dbt, session):
    dbt.config(
        materialized = "table",
        packages = ["holidays"]
    )

    orders_df = dbt.ref("stg_orders")

    df = orders_df.to_pandas_on_spark()  # Spark 3.2+
    # df = orders_df.toPandas() in earlier versions

    # apply our function
    df["is_holiday"] = df["order_date"].apply(is_holiday)

    # convert back to PySpark
    df = df.to_spark()               # Spark 3.2+
    # df = session.createDataFrame(df) in earlier versions

    # return final dataset (PySpark DataFrame)
    return df
```

</File>

</div>

</WHCode>

#### Configuring packages

We encourage you to configure required packages and versions so dbt can track them in project metadata. This configuration is required for the implementation on some platforms. If you need specific versions of packages, specify them.

<File name='models/my_python_model.py'>

```python
def model(dbt, session):
    dbt.config(
        packages = ["numpy==1.23.1", "scikit-learn"]
    )
```

</File>

<File name='models/config.yml'>

```yml
version: 2

models:
  - name: my_python_model
    config:
      packages:
        - "numpy==1.23.1"
        - scikit-learn
```

</File>

#### User-defined functions (UDFs)

You can use the `@udf` decorator or `udf` function to define an "anonymous" function and call it within your `model` function's DataFrame transformation. This is a typical pattern for applying more complex functions as DataFrame operations, especially if those functions require inputs from third-party packages.
- [Snowpark Python: Creating UDFs](https://docs.snowflake.com/en/developer-guide/snowpark/python/creating-udfs.html)
- [PySpark functions: udf](https://spark.apache.org/docs/latest/api/python/reference/pyspark.sql/api/pyspark.sql.functions.udf.html)

<WHCode>

<div warehouse="Snowpark">

<File name='models/my_python_model.py'>

```python
import snowflake.snowpark.types as T
import snowflake.snowpark.functions as F
import numpy

def register_udf_add_random():
    add_random = F.udf(
        # use 'lambda' syntax, for simple functional behavior
        lambda x: x + numpy.random.normal(),
        return_type=T.FloatType(),
        input_types=[T.FloatType()]
    )
    return add_random

def model(dbt, session):

    dbt.config(
        materialized = "table",
        packages = ["numpy"]
    )

    temps_df = dbt.ref("temperatures")

    add_random = register_udf_add_random()

    # warm things up, who knows by how much
    df = temps_df.withColumn("degree_plus_random", add_random("degree"))
    return df
```

</File>

**Note:** Due to a Snowpark limitation, it is not currently possible to register complex named UDFs within stored procedures and, therefore, dbt Python models. We are looking to add native support for Python UDFs as a project/DAG resource type in a future release. For the time being, if you want to create a "vectorized" Python UDF via the Batch API, we recommend either:
- Writing [`create function`](https://docs.snowflake.com/en/developer-guide/udf/python/udf-python-batch.html) inside a SQL macro, to run as a hook or run-operation
- [Registering from a staged file](https://docs.snowflake.com/en/developer-guide/snowpark/python/creating-udfs#creating-a-udf-from-a-python-source-file) within your Python model code

</div>

<div warehouse="PySpark">

<File name='models/my_python_model.py'>

```python
import pyspark.sql.types as T
import pyspark.sql.functions as F
import numpy

# use a 'decorator' for more readable code
@F.udf(returnType=T.DoubleType())
def add_random(x):
    random_number = numpy.random.normal()
    return x + random_number

def model(dbt, session):
    dbt.config(
        materialized = "table",
        packages = ["numpy"]
    )

    temps_df = dbt.ref("temperatures")

    # warm things up, who knows by how much
    df = temps_df.withColumn("degree_plus_random", add_random("degree"))
    return df
```

</File>

</div>

</WHCode>

#### Code reuse

Currently, Python functions defined in one dbt model can't be imported and reused in other models. This is something dbt Labs would like to support, so there are two patterns we're considering:

- Creating and registering **"named" UDFs** &mdash; This process is different across data platforms and has some performance limitations. For example, Snowpark supports [vectorized UDFs](https://docs.snowflake.com/en/developer-guide/udf/python/udf-python-batch.html) for pandas-like functions that you can execute in parallel.
- **Private Python packages** &mdash; In addition to importing reusable functions from public PyPI packages, many data platforms support uploading custom Python assets and registering them as packages. The upload process looks different across platforms, but your code’s actual `import` looks the same.

:::note ❓ dbt questions

- Should dbt have a role in abstracting over UDFs? Should dbt support a new type of DAG node, `function`? Would the primary use case be code reuse across Python models or defining Python-language functions that can be called from SQL models?
- How can dbt help users when uploading or initializing private Python assets? Is this a new form of `dbt deps`?
- How can dbt support users who want to test custom functions? If defined as UDFs: "unit testing" in the database? If "pure" functions in packages: encourage adoption of `pytest`?

💬 Discussion: ["Python models: package, artifact/object storage, and UDF management in dbt"](https://github.com/dbt-labs/dbt-core/discussions/5741)
:::

### DataFrame API and syntax

Over the past decade, most people writing [data transformations](https://www.getdbt.com/analytics-engineering/transformation/) in Python have adopted <Term id="dataframe">DataFrame</Term> as their common abstraction. dbt follows this convention by returning `ref()` and `source()` as DataFrames, and it expects all Python models to return a DataFrame.

A DataFrame is a two-dimensional data structure (rows and columns). It supports convenient methods for transforming that data and creating new columns from calculations performed on existing columns. It also offers convenient ways for previewing data while developing locally or in a notebook.

That's about where the agreement ends. There are numerous frameworks with their own syntaxes and APIs for DataFrames. The [pandas](https://pandas.pydata.org/docs/) library offered one of the original DataFrame APIs, and its syntax is the most common to learn for new data professionals. Most newer DataFrame APIs are compatible with pandas-style syntax, though few can offer perfect interoperability. This is true for Snowpark and PySpark, which have their own DataFrame APIs.

When developing a Python model, you will find yourself asking these questions:

**Why pandas?** &mdash; It's the most common API for DataFrames. It makes it easy to explore sampled data and develop transformations locally. You can “promote” your code as-is into dbt models and run it in production for small datasets.

**Why _not_ pandas?** &mdash; Performance. pandas runs "single-node" transformations, which cannot benefit from the parallelism and distributed computing offered by modern data warehouses. This quickly becomes a problem as you operate on larger datasets. Some data platforms support optimizations for code written using pandas DataFrame API, preventing the need for major refactors. For example, [pandas on PySpark](https://spark.apache.org/docs/latest/api/python/getting_started/quickstart_ps.html) offers support for 95% of pandas functionality, using the same API while still leveraging parallel processing.

:::note ❓ dbt questions
- When developing a new dbt Python model, should we recommend pandas-style syntax for rapid iteration and then refactor?
- Which open source libraries provide compelling abstractions across different data engines and vendor-specific APIs?
- Should dbt attempt to play a longer-term role in standardizing across them?

💬 Discussion: ["Python models: the pandas problem (and a possible solution)"](https://github.com/dbt-labs/dbt-core/discussions/5738)
:::

## Limitations

Python models have capabilities that SQL models do not. They also have some drawbacks compared to SQL models:

- **Time and cost.** Python models are slower to run than SQL models, and the cloud resources that run them can be more expensive. Running Python requires more general-purpose compute. That compute might sometimes live on a separate service or architecture from your SQL models. **However:** We believe that deploying Python models via dbt—with unified lineage, testing, and documentation—is, from a human standpoint, **dramatically** faster and cheaper. By comparison, spinning up separate infrastructure to orchestrate Python transformations in production and different tooling to integrate with dbt is much more time-consuming and expensive.
- **Syntax differences** are even more pronounced. Over the years, dbt has done a lot, via dispatch patterns and packages such as `dbt_utils`, to abstract over differences in SQL dialects across popular data warehouses. Python offers a **much** wider field of play. If there are five ways to do something in SQL, there are 500 ways to write it in Python, all with varying performance and adherence to standards. Those options can be overwhelming. As the maintainers of dbt, we will be learning from state-of-the-art projects tackling this problem and sharing guidance as we develop it.
- **These capabilities are very new.** As data warehouses develop new features, we expect them to offer cheaper, faster, and more intuitive mechanisms for deploying Python transformations. **We reserve the right to change the underlying implementation for executing Python models in future releases.** Our commitment to you is around the code in your model `.py` files, following the documented capabilities and guidance we're providing here.
- **Lack of `print()` support.** The data platform runs and compiles your Python model without dbt's oversight. This means it doesn't display the output of commands such as Python's built-in [`print()`](https://docs.python.org/3/library/functions.html#print) function in dbt's logs.

As a general rule, if there's a transformation you could write equally well in SQL or Python, we believe that well-written SQL is preferable: it's more accessible to a greater number of colleagues, and it's easier to write code that's performant at scale. If there's a transformation you _can't_ write in SQL, or where ten lines of elegant and well-annotated Python could save you 1000 lines of hard-to-read Jinja-SQL, Python is the way to go.

## Specific data platforms {#specific-data-platforms}

In their initial launch, Python models are supported on three of the most popular data platforms: Snowflake, Databricks, and BigQuery/GCP (via Dataproc). Both Databricks and GCP's Dataproc use PySpark as the processing framework. Snowflake uses its own framework, Snowpark, which has many similarities to PySpark.

<WHCode>

<div warehouse="Snowflake">

**Additional setup:** You will need to [acknowledge and accept Snowflake Third Party Terms](https://docs.snowflake.com/en/developer-guide/udf/python/udf-python-packages.html#getting-started) to use Anaconda packages.

**Installing packages:** Snowpark supports several popular packages via Anaconda. Refer to the [complete list](https://repo.anaconda.com/pkgs/snowflake/) for more details. Packages are installed when your model is run. Different models can have different package dependencies. If you use third-party packages, Snowflake recommends using a dedicated virtual warehouse for best performance rather than one with many concurrent users.

**Python version:** To specify a different python version, use the following configuration:
```
def model(dbt, session):
    dbt.config(
        materialized = "table",
        python_version="3.11"
    )
```

<VersionBlock firstVersion="1.8">

**External access integrations and secrets**: To query external APIs within dbt Python models, use Snowflake’s [external access](https://docs.snowflake.com/en/developer-guide/external-network-access/external-network-access-overview) together with [secrets](https://docs.snowflake.com/en/developer-guide/external-network-access/secret-api-reference). Here are some additional configurations you can use:

```
import pandas
import snowflake.snowpark as snowpark

def model(dbt, session: snowpark.Session):
    dbt.config(
        materialized="table",
        secrets={"secret_variable_name": "test_secret"},
        external_access_integrations=["test_external_access_integration"],
    )
    import _snowflake
    return session.create_dataframe(
        pandas.DataFrame(
            [{"secret_value": _snowflake.get_generic_secret_string('secret_variable_name')}]
        )
    )
```

</VersionBlock>

**About "sprocs":** dbt submits Python models to run as _stored procedures_, which some people call _sprocs_ for short. By default, dbt will create a named sproc containing your model's compiled Python code, and then _call_ it to execute. Snowpark has an Open Preview feature for _temporary_ or _anonymous_ stored procedures ([docs](https://docs.snowflake.com/en/sql-reference/sql/call-with.html)), which are faster and leave a cleaner query history. You can switch this feature on for your models by configuring `use_anonymous_sproc: True`. We plan to switch this on for all dbt + Snowpark Python models starting with the release of dbt Core version 1.4.

<File name='dbt_project.yml'>

```yml
# I asked Snowflake Support to enable this Private Preview feature,
# and now my dbt-py models run even faster!
models:
  use_anonymous_sproc: True
```

</File>

**Docs:** ["Developer Guide: Snowpark Python"](https://docs.snowflake.com/en/developer-guide/snowpark/python/index.html)

#### Third-party Snowflake packages

To use a third-party Snowflake package that isn't available in Snowflake Anaconda, upload your package by following [this example](https://docs.snowflake.com/en/developer-guide/udf/python/udf-python-packages#importing-packages-through-a-snowflake-stage), and then configure the `imports` setting in the dbt Python model to reference to the zip file in your Snowflake staging.

Here’s a complete example configuration using a zip file, including using `imports` in a Python model:

```python

def model(dbt, session):
    # Configure the model
    dbt.config(
        materialized="table",
        imports=["@mystage/mycustompackage.zip"],  # Specify the external package location
    )
    
    # Example data transformation using the imported package
    # (Assuming `some_external_package` has a function we can call)
    data = {
        "name": ["Alice", "Bob", "Charlie"],
        "score": [85, 90, 88]
    }
    df = pd.DataFrame(data)

    # Process data with the external package
    df["adjusted_score"] = df["score"].apply(lambda x: some_external_package.adjust_score(x))
    
    # Return the DataFrame as the model output
    return df

```

For more information on using this configuration, refer to [Snowflake's documentation](https://community.snowflake.com/s/article/how-to-use-other-python-packages-in-snowpark) on uploading and using other python packages in Snowpark not published on Snowflake's Anaconda channel.


</div>

<div warehouse="Databricks">

**Submission methods:** Databricks supports a few different mechanisms to submit PySpark code, each with relative advantages. Some are better for supporting iterative development, while others are better for supporting lower-cost production deployments. The options are:
- `all_purpose_cluster` (default): dbt will run your Python model using the cluster ID configured as `cluster` in your connection profile or for this specific model. These clusters are more expensive but also much more responsive. We recommend using an interactive all-purpose cluster for quicker iteration in development.
  - `create_notebook: True`: dbt will upload your model's compiled PySpark code to a notebook in the namespace `/Shared/dbt_python_model/{schema}`, where `{schema}` is the configured schema for the model, and execute that notebook to run using the all-purpose cluster. The appeal of this approach is that you can easily open the notebook in the Databricks UI for debugging or fine-tuning right after running your model. Remember to copy any changes into your dbt `.py` model code before re-running.
  - `create_notebook: False` (default): dbt will use the [Command API](https://docs.databricks.com/dev-tools/api/1.2/index.html#run-a-command), which is slightly faster.
- `job_cluster`: dbt will upload your model's compiled PySpark code to a notebook in the namespace `/Shared/dbt_python_model/{schema}`, where `{schema}` is the configured schema for the model, and execute that notebook to run using a short-lived jobs cluster. For each Python model, Databricks will need to spin up the cluster, execute the model's PySpark transformation, and then spin down the cluster. As such, job clusters take longer before and after model execution, but they're also less expensive, so we recommend these for longer-running Python models in production. To use the `job_cluster` submission method, your model must be configured with `job_cluster_config`, which defines key-value properties for `new_cluster`, as defined in the [JobRunsSubmit API](https://docs.databricks.com/dev-tools/api/latest/jobs.html#operation/JobsRunsSubmit).

You can configure each model's `submission_method` in all the standard ways you supply configuration:

```python
def model(dbt, session):
    dbt.config(
        submission_method="all_purpose_cluster",
        create_notebook=True,
        cluster_id="abcd-1234-wxyz"
    )
    ...
```
```yml
version: 2
models:
  - name: my_python_model
    config:
      submission_method: job_cluster
      job_cluster_config:
        spark_version: ...
        node_type_id: ...
```
```yml
# dbt_project.yml
models:
  project_name:
    subfolder:
      # set defaults for all .py models defined in this subfolder
      +submission_method: all_purpose_cluster
      +create_notebook: False
      +cluster_id: abcd-1234-wxyz
```

If not configured, `dbt-spark` will use the built-in defaults: the all-purpose cluster (based on `cluster` in your connection profile) without creating a notebook. The `dbt-databricks` adapter will default to the cluster configured in `http_path`. We encourage explicitly configuring the clusters for Python models in Databricks projects.

**Installing packages:** When using all-purpose clusters, we recommend installing packages which you will be using to run your Python models.

**Docs:**
- [PySpark DataFrame syntax](https://spark.apache.org/docs/latest/api/python/reference/pyspark.sql/api/pyspark.sql.DataFrame.html)
- [Databricks: Introduction to DataFrames - Python](https://docs.databricks.com/spark/latest/dataframes-datasets/introduction-to-dataframes-python.html)

</div>

<div warehouse="BigQuery">

The `dbt-bigquery` adapter uses a service called Dataproc to submit your Python models as PySpark jobs. That Python/PySpark code will read from your tables and views in BigQuery, perform all computation in Dataproc, and write the final result back to BigQuery.

**Submission methods.** Dataproc supports two submission methods: `serverless` and `cluster`. Dataproc Serverless does not require a ready cluster, which saves on hassle and cost—but it is slower to start up, and much more limited in terms of available configuration. For example, Dataproc Serverless supports only a small set of Python packages, though it does include `pandas`, `numpy`, and `scikit-learn`. (See the full list [here](https://cloud.google.com/dataproc-serverless/docs/guides/custom-containers#example_custom_container_image_build), under "The following packages are installed in the default image"). Whereas, by creating a Dataproc Cluster in advance, you can fine-tune the cluster's configuration, install any PyPI packages you want, and benefit from faster, more responsive runtimes.

Use the `cluster` submission method with dedicated Dataproc clusters you or your organization manage. Use the `serverless` submission method to avoid managing a Spark cluster. The latter may be quicker for getting started, but both are valid for production.

**Additional setup:**
- Create or use an existing [Cloud Storage bucket](https://cloud.google.com/storage/docs/creating-buckets)
- Enable Dataproc APIs for your project + region
- If using the `cluster` submission method: Create or use an existing [Dataproc cluster](https://cloud.google.com/dataproc/docs/guides/create-cluster) with the [Spark BigQuery connector initialization action](https://github.com/GoogleCloudDataproc/initialization-actions/tree/master/connectors#bigquery-connectors). (Google recommends copying the action into your own Cloud Storage bucket, rather than using the example version shown in the screenshot)

<Lightbox src="/img/docs/building-a-dbt-project/building-models/python-models/dataproc-connector-initialization.png" title="Add the Spark BigQuery connector as an initialization action"/>

The following configurations are needed to run Python models on Dataproc. You can add these to your [BigQuery profile](/docs/core/connect-data-platform/bigquery-setup#running-python-models-on-dataproc) or configure them on specific Python models:
- `gcs_bucket`: Storage bucket to which dbt will upload your model's compiled PySpark code.
- `dataproc_region`: GCP region in which you have enabled Dataproc (for example `us-central1`).
- `dataproc_cluster_name`: Name of Dataproc cluster to use for running Python model (executing PySpark job). Only required if `submission_method: cluster`.

```python
def model(dbt, session):
    dbt.config(
        submission_method="cluster",
        dataproc_cluster_name="my-favorite-cluster"
    )
    ...
```
```yml
version: 2
models:
  - name: my_python_model
    config:
      submission_method: serverless
```

Python models running on Dataproc Serverless can be further configured in your [BigQuery profile](/docs/core/connect-data-platform/bigquery-setup#running-python-models-on-dataproc).

Any user or service account that runs dbt Python models will need the following permissions(in addition to the required BigQuery permissions) ([docs](https://cloud.google.com/dataproc/docs/concepts/iam/iam)):
```
dataproc.batches.create
dataproc.clusters.use
dataproc.jobs.create
dataproc.jobs.get
dataproc.operations.get
dataproc.operations.list
storage.buckets.get
storage.objects.create
storage.objects.delete
```

**Installing packages:** If you are using a Dataproc Cluster (as opposed to Dataproc Serverless), you can add third-party packages while creating the cluster.

Google recommends installing Python packages on Dataproc clusters via initialization actions:
- [How initialization actions are used](https://github.com/GoogleCloudDataproc/initialization-actions/blob/master/README.md#how-initialization-actions-are-used)
- [Actions for installing via `pip` or `conda`](https://github.com/GoogleCloudDataproc/initialization-actions/tree/master/python)

You can also install packages at cluster creation time by [defining cluster properties](https://cloud.google.com/dataproc/docs/tutorials/python-configuration#image_version_20): `dataproc:pip.packages` or `dataproc:conda.packages`.

<Lightbox src="/img/docs/building-a-dbt-project/building-models/python-models/dataproc-pip-packages.png" title="Adding packages to install via pip at cluster startup"/>

**Docs:**

- [Dataproc overview](https://cloud.google.com/dataproc/docs/concepts/overview)
- [Create a Dataproc cluster](https://cloud.google.com/dataproc/docs/guides/create-cluster)
- [Create a Cloud Storage bucket](https://cloud.google.com/storage/docs/creating-buckets)
- [PySpark DataFrame syntax](https://spark.apache.org/docs/latest/api/python/reference/pyspark.sql/api/pyspark.sql.DataFrame.html)

</div>

</WHCode>

