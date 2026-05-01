---
title: "Model query history"
sidebar_label: "Model query history"
description: "Import and auto-generate exposures from dashboards and understand how models are used in downstream tools for a richer lineage."
image: /img/docs/collaborate/dbt-explorer/model-query-queried-models.jpg
---

# Model query history <Lifecycle status="managed,managed_plus" />

<IntroText>
Model query history helps data teams track model usage by analyzing query logs.
</IntroText>

Model query history allows you to:

- View the count of consumption queries for a model based on the data warehouse's query logs. 
- Provides data teams insight, so they can focus their time and infrastructure spend on the worthwhile used data products.
- Enable analysts to find the most popular models used by other people.

Model query history is powered by a single consumption query of the query log table in your data warehouse aggregated on a daily basis. 

<Expandable alt_header="What is a consumption query?">

Consumption query is a metric of queries in your dbt project that has used the model in a given time. It filters down to `select` statements only to gauge model consumption and excludes dbt model build and test executions.

So for example, if `model_super_santi` was queried 10 times in the past week, it would count as having 10 consumption queries for that particular time period.
</Expandable>

Model query history is supported in the following data warehouses: 
- Snowflake (Enterprise-tier or higher)
- BigQuery
- Redshift <Lifecycle status="beta" />
- Databricks <Lifecycle status="beta" />

## Prerequisites

To access the features, you should meet the following requirements:

