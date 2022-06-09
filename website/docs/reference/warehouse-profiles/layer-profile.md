---
title: "Layer Profile"
---


## Overview of dbt-layer
**Maintained by:** Layer      
**Authors:** Mehmet Ecevit  
**Source:** [Github](https://github.com/layerai/dbt-layer)  
**Core version:** v0.1 and newer      
**dbt Cloud:** Not Supported      

To immediately start using Layer inside your dbt DAG, install the Layer dbt Adapter for BigQuery.

```
pip install dbt-layer-bigquery -U
```

You don't need to install dbt separately. Installing `dbt-layer` will also install `dbt-core` and `dbt-bigquery`?


### Connecting to Layer with **dbt-layer**

#### Username / password authentication

Add the Layer dbt Adapter to your BigQuery profile. An example profile:

##### Layer connection information
<File name='profiles.yml'>

```yaml
layer-profile:
  target: dev
  outputs:
    dev:
      type: layer_bigquery
      method: service-account
      project: [GCP project id]
      dataset: [the name of your dbt dataset]
      threads: [1 or more]
      keyfile: [/path/to/bigquery/keyfile.json]
      layer_project: [the Layer project to use for model training (opt)]
      layer_api_key: [the API Key to access your Layer account (opt)]
```

</File>

### Use Layer in dbt DAG Example
Now, start making predictions directly in your dbt DAG:
```sql
select id,
       review,
       layer.predict("layer/nlptown/models/sentimentanalysis", ARRAY[review])
from {{ref('reviews')}}
```
