---
title: "Tableau (beta)"
description: "Use Tableau worksheets to query the dbt Semantic Layer and produce dashboards with trusted date."
tags: [Semantic Layer]
sidebar_label: "Tableau (beta)"
---

:::info Beta functionality
The Tableau integration with the dbt Semantic Layer is a [beta feature](/docs/dbt-versions/product-lifecycles#dbt-cloud).
:::


The Tableau integration allows you to use worksheets to query the Semantic Layer directly and produce your dashboards with trusted data.  This integration provides a live connection to the dbt Semantic Layer through Tableau Desktop.

## Prerequisites

1. You must have [Tableau Desktop](https://www.tableau.com/en-gb/products/desktop) installed
2. Authenticate with either Tableau Server or Tableau Cloud
3. You need either a [JDBC URL](/docs/dbt-cloud-apis/sl-jdbc#connection-parameters) or a dbt Cloud account's [Environment ID](/docs/use-dbt-semantic-layer/setup-sl#set-up-dbt-semantic-layer) and [service token](/docs/dbt-cloud-apis/service-tokens) to log in. This account should be set up with the dbt Semantic Layer.
4. Have a dbt Cloud Team or Enterprise [account](https://www.getdbt.com/pricing) and multi-tenant [deployment](/docs/cloud/about-cloud/regions-ip-addresses). (Single-Tenant coming soon)


## Installing

1. Install this file () locally and add it to your default folder:
   - Windows: `C:\Users\\[Windows User]\Documents\My Tableau Repository\Connectors`
   - Mac: `/Users/[user]/Documents/My Tableau Repository/Connectors`
   - Linux: `/opt/tableau/connectors`
2. Install the [JDBC driver](/docs/dbt-cloud-apis/sl-jdbc) to the folder based on your operating system:
   - Windows: `C:\Program Files\Tableau\Drivers`
   - Mac: `~/Library/Tableau/Drivers`
   - Linux: ` /opt/tableau/tableau_driver/jdbc`
3. Open Tableau Desktop and find the connector in the left-hand side called **dbt Semantic Layer by dbt Labs**
4. Connect with your Host, Environment ID, and service token information that's provided to you in your dbt Cloud Semantic Layer configuration.


## Using the integration

Once you authenticate, the system will direct you to the data source page with all the metrics and dimensions configured in your Semantic Layer. 

- From there, go directly to a worksheet in the bottom left hand corner.
- Then, you'll find all the metrics and dimensions that are available to query on the left-hand side of your window.

Visit the [Tableau documentation](https://help.tableau.com/current/pro/desktop/en-us/gettingstarted_overview.htm) to learn more about how to use Tableau worksheets and dashboards.

## Things to note

1. All metrics use the "SUM" aggregation type, and this can't be altered. The dbt Semantic Layer controls the aggregation type and it is intentionally fixed. Keep in mind that the underlying aggregation in the dbt Semantic Layer might not be "SUM" (even though "SUM" is Tableau's default).
2. Tableau surfaces all metrics and dimensions from the dbt Semantic Layer on the left-hand side. Note, that not all metrics and dimensions can be combined with one another. You will receive an error message if a particular dimension cannot be sliced with a metric (or vice versa). 
   - To display available metrics and dimensions, we return metadata for a fake table with the dimensions and metrics as 'columns' on this table. Because of this, you can't actually query this table for previews or extracts. 
   - Since this is treated as a table, we can't dynamically change what is available. This means we display ALL available metrics and dimensions even if a particular metric and dimension combination isn't available. 
   
3. Certain Table calculations like "Totals" and "Percent Of" may not be accurate when using metrics aggregated in a non-additive way (such as count distinct)

## Unsupported functionality

The following Tableau features aren't supported at this time, however, we may support some of this functionality in a future release:

1. Updating the data source page
2. Using "Extract" mode to view yur data
3. Unioning Tables
4. Writing Custom SQL
5. Table Extensions
6. Cross Database Joins
7. All functions in Analysis --> Create Calculated Field
8. Filtering on a Date Part time dimension for a Cumulative metric type
9. Changing your date dimension to use "Week Number"
