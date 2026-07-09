---
title: "Python model configuration"
sidebar_label: "Python model configuration"
description: "Configure Databricks Python models and choose a PySpark submission method such as all-purpose or job clusters."
---

The Databricks adapter supports Python models. Databricks uses PySpark as the processing framework for these models. 

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

**Related docs:**
- [PySpark DataFrame syntax](https://spark.apache.org/docs/latest/api/python/reference/pyspark.sql/api/pyspark.sql.DataFrame.html)
- [Databricks: Introduction to DataFrames - Python](https://docs.databricks.com/spark/latest/dataframes-datasets/introduction-to-dataframes-python.html)
