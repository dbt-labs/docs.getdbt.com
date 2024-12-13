---
title: "Set up the dbt Snowflake Native App"
description: "Learn how to set up the dbt Snowflake Native App"
pagination_prev: "docs/cloud-integrations/snowflake-native-app"
pagination_next: null
---

# Set up the dbt Snowflake Native App <Lifecycle status='preview' />

The [dbt Snowflake Native App](/docs/cloud-integrations/snowflake-native-app) enables these features within the Snowflake user interface: dbt Explorer, the **Ask dbt** chatbot, and dbt Cloud's orchestration observability features. 

Configure both dbt Cloud and Snowflake to set up this integration. The high-level steps are described as follows: 

1. Set up the **Ask dbt** configuration. 
1. Configure Snowflake. 
1. Configure dbt Cloud.
1. Purchase and install the dbt Snowflake Native App.
1. Configure the app.
1. Verify successful installation of the app.
1. Onboard new users to the app.

The order of the steps is slightly different if you purchased the public listing of the Native App; you'll start by purchasing the Native App, satisfying the prerequisites, and then completing the remaining steps in order.  

## Prerequisites
The following are the prerequisites for dbt Cloud and Snowflake. 

### dbt Cloud

- You must have a dbt Cloud account on the Enterprise plan that's in an AWS Region or Azure region. If you don't already have one, please [contact us](mailto:sales_snowflake_marketplace@dbtlabs.com) to get started.
    - Currently, Semantic Layer is unavailable for Azure ST instances and the **Ask dbt** chatbot will not function in the dbt Snowflake Native App without it. 
