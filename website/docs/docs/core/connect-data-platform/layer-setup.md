---
title: "Layer setup"
description: "Read this guide to learn about the Layer warehouse setup in dbt."
id: "layer-setup"
meta:
  maintained_by: Layer
  authors: 'Mehmet Ecevit'
  github_repo: 'layerai/dbt-layer'
  pypi_package: 'dbt-layer-bigquery'
  min_core_version: 'v1.0.0'
  cloud_support: Not Supported
  min_supported_version: 'n/a'
  slack_channel_name: '#tools-layer'
  slack_channel_link: 'https://getdbt.slack.com/archives/C03STA39TFE'
  platform_name: 'Layer'
  config_page: '/reference/resource-configs/no-configs'
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

<code>python -m pip install {frontMatter.meta.pypi_package}</code>

<p>Installing <code>{frontMatter.meta.pypi_package}</code> will also install <code>dbt-core</code> and any other dependencies.</p>

<h2> Configuring {frontMatter.meta.pypi_package} </h2>

<p>For {frontMatter.meta.platform_name}-specifc configuration please refer to <a href={frontMatter.meta.config_page}>{frontMatter.meta.platform_name} Configuration</a> </p>

<p>For further info, refer to the GitHub repository: <a href={`https://github.com/${frontMatter.meta.github_repo}`}>{frontMatter.meta.github_repo}</a></p>

### Profile Configuration

Layer Bigquery targets should be set up using the following sections in your `profiles.yml` file.
#### Layer Authentication
Add your `layer_api_key` to your `profiles.yaml` to authenticate with Layer. To get your Layer API Key:
- First, [create your free Layer account](https://app.layer.ai/login?returnTo=%2Fgetting-started).
- Go to [app.layer.ai](https://app.layer.ai) > **Settings** (Cog Icon by your profile photo) > **Developer** > **Create API key** to get your Layer API Key.

#### Bigquery Authentication
You can use any [authentication method](https://docs.getdbt.com/reference/warehouse-profiles/bigquery-setup) supported in the official dbt Bigquery adapter since Layer uses `dbt-bigquery` adapter to connect to your Bigquery instance. 


A sample profile:

<File name='profiles.yml'>

```yaml
layer-profile:
  target: dev
  outputs:
    dev:
      # Layer authentication
      type: layer_bigquery
      layer_api_key: [the API Key to access your Layer account (opt)]
      # Bigquery authentication
      method: service-account
      project: [GCP project id]
      dataset: [the name of your dbt dataset]
      threads: [1 or more]
      keyfile: [/path/to/bigquery/keyfile.json]
```

</File>

#### Description of Layer Bigquery Profile Fields

The following fields are required:

Parameter               | Default     | Type         | Description
----------------------- | ----------- |--------------| ---
`type`                  |             | string       | Specifies the adapter you want to use. It should be `layer_bigquery`.
`layer_api_key`         |             | string (opt) | Specifies your Layer API key. If you want to make predictions with public ML models from Layer, you don't need to have this key in your profile. It's required if you load ML models from your Layer account or train an AutoML model.
`layer_project`         |             | string (opt) | Specifies your target Layer project. If you don't specify, Layer will use the project same name with your dbt project.
`method`              |             | string       | Specifies the authentication type to connect to your BigQuery.

Rest of the parameters depends on the BigQuery authentication method you specified.

## Usage

### AutoML

You can automatically build state-of-art ML models using your own dbt models with plain SQL. To train an AutoML model all you have to do is pass your model type, input data (features) and target column you want to predict to `layer.automl()` in your SQL. The Layer AutoML will pick the best performing model and enable you to call it by its dbt model name to make predictions as shown above. 

_Syntax:_
```
layer.automl("MODEL_TYPE", ARRAY[FEATURES], TARGET)
```

_Parameters:_

| Syntax    | Description                                                                                                                                                                                                                                 |
| --------- |---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `MODEL_TYPE`    | Type of the model your want to train. There are two options: <br/> - `classifier`: A model to predict classes/labels or categories such as spam detection<br/>- `regressor`: A model to predict continious outcomes such as CLV prediction. |
| `FEATURES`    | Input column names as a list to train your AutoML model.                                                                                                                                                                                    |
| `TARGET`    | Target column that you want to predict.                                                                                                                                                                                                     |


_Requirements:_
- You need to put `layer_api_key` to your dbt profile to make AutoML work.

_Example:_

Check out [Order Review AutoML Project](https://github.com/layerai/dbt-layer/tree/mecevit/update-docs/examples/order_review_prediction):

```sql
SELECT order_id,
       layer.automl(
           -- This is a regression problem
           'regressor',
           -- Data (input features) to train our model
           ARRAY[
           days_between_purchase_and_delivery, order_approved_late,
           actual_delivery_vs_expectation_bucket, total_order_price, total_order_freight, is_multiItems_order,seller_shipped_late],
           -- Target column we want to predict
           review_score
       )
FROM {{ ref('training_data') }}
```

### Prediction

You can make predictions using any Layer ML model within your dbt models. Layer dbt Adapter helps you score your data resides on your warehouse within your dbt DAG with SQL.

_Syntax:_
```
layer.predict("LAYER_MODEL_PATH", ARRAY[FEATURES])
```

_Parameters:_

| Syntax    | Description                                                                                                                                                                                        |
| --------- |----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `LAYER_MODEL_PATH`      | This is the Layer model path in form of `/[organization_name]/[project_name]/models/[model_name]`. You can use only the model name if you want to use an AutoML model within the same dbt project. |
| `FEATURES` | These are the columns that this model requires to make a prediction. You should pass the columns as a list like `ARRAY[column1, column2, column3]`.                                                |

_Example:_

Check out [Cloth Detection Project](https://github.com/layerai/dbt-layer/tree/mecevit/update-docs/examples/cloth_detector):

```sql
SELECT
    id,
    layer.predict("layer/clothing/models/objectdetection", ARRAY[image])
FROM
    {{ ref("products") }}
```


