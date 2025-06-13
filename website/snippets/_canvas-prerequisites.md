## Canvas prerequisites
Before using <Constant name="visual_editor" />, you should:
- Have a [<Constant name="cloud" /> Enterprise or Enterprise+](https://www.getdbt.com/pricing) account.
- Have a [developer license](/docs/cloud/manage-access/seats-and-users) with developer credentials set up.
- Be using one of the following adapters:
    - Bigquery
    - Databricks
    - Redshift 
    - Snowflake
    - Trino
    - You can access the <Constant name="visual_editor" /> with adapters not listed, but some features may be missing at this time. 
- Be using [GitHub](/docs/cloud/git/connect-github), [GitLab](/docs/cloud/git/connect-gitlab), or [Azure DevOps](/docs/cloud/git/connect-azure-devops) as your <Constant name="git" /> provider. 
- Have an existing <Constant name="cloud" /> project already created with a Production run completed.
- Verify your Development environment is on a supported [release track](/docs/dbt-versions/cloud-release-tracks) to receive ongoing updates.
- Have read-only access to the [Staging environment](/docs/deploy/deploy-environments#staging-environment) with the data to be able to execute `run` in the <Constant name="visual_editor" />. To customize the required access for the <Constant name="visual_editor" /> user group, refer to [Set up environment-level permissions](/docs/cloud/manage-access/environment-permissions-setup) for more information.
- Have AI-powered features toggle enabled (for [<Constant name="copilot" /> integration](/docs/cloud/dbt-copilot)).
