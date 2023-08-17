---
title: What privileges does my database user need to use dbt?
description: "Database privileges to use dbt"
sidebar_label: 'Database privileges to use dbt'
id: database-privileges

---
Your user will need to be able to:
* `select` from raw data in your warehouse (i.e. data to be transformed)
* `create` schemas, and therefore create tables/views within that
schema¹
* read system <Term id="view">views</Term> to generate documentation (i.e. views in
`information_schema`)

On Postgres, Redshift, Databricks, and Snowflake, use a series of `grants` to ensure that
your user has the correct privileges. Check out [example permissions](/reference/database-permissions/snowflake-permissions) for these warehouses.

On BigQuery, use the "BigQuery User" role to assign these privileges.

---
¹Alternatively, a separate user can create a schema for the dbt user, and then grant the user privileges to create within this schema. We generally recommend granting your dbt user the ability to create schemas, as it is less complicated to implement.
