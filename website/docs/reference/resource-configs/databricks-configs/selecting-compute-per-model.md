---
title: "Selecting compute per model"
sidebar_label: "Selecting compute per model"
description: "Assign a specific SQL warehouse or cluster to individual Databricks models using the databricks_compute config."
---

Beginning in version 1.7.2, you can assign which compute resource to use on a per-model basis.
For SQL models, you can select a SQL Warehouse (serverless or provisioned) or an all purpose cluster.
For details on how this feature interacts with python models, see [Specifying compute for Python models](/reference/resource-configs/databricks-configs/selecting-compute-per-model#specifying-compute-for-python-models).

:::note

This is an optional setting. If you do not configure this as shown below,  we will default to the compute specified by http_path in the top level of the output section in your profile. 
This is also the compute that will be used for tasks not associated with a particular model, such as gathering metadata for all tables in a schema.

:::


To take advantage of this capability, you will need to add compute blocks to your profile:

<File name='profiles.yml'>

```yaml

profile-name:
  target: target-name # this is the default target
  outputs:
    target-name:
      type: databricks
      catalog: optional catalog name if you are using Unity Catalog
      schema: schema name # Required        
      host: yourorg.databrickshost.com # Required

      ### This path is used as the default compute
      http_path: /sql/your/http/path # Required        
      
      ### New compute section
      compute:

        ### Name that you will use to refer to an alternate compute
       Compute1:
          http_path: '/sql/your/http/path' # Required of each alternate compute

        ### A third named compute, use whatever name you like
        Compute2:
          http_path: '/some/other/path' # Required of each alternate compute
      ...

    target-name: # additional targets
      ...
      ### For each target, you need to define the same compute,
      ### but you can specify different paths
      compute:

        ### Name that you will use to refer to an alternate compute
        Compute1:
          http_path: '/sql/your/http/path' # Required of each alternate compute

        ### A third named compute, use whatever name you like
        Compute2:
          http_path: '/some/other/path' # Required of each alternate compute
      ...

```

</File>

The new compute section is a map of user chosen names to objects with an http_path property.
Each compute is keyed by a name which is used in the model definition/configuration to indicate which compute you wish to use for that model/selection of models. 
We recommend choosing a name that is easily recognized as the compute resources you're using, such as the name of the compute resource inside the Databricks UI. 

:::note

You need to use the same set of names for compute across your outputs, though you may supply different http_paths, allowing you to use different computes in different deployment scenarios.

:::

To configure this inside of <Constant name="dbt" />, use the [extended attributes feature](/docs/dbt-platform-environments#extended-attributes) on the desired environments:

```yaml

compute:
  Compute1:
    http_path: /SOME/OTHER/PATH
  Compute2:
    http_path: /SOME/OTHER/PATH

```

### Specifying the compute for models

As with many other configuration options, you can specify the compute for a model in multiple ways, using `databricks_compute`.
In your `dbt_project.yml`, the selected compute can be specified for all the models in a given directory:

<File name='dbt_project.yml'>

```yaml

...

models:
  +databricks_compute: "Compute1"     # use the `Compute1` warehouse/cluster for all models in the project...
  my_project:
    clickstream:
      +databricks_compute: "Compute2" # ...except for the models in the `clickstream` folder, which will use `Compute2`.

snapshots:
  +databricks_compute: "Compute1"     # all Snapshot models are configured to use `Compute1`.

```

</File>

For an individual model the compute can be specified in the model config in your schema file.

<File name='schema.yml'>

```yaml

models:
  - name: table_model
    config:
      databricks_compute: Compute1
    columns:
      - name: id
        data_type: int

```

</File>


Alternatively the warehouse can be specified in the config of a model's SQL file.

<File name='model.sql'>

```sql

{{
  config(
    materialized='table',
    databricks_compute='Compute1'
  )
}}
select * from {{ ref('seed') }}

```

</File>


To validate that the specified compute is being used, look for lines in your dbt.log like:

```
Databricks adapter ... using default compute resource.
```

or

```
Databricks adapter ... using compute resource <name of compute>.
```

### Specifying compute for Python models

Materializing a python model requires execution of SQL as well as python.
Specifically, if your python model is incremental, the current execution pattern involves executing python to create a staging table that is then merged into your target table using SQL.
The python code needs to run on an all purpose cluster (or serverless cluster, see [Python Submission Methods](/reference/resource-configs/databricks-configs/configuring-tables#python-submission-methods)), while the SQL code can run on an all purpose cluster or a SQL Warehouse.

When you specify your `databricks_compute` for a python model, you are currently only specifying which compute to use when running the model-specific SQL.
If you wish to use a different compute for executing the python itself, you must specify an alternate compute in the config for the model.
For example:

<File name="model.py">

 ```python

def model(dbt, session):
    dbt.config(
      http_path="sql/protocolv1/..."
    )

```

</File>

If your default compute is a SQL Warehouse, you will need to specify an all purpose cluster `http_path` in this way.
