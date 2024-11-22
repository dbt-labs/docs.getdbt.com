---
title: "About target variables"
sidebar_label: "target"
id: "target"
description: "The `target` variable contains information about your connection to the warehouse."
---

The `target` variable contains information about your connection to the warehouse.

- **dbt Core:** These values are based on the target defined in your [profiles.yml](/docs/core/connect-data-platform/profiles.yml) file. Please note that for certain adapters, additional configuration steps may be required. Refer to the [set up page](/docs/core/connect-data-platform/about-core-connections) for your data platform.
- **dbt Cloud** To learn more about setting up your adapter in dbt Cloud, refer to [About data platform connections](/docs/cloud/connect-data-platform/about-connections).
   - **[dbt Cloud Scheduler](/docs/deploy/job-scheduler)**: `target.name` is defined per job as described in [Custom target names](/docs/build/custom-target-names). For other attributes, values are defined by the deployment connection. To check these values, click **Deploy** and select **Environments**. Then, select the relevant deployment environment, and click **Settings**.
   - **[dbt Cloud IDE](/docs/cloud/dbt-cloud-ide/develop-in-the-cloud)**: These values are defined by your connection and credentials. To edit these values, click on your account name in the left side menu and select **Account settings**. Then, click **Credentials**. Select and edit a project to set up the credentials and target name.

Some configurations are shared between all adapters, while others are adapter-specific.

## Common
| Variable | Example | Description |
| -------- | ------- | ----------- |
| `target.profile_name` | jaffle_shop | The name of the active profile |
| `target.name` | dev | Name of the active target |
| `target.schema` | dbt_alice | Name of the dbt schema (or, dataset on BigQuery) |
| `target.type` | postgres | The active adapter being used. One of "postgres", "snowflake", "bigquery", "redshift", "databricks" |
| `target.threads` | 4 | The number of threads in use by dbt |


## Adapter-specific
### Snowflake

| Variable | Example | Description |
| -------- | ------- | ----------- |
| `target.database` | RAW | Database name specified in active target. |
| `target.warehouse` | TRANSFORM | Name of the Snowflake virtual warehouse |
| `target.user` | TRANSFORM_USER | The user specified in the active target |
| `target.role` | TRANSFORM_ROLE | The role specified in the active target |
| `target.account` | abc123 | The account specified in the active target |

### Postgres/Redshift

| Variable | Example | Description |
| -------- | ------- | ----------- |
| `target.dbname` | analytics | Database name specified in active target. |
| `target.host` | abc123.us-west-2.redshift.amazonaws.com | The host specified in active target |
| `target.user` | dbt_user | The user specified in the active target |
| `target.port` | 5439 | The port specified in the active profile |

### BigQuery

| Variable | Example | Description |
| -------- | ------- | ----------- |
| `target.project` | abc-123 | The project specified in the active profile |
| `target.dataset` | dbt_alice | The dataset the active profile |

## Examples

### Use `target.name` to limit data in dev

As long as you use sensible target names, you can perform conditional logic to limit data when working in dev.

```sql
select
  *
from source('web_events', 'page_views')
{% if target.name == 'dev' %}
where created_at >= dateadd('day', -3, current_date)
{% endif %}
```

### Use `target.name` to change your source database

If you have specific Snowflake databases configured for your dev/qa/prod environments,
you can set up your sources to compile to different databases depending on your 
environment. 

```yml
version: 2
 
sources:
  - name: source_name 
    database: |
      {%- if  target.name == "dev" -%} raw_dev
      {%- elif target.name == "qa"  -%} raw_qa
      {%- elif target.name == "prod"  -%} raw_prod
      {%- else -%} invalid_database
      {%- endif -%}
    schema: source_schema
```
