---
title: Python model configurations
sidebar_label: Python model configs
description: "Reference for the parameters you can pass to dbt.config() in Python models, including platform-specific parameters for BigQuery, Databricks, and Snowflake."
meta:
  resource_type: Models
---

import SnowflakePythonParams from '/snippets/_snowflake-python-config-params.md';

Use `dbt.config()` to set configs for a Python model. This page lists the parameters in one place, with links to each platform's full details. For how to write a Python model, refer to [Python models](/docs/build/python-models).

:::note
`dbt.config()` only accepts literal values (strings, booleans, and numbers). For anything more complex, set the config in a [properties YAML file](/reference/resource-properties/config). Refer to [Configuring Python models](/docs/build/python-models#configuring-python-models).
:::

## Common parameters

These work on every platform that supports Python models.

<SimpleTable>
  
| Parameter | Type | Description |
| :-------- | :--- | :---------- |
| [`materialized`](/reference/resource-configs/materialized) | `<string>` | How dbt builds the model, such as `table` or `incremental`. Python models don't support `view`. |
| [`tags`](/reference/resource-configs/tags) | `<list>` | Tags to apply to the model. |
| [`meta`](/reference/resource-configs/meta) | `<dictionary>` | Custom metadata. Read it with `dbt.config.meta_get()`. |
| `packages` | `<list>` | Packages to install, with optional version pins such as `numpy==1.23.1`. Required on some platforms. Refer to [Configuring packages](/docs/build/python-models#configuring-packages). |

</SimpleTable>

Read any config back inside your model with `dbt.config.get()`.

## Platform-specific parameters

<Tabs>

<TabItem value="snowflake" label="Snowflake">

<SnowflakePythonParams />

For more details and comprehensive parameters, refer to [Snowflake configurations](/reference/resource-configs/snowflake-configs#additional-parameters).

</TabItem>

<TabItem value="databricks" label="Databricks">

<SimpleTable>

| Parameter | Type | Default | Description |
| :-------- | :--- | :------ | :---------- |
| `submission_method` | `<string>` | `all_purpose_cluster` | How dbt submits the job: `all_purpose_cluster`, `job_cluster`, `serverless_cluster`, or `workflow_job`. |
| `create_notebook` | `<boolean>` | `false` | With `all_purpose_cluster`, upload a notebook and run it as a job instead of using the Command API. |
| `cluster_id` | `<string>` | `None` | ID of an existing all-purpose cluster to run on. |
| `http_path` | `<string>` | `None` | Path of an existing all-purpose cluster to run on. |
| `job_cluster_config` | `<dictionary>` | `{}` | Settings for the new cluster used by `job_cluster` and `workflow_job`. |
| `timeout` | `<integer>` | `0` (no timeout) | Maximum time to wait for the command or job to run. |
| `packages` | `<list>` | `[]` | Packages to install on the cluster. |
| `index_url` | `<string>` | `None` (uses PyPI) | URL to install `packages` from. |
| `additional_libs` | `<list>` | `[]` | Libraries to attach to the job. |
| `access_control_list` | `<list>` | none | Access control for the job. |
| `python_job_config` | `<dictionary>` | `{}` | Extra job and workflow settings. |

</SimpleTable>


Not every parameter works with every submission method. For more details and comprehensive parameters, refer to [Databricks configurations](/reference/resource-configs/databricks-configs#python-submission-methods).

</TabItem>

<TabItem value="bigquery" label="BigQuery">

<SimpleTable>

| Parameter | Type | Default | Description |
| :-------- | :--- | :------ | :---------- |
| `submission_method` | `<string>` | none | Where the job runs: `serverless`, `bigframes`, or `cluster`. |
| `dataproc_cluster_name` | `<string>` | none | Dataproc cluster to run on. Required for `cluster`. |
| `dataproc_region` | `<string>` | none | Google Cloud region where Dataproc is enabled. |
| `gcs_bucket` | `<string>` | none | Cloud Storage bucket for job artifacts. |
| `compute_region` | `<string>` | none | Region of the job. |
| `notebook_template_id` | `<integer>` | none | Colab Enterprise runtime template. |
| `packages` | `<list>` | none | Packages to `pip install`. `bigframes` only. |
| `timeout` | `<integer>` | none | Maximum run time in seconds. |
| `enable_list_inference` | `<boolean>` | `True` | Let PySpark read multiple records in one operation. |
| `intermediate_format` | `<string>` | `parquet` | File format for intermediate writes: `parquet` or `orc`. |

</SimpleTable>


For more details and comprehensive parameters, refer to [BigQuery configurations](/reference/resource-configs/bigquery-configs#additional-parameters).

</TabItem>

</Tabs>
