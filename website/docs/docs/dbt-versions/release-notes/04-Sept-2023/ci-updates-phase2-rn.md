---
title: "Update: Improvements to dbt Cloud continuous integration"
description: "September 2023: dbt Cloud now has two types of jobs -- deploy jobs and CI jobs -- with streamlined setup and improved efficiency. "
sidebar_label: "Update: Improvements to dbt jobs"
tags: [Sept-2023, CI]
date: 2023-09-15
sidebar_position: 10
---

dbt Cloud now has two distinct job types: [deploy jobs](/docs/deploy/deploy-jobs) for building production data assets, and [CI jobs](/docs/deploy/ci-jobs) for checking code changes. These jobs perform fundamentally different tasks so dbt Labs improved the setup experience with better defaults for each. 

With two types of jobs, instead of one generic type, we can better guide you through the setup flow. Best practices are built into the default settings so you can go from curious to being set up in seconds.

<Lightbox src="/img/docs/release-notes/ci-job-setup.gif" title="Example of setting up a CI job"/>

And, we now have more efficient state comparisons on CI checks: never waste a build or test on code that hasn’t been changed. We now diff between the Git PR code and what’s running in production more efficiently with the introduction of deferral to an environment versus a job. To learn more, refer to [Continuous integration in dbt Cloud](/docs/deploy/continuous-integration). 

Below is a comparison table that describes how deploy jobs and CI jobs behave differently:

|  | Deploy Jobs | CI Jobs |
| --- | --- | --- |
| Purpose | Builds production data assets. | Builds and tests new code before merging changes into production. |
| Trigger types | Triggered by a schedule or by API. | Triggered by a commit to a PR or by API. |
| Destination | Builds into a production database and schema. | Builds into a staging database and ephemeral schema, lived for the lifetime of the PR. |
| Execution mode | Runs execute sequentially, so as to not have collisions on the underlying DAG. | Runs execute in parallel to promote team velocity. |
| Efficiency run savings | Detects over-scheduled jobs and cancels unnecessary runs to avoid queue clog. | Cancels existing runs when a newer commit is pushed to avoid redundant work. |
| State comparison | Only sometimes needs to detect state. | Almost always needs to compare state against the production environment to build on modified code and its dependents. |


## What you need to update

- If you want to set up a CI environment for your jobs, dbt Labs recommends that you create your CI job in a dedicated [deployment environment](/docs/deploy/deploy-environments#create-a-deployment-environment) that's connected to a staging database. To learn more about these environment best practices, refer to the guide [Get started with continuous integration tests](/guides/orchestration/set-up-ci/overview).

- If you previously set up a job using the [Create Job](/dbt-cloud/api-v2#/operations/Create%20Job) API endpoint before September 11, 2023, you must re-create the job as described in [Trigger a CI job with the API](/docs/deploy/ci-jobs#trigger-a-ci-job-with-the-api). This is because you must set the `job_type` to be `ci`. 

- If you previously set up a job using dbt Cloud before September 11, 2023, you must re-create the job as described in [Set up CI jobs](/docs/deploy/ci-jobs#set-up-ci-jobs) and make sure to enable the option **Triggered by pull requests**.  