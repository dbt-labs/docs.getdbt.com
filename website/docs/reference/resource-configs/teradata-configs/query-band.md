---
title: "Query band"
sidebar_label: "Query band"
description: "Set the query_band in dbt-teradata at the profile, project, or model level to tag sessions for telemetry and logging."
---

Query band in dbt-teradata can be set on three levels:
1. Profiles level: In the `profiles.yml` file, the user can provide `query_band` using the following example:

    ```yaml 
    query_band: 'application=dbt;'
   ```

2. Project level: In the `dbt_project.yml` file, the user can provide `query_band` using the following example:

   ```yaml
     models:
     Project_name:
        +query_band: "app=dbt;model={model};"
   ```
4. Model level: It can be set on the model SQL file or model level configuration on YAML files:

   ```sql
   {{ config( query_band='sql={model};' ) }}
   ```

Users can set `query_band` at any level or on all levels. With profiles-level `query_band`, dbt-teradata will set the `query_band` for the first time for the session, and subsequently for model and project level query band will be updated with respective configuration.

If a user sets some key-value pair with value as `'{model}'`, internally this `'{model}'` will be replaced with model name, which can be useful for telemetry tracking of sql/ dbql logging. 

  ```yaml
  models:
  Project_name:
    +query_band: "app=dbt;model={model};"
  ````

- For example, if the model the user is running is `stg_orders`, `{model}` will be replaced with `stg_orders` in runtime.
- If no `query_band` is set by the user, the default query_band used will be: ```org=teradata-internal-telem;appname=dbt;```
