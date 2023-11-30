---
title: "Tableau (beta)"
description: "Use Tableau worksheets to query the dbt Semantic Layer and produce dashboards with trusted date."
tags: [Semantic Layer]
sidebar_label: "Tableau (beta)"
---

:::info Beta functionality
The Tableau integration with the dbt Semantic Layer is a [beta feature](/docs/dbt-versions/product-lifecycles#dbt-cloud).
:::


The Tableau integration allows you to use worksheets to query the Semantic Layer directly and produce your dashboards with trusted data.  

This integration provides a live connection to the dbt Semantic Layer through Tableau Desktop or Tableau Server. 

## Prerequisites

- You have [configured the dbt Semantic Layer](/docs/use-dbt-semantic-layer/setup-sl) and are using dbt v1.6 or higher.
- You must have [Tableau Desktop](https://www.tableau.com/en-gb/products/desktop) version 2021.1 and greater or Tableau Server.
  - Note that Tableau Online does not currently support custom connectors natively. If you use Tableau Online, you will only be able to access the connector in Tableau Desktop.
- Log in to Tableau Desktop (with Online or Server credentials) or a license to Tableau Server
- You need your dbt Cloud host, [Environment ID](/docs/use-dbt-semantic-layer/setup-sl#set-up-dbt-semantic-layer) and [service token](/docs/dbt-cloud-apis/service-tokens) to log in. This account should be set up with the dbt Semantic Layer.
- You must have a dbt Cloud Team or Enterprise [account](https://www.getdbt.com/pricing). Suitable for both Multi-tenant and Single-tenant deployment. 
  - Single-tenant accounts should contact their account representative for necessary setup and enablement.


## Installing the Connector

1. Download the GitHub [connector file](https://github.com/dbt-labs/semantic-layer-tableau-connector/releases/download/v1.0.2/dbt_semantic_layer.taco) locally and add it to your default folder:

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

1. **Authentication** &mdash; Once you authenticate, the system will direct you to the data source page with all the metrics and dimensions configured in your dbt Semantic Layer. 
2. **Access worksheet** &mdash; From there, go directly to a worksheet in the bottom left-hand corner.
3. **Access metrics and dimensions** &mdash; Then, you'll find all the metrics and dimensions that are available to query on the left side of your window.

Visit the [Tableau documentation](https://help.tableau.com/current/pro/desktop/en-us/gettingstarted_overview.htm) to learn more about how to use Tableau worksheets and dashboards.

### Publish from Tableau Desktop to Tableau Server

- **From Desktop to Server** &mdash; Like any Tableau workflow, you can publish your workbook from Tableau Desktop to Tableau Server. For step-by-step instructions, visit Tableau's [publishing guide](https://help.tableau.com/current/pro/desktop/en-us/publish_workbooks_share.htm).


## Things to note

- All metrics use the "SUM" aggregation type, and this can't be altered. The dbt Semantic Layer controls the aggregation type and it is intentionally fixed. Keep in mind that the underlying aggregation in the dbt Semantic Layer might not be "SUM" (even though "SUM" is Tableau's default).
- Tableau surfaces all metrics and dimensions from the dbt Semantic Layer on the left-hand side. Note, that not all metrics and dimensions can be combined with one another. You will receive an error message if a particular dimension cannot be sliced with a metric (or vice versa). 
   - To display available metrics and dimensions, dbt Semantic Layer returns metadata for a fake table with the dimensions and metrics as 'columns' on this table. Because of this, you can't actually query this table for previews or extracts. 
   - Since this is treated as a table, dbt Semantic Layer can't dynamically change what is available. This means we display _all_ available metrics and dimensions even if a particular metric and dimension combination isn't available. 
   
- Certain Table calculations like "Totals" and "Percent Of" may not be accurate when using metrics aggregated in a non-additive way (such as count distinct)
- In any of our Semantic Layer interfaces (not only Tableau), you must include a [time dimension](/docs/build/cumulative#limitations) when working with any cumulative metric that has a time window or granularity.

## Unsupported functionality

The following Tableau features aren't supported at this time, however, the dbt Semantic Layer may support some of this functionality in a future release:

- Updating the data source page
- Using "Extract" mode to view your data
- Unioning Tables
- Writing Custom SQL / Initial SQL
- Table Extensions
- Cross-Database Joins
- All functions in Analysis --> Create Calculated Field
- Filtering on a Date Part time dimension for a Cumulative metric type
- Changing your date dimension to use "Week Number"
  
## FAQs
<FAQ path="Troubleshooting/sl-alpn-error" />
