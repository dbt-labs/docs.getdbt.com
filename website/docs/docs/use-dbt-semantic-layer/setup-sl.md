---
title: "Set up the dbt Semantic Layer"
id: setup-sl
description: "Seamlessly set up the dbt Semantic Layer in dbt Cloud using intuitive navigation."
sidebar_label: "Set up your Semantic Layer"
tags: [Semantic Layer]
---

<VersionBlock firstVersion="1.6">


With the dbt Semantic Layer, you can centrally define business metrics, reduce code duplication and inconsistency, create self-service in downstream tools, and more. Configure the dbt Semantic Layer in dbt Cloud to connect with your integrated partner tool. 

## Prerequisites


import SetUp from '/snippets/_v2-sl-prerequisites.md';

<SetUp/>

## Set up dbt Semantic Layer

import SlSetUp from '/snippets/_new-sl-setup.md';  

<SlSetUp/>

<!--
1. Create a new environment in dbt Cloud by selecting **Deploy** and then **Environments**.
2. Select **dbt Version 1.6** (or the latest) and enter your deployment credentials.
3. To configure the new Semantic Layer, you must have a successful run in your new environment. We recommend running `dbt ls` since `dbt build` won’t succeed until you’ve created and defined semantic models and metrics.
4. To enable the dbt Semantic Layer, go to the **Account Settings** page and then select the specific project you want to enable the Semantic Layer for.
5. In the **Project Details** page, select **Configure Semantic Layer.** This will prompt you to enter data platform connection credentials for the Semantic Layer and select the environment where you want to enable the Semantic Layer. We recommend using a less privileged set of credentials when setting up your connection. The semantic layer requires SELECT and CREATE TABLE permissions.
6. After you’ve entered your credentials, you should see connection information that will allow you to connect to downstream tools. If the tool you are using can connect with JDBC, you can save the **JDBC URL** or each of the individual components provided (e.g., environment id, host). Alternatively, if the tool you connect to uses the Semantic Layer GraphQL API, save the GraphQL API host information.
7. Next, go back to the **Project Details** page and select **Generate Service Token** to create a Semantic Layer service token. Save this token for later.
8. You’re done 🎉! The semantic layer should is now enabled for your project. 
-->

</VersionBlock>

<VersionBlock lastVersion="1.5">

import DeprecationNotice from '/snippets/_sl-deprecation-notice.md';

<DeprecationNotice />

With the dbt Semantic Layer, you can define business metrics, reduce code duplication and inconsistency, create self-service in downstream tools, and more. Configure the dbt Semantic Layer in dbt Cloud to connect with your integrated partner tool. 

## Prerequisites


<Snippet path="sl-prerequisites" />

## Set up dbt Semantic Layer

:::tip
If you're using the legacy Semantic Layer, dbt Labs strongly recommends that you [upgrade your dbt version](/docs/dbt-versions/upgrade-core-in-cloud) to dbt v1.6 or higher to use the latest dbt Semantic Layer. Refer to the dedicated [migration guide](/guides/sl-migration) for more info.

:::

 * Team and Enterprise accounts can set up the Semantic Layer and [Discovery API](/docs/dbt-cloud-apis/discovery-api) in the integrated partner tool to import metric definitions. 
 * Developer accounts can query the Proxy Server using SQL but won't be able to browse dbt metrics in external tools, which requires access to the Discovery API.


1. Log in to your dbt Cloud account.
2. Go to **Account Settings**, and then **Service Tokens** to create a new [service account API token](/docs/dbt-cloud-apis/service-tokens). Save your token somewhere safe. 
3. Assign permissions to service account tokens depending on the integration tool you choose. Refer to the [integration partner documentation](https://www.getdbt.com/product/semantic-layer-integrations) to determine the permission sets you need to assign.
4. Go to **Deploy** > **Environments**, and select your **Deployment** environment.
5. Click **Settings** on the top right side of the page.
6. Click **Edit** on the top right side of the page.
7. Select dbt version 1.2 or higher.
8. Toggle the Semantic Layer **On**.
9. Copy the full proxy server URL (like `https://eagle-hqya7.proxy.cloud.getdbt.com`) to connect to your [integrated partner tool](https://www.getdbt.com/product/semantic-layer-integrations). 
10. Use the URL in the data source configuration of the integrated partner tool.
11. Use the data platform login credentials that make sense for how the data is consumed.

:::info📌 

It is _not_ recommended that you use your dbt Cloud credentials due to elevated permissions. Instead, you can use your specific integration tool permissions.

:::

12. Set up the [Discovery API](/docs/dbt-cloud-apis/discovery-api) (Team and Enterprise accounts only) in the integrated partner tool to import the metric definitions. The [integrated partner tool](https://www.getdbt.com/product/semantic-layer-integrations) will treat the dbt Server as another data source (like a data platform). This requires:

- The account ID, environment ID, and job ID (which is visible in the job URL)
- An [API service token](/docs/dbt-cloud-apis/service-tokens) with job admin and metadata permissions
- Add the items above to the relevant fields in your integration tool


<Lightbox src="/img/docs/dbt-cloud/semantic-layer/configure_sl.png" title="Set up dbt Semantic Layer in dbt Cloud" /><br />

</VersionBlock>

## Related docs

- [Build your metrics](/docs/build/build-metrics-intro)
- [Available integrations](/docs/use-dbt-semantic-layer/avail-sl-integrations)
- [Semantic Layer APIs](/docs/dbt-cloud-apis/sl-api-overview)
- [Migrate your legacy Semantic Layer](/guides/sl-migration)
- [Get started with the dbt Semantic Layer](/docs/use-dbt-semantic-layer/quickstart-sl)
