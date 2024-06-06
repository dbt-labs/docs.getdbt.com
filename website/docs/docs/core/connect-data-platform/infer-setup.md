---
title: "Infer setup"
description: "Read this guide to learn about the Infer warehouse setup in dbt."
id: "infer-setup"
meta:
  maintained_by: Infer
  authors: Erik Mathiesen-Dreyfus, Ryan Garland
  github_repo: 'inferlabs/dbt-infer'
  pypi_package: 'dbt-infer'
  min_core_version: 'v1.2.0'
  cloud_support: Not Supported
  slack_channel_name: n/a
  slack_channel_link: 
  platform_name: 'Infer'
  config_page: '/reference/resource-configs/infer-configs'
  min_supported_version: n/a
---

:::info Vendor-supported plugin

Certain core functionality may vary. If you would like to report a bug, request a feature, or contribute, you can check out the linked repository and open an issue.

:::

import SetUpPages from '/snippets/_setup-pages-intro.md';

<SetUpPages meta={frontMatter.meta} />


## Connecting to Infer with **dbt-infer**

Infer allows you to perform advanced ML Analytics within SQL as if native to your data warehouse.
To do this Infer uses a variant called SQL-inf, which defines as set of primitive ML commands from which 
you can build advanced analysis for any business use case.
Read more about SQL-inf and Infer in the [Infer documentation](https://docs.getinfer.io/).

The `dbt-infer` package allow you to use SQL-inf easily within your DBT models. 
You can read more about the `dbt-infer` package itself and how it connects to Infer in the [dbt-infer documentation](https://dbt.getinfer.io/).

The dbt-infer adapter is maintained via PyPi and installed with pip.
To install the latest dbt-infer package simply run the following within the same shell as you run dbt.
```python
pip install dbt-infer
```

Versioning of dbt-infer follows the standard dbt versioning scheme - meaning if you are using dbt 1.2 the corresponding dbt-infer will be named 1.2.x where is the latest minor version number.

Before using SQL-inf in your DBT models you need to setup an Infer account and generate an API-key for the connection.
You can read how to do that in the [Getting Started Guide](https://docs.getinfer.io/docs/reference/integrations/dbt).

The profile configuration in `profiles.yml` for `dbt-infer` should look something like this:

<File name='~/.dbt/profiles.yml'>

```yaml
<profile-name>:
  target: <target-name>
  outputs:
    <target-name>:
      type: infer
      url: "<infer-api-endpoint>"
      username: "<infer-api-username>"
      apikey: "<infer-apikey>"
      data_config:
        [configuration for your underlying data warehouse]  
```

</File>

Note that you need to also have installed the adapter package for your underlying data warehouse.
For example, if your data warehouse is BigQuery then you need to also have installed the appropriate `dbt-bigquery` package.
The configuration of this goes into the `data_config` field.

### Description of Infer Profile Fields

| Field      | Required | Description                                                                                                                                       |
|------------|----------|---------------------------------------------------------------------------------------------------------------------------------------------------|
| `type`     | Yes | Must be set to `infer`. This must be included either in `profiles.yml` or in the `dbt_project.yml` file.                                          |
| `url`      | Yes | The host name of the Infer server to connect to. Typically this is `https://app.getinfer.io`.                                                     |
| `username` | Yes | Your Infer username - the one you use to login.                                                                                                   |
| `apikey`   | Yes | Your Infer api key.                                                                                                                               |
| `data_config` | Yes | The configuration for your underlying data warehouse. The format of this follows the format of the configuration for your data warehouse adapter. |


### Example of Infer configuration

To illustrate the above descriptions, here is an example of what a `dbt-infer` configuration might look like.
In this case the underlying data warehouse is BigQuery, which we configure the adapter for inside the `data_config` field.

```yaml
infer_bigquery:
  apikey: 1234567890abcdef
  username: my_name@example.com
  url: https://app.getinfer.io
  type: infer
  data_config:
    dataset: my_dataset
    job_execution_timeout_seconds: 300
    job_retries: 1
    keyfile: bq-user-creds.json
    location: EU
    method: service-account
    priority: interactive
    project: my-bigquery-project
    threads: 1
    type: bigquery
```

## Usage

You do not need to change anything in your existing DBT models when switching to use SQL-inf &#8211;
they will all work the same as before &#8211; but you now have the ability to use SQL-inf commands
as native SQL functions.

Infer supports a number of SQL-inf commands, including 
`PREDICT`, `EXPLAIN`, `CLUSTER`, `SIMILAR_TO`, `TOPICS`, `SENTIMENT`.
You can read more about SQL-inf and the commands it supports in the [SQL-inf Reference Guide](https://docs.getinfer.io/docs/category/commands).

To get you started we will give a brief example here of what such a model might look like.
You can find other more complex examples in the [dbt-infer examples repo](https://github.com/inferlabs/dbt-infer-examples).

In our simple example, we will show how to use a previous model 'user_features' to predict churn
by predicting the column `has_churned`.

```sql title="predict_user_churn.sql"
{{
  config(
    materialized = "table"
  )
}}

with predict_user_churn_input as (
    select * from {{ ref('user_features') }}
)

SELECT * FROM predict_user_churn_input PREDICT(has_churned, ignore=user_id)
```

Not that we ignore `user_id` from the prediction.
This is because we think that the `user_id` might, and should, not influence our prediction of churn, so we remove it.
We also use the convention of pulling together the inputs for our prediction in a CTE, named `predict_user_churn_input`.
