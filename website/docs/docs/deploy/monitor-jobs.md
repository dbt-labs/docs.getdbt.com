---
title: "Monitor jobs and alerts"
id: "monitor-jobs"
description: "Monitor your dbt Cloud job and set up alerts to ensure seamless orchestration and optimize your data transformations"
tags: ["scheduler"]
---

Manage, set up, and automate your dbt jobs with robust control over job settings and execution in production. Use in-app scheduling to configure when and how your jobs run, ensuring a seamless orchestration experience with control over your data transformations. 

Monitoring and alerting with dbt Cloud allows you to:

- [Improve run visibility](/docs/deploy/run-visibility) &mdash; View your run history to help identify where improvements can be made to scheduled jobs.
- [Setup job notifications](/docs/deploy/job-notifications) &mdash; Receive email or slack notifications when a job run succeeds, fails, or is canceled.
- [Create outbound webhooks](/docs/deploy/webhooks) &mdash; Use webhooks to send events about your dbt jobs' statuses to other systems.
- [Leverage artifacts](/docs/deploy/artifacts) &mdash; dbt Cloud generates and saves artifacts for your project, which it uses to power features like creating docs for your project and reporting freshness of your sources.
- [Use source freshness](/docs/deploy/source-freshness) &mdash; Monitor data governance by enabling snapshots to capture the freshness of your data sources. 
- [Use dashboard status tiles](/docs/deploy/dashboard-status-tiles) &mdash; Set up and add status tiles to view data freshness and quality checks

To learn more about how to configure notifications and monitor dbt jobs in dbt Cloud, read the docs in this section.

<DocCarousel slidesPerView={1}>

<Lightbox src="/img/docs/dbt-cloud/deployment/deploy-scheduler.jpg" width="98%" title="An overview of a dbt Cloud job run which contains Run Summary, Job Trigger, Run Duration, and more."/>

<Lightbox src="/img/docs/dbt-cloud/deployment/run-history.jpg" width="95%" title="Run History dashboard allows you to monitor the health of your dbt project and displays jobs, job status, environment, timing, and more."/>


<Lightbox src="/img/docs/dbt-cloud/deployment/access-logs.gif" width="85%" title="Access logs for run steps" />

</DocCarousel>
