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

- The database where the object is created will be the database configured at the [environment level in dbt Cloud](https://docs.getdbt.com/docs/dbt-cloud-environments), or in the `profiles.yml` in dbt Core.

- Tgit he schema depends on whether a [custom schema](https://docs.getdbt.com/docs/build/custom-schemas) has been defined for the model:
    - If no custom schema is defined, the schema where the object is created is the schema that has been configured in dbt Cloud (`dbt_username` for Dev and the configured default schema for any Deployment environment) ; or the schema in the `profiles.yml` in dbt Core.
        - Note: Automated CI jobs are a specific case, where the schema name is derived from the job number and PR number: `dbt_cloud_pr_<job_id>_<pr_id>`
    - If a custom schema has been defined, it will concatenate the schema from above with the custom one.
        - For example e.g. if the configured schema is `dbt_myschema` and the custom one is `marketing`, the objects will be created under `dbt_myschema_marketing`
- the object name depends on whether an [alias](https://docs.getdbt.com/reference/resource-configs/alias) has been defined on the model:
    - If no alias is defined, the object will be created with the same name as the model, without the `.sql` or `.py` at the end.
    - If an alias is defined, the object will be created with the configured alias.

Those default rules are a great starting point, and many people stick with those without customizing them.

It allows developers to work in their own sandboxed schemas and makes it possible to have different feature requests updating the same models without conflicting with one another.


## How to customize this behavior

While the default behavior would fit the needs of most dbt users, there are occasions where the approach doesn’t fit with the existing Data Warehouse governance and design.

For example, dbt expects that it has the rights to create a schema on the fly **quickly** (and we recommend that the users running dbt have this ability), but it might not be allowed at your company.

Or, you might have many custom schemas and want to avoid having your Dev database showing the combination of all developer schemas and custom schemas.

Or, you mightAlternatively, you may even want to create models in schemas based on the feature branch name in development rather than the developer name.

For this reason, dbt offers three macros to customize what objects are created in the Data Warehouse:

- [`generate_database_name()`](https://docs.getdbt.com/docs/build/custom-databases#generate_database_name)
- [`generate_schema_name()`](https://docs.getdbt.com/docs/build/custom-schemas#how-does-dbt-generate-a-models-schema-name)
- [`generate_alias_name()`](https://docs.getdbt.com/docs/build/custom-aliases#generate_alias_name)

By overwriting one or multiple of those macros, we can tailor where dbt objects are created in the Data Warehouse and align with any existing requirement.

:::caution Key concept

The key concept is that models run from two different contexts (For example running by developer 1 or by developer 2; or running by developer 1 and running in Prod) need to result in different objects in the data warehouse to avoid people overriding each others models

:::


When those macros are customized, we often leverage some of the following logic:

- Set up some [environment variables](https://docs.getdbt.com/docs/build/environment-variables) and having some Jinja (`if/else/endif` ) logic to identify if the run happens in Dev, Prod, CI etc…
    - Or as an alternative to environment variables, you can use `target.name` ([documentation here](https://docs.getdbt.com/reference/dbt-jinja-functions/target)). In dbt Cloud, we recommend environment variables as they can be set at the environment and all jobs will automatically inherit those values.


    <Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/Environment Variables/custom-schema-env-var.png" width="70%" title="Environmental variables"/>
    

</div>