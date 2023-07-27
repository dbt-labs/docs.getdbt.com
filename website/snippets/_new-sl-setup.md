You can set up the dbt Semantic Layer in dbt Cloud at the environment and project level. Before you begin:
- You must have a dbt Cloud Team or Enterprise [multi-tenant](/docs/cloud/about-cloud/regions-ip-addresses) deployment, hosted in North America. 
- You must have a successful run in your new environment.

:::tip
If you're using the legacy Semantic Layer, we **highly** recommend you [upgrade your dbt version](/docs/dbt-versions/upgrade-core-in-cloud) to dbt v1.6 or higher to use the new dbt Semantic Layer. Refer to the dedicated [migration guide](/guides/migration/sl-migration) for more info.
:::

1. in dbt Cloud, create a new [deployment environment](/docs/deploy/deploy-environments#create-a-deployment-environment) or use an existing environment on dbt 1.6 or higher.
    * Note &mdash; Deployment environment is currently supported (_development experience coming soon_)

2. Navigate to **Account Settings** and select the specific project you want to enable the Semantic Layer for.

3. In the **Project Details** page, navigate to the **Semantic Layer** section, and select **Configure Semantic Layer**.

<Lightbox src="/img/docs/dbt-cloud/semantic-layer/sl-initial-page.jpg" width="60%" title="Semantic Layer section in the Project Details page"/>

4. In the **Set Up Semantic Layer Configuration** page, enter the credentials you want the Semantic Layer to use specific to your data platform. 
**Note:** We recommend credentials have the least privileges required because your Semantic Layer users will be querying it in downstream applications. At a minimum, the Semantic Layer needs to have read access to the schema(s) that contains the dbt models that you used to build your semantic models.

5. Select the deployment environment you want for the Semantic Layer and click **Save**.

<Lightbox src="/img/docs/dbt-cloud/semantic-layer/sl-configure-sl.jpg" width="50%" title="Set Up your Semantic Layer configuration."/>

6. You should see connection information that allows you to connect to downstream tools. 
**Note:** If your tool supports JDBC, make sure to save the JDBC URL or individual components (like environment id and host). <!--If it uses the Semantic Layer GraphQL API, save the GraphQL API host information instead.-->

7. Return to the **Project Details** page and select **Generate Service Token** to create a Semantic Layer service token. 

8. Save and copy your environment ID, service token, and host, which you'll need to use downstream tools.

9. Great job, you've configured the Semantic Layer 🎉! 

