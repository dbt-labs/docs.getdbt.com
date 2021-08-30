---
title: Environment variables
id: "cloud-environment-variables"
---

:::info Beta Feature
Environment variables are currently a beta feature in dbt Cloud. If you are interested in joining the beta program, reach out to support@getdbt.com.
:::

Environment variables can be used to customize the behavior of a dbt project depending on where the project is running. See the docs on
[env_var](dbt-jinja-functions/env_var) for more information on how to call the jinja function `{{env_var('KEY','OPTIONAL_DEFAULT')}}` in your project code.

### Setting and overriding environment variables

**Order of precedence**

Environment variable values can be set in multiple places within dbt Cloud. As a result, dbt Cloud will interpret environment variables according to the following order of precedence (lowest to highest):

 <Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/Environment Variables/env-var-precdence.png" title="Environment variables order of precedence"/>

 - Default argument supplied to the `env_var` Jinja function in code
 - Project level default value
 - Environment level values
 - Personal and job override values
    - Each developer can set a personal value to override values set in the developent environment 
    - Job level values can override values set in deployment environments

**Setting environment variables at the project and environment level**

To set environment variables at the project and environment level, head over to the Environments section in your main navigation pane. You'll see a view to list all your environments and a view to set and update environment variables. Make sure you're in the environment variable view.

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/Environment Variables/Environment Variables.gif" title="Environment variables tab"/>



You'll notice there is a `Project Default` column. This is a great place to set a value that will persist across your whole project, independent of where the code is run. We recommend setting this value when you want to supply a catch-all default or add a project-wide token or secret.


To the right of the `Project Default` column are all your environments. Values set at the environment level take priority over the project level default value. This is where you can tell dbt Cloud to intepret an environment value differently in your Staging vs. Production environment, as example.

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/Environment Variables/project and environment variables view.png" title="Setting project level and environment level values"/>


:::note Job and personal overrides are coming soon!
:::

**Overriding environment variables at the job level**

You may have multiple jobs that run in the same environment, and you'd like the environment variable to be interpretted differently depending on the job. 

When setting up or editing a job, you will see a section for overriding environment variables. Every job runs in a specific, deployment environment, and by default, a job will inherit the values set at the environment level for the environment in which it runs. If you'd like to set a different value at the job level, edit the value to override it.



**Overriding environment variables at the personal level**


Developers may also want to set a personal value override for an environment variable while developing in the dbt IDE. By default, dbt Cloud will look to use environment variable values set in the project's development environment. To see and override these values, developers should head to their Profile and then select their project under Credentials and scroll to the Environment Variables section. 


To supply an override, developers can edit and specify a different value to use. These values will be respected in the IDE both for the Results and Compiled SQL tabs.


:::info Appropriate coverage
If you have not set a project level default value for every environment variable, it may be possible that dbt Cloud does not know how to interpret the value of an environment variable in all contexts. You should either supply a default value or ensure that specific environment variables are specified for all relevant environments; otherwise, dbt will throw a compilation error: "Env var required but not provided".
:::

### Handling secrets

While all environment variables are encrypted at rest in dbt Cloud, dbt Cloud has additional capabilities for managing environment variables with secret or otherwise sensitive values. If you want a particular environment variable to be scrubbed from all logs and error messages, in addition to obfuscating the value in the UI, you can prefix the key with `DBT_ENV_SECRET_`. This functionality is supported from `dbt v0.21.0` and on. 

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/Environment Variables/DBT_ENV_SECRET.png" title="DBT_ENV_SECRET prefix obfuscation"/>


### Special deployment environment variables

dbt Cloud has a number of pre-defined variables built in. The following environment variables are set automatically for deployment runs, and their values cannot be changed.

**Run details**
- `DBT_CLOUD_PROJECT_ID`: The ID of the dbt Cloud Project for this run
- `DBT_CLOUD_JOB_ID`: The ID of the dbt Cloud Job for this run
- `DBT_CLOUD_RUN_ID`: The ID of this particular run
- `DBT_CLOUD_RUN_REASON_CATEGORY`: The "category" of the trigger for this run (one of: `scheduled`, `github_pull_request`, `gitlab_merge_request`, `other`)
- `DBT_CLOUD_RUN_REASON`: The specific trigger for this run (eg. `Scheduled`, `Kicked off by <email>`, or custom via `API`)

**Git details**

_Note: These variables are currently only available for GitHub and GitLab
PR builds triggered via a webhook_

- `DBT_CLOUD_PR_ID`: The Pull Request ID in the connected version control system
- `DBT_CLOUD_GIT_SHA`: The git commit SHA which is being run for this Pull Request build


### Example usage

Environment variables can be used in many ways, and they give you the power and flexibility to do what you want to do, more easily in dbt Cloud.

#### Clone private packages
Now that you can set secrets as environment variables, you can pass git tokens into your package HTTPS URLs to allow for on-the-fly cloning of private repositories. Read more about enabling [private package cloning](/building-a-dbt-project/package-management#private-packages).
#### Dynamically set your warehouse in your Snowflake connection
Environment variables can make it simpler to override a Snowflake virtual warehouse for specific dbt Cloud jobs or environments.  

Suppose you'd like to set your warehouse in Snowflake to different values for different jobs. You'd like to run a full-refresh job in an XL warehouse, but your incremental job only needs to run in a medium-sized warehouse. Both jobs are configured in the same dbt Cloud environment. In your connection configuration, you can use an environment variable to set the warehouse name to `{{env_var('WAREHOUSE')}}`. Then in the job configuration, different values for the `WAREHOUSE` environment variable can be specified to dynamically configure different warehouses for each workload.

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/Environment Variables/warehouse-override.png" title="Adding environment variables to your connection credentials"/>

#### Audit your run metadata
Here's another motivating example that uses the dbt Cloud run ID, which is set automatically at each run. This additional data field can be used for auditing and debugging:

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
