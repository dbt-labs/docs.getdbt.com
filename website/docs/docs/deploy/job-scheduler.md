---
title: "Job scheduler"
id: "job-scheduler"
sidebar_label: "Job scheduler"
description: "The dbt Cloud job scheduler queues scheduled or API-triggered runs, before preparing the job to enter cloud data platform. Build observability into transformation workflows with the in-app scheduling, logging, and alerting." 
tags: [scheduler]
---

The job scheduler is the backbone of running jobs in dbt Cloud, bringing power and simplicity to building data pipelines in both continuous integration and production contexts. The scheduler frees teams from having to build and maintain their own infrastructure, and ensures the timeliness and reliability of data transformations.

The scheduler enables both cron-based and event-driven execution of dbt commands in the user’s data platform. Specifically, it handles:

- Cron-based execution of dbt Cloud jobs that run on a predetermined cadence
- Event-driven execution of dbt Cloud CI jobs triggered by pull requests to the dbt repo
- Event-driven execution of dbt Cloud jobs triggered by API
- Event-driven execution of dbt Cloud jobs manually triggered by a user to "Run Now"

The scheduler handles various tasks including queuing jobs, creating temporary environments to run the dbt commands required for those jobs, providing logs for debugging and remediation, and storing dbt artifacts for direct consumption/ingestion by the Metadata API. 

**Note**: Executions performed in the dbt Cloud IDE aren't included in the scheduler's handling. For example, dbt commands executed in the IDE won't affect the Scheduler or your run slots. 

The scheduler powers running dbt in staging and production environments, bringing ease and confidence to CI/CD workflows and enabling observability and governance in deploying dbt at scale. 

<Lightbox src ="/img/dbt-cloud-jobs.gif" width="85%" title="An overview of a dbt Cloud job run"/>

## Scheduler terms

Familiarize yourself with these useful terms to help you understand how the job scheduler works.

| Term | Definition |
| --- | --- |
| Scheduler | The dbt Cloud engine that powers job execution. The scheduler queues scheduled or API-triggered job runs, prepares an environment to execute job commands in the user's cloud data platform, and stores and serves logs and artifacts that are byproducts of run execution. |
| Job | A collection of run steps, settings, and a trigger to invoke dbt commands against a project in the user's cloud data platform. |
| Job queue | The job queue acts as a waiting area for job runs when they are scheduled or triggered to run; runs remain in queue until execution begins. More specifically, the Scheduler checks the queue for runs that are due to execute, ensures the run is eligible to start, and then prepares an environment with appropriate settings, credentials, and commands to begin execution. Once execution begins, the run leaves the queue. |
| Over-scheduled job | A situation when a cron-scheduled job's run duration becomes longer than the frequency of the job’s schedule, resulting in a job queue that will grow faster than the scheduler can process the job’s runs. |
| Prep time | The time dbt Cloud takes to create a short-lived environment to execute the job commands in the user's cloud data platform. Prep time varies most significantly at the top of the hour when the dbt Cloud Scheduler experiences a lot of run traffic. |
| Run | A single, unique execution of a dbt job. |
| Run slot | Run slots control the number of jobs that can run concurrently. Each account has a fixed number of run slots, depending on the plan tier, that are shared across projects in the account. Each running job occupies a run slot for the duration of the run, so purchasing more run slots enables more jobs to execute in parallel. |
| Threads | When dbt builds a project's DAG, it tries to parallelize the execution by using threads. The [thread](/docs/core/connection-profiles#understanding-threads) count is the maximum number of paths through the DAG that dbt can work on simultaneously. The default thread count in a job is 4. |
| Wait time | Amount of time that dbt Cloud waits before running a job, either because there are no available slots or because a previous run of the same job is still in progress. |


## Scheduler queue

The scheduler queues a deployment job to be processed when it's triggered to run because of a [set schedule](#create-and-schedule-jobs), by an API call, or manually. 

Before the job starts executing, the scheduler checks these conditions to determine if the run can start executing:

- **Is there a run slot that's available on the account for use?** &mdash; If all run slots are occupied, the queued run will wait. The wait time is displayed in dbt Cloud. If there are long wait times, [upgrading to Enterprise](https://www.getdbt.com/contact/) can provide more run slots and allow for higher job concurrency.

- **Does this same job have a run already in progress?** &mdash; The scheduler executes distinct runs of the same dbt Cloud job serially to avoid model build collisions. If there's a job already running, the queued job will wait, and the wait time will be displayed in dbt Cloud.

If there is an available run slot and there isn't an actively running instance of the job, the scheduler will prepare the job to run in your cloud data platform. This prep involves readying a Kubernetes pod with the right version of dbt installed, setting environment variables, loading data platform credentials, and Git provider authorization, amongst other environment-setting tasks. The time it takes to prepare the job is displayed as **prep time** in the UI.

