You can set up the dbt Semantic Layer in dbt Cloud at the environment and project level. To configure the new Semantic Layer, you must have a successful run in your new environment.

:::tip
If you're using the legacy Semantic Layer, we **highly** recommend you [upgrade your dbt version](/docs/dbt-versions/upgrade-core-in-cloud) to dbt v1.6 or higher to use the new dbt Semantic Layer. Refer to the dedicated [migration guide](/guides/migration/sl-migration) for more info.
:::

1. Create new [deployment environment](/docs/deploy/deploy-environments#create-a-deployment-environment) or use an existing environment on dbt 1.6 or higher.
    * Note &mdash; Deployment environment is currently supported (_development experience coming soon_)
2. Navigate to **Account Settings** and select the specific project you want to enable the Semantic Layer for.
3. In the **Project Details** page, navigate to **Configure Semantic Layer**.
4. Enter the credentials you want the Semantic Layer to use specific to your data platform. 
    * Note: We recommend using a less privileged set of credentials because your Semantic Layer users will be querying it in downstream applications. At a minimum, the Semantic Layer needs to have read access to the schema(s) that contains the dbt models that you used to build your semantic models.
5. Select the deployment environment you want for the Semantic Layer
6. Next, go back to the **Project Details** page and select **Generate Service Token** to create a Semantic Layer service token. 
7. Save & copy your environment ID, service token, and host for inputting into a downstream tool
8. Great job, you've configured the Semantic Layer 🎉! 





