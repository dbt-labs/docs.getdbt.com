You must be part of the Owner group, and have the correct [license](/docs/cloud/manage-access/seats-and-users) and [permissions](/docs/cloud/manage-access/self-service-permissions) to set up the Semantic Layer at the environment and project level.
- Enterprise plan:
  - Developer license with Account Admin permissions, or
  - Owner with a Developer license, assigned Project Creator, Database Admin, or Admin permissions.
- Team plan: Owner with a Developer license.
- Free trial: You are on a free trial of the Team plan as an Owner, which means you have access to the dbt Semantic Layer.

### 1. Select environment

Select the environment where you want to enable the Semantic Layer:

1. Navigate to **Account settings** in the navigation menu.
2. On the **Settings** left sidebar, select the specific project you want to enable the Semantic Layer for.
3. In the **Project details** page, navigate to the **Semantic Layer** section. Select **Configure Semantic Layer**  

<Lightbox src="/img/docs/dbt-cloud/semantic-layer/new-sl-configure.jpg" width="60%" title="Semantic Layer section in the 'Project Details' page"/>

4. In the **Set Up Semantic Layer Configuration** page, select the deployment environment you want for the Semantic Layer and click **Save**. This provides administrators with the flexibility to choose the environment where the Semantic Layer will be enabled.

### 2. Add a credential
The dbt Semantic Layer uses [service tokens](/docs/dbt-cloud-apis/service-tokens) for authentication, mapped to an underlying data platform credential. This credential has physical access to the raw data, meaning it controls the data accessed by the Semantic Layer.

1. In the **Set Up Semantic Layer Configuration** page, enter the credentials you want the Semantic Layer to use specific to your data platform.
   - Use credentials with minimal privileges. This is because the Semantic Layer requires read access to the schema(s) containing the dbt models used in your semantic models for downstream applications
   - Note, Environment variables such as `{{env_var('DBT_WAREHOUSE')}`, aren't supported in the dbt Semantic Layer yet. You must use the actual credentials.
<Lightbox src="/img/docs/dbt-cloud/semantic-layer/sl-configure-sl.jpg" width="45%" title="Enter the credentials you want the Semantic Layer to use specific to your data platform, and select the deployment environment."/>

2. Return to the **Project Details** page and click the **Generate a Service Token** button. Make sure it has Semantic Layer Only and Metadata Only permissions. 
3. Name the token and save it. Once the token is generated, you won't be able to view this token again so make sure to record it somewhere safe.

dbt Cloud Enterprise plans can add multiple credentials and map those to service tokens. Refer to [Add more credentials](#4-add-more-credentials) for more information.

:::info
Teams plans can manage a single credential and map to a service token, however add [multiple credentials](#4-add-more-credentials) for tailored access is available for Enterprise plans.  

<a href="https://www.getdbt.com/contact" style={{ color: 'white', backgroundColor: '#66c2c2', padding: '4px 8px', borderRadius: '4px', textDecoration: 'none', display: 'inline-block' }}>Book a free live demo</a> to discover the full potential of dbt Cloud Enterprise.
:::

### 3. View connection detail
1. Go back to the **Project details** page for connection details to connect to downstream tools.
2. Copy and share the environment ID, service token, host, as well as the service token name to the relevant teams for BI connection set up. If your tool uses the GraphQL API, save the GraphQL API host information instead of the JDBC URL. 

    For info on how to connect to other integrations, refer to [Available integrations](/docs/cloud-integrations/avail-sl-integrations).

<Lightbox src="/img/docs/dbt-cloud/semantic-layer/sl-configure-example.jpg" width="50%" title="After configuring, you'll be provided with the connection details to connect to you downstream tools." />

### 4. Add more credentials <Lifecycle status="enterprise"/>
dbt Cloud Enterprise plans can optionally add multiple credentials and map them to service tokens, offering more granular control and tailored access for different teams and projects. This can then be shared to relevant teams for BI connection setup. These credentials have physical access to the raw data, meaning they control the data accessed by the Semantic Layer.

We recommend configuring credentials and service tokens to reflect your teams and their roles. For example, create tokens or credentials that align with your team's needs, such as providing finance-related schemas to the Finance team.

Note that: 
- Admins can link multiple service tokens to a single credential within a project, but each service token can only be linked to one credential per project.
- When you send a request through the APIs, the service token of the linked credential will follow access policies of the data used to build your semantic objects.
- [Environment variables](/docs/build/environment-variables), like `{{env_var('DBT_WAREHOUSE')}` aren't supported the dbt Semantic Layer yet. You must use the actual credentials instead.

To add multiple credentials and map them to service token:

1. After configuring your environment, on the **Credentials & service tokens** page click the **Add Semantic Layer credential** button to configure the credential for your data platform. 
2. On the **Create New Semantic Layer Credential** page, you can create multiple credentials and map them to a service token.
3. In the **Add credentials** section, fill in the data platform's credential fields.  We recommend using “read-only” credentials.
<Lightbox src="/img/docs/dbt-cloud/semantic-layer/sl-add-credential.jpg" width="55%" title="Add credentials and map them to a service token. " />
1. In the **Map new service token** section, map a service token to the credential you configured in the previous step. dbt Cloud automatically selects the service token permission set you need (Semantic Layer Only and Metadata Only).
   - To add another service token, click **Add service token** under the **Linked service tokens** section.

2. Click **Save** to link the service token to the credential. Remember to copy and save the service token securely, as it won't be viewable again after generation.
<Lightbox src="/img/docs/dbt-cloud/semantic-layer/sl-credential-created.jpg" width="100%" title="Manage multiple credentials and link them to service tokens for more granular control."/>

1. To delete a credential, go back to the **Semantic Layer & Credential**s page. Select **Delete credential** to remove a credential and click **Save**. 
   
   When you delete a credential, any service tokens mapped to that credential in the project will no longer work and will break for any end users.

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
