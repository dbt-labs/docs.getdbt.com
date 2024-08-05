---
title: "Model query history"
sidebar_label: "Model query history"
description: "Import and auto-generate exposures from dashboards and understand how models are used in downstream tools for a richer lineage."
---

# About model query history <Lifecycle status='beta' />

The model query history tile allows you to:

- View the query count for a model based on the data warehouse's query logs.
- Provides data teams insight so they can focus their time and infrastructure spend on the worthwhile used data products.
- Enable analysts to find the most popular models used by other people.

Model query history is powered by a single query of query log table in your data warehouse aggregated on a daily basis. It filters down to `select` statements only to gauge model consumption and excludes dbt model build and test executions.

Available for Snowflake and BigQuery users initially.

## Prerequisites

To access the features, you should meet the following:

1. You have a dbt Cloud account on the [Enterprise plan](https://www.getdbt.com/pricing/).
2. You have set up a [production](https://docs.getdbt.com/docs/deploy/deploy-environments#set-as-production-environment) deployment environment for each project you want to explore, with at least one successful job run. 
3. You have admin permissions in dbt Cloud to edit project settings or production environment settings.
4. Use Snowflake or BigQuery as your data warehouse and can enable query history permissions or work with an admin to do so. (Support for additional data platforms coming soon)

## Credential permissions

This section of the document explains the permissions and steps you need to enable and view model query history in dbt Explorer.

The model query history feature uses the credentials in your production environment to gather metadata from your data warehouse’s query logs. This means you may need elevated permissions with the warehouse. Before making any changes to your data platform permissions, confirm the configured permissions in dbt Cloud:

1. Navigate to **Deploy** and then **Environments**.
2. Select the Environment marked **PROD** and click **Settings**.
3. Look at the information under **Deployment credentials**. 
   - Note: Querying query history entails warehouse costs / uses credits.
4. Navigate to **Deploy** and then **Environments**.
5. Select the Environment marked **PROD** and click **Settings**.
6. Look at the information under **Deployment credentials**.
   - Note: Querying query history entails warehouse costs / uses credits. 

<Lightbox src="/img/docs/collaborate/dbt-explorer/model-query-credentials.jpg" width="50%" title="Confirm your deployment credentials in your environment settings page." />

7. You can cross reference those credential permissions with the warehouse permissions and grant your user the right permissions.

    <Expandable alt_header="For Snowflake">

    This feature makes use of metadata tables available to Snowflake Enterprise tier accounts or higher, `QUERY_HISTORY` and `ACCESS_HISTORY`. The snowflake user used in the production environment must have `GOVERNANCE_VIEWER` permissions to view the data. 
    
    This can be granted to this user by your `ACCOUNTADMIN` user in Snowflake. For more details, view the snowflake docs [here](https://docs.snowflake.com/en/sql-reference/account-usage#enabling-other-roles-to-use-schemas-in-the-snowflake-database).

    </Expandable>

    <Expandable alt_header="For BigQuery">

    This feature uses the metadata from the `INFORMATION_SCHEMA.JOBS` view in BigQuery. To access this, the user configured for your production environment must have the following [IAM roles](https://cloud.google.com/bigquery/docs/access-control) for your Bigquery project:

    - `roles/bigquery.resourceViewer`
    - `roles/bigquery.jobs.create`

    </Expandable>

## Enable query history in dbt Cloud

:::info
During the beta, the dbt Labs team will manually enable query history for your dbt Cloud projects. Later on, you’ll be able to do it yourself.

:::

1. Navigate to **Deploy** and then **Environments**.
2. Select the environment marked **PROD** and click **Settings**. 
3. Enable the checkbox for query history within **General Settings**. 
4. Click the **Test** button to validate the deployment credentials permissions are sufficient to support query history.

## View query history in Explorer

To enhance your discovery, you can view your model query history in various locations within dbt Explorer.  

For details on how to access model query history in each location, expand the following toggles:

<Expandable alt_header="Performance charts">

1. Navigate to dbt Explorer by clicking on the **Explore** link in the navigation.
2. In the main **Overview** page, under **Project** click **Performance** and scroll down to view the most queried models
3. Use the dropdown menu to select the desired time period, with options available for up to the past 3 months. 

<Lightbox src="/img/docs/collaborate/dbt-explorer/model-query-queried-models.jpg" width="70%" title="View most queried models in 'Performance' page in dbt Explorer." />

4. In the model performance tab, open the **Usage** chart to see queries over time for that model.
<Lightbox src="/img/docs/collaborate/dbt-explorer/model-query-usage-queries.jpg" width="70%" title="View queries over time for a given model." />

</Expandable>

<Expandable alt_header="Project lineage">

1. To view your model in your project lineage, go to the main **Overview page** and click on **Project lineage.**
2. In the lower left of your lineage, click on **Lenses** and select **Usage queries**. 
<Lightbox src="/img/docs/collaborate/dbt-explorer/model-query-lenses.jpg" width="85%" title="View model usage query in your lineage using the 'Lenses' feature." />

3. Your lineage should display a small red box above each model, indicating the usage query number for each model. The query number for each model represents the query history over the last 30 days.

</Expandable>

<Expandable alt_header="Model list">

1. To view your model in your project lineage, go to the main **Overview page** and click on **Project lineage.**
2. In the left navigation, go to the **Resources** tab and click on **Models** to view the models list.
3. You can view the usage query count for the models and sort by most or least queried. The query number for each model represents the query history over the last 30 days.
<Lightbox src="/img/docs/collaborate/dbt-explorer/model-query-list.jpg" width="85%" title="View models query history in the 'Models' list page under the 'Usage' column." />

</Expandable>
