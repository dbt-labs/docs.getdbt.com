---
title: "Google Sheets (beta)"
description: "Integrate with Google Sheets to query your metrics in a spreadsheet."
tags: [Semantic Layer]
sidebar_label: "Google Sheets (beta)"
---

:::info Beta functionality
Google Sheets integration with the dbt Semantic Layer is a [beta feature](https://docs.getdbt.com/docs/dbt-versions/product-lifecycles#dbt-cloud) and is subject to change without notification.
:::
The dbt Semantic Layer offers a seamless integration with Google Sheets through a custom menu. This add-on allows you to build dbt Semantic Layer queries and return data on your metrics directly within Google Sheet.

## Prerequisites

1. You have a Google account with access to Google Sheets.
2. You can install Google add-ons.
3. You have [set up the dbt Semantic Layer](/docs/use-dbt-semantic-layer/setup-sl).
4. You have a dbt Cloud Environment ID and a [service token](/docs/dbt-cloud-apis/service-tokens) to authenticate with from a dbt Cloud account.

## Installing the add-on 

1. In Google Sheets, navigate to [**Extensions -> Add-on -> Get add-ons**](https://support.google.com/docs/answer/2942256?hl=en&co=GENIE.Platform%3DDesktop&oco=0#zippy=%2Cinstall-add-ons%2Cinstall-an-add-on).
2. Search for "dbt Semantic Layer for Sheets" and install it.
3. After installing, open the Add-On menu and select the "dbt Semantic Layer for Sheets". This will open a custom menu to the right-hand side of your screen.
4. Authenticate with the dbt Cloud Environment ID and Service Token.
5. Start querying your metrics using the **Query Builder**! 
   - For more info on the menu functions, refer to [Custom menu key functions](#custom-menu-key-functions).
   
When querying your data with Google Sheets: 

- It returns the data to the cell you have clicked on.
- The custom menu operation has a timeout limit of six (6) minutes.

## Custom menu key functions

The custom menu provides the following capabilities: 

| Menu items       | Description                                           |
|---------------|-------------------------------------------------------|
| Metrics       | Search and select metrics.                             |
| Group By      | Search and select dimensions to group by. Dimensions are grouped by the entity of the semantic model they come from. |
| Granularity   | Modify the granularity of the primary time dimension.      |
| Where         | Filter your data. This includes categorical and time filters. |
| Order By      | Return your data ordered.                              |
| Limit         | Set a limit for the rows of your output.               |


## Filtering data 

To use the filter functionality, choose the dimension you want to filter by and select the operation you want to filter on. 
   - If it's a categorical dimension, type in the dimension value you want to filter by (no quotes needed) and press enter. 
   - Continue adding additional filters as needed with AND and OR. If it's a time dimension, choose the operator and select from the calendar. 



**Limited Use Policy Disclosure**

The dbt Semantic Layer for Sheet's use and transfer to any other app of information received from Google APIs will adhere to [Google API Services User Data Policy](https://developers.google.com/terms/api-services-user-data-policy), including the Limited Use requirements.


