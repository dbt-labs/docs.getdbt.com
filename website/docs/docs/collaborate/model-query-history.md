---
title: "Model query history"
sidebar_label: "model-query-history"
description: "Import and auto-generate exposures from dashboards and understand how models are used in downstream tools for a richer lineage."
---

# About model query history <Lifecycle status='beta' />

The model query history tile allows you to:

- View the query count for a model based on the data warehouse's query logs.
- Provides data teams insight so they can focus their time and infrastructure spend on the worthwhile used data products.
- Enable analysts to find the most popular models used by other people.

Model query history is powered by a single query of query log table in your data warehouse aggregated on a daily basis. It filters down to `select` statements only to gauge model consumption and excludes dbt model build and test executions.

Available for Snowflake and BigQuery users initially

## Prerequisites

To access the features, you should meet the following:

1. You have a dbt Cloud account on the [Enterprise plan](https://www.getdbt.com/pricing/).
2. You have set up a [production](https://docs.getdbt.com/docs/deploy/deploy-environments#set-as-production-environment) deployment environment for each project you want to explore, with at least one successful job run. 
3. You have admin permissions in dbt Cloud to edit project settings or production environment settings.
4. For model query history: You use Snowflake or BigQuery as your data warehouse and can enable query history permissions or work with an admin to do so. 

## Enable query history

This section of the document explains the steps you need to enable and view model query history in dbt Explorer.

The model query history feature uses the credentials in your production environment to gather metadata from your data warehouse’s query logs. To confirm the credentials you’ll enable the permissions for:

1. Navigate to **Deploy** → **Environments**
2. Select the Environment marked **PROD** and **c**lick **Settings**.
3. Look at the information under **Deployment credentials**
    1. Note: Querying query history entails warehouse costs / uses credits. 

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/d044428d-35c1-45b8-8e9c-df25f39d8ced/8cc7de7f-e847-490f-ab37-3497a661ae77/Untitled.png)

## Required query history warehouse permissions

This feature may require elevated permissions with the warehouse.

### Snowflake

This feature makes use of metadata tables available to Snowflake Enterprise tier accounts or higher, `QUERY_HISTORY` and `ACCESS_HISTORY`. The snowflake user used in the production environment must have `GOVERNANCE_VIEWER` permissions to view the data. This can be granted to this user by your `ACCOUNTADMIN` user in Snowflake. For more details, view the snowflake docs [here](https://docs.snowflake.com/en/sql-reference/account-usage#enabling-other-roles-to-use-schemas-in-the-snowflake-database).

### BigQuery

This feature uses the metadata from the `INFORMATION_SCHEMA.JOBS` view in BigQuery. To access this, the user configured for your production environment must have the following [IAM roles](https://cloud.google.com/bigquery/docs/access-control) for your Bigquery project:

- `roles/bigquery.resourceViewer`
- `roles/bigquery.jobs.create`

## Later: Enable query history for the environment within dbt Cloud

:::info
During the beta, the dbt Labs team will manually enable query history for your dbt Cloud projects. Later on, you’ll be able to do it yourself.

:::

1. *Navigate to Deploy → Environments*
2. *Select the Environment marked “PROD”*
3. *Click “Settings”*
4. *Enable the checkbox for query history within “General Settings”* 
5. *Click the “Test” button to validate the deployment credentials permissions are sufficient to support query history*

## View query history metrics in Explorer

To enhance your discovery, you can view your model query history in various locations within dbt Explorer.  

For details on how to access model query history in each location, expand the following toggles:

<!--add expandable toggles -->

- **Performance charts**
    1. Navigate to dbt Explorer by clicking on the **Explore** link in the navigation.
    2. In the main **Overview** page, under **Project** click **Performance** and scroll down to view the most queried models
        
        ![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/d044428d-35c1-45b8-8e9c-df25f39d8ced/34695b2f-323e-4dc8-8d4d-16fab479b726/Untitled.png)
        
    3. In the model performance tab, open the “Usage” chart to see queries over time for that model. 
        
        ![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/d044428d-35c1-45b8-8e9c-df25f39d8ced/363419f9-4253-45ab-8f05-d6f821115276/Untitled.png)
        
- **Project lineage**
    1. To view your model in your project lineage, go to the main **Overview page** and click on **Project lineage.**
    2. In the lower left of your lineage, click on **Lenses** and select **Usage queries.** 
        
        ![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/d044428d-35c1-45b8-8e9c-df25f39d8ced/185c112e-a133-4cdb-889e-def9b9cdbb5a/Untitled.png)
        
    3. Your lineage should display a small red box above each model, indicating the usage query number for each model. The query number for each model represents the query history over the last 30 days.
- **Model list**
    1. To view your model in your project lineage, go to the main **Overview page** and click on **Project lineage.**
    2. In the left navigation, go to the **Resources** tab and click on **Models** to view the models list.
    3. You can view the usage query count for the models and sort by most or least queried. 
        
        ![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/d044428d-35c1-45b8-8e9c-df25f39d8ced/a65b686b-bf75-449d-a183-4ccaf61f7183/Untitled.png)
