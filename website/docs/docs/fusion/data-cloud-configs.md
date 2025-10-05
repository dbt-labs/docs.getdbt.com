---
title: "Salesforce Data Cloud configurations"
description: "Salesforce Data Cloud Configurations - Read this in-depth guide to learn about configurations in dbt."
id: "data-cloud-configs"
---

## Materializations
dbt supports the Table materialization on Salesforce Data Cloud. Excuation of the materialization will result in the creation of a Data Transform and a DLO for querying. 

Coming soon: Incremental materializations, dataspace declaration, creation of engagement DLOs

## Salesforce Data Cloud Callouts
- All dbt Models must end with __dll. If you omit this suffix, it will be appended automatically during execution (e.g., model_name becomes model_name__dll), but downstream dbt references will fail because dbt requires the full DLO name in Data Cloud in order to query it. 
- Columns must end with __c. If you omit this suffix, Data Cloud will error out with an “unknown syntax” error message. 
Model names cannot contain __ outside of the final __dll. For example, supplies__agg__dll will build as agg__dll, which can cause confusion for downstream refs.
- For category=profile, all dbt models must be configured with `primary_key` and `category=profile` in the model configuration. You can also apply the configurations in a resources.yml and dbt_project.yml. 

## Known Limitations
- Subsequent executions of `dbt run` on the same dbt model. This is in progress of resolution with `auto-update` support on Data Cloud
- dbt Seeds
- Unsupported Materializations: View, Materialized Views, Incremental, Ephemeral
- Static Analysis on VS Code (Related Column-level lineage, dbt Buttons for build.run.test)
- dbt docs generate & serve
- Arbitrary queries (e.g., SELECT 1 AS foo)
- `select *` 







