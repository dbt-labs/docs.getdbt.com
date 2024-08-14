---
title: "Data health tile"
id: "data-tile"
sidebar_label: "Data health tile"
description: "Embed data health tiles in your dashboards to distill trust signals for data consumers."
image: /img/docs/collaborate/dbt-explorer/data-tile-pass.jpg
---

# Embed data health tile in dashboards <Lifecycle status='beta' />

With data health tiles, stakeholders will get an at-a-glance confirmation on whether the data they’re looking at is stale or degraded. This trust signal allows teams to immediately go back into Explorer to see more details and investigate issues.
:::info Available in beta
Data health tile is currently available in open beta.
:::
The data health tile:

- Distills trust signals for data consumers.
- Deep links you into dbt Explorer where you can further dive into upstream data issues.
- Provides richer information and makes it easier to debug.
- Revamps the existing, [job-based tiles](#job-based-data-health).

<Lightbox src="/img/docs/collaborate/dbt-explorer/data-tiles.png" width="60%" title="Embed data health tiles in your dashboards to distill trust signals for data consumers." />

## Prerequisites

- You must have a dbt Cloud account on a [Team or Enterprise plan](https://www.getdbt.com/pricing/).
- You must be an account admin to set up [service tokens](/docs/dbt-cloud-apis/service-tokens#permissions-for-service-account-tokens).
- You must have [develop permissions](/docs/cloud/manage-access/seats-and-users).
- Have [exposures](/docs/build/exposures) configured in your project and [source freshness](/docs/deploy/source-freshness) enabled in the job that generates this exposure.

## View exposure in dbt Explorer

First, be sure to enable [source freshness](/docs/deploy/source-freshness) in the job that generates this exposure.

1. Navigate to dbt Explorer by clicking on the **Explore** link in the navigation.
2. In the main **Overview** page, go to the left navigation.
3. Under the **Resources** tab, click on **Exposures** to view the exposures list.
4. Select a dashboard exposure and go to the **General** tab to view the data health information.
5. In this tab, you’ll see: 
   - Data health status: Data freshness passed, Data quality passed, Data may be stale, Data quality degraded
   - Name of the exposure.
   - Resource type (model, source, and so on).
   - Dashboard status: Failure, Pass, Stale.
   - You can also see the last check completed, the last check time, and the last check duration.
6. You can also click the **Open Dashboard** button on the upper right to immediately view this in your analytics tool.

<Lightbox src="/img/docs/collaborate/dbt-explorer/data-tile-exposures.jpg" width="95%" title="View an exposure in dbt Explorer." />

## Embed in your dashboard

Once you’ve navigated to the auto-exposure in dbt Explorer, you’ll need to set up your dashboard status tile and [service token](/docs/dbt-cloud-apis/service-tokens):

1. Go to **Account settings** in dbt Cloud.
2. Select **API tokens** in the left sidebar and then **Service tokens**.
3. Click on **Create service token** and give it a name.
4. Select the [**Metadata Only** permission](/docs/dbt-cloud-apis/service-tokens). This token will be used to embed the exposure tile in your dashboard in the later steps.
<Lightbox src="/img/docs/collaborate/dbt-explorer/data-tile-setup.jpg" width="95%" title="Set up your dashboard status tile and service token to embed a data health tile" />

5. Copy the **Metadata Only token** and save it in a secure location. You'll need it token in the next steps.
6. Navigate back to dbt Explorer and select an exposure.
7. Below the **Data health** section, expand on the toggle for instructions on how to embed the exposure tile (if you're an account admin with develop permissions). 
8. In the expanded toggle, you'll see a text field where you can paste your **Metadata Only token**.
<Lightbox src="/img/docs/collaborate/dbt-explorer/data-tile-example.jpg" width="85%" title="Expand the toggle to embded data health tile into your dashboard." />

9. Once you’ve pasted your token, you can select either **URL** or **iFrame** depending on which you need to install into your dashboard.

If your analytics tool supports iFrames, you can embed the dashboard tile within it. 

### Embed data health tile in Tableau
To embed the data health tile in Tableau, follow these steps:

1. Ensure you've copied the embed iFrame content in dbt Explorer.
2. For the revamped environment-based exposure tile you can insert these fields into the following iFrame, and then embed them with your dashboard. This is the iFrame that is available from the **Exposure details** page in dbt Explorer.

    `<iframe src='https://metadata.YOUR_ACCESS_URL/exposure-tile?uniqueId=<exposure_unique_id>&environmentType=production&environmentId=<environment_id>&token=<metadata_token>' />`

    *Note, replace the placeholders with your actual values.*

<DocCarousel slidesPerView={1}>
<Lightbox src="/img/docs/collaborate/dbt-explorer/data-tile-iframe.jpg" width="70%" title="Example of embedded iFrame" />
<Lightbox src="/img/docs/collaborate/dbt-explorer/data-tile-pass.jpg" width="60%" title="Example of passing Data health tile in your dashboard." />
<Lightbox src="/img/docs/collaborate/dbt-explorer/data-tile-stale.jpg" width="60%" title="Example of stale of degraded Data health tile in your dashboard." />
</DocCarousel>

3. For the job-based exposure tile you can insert these three fields into the following iFrame, and then embed them with your dashboard. The next section will have more details on the job-based exposure tile.

    `<iframe src='https://metadata.YOUR_ACCESS_URL/exposure-tile?name=<exposure_name>&environment_id=<environment_id>&token=<metadata_token>' />`

    *Note, replace the placeholders with your actual values.*

## Job-based data health <Lifecycle status="Legacy"/>

The default experience is the [environment-based data health tile](#view-exposure-in-dbt-explorer) with dbt Explorer.

This section is for legacy job-based data health tiles. If you're using the revamped environment-based exposure tile, refer to the previous section. Expand the following to learn more about the legacy job-based data health tile.

<Expandable alt_header="Job-based data health">  
In dbt Cloud, the [Discovery API](/docs/dbt-cloud-apis/discovery-api) can power dashboard status tiles, which are job-based.  A dashboard status tile is placed on a dashboard (specifically: anywhere you can embed an iFrame) to give insight into the quality and freshness of the data feeding into that dashboard. This is done in dbt [exposures](/docs/build/exposures).

#### Functionality
The dashboard status tile looks like this:

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/dashboard-status-tiles/passing-tile.jpeg"/>

The data freshness check fails if any sources feeding into the exposure are stale. The data quality check fails if any dbt tests fail. A failure state could look like this:

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/dashboard-status-tiles/failing-tile.jpeg"/>

Clicking into **see details** from the Dashboard Status Tile takes you to a landing page where you can learn more about the specific sources, models, and tests feeding into this exposure.

#### Setup
First, be sure to enable [source freshness](/docs/deploy/source-freshness) in the job that generates this exposure.

In order to set up your dashboard status tile, here is what you need:

1. **Metadata Only token.**  You can learn how to set up a Metadata-Only token [here](/docs/dbt-cloud-apis/service-tokens).

2. **Exposure name.** You can learn more about how to set up exposures [here](/docs/build/exposures).

3. **Job iD.** Remember that you can select your job ID directly from the URL when looking at the relevant job in dbt Cloud.

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

#### Embedding with BI tools
The dashboard status tile should work anywhere you can embed an iFrame. But below are some tactical tips on how to integrate with common BI tools.

<Tabs>
<TabItem value="mode" label="Mode">

#### Mode
Mode allows you to directly [edit the HTML](https://mode.com/help/articles/report-layout-and-presentation/#html-editor) of any given report, where you can embed the iFrame.

Note that Mode has also built its own [integration](https://mode.com/get-dbt/) with the dbt Cloud Discovery API!
</TabItem>

<TabItem value="looker" label="Looker">

#### Looker
Looker does not allow you to directly embed HTML and instead requires creating a [custom visualization](https://docs.looker.com/admin-options/platform/visualizations). One way to do this for admins is to:
- Add a [new visualization](https://fishtown.looker.com/admin/visualizations) on the visualization page for Looker admins. You can use [this URL](https://metadata.cloud.getdbt.com/static/looker-viz.js) to configure a Looker visualization powered by the iFrame.  It will look like this:

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/dashboard-status-tiles/looker-visualization.jpeg" title="Configure a Looker visualization powered by the iFrame" />

- Once you have set up your custom visualization, you can use it on any dashboard! You can configure it with the exposure name, job ID, and token relevant to that dashboard.

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/dashboard-status-tiles/custom-looker.jpeg " width="60%"/>
</TabItem>

<TabItem value="tableau" label="Tableau">

#### Tableau
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

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/dashboard-status-tiles/tableau-object.png" width="60%" title="Configure Tableau by using a Web page object." />
</TabItem>

<TabItem value="sigma" label="Sigma">

#### Sigma

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

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/dashboard-status-tiles/sigma-embed.gif" width="60%" title="Configure Sigma by using an embedded UI element." />
</TabItem>
</Tabs>

</Expandable>
