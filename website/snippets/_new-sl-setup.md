You must be part of the Owner group, and have the correct [license](/docs/cloud/manage-access/seats-and-users) and [permissions](/docs/cloud/manage-access/self-service-permissions) to set up the Semantic Layer at the environment and project level.
- Enterprise plan:
  - Developer license with Account Admin permissions, or
  - Owner with a Developer license, assigned Project Creator, Database Admin, or Admin permissions.
- Team plan: Owner with a Developer license.
- Free trial: You are on a free trial of the Team plan as an Owner, which means you have access to the dbt Semantic Layer.

Here's how to set up the Semantic Layer in dbt Cloud:

### 1. Account settings and configuration
1. Navigate to **Account settings** in the navigation menu.
2. On the **Settings** left sidebar, select the specific project you want to enable the Semantic Layer for.
3. In the **Project details** page, navigate to the **Semantic Layer** section. Select **Configure Semantic Layer**  
<Lightbox src="/img/docs/dbt-cloud/semantic-layer/new-sl-configure.jpg" width="60%" title="Semantic Layer section in the 'Project Details' page"/>

4. In the **Semantic Layer & Credentials** page, select the deployment environment you want for the Semantic Layer and click **Save**. This provides administrators with the flexibility to choose the environment where the Semantic Layer will be enabled.

### 2. Add credential and service token

:::info 
- dbt Cloud Enterprise plans can [add multiple credentials](#4-add-more-credentials) for more granular control and tailored access for different teams and projects.
- Teams plans can manage a single credential and map service tokens, however cannot add new credentials for tailored access. <a href="https://www.getdbt.com/contact" style={{ color: 'white', backgroundColor: '#66c2c2', padding: '4px 8px', borderRadius: '4px', textDecoration: 'none', display: 'inline-block' }}>Book a demo</a> to learn more about dbt Cloud Enterprise.
:::

The dbt Semantic Layer uses [service tokens](/docs/dbt-cloud-apis/service-tokens) for authentication, mapped to underlying data platform credentials. These credentials control physical access to the raw data. The credential configuration allows admins to create a credential and map it to service tokens, which can then be shared to relevant teams for BI connection setup. 

We recommend configuring credentials and service tokens to reflect your teams and their roles. For example, create tokens or credentials that align with your team's needs, such as providing finance-related schemas to the Finance team.

Note that: 
- Admins can link multiple service tokens to a single credential within a project, but each service token can only be linked to one credential per project.
- When you send a request through the APIs, the service token of the linked credential will follow access policies of the data used to build your semantic objects.
- [Environment variables](/docs/build/environment-variables), like `{{env_var('DBT_WAREHOUSE')}` aren't supported the dbt Semantic Layer yet. You must use the actual credentials instead.

To add a credential and service token:

1. On the **Credentials & service tokens** page, click the **Add Semantic Layer credential** button to configure the credential for your data platform. 
2. In the **Add credentials** section, fill in the data platform's credentials, which will link to a [service tokens](/docs/dbt-cloud-apis/service-tokens). 
    We recommend using “read-only” credentials.
3. In the **Map new service token** section,  map a service token to the credential you configured in the previous step. dbt Cloud automatically selects the service token permission set you need (Semantic Layer Only and Metadata Only).
   - To add another service token, click **Add service token** under the **Linked service tokens** section.

4. Click **Save** to link the service token to the credential. Remember to copy and save the service token securely, as it won't be viewable again after generation.

<Lightbox src="/img/docs/dbt-cloud/semantic-layer/sl-add-credential.jpg" width="55%" title="Add credentials to link to a service token. " />

4. To delete a credential, go back to the **Semantic Layer & Credential**s page.
5. Select **Delete credential** to remove a credential and click **Save**. When you delete a credential, any service tokens mapped to that credential in the project will no longer work and will break for any end users.

### 3. View connection detail
1. Go back to the **Project details** page for connection details to connect to downstream tools.
2. Copy and share the environment ID, service token, host, as well as the service token name to the relevant teams for BI connection set up. If your tool uses the GraphQL API, save the GraphQL API host information instead of the JDBC URL. 

    For info on how to connect to other integrations, refer to [Available integrations](/docs/cloud-integrations/avail-sl-integrations).

<Lightbox src="/img/docs/dbt-cloud/semantic-layer/sl-configure-example.jpg" width="50%" title="After configuring, you'll be provided with the connection details to connect to you downstream tools." />

### 4. Add more credentials <Lifecycle status="enterprise"/>

dbt Cloud Enterprise plans allow you to optionally add multiple credentials, offering more granular control and tailored access for different teams and projects.

1. To add more credentials, click **Add new credential** on the **Credentials & service tokens** page.
2. Follow the same steps described in [Step 2](#2-add-credential-and-service-token) to configure the credential and map a service token to it.

<Lightbox src="/img/docs/dbt-cloud/semantic-layer/sl-credential-created.jpg" width="100%" title="Enterprise plans can add new credentials to link to a service token for more granular control."/>

## Additional configuration

 The following are the additional flexible configurations for Semantic Layer credentials.

### Unlink service tokens
- Unlink a service token from the credential by clicking **Unlink** under the **Linked service tokens** section. If try to query the Semantic Layer with an unlinked credential, you'll experience an error in your BI tool because no valid token is mapped.

### Manage from service token page
**View credential from service token**
- View your Semantic Layer credential directly by navigating to the **API tokens** and then **Service tokens** page. 
- Select the service token to view the credential it's linked to. This is useful if you want to know which service tokens are mapped to credentials in your project.

**Create a new service token**
- From the **Service tokens** page, create a new service token and map that to the credential(s) (assuming the semantic layer permission exists). This is useful if you want to create a new service token and directly map it to a credential in your project.
- Make sure to select the correct permission set for the service token (Semantic Layer Only and Metadata Only).

<Lightbox src="/img/docs/dbt-cloud/semantic-layer/sl-create-service-token-page.jpg" width="100%" title="Create a new service token and map credentials directly in the separate 'Service tokens page'."/>
