---
title: "Google Sheets (beta)"
description: "Integrate with Google Sheets to query your metrics in a spreadsheet."
tags: [Semantic Layer]
sidebar_label: "Google Sheets (beta)"
---

:::info Beta functionality
Google Sheets integration with the dbt Semantic Layer is a [beta](/docs/dbt-versions/product-lifecycles#dbt-cloud) feature.
:::

The dbt Semantic Layer offers a seamless integration with Google Sheets through a custom menu. This add-on allows you to build dbt Semantic Layer queries and return data on your metrics directly within Google Sheet.

## Prerequisites

1. You have a Google account with access to Google Sheets.
2. You can install Google add-ons.
3. You have [set up the dbt Semantic Layer](/docs/use-dbt-semantic-layer/setup-sl).
4. You have a dbt Cloud Environment ID and a [service token](/docs/dbt-cloud-apis/service-tokens) to authenticate with from a dbt Cloud account.

## Installing the add-on 

1. Navigate to the [dbt Semantic Layer for Sheets App](https://gsuite.google.com/marketplace/app/foo/392263010968) to install the add-on.

   - You can also find it in Google Sheets by going to [**Extensions -> Add-on -> Get add-ons**](https://support.google.com/docs/answer/2942256?hl=en&co=GENIE.Platform%3DDesktop&oco=0#zippy=%2Cinstall-add-ons%2Cinstall-an-add-on) and searching for it there.
2. After installing, open the Add-On menu and select the "dbt Semantic Layer for Sheets". This will open a custom menu to the right-hand side of your screen.
3. Authenticate with your Host, dbt Cloud Environment ID, and Service Token.
4. Start querying your metrics using the **Query Builder**. For more info on the menu functions, refer to [Custom menu functions](#custom-menu-functions).
   
When querying your data with Google Sheets: 

- It returns the data to the cell you have clicked on.
- The custom menu operation has a timeout limit of six (6) minutes.
- If you are logged into Chrome with a different Google user than the one you authenticated the Add-On with, it may not work. We recommend you are logged in with one Google profile at a time when using this extension.
  

## Custom menu functions

The custom menu provides the following capabilities: 

| Menu items    | Description                                           |
|---------------|-------------------------------------------------------|
| Metrics       | Search and select metrics.                             |
| Group By      | Search and select dimensions to group by. Dimensions are grouped by the entity of the semantic model they come from. |
| Granularity   | Modify the granularity of the primary time dimension.      |
| Where         | Filter your data. This includes categorical and time filters. |
| Order By      | Return your data ordered.                              |
| Limit         | Set a limit for the rows of your output.               |


## Filtering data 

To use the filter functionality, choose the [dimension](docs/build/dimensions) you want to filter by and select the operation you want to filter on. 
   - For categorical dimensiosn, type in the dimension value you want to filter by (no quotes needed) and press enter. 
   - Continue adding additional filters as needed with AND and OR. If it's a time dimension, choose the operator and select from the calendar. 



**Limited Use Policy Disclosure**

The dbt Semantic Layer for Sheet's use and transfer to any other app of information received from Google APIs will adhere to [Google API Services User Data Policy](https://developers.google.com/terms/api-services-user-data-policy), including the Limited Use requirements.


