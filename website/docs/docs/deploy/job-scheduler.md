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
- Event-driven execution of dbt Cloud jobs that run based on the completion of another job ([trigger on job completion](/docs/deploy/deploy-jobs#trigger-on-job-completion))
- Event-driven execution of dbt Cloud CI jobs triggered when a pull request is merged to the branch ([merge jobs](/docs/deploy/merge-jobs))
- Event-driven execution of dbt Cloud jobs triggered by API
- Event-driven execution of dbt Cloud jobs manually triggered by a user to **Run now**

The scheduler handles various tasks including queuing jobs, creating temporary environments to run the dbt commands required for those jobs, providing logs for debugging and remediation, and storing dbt artifacts for direct consumption/ingestion by the Discovery API. 

The scheduler powers running dbt in staging and production environments, bringing ease and confidence to CI/CD workflows and enabling observability and governance in deploying dbt at scale. 

## Scheduler terms

Familiarize yourself with these useful terms to help you understand how the job scheduler works.

| Term | Definition |
| --- | --- |
| Scheduler | The dbt Cloud engine that powers job execution. The scheduler queues scheduled or API-triggered job runs, prepares an environment to execute job commands in your cloud data platform, and stores and serves logs and artifacts that are byproducts of run execution. |
| Job | A collection of run steps, settings, and a trigger to invoke dbt commands against a project in the user's cloud data platform. |
| Job queue | The job queue acts as a waiting area for job runs when they are scheduled or triggered to run; runs remain in queue until execution begins. More specifically, the Scheduler checks the queue for runs that are due to execute, ensures the run is eligible to start, and then prepares an environment with appropriate settings, credentials, and commands to begin execution. Once execution begins, the run leaves the queue. |
| Over-scheduled job | A situation when a cron-scheduled job's run duration becomes longer than the frequency of the job’s schedule, resulting in a job queue that will grow faster than the scheduler can process the job’s runs. |
| Deactivated job | A situation where a job has reached 100 consecutive failing runs. |
| Prep time | The time dbt Cloud takes to create a short-lived environment to execute the job commands in the user's cloud data platform. Prep time varies most significantly at the top of the hour when the dbt Cloud Scheduler experiences a lot of run traffic. |
| Run | A single, unique execution of a dbt job. |
| Run slot | Run slots control the number of jobs that can run concurrently. Developer plans have a fixed number of run slots, while Enterprise and Team plans have unlimited run slots. Each running job occupies a run slot for the duration of the run. <br /><br />Team and Developer plans are limited to one project each. For additional projects, consider upgrading to the [Enterprise plan](https://www.getdbt.com/pricing/).| 
| Threads | When dbt builds a project's DAG, it tries to parallelize the execution by using threads. The [thread](/docs/running-a-dbt-project/using-threads) count is the maximum number of paths through the DAG that dbt can work on simultaneously. The default thread count in a job is 4. |
| Wait time | Amount of time that dbt Cloud waits before running a job, either because there are no available slots or because a previous run of the same job is still in progress. |


## Scheduler queue

The scheduler queues a deployment job to be processed when it's triggered to run by a [set schedule](/docs/deploy/deploy-jobs#schedule-days), [a job completed](/docs/deploy/deploy-jobs#trigger-on-job-completion), an API call, or manual action. 

Before the job starts executing, the scheduler checks these conditions to determine if the run can start executing:

- **Is there a run slot that's available on the account for use?** &mdash; If all run slots are occupied, the queued run will wait. The wait time is displayed in dbt Cloud. If there are long wait times, [upgrading to Enterprise](https://www.getdbt.com/contact/) can provide more run slots and allow for higher job concurrency.

- **Does this same job have a run already in progress?** &mdash; The scheduler executes distinct runs of the same dbt Cloud job serially to avoid model build collisions. If there's a job already running, the queued job will wait, and the wait time will be displayed in dbt Cloud.

If there is an available run slot and there isn't an actively running instance of the job, the scheduler will prepare the job to run in your cloud data platform. This prep involves readying a Kubernetes pod with the right version of dbt installed, setting environment variables, loading data platform credentials, and Git provider authorization, amongst other environment-setting tasks. The time it takes to prepare the job is displayed as **Prep time** in the UI.

<Lightbox src="/img/docs/dbt-cloud/deployment/deploy-scheduler.jpg" width="85%" title="An overview of a dbt Cloud job run"/>

### Treatment of CI jobs
When compared to deployment jobs, the scheduler behaves differently when handling [continuous integration (CI) jobs](/docs/deploy/continuous-integration). It queues a CI job to be processed when it's triggered to run by a Git pull request, and the conditions the scheduler checks to determine if the run can start executing are also different: 

- **Will the CI run consume a run slot?** &mdash; CI runs don't consume run slots and will never block production runs.
- **Does this same job have a run already in progress?** &mdash; CI runs can execute concurrently (in parallel). CI runs build into unique temporary schemas, and CI checks execute in parallel to help increase team productivity. Teammates never have to wait to get a CI check review.

### Treatment of merge jobs
When triggered by a _merged_ Git pull request, the scheduler queues a [merge job](/docs/deploy/merge-jobs) to be processed.

- **Will the merge job run consume a run slot?** &mdash; Yes, merge jobs do consume run slots.
- **Does this same job have a run already in progress?** &mdash; A merge job can only have one run in progress at a time. If there are multiple runs queued up, the scheduler will enqueue the most recent run and cancel all the other runs. If there is a run in progress, it will wait until the run completes before queuing the next run.

## Job memory

In dbt Cloud, the setting to provision memory available to a job is defined at the account-level and applies to each job running in the account; the memory limit cannot be customized per job. If a running job reaches its memory limit, the run is terminated with a "memory limit error" message.

Jobs consume a lot of memory in the following situations:
- A high thread count was specified
- Custom dbt macros attempt to load data into memory instead of pushing compute down to the cloud data platform
- Having a job that generates dbt project documentation for a large and complex dbt project. 
  * To prevent problems with the job running out of memory, we recommend generating documentation in a separate job that is set aside for that task and removing `dbt docs generate` from all other jobs. This is especially important for large and complex projects.

Refer to [dbt Cloud architecture](/docs/cloud/about-cloud/architecture) for an architecture diagram and to learn how the data flows.

## Run cancellation for over-scheduled jobs

:::info Scheduler won't cancel API-triggered jobs 
The scheduler will not cancel over-scheduled jobs triggered by the [API](/docs/dbt-cloud-apis/overview).
:::

The dbt Cloud scheduler prevents too many job runs from clogging the queue by canceling unnecessary ones. If a job takes longer to run than its scheduled frequency, the queue will grow faster than the scheduler can process the runs, leading to an ever-expanding queue with runs that don’t need to be processed (called _over-scheduled jobs_). 

The scheduler prevents queue clog by canceling runs that aren't needed, ensuring there is only one run of the job in the queue at any given time. If a newer run is queued, the scheduler cancels any previously queued run for that job and displays an error message.

<Lightbox src="/img/docs/dbt-cloud/deployment/run-error-message.jpg" width="85%" title="The cancelled runs display an error message explaining why the run was cancelled and recommendations"/>

To prevent over-scheduling, users will need to take action by either refactoring the job so it runs faster or modifying its [schedule](/docs/deploy/deploy-jobs#schedule-days).

## Deactivation of jobs <Lifecycle status='beta' />

To reduce unnecessary resource consumption and reduce contention for run slots in your account, dbt Cloud will deactivate a [deploy job](/docs/deploy/deploy-jobs) or a [CI job](/docs/deploy/ci-jobs) if it reaches 100 consecutive failing runs and indicate this through the use of banners. When this happens, scheduled and triggered-to-run jobs will no longer be enqueued. 

To reactivate a deactivated job, you can either:
- Update the job's settings to fix the issue and save the job (recommended)
- Perform a manual run by clicking **Run now** on the job's page


Example of deactivation banner on job's page: 

<Lightbox src="/img/docs/dbt-cloud/deployment/example-deactivated-deploy-job.png" title="Example of deactivation banner on job's page"/>

## FAQs

<FAQ path="Troubleshooting/job-memory-limits" />

## Related docs
- [dbt Cloud architecture](/docs/cloud/about-cloud/architecture#dbt-cloud-features-architecture)
- [Job commands](/docs/deploy/job-commands)
- [Job notifications](/docs/deploy/job-notifications)
- [Webhooks](/docs/deploy/webhooks)
- [dbt Cloud continuous integration](/docs/deploy/continuous-integration)
