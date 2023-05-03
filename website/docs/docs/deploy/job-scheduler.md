---
title: "The dbt Cloud Scheduler"
id: "job-scheduler"
sidebar_label: "Job scheduler"
description: "The dbt Cloud Scheduler queues scheduled or API-triggered runs, before preparing the job to enter cloud data platform. Build observability into transformation workflows with the in-app scheduling, logging, and alerting." 
tags: [scheduler]
---

The Scheduler is the backbone of running jobs in dbt Cloud, bringing power and simplicity to building data pipelines in both continuous integration and production contexts. The Scheduler frees teams from having to build and maintain their own infrastructure and ensures the timeliness and reliability of data transformations.

The Scheduler enables both cron-based and event-driven execution of dbt commands in the user’s data platform. Specifically, the Scheduler handles:

- Cron-based execution of dbt Cloud jobs that run on a predetermined cadence
- Event-driven execution of dbt Cloud CI jobs triggered by pull requests to the the dbt repo
- Event-driven execution of dbt Cloud jobs triggered by API
- Event-driven execution of dbt Cloud jobs manually triggered by a user to "Run Now"

The Scheduler takes care of:
- queuing jobs
- creating short-lived environments to execute jobs’ dbt run commands
- delivering logs which are needed for debugging and remediation
- storing dbt artifacts for direct consumption and ingestion by the Metadata API

The Scheduler powers running dbt in staging and production environments, bringing ease and confidence to CI/CD workflows and enabling observability and governance in deploying dbt at scale.

## Scheduler terms

Familiarize yourself with these useful terms to help you understand how the dbt Cloud scheduler works.

| Term | Definition |
| --- | --- |
| dbt Cloud Scheduler | The dbt Cloud engine that powers job execution. The scheduler queues scheduled or API-triggered job runs, prepares an environment to execute job commands in the user's cloud data platform, and stores and serves logs and artifacts that are byproducts of run execution. |
| Job | A collection of run steps, settings, and a trigger to invoke dbt commands against a project in the user's cloud data platform |
| Job queue | The job queue acts as a waiting area for job runs when they are scheduled or triggered to run; runs remain in queue until execution begins. More specifically, the Scheduler checks the queue for runs that are due to execute, ensures the run is eligible to start, and then prepares an environment with appropriate settings, credentials, and commands to begin execution. Once execution begins, the run leaves the queue. |
| Over-scheduled job | A situation when a cron-scheduled job's run duration becomes longer than the frequency of the job’s schedule, resulting in a job queue that will grow faster than the scheduler can process the job’s runs. |
| Prep time | The time dbt Cloud takes to create a short-lived environment to execute the job commands in the user's cloud data warehouse. Prep time varies most significantly at the top of the hour when the dbt Cloud Scheduler experiences a lot of run traffic. |
| Run | A single, unique execution of a dbt job. |
| Run slot | Run slots control the number of jobs that can run concurrently. Each account has a fixed number of run slots, depending on the plan tier, that are shared across projects in the account. Each running job occupies a run slot for the duration of the run, so purchasing more run slots enables more jobs to execute in parallel. |
| Threads | When dbt builds a project's DAG, it tries to parallelize the execution by using threads. The [thread](/docs/core/connection-profiles#understanding-threads) count is the maximum number of paths through the DAG that dbt can work on simultaneously. The default value is 4 threads. |
| Wait time | Amount of time that dbt Cloud waits before running a job, either because there are no available slots or because a previous run of the same job is still in progress. |


## Scheduler queue

The dbt Cloud scheduler queues a deployment job to be processed when it's triggered to run, either by schedule, by API, by PR trigger, or manually. 

Before the job starts executing, the scheduler checks two conditions to determine if the run can start executing:

- **The account must have an available run slot** &mdash; If all run slots are occupied, the queued run will wait. The wait time is displayed in dbt Cloud. If there are long wait times, [upgrading to enterprise](https://www.getdbt.com/contact/) can provide more run slots and allow for higher job concurrency.

- **There must not be a run of the same job already in-flight** &mdash; The Scheduler executes distinct runs of the same dbt Cloud job serially to avoid model build collisions. If there's a job already running, the queued job will wait, and the wait time will be displayed in dbt Cloud.

If there is an available run slot and there's not an actively running instance of the job, the Scheduler will prepare the job to run in the user's cloud data warehouse. This prep involves readying a Kubernetes pod with the right version of dbt installed, setting environment variables, loading warehouse credentials and git provider authorization, amongst other environment-setting tasks. The time it takes to prepare the job is displayed as **prep time.**

Collectively **wait time** and **prep time** is the time a run spends in queue (or **Time in queue**).

<Lightbox src="/img/docs/dbt-cloud/deployment/deploy-scheduler.jpg" width="85%" title="An overview of a dbt Cloud job run"/>

## Job memory

In dbt Cloud, each run of a job executes in a pod with a default megabyte (MB) memory limit. If a job uses up all of the memory, the pod is terminated with a "memory limit error" message. There is not a memory limit set at the account-level.

Jobs consume a lot of memory in the following situations:
- A high thread count was specified
- Custom dbt macros attempt to load data into memory instead of pushing compute down to the cloud data platform
- Generating dbt project documentation when a source's schema has a large number of tables

Refer to [dbt Cloud architecture](/docs/cloud/about-cloud/architecture) for an architecture diagram and to learn how the data flows.


<!-- leaving space for CI job treatment, runtime, warm up pods updates

-->

## Run cancelation for over-scheduled jobs

:::info Scheduler won't cancel API-triggered jobs 
The scheduler will not cancel over-scheduled jobs triggered by the [API](/docs/dbt-cloud-apis/overview).
:::

**Over scheduled jobs** &mdash; The dbt Cloud scheduler prevents too many job runs from clogging the queue by cancelling unnecessary ones. If a job takes longer to run than its scheduled frequency, the queue will grow faster than the scheduler can process the runs, leading to a ever-expanding queue with runs that don’t need to be processed. 

The scheduler prevents queue clog by cancelling runs that aren't needed, ensuring there is only one run of the job in the queue at any given time. If a newer run is scheduled, any previous queued run will be canceled and have a helpful error message displayed:

<Lightbox src="/img/docs/dbt-cloud/deployment/run-error-message.jpg" width="85%" title="The cancelled runs display a helpful error message explaining why the run was cancelled and recommendations"/>

To prevent over-scheduling, users will need to take action by either refactoring the job so it runs faster or modifying its [schedule](/docs/deploy/job-triggers).

## Related docs
- [dbt Cloud architecture](/docs/cloud/about-cloud/architecture#about-dbt-cloud-architecture)
- [Job commands](/docs/deploy/job-commands)
- [Job notifications](/docs/deploy/job-notifications)
- [Webhooks](/docs/deploy/webhooks)
- [dbt Cloud CI job](/docs/deploy/cloud-ci-job)





