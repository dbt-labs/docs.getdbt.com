---
title: "Data health tile"
sidebar_label: "Data health tile"
description: "Embed data health tiles in your dashboards to distill trust signals for data consumers."
---

# Embed data health tile in your dashboards <Lifecycle status='beta' />

With data health tiles, stakeholders will get an at-a-glance confirmation on whether the data they’re looking at is stale or degraded. This trust signal allows teams to immediately go back into Explorer to see more details and investigate issues.

The data health tile:

- Distills trust signals for data consumers
- Deep links you into dbt Explorer where you can further dive into upstream data issues
- Provides richer information and makes it easier to debug.
- Revamps the existing, job-based [dashboard status tiles](/docs/deploy/dashboard-status-tiles).

<Lightbox src="/img/docs/collaborate/dbt-explorer/data-tile-example.jpg" width="70%" title="Embed data health tiles in your dashboards to distill trust signals for data consumers." />

## Prerequisites

- You must be an account admin to set up [service tokens](/docs/dbt-cloud-apis/service-tokens#permissions-for-service-account-tokens).
- You must have [develop permissions](/docs/cloud/manage-access/seats-and-users)
- Have [exposures](/docs/build/exposures) configured in your project and [source freshness](/docs/deploy/source-freshness) enabled in the job that generates this exposure.

## View an exposure in dbt Explorer

First, be sure to enable [source freshness](/docs/deploy/source-freshness) in the job that generates this exposure.

1. Navigate to dbt Explorer by clicking on the **Explore** link in the navigation.
2. In the main **Overview** page, go to the left navigation
3. Under the **Resources** tab, click on **Exposures** to view the exposures list.
4. Select a dashboard exposure and go to the **General** tab to view the data health information.
5. In this tab, you’ll see: 
   - Data health status: Data freshness passed, Data quality passed, Data may be stale, Data quality degraded
   - Name of the exposure.
   - Resource type (model, source, and so on).
   - Dashboard status: Failure, Pass, Stale.
   - You can also see the last check completed, the last check time, and the last check duration.
6. You can also click the **Open Dashboard** button on the upper right to immediately view this in your analytics tool.

<Lightbox src="/img/docs/collaborate/dbt-explorer/data-tile-exposures.jpg" width="70%" title="View an exposure in dbt Explorer." />

## Embed in your dashboard

Once you’ve navigated to the auto-exposure in dbt Explorer, you’ll need to set up your dashboard status tile and [service token](/docs/dbt-cloud-apis/service-tokens):

1. Go to **Account settings** in dbt Cloud.
2. Select **API tokens** in the left sidebar and then **Service tokens**.
3. Click on **Create service token** and give it a name.
4. Select the [**Metadata Only** permission](/docs/dbt-cloud-apis/service-tokens). This token will be used to embed the exposure tile in your dashboard in the later steps.
<Lightbox src="/img/docs/collaborate/dbt-explorer/data-tile-setup.jpg" width="70%" title="Set up your dashboard status tile and service token to embed a data health tile" />

5. Copy the **Metadata Only token** and save it in a secure location. You'll need it token in the next steps.
6. Navigate back to dbt Explorer and select an exposure.
7. Below the **Data health** section, expand on the toggle for instructions on to embed the exposure tile (if you're an account admin with develop permissions). 
8. In the expanded toggle, you'll see a text field where you can paste your **Metadata Only token**.
<Lightbox src="website/static/img/docs/collaborate/dbt-explorer/data-tile-example.jpg" width="70%" title="Expand the tottle to embded data health tile into your dashboard." />

9. Once you’ve pasted your token, you can select either **URL** or **iFrame** depending on which you need to install into your dashboard.

If your analytics tool supports iFrames, you can embed the dashboard tile within it. 

### Embed data health tile in Tableau
To embed the data health tile in Tableau, follow these steps:

1. Ensure you've copied the embed iFrame content in dbt Explorer.
2. For the revamped environment-based exposure tile you can insert these fields into the following iFrame, and then embed them with your dashboard. This is the iFrame that is available from the **Exposure details** page in dbt Explorer.
     - `<iframe src='https://metadata.YOUR_ACCESS_URL/exposure-tile?uniqueId=<exposure_unique_id>&environmentType=production&environmentId=<environment_id>&token=<metadata_token>' />`
*Note, replace the placeholders with your actual values.*
3. For the previous, legacy job-based exposure tile you can insert these three fields into the following iFrame, and then embed them with your dashboard.
    - `<iframe src='https://metadata.YOUR_ACCESS_URL/exposure-tile?name=<exposure_name>&environment_id=<environment_id>&token=<metadata_token>' />`
*Note, replace the placeholders with your actual values.*

#### Preview the data health tile
<DocCarousel slidesPerView={1}>
<Lightbox src="/img/docs/collaborate/dbt-explorer/data-tile-iframe.jpg" title="Example of embedded iFrame" />
<Lightbox src="/img/docs/collaborate/dbt-explorer/data-tile-pass.jpg" title="Example of passing Data health tile in your dashboard." />
<Lightbox src="/img/docs/collaborate/dbt-explorer/data-tile-stale.jpg" title="Example of stale of degraded Data health tile in your dashboard." />
</DocCarousel>

## Job-based data health
