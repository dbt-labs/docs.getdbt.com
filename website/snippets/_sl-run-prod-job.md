Once you’ve committed and merged your metric changes in your dbt project, you can perform a job run in your deployment environment in dbt Cloud to materialize your metrics. The deployment environment is only supported for the dbt Semantic Layer currently. 

1. In dbt Cloud, create a new [deployment environment](/docs/deploy/deploy-environments#create-a-deployment-environment) or use an existing environment on dbt 1.6 or higher.
    * Note &mdash; Deployment environment is currently supported (_development experience coming soon_)
2. To create a new environment, navigate to **Deploy** in the navigation menu, select **Environments**, and then select **Create new environment**.
3. Fill in your deployment credentials with your Snowflake username and password. You can name the schema anything you want. Click **Save** to create your new production environment.
4. [Create a new deploy job](/docs/deploy/deploy-jobs#create-and-schedule-jobs) that runs in the environment you just created. Go back to the **Deploy** menu, select **Jobs**, select **Create job**, and click **Deploy job**.
5. Set the job to run a `dbt build` and select the **Generate docs on run** checkbox.
6. Run the job and make sure it runs successfully.