- Your dbt Cloud account must have permission to create a [service token](/docs/dbt-cloud-apis/service-tokens). For details, refer to [Enterprise permissions](/docs/cloud/manage-access/enterprise-permissions).
- There's a dbt Cloud project with [Semantic Layer configured](/docs/use-dbt-semantic-layer/setup-sl) and metrics declared. 
- You have set up a [production deployment environment](/docs/deploy/deploy-environments#set-as-production-environment).
    - There has been at least one successful job run that includes a `docs generate` step in the deployment environment.

### Snowflake

- You have **ACCOUNTADMIN** access in Snowflake.
- Your Snowflake account must have access to the Native App/SPCS integration and NA/SPCS configurations (Public Preview planned at end of June). If you're unsure, please check with your Snowflake account manager.
- The Snowflake account must be in an AWS Region. Azure is not currently supported for Native App/SPCS integration. 
- You have access to Snowflake Cortex through your Snowflake permissions and [Snowflake Cortex is available in your region](https://docs.snowflake.com/en/user-guide/snowflake-cortex/llm-functions#availability). Without this, Ask dbt will not work.

## Set up the configuration for Ask dbt

Configure dbt Cloud and Snowflake Cortex to power the **Ask dbt** chatbot.

1. In dbt Cloud, browse to your Semantic Layer configurations. 

    1. Navigate to the left hand side panel and click your account name. From there, select **Account settings**. 
    1. In the left sidebar, select **Projects** and choose your dbt project from the project list. 

    1. In the **Project details** panel, click the **Edit Semantic Layer Configuration** link (which is below the **GraphQL URL** option). 
1. In the **Semantic Layer Configuration Details** panel, identify the Snowflake credentials (which you'll use to access Snowflake Cortex) and the environment against which the Semantic Layer is run. Save the username, role, and the environment in a temporary location to use later on. 

    <Lightbox src="/img/docs/cloud-integrations/semantic_layer_configuration.png" width="100%" title="Semantic Layer credentials"/>

1. In Snowflake, verify that your SL and deployment user has been granted permission to use Snowflake Cortex. For more information, refer to [Required Privileges](https://docs.snowflake.com/en/user-guide/snowflake-cortex/llm-functions#required-privileges) in the Snowflake docs. 
    
    By default, all users should have access to Snowflake Cortex. If this is disabled for you, open a Snowflake SQL worksheet and run these statements:

    ```sql
    create role cortex_user_role;
    grant database role SNOWFLAKE.CORTEX_USER to role cortex_user_role;
    grant role cortex_user_role to user SL_USER;
    grant role cortex_user_role to user DEPLOYMENT_USER;
    ```

    Make sure to replace `SNOWFLAKE.CORTEX_USER`, `DEPLOYMENT_USER`, and `SL_USER` with the appropriate strings for your environment.

## Configure dbt Cloud 
Collect the following pieces of information from dbt Cloud to set up the application. 

1. Navigate to the left-hand side panel and click your account name. From there, select **Account settings**. Then click **API tokens > Service tokens**. Create a service token with access to all the projects you want to access in the dbt Snowflake Native App. Grant these permission sets: 
    - **Manage marketplace apps**
    - **Job Admin**
    - **Metadata Only**
    - **Semantic Layer Only**

    Make sure to save the token information in a temporary location to use later during Native App configuration.

    The following is an example of granting the permission sets to all projects:

    <Lightbox src="/img/docs/cloud-integrations/example-snowflake-native-app-service-token.png" title="Example of a new service token for the dbt Snowflake Native App"/>

1. From the left sidebar, select **Account** and save this information in a temporary location to use later during Native App configuration:
    - **Account ID** &mdash; A numerical string representing your dbt Cloud account.
    - **Access URL** &mdash; If you have a North America multi-tenant account, use `cloud.getdbt.com` as the access URL. For all other regions, refer to [Access, Regions, & IP addresses](/docs/cloud/about-cloud/access-regions-ip-addresses) and look up the access URL you should use in the table. 

## Install the dbt Snowflake Native App
1. Browse to the listing for the dbt Snowflake Native App: 
    - **Private listing** (recommended) &mdash; Use the link from the email sent to you. 
    - **Public listing** &mdash; Navigate to the [Snowflake Marketplace](https://app.snowflake.com/marketplace/listing/GZTYZSRT2R3). 
1. Click **Get** on the listing to install the dbt Snowflake Native App. This can take several minutes. When installation is complete, an email is sent to you. 
    
    A message will appear asking if you want to change the application and grant access to the warehouse for installation. dbt Labs strongly recommends not changing the application name unless necessary.
1. When the dbt Snowflake Native App is successfully installed, click **Configure** in the modal window. 

## Configure the dbt Snowflake Native App

1. On the **Activate dbt** page, click **Grant** in **Step 1: Grant Account Privileges**.
1. When privileges have been successfully granted, click **Review** in **Step 2: Allow Connections**. 

    Walk through the **Connect to dbt Cloud External Access Integration** steps. You will need your dbt Cloud account information that you collected earlier. Enter your account ID, access URL, and API service token as the **Secret value** when prompted. 
1. On the **Activate dbt** page, click **Activate** when you've established a successful connection to the dbt Cloud External Access Integration. It can take a few minutes to spin up the required Snowflake services and compute resources. 
1. When activation is complete, select the **Telemetry** tab and enable the option to share your `INFO` logs. The option might take some time to display. This is because Snowflake needs to create the events table so it can be shared.
1. When the option is successfully enabled, click **Launch app**. Then, log in to the app with your Snowflake credentials. 
    
    If it redirects you to a Snowsight worksheet (instead of the login page), that means the app hasn't finished installing. You can resolve this issue, typically, by refreshing the page.   

    The following is an example of the dbt Snowflake Native App after configuration:

    <Lightbox src="/img/docs/cloud-integrations/example-dbt-snowflake-native-app.png" title="Example of the dbt Snowflake Native App"/>

## Verify the app installed successfully

To verify the app installed successfully, select any of the following from the sidebar:

- **Explore** &mdash; Launch dbt Explorer and make sure you can access your dbt project information.
- **Jobs** &mdash; Review the run history of the dbt jobs. 
- **Ask dbt** &mdash; Click on any of the suggested prompts to ask the chatbot a question. Depending on the number of metrics that's defined for the dbt project, it can take several minutes to load **Ask dbt** the first time because dbt is building the Retrieval Augmented Generation (RAG). Subsequent launches will load faster.


The following is an example of the **Ask dbt** chatbot with the suggested prompts near the top: 

<Lightbox src="/img/docs/cloud-integrations/example-ask-dbt-native-app.png" title="Example of the Ask dbt chatbot"/>


## Onboard new users
1. From the sidebar in Snowflake, select **Data Products > Apps**. Choose **dbt** from the list to open the app's configuration page. Then, click **Manage access** (in the upper right) to onboard new users to the application. Grant the **APP_USER** role to the appropriate roles that should have access to the application but not the ability to edit the configurations. Grant **APP_ADMIN** to roles that should have access to edit or remove the configurations.

1. New users can access the app with either the Snowflake app URL that's been shared with them, or by clicking **Launch app** from the app's configuration page.


## FAQs

<Expandable alt_header="Unable to install the dbt Cloud Snowflake Native app from the Snowflake Marketplace" >

The dbt Cloud Snowflake Native App is not available to Snowflake Free Trial accounts.

</Expandable>

<Expandable alt_header="Received the error message `Unable to access schema dbt_sl_llm` from Ask dbt" >

Check that the SL user has been granted access to the `dbt_sl_llm` schema and make sure they have all the necessary permissions to read and write from the schema.

</Expandable>

<Expandable alt_header="Need to update the dbt configuration options used by the Native App" >

If there's been an update to the dbt Cloud account ID, access URL, or API service token, you need to update the configuration for the dbt Snowflake Native App. In Snowflake, navigate to the app's configuration page and delete the existing configurations. Add the new configuration and then run `CALL app_public.restart_app();` in the application database in Snowsight. 
</Expandable>

<Expandable alt_header="Are environment variables supported in the Native App?" >

[Environment variables](/docs/build/environment-variables), like `{{env_var('DBT_WAREHOUSE') }}` aren’t supported in the dbt Semantic Layer yet. To use the 'Ask dbt' feature, you must use the actual credentials instead.
</Expandable>