Together, **wait time** plus **prep time** is the total time a run spends in the queue (or **Time in queue**).

<Lightbox src="/img/docs/dbt-cloud/deployment/deploy-scheduler.jpg" width="85%" title="An overview of a dbt Cloud job run"/>

### Treatment of CI jobs
When compared to deployment jobs, the scheduler behaves differently when handling [continuous integration (CI) jobs](/docs/deploy/cloud-ci-job). First, it queues a CI job to be processed when it's triggered to run by a Git pull request. And, the conditions the scheduler checks to determine if the run can start executing are also different: 

- **Will the CI run consume a run slot?** &mdash; CI runs don't consume run slots and will never block production runs.- **Does this same job have a run already in progress?** &mdash; CI runs can execute concurrently (in parallel). CI runs build into unique temporary schemas, and CI checks execute in parallel to help increase team productivity.

## Job memory

In dbt Cloud, the setting to provision memory available to a job is defined at the account-level and applies to each job running in the account; the memory limit cannot be customized per job. If a running job reaches its memory limit, the run is terminated with a "memory limit error" message.

Jobs consume a lot of memory in the following situations:
- A high thread count was specified
- Custom dbt macros attempt to load data into memory instead of pushing compute down to the cloud data platform
- Having a job that generates dbt project documentation for a large and complex dbt project. 
  * To prevent problems with the job running out of memory, we recommend generating documentation in a separate job that is set aside for that task and removing `dbt docs generate` from all other jobs. This is especially important for large and complex projects.

Refer to [dbt Cloud architecture](/docs/cloud/about-cloud/architecture) for an architecture diagram and to learn how the data flows.


### Pod memory 


## Run cancellation for over-scheduled jobs

:::info Scheduler won't cancel API-triggered jobs 
The scheduler will not cancel over-scheduled jobs triggered by the [API](/docs/dbt-cloud-apis/overview).
:::

The dbt Cloud scheduler prevents too many job runs from clogging the queue by canceling unnecessary ones. If a job takes longer to run than its scheduled frequency, the queue will grow faster than the scheduler can process the runs, leading to an ever-expanding queue with runs that don’t need to be processed (called _over-scheduled jobs_). 

The scheduler prevents queue clog by canceling runs that aren't needed, ensuring there is only one run of the job in the queue at any given time. If a newer run is queued, any previous queued run for that job will be canceled and have a helpful error message displayed:

<Lightbox src="/img/docs/dbt-cloud/deployment/run-error-message.jpg" width="85%" title="The cancelled runs display a helpful error message explaining why the run was cancelled and recommendations"/>

To prevent over-scheduling, users will need to take action by either refactoring the job so it runs faster or modifying its [schedule](/docs/deploy/job-triggers).

## Create and schedule jobs {#create-and-schedule-jobs}

Jobs make it easy to run dbt commands against a project in the your cloud data platform, triggered either by schedule or events. Each job run in dbt Cloud will have a run history, run status and a run overview, which provides you with:

- Job trigger type
- Commit SHA
- Environment name
- Sources and documentation info 
- Job run details, including run timing, [model timing data](#model-timing), and [artifacts](/docs/deploy/artifacts)
- Detailed run steps with logs and their statuses

You can create a job and configure it to run on [scheduled days and times](/docs/deploy/job-triggers#schedule-days) or enter a [custom cron schedule](/docs/deploy/job-triggers#custom-cron-schedules). 

### Prerequisites

- You must have a dbt Cloud account and [Developer seat license](/docs/cloud/manage-access/seats-and-users). If you don't, you can [sign up](https://www.getdbt.com/signup/) for a [free account](https://www.getdbt.com/pricing/). 
- You must have a dbt project connected to a [data platform](/docs/cloud/connect-data-platform/about-connections).
- You must [create and schedule a dbt Cloud job](#create-and-schedule-jobs).
- You must have [access permission](/docs/cloud/manage-access/about-user-access) to read, create, edit, or run jobs.
- You must set up a [deployment environment](/docs/collaborate/environments/dbt-cloud-environments). 
- Your deployment environment must be on dbt version 1.0 or higher

### Steps

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

<Lightbox src ="/img/docs/dbt-cloud/using-dbt-cloud/triggers.jpg" width="85%" title="Configuring your job triggers"/>

7. Select **Save**, then click **Run Now** to run your job. Click the run and watch its progress under **Run history**.

## Related docs
- [dbt Cloud architecture](/docs/cloud/about-cloud/architecture#about-dbt-cloud-architecture)
- [Job commands](/docs/deploy/job-commands)
- [Job notifications](/docs/deploy/job-notifications)
- [Webhooks](/docs/deploy/webhooks)
- [dbt Cloud CI job](/docs/deploy/cloud-ci-job)
