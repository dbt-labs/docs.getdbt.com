---
title: "Building and configuring artifacts"
id: "artifacts"
description: "Use artifacts to power your automated docs site and source freshness data." 
---

## dbt Cloud Artifacts

When dbt Cloud runs dbt jobs, it generates and saves *artifacts*. These artifacts, like `manifest.json`, `catalog.json`, and `sources.json` are used to power different aspects of dbt Cloud, namely: [dbt Docs](documentation) and [source freshness reporting](cloud-snapshotting-source-freshness).

While every dbt Cloud job will produce artifacts, typically there is only one production job for a given project. If you select a production job on the Project Settings page, dbt Cloud will render links to the production Documentation and Source Freshness artifacts generated for that project in the nav sidebar.

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/project-level-artifact-updated.png" title="Configuring Artifacts"/>

### Documentation

Once a job has been selected from the Documentation drop-down menu in your project settings, dbt Cloud's "Documentation" navigation link will update to include a link to documentation for this job. This link will always point to the latest version of the documentation for your account!



<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/doc-menu.png" title="A link to the latest documentation for the selected job"/>

### Source Freshness

As with Documentation, configuring a job for the Source Freshness artifact setting will update the "Data Sources" link under "Deploy" to point to the latest Source Freshness report for the selected job.

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/data-sources.png" title="A link to the latest source freshness snapshot for the selected job"/>
