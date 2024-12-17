---
title: "Artifacts"
id: "artifacts"
description: "Use artifacts to power your automated docs site and source freshness data." 
---

When running dbt jobs, dbt Cloud generates and saves *artifacts*. You can use these artifacts, like `manifest.json`, `catalog.json`, and `sources.json` to power different aspects of dbt Cloud, namely: [dbt Explorer](/docs/collaborate/explore-projects), [dbt Docs](/docs/collaborate/build-and-view-your-docs#dbt-docs), and [source freshness reporting](/docs/build/sources#source-data-freshness).

## Create dbt Cloud Artifacts

[dbt Explorer](/docs/collaborate/explore-projects#generate-metadata) uses the metadata provided by the [Discovery API](/docs/dbt-cloud-apis/discovery-api) to display the details about [the state of your project](/docs/dbt-cloud-apis/project-state). It uses metadata from your staging and production [deployment environments](/docs/deploy/deploy-environments) (development environment metadata is coming soon).

dbt Explorer automatically retrieves the metadata updates after each job run in the production or staging deployment environment so it always has the latest results for your project &mdash; meaning it's always automatically updated after each job run.

To view a resource, its metadata, and what commands are needed, refer to [generate metadata](/docs/collaborate/explore-projects#generate-metadata) for more details.

<Expandable alt_header="For dbt Docs">

The following steps are for legacy dbt Docs only. For the current documentation experience, see [dbt Explorer](/docs/collaborate/explore-projects).

While running any job can produce artifacts, you should only associate one production job with a given project to produce the project's artifacts. You can designate this connection on the **Project details** page. To access this page:

1. From dbt Cloud, click on your account name in the left side menu and select **Account settings**.
2. Select your project, and click **Edit** in the lower right. 
3. Under **Artifacts**, select the jobs you want to produce documentation and source freshness artifacts for.

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/project-level-artifact-updated.png" width="70%" title="Configuring Artifacts"/>

If you don't see your job listed, you might need to edit the job and select **Run source freshness** and **Generate docs on run**.

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/edit-job-generate-artifacts.png" title="Editing the job to generate artifacts"/>

When you add a production job to a project, dbt Cloud updates the content and provides links to the production documentation and source freshness artifacts it generated for that project. You can see these links by clicking **Deploy** in the upper left, selecting **Jobs**, and then selecting the production job. From the job page, you can select a specific run to see how artifacts were updated for that run only.

</Expandable>

### Documentation

Navigate to [dbt Explorer](/docs/collaborate/explore-projects) through the **Explore** link to view your project's resources and lineage to gain a better understanding of its latest production state.

To view a resource, its metadata, and what commands are needed, refer to [generate metadata](/docs/collaborate/explore-projects#generate-metadata) for more details.

Both the job's commands and the docs generate step (triggered by the **Generate docs on run** checkbox) must succeed during the job invocation to update the documentation.

<Expandable alt_header="For dbt Docs">

When set up, dbt Cloud updates the Documentation link in the header tab so it links to documentation for this job. This link always directs you to the latest version of the documentation for your project.

</Expandable>

### Source Freshness

To view the latest source freshness result, refer to [generate metadata](/docs/collaborate/explore-projects#generate-metadata) for more detail. Then navigate to dbt Explorer through the **Explore** link.

<Expandable alt_header="For dbt Docs">

Configuring a job for the Source Freshness artifact setting also updates the data source link under **Deploy**. The new link points to the latest Source Freshness report for the selected job.

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/data-sources.png" title="A link to the latest source freshness snapshot for the selected job"/>

</Expandable>
