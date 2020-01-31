---
title: "Building and Configuring Artifacts"
id: "artifacts"
---

## dbt Cloud Artifacts

When dbt Cloud runs dbt jobs, it generates and saves *artifacts*. These artifacts, like `manifest.json`, `catalog.json`, and `sources.json` are used to power different aspects of dbt Cloud, namely: [dbt Docs](documentation) and [source freshness reporting](cloud-snapshotting-source-freshness).

From your Account Settings page, you can select specific jobs that build the "production" version of your documentation

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/d214e3d-Screen_Shot_2019-03-02_at_5.06.37_PM.png" title="Configuring Artifacts"/>

### Documentation

Once a job has been selecting from the Documentation section of the Artifacts page, dbt Cloud's left-hand navbar will update to include a link to documentation for this job. This link will always point to the latest version of the documentation for your account.



<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/293d341-Screen_Shot_2019-03-02_at_5.10.10_PM.png" title="A link to the latest documentation for the selected job"/>

### Source Freshness

As with Documentation, configuring a job for the Source Freshness artifact setting will update dbt Cloud's left-hand navbar to include a link to the latest Source Freshness report for the selected job.

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/3b9746b-Screen_Shot_2019-03-02_at_5.15.32_PM.png" title="A link to the latest source freshness snapshot for the selected job"/>
