---
title: "MindsDB Profile"
---

:::info Vendor-supported plugin

The dbt-mindsdb package allows dbt to connect to [MindsDB](https://github.com/mindsdb/mindsdb).

## Overview of dbt-tidb

**Maintained by:** MindsDB      
**Author:** MindsDB team 
**Source:** https://github.com/mindsdb/dbt-mindsdb   
**Core version:** v1.0.1 and newer   
**dbt Cloud:** Not Supported

## Installation

```
pip install dbt-mindsdb
```

## Configurations

Basic `profile.yml` for connecting to MindsDB:

```yml
mindsdb:
  outputs:
    dev:
      database: 'mindsdb'
      host: '127.0.0.1'
      password: ''
      port: 47335
      schema: 'mindsdb'
      type: mindsdb
      username: 'mindsdb'
  target: dev

```
| Key      | Required | Description                                          | Example                        |
| -------- | -------- | ---------------------------------------------------- | ------------------------------ |
| type     |    ✔️   | The specific adapter to use                          | `mindsdb`                      |
| host     |    ✔️   | The MindsDB (hostname) to connect to                 | `cloud.mindsdb.com`            |
| port     |    ✔️   | The port to use                                      | `3306`  or `47335`             |
| schema   |    ✔️   | Specify the schema (database) to build models into   | The MindsDB datasource         |
| username |    ✔️   | The username to use to connect to the server         | `mindsdb` or mindsdb cloud user|
| password |    ✔️   | The password to use for authenticating to the server | `pass                          |

## Usage

- Create dbt project, choose mindsdb database and set up connection
```    
    dbt init <project_name>
```
- To create predictor add dbt model with "predictor" materialization: 
Name of the model is used as name of predictor.
Parameters:
  - integration - name of used integration to get data from and save result to.
    In has to be created in mindsdb beforehand
  - predict - field for prediction
  - predict_alias [optional] - alias for predicted field
  - using [optional] - options for configure trained model
```    
    {{
        config(
            materialized='predictor',
            integration='photorep',
            predict='name',
            predict_alias='name',
            using={
                'encoders.location.module': 'CategoricalAutoEncoder',
                'encoders.rental_price.module': 'NumericEncoder'
            }
        )
    }}
      select * from stores
```

- To apply predictor add dbt model with "table" materialization. 
It creates or replaces table in selected integration with results of predictor.
Name of the model is used as name of the table to store prediction results. 
If you need to specify schema you can do it with dot separator: schema_name.table_name.sql    
Parameters:
  - predictor_name - name of using predictor.
    It has to be created in mindsdb
  - integration - name of used integration to get data from and save result to.
    In has to be created in mindsdb beforehand
```    
    {{ config(materialized='table', predictor_name='TEST_PREDICTOR_NAME', integration='int1') }}
        select a, bc from ddd where name > latest
```

## Testing

- Install dev requirements
