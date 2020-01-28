---
title: What privileges does my database user need to use dbt?
---
Your user will need to be able to:
* `select` from raw data in your warehouse (i.e. data to be transformed)
* `create` schemas (and therefore create tables/views within that
schema), OR the ability to `create` within an existing schema.
* read system views to generate documentation (i.e. views in
`information_schema`)

On Postgres, Redshift, and Snowflake, use a series of `grants` to ensure that
your user has the correct privileges.

On BigQuery, use the "BigQuery User" role to assign these privileges.
