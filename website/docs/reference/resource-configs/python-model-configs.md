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

| Parameter | Type | Description |
| :-------- | :--- | :---------- |
| [`materialized`](/reference/resource-configs/materialized) | `<string>` | How dbt builds the model, such as `table` or `incremental`. Python models don't support `view`. |
| [`tags`](/reference/resource-configs/tags) | `<list>` | Tags to apply to the model. |
| [`meta`](/reference/resource-configs/meta) | `<dictionary>` | Custom metadata. Read it with `dbt.config.meta_get()`. |
| `packages` | `<list>` | Packages to install, with optional version pins such as `numpy==1.23.1`. Required on some platforms. Refer to [Configuring packages](/docs/build/python-models#configuring-packages). |

Read any config back inside your model with `dbt.config.get()`.

## Platform-specific parameters

<Tabs>

<TabItem value="snowflake" label="Snowflake">

<SnowflakePythonParams />

Full details: [Snowflake configurations](/reference/resource-configs/snowflake-configs#additional-parameters).

</TabItem>

<TabItem value="databricks" label="Databricks">

Databricks parameters depend on your `submission_method` (`all_purpose_cluster`, `job_cluster`, `serverless_cluster`, or `workflow_job`). Common ones include `create_notebook`, `cluster_id`, `job_cluster_config`, `timeout`, and `python_job_config`.

Not every parameter works with every submission method. For the full list and support matrix, refer to [Databricks configurations](/reference/resource-configs/databricks-configs#python-submission-methods).

</TabItem>

<TabItem value="bigquery" label="BigQuery">

BigQuery parameters depend on your `submission_method` (`serverless`, `bigframes`, or `cluster`). Common ones include `gcs_bucket`, `dataproc_region`, `dataproc_cluster_name`, `packages` (`bigframes` only), and `timeout`.

For the full list with defaults and valid values, refer to [BigQuery configurations](/reference/resource-configs/bigquery-configs#additional-parameters).

</TabItem>

</Tabs>
