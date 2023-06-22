---
title: "Deploy dbt jobs"
id: "deployments"
sidebar: "About job deployments"
---

Use dbt Cloud's capabilities to run and seamlessly schedule a dbt job in production. Rather than run dbt commands manually from the command line, you can leverage the [dbt Cloud's in-app scheduling](/docs/deploy/job-scheduler) to automate how and when you execute your dbt production jobs. 

Your dbt production jobs should create the tables and <Term id="view">views</Term> that your business intelligence tools and end users query. Before continuing, make sure you understand dbt's approach to [managing environments](/docs/collaborate/environments/environments-in-dbt). 

In addition to setting up a schedule, there are other considerations when setting up dbt to run in production:

* The seamless navigation helping you create a new dbt job or editing an existing one.
* Setting up notifications if a step within your job returns an error code (for example, a model can't be built or a test fails).
* Accessing logs to help debug any issues.
* Pulling the latest version of your git repo before running dbt (continuous deployment).
* Running, automating, and testing your dbt project before merging code into main (continuous integration).
* Allowing access for team members that need to collaborate on your dbt project.
* ...and more!


<a href="https://docs.getdbt.com/docs/deploy/dbt-cloud-job" target="_blank" class="pagination-nav__label nav-create-account button button--primary">Try deploying with dbt Cloud</a> 

<DocCarousel slidesPerView={1}>

<Lightbox src="/img/docs/dbt-cloud/deployment/deploy-scheduler.jpg" width="98%" title="An overview of a dbt Cloud job run which contains Run Summary, Job Trigger, Run Duration, and more."/>

<Lightbox src="/img/docs/dbt-cloud/deployment/run-history.jpg" width="95%" title="Run History dashboard allows you to monitor the health of your dbt project and displays jobs, job status, environment, timing, and more."/>


<Lightbox src="/img/docs/dbt-cloud/deployment/access-logs.gif" width="85%" title="Access logs for run steps" />

<Lightbox src ="/img/docs/dbt-cloud/using-dbt-cloud/job-commands.gif" width="95%" title="Setting up a job and configuring checkbox and dbt commands"/>

</DocCarousel>

<!--## Run dbt in production

If you want to run dbt jobs on a schedule, you can use tools such as dbt Cloud, Airflow, Prefect, Dagster, automation server, or Cron.-->

## Related docs

- [Build your deployment with other tools](/docs/deploy/deployment-tools)
