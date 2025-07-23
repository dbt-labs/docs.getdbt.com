---
title: "How to train a linear regression model with dbt and BigFrames"
description: "How to build a scalable linear regression model by combining dbt's modular orchestration with BigFrames' in-database Python execution in BigQuery."
slug: train-linear-dbt-bigframes
authors: [jialuo_chen]

tags: [analytics craft]
hide_table_of_contents: false

date: 2025-07-11
is_featured: true
---

## Introduction to dbt and BigFrames

**dbt**: A framework for transforming data in modern data warehouses using modular SQL or Python. dbt enables data teams to develop analytics code collaboratively and efficiently by applying software engineering best practices such as version control, modularity, portability, CI/CD, testing, and documentation. For more information, refer to [What is dbt?](/docs/introduction#dbt)

**BigQuery DataFrames (BigFrames)**: An open-source Python library offered by Google. BigFrames scales Python data processing by transpiling common Python data science APIs (pandas and scikit-learn) to BigQuery SQL.  

You can read more in the [official BigFrames guide](https://cloud.google.com/bigquery/docs/bigquery-dataframes-introduction) and view the [public BigFrames GitHub repository](https://github.com/googleapis/python-bigquery-dataframes).

By combining dbt with BigFrames via the `dbt-bigquery` adapter (referred to as _"dbt-BigFrames"_), you gain:

- dbt’s modular SQL and Python modeling, dependency management with dbt.ref(), environment configurations, and data testing. With the cloud-based dbt platform, you also get job scheduling and monitoring.
- BigFrames’ ability to execute complex Python transformations (including machine learning) directly in BigQuery.

`dbt-BigFrames` utilizes the **Colab Enterprise notebook executor service** in a GCP project to run Python models. These notebooks execute BigFrames code, which is translated into BigQuery SQL.

<!-- truncate -->

> Refer to the [BigFrames guide](https://cloud.google.com/bigquery/docs/bigframes-intro) or [dbt guides](/guides) to learn more.

To illustrate the practical impact of combining dbt with BigFrames, the following sections explore how this integration can streamline and scale a common machine learning task: training a linear regression model on large datasets.

## The power of dbt-BigFrames for large-scale linear regression

Linear regression is a cornerstone of predictive analytics, used in:

- Sales forecasting  
- Financial modeling  
- Demand planning  
- Real estate valuation

These tasks often require processing datasets too large for traditional in-memory Python. BigFrames alone solves this, but combining it with dbt offers a structured, maintainable, and production-ready way to train models or generate batch predictions on large data.

## “dbt-BigFrames” with ML: A practical example

We’ll walk through training a linear regression model using a **dbt Python model powered by BigFrames**, focusing on the structure and orchestration provided by dbt.

We’ll use the `epa_historical_air_quality` dataset from BigQuery Public Data (courtesy of the U.S. Environmental Protection Agency).

### Problem statement

Develop a machine learning model to predict atmospheric ozone levels using historical air quality and environmental sensor data, enabling more accurate monitoring and forecasting of air pollution trends.

**Key stages:**

1. **Data Foundation**: Transform raw source tables into an analysis-ready dataset.
2. **Machine learning Analysis**: Train a linear regression model on the cleaned data.

## Setting up your dbt project for BigFrames

### Prerequisites

- A Google Cloud account  
- A dbt platform or Core setup  
- Basic to intermediate SQL and Python  
- Familiarity with dbt using [Beginner dbt guides](/guides?level=Beginner)

### Sample `profiles.yml` for BigFrames

```yaml
my_epa_project:
  outputs:
    dev:
      compute_region: us-central1
      dataset: your_bq_dataset
      gcs_bucket: your_gcs_bucket
      location: US
      method: oauth
      priority: interactive
      project: your_gcp_project
      threads: 1
      type: bigquery
  target: dev
```

### Sample `dbt_project.yml`

```yaml
name: 'my_epa_project'
version: '1.0.0'
config-version: 2

models:
  my_epa_project:
    submission_method: bigframes
    notebook_template_id: 701881164074529xxxx  # Optional
    timeout: 6000
    example:
      +materialized: view
```

## The dbt Python models for linear regression

This project uses **two modular dbt Python models**:

1. `prepare_table.py` &mdash; Ingests and prepares data
2. `prediction.py` &mdash; Trains the model and generates predictions

### Part 1: Preparing the table (`prepare_table.py`)

```python
def model(dbt, session):
    dbt.config(submission_method="bigframes", timeout=6000)

    dataset = "bigquery-public-data.epa_historical_air_quality"
    index_columns = ["state_name", "county_name", "site_num", "date_local", "time_local"]
    param_column = "parameter_name"
    value_column = "sample_measurement"
    params_dfs = []

    table_param_dict = {
        "co_hourly_summary": "co",
        "no2_hourly_summary": "no2",
        "o3_hourly_summary": "o3",
        "pressure_hourly_summary": "pressure",
        "so2_hourly_summary": "so2",
        "temperature_hourly_summary": "temperature",
    }

    for table, param in table_param_dict.items():
        param_df = bpd.read_gbq(f"{dataset}.{table}", columns=index_columns + [value_column])
        param_df = param_df.sort_values(index_columns).drop_duplicates(index_columns).set_index(index_columns).rename(columns={value_column: param})
        params_dfs.append(param_df)

    wind_table = f"{dataset}.wind_hourly_summary"
    wind_speed_df = bpd.read_gbq(
        wind_table,
        columns=index_columns + [value_column],
        filters=[(param_column, "==", "Wind Speed - Resultant")]
    )
    wind_speed_df = wind_speed_df.sort_values(index_columns).drop_duplicates(index_columns).set_index(index_columns).rename(columns={value_column: "wind_speed"})
    params_dfs.append(wind_speed_df)

    df = bpd.concat(params_dfs, axis=1, join="inner").cache()
    return df.reset_index()
```

### Part 2: Training the model and making predictions (`prediction.py`)

```python
def model(dbt, session):
    dbt.config(submission_method="bigframes", timeout=6000)

    df = dbt.ref("prepare_table")

    train_data_filter = (df.date_local.dt.year < 2017)
    test_data_filter = (df.date_local.dt.year >= 2017) & (df.date_local.dt.year < 2020)
    predict_data_filter = (df.date_local.dt.year >= 2020)

    index_columns = ["state_name", "county_name", "site_num", "date_local", "time_local"]
    df_train = df[train_data_filter].set_index(index_columns)
    df_test = df[test_data_filter].set_index(index_columns)
    df_predict = df[predict_data_filter].set_index(index_columns)

    X_train, y_train = df_train.drop(columns="o3"), df_train["o3"]
    X_test, y_test = df_test.drop(columns="o3"), df_test["o3"]
    X_predict = df_predict.drop(columns="o3")

    from bigframes.ml.linear_model import LinearRegression
    model = LinearRegression()
    model.fit(X_train, y_train)
    df_pred = model.predict(X_predict)

    return df_pred
```

## Running your dbt ML pipeline

```bash
# Run all models
dbt run

# Or run just your new models
dbt run --select prepare_table prediction
```

## Key advantages of dbt and BigFrames for ML

- **Scalability & Efficiency**: Handle large datasets in BigQuery via BigFrames  
- **Simplified Workflow**: Use familiar APIs like `pandas` and `scikit-learn`  
- **dbt Orchestration**:
  - Dependency management with `dbt.ref()` and `dbt.source()`
  - Scheduled retraining with `dbt run`
  - Testing, documentation, and reproducibility

## Conclusion and next steps

By integrating **BigFrames** into your **dbt workflows**, you can build scalable, maintainable, and production-ready machine learning pipelines. While this example used linear regression, the same principles apply across other ML use cases with `bigframes.ml`.

## Feedback and support

- 📚 [dbt Support](/docs/dbt-support)  
- 📨 Email feedback on BigFrames: [bigframes-feedback@google.com](mailto:bigframes-feedback@google.com)
- 🛠 [File issues on GitHub](https://github.com/googleapis/python-bigquery-dataframes)  
- 📬 [Subscribe to BigFrames updates](https://docs.google.com/forms/d/10EnDyYdYUW9HvelHYuBRC8L3GdGVl3rX0aroinbRZyc/viewform?edit_requested=true)
