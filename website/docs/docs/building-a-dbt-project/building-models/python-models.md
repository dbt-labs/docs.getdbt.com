---
title: "Python models"
---

:::info Beta

This feature is arriving in dbt Core v1.3, which is currently in beta. Note that only [specific data warehouses](#specific-data-warehouses) support dbt Python models.

We encourage you to:
- Read [the discussion](https://github.com/dbt-labs/dbt-core/discussions/5261)
- Join the **#beta-feedback-python-models** channel in the [dbt Community Slack](https://www.getdbt.com/community/join-the-community/)

Below, you'll see sections entitled "Our questions." We're working to develop our opinionated recommendations ahead of the final release this October—and you can help!
:::

## What is a Python model in dbt?

A dbt Python model is a function that reads in dbt sources or models, applies a series of transformations, and returns a transformed dataset. Just like SQL models!

Unlike SQL models, which return a `select` statement, each Python model returns a single <Term id="dataframe">data frame</Term>. When you run a Python model, the result of that data frame will be saved as a table in your data warehouse.

Each Python model lives in a `.py` file in your `models/` folder. It defines a function named **`model()`**, which has two parameters:
- **`dbt`**: A class compiled by dbt Core, unique to each model, that enables you to run your Python code in the context of your dbt project and DAG.
- **`session`**: A class representing the connection to the backing engine, which allows you to interact with the data platform. The session is needed to read in tables as data frames, and to write data frames back to tables. In PySpark, by convention, the `SparkSession` is named `spark`, and available globally. For consistency across platforms, we always pass it into the `model` function as an explicit argument named `session`.
- returns: a data frame (Snowpark, PySpark, or Pandas)

dbt Python models have access to almost all of the same configuration options as SQL models. You can test them, document them, add `tags` and `meta` properties to them, persist their descriptions as database comments, grant access on their results to other users, and so on. You can select them by their name, their file path, their configurations, whether they are upstream or downstream of another model, or whether they have been modified compared to a previous project state.

### Referencing other models
Your Python model will want to read data from other models (SQL or Python) or sources. Do this using the `dbt.ref()` function. The same idea applies for raw source tables, via `dbt.source()`. Those functions return data frames, pointing to the upstream source, model, seed, or snapshot. 

<File name='models/my_python_model.py'>

```python
def model(dbt, session):
  
    # data frame representing an upstream model
    upstream_model = dbt.ref("upstream_model_name")
    
    # data frame representing an upstream source
    upstream_source = dbt.source("upstream_source_name", "table_name")
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

### Configuring Python models

Just like SQL models, there are three ways to configure Python models:
1. In `dbt_project.yml`, where you can configure many models at once
2. In a dedicated `.yml` file, within the `models/` directory
3. Within the model's `.py` file, using the `dbt.config()` function

The `dbt.config()` function allows you to set configurations for your model within your Python file:

<File name='models/my_python_model.py'>

```python
def model(dbt, session):
    
    # setting configuration
    dbt.config(materialized="table")
```

</File>

The `config()` function accepts _only_ literal values (strings, booleans, and numeric types). It is not possible to pass another function or more complex data structure. The reason: dbt statically analyzes the arguments to `config()` while parsing your model, without actually executing any of your Python code.

Python models have limited access to project context, including inputs such as `var`, `env_var`, and `target`. If you want to use those values to power conditional logic in your model, we recommend passing them through a dedicated `.yml` file config instead:

<File name='models/config.yml'>

```yml
version: 2

models:
  - name: my_python_model
    config:
      materialized: table
      target_name: "{{ target.name }}"
      specific_env_var: "{{ env_var('SPECIFIC_ENV_VAR') }}"
```

</File>

Then, use the `dbt.config.get()` function to _access_ values of configurations that have been set:

<File name='models/my_python_model.py'>

```python
def model(dbt, session):
    ...
    target_name = dbt.config.get("target_name")
    orders_df = dbt.ref("fct_orders")
    
    # limit data in dev
    if target_name == "dev":
        orders_df = orders_df.limit(500)
```

</File>

### Materializations

Python models support two materializations:
- `table`
- `incremental`

For incremental models, like SQL models, you will need to filter incoming tables to only new rows of data:

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

**Note:** Incremental models are not yet supported on BigQuery.

## Python-specific functionality

### Defining functions

In addition to defining a `model` function, the Python model can import other functions or define its own. Here's an example, on Snowpark, defining a custom `add_one` function:

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

### Using PyPI packages

You can also define functions that depend on installed packages. In this example, we use the `holidays` package to determine if a given date fell on a holiday in France. For simplicity and consistency across platforms, the code uses the Pandas API—it would need to be refactored for scale.

<File name='models/my_python_model.py'>

```python
import holidays
import pandas

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
    
    # convert to pandas + lowercase all column names
    # (uppercase by default on Snowflake)
    df = orders_df.to_pandas()
    df.columns= df.columns.str.lower()
    
    # apply our function
    df["is_holiday"] = df["order_date"].apply(is_holiday)
    
    # return final dataset
    return df
```

</File>

#### Configuring packages

We encourage you to explicitly configure required packages and versions, so that dbt can track them in project metadata. This configuration is required for the implementation on some platforms. If you need specific versions of packages, specify them.

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

#### UDFs

You can use the `@udf` decorator or `udf` function to define an "anonymous" function, and call it within your `model` function's dataframe transformation. This is a common pattern for applying more complex functions as data frame operations, especially if those functions require inputs from third-party packages.
- [Snowpark Python: Creating UDFs](https://docs.snowflake.com/en/developer-guide/snowpark/python/creating-udfs.html)
- ["PySpark functions: udf"](https://spark.apache.org/docs/latest/api/python/reference/pyspark.sql/api/pyspark.sql.functions.udf.html)

:::info ❔ Our questions
The process of creating and registering a "named" UDF is different across data platforms. Snowpark also supports ["vectorized" UDFs](https://docs.snowflake.com/en/developer-guide/udf/python/udf-python-batch.html): Pandas-like functions that can be executed in parallel.

- Should dbt have a role in abstracting over UDFs? Should dbt support a new type of DAG node, `function`?
- Is the primary motivation for code reuse across Python models, or defining Python-language functions that can be called from SQL models?
:::

### Data frame API + syntax

Over the past decade, most people writing data transformations in Python have adopted <Term id="dataframe">data frame</Term> as their common abstraction. dbt follows this convention by returning `ref()` and `source()` as data frames, and it expects all Python models to return a data frame.

A data frame is a two dimensional data structure (rows and columns). It supports convenient methods for transforming that data, creating new columns from calculations performed on existing columns. It also offers convenient methods for previewing data while developing locally or in a notebook.

That's about where the agreement ends. There are numerous frameworks with their own syntaxes and APIs for data frames. The [Pandas](https://pandas.pydata.org/docs/) library offered one of the original data frame APIs, and its syntax is the most common to learn for new data professionals. Most newer data frame APIs offer some degree of compatibility with Pandas-style syntax, though few can offer perfect interoperability. This is true for both Snowpark and PySpark, which have their own DataFrame APIs.

When developing a Python model, you will find yourself asking these questions:

**Why Pandas?** The most common API for data frames. Makes it easy to explore sampled data and develop transformations locally. For small datasets, you can "promote" your code as-is into dbt models, and run in production.

**Why _not_ Pandas?** Performance. Pandas runs "single-node" transformations, which cannot benefit from the parallelism and distributed compute offered by modern data warehouses. This quickly becomes a problem as you operate on larger datasets. Some data platforms do support optimizations for code written using Pandas' data frame API, preventing the need for major refactors. For example, ["Pandas on PySpark"](https://spark.apache.org/docs/latest/api/python/getting_started/quickstart_ps.html) offers support for 95% of Pandas functionality using the same API.

:::info ❔ Our questions
When developing a new dbt Python model, should we recommend Pandas-style syntax for rapid iteration, and then refactor? Which open source libraries provide compelling abstractions across different data engines and vendor-specific APIs? Should dbt attempt to play a longer-term role in standardizing across them?
:::

### Limitations

Python models have capabilities that SQL models do not. They also have some drawbacks compared to SQL models:
- **Time and cost.** Python models are slower to run than SQL models, and the cloud resources that run them can be more expensive. Running Python requires more general-purpose compute, and in some cases that compute may live on a separate service or architecture from your SQL models. However, we believe that deploying Python models via dbt is **dramatically** faster and cheaper than spinning up separate tooling and infrastructure to orchestrate Python transformations in production.
- **Syntax differences** are even more pronounced. Over the years, dbt has done a lot, via dispatch patterns and packages such as `dbt_utils`, to abstract over differences in SQL dialects across popular data warehouses. Python offers a **much** wider field of play. If there are 5 ways to do something in SQL, there are 500 ways to write it in Python, all with varying performance and adherence to standards. Those options can be overwhelming. As the maintainers of dbt, we will be learning from state-of-the-art projects that are tackling this problem, and sharing opinionated guidance as we develop it.
- **These capabilities are very new.** As data warehouses release new features, we reserve the right to change the underlying implementation for executing Python models. Our commitment to you is around the code in your Python models, following the guidance above, rather than specific implementation details.

As a general rule, if there's a transformation you could write equally well in SQL or in Python, we believe that well-written SQL is preferable: it's more accessible to a greater number of colleagues, and it's easier to write code that's performant at scale.

## Specific data warehouses

Currently, Python models are supported for users of `dbt-snowflake`, `dbt-spark` (Databricks), and `dbt-bigquery`.

<WHCode>

<div warehouse="Snowflake">

**Additional setup:** None needed. Snowpark Python is in Public Preview - Open, and enabled by default for all accounts.

**Installing packages:** Snowpark supports a number of popular packages via Anaconda. The full list is at https://repo.anaconda.com/pkgs/snowflake/. Packages are installed at the time your model is being run. Different models can have different package dependencies. If you are using third-party packages, for better performance, Snowflake recommends using a dedicated virtual warehouse, rather than one that's likely to have many concurrent users.

**Docs:** ["Developer Guide: Snowpark Python"](https://docs.snowflake.com/en/developer-guide/snowpark/python/index.html)

</div>

<div warehouse="Databricks">

**Additional setup:** The `user` field in the `dbt-spark` profile, usually optional, is required for Python modeling.

**Note:** Python models will be created and run as notebooks in your Databricks workspace. The notebooks will be created within the personal workspace of the `user` running dbt.

**Installing packages:** We recommend configuring packages on the interactive cluster which you will be using to run your Python models.

**Docs:**
- [PySpark dataframe syntax](https://spark.apache.org/docs/latest/api/python/reference/pyspark.sql/api/pyspark.sql.DataFrame.html)
- [Databricks: Introduction to DataFrames - Python](https://docs.databricks.com/spark/latest/dataframes-datasets/introduction-to-dataframes-python.html)

</div>

<div warehouse="BigQuery">

The `dbt-bigquery` uses a service called Dataproc to submit your Python models as PySpark jobs. That Python/PySpark code will read from your tables and views in BigQuery, and saves its final result back to BigQuery.

**Additional setup:**
- Create or use an existing Dataproc cluster: https://cloud.google.com/dataproc/docs/guides/create-cluster
- Create or use an existing Cloud Storage bucket: https://cloud.google.com/storage/docs/creating-buckets

Add these attributes to your BigQuery profile:
- `gcs_bucket`
- `dataproc_region`
- `dataproc_cluster_name`

The user or service account running dbt needs the following permissions, in addition to **BigQuery User** ([docs](https://cloud.google.com/dataproc/docs/concepts/iam/iam)):
- Dataproc Worker / Dataproc Editor
- Editor (GCP project)
- Storage Object Creator

**Installing packages:** Google recommends installing Python packages on Dataproc clusters via initialization actions:
- ["How initialization actions are used"](https://github.com/GoogleCloudDataproc/initialization-actions/blob/master/README.md#how-initialization-actions-are-used)
- [Actions for installing via `pip` or `conda`](https://github.com/GoogleCloudDataproc/initialization-actions/tree/master/python)

**Docs:**
- [Dataproc overview](https://cloud.google.com/dataproc/docs/concepts/overview)
- [PySpark dataframe syntax](https://spark.apache.org/docs/latest/api/python/reference/pyspark.sql/api/pyspark.sql.DataFrame.html)

</div>

</WHCode>
