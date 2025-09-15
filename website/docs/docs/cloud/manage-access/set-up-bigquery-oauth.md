---
title: "Set up BigQuery OAuth"
description: "Learn how dbt administrators can use BigQuery OAuth to control access in a dbt account"
id: "set-up-bigquery-oauth"
pagination_next: null
---

# Set up BigQuery OAuth <Lifecycle status="managed, managed_plus" />

:::info Enterprise-tier feature

This guide describes a feature available on <Constant name="cloud" /> Enterprise and Enterprise+ plans. If you’re interested in learning more about our Enterprise-tier plans, contact us at sales@getdbt.com.

:::

<Constant name="cloud" /> supports [OAuth](https://cloud.google.com/bigquery/docs/authentication) with BigQuery, providing an additional layer of security for dbt enterprise users. 

## Set up BigQuery native OAuth

When BigQuery OAuth is enabled for a <Constant name="cloud" /> project, all <Constant name="cloud" /> developers must authenticate with BigQuery to access development tools, such as the <Constant name="cloud_ide" />. 


To set up BigQuery OAuth in <Constant name="cloud" />, a BigQuery admin must:
1. [Locate the redirect URI value](#locate-the-redirect-uri-value) in <Constant name="cloud" />.
2. [Create a BigQuery OAuth 2.0 client ID and secret](#creating-a-bigquery-oauth-20-client-id-and-secret) in BigQuery.
3. [Configure the connection](#configure-the-connection-in-dbt-cloud) in <Constant name="cloud" />.

To use BigQuery in the <Constant name="cloud_ide" />, all developers must:
1. [Authenticate to BigQuery](#authenticating-to-bigquery) in the their profile credentials.

### Locate the redirect URI value
To get started, locate the connection's redirect URI for configuring BigQuery OAuth. To do so:

1. Navigate to your account name, above your profile icon on the left side panel. 
2. Select **Account settings** from the menu. 
3. From the left sidebar, select **Connections**.
4. Click the BigQuery connection.
5. Locate the **Redirect URI** field under the **Development OAuth** section. Copy this value to your clipboard to use later on.

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/dbt-cloud-enterprise/BQ-auth/dbt-cloud-bq-id-secret-02.png" title="Accessing the BigQuery OAuth configuration in dbt" />

### Creating a BigQuery OAuth 2.0 client ID and secret
To get started, you need to create a client ID and secret for [authentication](https://cloud.google.com/bigquery/docs/authentication) with BigQuery. This client ID and secret will be stored in <Constant name="cloud" /> to manage the OAuth connection between <Constant name="cloud" /> users and BigQuery.

In the BigQuery console, navigate to **APIs & Services** and select **Credentials**:

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/dbt-cloud-enterprise/BQ-auth/BQ-nav.gif" title="BigQuery navigation to credentials" />

On the **Credentials** page, you can see your existing keys, client IDs, and service accounts.

Set up an [OAuth consent screen](https://support.google.com/cloud/answer/6158849) if you haven't already. Then, click **+ Create Credentials** at the top of the page and select **OAuth client ID**.

Fill in the client ID configuration. **Authorized JavaScript Origins** are not applicable. Add an item to **Authorized redirect URIs** and replace `REDIRECT_URI` with the value you copied to your clipboard earlier from the connection's **OAuth 2.0 Settings** section in <Constant name="cloud" />:

| Config                       | Value           |
| ---------------------------- | --------------- |
| **Application type**         | Web application |
| **Name**                     | <Constant name="cloud" />       |
| **Authorized redirect URIs** | `REDIRECT_URI`  |

Then click **Create** to create the BigQuery OAuth app and see the app client ID and secret values. These values are available even if you close the app screen, so this isn't the only chance you have to save them.

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/dbt-cloud-enterprise/BQ-auth/bq-oauth-app-02.png" title="Create an OAuth app in BigQuery" />

### Configure the Connection in dbt
Now that you have an OAuth app set up in BigQuery, you'll need to add the client ID and secret to <Constant name="cloud" />. To do so:
 1. Navigate back to the Connection details page, as described in [Locate the redirect URI value](#locate-the-redirect-uri-value).
 2. Add the client ID and secret from the BigQuery OAuth app under the **OAuth 2.0 Settings** section.
 3. Enter the BigQuery token URI. The default value is `https://oauth2.googleapis.com/token`. 

### Authenticating to BigQuery
Once the BigQuery OAuth app is set up for a <Constant name="cloud" /> project, each <Constant name="cloud" /> user will need to authenticate with BigQuery in order to use the <Constant name="cloud_ide" />. To do so:

- Navigate to your account name, above your profile icon on the left side panel
- Select **Account settings** from the menu
- From the left sidebar, select **Credentials**
- Choose the project from the list
- Select **Authenticate BigQuery Account**

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/dbt-cloud-enterprise/developer-bq-auth.gif" title="Authenticating to BigQuery" />

You will then be redirected to BigQuery and asked to approve the drive, cloud platform, and BigQuery scopes, unless the connection is less privileged.
<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/dbt-cloud-enterprise/BQ-auth/BQ-access.png" width="50%" title="BigQuery access request" />

Select **Allow**. This redirects you back to <Constant name="cloud" />. You are now an authenticated BigQuery user and can begin accessing dbt development tools. 

## Set up BigQuery Workload Identity Federation <Lifecycle status= "managed, Preview" /> 

Workload Identity Federation (WIF) allows application workloads, running externally to <Constant name="cloud" />, to act as a service account without the need to manage service accounts or other keys for deployment environments. The following instructions will enable you to authenticate your BigQuery connection in <Constant name="cloud" /> using WIF. 
Currently, Microsoft Entra ID is the only supported identity provider (IdP). If you need additional IdP support, please contact your account team.

### 1. Set up Entra ID

Create an app in Entra where dbt will request access tokens when authenticating to BigQuery via the workload identity pool:

1. From the **app registrations** screen, click **New registration**.
2. Give the app a name that makes it easily identifiable.
3. Ensure **Supported account types** are set to “Accounts in this organizational directory only (Org name - Single Tenant).”
4. Click **Register** to see the application’s overview screen.
5. From the **app overview**, click **Expose an API** in the left menu.
6. Click **Add** next to Application ID URI. The field will automatically populate. 
7. Click **Save**.

Workload Identity Federation utilizes a machine-to-machine OAuth flow that is unattended by the user; as such, a redirect URI won't need to be set for the application. Step 3 in this section is crucial because it determines the audience for tokens issued from the app and informs the workpool in GCP whether the calling application has permission to access the resources guarded by the workpool.

- **Related documentation:** [GCP &mdash; Prepare your external identity provider](https://cloud.google.com/iam/docs/workload-identity-federation-with-other-clouds#create)

### 2. Create a Workpool and Workpool Provider in GCP

1. In your GCP account's main menu, navigate to **IAM & Admin** and click the **Workload Identity Federation** option (not to be confused with the **Work_force_ Identity Federation** option directly adjacent). 
2. If you haven’t created a workpool yet, click **Get started** or create a new workpool (use button near the top of the page).
3. Give the workpool a name and description. Per the [GCP documentation](https://cloud.google.com/iam/docs/workload-identity-federation#pools), a new pool should be created for each non-Google Cloud environment that needs to access Google Cloud resources, such as development, staging, or production environments. The workpool should be named accordingly to make it easily identifiable in the future.
4. When creating your provider:
    - Set the type of the provider to **OpenID Connect (OIDC)**.
    - Name the provider something identifiable, like `Entra ID`.
    - Set the URL to https://sts.windows.net/YOUR_TENANT_ID/. This can be found in the token itself, if you decode it via jwt.io. You can also see a reference to the expected issuer URL for Entra in the [GCP documentation for WIF](https://cloud.google.com/iam/docs/workload-identity-federation-with-other-clouds#create_the_workload_identity_pool_and_provider).
        - The tenant (provider) ID can be found in the app registration created in [section 1 of these instructions](#1-set-up-entra-id); it's called **Directory (tenant) ID** and can be found in the overview section for the application.
    - For **Audiences**, select **Allowed Audiences** and set the value to the **Application ID URI** that was defined for your Entra ID app.
5. Click **Continue**.
6. Under **Configure provider attributes**, set the mapping for `google.subject` to `assertion.sub`.
7. Click **Save**.

### 3. Service Account Impersonation

A workpool either uses a service account or is granted direct resource access to determine which resources a caller can access. The [GCP documentation](https://cloud.google.com/iam/docs/workload-identity-federation-with-other-clouds#access) provides more detailed information on configuring both for your workpool. We chose the service account approach in our implementation because it offered greater flexibility.

If you haven’t already, create a new service account:
1. From the main menu, select **IAM & Admin** 
2. Click **Service Accounts**. 
3. Click **Create service account**. Google recommends creating a service account per workload.
4. Assign the relevant roles you would like this service account to have. In our experience, `BigQuery Admin` is the default role with required access.

Once you’ve created the service account, navigate back to the workpool you created in the previous step: 
1. Click the **Grant Access** option at the top of the page.
2. Select **Grant access using Service Account Impersonation**.
3. Select the service account you just created.
4. Under **Select Principals**, set `subject` as the **Attribute Name**. For the **Attribute Value**, you’ll want to set it to the value assigned to the sub on the token. You can retrieve this value directly from the access token.

### 4. Set up dbt

To configure a BigQuery connection to use WIF authentication in <Constant name="cloud" />, you must set up a custom OAuth integration configured with details from the Entra application used as your workpool provider in GCP.

In <Constant name="cloud" />: 

1. Navigate to **Account settings** --> **Integrations** 
2. Scroll down to the section for **Custom OAuth Integrations** and create a new integration, 
3. Fill out all fields with the appropriate information from your IdP environment.
    - The Application ID URI should be set to the expected audience claim on tokens issued from the Entra application. It will be the same URI your workpool provider has been configured to expect.
    - You do not have to add the Redirect URI to your Entra application

### 5. Create connections in dbt

To get started, create a new connection in <Constant name="cloud" />:

1. Navigate to **Account settings** --> **Connections**.
2. Click **New connection** and select **BigQuery** as the connection type. You will then see the option to select **BigQuery** or **BigQuery (Legacy)**. Select **BigQuery**.
3. For the **Deployment Environment Authentication Method**, select **Workload Identity Federation**.
4. Fill out the **Google Cloud Project ID** and any optional settings you need.
5. Select the OAuth Configuration you created in the previous section from the drop-down. 
6. Configure your development connection: 
    - [BigQuery OAuth](#bigquery-oauth) (recommended)
        - Set this up in the same connection as the one you're using for WIF under **`OAuth2.0 settings`**
    - Service JSON 
        - You must create a separate connection with the Service JSON configuration.

### 6. Set up project

To connect a new project to your WIF configuration:
1. Navigate to **Account settings** --> **Projects**.
2. Click **New project**. 
3. Give your project a name and (optional) subdirectory path and click **Continue**.
4. Select the **Connection** with the WIF configuration.
5. Configure the remainder of the project with the appropriate fields.

### 7. Set up deployment environment

Create a new or updated environment to use the WIF connection. 

When you set your environment connection to the WIF configuration, you will then see two fields appear under the Deployment credentials section: 
- **Workload pool provider path:** This field is required for all WIF configurations.
    Example: `//iam.googleapis.com/projects/<numeric_project_id>/locations/global/workloadIdentityPools/<workpool_name>/providers/<workpool_providername>`
- **Service account impersonation URL:** Used only if you’ve configured your workpool to use a service account impersonation for accessing your BigQuery resources (as opposed to granting the workpool direct resource access to the BigQuery resources).
    Example: `https://iamcredentials.googleapis.com/v1/projects/-/serviceAccounts<serviceaccountemail>:generateAccessToken`

If you don’t already have a job based on the deployment environment with a connection set up for WIF, you should create one now. Once you’ve configured it with the preferred settings, run the job.

## FAQs

<FAQ path="Warehouse/bq-oauth-drive-scope" />

## Learn More

<WistiaVideo id="m7twurlmgt" paddingTweak="62.25%" />
