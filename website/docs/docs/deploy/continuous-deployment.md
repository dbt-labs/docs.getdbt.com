---
title: "Continuous deployment in dbt"
sidebar_label: "Continuous deployment"
description: "Learn about continuous deployment (CD) workflows"
---

To help you improve data transformations and ship data products faster, you can run [merge jobs](/docs/deploy/merge-jobs) to implement a continuous deployment (CD) workflow in <Constant name="dbt" />. Merge jobs can automatically build modified models whenever a pull request (PR) merges, making sure the latest code changes are in production. You don't have to wait for the next scheduled job to run to get the latest updates.

<Lightbox src="/img/docs/dbt-platform/using-dbt-platform/cd-workflow.png" width="90%" title="Workflow of continuous deployment in dbt"/>

You can also implement continuous integration (CI) in <Constant name="dbt" />, which can further reduce the time it takes to push changes to production and improve code quality. To learn more, refer to [Continuous integration in <Constant name="dbt" />](/docs/deploy/continuous-integration).

## Trigger jobs with automation or APIs

[Merge jobs](/docs/deploy/merge-jobs) and [deploy jobs](/docs/deploy/deploy-jobs) start from your [<Constant name="git" /> provider](/docs/platform/git/configure-git) or from other triggers you configure inside <Constant name="dbt" />. Merge jobs that react to merges use the webhook flow summarized in [How merge jobs work](#how-merge-jobs-work) below and detailed under [Set up job trigger on Git merge](/docs/deploy/merge-jobs#set-up-merge-jobs).

To start the same merge or deployment job from your own tooling, use the [Administrative API](/docs/dbt-apis/admin-api) and [Trigger Job Run](/dbt-cloud/api-v2#/operations/Trigger%20Job%20Run). Configure and validate the job in <Constant name="dbt" /> first, note the account and job identifiers from the deployment URL or job settings, authenticate with [service tokens](/docs/dbt-apis/service-tokens) or [personal access tokens](/docs/dbt-apis/user-tokens), assemble the HTTPS request headers and JSON body from [Trigger Job Run](/dbt-cloud/api-v2#/operations/Trigger%20Job%20Run), then monitor the resulting run alongside any webhook-triggered executions in job history.

- **CI triggered through Administrative API payloads** behaves differently than rerunning deployment or merge jobs. Follow [Trigger a CI job with the API](/docs/deploy/ci-jobs#trigger-a-ci-job-with-the-api) on the [CI jobs](/docs/deploy/ci-jobs) page.
- **Integrations** with schedulers and platforms (for example [Airflow and <Constant name="dbt" />](/guides/airflow-and-dbt-cloud), Prefect, Databricks) are collected on [Deployment tools](/docs/deploy/deployment-tools).

## How merge jobs work

When you set up merge jobs, <Constant name="dbt" /> listens for notifications from your [<Constant name="git" /> provider](/docs/platform/git/configure-git) indicating that a PR has been merged. When <Constant name="dbt" /> receives one of these notifications, it enqueues a new run of the merge job.

You can set up merge jobs to perform one of the following when a PR merges:

| <div style={{width:'350px'}}>Command to run</div> | Usage description |
| -------- | ----------------- |
| `dbt build --select state:modified+` | (Default) Build the modified data with every merge. <br /><br /><Constant name="dbt" /> builds only the changed data models and anything downstream of it, similar to CI jobs. This helps reduce computing costs and ensures that the latest code changes are always pushed to production. |
| `dbt compile` | Refresh the applied state for performant (the slimmest) CI job runs. <br /><br /><Constant name="dbt" /> generates the executable SQL (from the source model, test, and analysis files) but does not run it. This ensures the changes are reflected in the manifest for the next time a CI job is run and keeps track of only the relevant changes. |
