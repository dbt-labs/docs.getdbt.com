---
title: "Job settings"
description: "Learn how to create and schedule jobs in dbt Cloud for the scheduler to run. Jobs help you build observability into transformation workflows with the in-app scheduling, logging, and alerting." 
tags: [scheduler]
---

Jobs make it easy to run dbt commands against a project in your cloud data platform, triggered either by schedule or events. Each job run in dbt Cloud will have a run history, run status, and a run overview, which provides you with:

- Job trigger type
- Commit SHA
- Environment name
- Sources and documentation info 
- Job run details, including run timing, [model timing data](#model-timing), and [artifacts](/docs/deploy/artifacts)
- Detailed run steps with logs and their statuses

You can create a job and configure it to run on [scheduled days and times](/docs/deploy/job-triggers#schedule-days) or enter a [custom cron schedule](/docs/deploy/job-triggers#custom-cron-schedules). 

## Prerequisites

- You must have a dbt Cloud account and [Developer seat license](/docs/cloud/manage-access/seats-and-users). If you don't, you can [sign up](https://www.getdbt.com/signup/) for a [free account](https://www.getdbt.com/pricing/). 
- You must have a dbt project connected to a [data platform](/docs/cloud/connect-data-platform/about-connections).
- You must have [access permission](/docs/cloud/manage-access/about-user-access) to view, create, modify, or run jobs.
- You must set up a [deployment environment](/docs/deploy/deploy-environments). 

## Create and schedule jobs {#create-and-schedule-jobs}

:::tip Join our beta 

dbt Labs is currently running a beta that provides improved UI updates for setting up deploy jobs. For docs on this, click on the **Beta version** tab below.

If you're interested in joining our beta, please fill out our Google Form to [sign up](https://forms.gle/VxwBD1xjzouE84EQ6).

:::

<Tabs queryString="version">
<TabItem value="current" label="Current version" default>

1. Create a new job by clicking **Deploy** in the header, click **Jobs** and then **Create job**.
1. Provide a job name, for example "Hourly Customer Job". 
1. Under **Environment**, add the following:
    * **Environment** &mdash; Link to an existing deployment environment.
    * **dbt Version** &mdash; Select the dbt [version](/docs/dbt-versions/core). dbt Labs recommends inheriting the version from the environment settings.
    * **Target Name** &mdash; Define the [target name](/docs/build/custom-target-names) for any dbt cloud job to correspond to settings in your project.
    * **Threads** &mdash; The default value is 4 [threads](/docs/core/connect-data-platform/connection-profiles#understanding-threads). Increase the thread count to increase model execution concurrency. 

1. Define [environment variables](/docs/build/environment-variables) if you want to customize the behavior of your project.

<Lightbox src ="/img/docs/dbt-cloud/using-dbt-cloud/create-new-job.jpg" width="85%" title="Configuring your environment job settings"/>

5. Under **Execution Settings**, you can configure the fields needed to execute your job:

    * **Run Timeout** &mdash; Configure the number of seconds a run will execute before dbt Cloud cancels it. Setting this to 0 means it'll never time out runs for that job.   
    * **Defer to a previous run state** &mdash; Select a production job you want to defer to. This enables dbt Cloud to examine the artifacts from the most recent, successful run of that deferred job, enabling state comparison and rewiring of upstream dependencies to any model that doesn’t exist in the current run's schema. 
    * **Generate docs on run** checkbox &mdash; Configure the job to automatically [generate project docs](/docs/collaborate/build-and-view-your-docs) each time this job runs.
    * **Run on source freshness** checkbox &mdash;  Configure [dbt source freshness](/docs/deploy/source-freshness) as the first step of the job without breaking subsequent steps.
    * **Commands** &mdash; Add or remove [job commands](/docs/deploy/job-commands), which are specific tasks you set in your dbt Cloud jobs.

<Lightbox src ="/img/docs/dbt-cloud/using-dbt-cloud/execution-settings.jpg" width="85%" title="Configuring your execution job settings"/>

6. Under the **Triggers** section, you can configure when and how dbt will trigger the job. Refer to [job triggers](/docs/deploy/job-triggers) for more details.

    * **Schedule** tab &mdash; Use the **Run on schedule** toggle to configure your job to run on [scheduled](/docs/deploy/job-triggers#schedule-days) days and time, or enter a [custom cron schedule](/docs/deploy/job-triggers#custom-cron-schedules).
    * **Continuous Integration** tab &mdash; Configure [continuous integration (CI)](/docs/deploy/continuous-integration) to run when someone opens a new pull request in your dbt repository.
    * **API** tab &mdash; Use the [dbt API](/docs/dbt-cloud-apis/overview) to trigger a job.

<Lightbox src ="/img/docs/dbt-cloud/using-dbt-cloud/triggers.jpg" width="85%" title="Configuring your job triggers"/>

7. Select **Save**, then click **Run Now** to run your job. Click the run and watch its progress under **Run history**.

</TabItem>

<TabItem value="beta" label="Beta version">

1. On your deployment environment page, click **Create Job** > **Deploy Job** to create a new deploy job. 
2. Options in the **Job Description** section:
    - **Job Name** &mdash; Specify the name for this deploy job. For example, `Daily build`.
    - **Environment** &mdash;  By default, it’s set to the deployment environment you created the deploy job from.
3. Options in the **Execution Settings** section:
    - **Commands** &mdash; By default, it includes the `dbt build` command. Click **Add command** to add more [commands](/docs/deploy/job-commands) that you want to be invoked when this job runs.
    - **Generate docs on run** &mdash; Enable this option if you want to [generate project docs](/docs/collaborate/build-and-view-your-docs) when this deploy job runs.
    - **Run source freshness** &mdash; Enable this option to invoke the `dbt source freshness` command before running this deploy job. Refer to [Source freshness](/docs/deploy/source-freshness) for more details.
4. Options in the **Schedule** section:
    - **Run on schedule** &mdash; Enable this option to run this deploy job on a set schedule.
    - **Timing** and **Run every (UTC)** &mdash; Specify whether to [schedule](#schedule-days) this deploy job using **Frequency** that runs the job at specific times of day, **Specific Intervals** that runs the job every specified number of hours, or to **Cron Schedule** that runs the job specified using [cron syntax](#custom-cron-schedule).
    - **Days of the Week** &mdash; By default, it’s set to every day when **Frequency** or **Specific Intervals** is chosen for **Timing**.

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/create-deploy-job.png" width="90%" title="Example of Deploy Job page in dbt Cloud UI"/>

5. (optional) Options in the **Advanced Settings** section: 
    - **Environment Variables** &mdash; Define [environment variables](/docs/build/environment-variables) to customize the behavior of your project when this deploy job runs.
    - **Target Name** &mdash; Define the [target name](/docs/build/custom-target-names) to correspond this deploy job to the settings in your project.
    - **Run Timeout** &mdash; Cancel this deploy job if the run time exceeds the timeout value. 
    - **Compare changes against an environment (Deferral)** option — By default, it’s set to **No deferral**.
    - **dbt Version** &mdash; By default, it’s set to inherit the [dbt version](/docs/dbt-versions/core) from the environment. dbt Labs strongly recommends that you don't change the default setting as mismatched versions can result in unexpected behavior.
    - **Threads** &mdash; By default, it’s set to 4 [threads](/docs/core/connect-data-platform/connection-profiles#understanding-threads). Increase the thread count to increase model execution concurrency.

    <Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/deploy-job-adv-settings.png" width="90%" title="Example of Advanced Settings on Deploy Job page"/>

</TabItem>

</Tabs>
