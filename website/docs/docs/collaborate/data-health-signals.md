---
title: "Data health signals"
sidebar_label: "Data health signals"
id: data-health-signals
description: "Learn how data health signals offer a quick, at-a-glance view of data health when browsing your resources in dbt Explorer."
image: /img/docs/collaborate/dbt-explorer/data-health-signal.jpg
---

# Data health signals <Lifecycle status="preview" />
Data health signals offer a quick, at-a-glance view of data health when browsing your resources in dbt Explorer. They keep you informed on the status of your resource's health using the indicators **Healthy**, **Caution**, **Degraded**, or **Unknown**.

- Supported resources are [models](/docs/build/models), [sources](/docs/build/sources), and [exposures](/docs/build/exposures).
- For accurate health data, ensure the resource is up-to-date and had a recent job run.
- Each data health signal reflects key data health components, such as test success status, missing resource descriptions, missing tests, absence of builds in 30-day windows, [and more](#data-health-signal-criteria)

<Lightbox src="/img/docs/collaborate/dbt-explorer/data-health-signal.jpg" width="55%" title="View data health signals for your models."/> 

## Access data health signals

Access data health signals in the following places:
- In the [search function](/docs/collaborate/explore-projects#search-resources) or under **Models**, **Sources**, or **Exposures** in the **Resource** tab.  
  - For sources, the data health signal also indicates the [source freshness](/docs/deploy/source-freshness) status.
- In the **Health** column on [each resource's details page](/docs/collaborate/explore-projects#view-resource-details). Hover over or click the signal to view detailed information.
- In the **Health** column of public models tables.
- In the [DAG lineage graph](/docs/collaborate/explore-projects#project-lineage). Click any node to open the node details panel where you can view it and its details.
- In [Data health tiles](/docs/collaborate/data-tile) through an embeddable iFrame and visible in your BI dashboard.

<Lightbox src="/img/docs/collaborate/dbt-explorer/data-health-signal.gif" width="95%" title="Access data health signals in multiple places in dbt Explorer."/> 

## Data health signal criteria

Each resource has a health state that is determined by specific set of criteria. Select the following tabs to view the criteria for that resource type.
<Tabs>
<TabItem value="models" label="Models">

The health state of a model is determined by the following criteria:
<!-- TODO: remove the 'tbd' lines in the table once meta 4025 is done -->
| **Health state** | **Criteria**   |
|-------------------|---------------|
| ✅ **Healthy**    | All of the following must be true:<br /><br /> - Built successfully in the last run<br />- Built in the last 30 days<br />- Model has tests configured<br />- All tests passed<br />- All upstream [sources are fresh](/docs/build/sources#source-data-freshness) or freshness is not applicable (set to `null`)<br />- Has a description |
| 🟡 **Caution**   | One of the following must be true: <br /><br />- Not built in the last 30 days<br />- Tests are not configured<br />- Tests return warnings<br />- One or more upstream sources are stale:<br />&nbsp;&nbsp;&nbsp;&nbsp;- Has a freshness check configured<br />&nbsp;&nbsp;&nbsp;&nbsp;- Freshness check ran in the past 30 days<br />&nbsp;&nbsp;&nbsp;&nbsp;- Freshness check returned a warning<br />- Missing a description |
| 🔴 **Degraded**  | One of the following must be true: <br /><br />- Model failed to build<br />- Model has failing tests<br />- One or more upstream sources are stale:<br />&nbsp;&nbsp;&nbsp;&nbsp;- Freshness check hasn’t run in the past 30 days<br />&nbsp;&nbsp;&nbsp;&nbsp;- Freshness check returned an error |
| ⚪ **Unknown**    | - Unable to determine health of resource; no job runs have processed the resource.         |

</TabItem>

<TabItem value="sources" label="Sources">

The health state of a source is determined by the following criteria:

| **Health state** | **Criteria**   |
|-------------------|---------------|
| ✅ Healthy	| All of the following must be true: <br /><br />- Freshness check configured<br />- Freshness check passed<br />- Freshness check ran in the past 30 days<br />- Has a description |
| 🟡 Caution	| One of the following must be true: <br /><br />- Freshness check returned a warning<br />- Freshness check not configured<br />- Freshness check not run in the past 30 days<br />- Missing a description |
| 🔴 Degraded	| - Freshness check returned an error |
| ⚪ Unknown	| Unable to determine health of resource; no job runs have processed the resource.     |

</TabItem>

<TabItem value="exposures" label="Exposures">

The health state of an exposure is determined by the following criteria:

| **Health state** | **Criteria**   |
|-------------------|---------------|
| ✅ Healthy	| All of the following must be true: <br /><br />- Underlying sources are fresh<br />- Underlying models built successfully<br />- Underlying models’ tests passing<br /><!-- - Freshness must be applicable <br /> - (TBD) Underlying models built in the last 30 days --> |
| 🟡 Caution	| One of the following must be true: <br /><br />- At least one underlying source’s freshness checks returned a warning<br />- At least one underlying model was skipped<br />- At least one underlying model’s tests returned a warning<br /><!-- - (TBD) At least one model not built in the last 30 days --> |   
| 🔴 Degraded	| One of the following must be true: <br /><br />- At least one underlying source’s freshness checks returned an error<br />- At least one underlying model did not build successfully<br />- At least one model’s tests returned an error |

</TabItem>

<!-- TODO: Add source collection health once META-3973/3971 are completed 
<TabItem value="source-collection" label="Source collection health">

The health state of a source collection is determined by the following criteria:

Functions as an aggregate of underlying sources

| **Health state** | **Criteria**   |
|-------------------|---------------|
| ✅ Healthy	| - All underlying sources have freshness checks configured OR<br />- All passed their freshness checks OR<br />- All freshness checks ran in the past 30 days OR<br /> - All sources have a description |
| 🟡 Caution	| - One or more sources lack freshness checks OR<br />- One or more freshness checks returned a warning OR<br />- One or more freshness checks not run in the past 30 days OR<br />- One or more sources missing a description |
| 🔴 Degraded	| - One or more underlying sources’ freshness checks returned error |

</TabItem>
-->

</Tabs>
