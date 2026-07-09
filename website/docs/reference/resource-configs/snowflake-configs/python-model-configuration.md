---
title: "Python model configuration"
sidebar_label: "Python model configuration"
description: "Configure Python Snowpark models on Snowflake, including Python version, package installation, external access, and imports."
---

The Snowflake adapter supports Python models. Snowflake uses its own framework, Snowpark, which has many similarities to PySpark.

**Additional setup:** You will need to [acknowledge and accept Snowflake Third Party Terms](https://docs.snowflake.com/en/developer-guide/udf/python/udf-python-packages.html#getting-started) to use Anaconda packages.

**Installing packages:** Snowpark supports several popular packages via Anaconda. Refer to the [complete list](https://repo.anaconda.com/pkgs/snowflake/) for more details. Packages are installed when your model is run. Different models can have different package dependencies. If you use third-party packages, Snowflake recommends using a dedicated virtual warehouse for best performance rather than one with many concurrent users.

**Python version:** To specify a different Python version, use the following configuration:

```python
def model(dbt, session):
    dbt.config(
        materialized = "table",
        python_version="3.11"
    )
```

You can use the `python_version` config to run a Snowpark model with [Python versions](https://docs.snowflake.com/en/developer-guide/snowpark/python/setup) 3.9, 3.10, or 3.11.


**External access integrations and secrets**: To query external APIs within dbt Python models, use Snowflake’s [external access](https://docs.snowflake.com/en/developer-guide/external-network-access/external-network-access-overview) together with [secrets](https://docs.snowflake.com/en/developer-guide/external-network-access/secret-api-reference). Here are some additional configurations you can use:

```python
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

**Docs:** ["Developer Guide: Snowpark Python"](https://docs.snowflake.com/en/developer-guide/snowpark/python/index.html)

### Third-party Snowflake packages

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
