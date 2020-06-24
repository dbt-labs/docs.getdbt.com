---
title: "Building and Configuring Artifacts"
id: "artifacts"
---

## dbt Cloud Artifacts

When dbt Cloud runs dbt jobs, it generates and saves *artifacts*. These artifacts, like `manifest.json`, `catalog.json`, and `sources.json` are used to power different aspects of dbt Cloud, namely: [dbt Docs](documentation) and [source freshness reporting](cloud-snapshotting-source-freshness).

From your Account Settings page, you can select specific jobs that build the "production" version of your documentation

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/artifacts.png" title="Configuring Artifacts"/>

### Documentation

Once a job has been selecting from the Documentation section of the Artifacts page, dbt Cloud's left-hand navbar will update to include a link to documentation for this job. This link will always point to the latest version of the documentation for your account.



<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/doc-menu.png" title="A link to the latest documentation for the selected job"/>

### Source Freshness

As with Documentation, configuring a job for the Source Freshness artifact setting will update dbt Cloud's left-hand navbar to include a link to the latest Source Freshness report for the selected job.

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/source-freshness.png" title="A link to the latest source freshness snapshot for the selected job"/>
