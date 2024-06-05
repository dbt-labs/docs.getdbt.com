You can set up the dbt Semantic Layer in dbt Cloud at the environment and project level. Before you begin:

- You must be part of the Owner group, and have the correct [license](/docs/cloud/manage-access/seats-and-users) and [permissions](/docs/cloud/manage-access/self-service-permissions) to configure the Semantic Layer:
    * Enterprise plan &mdash; Developer license with Account Admin permissions. Or Owner with a Developer license, assigned Project Creator, Database Admin, or Admin permissions.
    * Team plan &mdash; Owner with a Developer license.
    * If you are using a free trial dbt Cloud account, you are on a trial of the Team plan as an Owner, so you're good to go.
- You must have a successful run in your new environment.

Now that we've created and successfully run a job in your environment, you're ready to configure the semantic layer.

1. Navigate to **Account Settings** in the navigation menu.
2. Use the sidebar to select your project settings. Select the specific project you want to enable the Semantic Layer for.
3. In the **Project Details** page, navigate to the **Semantic Layer** section, and select **Configure Semantic Layer**.

<Lightbox src="/img/docs/dbt-cloud/semantic-layer/new-sl-configure.jpg" width="60%" title="Semantic Layer section in the Project Details page"/>

4. In the **Credentials** page, configure the credentials you want the Semantic Layer to use specific to your data platform. For more granular control, you can configure the dbt Semantic Layer to use multiple data platform credentials. Refer to [configure credentials](#configure-credentials) for more granular configuration details.

5. Select the deployment environment you want for the Semantic Layer and click **Save**.
6. After saving it, you'll be provided with the connection information that allows you to connect to downstream tools. If your tool supports JDBC, save the JDBC URL or individual components (like environment id and host). If it uses the GraphQL API, save the GraphQL API host information instead.

<Lightbox src="/img/docs/dbt-cloud/semantic-layer/sl-configure-example.jpg" width="50%" title="After configuring, you'll be provided with the connection details to connect to you downstream tools." />

7. Save and copy your environment ID, service token, and host, which you'll need to use in the downstream tools. For more info on how to integrate with partner integrations, refer to [Available integrations](/docs/cloud-integrations/avail-sl-integrations).

8. Return to the **Project Details** page and click the **[Generate a Service Token](/docs/dbt-cloud-apis/service-tokens)** button. Make sure it has Semantic Layer Only and Metadata Only permissions. Name the token and save it. Once the token is generated, you won't be able to view this token again so make sure to record it somewhere safe.  

## Configure credentials

For more granular control, you can authenticate to the dbt Semantic Layer in downstream interfaces using a [service token](/docs/dbt-cloud-apis/service-tokens). The credential configuration allows admins to map service tokens to the appropriate credentials, which can then be distributed to the relevant teams for BI connection setup. 

- Admins can map multiple service tokens to a single credential in a project. However, in a single project, only a given service token can map to one credential.
- When you send a request through our APIs with a service token, it will resolve to the underlying credential that the token is mapped to and respect all physical access policies of the data used to build your semantic objects.
- Note, [Environment variables](/docs/build/environment-variables) such as `{{env_var('DBT_WAREHOUSE')}`, aren't supported the dbt Semantic Layer yet. You must use the actual credentials

#### Creating a credential

1. Choose **Add credentials** in the **Project details** page.
2. Fill in the credentials to your data platform. We recommend using “read-only” credentials. You can also use your deployment credentials, but only for testing purposes.
3. Create and map a service token to the credential. Make sure to copy the service token before you exit.

#### Mapping service tokens to existing credentials

1. Create a service token by going to **Account settings** and then select **Service tokens** page under **API tokens**.
2. Map it to an existing credential. You’ll always be able to see which credentials tie to a service token on the **Detail** page.

#### Adding credentials

1. Return to the **Project details** configuration page and select **Add credential** to add a new credential.

#### Deleting credentials

1. (Optional) Edit the configuration and select **Delete credential** to remove a credential. When you delete a credential, any service tokens mapped to that credential in the project will no longer work and will break for any end users.

<Lightbox src="/img/docs/dbt-cloud/semantic-layer/sl-configure-sl.jpg" width="55%" title="Enter the credentials you want the Semantic Layer to use specific to your data platform, and select the deployment environment."/>
