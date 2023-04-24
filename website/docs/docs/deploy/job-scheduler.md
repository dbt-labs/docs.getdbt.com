---
title: "The dbt Cloud Scheduler"
id: "job-scheduler"
sidebar_label: "Job scheduler"
description: "The dbt Cloud Scheduler queues scheduled or API-triggered runs, before preparing the job to enter cloud data platform. Build observability into transformation workflows with the in-app scheduling, logging, and alerting." 
tags: [scheduler]
---

Use dbt Cloud's job scheduler to streamline your data transformation workflows, build observability, govern data, and empower data teams to run dbt in production with ease. Create custom schedules to run production jobs and decrease operating costs.

The dbt Cloud scheduler queues scheduled or API-triggered runs, before preparing the job to enter the cloud data platform. 

## Scheduler terms

Familiarize yourself with these useful terms to help you understand how the dbt Cloud scheduler works or:

- **Job** &mdash; A standard dbt Cloud job, which automatically executes dbt commands, tests, creates tables and views to your data platform.
- **Run** &mdash; A single unique attempt to run a job.
- **Run slot** &mdash; Run slots control the number of jobs that can run concurrently: one run slot allows for a single job at a time. Adding more run slots enables multiple jobs to run at the same time.
- **Threads** &mdash; When you run dbt, it creates a graph of links between models. The number of [threads](/docs/core/connection-profiles#understanding-threads) is the maximum number of paths that dbt can work on at once. The default value is 4 threads.
- **Scheduler** &mdash; The dbt Cloud application that controls job execution.
- **Job queue** &mdash; This is the place where jobs are held, waiting to be launched by the scheduler. They haven't started running yet, but they are ready to go. It's like a waiting area for jobs.
- **Wait time** &mdash; Amount of time that dbt Cloud waits before running your job, either because there are no available slots for running jobs or because a previous run of the same job is still in progress.
- **Prep time** &mdash;  Amount of time it takes for dbt Cloud to get everything ready to run your project on your cloud data platform.
- **Over scheduling** &mdash; Situation when a job is currently running, but there are additional copies of the same job waiting in a queue to start as soon as the current job finishes.


## Scheduler queue

When a deployment job is triggered to run, either by schedule or by API, the dbt Cloud Scheduler queues the run to be processed. The Scheduler then checks a couple conditions to see if the run should start executing:

1. The account must have an available run slot. 

If all run slots are occupied, the queued run will wait. The time in the queue is displayed as wait time in dbt Cloud. If you notice long waiting times, consider upgrading to enterprise to purchase more run slots, which will allow for higher job concurrency.

2. There must not be a run of the same job already in-flight. 
    
The dbt Cloud Scheduler executes distinct runs of the same dbt Cloud job serially, in order to reduce the risk of model build collisions. If there is a run of the same job already running, the queued run will wait. This time in the queue is displayed as waiting time in dbt Cloud.
    

If those two conditions are met, the dbt Cloud Scheduler will prepare the job to run in the customer’s cloud data warehouse. This time in the queue is displayed as **prep time**. 

<Lightbox src="/img/docs/dbt-cloud/deployment/deploy-scheduler.jpg" width="85%" title="An overview of a dbt Cloud job run"/>

<!-- leaving space for CI job treatment, runtime, warm up pods updates

-->

### Pod Memory Section

## Sophisticated Run Cancelation

### Over Scheduled Jobs

The dbt Cloud scheduler prevents queue clog by canceling unnecessary runs of over-scheduled jobs.

The duration of a job run tends to grow over time, usually caused by growing amounts of data in the warehouse. If the run duration becomes longer than the frequency of the job’s schedule, the queue will grow faster than the scheduler can process the job’s runs, leading to a runaway queue with runs that don’t need to be processed.

The dbt Cloud scheduler detects when a scheduled job is set to run too frequently and appropriately cancels runs that don’t need to be processed. Specifically, scheduled jobs can only ever have one run of the job in the queue, and if a more recent run gets queued, the early queued run will get canceled with a helpful error message. 


Users will still need to either refactor the job so it runs faster or change the job schedule to run less often if the job often gets into an over-scheduled state.

Note, the dbt Cloud Scheduler will not cancel over scheduled jobs triggered by API.

