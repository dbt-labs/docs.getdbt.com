---
title: "Power BI"
description: "Use Power BI to query the dbt Semantic Layer and produce dashboards with trusted data."
tags: [Semantic Layer]
sidebar_label: "Power BI"
---

# Power BI <Lifecycle status="self_service,managed,managed_plus,preview" />

The Power BI integration enables you to query the <Constant name="semantic_layer" /> directly, allowing you to build dashboards with trusted, live data in Power BI. It provides a live connection to the <Constant name="semantic_layer" /> through Power BI Desktop or Power BI Service.

## Prerequisites

- You have [configured the <Constant name="semantic_layer" />](/docs/use-dbt-semantic-layer/setup-sl).
- You are on a supported [<Constant name="cloud" /> release track](/docs/dbt-versions/cloud-release-tracks) or on dbt v1.6 or higher.
- You installed [Power BI Desktop or Power BI On-premises Data Gateway](https://learn.microsoft.com/en-us/power-bi/connect-data/service-gateway-custom-connectors).
  - Power BI Service doesn't natively support custom connectors. To use the connector in Power BI Service, you must install and configure it on an On-premises Data Gateway.
- You need your [<Constant name="cloud" /> host](/docs/use-dbt-semantic-layer/setup-sl#3-view-connection-detail), [Environment ID](/docs/use-dbt-semantic-layer/setup-sl#set-up-dbt-semantic-layer) and [service token](/docs/dbt-cloud-apis/service-tokens) to log in. This account should be set up with the <Constant name="semantic_layer" />.
- You must have a <Constant name="cloud" /> Starter or Enterprise-tier [account](https://www.getdbt.com/pricing). Suitable for both Multi-tenant and Single-tenant deployment.

import SLCourses from '/snippets/_sl-course.md';

<SLCourses/>

## Install the connector

The <Constant name="semantic_layer" /> Power BI connector consists of a custom `.pqx` Power BI connector and an ODBC driver. Install both using our Windows installer by following these steps:

#### 1. Download and install the [`.msi` installer](https://github.com/dbt-labs/semantic-layer-powerbi-connector/releases/download/v1.0.0/dbt.Semantic.Layer.for.Power.BI.zip)
   - Run the installer and follow the on-screen instructions.
   - This will install the ODBC driver and the connector onto your Power BI Desktop.

#### 2. Verify installation
   - Open **ODBC Data Sources (64-bit)** file on your computer.
   - Navigate to **System DSN** and verify that the `dbt Labs ODBC DSN` is registered. 
   - Navigate to **Drivers** and verify that the `dbt Labs ODBC Driver` is installed.
   - Open Power BI Desktop, navigate to **Settings**, then **Data Source Settings**. Verify that the `dbt Semantic Layer` connector is properly loaded.

To allow published reports in Power BI Service to use the connector. An IT admin in your organization needs to install and configure the connector on an On-premises Data Gateway.

## For IT admins

This section is for IT admins trying to install the ODBC driver and connector into an On-premises Data Gateway.

To allow published reports to use the connector in Power BI Service, an IT Admin must install and configure the connector.

#### 1. Install the ODBC driver and connector into an On-premises Data Gateway
   - Run the same `.msi` installer used for Power BI Desktop.
   - Install it on the machine where your gateway is hosted.

#### 2. Copy connector file to Gateway directory
   - Locate that `.pqx` file: `C:\Users\<YourUser>\Documents\Power BI Desktop\Custom Connectors\dbtSemanticLayer.pqx`.
   - Copy it to the Power BI On-premises Data Gateway custom connectors directory: `C:\Windows\ServiceProfiles\PBIEgwService\Documents\Power BI Desktop\Custom Connectors`.
#### 3. Verify installation
   - Following verification steps from the [install the connector](#3-verify-installation) section.
#### 4. Enable connector in Power BI Enterprise Gateway
   - Open the `EnterpriseGatewayConfigurator.exe`.
   - Navigate to **Connectors**. 
   - Verify that the `dbt Semantic Layer` connector is installed and active.

For more information on how to set up custom connectors in the Power BI On-premises Data Gateway, refer to Power BI’s [official documentation](https://learn.microsoft.com/en-us/power-bi/connect-data/service-gateway-custom-connectors).

## Configure the connector
After installing the connector, you’ll have to configure your project credentials to connect to the <Constant name="semantic_layer" /> from a report.

To configure project credentials in Power BI Desktop:

1. Create a blank report.
2. On the top-left, click on **Get data**.
3. Search for <Constant name="semantic_layer" />, then click **Connect**.
4. Fill in your connection details. You can find your Host and Environment ID under the <Constant name="semantic_layer" /> configuration for your <Constant name="cloud" /> project.
   :::tip 
   Make sure you select **DirectQuery** under **Data Connectivity mode** since the <Constant name="semantic_layer" /> connector does not support **Import** mode. See [Considerations](#considerations) for more details. 
   :::
5. Click **OK** to proceed.
   <Lightbox src="/img/docs/cloud-integrations/sl-pbi/pbi-directquery.jpg" title="Select DirectQuery mode" />
6. On the next screen, paste your service token and then click **Connect**.
7. You should see a side pane with a few "virtual" tables. `ALL` represents all of your defined semantic layer objects. The other tables represent each of your saved queries. Select the one you want to load into your dashboard. Then click **Load**.
   <Lightbox src="/img/docs/cloud-integrations/sl-pbi/pbi-sidepanel.jpg" title="Select tables in the side panel" />

Now that you've configured the connector, you can configure published reports in the next section to use the connector.

## Configure published reports

After publishing a report and the first time you hit **Publish** on a given report, configure Power BI Service to use your organization’s On-premises Data Gateway to access data from the <Constant name="semantic_layer" />:

1. On the top right, click on **Settings > Power BI settings**.
   <Lightbox src="/img/docs/cloud-integrations/sl-pbi/pbi-settings.jpg" title="Navigate to Settings > Power BI Settings" />
2. Navigate to the **Semantic models** tab and select your report on the sidebar on the left.
3. Under **Gateway and cloud connections**, select the **On-premises Data Gateway** where your IT admin has installed the <Constant name="semantic_layer" /> connector. 
   - If the Status is **Not configured correctly**, you’ll have to configure it.
   <Lightbox src="/img/docs/cloud-integrations/sl-pbi/pbi-gateway-cloud-connections.jpg" title="Configure the gateway connection" />
4. Click on the arrow under **Actions** and then, click on **Manually add to gateway**.
   <Lightbox src="/img/docs/cloud-integrations/sl-pbi/pbi-manual-gateway.jpg" title="Manually add to gateway" />
5. Provide a name for your connection and enter your connection details. 
   - Set the connection as **Encrypted** (Required). Failing to do so will result in the <Constant name="semantic_layer" /> servers rejecting the connection.
   <Lightbox src="/img/docs/cloud-integrations/sl-pbi/pbi-encrypted.jpg" title="Set the connection as Encrypted" />
6. Click **Create**. This will run a connection test (unless you choose to skip it). If the connection succeeds, the connection will be saved.

You can now go back to your published report on Power BI Service to assert data loads as expected.

## Use the connector

This section describes how to use the <Constant name="semantic_layer" /> connector in Power BI.

The <Constant name="semantic_layer" /> connector creates:
- A virtual table for each saved query.
- A `METRICS.ALL` table containing all metrics, and dimensions and entities appear as regular dimension columns.

These tables do not actually map to an underlying table in your data warehouse. Instead, Power BI sends queries to these tables and (before actually executing on the warehouse) the <Constant name="semantic_layer" /> servers:
- Parse the SQL.
- Extract all the queried columns, group bys and filters.
- Generates SQL to query your existing tables. 
- Returns data back to Power BI, which doesn’t know any of this happened.

<Lightbox src="/img/docs/cloud-integrations/sl-pbi/sl-pbi.jpg" width="90%" title="Power BI integration diagram" />

This allows for very flexible analytics workflows, like drag and drop metrics and slice by dimensions and entities &mdash; the <Constant name="semantic_layer" /> will generate the appropriate SQL to actually query your data source for you.

## Considerations

<Expandable alt_header="Not every “column” of METRICS.ALL are compatible with every other column">

- `METRICS.ALL` combines all your existing metrics, entities and dimensions. Queries must be valid Semantic Layer queries, otherwise they'll fail with MetricFlow query compilation errors.

- For saved query tables, all “columns” will be compatible with every other “column” since, by definition, saved queries are valid queries that can be sliced by any of the dimensions present in the query.
</Expandable>

<Expandable alt_header="The dbt Semantic Layer connector does not support Import mode natively">

- Use `DirectQuery` mode to ensure compatibility.
- `Import` mode tries to select an entire table to import into Power BI, which means it'll likely generate SQL that translates to an invalid Semantic Layer query which will try to query all metrics, dimensions and entities at the same time.
- To import data into a PowerBI report:
   - Select a valid combination of columns to import, (something that will generate a valid Semantic Layer query)
   - You can use `Table.SelectColumns` for this: `= Table.SelectColumns(Source{[Item="ALL",Schema="METRICS",Catalog=null]}[Data], {"Total Profit", "Metric Time (Day)"})`
   - Be aware that all calculations will happen inside of Power BI and won’t pass through Semantic Layer servers. This could lead to incorrect or diverging results.
   - For example, the Semantic Layer is usually responsible for rolling up cumulative metrics to coarser time granularities. Doing a sum over all the weeks in a year to get a yearly granularity out of a weekly Semantic Layer query will most likely generate incorrect results. Instead, you should query the Semantic Layer directly to get accurate results.

</Expandable>

<Expandable alt_header="The dbt Semantic Layer connector ignores aggregations defined in Power BI">

- If you change the aggregation type of a metric from `SUM()` to `COUNT()` or anything else, nothing will change. This is because aggregation functions are defined in the Semantic Layer and we ignore them when translating Power BI generated SQL into Semantic Layer queries.
- Aggregations like `Count (Distinct)`, `Standard Deviation`, `Variance`, and `Median` in Power BI may return an error and not work at all.


</Expandable>

<Expandable alt_header="What actions aren't supported?">

The following are not supported:
- Custom modeling
- Joining tables
- Creating custom columns within a table
- Custom Data Analysis Expressions (DAX) or Power Query (PQ)

</Expandable>
