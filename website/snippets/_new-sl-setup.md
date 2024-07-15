
Here's how to set up the Semantic Layer in dbt Cloud:

### 1. Account settings and configuration

For example, let's say you have a fictional Finance team. You can set up Semantic Layer credentials if you'd like to provide a Semantic Layer credential to the trusty Finance team, who only have access to finance-related schemas.

- Navigate to **Account Settings** in the navigation menu.
- On the **Settings** sidebar, select the specific project you want to enable the Semantic Layer for.
- In the **Project details** page, navigate to the **Semantic Layer** section. Select **Configure Semantic Layer**  
<Lightbox src="/img/docs/dbt-cloud/semantic-layer/new-sl-configure.jpg" width="60%" title="Semantic Layer section in the Project Details page"/>

- In the **Semantic Layer & Credentials** page, select the deployment environment you want for the Semantic Layer and click **Save**. This provides administrators with the flexibility to choose the environment where the Semantic Layer will be enabled. <br />

### 2. Add Semantic Layer credential and service token
- <Expandable alt_header="Learn more about granular access control">

    You can authenticate to the dbt Semantic Layer in downstream interfaces using a [service token](/docs/dbt-cloud-apis/service-tokens) for more granular control. The credential configuration allows admins to map service tokens to the appropriate credentials, which can then be distributed to the relevant teams for BI connection setup.

    - Admins can link multiple service tokens to a one single credential within a project.  However, each service token can only be linked to one credential per project.
    - When you send a request through our APIs, the service token you provide will be linked to the corresponding credential and will follow access policies of the data used to build your semantic objects.
    - [Environment variables](/docs/build/environment-variables), like `{{env_var('DBT_WAREHOUSE')}` aren't supported the dbt Semantic Layer yet. You must use the actual credentials instead.

 </Expandable>

- On the **Credentials & service tokens** page, click the **Add Semantic Layer credential** button to configure the credentials you want the Semantic Layer to use specific to your data platform. You can configure as many credentials as you need for more granular control.
- In the **Add credentials** section, fill in the data platform's credentials, which will link to a [service tokens](/docs/dbt-cloud-apis/service-tokens). 
    We recommend using “read-only” credentials. You can also use your deployment credentials, but only for testing purposes.
- In the **Map new service token** section,  map a service token to the credential you configured in the previous step.
  - dbt Cloud automatically selects the service token permission set you need (Semantic Layer Only and Metadata Only).
  - You can also view your Semantic Layer credential in the separate **Service token details** page by going to **API tokens** and then **Service tokens**.

- Click **Save** to link the service token to the credential. 

<Lightbox src="/img/docs/dbt-cloud/semantic-layer/sl-add-credential.jpg" width="55%" title="Add credentials to link to a service token. This example image links a credetnial to the fiction finance team, who only have access to finance-related schemas."/> <br />


### 3. Collect connection detail
- Go back to the **Project details** page for connection details to connect to downstream tools.
- Copy and share the environment ID, service token, host, as well as the service token name to the relevant teams for BI connection set up. If your tool uses the GraphQL API, save the GraphQL API host information instead of the JDBC URL. 

    For info on how to connect to other integrations, refer to [Available integrations](/docs/cloud-integrations/avail-sl-integrations).

<Lightbox src="/img/docs/dbt-cloud/semantic-layer/sl-configure-example.jpg" width="50%" title="After configuring, you'll be provided with the connection details to connect to you downstream tools." />

- <Expandable alt_header="Add more service tokens or unlink existing ones">

    To provide admins more control and granularity:
    - Optionally add more service tokens to the credential by clicking **Add service token** under the **Linked service tokens** section.
    - Unlink a service token from the credential by clicking **Unlink** under the **Linked service tokens** section.
    
  </Expandable>

### 4. Delete credentials (optional)

- To remove a credential, go back to the **Semantic Layer & Credentials** page. 
- Select **Delete credential** to remove a credential.
- When you delete a credential, any service tokens mapped to that credential in the project will no longer work and will break for any end users.
