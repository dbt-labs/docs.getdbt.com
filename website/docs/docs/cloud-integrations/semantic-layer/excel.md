---
title: "Microsoft Excel"
id: excel
description: "Integrate with Excel to query your metrics in a spreadsheet."
tags: [Semantic Layer]
sidebar_label: "Microsoft Excel"
---

# Microsoft Excel <Lifecycle status="self_service,managed,managed_plus" />

The <Constant name="semantic_layer" /> offers a seamless integration with Excel Online and Desktop through a custom menu. This add-on allows you to build <Constant name="semantic_layer" /> queries and return data on your metrics directly within Excel.

## Prerequisites

- You have [configured the <Constant name="semantic_layer" />](/docs/use-dbt-semantic-layer/setup-sl) and are using dbt v1.6 or higher.
- You need a Microsoft Excel account with access to install add-ons.
- You have a [<Constant name="cloud" /> Environment ID](/docs/use-dbt-semantic-layer/setup-sl#set-up-dbt-semantic-layer).
- You have a [service token](/docs/dbt-cloud-apis/service-tokens) or a [personal access token](/docs/dbt-cloud-apis/user-tokens) to authenticate with from a <Constant name="cloud" /> account.
- You must have a <Constant name="cloud" /> Starter, Enterprise, or Enterprise+ [account](https://www.getdbt.com/pricing). Suitable for both Multi-tenant and Single-tenant deployment.

:::tip

📹 For on-demand video learning, explore the [Querying the <Constant name="semantic_layer" /> with Excel](https://learn.getdbt.com/courses/querying-the-semantic-layer-with-excel) course to learn how to query metrics with Excel.

:::

## Installing the add-on

The <Constant name="semantic_layer" /> Microsoft Excel integration is available to download directly on [Microsoft AppSource](https://appsource.microsoft.com/en-us/product/office/WA200007100?tab=Overview). You can choose to download this add-on in for both [Excel Desktop](https://pages.store.office.com/addinsinstallpage.aspx?assetid=WA200007100&rs=en-US&correlationId=4132ecd1-425d-982d-efb4-de94ebc83f26) and [Excel Online](https://pages.store.office.com/addinsinstallpage.aspx?assetid=WA200007100&rs=en-US&correlationid=4132ecd1-425d-982d-efb4-de94ebc83f26&isWac=True)

1. In Excel, authenticate with your Host, <Constant name="cloud" /> Environment ID, and service token.
   - Access your Environment ID, Host, and URLs in your <Constant name="semantic_layer" /> settings. Generate a service token in the <Constant name="semantic_layer" /> settings or **API tokens** settings. Alternatively, you can also create a personal access token by going to **API tokens** > **Personal tokens**. 
   <Lightbox src="/img/docs/dbt-cloud/semantic-layer/sl-and-gsheets.png" width="70%" title="Access your Environment ID, Host, and URLs in your dbt Semantic Layer settings. Generate a service token in the Semantic Layer settings or API tokens settings" />

2. Start querying your metrics using the **Query Builder**. For more info on the menu functions, refer to [Query Builder functions](#query-builder-functions). To cancel a query while running, press the **Cancel** button.

import Tools from '/snippets/_sl-excel-gsheets.md';

<Tools 
type="Microsoft Excel"
bullet_1="Results that take longer than one minute to load into Excel will fail. This limit only applies to the loading process, not the time it takes for the data platform to run the query."
bullet_2="If you're using this extension, make sure you're signed into Microsoft with the same Excel profile you used to set up the Add-In. Log in with one profile at a time as using multiple  profiles at once might cause issues."
bullet_3="Note that only standard granularities are currently available, custom time granularities aren't currently supported for this integration."
queryBuilder="/img/docs/dbt-cloud/semantic-layer/query-builder.png"
/>

## FAQs
<FAQ path="Troubleshooting/sl-alpn-error" />
