---
title: "Monitor jobs and alerts"
id: "monitor-jobs"
description: "Monitor your dbt Cloud job and set up alerts to ensure seamless orchestration and optimize your data transformations"
tags: ["scheduler"]
pagination_next: "docs/deploy/run-visibility"
---

Monitor your dbt Cloud jobs to help identify improvement and set up alerts to proactively alert the right people or team. 

This portion of our documentation will go over dbt Cloud's various capabilities that help you monitor your jobs and set up alerts to ensure seamless orchestration, including:

- [Leverage artifacts](/docs/deploy/artifacts) &mdash; dbt Cloud generates and saves artifacts for your project, which it uses to power features like creating docs for your project and reporting freshness of your sources.  
- [Job notifications](/docs/deploy/job-notifications) &mdash; Receive email or Slack notifications when a job run succeeds, encounters warnings, fails, or is canceled.  
- [Model notifications](/docs/deploy/model-notifications) &mdash; Receive email notifications about any issues encountered by your models and tests as soon as they occur while running a job.  
- [Retry jobs](/docs/deploy/retry-jobs) &mdash; Rerun your errored jobs from start or the failure point.  
- [Run visibility](/docs/deploy/run-visibility) &mdash; View your run history to help identify where improvements can be made to scheduled jobs.  
- [Source freshness](/docs/deploy/source-freshness) &mdash; Monitor data governance by enabling snapshots to capture the freshness of your data sources.  
- [Webhooks](/docs/deploy/webhooks) &mdash; Use webhooks to send events about your dbt jobs' statuses to other systems.  


To set up and add data health tiles to view data freshness and quality checks in your dashboard, refer to [data health tiles](/docs/collaborate/data-tile).

<DocCarousel slidesPerView={1}>

<Lightbox src="/img/docs/dbt-cloud/deployment/deploy-scheduler.jpg" width="98%" title="An overview of a dbt Cloud job run which contains Run Summary, Job Trigger, Run Duration, and more."/>

<Lightbox src="/img/docs/dbt-cloud/deployment/run-history.png" width="95%" title="Run History dashboard allows you to monitor the health of your dbt project and displays jobs, job status, environment, timing, and more."/>


<Lightbox src="/img/docs/dbt-cloud/deployment/access-logs.gif" width="85%" title="Access logs for run steps" />

</DocCarousel>
