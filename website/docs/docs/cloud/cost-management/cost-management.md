---
title: "About cost management in dbt"
description: "Manage your data warehouse costs in dbt"
sidebar_label: About cost management
---

# About cost management in dbt <Lifecycle status='preview,managed,managed_plus' />

The cost management dashboard in <Constant name="cloud" /> gives you valuable insight into how your dbt projects impact your data warehouse costs. They will help you optimize your warehouse spending by visualizing how features, including models, tests, snapshots, and other resources, influence costs over time so that you can take action, report to stakeholders, and optimize development workflows.

Currently, only Snowflake is supported. Support for more adapters is coming in the future.

This document will cover setup in Snowflake, <Constant name="cloud" />, and how to use the cost management dashboard to view your insights.  

Support for <Constant name="core" /> and the dbt Fusion engine is coming soon! Select features will be introduced in [v1.10](/docs/dbt-versions/core-upgrade/upgrading-to-v1.10), with many more to come in future versions.

## Prerequisites

:::info Cost management regional availability

The cost management dashboard and features are currently only available to customers in the US on AWS. Support for more regions and providers is being rolled out over the coming months.

:::

To configure the cost management tools, you must have the following:

- Proper [permission set](/docs/cloud/manage-access/enterprise-permissions) to configure connections in <Constant name="cloud" /> (such as account admin or project creator).
- Proper [privileges](https://docs.snowflake.com/en/user-guide/security-access-control-privileges) in Snowflake to create a user and assign them database access.
- A supported data warehouse. Note: Only Snowflake is supported at this time. More warehouses coming soon!
- A <Constant name="cloud" /> account on the [Enterprise or Enterprise+ plan](https://www.getdbt.com/pricing).


## Set up in Snowflake

You must configure metadata credentials for each unique Snowflake account you want the cost management tool to monitor. To configure the proper access in Snowflake: 

1. Identify an existing or new (recommended) service user in your Snowflake account. We recommend configuring a new user for this service, for example, `dbt_cost_user`, for more flexible customization.
2. Grant the user `read` permissions to the [`ORGANIZATION_USAGE`](https://docs.snowflake.com/en/sql-reference/organization-usage) and [`ACCOUNT_USAGE`](https://docs.snowflake.com/en/sql-reference/account-usage) schemas. 
    - (Optional) You can scope this down to the specific tables in the warehouse if preferred using a [Snowflake database role](https://docs.snowflake.com/en/sql-reference/account-usage#enabling-other-roles-to-use-schemas-in-the-snowflake-database) assigned the following access:
        - `ACCOUNT_USAGE.QUERY_HISTORY`
        - `ACCOUNT_USAGE.QUERY_ATTRIBUTION_HISTORY`
        - `ACCOUNT_USAGE.ACCESS_HISTORY`
        - `ACCOUNT_USAGE.WAREHOUSE_METERING_HISTORY`
        - `ORGANIZATION_USAGE.USAGE_IN_CURRENCY_DAILY`


To create a user `dbt_cost_user` and a role `dbt_cost_management` using SQL and assign the required permissions over specific tables, you'd execute something that looks like the following example:

```sql

CREATE USER dbt_cost_user
  PASSWORD = 'A_SECURE_PASSWORD'
  DEFAULT_ROLE = dbt_cost_management
  MUST_CHANGE_PASSWORD = FALSE;

CREATE ROLE dbt_cost_management;

GRANT ROLE dbt_cost_management TO USER dbt_cost_user;

GRANT USAGE ON DATABASE SNOWFLAKE TO ROLE dbt_cost_management;
GRANT USAGE ON SCHEMA SNOWFLAKE.ACCOUNT_USAGE TO ROLE dbt_cost_management;

GRANT SELECT ON VIEW SNOWFLAKE.ACCOUNT_USAGE.QUERY_HISTORY TO ROLE dbt_cost_management;
GRANT SELECT ON VIEW SNOWFLAKE.ACCOUNT_USAGE.QUERY_ATTRIBUTION_HISTORY TO ROLE dbt_cost_management;
GRANT SELECT ON VIEW SNOWFLAKE.ACCOUNT_USAGE.ACCESS_HISTORY TO ROLE dbt_cost_management;
GRANT SELECT ON VIEW SNOWFLAKE.ACCOUNT_USAGE.WAREHOUSE_METERING_HISTORY TO ROLE dbt_cost_management;

GRANT USAGE ON SCHEMA SNOWFLAKE.ORGANIZATION_USAGE TO ROLE dbt_cost_management;
GRANT SELECT ON VIEW SNOWFLAKE.ORGANIZATION_USAGE.USAGE_IN_CURRENCY_DAILY TO ROLE dbt_cost_management;

```

For broader, account-wide access, you could assign `IMPORTED PRIVILEGES` to the user:

```sql

CREATE USER dbt_cost_user
  PASSWORD = 'A_SECURE_PASSWORD'
  DEFAULT_ROLE = dbt_cost_management
  MUST_CHANGE_PASSWORD = FALSE;

CREATE ROLE dbt_cost_management;
GRANT IMPORTED PRIVILEGES ON DATABASE SNOWFLAKE TO ROLE dbt_cost_management;
GRANT ROLE dbt_cost_management TO USER dbt_cost_user;

```

If you prefer, you can also configure the user for key pair authentication instead of using a username and password with <Constant name="cloud" />. 

You must repeat the user creation process in each Snowflake warehouse you want to monitor. 

Once the user is created and assigned proper privileges, it's time to configure the connection in <Constant name="cloud" />.

## Set up in dbt

Configuring the cost management features requires both a connection and a user component:

- **[Connection setup](#connection-setup):** Set up the credentials used to access the data warehouse information. Use the connection associated with your main account identifier (name or ID). Only one unique [connection](/docs/cloud/connect-data-platform/about-connections#connection-management) per warehouse needs to have the credentials configured. If you have multiple connections that reference the same account identifier, you only need to add platform metadata credentials to one of them.
- **[Provision user access](#provision-user-access):** Add new permissions to users and/or groups to regulate access to the dashboard.

### Connection setup

To configure the metadata connection in dbt:

1. Navigate to **Account Settings** and click **Connections**.
2. Click the connection associated with the data warehouse(s) you configured in the Snowflake setup. Do not click **Edit**. This is for the broader settings and will prevent the metadata section from being altered. 
3. Scroll down to the **Platform metadata credentials** and click **Add credentials**.
4. Set the appropriate **Auth method** (username and password or key pair) and fill out all the fields provided.
5. In the **Features** section, click the box to enable **Cost Management**.

    <Lightbox src="/img/docs/dbt-cloud/cost-management/configure-metadata.png" width="60%" title="Fill out the fields with the appropriate information."/>

6. Click **Save**.
7. Repeat this process for each <Constant name="cloud" /> warehouse connection you want to monitor. 

After the setup, it will be a few hours before the initial sync completes and information begins to populate the dashboard. 

### Provision user access

Since the dashboard contains sensitive financial information, we're introducing two new permission sets to help you regulate access: `Cost Management Admin` and `Cost Management Viewer`.

The `Cost Management Viewer` role is especially useful to organizations who want to grant viewer access to the dashboard without the elevated permissions associated with admin roles.

For example, let's say you have a group of developers in charge of cost observability and insights you wish to grant access to view the dashboard:
1. Navigate to your **Account settings** and open **Groups and licenses**.
2. Click the group from your list and click **Edit**.
3. From **Accounts and permissions** click **Add permission**.
4. Select the **Cost Management Viewer** permission from the dropdown and click **Save**.

<Lightbox src="/img/docs/dbt-cloud/cost-management/cost-management-viewer.png" width="60%" title="The Cost Management Viewer role assigned to a group."/>

By assigning these permission set to the users or groups you want to have access to the dashboard you can avoid granting broader access with the other roles. 

## Cost management dashboard

The cost management dashboard can be accessed anywhere in <Constant name="cloud" /> from the left-side menu. Once enabled, **Cost management** will be an option below the **Account home** feature at the top of the sidebar. Users who don't have the proper permissions will not see the option.

Users with the following [permission sets](/docs/cloud/manage-access/enterprise-permissions) will be able to access the cost management dashboard:
- Account Admin
- Account Viewer
- **New:** Cost Management Viewer
- **New:** Cost Management Admin

Once the information syncs, you will see the results by selecting the **Cost management** dashboard option from the left-side menu. 

<Lightbox src="/img/docs/dbt-cloud/cost-management/dashboard-upper.png" width="60%" title="The cost management overview."/>

<Lightbox src="/img/docs/dbt-cloud/cost-management/dashboard.png" width="60%" title="More of the cost management dashboard overview."/>

- Hover over the **Last refreshed...** date to see a list of your configured connections and their status.
    <Lightbox src="/img/docs/dbt-cloud/cost-management/connection-status.png" width="60%" title="View your connection status."/>
- Adjust the period you want to monitor.
    <Lightbox src="/img/docs/dbt-cloud/cost-management/time-period.png" width="60%" title="Adjust the period you want to view."/>

### Metrics

There are metrics that will be available to view and measure your costs as you navigate the dashboard. As you filter your dashboard, you will have access to a list view that enables you to sort by these metrics. The following metrics are available in the cost management dashboard:

- **Execution queries:** The total number of queries run within the data warehouse by executing dbt resources (model builds, tests, etc.).
- **Consumption queries:** The total number of queries of given resource across all usage in the warehouse (includes BI/analytics tools, query consoles, etc.)
- **Execution costs:** The total warehouse cost associated with the resource(s) being executed in dbt runs.
- **Duration (resource view only):** The total duration of queries that executed dbt resources over the time period.

You can sort the list views by these metrics to see how resources are impacting individual areas and have quick views into your highest cost areas
    <Lightbox src="/img/docs/dbt-cloud/cost-management/sort-by-execution-cost.png" width="60%" title="Metrics sorted by execution cost."/>
    <Lightbox src="/img/docs/dbt-cloud/cost-management/sort-by-consumption-query.png" width="60%" title="Metrics sorted by consumption queries."/>

### Overview 

The **Overview** dashboard is the first display you'll see. It gives you general information about your costs:

- View trends in your warehouse costs for the selected time. Hover over the graph to view the difference in spend period-over-period.
    <Lightbox src="/img/docs/dbt-cloud/cost-management/cost-trends.png" width="60%" title="View trends over time."/>
- The top tiles display:
    - Warehouse spend over the selected period.
    - Realized savings (coming soon).
    <Lightbox src="/img/docs/dbt-cloud/cost-management/warehouse-spend.png" width="60%" title="See your total spending."/>
- The bar chart breaks down costs of dbt execution by project. You can click on the individual bars to view more information.
    <Lightbox src="/img/docs/dbt-cloud/cost-management/project-bar.png" width="60%" title="View your spending over time by project and interact with the data to view more."/>
- 
You'll be brought to the **Discover** tab when you click on a bar or project. Here, you can view more detailed information about your spending. 

### Discover

The **Discover** tab takes you to a pane where you can really start getting granular with your cost analysis. It is an interactive page that allows you to break down costs by project, resource, date, and various combinations of those. You'll be able to monitor specific notes in your project lineage to see which resources are impacting your spending the most and view the metadata specific to those resources.

There are multiple options for filtering the cost data views with two starting points
- Resources
- Environments

    <Lightbox src="/img/docs/dbt-cloud/cost-management/filter-by-resource.png" width="60%" title="Filter the Discover view by resource types."/>

#### Resource view

When you filter by resources, you get valuable insights into how your projects’ resources impact warehouse costs. Use the dropdown menu or click the colored squares to add or remove resource types from the bar graph and list view. 

- Filter information by following resource types:
    - Model
    - Test
    - Operation
    - Snapshot
    - Seed
    - Source
- Filter the graph view by project and/or resource type. 
- View a detailed breakdown of your resources and the costs associated. You can filter by resource name and/or type and sort by each column. 
    <Lightbox src="/img/docs/dbt-cloud/cost-management/resource-type.png" width="60%" title="Filter and view detailed breakdowns of your resources."/>
- Click into a resource to view its lineage and how much each node impacts your costs. You can even open the resource in <Constant name="explorer" /> from this view to better understand your metadata!
    <Lightbox src="/img/docs/dbt-cloud/cost-management/render-lineage.png" width="60%" title="View the resources lineage and monitor node costs."/>

#### Environment view

When you filter by environment, select a project to view more detailed information about how each environment type impacts your warehouse costs. 

    <Lightbox src="/img/docs/dbt-cloud/cost-management/filter-by-environment.png" width="70%" title="Filter the Discover view by environment."/>
- The list view will mark your production environment with a `PROD` icon. 
- Click a colored square next to an environment name to add or remove it from the bar graph view. 
- Hover over a bar to view the cost breakdown for each environment.
    <Lightbox src="/img/docs/dbt-cloud/cost-management/environment-cost-breakdown.png" width="60%" title="The bar graph breaks down costs by environment."/>
- Sort the list view by any of the available fields. Click an item in the list view for detailed bar graph breakdowns of cost, query execution count, and consumption count.
    <Lightbox src="/img/docs/dbt-cloud/cost-management/individual-environment.png" width="60%" title="View individual environments and how they impact your costs."/>

## Resource details

When you click on a model or other resource from the **Discover** tab, you are provided with detailed information about the models consumption and execution:

- The first section is a description and information about the resource, including size and consumption queries over the last 30 days.
- **Lineage:** A DAG view of different lenses with data consumption metrics:
    - **Resource type:** View the resource type lineage for your model including other models, snapshots, seeds, and metrics.
    - **Execution costs:** View the execution costs for each resource in your models lineage.
    - **Consumption query history:** View the warehouse consumption metrics for the different resources in your models lineage.
- **Cost:** A graph of the resources consumption costs over the previous 30 day period.
- **Query execution count:** A graph of the total number of queries the resource has run against the warehouse over the previous 30 day period.
- **Consumption queries:** A graph of the queries used to gather analytical data from the warehouse.

<DocCarousel slidesPerView={1}>
<Lightbox src="/img/docs/dbt-cloud/cost-management/resource-description.png" width="90%" title="The resource description" />
<Lightbox src="/img/docs/dbt-cloud/cost-management/lens-resource-type.png" width="90%" title="The resource type lens" />
<Lightbox src="/img/docs/dbt-cloud/cost-management/lens-execution-cost.png" width="90%" title="The execution cost lens" />
<Lightbox src="/img/docs/dbt-cloud/cost-management/lens-consumption-query-history.png" width="90%" title="The consumption query history lens" />
<Lightbox src="/img/docs/dbt-cloud/cost-management/cost.png" width="90%" title="The cost analysis graph" />
<Lightbox src="/img/docs/dbt-cloud/cost-management/query-execution-count.png" width="90%" title="The query execution count history" />
<Lightbox src="/img/docs/dbt-cloud/cost-management/consumption-queries.png" width="90%" title="The consumption query history" />
</DocCarousel>

## Known limitations

The following are some of the known limitations and caveats for the cost management dashboard:

- The dashboard doesn't currently reflect the costs of development environments.
- There may be discrepancies in cost comparison between the dashboard and the data platform UI, as they may reflect different numbers depending on the time period or range selected.
- The cost metric may not perfectly reflect queries with very small durations, which may also skew the average.
- The consumption metric includes all queries of a given model in the warehouse, beyond just analytics use cases, so it is best for relative comparison between resources.
- The consumption metric relies on mapping the dbt models to their tables in the warehouse, so it may be imprecise depending on how those mappings change.
- A dbt run results in multiple executions (run steps) issuing queries, which makes it less intuitive to reason about. In the future, we'll be moving toward more run-centric metrics (grouping/aggregating).
- Core costs are dependent on using dbt v1.10 or higher to associate queries with dbt workloads.
- Snowflake can take up to 72 hours to report accurate cost data, so the past three days may undercount until the data is updated.