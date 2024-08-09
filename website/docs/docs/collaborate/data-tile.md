---
title: "Data tile"
sidebar_label: "Data tile"
description: "Embed data health tiles in your dashboards to distill trust signals for data consumers."
---

# Embed data health tile in your dashboards <Lifecycle status='beta' />

With data health tiles, stakeholders will get an at-a-glance confirmation on whether the data they’re looking at is stale or degraded. This trust signal allows teams to immediately go back into Explorer to see more details and investigate issues.

The data health time revamps the existing [dashboard status tiles](https://docs.getdbt.com/docs/deploy/dashboard-status-tiles) and:

- Distills trust signals for data consumers
- Deep links you into dbt Explorer where you can further dive into upstream data issues
- Provides richer information and makes it easier to debug.

### Prerequisites

1. You must be an account admin
2. You must have develop permissions

### Navigate to an exposure in Explorer

First, be sure to enable [source freshness](https://docs.getdbt.com/docs/deploy/source-freshness) in the job that generates this exposure.

1. Navigate to dbt Explorer by clicking on the **Explore** link in the navigation.
2. In the main **Overview** page, go to the left navigation
3. Under the **Resources** tab, click on **Exposures** to view the exposures list.
4. Select a dashboard exposure and go to the General tab to view the data health. 
5. In this tab, you’ll see:
    1. Data health status: Data freshness passed, Data quality passed, Data may be stale, Data quality degraded
    2. Dashboard status: Failure, Pass, Stale. As well as details on the last check completed. 
    3. As well as details on the last check completed. 
    4. Add more details?
6. You can also click the **Open Dashboard** button on the upper right to immediately view this in your analytics tool.

![Screenshot 2024-06-19 at 12.55.16.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/d044428d-35c1-45b8-8e9c-df25f39d8ced/83714a12-439d-42ed-be3e-2fe29f743d8a/Screenshot_2024-06-19_at_12.55.16.png)



### Embed within your dashboard

Once you’ve navigated to the auto-exposure in dbt Explorer, you’ll need to set up your dashboard status tile:

1. Go to **Account settings** in dbt Cloud.
    1. **Generate a Metadata Only token.** You can learn how to set up a Metadata-Only token [here](https://docs.getdbt.com/docs/dbt-cloud-apis/service-tokens).
    2. Copy the **Metadata Only token**.
2. Go to dbt Explorer and navigate to an exposure
    1. Below the Data health information will be instructions for how to embed the exposure tile if you are an account admin and have develop permissions. If you expand this, you will see a text field where you can paste your **Metadata Only token**.
    2. Once you’ve pasted your token, you can select either **URL** or **iFrame** depending on which you need to install into your dashboard.

If your analytics tool supports iFrames, you can embed the dashboard tile within it. 

The instructions for Tableau are as follows: 

1. Make sure you’ve copied the embed iFrame content in dbt Explorer.
2. For the old job-based exposure tile you can insert these three fields into the following iFrame, and then embed them with your dashboard.

`<iframe src='https://metadata.YOUR_ACCESS_URL/exposure-tile?name=<exposure_name>&environment_id=<environment_id>&token=<metadata_token>' />`

1. For the new environment-based exposure tile you can insert these fields into the following iFrame, and then embed them with your dashboard. This is the iFrame that is available from the Exposure Details Page in Explorer.

`<iframe src='https://metadata.YOUR_ACCESS_URL/exposure-tile?uniqueId=<exposure_unique_id>&environmentType=production&environmentId=<environment_id>&token=<metadata_token>' />`