- You have a <Constant name="dbt" /> account on an [Enterprise-tier plan](https://www.getdbt.com/pricing/). Single-tenant accounts should contact their account representative for setup.
- You have set up a [production](/docs/deploy/deploy-environments#set-as-production-environment) deployment environment for each project you want to explore, with at least one successful job run. 
- You have [admin permissions](/docs/platform/manage-access/enterprise-permissions) in <Constant name="dbt" /> to edit project settings or production environment settings.
- You use Snowflake, BigQuery, Redshift, or Databricks as your data warehouse and can enable [query history permissions](#credential-permissions) or work with an admin to do so.
   - For Snowflake users: You must have a Snowflake Enterprise-tier or higher subscription.

## Enable query history in dbt

To enable model query history in <Constant name="dbt" />, follow these steps:

1. Navigate to **Orchestration** and then **Environments**.
2. Select the environment marked **PROD** and click **Settings**.
3. Click **Edit** and scroll to the **Query History** section.
4. Click the **Test Permissions** button to validate the deployment credentials permissions are sufficient to support query history.
5. Click the **Enable query history** box to enable. 
6. **Save** your settings.

<Constant name="dbt" /> automatically enables query history for brand new environments. If query history fails to retrieve data, <Constant name="dbt" /> automatically disables it to prevent unintended warehouse costs.
   - If the failure is temporary (like a network timeout), <Constant name="dbt" /> may retry.
   - If the problem keeps happening (for example, missing permissions), <Constant name="dbt" /> turns off query history so customers don’t waste warehouse compute.
   
   To turn it back on, click **Test Permissions** in **Environment settings**. If the test succeeds, <Constant name="dbt" /> re-enables the environment.


<Lightbox src="/img/docs/collaborate/dbt-explorer/enable-query-history.png" width="95%" title="Enable query history in your environment settings." />



## Credential permissions

This section explains the permissions and steps you need to enable and view model query history in <Constant name="catalog" />.

The model query history feature uses the credentials in your production environment to gather metadata from your data warehouse’s query logs. This means you may need elevated permissions with the warehouse. Before making any changes to your data platform permissions, confirm the configured permissions in <Constant name="dbt" />:

1. Navigate to **Deploy** and then **Environments**.
2. Select the Environment marked **PROD** and click **Settings**.
3. Look at the information under **Deployment credentials**. 
   - Note: Querying query history entails warehouse costs / uses credits.
<Lightbox src="/img/docs/collaborate/dbt-explorer/model-query-credentials.jpg" width="50%" title="Confirm your deployment credentials in your environment settings page." />

4. Copy or cross reference those credential permissions with the warehouse permissions and grant your user the right permissions.

### Snowflake model query history

Model query history uses metadata tables available to [Snowflake Enterprise-tier](https://docs.snowflake.com/en/user-guide/intro-editions#enterprise-edition) accounts or higher: `QUERY_HISTORY` and `ACCESS_HISTORY`. The Snowflake user in the production environment must have the `GOVERNANCE_VIEWER` permission to view the data.

Before enabling model query history, your `ACCOUNTADMIN` must run the following grant statement in Snowflake to ensure access:

```sql
GRANT DATABASE ROLE SNOWFLAKE.GOVERNANCE_VIEWER TO ROLE <YOUR_DBT_CLOUD_DEPLOYMENT_ROLE>;
```

Without this grant, model query history won't display any data. For more information, refer to the [Snowflake documentation](https://docs.snowflake.com/en/sql-reference/account-usage#enabling-other-roles-to-use-schemas-in-the-snowflake-database). 

### BigQuery model query history

The model query history uses metadata from the [`INFORMATION_SCHEMA.JOBS` view](https://docs.cloud.google.com/bigquery/docs/information-schema-jobs) in BigQuery. To access the metadata, the production environment user must have the correct [IAM role](https://docs.cloud.google.com/bigquery/docs/access-control#bigquery.resourceViewer) or permission to access this data:

- If you use a BigQuery provided role, we recommend `roles/bigquery.resourceViewer`.
- If you use a custom role, ensure it includes the `bigquery.jobs.listAll permission`.

### Redshift model query history<Lifecycle status="beta" />

Model query history uses the `SYS_QUERY_HISTORY` and `SYS_QUERY_DETAIL` system views in Redshift. By default, users can only see their own queries in these views. To surface query history across all warehouse users, your database admin must grant the production environment credentials one of the following:

- The `sys:monitor` role:

  ```sql
  GRANT ROLE sys:monitor TO <YOUR_DBT_USER>;
  ```
- Unrestricted syslog access on the user:

  ```sql
  ALTER USER <YOUR_DBT_USER> SYSLOG ACCESS UNRESTRICTED;
  ```

Without one of these, model query history won't display data from other users. For more information, refer to the [Redshift documentation](https://docs.aws.amazon.com/redshift/latest/dg/cm_chap_system-tables.html#c_visibility-of-data).

#### Redshift considerations

Redshift model query history is derived from physical table scans (`SYS_QUERY_DETAIL` where `step_name = 'scan'`). This means usage data reflects a high-quality signal rather than an exact query count.

Because Redshift expands regular views at execution time, scans are attributed to underlying base tables and view names do not appear in scan metadata. Materialized views do not have this limitation. Keep the following in mind when reviewing usage data:

- Models materialized as `view` will likely show zero usage.
- Models materialized as `table` or `incremental` are attributed correctly.
- `ephemeral` models cannot be attributed.

If your project relies heavily on views, usage may appear lower than expected. This is a known limitation of scan-based attribution rather than missing data.

### Databricks model query history <Lifecycle status="beta" />

Model query history uses two Unity Catalog system tables: `system.query.history` and `system.access.table_lineage`. Before granting access, confirm the following prerequisites are met:

- Your account has at least one Unity Catalog-enabled workspace. Users who are still on the legacy Hive Metastore cannot use model query history.
- The metastore is on Privilege Model Version 1.0. For more information, refer to [Unity Catalog privileges reference](https://docs.databricks.com/aws/en/data-governance/unity-catalog/access-control/privileges-reference).
- The `access` and `query` schemas are enabled in the `system` catalog. A Databricks account admin can enable them under **Account Console** > **Settings** > **System tables**.

Grant the service principal used in your production environment the following privileges:

```sql
GRANT USE CATALOG ON CATALOG system TO `<YOUR_SERVICE_PRINCIPAL>`;
GRANT USE SCHEMA ON SCHEMA system.access TO `<YOUR_SERVICE_PRINCIPAL>`;
GRANT USE SCHEMA ON SCHEMA system.query TO `<YOUR_SERVICE_PRINCIPAL>`;
GRANT SELECT ON TABLE system.access.table_lineage TO `<YOUR_SERVICE_PRINCIPAL>`;
GRANT SELECT ON TABLE system.query.history TO `<YOUR_SERVICE_PRINCIPAL>`;
```

:::note
`SELECT` on the tables alone is not sufficient. Databricks also requires `USE CATALOG` on the parent catalog and `USE SCHEMA` on the parent schemas.
:::

For more information, refer to the [Databricks Unity Catalog privileges documentation](https://docs.databricks.com/aws/en/data-governance/unity-catalog/manage-privileges/privileges).

#### Databricks considerations

Keep the following in mind when using model query history with Databricks:

- **Usage data may be incomplete**. Databricks does not capture lineage for all queries, so some queries may not appear in usage data. This is a known Databricks limitation. For more information, refer to [Databricks lineage system tables](https://docs.databricks.com/aws/en/admin/system-tables/lineage).
- **Lineage data is not real-time**. `system.access.table_lineage` is updated throughout the day with no guaranteed timeframe. Delays of up to 24 hours are possible.
- **Views may produce inconsistent lineage records**. Materialized views and streaming tables are included in lineage events. Standard views may or may not produce lineage records, depending on how Databricks Unity Catalog resolves them.
- **Statement text encryption affects query filtering**. If statement text encryption is enabled in Databricks, `statement_text` in `system.query.history` is `NULL`. In this case, dbt test queries cannot be filtered and may be counted as user queries.
- **Serverless compute lineage may be incomplete**. `system.query.history` includes queries from SQL warehouses and serverless compute, but lineage attribution for serverless executions may not always be captured.


## View query history in Catalog

To enhance your discovery, you can view your model query history in various locations within <Constant name="catalog" />:
- [View from Performance charts](#view-from-performance-charts)
- [View from Project lineage](#view-from-project-lineage)
- [View from Model list](#view-from-model-list)

### View from Performance charts

1. Navigate to <Constant name="catalog" /> by clicking **Catalog** in the navigation.
2. In the main **Overview** page, click on **Performance** under the **Project details** section. Scroll down to view the **Most consumed models**.
3. Use the dropdown menu on the right to select the desired time period, with options available for up to the past 3 months. 

<Lightbox src="/img/docs/collaborate/dbt-explorer/most-consumed-models.jpg" width="85%" title="View most consumed models on the 'Performance' page in dbt Catalog." />

4. Click on a model for more details and go to the **Performance** tab.
5. On the **Performance** tab, scroll down to the **Model performance** section. 
6. Select the **Consumption queries** tab to view the consumption queries over a given time for that model. 
<Lightbox src="/img/docs/collaborate/model-consumption-queries.jpg" width="90%" title="View consumption queries over time for a given model." />

### View from Project lineage

1. To view your model in your project lineage, go to the main **Overview page** and click on **Project lineage.**
2. In the lower left of your lineage, click on **Lenses** and select **Consumption queries**. 
<Lightbox src="/img/docs/collaborate/dbt-explorer/model-consumption-lenses.jpg" width="85%" title="View model consumption queries in your lineage using the 'Lenses' feature." />

3. Your lineage should display a small red box above each model, indicating the consumption query number. The number for each model represents the model consumption over the last 30 days.

### View from Model list

1. To view a list of models, go to the main **Overview page**.
2. In the left navigation, go to the **Resources** tab and click on **Models** to view the models list.
3. You can view the consumption query count for the models and sort by most or least consumed. The consumption query number for each model represents the consumption over the last 30 days.
<Lightbox src="/img/docs/collaborate/dbt-explorer/model-consumption-list.jpg" width="85%" title="View models consumption in the 'Models' list page under the 'Consumption' column." />
