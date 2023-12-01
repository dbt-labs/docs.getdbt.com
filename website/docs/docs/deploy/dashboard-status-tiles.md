---
title: "Dashboard status tiles"
id: "dashboard-status-tiles"
description: "Embed Status Tiles in your dashboards to provide consumers with contextual information about the quality and freshness of data."
---

In dbt Cloud, the [Discovery API](/docs/dbt-cloud-apis/discovery-api) can power Dashboard Status Tiles.  A Dashboard Status Tile is placed on a dashboard (specifically: anywhere you can embed an iFrame) to give insight into the quality and freshness of the data feeding into that dashboard. This is done via dbt [exposures](/docs/build/exposures).

## Functionality
The dashboard status tile looks like this:

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/dashboard-status-tiles/passing-tile.jpeg"/>

The data freshness check fails if any sources feeding into the exposure are stale. The data quality check fails if any dbt tests fail. A failure state could look like this:

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/dashboard-status-tiles/failing-tile.jpeg"/>

Clicking into **see details** from the Dashboard Status Tile takes you to a landing page where you can learn more about the specific sources, models, and tests feeding into this exposure.

## Setup
First, be sure to enable [source freshness](/docs/deploy/source-freshness) in the job that generates this exposure.

In order to set up your dashboard status tile, here is what you need:

1. **Metadata Only token.**  You can learn how to set up a Metadata-Only token [here](/docs/dbt-cloud-apis/service-tokens).

2. **Exposure name.** You can learn more about how to set up exposures [here](/docs/build/exposures).

3. **jobID.** Remember that you can select your jobId directly from the URL when looking at the relevant job in dbt Cloud.

You can insert these three fields into the following iFrame, and then embed it **anywhere that you can embed an iFrame**:

```
<iframe src='https://metadata.YOUR_ACCESS_URL/exposure-tile?name=<exposure_name>&jobId=<job_id>&token=<metadata_only_token>' title='Exposure Status Tile'></iframe>
```

:::tip Replace `YOUR_ACCESS_URL` with your region and plan's Access URL

dbt Cloud is hosted in multiple regions in the world and each region has a different access URL. Replace `YOUR_ACCESS_URL` with the appropriate [Access URL](/docs/cloud/about-cloud/access-regions-ip-addresses) for your region and plan. For example, if your account is hosted in the EMEA region, you would use the following iFrame code:

```
<iframe src='https://metadata.emea.dbt.com/exposure-tile?name=<exposure_name>&jobId=<job_id>&token=<metadata_only_token>' title='Exposure Status Tile'></iframe>
```

:::

## Embedding with BI tools
The dashboard status tile should work anywhere you can embed an iFrame. But below are some tactical tips on how to integrate with common BI tools.

### Mode
Mode allows you to directly [edit the HTML](https://mode.com/help/articles/report-layout-and-presentation/#html-editor) of any given report, where you can embed the iFrame.

Note that Mode has also built its own [integration](https://mode.com/get-dbt/) with the dbt Cloud Discovery API!

### Looker
Looker does not allow you to directly embed HTML and instead requires creating a [custom visualization](https://docs.looker.com/admin-options/platform/visualizations). One way to do this for admins is to:
- Add a [new visualization](https://fishtown.looker.com/admin/visualizations) on the visualization page for Looker admins. You can use [this URL](https://metadata.cloud.getdbt.com/static/looker-viz.js) to configure a Looker visualization powered by the iFrame.  It will look like this:

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/dashboard-status-tiles/looker-visualization.jpeg" width="65%" title="Configure a Looker visualization powered by the iFrame" />

- Once you have set up your custom visualization, you can use it on any dashboard! You can configure it with the exposure name, jobID, and token relevant to that dashboard.

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/dashboard-status-tiles/custom-looker.jpeg "/>

### Tableau
Tableau does not require you to embed an iFrame. You only need to use a Web Page object on your Tableau Dashboard and a URL in the following format:

```
https://metadata.YOUR_ACCESS_URL/exposure-tile?name=<exposure_name>&jobId=<job_id>&token=<metadata_only_token>
```

:::tip Replace `YOUR_ACCESS_URL` with your region and plan's Access URL

dbt Cloud is hosted in multiple regions in the world and each region has a different access URL. Replace `YOUR_ACCESS_URL` with the appropriate [Access URL](/docs/cloud/about-cloud/access-regions-ip-addresses) for your region and plan. For example, if your account is hosted in the North American region, you would use the following code:

```
https://metadata.cloud.getdbt.com/exposure-tile?name=<exposure_name>&jobId=<job_id>&token=<metadata_only_token>

```
:::

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/dashboard-status-tiles/tableau-object.png" width="65%" title="Configure Tableau by using a Web page object." />

### Sigma

Sigma does not require you to embed an iFrame. Add a new embedded UI element in your Sigma Workbook in the following format:

```
https://metadata.YOUR_ACCESS_URL/exposure-tile?name=<exposure_name>&jobId=<job_id>&token=<metadata_only_token>
```

:::tip Replace `YOUR_ACCESS_URL` with your region and plan's Access URL

dbt Cloud is hosted in multiple regions in the world and each region has a different access URL. Replace `YOUR_ACCESS_URL` with the appropriate [Access URL](/docs/cloud/about-cloud/access-regions-ip-addresses) for your region and plan. For example, if your account is hosted in the APAC region, you would use the following code:

```
https://metadata.au.dbt.com/exposure-tile?name=<exposure_name>&jobId=<job_id>&token=<metadata_only_token>

```
:::

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/dashboard-status-tiles/sigma-embed.gif" width="65%" title="Configure Sigma by using an embedded UI element." />
