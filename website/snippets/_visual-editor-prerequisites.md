## Visual Editor prerequisites
Before using Visual Editor, you should:
- Have a [dbt Cloud Enterprise](https://www.getdbt.com/pricing) account.
- Have a [developer license](/docs/cloud/manage-access/seats-and-users) with developer credentials set up.
- Be using one of the following adapters:
    - Snowflake
    - Redshift 
    - Bigquery
    - Trino
    - You can access the Visual Editor with adapters not listed, but some features may be missing at this time. 
- Have an existing dbt Cloud project already created with a Production run completed.
- Verify your Development environment is on a supported [release track](/docs/dbt-versions/cloud-release-tracks) to receive ongoing updates.
- You must have read-only access to the [Staging environment](/docs/deploy/deploy-environments#staging-environment) with the data to be able to execute `run` in the Visual Editor. To customize the required access for the Visual Editor user group, refer to [Set up environment-level permissions](/docs/cloud/manage-access/environment-permissions-setup) for more information.
- Have AI-powered features toggle enabled (for [dbt Copilot integration](/docs/cloud/dbt-copilot)).