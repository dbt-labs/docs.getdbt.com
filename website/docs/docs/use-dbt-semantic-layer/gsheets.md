---
title: "Google Sheets (beta)"
description: "Integrate with Google Sheets to query your metrics in a spreadsheet."
tags: [Semantic Layer]
sidebar_label: "Google Sheets (beta)"
---

# Google Sheets <Lifecycle status='beta'/>

:::info Beta functionality
Google Sheets integration with the dbt Semantic Layer is a [beta](/docs/dbt-versions/product-lifecycles#dbt-cloud) feature.
:::

The dbt Semantic Layer offers a seamless integration with Google Sheets through a custom menu. This add-on allows you to build dbt Semantic Layer queries and return data on your metrics directly within Google Sheets.

## Prerequisites

- You have [configured the dbt Semantic Layer](/docs/use-dbt-semantic-layer/setup-sl) and are using dbt v1.6 or higher.
- You have a Google account with access to Google Sheets.
- You can install Google add-ons.
- You have a dbt Cloud Environment ID and a [service token](/docs/dbt-cloud-apis/service-tokens) to authenticate with from a dbt Cloud account.
- You must have a dbt Cloud Team or Enterprise [account](https://www.getdbt.com/pricing). Suitable for both Multi-tenant and Single-tenant deployment.
  - Single-tenant accounts should contact their account representative for necessary setup and enablement.

If you're using [IP restrictions](/docs/cloud/secure/ip-restrictions), ensure you've added [Google’s IP addresses](https://www.gstatic.com/ipranges/goog.txt) to your IP allowlist. Otherwise, the Google Sheets connection will fail.

import SLCourses from '/snippets/_sl-course.md';

<SLCourses/>

## Installing the add-on

1. Navigate to the [dbt Semantic Layer for Sheets App](https://gsuite.google.com/marketplace/app/foo/392263010968) to install the add-on. You can also find it in Google Sheets by going to [**Extensions -> Add-on -> Get add-ons**](https://support.google.com/docs/answer/2942256?hl=en&co=GENIE.Platform%3DDesktop&oco=0#zippy=%2Cinstall-add-ons%2Cinstall-an-add-on) and searching for it there.
2. After installing, open the Add-On menu and select the "dbt Semantic Layer for Sheets". This will open a custom menu on the right-hand side of your screen.
3. Find your **Host** and **Environment ID** in dbt Cloud. Navigate to **Account Settings** and select **Projects** on the left sidebar. Select your project and then navigate to the **Semantic Layer** settings.  You'll need this to authenticate in Google Sheets in the following step.
   - You can [generate your service token](/docs/dbt-cloud-apis/service-tokens) by clicking **Generate Service Token** within the Semantic Layer configuration page or navigating to **API tokens** in dbt Cloud.

4. In Google Sheets, authenticate with your host, dbt Cloud environment ID, and service token.
   <Lightbox src="/img/docs/dbt-cloud/semantic-layer/sl-and-gsheets.jpg" width="70%" title="Access your Environment ID, Host, and URLs in your dbt Cloud Semantic Layer settings. Generate a service token in the Semantic Layer settings or API tokens settings" />

5. Start querying your metrics using the **Query Builder**. For more info on the menu functions, refer to [Custom menu functions](#custom-menu-functions).

When querying your data with Google Sheets:

- It returns the data to the cell you have clicked on, and each cell where data is requested will have a note attached to it, indicating what has been queried.
- The custom menu operation has a timeout limit of six (6) minutes.
- If you're using this extension, make sure you're signed into Chrome with the same Google profile you used to set up the Add-On. Log in with one Google profile at a time as using multiple Google profiles at once might cause issues.

  
## Custom menu functions

The custom menu provides the following capabilities:

| Menu items    | Description                                           |
|---------------|-------------------------------------------------------|
| Metrics       | Search and select metrics.                             |
| Group By      | Search and select dimensions to group by. Dimensions are grouped by the entity of the semantic model they come from. |
| Time Range    | Quickly select time ranges to look at the data, which applies to the main time series for the metrics (metric time). You can still optionally use `where` to filter time ranges|
| Granularity   | Modify the granularity of the primary time dimension.      |
| Where         | Filter your data. This includes categorical and time filters. |
| Order By      | Return your data order.                              |
| Limit         | Set a limit for the rows of your output.               |


## Filtering data 

To use the filter functionality, choose the [dimension](docs/build/dimensions) you want to filter by and select the operation you want to filter on. 
   - For categorical dimensions, type in the dimension value you want to filter by (no quotes needed) and press enter. 
   - Continue adding additional filters as needed with AND and OR. If it's a time dimension, choose the operator and select from the calendar. 


**Limited use policy disclosure**

The dbt Semantic Layer for Sheet's use and transfer to any other app of information received from Google APIs will adhere to [Google API Services User Data Policy](https://developers.google.com/terms/api-services-user-data-policy), including the Limited Use requirements.

## FAQs
<FAQ path="Troubleshooting/sl-alpn-error" />
