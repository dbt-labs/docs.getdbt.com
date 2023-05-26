---
title: "Deploy with dbt Cloud"
id: "dbt-cloud-job"
description: "You can enable continuous integration (CI) to test every single change prior to deploying the code to production just like in a software development workflow."
tags: ["scheduler"]
---

Use dbt Cloud's Scheduler to streamline your data transformation workflows and empower data teams to run dbt in production with ease. 

Running dbt in production using the scheduler eliminates the need to manually run dbt commands from the command line or set up an orchestration system. It's designed exclusively to streamline your dbt project deployments and runs and keeps your data pipelines functioning seamlessly and efficiently.

To experience the benefits of dbt Cloud, [sign up](https://cloud.getdbt.com/signup/) for a free account 
today. 

<Lightbox src ="/img/dbt-cloud-jobs.gif" width="85%" title="An overview of a dbt Cloud job run"/>

## Prerequisites

- You must have a [dbt Cloud account](https://www.getdbt.com/signup/) and [Developer seat license](/docs/cloud/manage-access/seats-and-users)
- You must have a dbt project connected to a [data platform](/docs/cloud/connect-data-platform/about-connections)
- You must [create a dbt Cloud job](#create-and-schedule-jobs)
- You must have [access permission](/docs/cloud/manage-access/about-user-access) to read, create, edit, or run jobs
- You must set up a [deployment environment](/docs/collaborate/environments/dbt-cloud-environments) 
- Your deployment environment must be on dbt version 1.0 or higher

## Features

dbt Cloud simplifies job scheduling, documentation, logging, automation, and alerting. These features make it easy to deploy jobs confidently and build observability into your processes.

### Scheduler 

The dbt Cloud's Scheduler is a powerful tool that helps data teams optimize their data transformation workflows, makes it easier to run dbt in production environments, governs data, automates your dbt jobs, and empowers teams to get results faster with less effort. 

Use the scheduler to improve the efficiency of your data transformation process, while also gaining greater visibility into its progress. You can use custom scheduling for your jobs, which allows you to flexibly run jobs to meet your company's data freshness needs. The dbt Cloud Scheduler gives you power, while abstracting away complexity.

Refer to [Scheduler](/docs/deploy/job-scheduler) for more info on how the scheduler works. 

<Lightbox src="/img/docs/dbt-cloud/deployment/deploy-scheduler.jpg" width="100%" title="An overview of a dbt Cloud job run"/>

### Deployment monitor

Use the Deployment monitor to gain greater visibility into your deployment health and quickly detect any issues with the improved filtering and sorting capabilities. You can now easily curate the view based on environment, prioritizing the ones that matter most, such as Production. With pre-filtered lists for in progress and in queue activities, it's quicker and easier to track the relevant activity and stay on top of your deployment status.

The Deployment monitor is accessible by going to the main dbt Cloud dashboard page or clicking the dbt logo on the upper-left. It includes:

- A new run history visualization component to quickly scan a larger number of recent runs and get a better overview of overall health/activity 
- Pre-filtered lists have been added for In Progress, In Queue, and Latest Failed jobs. 
- Filter the page by environment, with the preference being stored for future use. 
- Lastly, the visualization at the top of the page now filters runs by trigger and displays the last 24 hours of runs, with a limit of 500.

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/deploy-monitor.jpg" width="85%" title="The Deployment monitor dashboard displays overall deployment health and activity, allows you to filter the page by environment, and more" />

### Notifications

Set up job notifications to inform you via email or a selected Slack channel when a job run succeeds, fails, or is canceled, enabling you to respond quickly and proactively.  

Refer to [job notifications](/docs/deploy/job-notifications) for more info. 

### Host and share docs

You can set up, view, and share your project documentation in order to streamline your team's collaboration and productivity. Invite teammates to dbt Cloud to collaborate and share documentation. 

Refer to [build and view your docs](/docs/collaborate/build-and-view-your-docs) for more info.

### Run history

The Run History dashboard in dbt Cloud helps you monitor the health of your dbt project. It provides a detailed overview of all of your project's job runs and empowers you with a variety of filters to help you focus on specific aspects. You can also use it to review recent runs, find errored runs, and track the progress of runs in progress. You can access it on the top navigation menu by clicking **Deploy** and then **Run History**. 

The dashboard displays your full run history, including job name, status, environment associated, job trigger, commit SHA, schema, and timing info. 

dbt Cloud developers can access their run history for the last 365 days through the dbt Cloud user interface (UI) and API.

We limit self-service retrieval of run history metadata to 365 days in order improve dbt Cloud's performance. For more info on the run history retrieval change, refer to [Older run history retrieval change](/docs/dbt-versions/release-notes/May-2023/run-history-endpoint).

<Lightbox src="/img/docs/dbt-cloud/deployment/run-history.jpg" width="85%" title="Run History dashboard allows you to monitor the health of your dbt project and displays jobs, job status, environment, timing, and more."/>

### Access logs

You can view or download in-progress and historical logs for your dbt runs, making it easy for anyone on the team to debug errors more efficiently.

<Lightbox src="/img/docs/dbt-cloud/deployment/access-logs.jpg" width="85%" title="Access logs for run steps" />

### Model timing 
> Available on [multi-tenant](/docs/cloud/about-cloud/regions-ip-addresses) dbt Cloud accounts on the [Team or Enterprise plans](https://www.getdbt.com/pricing/).

The model timing dashboard on dbt Cloud displays the composition, order, and time taken by each model in a job run. The visualization appears for successful jobs and highlights the top 1% model durations. This helps you identify bottlenecks in your runs, so you can investigate them and potentially make changes to improve their performance. 

You can find the dashboard on the **Run Overview** page. 

<Lightbox src="/img/docs/dbt-cloud/model-timing.jpg" width="85%" title="The model timing tab displays the top 1% of model durations and visualizes model bottlenecks" />


### Automate workflows

In order to ensure that your data pipelines are functioning seamlessly and efficiently, use dbt Cloud tools such as:

- [dbt API](/docs/dbt-cloud-apis/overview) &mdash; Administrate a dbt Cloud account or fetch your project metadata.
- [Continuous Integration](/docs/deploy/cloud-ci-job) &mdash; Test every single code change you make prior to deploying that new logic into production. 
- [Webhooks](/docs/deploy/webhooks) &mdash; Create outbound webhooks to send events (notifications) about your dbt jobs to your other systems

These tools provide you with automated workflows and streamline your data processing, enabling you to focus on other crucial tasks and increase your overall productivity.

## Create and schedule jobs

Jobs make it easy to run dbt commands against a project in the your cloud data platform, triggered either by schedule or events. Each job run in dbt Cloud will have a run history, run status and a run overview, which provides you with:

- Job trigger type
- Commit SHA
- Environment name
- Sources and documentation info 
- Job run details, including run timing, [model timing data](#model-timing), and [artifacts](/docs/deploy/artifacts)
- Detailed run steps with logs and their statuses

You can create a job and configure it to run on [scheduled days and times](/docs/deploy/job-triggers#schedule-days) or enter a [custom cron schedule](/docs/deploy/job-triggers#custom-cron-schedules). To create a new job, refer to the following steps:

1. Create a new job by clicking **Deploy** in the header, click **Jobs** and then **Create job**.
2. Provide a job name, for example "Production run". 
3. Under **Environment**, add the following:
    * **Environment** &mdash; Link to an existing deployment environment
    * **dbt Version** &mdash; Select the environment [version](/docs/dbt-versions/core). We recommend the most recent version
    * **Target Name** &mdash; Define the [target name](/docs/build/custom-target-names) for any dbt cloud job to correspond to settings in your project
    * **Threads** &mdash; The default value will be 4 [threads](/docs/core/connection-profiles#understanding-threads)

4. Define [environment variables](/docs/build/environment-variables) if you wish to customize the behavior of your project

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

## Related docs

- [Deploy dbt jobs](/docs/deploy/deployments)
- [Artifacts](/docs/deploy/artifacts)
- [Scheduler](/docs/deploy/job-scheduler)
- [dbt Cloud features](/docs/cloud/about-cloud/dbt-cloud-features)
