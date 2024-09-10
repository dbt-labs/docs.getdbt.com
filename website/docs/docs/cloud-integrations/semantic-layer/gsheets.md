---
title: "Google Sheets"
description: "Integrate with Google Sheets to query your metrics in a spreadsheet."
tags: [Semantic Layer]
sidebar_label: "Google Sheets"
---

The dbt Semantic Layer offers a seamless integration with Google Sheets through a custom menu. This add-on allows you to build dbt Semantic Layer queries and return data on your metrics directly within Google Sheets

## Prerequisites

- You have [configured the dbt Semantic Layer](/docs/use-dbt-semantic-layer/setup-sl) and are using dbt v1.6 or higher.
- You need a Google account with access to Google Sheets and the ability to install Google add-ons.
- You have a [dbt Cloud Environment ID](/docs/use-dbt-semantic-layer/setup-sl#set-up-dbt-semantic-layer) and a [service token](/docs/dbt-cloud-apis/service-tokens) to authenticate with from a dbt Cloud account.
- You must have a dbt Cloud Team or Enterprise [account](https://www.getdbt.com/pricing). Suitable for both Multi-tenant and Single-tenant deployment.
  - Single-tenant accounts should contact their account representative for necessary setup and enablement.

If you're using [IP restrictions](/docs/cloud/secure/ip-restrictions), ensure you've added [Google’s IP addresses](https://www.gstatic.com/ipranges/goog.txt) to your IP allowlist. Otherwise, the Google Sheets connection will fail.

import SLCourses from '/snippets/_sl-course.md';

<SLCourses/>

## Installing the add-on

1. Navigate to the [dbt Semantic Layer for Sheets App](https://gsuite.google.com/marketplace/app/foo/392263010968) to install the add-on. You can also find it in Google Sheets by going to [**Extensions -> Add-on -> Get add-ons**](https://support.google.com/docs/answer/2942256?hl=en&co=GENIE.Platform%3DDesktop&oco=0#zippy=%2Cinstall-add-ons%2Cinstall-an-add-on) and searching for it there.
2. After installing, open the **Extensions** menu and select **dbt Semantic Layer for Sheets**. This will open a custom menu on the right-hand side of your screen.
3. [Find your](/docs/use-dbt-semantic-layer/setup-sl#set-up-dbt-semantic-layer) **Host** and **Environment ID** in dbt Cloud.
   - Navigate to **Account Settings** and select **Projects** on the left sidebar.
   - Select your project and then navigate to the **Semantic Layer** settings.  You'll need this to authenticate in Google Sheets in the following step.
   - You can [generate your service token](/docs/dbt-cloud-apis/service-tokens) by clicking **Generate Service Token** within the Semantic Layer configuration page or navigating to **API tokens** in dbt Cloud.
4. In Google Sheets, authenticate with your host, dbt Cloud environment ID, and service token.
   <Lightbox src="/img/docs/dbt-cloud/semantic-layer/sl-and-gsheets.jpg" width="70%" title="Access your Environment ID, Host, and URLs in your dbt Cloud Semantic Layer settings. Generate a service token in the Semantic Layer settings or API tokens settings" />

5. Start querying your metrics using the **Query Builder**. For more info on the menu functions, refer to [Query Builder functions](#query-builder-functions). To cancel a query while running, press the "Cancel" button.

import Tools from '/snippets/_sl-excel-gsheets.md';

<Tools 
type="Google Sheets"
bullet_1="The custom menu operation has a timeout limit of six (6) minutes."
bullet_2="If you're using this extension, make sure you're signed into Chrome with the same Google profile you used to set up the Add-On. Log in with one Google profile at a time as using multiple Google profiles at once might cause issues."
queryBuilder="/img/docs/dbt-cloud/semantic-layer/query-builder.png"
PrivateSelections="You can also make these selections private or public. Public selections mean your inputs are available in the menu to everyone on the sheet. 
Private selections mean your inputs are only visible to you. Note that anyone added to the sheet can still see the data from these private selections, but they won't be able to interact with the selection in the menu or benefit from the automatic refresh."
/>

<!-- this comment explains the following:
1. uses the /snippets/_sl-excel-gsheets.md snippet file to render gsheets and excel content since they're similar
2. removes the below content (tip and using saved queries header) so it's not duplicative. removing the below content fully a month or so after the launch.
3. keep tje limited policy section in gsheets only and do not add to the /snippets/_sl-excel-gsheets.md snippet file.

## Using saved selections

Saved selections allow you to save inputs in the **Query Builder** to easily access them again so you don't have to continuously build common queries from scratch. To create a saved selection:

- Run a query in the **Query Builder**.
- Save the selection by selecting the arrow next to the **Query** button and then select **Query & Save Selection**.
- The application saves these selections, allowing you to view and edit them from the hamburger menu under **Saved Selections**.


You can also make these selections private or public:

- **Public selections** mean your inputs are available in the menu to everyone on the sheet.
- **Private selections** mean your inputs are only visible to you. Note that anyone added to the sheet can still see the data from these private selections, but they won't be able to interact with the selection in the menu or benefit from the automatic refresh.

### Refreshing selections

Set your saved selections to automatically refresh every time you load the addon. You can do this by selecting **Refresh on Load** when creating the saved selection. When you access the addon and have saved selections that should refresh, you'll see "Loading..." in the cells that are refreshing.

Public saved selections will refresh for anyone who edits the sheet while private selections will only update for the user who created it.

:::tip What's the difference between saved selections and saved queries?

- Saved selections are saved components that you can create only when using the application.
- Saved queries, explained in the next section, are code-defined sections of data you create in your dbt project that you can easily access and use for building selections. You can also use the results from a saved query to create a saved selection.
:::

## Using saved queries

Access <a href="/docs/build/saved-queries">saved queries</a>, powered by MetricFlow, to quickly get results from pre-defined sets of data. To access the saved queries in your integration:

- Open the hamburger menu in Google Sheets.
- Navigate to **Saved Queries** to access the ones available to you.
- You can also select **Build Selection**, which allows you to explore the existing query. This won't change the original query defined in the code.
  - If you use a [`where` filter](/docs/build/saved-queries#where-clause) in a saved query, Google Sheets displays the advanced syntax for this filter.
-->

**Limited use policy disclosure**

The dbt Semantic Layer for Sheet's use and transfer to any other app of information received from Google APIs will adhere to [Google API Services User Data Policy](https://developers.google.com/terms/api-services-user-data-policy), including the Limited Use requirements.

## FAQs
<FAQ path="Troubleshooting/sl-alpn-error" />
