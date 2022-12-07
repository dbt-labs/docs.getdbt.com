---
title: "Infer setup"
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
  config_page: 'no-configs'
  min_supported_version: n/a
---

<h2> Overview of {frontMatter.meta.pypi_package} </h2>

<ul>
    <li><strong>Maintained by</strong>: {frontMatter.meta.maintained_by}</li>
    <li><strong>Authors</strong>: {frontMatter.meta.authors}</li>
    <li><strong>GitHub repo</strong>: <a href={`https://github.com/${frontMatter.meta.github_repo}`}>{frontMatter.meta.github_repo}</a><a href={`https://github.com/${frontMatter.meta.github_repo}`}><img src={`https://img.shields.io/github/stars/${frontMatter.meta.github_repo}?style=for-the-badge`}/></a></li>
    <li><strong>PyPI package</strong>: <code>{frontMatter.meta.pypi_package}</code> <a href={`https://badge.fury.io/py/${frontMatter.meta.pypi_package}`}><img src={`https://badge.fury.io/py/${frontMatter.meta.pypi_package}.svg`}/></a></li>
    <li><strong>Slack channel</strong>: <a href={frontMatter.meta.slack_channel_link}>{frontMatter.meta.slack_channel_name}</a></li>
    <li><strong>Supported dbt Core version</strong>: {frontMatter.meta.min_core_version} and newer</li>
    <li><strong>dbt Cloud support</strong>: {frontMatter.meta.cloud_support}</li>
    <li><strong>Minimum data platform version</strong>: {frontMatter.meta.min_supported_version}</li>
    </ul>


<h2> Installing {frontMatter.meta.pypi_package} </h2>

pip is the easiest way to install the adapter:

<code>pip install {frontMatter.meta.pypi_package}</code>

<p>Installing <code>{frontMatter.meta.pypi_package}</code> will also install <code>dbt-core</code> and any other dependencies.</p>

<h2> Configuring {frontMatter.meta.pypi_package} </h2>

<p>For further info, refer to the GitHub repository: <a href={`https://github.com/${frontMatter.meta.github_repo}`}>{frontMatter.meta.github_repo}</a></p>


## Connecting to Infer with **dbt-infer**

Infer allows you to perform advanced ML Analytics within SQL as if native to your data warehouse.
To do this Infer uses a variant called <a href="https://docs.getinfer.io/docs/reference">SQL-inf</a> 
which defines as set of primitive ML commands from which 
you can build advanced analysis for any business use case.
Learn more about SQL-inf and Infer <a href="https://docs.getinfer.io/">here</a>.

The `dbt-infer` package allow you to use SQL-inf easily within your DBT models. 
You can read more about the `dbt-infer` package <a href="https://dbt.getinfer.io/">here</a>.

Before using SQL-inf in your DBT models you need to setup an Infer account and generate an API-key for the connection.
You can read how to do that <a href="https://dbt.getinfer.io/docs/getting_started#sign-up-to-infer">here</a>.

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

### Description of Infer Profile Fields

| Field      | Required | Description                                                                                             |
|------------|----------|---------------------------------------------------------------------------------------------------------|
| `type`     | Yes | Must be set to `infer`. This must be included either in `profiles.yml` or in the `dbt_project.yml` file. |
| `url`      | Yes | The host name of the Infer server to connect to. Typically this is `https://app.getinfer.io`.     |
| `username` | Yes | Your Infer username - the one you use to login.                                                         |
| `apikey`   | Yes | Your Infer api key.                                                                                     |
| `data_config` | Yes | The configuration for your underlying data warehouse.                                                   |


## Usage

You do not need to change anything in your existing DBT models when switching to use SQL-inf &#8211;
they will all work the same as before &#8211; but you now have the ability to use SQL-inf commands
as native SQL functions.

Infer supports a number of SQL-inf commands, including 
`PREDICT`, `EXPLAIN`, `CLUSTER`, `SIMILAR_TO`, `TOPICS`, `SENTIMENT`.
You can read more about SQL-inf and the commands it supports <a href="https://docs.getinfer.io/docs/reference">here</a>

To get you started we will give a brief example here of what such a model might look like.
You can find other more complex examples on the [Examples](https://dbt.getinfer.io/docs/examples) 
section of [dbt.getinfer.io](https://dbt.getinfer.io).

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
