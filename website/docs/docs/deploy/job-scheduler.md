---
title: "The dbt Cloud job scheduler"
id: "job-scheduler"
sidebar_label: "Job scheduler"
description: "The dbt Cloud Scheduler queues scheduled or API-triggered runs, before preparing the job to enter cloud data platform. Build observability into transformation workflows with the in-app scheduling, logging, and alerting." 
tags: [scheduler]
---

The Scheduler is the backbone of running jobs in dbt Cloud, bringing power and simplicity to building data pipelines in both continuous integration and production contexts. The Scheduler frees teams from having to build and maintain their own infrastructure and ensures the timeliness and reliability of data transformations.

The Scheduler enables both cron-based and event-driven execution of dbt commands in the user’s warehouse. Specifically, the Scheduler handles:

- Cron-based execution of dbt Cloud jobs that run on a predetermined cadence
- Event-driven execution of dbt Cloud CI jobs triggered by pull requests to the the dbt repo
- Event-driven execution of dbt Cloud jobs triggered by API

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
| dbt Cloud Scheduler | The dbt Cloud engine that powers job execution. The scheduler queues scheduled or API-triggered job runs, prepares an environment to execute job commands in the user's cloud data warehouse, and stores and serves logs and artifacts that are byproducts of run execution. |
| Job | An action dbt Cloud takes to automatically execute dbt commands that run tests and create tables and views for your data platform. |
| Job queue | The place where jobs are held, waiting to be launched by the scheduler. They haven't started running yet, but they are ready to go. It's like a waiting area for jobs. |
| Over scheduling | Situation when a job is currently running, but there are additional copies of the same job waiting in a queue to start as soon as the current job finishes. |
| Prep time | The time dbt Cloud takes to configure a job to run a project on your cloud data platform. Prep time can vary depending on the complexity of the job and the amount of data being processed. |
| Run | A single unique attempt to run a dbt job. |
| Run slot | Run slots control the number of jobs that can run concurrently: one run slot allows for a single job at a time. Adding more run slots enables multiple jobs to run at the same time. |
| Threads | When you run dbt, it creates a graph of links between models. The number of [threads](/docs/core/connection-profiles#understanding-threads) is the maximum number of paths that dbt can work on at once. The default value is 4 threads. |
| Wait time | Amount of time that dbt Cloud waits before running your job, either because there are no available slots for running jobs or because a previous run of the same job is still in progress. |


## Scheduler queue

The dbt Cloud scheduler queues a deployment job to be processed when it's triggered to run, either by schedule or by API. 

Before the job starts executing, the scheduler checks two conditions to determine if the run can start executing:

- **The account must have an available run slot** &mdash; If all run slots are occupied, the queued run will wait. The wait time is displayed in dbt Cloud. If there are long waiting times, [upgrading to enterprise](https://www.getdbt.com/contact/) can provide more run slots and allow for higher job concurrency.

- **There must not be a run of the same job already in-flight** &mdash; The scheduler executes distinct runs of the same dbt Cloud job serially to avoid model build collisions. If there's a job already running, the queued job will wait and the waiting time will be displayed in dbt Cloud.

Once the available slot conditions and distinct run checks are met, the scheduler will prepare the job to run on your data platform. The time it takes to prepare the job is displayed as **prep time.**

Collectively **wait time** and **prep time** is the time a run spends in queue (or **Time in queue**).

<Lightbox src="/img/docs/dbt-cloud/deployment/deploy-scheduler.jpg" width="85%" title="An overview of a dbt Cloud job run"/>

## Job memory

In dbt Cloud, each run of a job gets its own [Kubernetes pod](https://en.wikipedia.org/wiki/Kubernetes) with a default megabyte (MB) memory limit. If a job uses up all of that memory, the pod is terminated with a "memory error" message. Each pod has its own memory limit, so having multiple jobs that use up some of the MBs each won't exhaust MB limit set for your account.

It's possible that jobs can consume a lot of memory in various situations, such as when bringing data back into dbt for processing, running a high thread count, or retrieving tables from schemas during docs generation.

Refer to [dbt Cloud architecture](/docs/cloud/about-cloud/architecture) for an architecture diagram and to learn how the data flows.


<!-- leaving space for CI job treatment, runtime, warm up pods updates

-->

## Run cancellation

:::info Scheduler won't cancel API-triggered jobs 
The scheduler will not cancel over-scheduled jobs triggered by the [API](/docs/dbt-cloud-apis/overview).
:::

**Over scheduled jobs** &mdash; The dbt Cloud scheduler prevents too many job runs from clogging the queue by cancelling unnecessary ones. If a job takes longer to run than its scheduled frequency, the queue can grow faster than the scheduler can process, leading to unnecessary runs. 

The scheduler prevents queue clog by cancelling runs that aren't needed, ensuring there is only one run of the job in the queue at any given time. If a newer run is scheduled, any previous queued run will be canceled and have a helpful error message displayed:

<Lightbox src="/img/docs/dbt-cloud/deployment/run-error-message.jpg" width="85%" title="The cancelled runs display a helpful error message explaining why the run was cancelled and recommendations"/>

To prevent over-scheduling, users will need to take action by either refactoring the job so it runs faster or modifying its [schedule](/docs/deploy/job-triggers).

## Related docs
- [dbt Cloud architecture](/docs/cloud/about-cloud/architecture#about-dbt-cloud-architecture)
- [Job commands](/docs/deploy/job-commands)
- [Job notifications](/docs/deploy/job-notifications)
- [Webhooks](/docs/deploy/webhooks)
- [dbt Cloud CI job](/docs/deploy/cloud-ci-job)





