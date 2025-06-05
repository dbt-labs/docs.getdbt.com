---
title: "Deploy dbt"
id: "deployments"
sidebar: "Use dbt's capabilities to seamlessly run a dbt job in production."
hide_table_of_contents: true
tags: ["scheduler"]
pagination_next: "docs/deploy/job-scheduler"
pagination_prev: null
---

<IntroText>

Use <Constant name="cloud" />'s capabilities to seamlessly run a dbt job in production or staging environments. Rather than run dbt commands manually from the command line, you can leverage the [<Constant name="cloud" />'s in-app scheduling](/docs/deploy/job-scheduler) to automate how and when you execute dbt. 

</IntroText>

The <Constant name="dbt_platform" /> offers the easiest and most reliable way to run your dbt project in production. Effortlessly promote high quality code from development to production and build fresh data assets that your business intelligence tools and end users query to make business decisions. <Term id="deploying">Deploying</Term> with <Constant name="cloud" /> lets you:
- Keep production data fresh on a timely basis
- Ensure CI and production pipelines are efficient 
- Identify the root cause of failures in deployment environments
- Maintain high-quality code and data in production
- Gain visibility into the [health](/docs/explore/data-tile) of deployment jobs, models, and tests
- Uses [exports](/docs/use-dbt-semantic-layer/exports) to write [saved queries](/docs/build/saved-queries) in your data platform for reliable and fast metric reporting
- [Visualize](/docs/cloud-integrations/downstream-exposures-tableau) and [orchestrate](/docs/cloud-integrations/orchestrate-exposures) downstream exposures to understand how models are used in downstream tools and proactively refresh the underlying data sources during scheduled dbt jobs. <Lifecycle status="managed,managed_plus" />
- Use [<Constant name="cloud" />'s Git repository caching](/docs/cloud/account-settings#git-repository-caching) to protect against third-party outages and improve job run reliability. <Lifecycle status="managed,managed_plus" />
- Use [Hybrid projects](/docs/deploy/hybrid-projects) to upload <Constant name="cloud" /> artifacts into the <Constant name="dbt_platform" /> for central visibility, cross-project referencing, and easier collaboration. <Lifecycle status="beta,managed_plus" />

Before continuing, make sure you understand dbt's approach to [deployment environments](/docs/deploy/deploy-environments). 

Learn how to use <Constant name="cloud" />'s features to help your team ship timely and quality production data more easily.
## Deploy with dbt

<div className="grid--3-col">

<Card
    title="Job scheduler"
    body="The job scheduler is the backbone of running jobs in the dbt platform, bringing power and simplicity to building data pipelines in both continuous integration and production environments."
    link="/docs/deploy/job-scheduler"
    icon="dbt-bit"/>

<Card
    title="Deploy jobs"
    body="Create and schedule jobs for the job scheduler to run. <br /><br />Runs on a schedule, by API, or after another job completes."
    link="/docs/deploy/deploy-jobs"
    icon="dbt-bit"/>

<Card
    title="State-aware orchestration"
    body="Intelligently determines which models to build by detecting changes in code or data at each job run."
    link="/docs/deploy/state-aware-about"
    icon="dbt-bit"/>

<Card
    title="Continuous integration"
    body="Set up CI checks so you can build and test any modified code in a staging environment when you open PRs and push new commits to your dbt repository."
    link="/docs/deploy/continuous-integration"
    icon="dbt-bit"/>

<Card
    title="Continuous deployment"
    body="Set up merge jobs to ensure the latest code changes are always in production when pull requests are merged to your Git repository."
    link="/docs/deploy/continuous-deployment"
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
    title="Visualize and orchestrate exposures"
    body="Learn how to use dbt to automatically generate downstream exposures from dashboards and proactively refresh the underlying data sources during scheduled dbt jobs."
    link="/docs/deploy/orchestrate-exposures"
    icon="dbt-bit"/>

<Card
    title="Artifacts"
    body="dbt generates and saves artifacts for your project, which it uses to power features like creating docs for your project and reporting the freshness of your sources."
    link="/docs/deploy/artifacts"
    icon="dbt-bit"/>

<Card
    title="Job notifications"
    body="Receive email or Slack channel notifications when a job run succeeds, fails, or is canceled so you can respond quickly and begin remediation if necessary."
    link="/docs/deploy/job-notifications"
    icon="dbt-bit"/>

<Card
    title="Model notifications"
    body="Receive email notifications in real time about issues encountered by your models and tests while a job is running. "
    link="/docs/deploy/model-notifications"
    icon="dbt-bit"/>

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
    title="Source freshness"
    body="Enable snapshots to capture the freshness of your data sources and configure how frequent these snapshots should be taken. This can help you determine whether your source data freshness is meeting your SLAs."
    link="/docs/deploy/source-freshness"
    icon="dbt-bit"/>

<Card
    title="Webhooks"
    body="Create outbound webhooks to send events about your dbt jobs' statuses to other systems in your organization."
    link="/docs/deploy/webhooks"
    icon="dbt-bit"/>

</div> <br />


## Hybrid projects <Lifecycle status="beta,managed" />

<div className="grid--3-col">

<Card
    title="Hybrid projects"
    body="Use Hybrid projects to upload dbt Core artifacts into the dbt platform for central visibility, cross-project referencing, and easier collaboration."
    link="/docs/deploy/hybrid-projects"
    icon="dbt-bit"/>

</div> <br />

<!--
<a href="https://docs.getdbt.com/docs/deploy/dbt-cloud-job" target="_blank" class="pagination-nav__label nav-create-account button button--primary">Try deploying with dbt</a> 

<DocCarousel slidesPerView={1}>

<Lightbox src="/img/docs/dbt-cloud/deployment/deploy-scheduler.jpg" width="98%" title="An overview of a dbt job run which contains Run Summary, Job Trigger, Run Duration, and more."/>

<Lightbox src="/img/docs/dbt-cloud/deployment/run-history.jpg" width="95%" title="Run History dashboard allows you to monitor the health of your dbt project and displays jobs, job status, environment, timing, and more."/>


<Lightbox src="/img/docs/dbt-cloud/deployment/access-logs.gif" width="85%" title="Access logs for run steps" />

<Lightbox src ="/img/docs/dbt-cloud/using-dbt-cloud/job-commands.gif" width="95%" title="Setting up a job and configuring checkbox and dbt commands"/>

</DocCarousel>

## Run dbt in production

If you want to run dbt jobs on a schedule, you can use tools such as <Constant name="cloud" />, Airflow, Prefect, Dagster, automation server, or Cron.-->

## Related docs

- [Use exports to materialize saved queries](/docs/use-dbt-semantic-layer/exports)
- [Integrate with other orchestration tools](/docs/deploy/deployment-tools)
