## Canvas prerequisites
Before using <Constant name="canvas" />, you should:
- Have a [<Constant name="dbt" /> Enterprise or Enterprise+](https://www.getdbt.com/pricing) account.
- Have a [developer license](/docs/platform/manage-access/seats-and-users) with user credentials set up.
- Be using one of the following adapters:
    - Bigquery
    - Databricks
    - Redshift 
    - Snowflake
    - Trino
    - You can access the <Constant name="canvas" /> with adapters not listed, but some features may be missing at this time. 
- Use [GitHub](/docs/platform/git/connect-github), [GitLab](/docs/platform/git/connect-gitlab), or [Azure DevOps](/docs/platform/git/connect-azure-devops) as your <Constant name="git" /> provider, connected to dbt via HTTPS.
  - SSH connections aren't supported at this time.
  - Self-hosted or on-premises deployments of any Git provider aren't supported for <Constant name="canvas"/> at this time.
- Have an existing <Constant name="dbt" /> project already created with a Staging or Production run completed.
- Verify your Development environment is on a supported [release track](/docs/dbt-versions/dbt-release-tracks) to receive ongoing updates.
- Have read-only access to the [Staging environment](/docs/deploy/deploy-environments#staging-environment) with the data to be able to execute `run` in the <Constant name="canvas" />. To customize the required access for the <Constant name="canvas" /> user group, refer to [Set up environment-level permissions](/docs/platform/manage-access/environment-permissions-setup) for more information.
- Have the AI-powered features toggle [enabled](/docs/dbt-ai/wizard-ide#enable-dbt-wizard) for dbt Copilot.
