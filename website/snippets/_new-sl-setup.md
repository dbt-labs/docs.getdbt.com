You can set up the dbt Semantic Layer in dbt Cloud at the environment and project level. Before you begin:

- You must be part of the Owner group, and have the correct [license](/docs/cloud/manage-access/seats-and-users) and [permissions](/docs/cloud/manage-access/self-service-permissions) to configure the Semantic Layer:
    * Enterprise plan &mdash; Developer license with Account Admin permissions. Or Owner with a Developer license, assigned Project Creator, Database Admin, or Admin permissions.
    * Team plan &mdash; Owner with a Developer license.
- You must have a successful run in your new environment.

:::tip
If you've configured the legacy Semantic Layer, it has been deprecated. dbt Labs strongly recommends that you [upgrade your dbt version](/docs/dbt-versions/upgrade-dbt-version-in-cloud) to dbt version 1.6 or higher to use the latest dbt Semantic Layer. Refer to the dedicated [migration guide](/guides/sl-migration) for details.
:::

1. In dbt Cloud, create a new [deployment environment](/docs/deploy/deploy-environments#create-a-deployment-environment) or use an existing environment on dbt 1.6 or higher.
    * Note &mdash; Deployment environment is currently supported (_development experience coming soon_)

2. Navigate to **Account Settings** and select the specific project you want to enable the Semantic Layer for.

3. In the **Project Details** page, navigate to the **Semantic Layer** section, and select **Configure Semantic Layer**.

<Lightbox src="/img/docs/dbt-cloud/semantic-layer/new-sl-configure.jpg" width="60%" title="Semantic Layer section in the Project Details page"/>

4. In the **Set Up Semantic Layer Configuration** page, enter the credentials you want the Semantic Layer to use specific to your data platform.

     - Use credentials with minimal privileges. This is because the Semantic Layer requires read access to the schema(s) containing the dbt models used in your semantic models for downstream applications
     - Note, [Environment variables](/docs/build/environment-variables) such as `{{env_var('DBT_WAREHOUSE')}`, doesn't supported the dbt Semantic Layer yet. You must use the actual credentials.

<Lightbox src="/img/docs/dbt-cloud/semantic-layer/sl-configure-sl.jpg" width="45%" title="Enter the credentials you want the Semantic Layer to use specific to your data platform, and select the deployment environment."/>

5. Select the deployment environment you want for the Semantic Layer and click **Save**.

6. After saving it, you'll be provided with the connection information that allows you to connect to downstream tools. If your tool supports JDBC, save the JDBC URL or individual components (like environment id and host). If it uses the GraphQL API, save the GraphQL API host information instead.

<Lightbox src="/img/docs/dbt-cloud/semantic-layer/sl-configure-example.jpg" width="50%" title="After configuring, you'll be provided with the connection details to connect to you downstream tools." />

7. Save and copy your environment ID, service token, and host, which you'll need to use downstream tools. For more info on how to integrate with partner integrations, refer to [Available integrations](/docs/use-dbt-semantic-layer/avail-sl-integrations).

8. Return to the **Project Details** page, then select **Generate Service Token**.  You will need Semantic Layer Only and Metadata Only [service token](/docs/dbt-cloud-apis/service-tokens) permissions.

Great job, you've configured the Semantic Layer 🎉!
