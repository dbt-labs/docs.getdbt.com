---
title: "Salesforce Data Cloud configurations"
description: "Salesforce Data Cloud Configurations - Read this in-depth guide to learn about configurations in dbt."
id: "data-cloud-configs"
---

:::warning Disclaimer
This adapter is in the Alpha product stage and is not production-ready. It should only be used in sandbox or test environments. 

As we continue to develop and take in your feedback, the experience is subject to change &mdash; commands, configuration, and workflows may be updated or removed in future releases. 
:::


## Supported materializations

| Materialization | Supported | Notes |
| --- | --- | --- |
| View | ❌ |  |
| Table | ✅ |Creates a batch data transform and a Data Lake Object (DLO)|
| Incremental | ❌ | Coming soon |
| Ephemeral | ❌ |  |
| Seeds | ❌ |  |
| Sources | ✅ | Required |
| Custom data tests | ❌ |  |
| Snapshots | ❌ |  |


### Sources

For models that query raw Data Cloud data, reference the table though a dbt source. Selecting a DLO directly is not supported.

For example:

```yml
sources:
  - name: default
    tables:
      - name: raw_customers__dll
        description: "Customers raw table stored in default dataspace"   
        columns:
          - name: id__c 
            description: "Customer ID"
            data_tests:
              - not_null
              - unique
          - name: first_name__c
            description: "Customer first name"
          - name: last_name__c
            description: "Customer last name"
          - name: email__c
            description: "Customer email address"
            data_tests:
              - not_null
              - unique
```                

### Table materialization 

dbt <Constant name="fusion" /> supports Table materialization on Salesforce Data Cloud. Execution of the materialization results in the creation of a [batch data transform](https://help.salesforce.com/s/articleView?id=data.c360_a_batch_transform_overview.htm&language=en_US&type=5) and a [Data Lake Object (DLO)](https://developer.salesforce.com/docs/atlas.en-us.object_reference.meta/object_reference/sforce_api_concepts_data_cloud_objects.htm) for querying. 

Currently, only the `profile` type DLO is supported. Support for `engagement` DLOs is coming soon. Profile DLOs must define a `primary_key` in the model config. For example:

```sql
{{ config(
    materialized='table',
    primary_key='customer_id__c',
    category='Profile'
) }}

   select

        id__c as customer_id__c,
        first_name__c,
        last_name__c,
        email__c as customer_email__c

    from {{ source('default', 'raw_customers__dll') }}

```

## Naming rules and required configs

- All dbt model names must end with `__dll`. If you omit this suffix in your file name, it is appended automatically during execution (for example, `model_name` becomes `model_name__dll`). This will break downstream dbt references because dbt will look for a DLO named `model_name` when Data Cloud has `model_name__dll`. 
- Columns must end with `__c`. Omitting the suffix causes a Data Cloud “unknown syntax” error.
- Model names cannot contain double under scores (`__`) outside of the final `__dll`. For example, `supplies__agg__dll` will build as `agg__dll`, which can cause confusion for downstream refs.
- All dbt models must be configured with `primary_key` and `category='Profile'` in the model configuration. You can also apply the configurations in the `resources.yml` and `dbt_project.yml`. 

## Known limitations

- **Reruns of dbt models**: Due to the Data Cloud architecture of metadata and dependency management, dbt cannot rerun the same model if a data transform and a DLO already exist. This is because dbt can't drop the DLO during subsequent runs of table materializations, as expected in data warehouses. If you change your logic between runs, you have to delete the dependencies of the data transform and DLO manually in the UI before executing a `dbtf run`. A fix is in progress. 
- **Static analysis in VS Code**: Column-level lineage and dbt buttons (`Build` and `Test`) are affected. You can either turn off static analysis temporarily by running all commands with `--static-analysis off` or set up your environment variables with `DBT_STATIC_ANALYSIS=off`.
- **Arbitrary queries** (for example, `SELECT 1 AS foo`): All queries must be tied to a defined dbt source before building a dbt model on it.
- **`select *`** Metadata queries may fail because Data Cloud injects system columns into every DLO. Bug fix is in progress.