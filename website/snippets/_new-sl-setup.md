You can set up the dbt Semantic Layer in dbt Cloud at the environment and project level. Before you begin:

- You must be part of the Owner group, and have the correct [license](/docs/cloud/manage-access/seats-and-users) and [permissions](/docs/cloud/manage-access/self-service-permissions) to configure the Semantic Layer:
    * Enterprise plan &mdash; Developer license with Account Admin permissions. Or Owner with a Developer license, assigned Project Creator, Database Admin, or Admin permissions.
    * Team plan &mdash; Owner with a Developer license.
    * If you are using a free trial dbt Cloud account, you are on a trial of the Team plan as an Owner, so you're good to go.
- You must have a successful run in your new environment.

:::tip
If you've configured the legacy Semantic Layer, it has been deprecated. dbt Labs strongly recommends that you [upgrade your dbt version](/docs/dbt-versions/upgrade-dbt-version-in-cloud) to dbt version 1.6 or higher to use the latest dbt Semantic Layer. Refer to the dedicated [migration guide](/guides/sl-migration) for details.
:::

Now that we've created and successfully run a job in your environment, you're ready to configure the semantic layer.

1. Navigate to **Account Settings** in the navigation menu.
2. Use the sidebar to select your project settings. Select the specific project you want to enable the Semantic Layer for.
3. In the **Project Details** page, navigate to the **Semantic Layer** section, and select **Configure Semantic Layer**.

<Lightbox src="/img/docs/dbt-cloud/semantic-layer/new-sl-configure.jpg" width="60%" title="Semantic Layer section in the Project Details page"/>

4. In the **Set Up Semantic Layer Configuration** page, enter the credentials you want the Semantic Layer to use specific to your data platform.

     - Use credentials with minimal privileges. This is because the Semantic Layer requires read access to the schema(s) containing the dbt models used in your semantic models for downstream applications
     - Note, [Environment variables](/docs/build/environment-variables) such as `{{env_var('DBT_WAREHOUSE')}`, doesn't supported the dbt Semantic Layer yet. You must use the actual credentials.

<Lightbox src="/img/docs/dbt-cloud/semantic-layer/sl-configure-sl.jpg" width="45%" title="Enter the credentials you want the Semantic Layer to use specific to your data platform, and select the deployment environment."/>

2. Select the deployment environment you want for the Semantic Layer and click **Save**.
3. After saving it, you'll be provided with the connection information that allows you to connect to downstream tools. If your tool supports JDBC, save the JDBC URL or individual components (like environment id and host). If it uses the GraphQL API, save the GraphQL API host information instead.

<Lightbox src="/img/docs/dbt-cloud/semantic-layer/sl-configure-example.jpg" width="50%" title="After configuring, you'll be provided with the connection details to connect to you downstream tools." />

7. Save and copy your environment ID, service token, and host, which you'll need to use downstream tools. For more info on how to integrate with partner integrations, refer to [Available integrations](/docs/use-dbt-semantic-layer/avail-sl-integrations).

8. Return to the **Project Details** page and click the **Generate a [Service Token](/docs/dbt-cloud-apis/service-tokens)** button. Make sure it has Semantic Layer Only and Metadata Only permissions. Name the token and save it. Once the token is generated, you won't be able to view this token again so make sure to record it somewhere safe.  

Great job, you've configured the Semantic Layer 🎉!
