---
title: "Layer Profile"
---


## Overview of dbt-layer
**Maintained by:** Layer      
**Authors:** Mehmet Ecevit  
**Source:** [Github](https://github.com/layerai/dbt-layer)  
**Core version:** `v1.0` and newer      
**dbt Cloud:** Not Supported      
**dbt Slack channel** [#db-layer](https://slack.com)

[![dbt-synapse stars](https://img.shields.io/github/stars/layerai/dbt-adapters?style=for-the-badge)](https://github.com/layerai/dbt-adapters)
[![latest version on PyPI](https://img.shields.io/pypi/v/dbt-layer-bigquery?style=for-the-badge)](https://pypi.org/project/dbt-layer-bigquery)

To immediately start using Layer inside your dbt DAG, install the Layer dbt Adapter for BigQuery.

```
pip install dbt-layer-bigquery
```

You don't need to install dbt separately. Installing `dbt-layer` will also install `dbt-core` and `dbt-bigquery`.


### Profile Configuration

Layer Bigquery targets should be set up using the following sections in your `profiles.yml` file.
#### Layer Authentication
Add your `layer_api_key` to your `profiles.yaml` to authenticate with Layer. To get your Layer API Key:
- First, [create your free Layer account](https://app.layer.ai/login?returnTo=%2Fgetting-started).
- Go to [app.layer.ai](https://app.layer.ai) > **Settings** (Cog Icon by your profile photo) > **Developer** > **Create API key** to get your Layer API Key.

#### Bigquery Authentication
You can use any [authentication method](https://docs.getdbt.com/reference/warehouse-profiles/bigquery-profile) supported in the official dbt Bigquery adapter since Layer uses `dbt-bigquery` adapter to connect to your Bigquery instance. 


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


