---
title: Environment variables
id: "cloud-environment-variables"
---

Environment variables can be used to customize the behavior of a dbt project
based on the environment where the project is running. See the docs on
[env_var](dbt-jinja-functions/env_var) for more information on using these
environment variables in your dbt project.

### Deployment environment variables

dbt Cloud has a number of pre-defined variables built in. The following
environment variables are set automatically for deployment runs, and their
values cannot be changed.

**Run details**
- `DBT_CLOUD_PROJECT_ID`: The ID of the dbt Cloud Project for this run
- `DBT_CLOUD_JOB_ID`: The ID of the dbt Cloud Job for this run
- `DBT_CLOUD_RUN_ID`: The ID of this particular run
- `DBT_CLOUD_RUN_REASON_CATEGORY`: The "category" of the trigger for this run (one of: `scheduled`, `github_pull_request`, `other`)
- `DBT_CLOUD_RUN_REASON`: The specific trigger for this run (eg. "Scheduled", "Kicked off by &lt;email&gt;", or custom via API)

**Git details**

_Note: These variables are currently only available for GitHub and GitLab
PR builds triggered via a webhook_

- `DBT_CLOUD_PR_ID`: The Pull Request ID in the connected version control system
- `DBT_CLOUD_GIT_SHA`: The git commit SHA which is being run for this Pull Request build

### Declaring variables

Custom environment variables are not currently supported, but a future release
of dbt Cloud will add support for user-defined environment variables.

### Example usage

Environment variables can be used in many different ways! Here is one example:
including the dbt Cloud run ID in an incremental model for auditing and
debugging:

```sql

{{ config(materialized='incremental', unique_key='user_id') }}

with users_aggregated as (

    select
        user_id,
        min(event_time) as first_event_time,
        max(event_time) as last_event_time,
        count(*) as count_total_events

    from {{ ref('users') }}
    group by 1

)

select *,
    -- Inject the run id if present, otherwise use "manual"
    '{{ env_var("DBT_CLOUD_RUN_ID", "manual") }}' as _audit_run_id

from users_aggregated
```
