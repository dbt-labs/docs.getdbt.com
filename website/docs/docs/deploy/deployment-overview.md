---
title: "Deploy dbt"
id: "deployments"
sidebar: "Use dbt Cloud's capabilities to seamlessly run a dbt job in production."
hide_table_of_contents: true
tags: ["scheduler"]
---

Use dbt Cloud's capabilities to seamlessly run a dbt job in production or staging environments. Rather than run dbt commands manually from the command line, you can leverage the [dbt Cloud's in-app scheduling](/docs/deploy/job-scheduler) to automate how and when you execute dbt. 

dbt Cloud offers the easiest and most reliable way to run your dbt project in production. Effortlessly promote high quality code from development to production and build fresh data assets that your business intelligence tools and end users query to make business decisions. <Term id="deploying">Deploying</Term> with dbt Cloud lets you:
- Keep production data fresh on a timely basis
- Ensure CI and production pipelines are efficient 
- Identify the root cause of failures in deployment environments
- Maintain high-quality code and data in production
- Gain visibility into the health of deployment jobs, models, and tests

Before continuing, make sure you understand dbt's approach to [deployment environments](/docs/deploy/deploy-environments). 

Learn how to use dbt Cloud's features to help your team ship timely and quality production data more easily.
## Deploy with dbt

<div className="grid--3-col">

<Card
    title="Job scheduler"
    body="The job scheduler is the backbone of running jobs in dbt Cloud, bringing power and simplicity to building data pipelines in both continuous integration and production environments."
    link="/docs/deploy/job-scheduler"
    icon="dbt-bit"/>

<Card
    title="Deploy jobs"
    body="Create and schedule jobs for the dbt Cloud scheduler to run."
    link="/docs/deploy/deploy-jobs"
    icon="dbt-bit"/>

<Card
    title="Continuous integration"
    body="Set up CI checks so you can build and test any modified code in a staging environment when you open PRs and push new commits to your dbt repository."
    link="/docs/deploy/continuous-integration"
    icon="dbt-bit"/>

<Card
    title="Job commands"
    body="Configure which dbt commands to execute when running a dbt job."
    link="/docs/deploy/job-commands"
    icon="dbt-bit"/>

</div> <br />

## Monitor jobs and alerts

<div className="grid--3-col">

<Card
    title="Run visibility"
    body="View the history of your runs and the model timing dashboard to help identify where improvements can be made to the scheduled jobs."
    link="/docs/deploy/run-visibility"
    icon="dbt-bit"/>

<Card
    title="Retry jobs"
    body="Rerun your errored jobs from start or the failure point."
    link="/docs/deploy/retry-jobs"
    icon="dbt-bit"/>

<Card
    title="Job notifications"
    body="Receive email or Slack channel notifications when a job run succeeds, fails, or is canceled so you can respond quickly and begin remediation if necessary."
    link="/docs/deploy/job-notifications"
    icon="dbt-bit"/>

<Card
    title="Webhooks"
    body="Create outbound webhooks to send events about your dbt jobs' statuses to other systems in your organization."
    link="/docs/deploy/webhooks"
    icon="dbt-bit"/>

<Card
    title="Artifacts"
    body="dbt Cloud generates and saves artifacts for your project, which it uses to power features like creating docs for your project and reporting the freshness of your sources."
    link="/docs/deploy/artifacts"
    icon="dbt-bit"/>

<Card
    title="Source freshness"
    body="Enable snapshots to capture the freshness of your data sources and configure how frequent these snapshots should be taken. This can help you determine whether your source data freshness is meeting your SLAs."
    link="/docs/deploy/source-freshness"
    icon="dbt-bit"/>

<Card
    title="Dashboard status tiles"
    body="Set up status tiles to see the data freshness and quality checks whenever you view your data. "
    link="/docs/deploy/dashboard-status-tiles"
    icon="dbt-bit"/>

</div> <br />


<!--
<a href="https://docs.getdbt.com/docs/deploy/dbt-cloud-job" target="_blank" class="pagination-nav__label nav-create-account button button--primary">Try deploying with dbt Cloud</a> 

<DocCarousel slidesPerView={1}>

<Lightbox src="/img/docs/dbt-cloud/deployment/deploy-scheduler.jpg" width="98%" title="An overview of a dbt Cloud job run which contains Run Summary, Job Trigger, Run Duration, and more."/>

<Lightbox src="/img/docs/dbt-cloud/deployment/run-history.jpg" width="95%" title="Run History dashboard allows you to monitor the health of your dbt project and displays jobs, job status, environment, timing, and more."/>


<Lightbox src="/img/docs/dbt-cloud/deployment/access-logs.gif" width="85%" title="Access logs for run steps" />

<Lightbox src ="/img/docs/dbt-cloud/using-dbt-cloud/job-commands.gif" width="95%" title="Setting up a job and configuring checkbox and dbt commands"/>

</DocCarousel>

## Run dbt in production

If you want to run dbt jobs on a schedule, you can use tools such as dbt Cloud, Airflow, Prefect, Dagster, automation server, or Cron.-->


## Related docs 

- [Integrate with other orchestration tools](/docs/deploy/deployment-tools)
