---
title: "Deploy dbt jobs"
id: "deployments"
sidebar: "About job deployments"
---

Running dbt in production means setting up a system to run a _dbt job on a schedule_, rather than running dbt commands manually from the command line. Your production dbt jobs should create the tables and <Term id="view">views</Term> that your business intelligence tools and end users query. Before continuing, make sure you understand dbt's approach to [managing environments](/docs/collaborate/environments/environments-in-dbt).

In addition to setting up a schedule, there are other considerations when setting up dbt to run in production:

* The complexity involved in creating a new dbt job or editing an existing one.
* Setting up notifications if a step within your job returns an error code (for example, a model can't be built or a test fails).
* Accessing logs to help debug any issues.
* Pulling the latest version of your git repo before running dbt (continuous deployment).
* Running your dbt project before merging code into master (continuous integration).
* Allowing access for team members that need to collaborate on your dbt project.

<!--## Run dbt in production

If you want to run dbt jobs on a schedule, you can use tools such as dbt Cloud, Airflow, Prefect, Dagster, automation server, or Cron.-->

<div className="grid--2-col">

<Card
    title="Deploy with dbt Cloud"
    body="Use dbt Cloud's in-app scheduling to to run your production jobs. Schedule jobs by day of the week, times or recurring intervals. "
link="/docs/deploy/dbt-cloud-job"
    icon="dbt-bit"/>

<Card
    title="Deploy with other tools"
    body="Use tools such as Airflow, Prefect, Dagster, automation server, Cron, or ADF to run dbt Cloud jobs."
link="/docs/deploy/deployment-tools"
    icon="pencil-paper"/>    

</div> <br />