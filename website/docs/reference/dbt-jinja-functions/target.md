---
title: "target"
id: "target"
---

`target` contains information about your connection to the warehouse (specified in `profiles.yml`). Some configs are shared between all adapters, while others are adapter-specific.

### Common

| Variable | Example | Description |
| -------- | ------- | ----------- |
| {{target.profile_name}} | jaffle_shop | The name of the active profile |
| {{target.name}} | dev | Name of the active target |
| {{target.schema}} | dbt_alice | Name of the dbt schema (or, dataset on BigQuery) |
| {{target.type}} | postgres | The active adapter being used. One of "postgres", "snowflake", "bigquery", "redshift" |
| {{target.threads}} | 4 | The number of threads in use by dbt |


### Snowflake

| Variable | Example | Description |
| -------- | ------- | ----------- |
| {{target.database}} | RAW | Database name specified in active target. |
| {{target.warehouse}} | TRANSFORM | Name of the Snowflake virtual warehouse |
| {{target.user}} | TRANSFORM_USER | The user specified in the active target |
| {{target.role}} | TRANSFORM_ROLE | The role specified in the active target |
| {{target.account}} | abc123 | The account specified in the active target |

### Postgres/Redshift

| Variable | Example | Description |
| -------- | ------- | ----------- |
| {{target.dbname}} | analytics | Database name specified in active target. |
| {{target.host}} | abc123.us-west-2.redshift.amazonaws.com | The host specified in active target |
| {{target.user}} | dbt_user | The user specified in the active target |
| {{target.port}} | 5439 | The port specified in the active profile |

### BigQuery

| Variable | Example | Description |
| -------- | ------- | ----------- |
| {{target.project}} | abc-123 | The project specified in the active profile |
