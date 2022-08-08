---
title: "Layer Profile"
---

## Overview of dbt-layer

**Maintained by:** [Layer](https://layer.ai)
**Authors:** [Layer](https://layer.ai)
**Source:** [Github](https://github.com/layerai/dbt-layer)
**Core version:** `v1.2` and newer
**dbt Cloud:** Not Supported
**dbt Slack channel** [#tools-layer](https://slack.com)

[![dbt-layer stars](https://img.shields.io/github/stars/layerai/dbt-adapters?style=for-the-badge)](https://github.com/layerai/dbt-layer)
[![latest version on PyPI](https://img.shields.io/pypi/v/dbt-layer?style=for-the-badge)](https://pypi.org/project/dbt-layer)

To start using Layer inside your dbt DAG, get a Layer API key and install the Layer dbt Adapter for your warehouse:

```
pip install dbt-layer[<warehouse>]
```

## Setup

### Layer

To access Layer, you will need a Layer API key. To get this:

- First, [create your free Layer account](https://app.layer.ai/login?returnTo=%2Fgetting-started).
- Go to [app.layer.ai](https://app.layer.ai) > **Settings** (Cog Icon by your profile photo) > **Developer** > **Create API key**

Add this as the `layer_api_key` in your `profiles.yaml`.

## Setup Your Warehouse

Once you have Layer set up, choose one of the following supported warehouses:

### BigQuery

To install BigQuery support, install `dbt-layer` with:

```
pip install dbt-layer[bigquery]
```

You don't need to install `dbt-bigquery` separately. Installing `dbt-layer[bigquery]` will also install `dbt-bigquery`.

#### Authentication

You can use any [authentication method](https://docs.getdbt.com/reference/warehouse-profiles/bigquery-profile) supported in the official dbt BigQuery adapter since Layer uses `dbt-bigquery` adapter to connect to your BigQuery instance.

A sample profile:

<File name='~/.dbt/profiles.yml'>

```yaml
layer-profile:
  target: dev
  outputs:
    dev:
      type: layer_bigquery
      # Layer configuration
      layer_api_key: [the API Key to access your Layer account (opt)]
      # BigQuery configuration
      method: service-account
      project: [GCP project id]
      dataset: [the name of your dbt dataset]
      threads: [1 or more]
      keyfile: [/path/to/bigquery/keyfile.json]
```

</File>

#### Description of Layer BigQuery Profile Fields

The following fields are used by Layer:

| Parameter       | Default | Type         | Description                                                                                                                                                                                                                            |
| --------------- | ------- | ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `type`          |         | string       | Specifies the adapter you want to use. It should be `layer_bigquery`.                                                                                                                                                                  |
| `layer_api_key` |         | string (opt) | Specifies your Layer API key. If you want to make predictions with public ML models from Layer, you don't need to have this key in your profile. It's required if you load ML models from your Layer account or train an AutoML model. |
| `layer_project` |         | string (opt) | Specifies your target Layer project. If you don't specify, Layer will use the same project name with your dbt project.                                                                                                                 |

The rest of the parameters are documented on the [BigQuery adapter page](https://docs.getdbt.com/reference/warehouse-profiles/bigquery-profile).

## Usage

### AutoML

You can automatically build state-of-the-art ML models using your own dbt models with plain SQL. To train an AutoML model all you have to do is pass your model type, input data (features) and a target column you want to predict to `layer.automl()` in your SQL. The Layer AutoML will pick the best performing model and enable you to call it by its dbt model name to make predictions as shown above.

_Syntax:_

```
layer.automl("MODEL_TYPE", ARRAY[FEATURES], TARGET)
```

_Parameters:_

| Syntax       | Description                                                                                                                                                                                                                                |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `MODEL_TYPE` | Type of the model you want to train. There are two options: <br/> - `classifier`: A model to predict classes/labels or categories such as spam detection<br/>- `regressor`: A model to predict continuous outcomes such as CLV prediction. |
| `FEATURES`   | Input column names as a list to train your AutoML model.                                                                                                                                                                                   |
| `TARGET`     | Target column that you want to predict.                                                                                                                                                                                                    |

_Requirements:_

- You need to provide the `layer_api_key` in your dbt profile to make AutoML work.

_Example:_

Check out our [Order Review AutoML](https://github.com/layerai/dbt-layer/tree/main/examples/order_review_prediction) example project:

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

You can make predictions using any Layer ML model within your dbt models. The Layer dbt Adapter helps you score your data where it resides on your warehouse, within your dbt DAG, with SQL!

_Syntax:_

```
layer.predict("layer_model_path", ARRAY[features])
```

_Parameters:_

| Syntax             | Description                                                                                                                                                                                              |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `layer_model_path` | This is the Layer model path in form of `/[organization_name]/[project_name]/models/[model_name]:[tag]`. You can use only the model name if you want to use an AutoML model within the same dbt project. |
| `features`         | These are the columns that this model requires to make a prediction. You should pass the columns as a list like `ARRAY[column1, column2, column3]`.                                                      |

_Example:_

Check out our [Cloth Detection](https://github.com/layerai/dbt-layer/tree/main/examples/cloth_detector) example project:

```sql
SELECT
    id,
    layer.predict("layer/clothing/models/objectdetection", ARRAY[image])
FROM
    {{ ref("products") }}
```
