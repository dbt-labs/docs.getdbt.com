---
title: "Set up the Snowflake Native App"
description: "Learn how to set up the Snowflake Native App for dbt Cloud"
pagination_prev: "docs/cloud-integrations/snowflake-native-app"
pagination_next: null
---

# Set up the Snowflake Native App <Lifecycle status='public preview' />

The Snowflake Native App for dbt Cloud enables these features within the Snowflake user interface: dbt Explorer, Ask dbt (a dbt-assisted chatbot powered by the dbt Semantic Layer and Snowflake Cortex), and dbt's orchestration. 

Configure both dbt Cloud and Snowflake to set up this integration. Below is an illustration of the setup process. The steps are slightly different if you purchased the public listing of the Native App; you will start with Step 2, satisfy the prerequisites, and then complete Steps 1 and 3.

<Lightbox src="/img/docs/cloud-integrations/overview-snowflake-native-app.png" width="100%" title="Overview of the Snowflake Native App for dbt Cloud"/>


## Prerequisites
The following are the prerequisites for dbt Cloud and Snowflake. 

### dbt Cloud

- You must have a dbt Cloud account on the Enterprise plan that's in an AWS Region or Azure region. If you don't already have one, please [contact us](mailto:sales_snowflake_marketplace@dbtlabs.com) to get started.
    - For more information about regions, refer to [Choosing a Region](https://docs.aws.amazon.com/awsconsolehelpdocs/latest/gsg/select-region.html) in the AWS docs or [Choose the Right Azure Region for You](https://azure.microsoft.com/en-us/explore/global-infrastructure/geographies/#overview) in the Microsoft Azure docs.
    - Currently, Semantic Layer is unavailable for Azure ST instances. 
- Your dbt Cloud account must have permission to create a service token. For details, refer to Enterprise permissions
- There's a dbt project with Semantic Layer configured and metrics declared. You must set up the Semantic Layer credentials with permissions to use Snowflake Cortex and read/write permissions on a schema named `DBT_SL_CACHE` in the deployment environment connected to the Semantic Layer environment. You will need to create the schema if it does not exist already. 
- You have set up a [production deployment environment](/docs/deploy/deploy-environments#set-as-production-environment).
    - There has been at least one successful job run that includes a `docs generate` step in the deployment environment.

### Snowflake

- You have `ACCOUNTADMIN` access in Snowflake.
- Your Snowflake account must have access to the Native App/SPCS integration (PrPr until Summit) and NA/SPCS configurations (PuPr at end of June). If you're unsure, please check with your Snowflake account manager.
- The Snowflake account must be in an AWS Region or Azure region. 


## Configure dbt Cloud 

1. From the gear menu in dbt Cloud, select **Account settings**. In the left sidebar, select **API tokens > Service tokens**. Create a service token with access to all the projects you want to access in the Native App. Grant these permission sets: 
    - Job Admin
    - Metadata Only
    - Semantic Layer
2. Save that token information in a temporary location to use for Native app setup. 
3. Navigate to **Account** in the sidebar and copy down this information:
    - Account ID
    - Access URL 
        - If you don't have an access URL section in account settings, check your region and provide your browser URL to up the `.com`. For more information, refer to [Access, Regions, & IP addresses](/docs/cloud/about-cloud/access-regions-ip-addresses).

## Install the Snowflake Native App for dbt Cloud
1. Browse to the Snowflake Native App listing. 
    - For the public listing &mdash; Navigate to the [Snowflake Marketplace and search for dbt Labs](https://app.snowflake.com/marketplace/data-products/search?search=dbt%20Labs).
    - For the private listing &mdash Use the link from the email sent to you. 
2. Click **Install app** on the listing for dbt Cloud. A message will appear asking if you want to change the application and grant access to the warehouse for installation; dbt Labs strongly recommends not changing the application name unless necessary.
4. Click **Configure** when the Snowflake Native App is successfully installed. This can take several minutes. An email is also sent to you when configuration is complete. 

## Configure the Snowflake Native App
1. Click **Grant** next to `Step 1: Grant Account Privileges`.
1. Click **Review** for `dbt Cloud External Access Integration` and go through the flow. This is the section where you will need your dbt Cloud account information. 
1. Click **Activate** to activate the application. It can take a few minutes to spin up the required Snowflake services and compute resources. 
1. When activation is done, click **Launch App** and log in using your Snowflake credentials. If it redirects to a Snowsight worksheet, the app has not finished installation. If you leave the application and come back, it should resolve the issue.    

## Verify the app installed successfully

To verify the app installed successfully, you can perform any or all of the following:

- Use dbt Explorer and make sure you can access your dbt project information. 
- Pose a question for Ask dbt.

## Onboard new users
1. In the application, click **Manage access** to onboard new users to the application. Grant the `app_user` role to the appropriate roles. 

2. Share the Snowflake app URL to the new users or they can access the application from the **Launch app** button on the app configuration page. 
