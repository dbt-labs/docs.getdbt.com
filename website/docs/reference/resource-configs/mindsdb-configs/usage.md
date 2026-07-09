---
title: "Usage"
sidebar_label: "Usage"
description: "Learn how to set up a dbt project with MindsDB and create predictor models to generate and apply predictions."
---

Create dbt project, choose mindsdb as the database and set up the connection. Verify your connection works `dbt debug`

`dbt init <project_name>`

To create a predictor, create a dbt model with a "predictor" materialization. The name of the model will be the name of predictor.

#### Parameters:
- `integration` - name of used integration to get data from and save result to. Must be created in mindsdb beforehand using the [`CREATE DATABASE` syntax](https://docs.mindsdb.com/sql/create/databases/).
- `predict` - field for prediction
- `predict_alias` [optional] - alias for predicted field
- `using` [optional] - options for configure trained model

```sql
-- my_first_model.sql    
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

To apply predictor add dbt model with "table" materialization. It creates or replaces table in selected integration with results of predictor.
Name of the model is used as name of the table to store prediction results.
If you need to specify schema you can do it with dot separator: schema_name.table_name.sql  

#### Parameters
- `predictor_name` - name of the predictor. It has to be created in mindsdb.
- `integration` - name of used integration to get data from and save result to. Must be created in mindsdb beforehand using the [`CREATE DATABASE` syntax](https://docs.mindsdb.com/sql/create/databases/).

```    
    {{ config(materialized='table', predictor_name='TEST_PREDICTOR_NAME', integration='photorep') }}
        select a, bc from ddd where name > latest
```
