---
title: "Snapshots"
sidebar_label: "Snapshots"
description: "Learn how dbt-teradata builds snapshots using the HASHROW function or a custom hash UDF, plus supported grants."
---

Snapshots use the [HASHROW function](https://docs.teradata.com/r/Enterprise_IntelliFlex_VMware/SQL-Functions-Expressions-and-Predicates/Hash-Related-Functions/HASHROW/HASHROW-Function-Syntax) of the Teradata database to generate a unique hash value for the `dbt_scd_id` column. 

To use your own hash UDF, there is a configuration option in the snapshot model called `snapshot_hash_udf`, which defaults to HASHROW. You can provide a value like `<database_name.hash_udf_name>`. If you only provide `hash_udf_name`, it uses the same schema as the model runs.

For example, in the `snapshots/snapshot_example.sql` file:

  ```sql
  {% snapshot snapshot_example %}
  {{
    config(
      target_schema='snapshots',
      unique_key='id',
      strategy='check',
      check_cols=["c2"],
      snapshot_hash_udf='GLOBAL_FUNCTIONS.hash_md5'
    )
  }}
  select * from {{ ref('order_payments') }}
  {% endsnapshot %}
  ```

#### Grants

Grants are supported in dbt-teradata adapter with release version 1.2.0 and above. You can use grants to manage access to the datasets you're producing with dbt. To implement these permissions, define grants as resource configs on each model, seed, or snapshot. Define the default grants that apply to the entire project in your `dbt_project.yml`, and define model-specific grants within each model's SQL or property file.

For example:
  models/schema.yml
  ```yaml
  models:
    - name: model_name
      config:
        grants:
          select: ['user_a', 'user_b']
  ```

Another example for adding multiple grants:

  ```yaml
  models:
  - name: model_name
    config:
      materialized: table
      grants:
        select: ["user_b"]
        insert: ["user_c"]
  ```
> :information_source: `copy_grants` is not supported in Teradata.

Refer to [grants](/reference/resource-configs/grants) for more information on Grants.
