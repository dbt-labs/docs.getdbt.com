---
title: "Deploy with dbt Cloud"
id: "dbt-cloud-job"
description: "You can enable continuous integration (CI) to test every single change prior to deploying the code to production just like in a software development workflow."
---

Use dbt Cloud's job scheduler to streamline your data transformation workflows and empower data teams to run dbt in production with ease. 

Running dbt in production using dbt Cloud's job scheduler eliminates the need to manually run dbt commands from the command line or set up an orchestration system. It's designed exclusively to streamline your dbt project deployments and runs, and keeps you data pipelines functioning seamlessly and efficiently.

To experience the benefits of dbt Cloud, [sign up](https://cloud.getdbt.com/signup/) for a free account 
today. 

## Prerequisites

- You must have a [dbt Cloud account](https://www.getdbt.com/signup/) and [Developer seat license](/docs/cloud/manage-access/seats-and-users)
- You must have a dbt project connected to a [data platform](/docs/cloud/connect-data-platform/about-connections)
- You must have [access permission](/docs/cloud/manage-access/about-access) to create, edit, and run jobs
- You must set up a [deployment environment](/docs/collaborate/environments/dbt-cloud-environments) 
- Your deployment environment must be on dbt version 1.0 or higher

<Lightbox src ="/img/dbt-cloud-jobs.gif" width="85%" title="An overview of a dbt Cloud job run"/>

## Job scheduler features

dbt Cloud's job scheduler, documentation, logging, automation, and alerting features allow you to build observability into your processes easily. 

The protection policies on branches ensure that your data moves through governed processes every step of the way, from dev to stage to prod environments.

### Create and schedule jobs

 Jobs are a set of dbt commands that you want to run on a schedule, which you can do in dbt Cloud. 
 Each job run in dbt Cloud will have a run history, run status and a run overview, which provides you with:

- Job trigger type
- Commit SHA
- Environment name
- Sources and documentation info 
- Job run details, including run timing, [model timing data](/docs/dbt-versions/release-notes/January-2022/model-timing-more), and [artifacts](/docs/deploy/artifacts)
- Detailed run steps with logs and their statuses

You can create a job and configure it to run on [scheduled days and times](/docs/deploy/job-triggers#schedule-days) or enter a [custom cron schedule](/docs/deploy/job-triggers#custom-cron-schedules). To create a new job, refer to the following steps:
 

1. Create a new job by clicking **Deploy** in the header, click **Jobs** and then **Create job**.
1. Provide a job name, for example "Production run". 
1. Under **Environment**, add the following:
    * **Environment** &mdash; Link to an existing deployment environment
    * **dbt Version** &mdash; Select the environment [version](/docs/dbt-versions/core). We recommend the most recent version
    * **Target Name** &mdash; Define the [target name](/docs/build/custom-target-names) for any dbt cloud job to correspond to settings in your project
    * **Threads** &mdash; The default value will be 4 [threads](/docs/core/connection-profiles#understanding-threads)

1. Define [environment variables](/docs/build/environment-variables) if you wish to customize the behavior of your project

<Lightbox src ="/img/docs/dbt-cloud/using-dbt-cloud/create-new-job.jpg" width="85%" title="Configuring your environment job settings"/>

5. Under **Execution Settings**, you can configure the fields needed to execute your job:

    * **Run Timeout** &mdash; Configure the number of seconds a run will execute before it's cancelled by dbt Cloud. Setting this to 0 means it'll never time out runs for that job.   
    * **Defer to a previous run state** &mdash; Select a production job you want to [defer](/docs/deploy/cloud-ci-job#deferral-and-state-comparison) to. This enables dbt Cloud to examine the artifacts from the most recent, successful run of that job and determine new and modified resources. 
    * **Generate docs on run** checkbox &mdash; Configure the job to automatically [generate project docs](/docs/collaborate/build-and-view-your-docs) each time this job runs.
    * **Run on source freshness** checkbox &mdash;  Configure [dbt source freshness](/docs/deploy/source-freshness) as the first step of this job, without breaking subsequent steps.
    * **Commands** &mdash; Add or remove [job commands](/docs/deploy/job-commands), which are specific tasks you set in your dbt Cloud jobs.

<Lightbox src ="/img/docs/dbt-cloud/using-dbt-cloud/execution-settings.jpg" width="85%" title="Configuring your execution job settings"/>

6. Under the **Triggers** section, you can configure when and how dbt should trigger the job. Refer to [job triggers](/docs/deploy/job-triggers) for more details.

    * **Schedule** tab &mdash; Use the **Run on schedule** toggle to configure your job to run on [scheduled](/docs/deploy/job-triggers#schedule-days) days and time, or enter a [custom cron schedule](/docs/deploy/job-triggers#custom-cron-schedules).
    * **Continuous Integration** tab &mdash; Configure [continuous integration (CI)](/docs/deploy/cloud-ci-job) to run when someone opens a new pull request in your dbt repository.
    * **API** tab &mdash; Use the [dbt API](/docs/dbt-cloud-apis/overview) to trigger a job or send events to other systems.

7. Select **Save**, then click **Run Now** to run your job. Click the run and watch its progress under **Run history**.


<Lightbox src ="/img/docs/dbt-cloud/using-dbt-cloud/triggers.jpg" width="85%" title="Configuring your job triggers"/>


### Notifications

Set up job notifications to inform you via email or a selected Slack channel when a job run succeeds, fails, or is cancelled, enabling you to respond quickly and proactively.  

Refer to [job notifications](/docs/deploy/job-notifications) for more info. 

### Host and share docs

You can set up, view and share and view your project documentation in order to streamline your team's collaboration and productivity. Invite teammates to dbt Cloud to collaborate and share documentation. 

Refer to [build and view your docs](/docs/collaborate/build-and-view-your-docs) for more info.

### Access logs

You can view or download in-progress and historical logs for your dbt runs, making it easy for anyone on the team to debug errors more efficiently.

<Lightbox src="/img/docs/dbt-cloud/deployment/access-logs.jpg" width="85%" title="Access logs for run steps" />

### Automate workflows

In order to ensure that your data pipelines are functioning seamlessly and efficiently, use dbt Cloud tools such as:

- [dbt API](/docs/dbt-cloud-apis/overview) &mdash; Administrate a dbt Cloud account or fetch your project metadata.
- [Continuous Integration](/docs/deploy/cloud-ci-job) &mdash; Test every single code change you make prior to deploying that new logic into production. 
- [Webhooks](/docs/deploy/webhooks) &mdash; Create outbound webhooks to send events (notifications) about your dbt jobs to your other systems

These tools provide you with automated workflows and streamline your data processing, enabling you to focus on other crucial tasks and increase your overall productivity.
