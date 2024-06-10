---
title: "Artifacts"
id: "artifacts"
description: "Use artifacts to power your automated docs site and source freshness data." 
---

When running dbt jobs, dbt Cloud generates and saves *artifacts*. You can use these artifacts, like `manifest.json`, `catalog.json`, and `sources.json` to power different aspects of dbt Cloud, namely: [dbt Explorer](/docs/collaborate/explore-projects), [legacy dbt Docs](/docs/collaborate/legacy-dbt-docs), and [source freshness reporting](/docs/build/sources#snapshotting-source-data-freshness).

## Create dbt Cloud Artifacts

While running any job can produce artifacts, you should only associate one production job with a given project to produce the project's artifacts. You can designate this connection in the **Project details** page. To access this page, click the gear icon in the upper right, select **Account Settings**, select your project, and click **Edit** in the lower right. Under **Artifacts**, select the jobs you want to produce documentation and source freshness artifacts for.

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/project-level-artifact-updated.png" width="70%" title="Configuring Artifacts"/>

If you don't see your job listed, you might need to edit the job and select **Run source freshness** and **Generate docs on run**.

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/edit-job-generate-artifacts.png" title="Editing the job to generate artifacts"/>

When you add a production job to a project, dbt Cloud updates the content and provides links to the production documentation and source freshness artifacts it generated for that project. You can see these links by clicking **Deploy** in the upper left, selecting **Jobs**, and then selecting the production job. From the job page, you can select a specific run to see how artifacts were updated for that run only.

### Documentation

When set up, dbt Cloud updates the **Explore** link in the navigation so it links to documentation for this job. This link always directs you to [dbt Explorer](/docs/collaborate/explore-projects), where you can view your project's resources and lineage to gain a better understanding of its latest production state.

Note that both the job's commands and the docs generate step ([triggered](/docs/collaborate/set-up-doc-job) by the **Generate docs on run** checkbox) must succeed during the job invocation for the project-level documentation to be populated or updated.

### Source Freshness

As with Documentation, configuring a job for the Source Freshness artifact setting also updates the Data Sources link under **Deploy**. The new link points to the latest Source Freshness report for the selected job.

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/data-sources.png" title="A link to the latest source freshness snapshot for the selected job"/>
