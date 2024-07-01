---
title: Customize schema and alias
id: customize-schema-alias
description: "How to properly adjust your generate_schema_name() and generate_alias_name() macros.."
# time_to_complete: '30 minutes' commenting out until we test
icon: 'guides'
hide_table_of_contents: true
level: 'Advanced'
recently_updated: true
---

<div style={{maxWidth: '900px'}}>

## Introduction

When we develop dbt models and run or build them, objects get created in the data warehouse.

In the rest of the article, for consistency, when we refer to database, it would refer to a Google Cloud Platform  project or to a Databricks catalog.

The default behavior of what object is created is the following:

- the database where the object is created will be the database configured at the [environment level in dbt Cloud](https://docs.getdbt.com/docs/dbt-cloud-environments), or in the `profiles.yml` in dbt Core .

- the schema depends on whether a [custom schema](https://docs.getdbt.com/docs/build/custom-schemas) has been defined for the model:
    - if no custom schema is defined, the schema where the object is created is the schema that has been configured in dbt Cloud (`dbt_username` for Dev and the configured default schema for any Deployment environment) ; or the schema in the `profiles.yml` in dbt Core.
        - Note: Automated CI jobs are a specific case, where the schema name is derived from the job number and PR number: `dbt_cloud_pr_<job_id>_<pr_id>`
    - if a custom schema has been defined, it will concatenate the schema from above with the custom one.
        - For example e.g. if the configured schema is `dbt_myschema` and the custom one is `marketing`, the objects will be created under `dbt_myschema_marketing`
- the object name depends on whether an [alias](https://docs.getdbt.com/reference/resource-configs/alias) has been defined on the model:
    - if no alias is defined, the object will be created with the same name as the model, without the `.sql` or `.py` at the end.
    - if an alias is defined, the object will be created with the configured alias.

Those default rules are a great starting point, and many people stick with those without customizing them.

It allows developers to work in their own sandboxed schemas and makes it possible to have different feature requests updating the same models without conflicting with one another.

</div>