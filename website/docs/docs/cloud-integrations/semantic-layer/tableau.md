---
title: "Tableau"
description: "Use Tableau worksheets to query the dbt Semantic Layer and produce dashboards with trusted date."
tags: [Semantic Layer]
sidebar_label: "Tableau"
---

The Tableau integration allows you to use worksheets to query the dbt Semantic Layer directly and produce your dashboards with trusted data. It provides a live connection to the dbt Semantic Layer through Tableau Desktop or Tableau Server.

## Prerequisites

- You have [configured the dbt Semantic Layer](/docs/use-dbt-semantic-layer/setup-sl) and are using dbt v1.6 or higher.
- You must have [Tableau Desktop](https://www.tableau.com/en-gb/products/desktop) version 2021.1 and greater or Tableau Server.
  - Note that Tableau Online does not currently support custom connectors natively. If you use Tableau Online, you will only be able to access the connector in Tableau Desktop.
- Log in to Tableau Desktop (with Online or Server credentials) or a license to Tableau Server
- You need your dbt Cloud host, [Environment ID](/docs/use-dbt-semantic-layer/setup-sl#set-up-dbt-semantic-layer) and [service token](/docs/dbt-cloud-apis/service-tokens) to log in. This account should be set up with the dbt Semantic Layer.
- You must have a dbt Cloud Team or Enterprise [account](https://www.getdbt.com/pricing). Suitable for both Multi-tenant and Single-tenant deployment. 
  - Single-tenant accounts should contact their account representative for necessary setup and enablement.

import SLCourses from '/snippets/_sl-course.md';

<SLCourses/>

## Installing the Connector

The dbt Semantic Layer Tableau connector is available to download directly on [Tableau Exchange](https://exchange.tableau.com/products/1020).

Alternatively, you can follow these steps to install the Connector:

1. Download the GitHub [connector file](https://github.com/dbt-labs/semantic-layer-tableau-connector/releases/latest/download/dbt_semantic_layer.taco) locally and add it to your default folder:

| Operating system |Tableau Desktop | Tableau Server |
| ---------------- | -------------- | -------------- |
| Windows | `C:\Users\\[Windows User]\Documents\My Tableau Repository\Connectors` | `C:\Program Files\Tableau\Connectors` |
| Mac | `/Users/[user]/Documents/My Tableau Repository/Connectors` | Not applicable |
| Linux | `/opt/tableau/connectors` | `/opt/tableau/connectors` |
 
2. Install the [JDBC driver](/docs/dbt-cloud-apis/sl-jdbc) to the folder based on your operating system:
   - Windows: `C:\Program Files\Tableau\Drivers`
   - Mac: `~/Library/Tableau/Drivers` or `/Library/JDBC` or `~/Library/JDBC`
   - Linux: ` /opt/tableau/tableau_driver/jdbc`
3. Open Tableau Desktop or Tableau Server and find the **dbt Semantic Layer by dbt Labs** connector on the left-hand side. You may need to restart these applications for the connector to be available.
4. Connect with your Host, Environment ID, and Service Token information dbt Cloud provides during [Semantic Layer configuration](/docs/use-dbt-semantic-layer/setup-sl#:~:text=After%20saving%20it%2C%20you%27ll%20be%20provided%20with%20the%20connection%20information%20that%20allows%20you%20to%20connect%20to%20downstream%20tools). 
   - In Tableau Server, the authentication screen may show "User" & "Password" instead, in which case the User is the Environment ID and the password is the Service Token.

## Using the integration

1. **Authentication** &mdash; Once you authenticate, the system will direct you to the data source page.
2. **Access all Semantic Layer Objects** &mdash; Use the "ALL" data source to access all the metrics, dimensions, and entities configured in your dbt Semantic Layer. Note that the "METRICS_AND_DIMENSIONS" data source has been deprecated and replaced by "ALL". Be sure to use a live connection since extracts are not supported at this time. 
3. **Access saved queries** &mdash; You can optionally access individual [saved queries](/docs/build/saved-queries) that you've defined. These will also show up as unique data sources when you log in. 
4. **Access worksheet** &mdash; From your data source selection, go directly to a worksheet in the bottom left-hand corner.
5. **Query metrics and dimensions** &mdash; Then, you'll find all the metrics, dimensions, and entities that are available to query on the left side of your window based on your selection.

Visit the [Tableau documentation](https://help.tableau.com/current/pro/desktop/en-us/gettingstarted_overview.htm) to learn more about how to use Tableau worksheets and dashboards.

### Publish from Tableau Desktop to Tableau Server

- **From Desktop to Server** &mdash; Like any Tableau workflow, you can publish your workbook from Tableau Desktop to Tableau Server. For step-by-step instructions, visit Tableau's [publishing guide](https://help.tableau.com/current/pro/desktop/en-us/publish_workbooks_share.htm).

## Things to note

**Aggregation**<br />
- All metrics are shown as using the "SUM" aggregation type in Tableau's UI, and this cannot be altered using Tableau's interface. 
- The dbt Semantic Layer controls the aggregation type in code and it is intentionally fixed. Keep in mind that the underlying aggregation in the dbt Semantic Layer might not be "SUM" ("SUM" is Tableau's default).

**Data sources and display**<br />
-  In the "ALL" data source, Tableau surfaces all metrics and dimensions from the dbt Semantic Layer on the left-hand side. Note, that not all metrics and dimensions can be combined. You will receive an error message if a particular dimension cannot be sliced with a metric (or vice versa). You can use saved queries for smaller pieces of data that you want to combine.
- To display available metrics and dimensions, dbt Semantic Layer returns metadata for a fake table with the dimensions and metrics as 'columns' on this table. Because of this, you can't actually query this table for previews or extracts.

**Calculations and querying**<br />
- Certain Table calculations like "Totals" and "Percent Of" may not be accurate when using metrics aggregated in a non-additive way (such as count distinct)
- In any of our Semantic Layer interfaces (not only Tableau), you must include a [time dimension](/docs/build/cumulative#limitations) when working with any cumulative metric that has a time window or granularity.
- We can support calculated fields for creating parameter filters or dynamically selecting metrics and dimensions. However, other uses of calculated fields are not supported. 
  - _Note: For calculated field use cases that are not currently covered, please reach out to <a href="mailto:support@getdbt.com?subject=dbt Semantic Layer feedback">dbt Support</a> and share them so we can further understand._
- When using saved queries that include filters, we will automatically apply any filters that the query has.

## Unsupported functionality

The following Tableau features aren't supported at this time, however, the dbt Semantic Layer may support some of this functionality in a future release:
- Updating the data source page
- Using "Extract" mode to view your data
- Unioning Tables
- Writing Custom SQL / Initial SQL
- Table Extensions
- Cross-Database Joins
- Some functions in Analysis --> Create Calculated Field
- Filtering on a Date Part time dimension for a Cumulative metric type
- Changing your date dimension to use "Week Number"
- Performing joins between tables that the dbt Semantic Layer creates. It handles joins for you, so there's no need to join components in the dbt Semantic Layer. Note, that you _can_ join tables from the dbt Semantic Layer to ones outside your data platform.
- The Tableau integration doesn't currently display descriptive labels defined in your `metrics` configuration, meaning custom labels won't be visible when those metrics are imported/queried into Tableau. 
  
## FAQs
<FAQ path="Troubleshooting/sl-alpn-error" />
