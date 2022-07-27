---
title: "Building and configuring artifacts"
id: "artifacts"
description: "Use artifacts to power your automated docs site and source freshness data." 
---

## dbt Cloud Artifacts

When dbt Cloud runs dbt jobs, it generates and saves *artifacts*. These artifacts, like `manifest.json`, `catalog.json`, and `sources.json` are used to power different aspects of dbt Cloud, namely: [dbt Docs](documentation) and [source freshness reporting](cloud-snapshotting-source-freshness).

While every dbt Cloud job will produce artifacts, typically you should designate only one production job for a given project. When you edit a project and select the production job, dbt Cloud will render links to the production documentation and source freshness artifacts generated for that project. You can see these artifacts in the Run Overview page for the production job.

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/project-level-artifact-updated.png" title="Configuring Artifacts"/>

### Documentation

Once you select a job in your project settings, dbt Cloud will update "Documentation" in the top left so it links to documentation for this job. This link will always point to the latest version of the documentation for your account!

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/doc-menu.png" title="A link to the latest documentation for the selected job"/>

### Source Freshness

As with Documentation, configuring a job for the Source Freshness artifact setting will update the "Data Sources" link under "Deploy" to point to the latest Source Freshness report for the selected job.

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/data-sources.png" title="A link to the latest source freshness snapshot for the selected job"/>
