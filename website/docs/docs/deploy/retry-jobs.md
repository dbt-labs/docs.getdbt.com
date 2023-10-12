---
title: "Retry your dbt jobs" 
sidebar_label: "Retry jobs"
description: "Rerun your errored jobs from start or the failure point."
---

If your dbt job run completed with a status of **Error**, you can rerun it from start or from the point of failure in dbt Cloud.

## Prerequisites

- You have a [dbt Cloud account](https://www.getdbt.com/signup).
- You must be using [dbt version](/docs/dbt-versions/upgrade-core-in-cloud) 1.6 or newer.
- The most recent run of the job hasn't completed successfully. The latest status of the run is **Error**.
    - The job command that failed in the run must be one that supports the [retry command](/reference/commands/retry).

## Rerun an errored job

1. Select **Deploy** from the top navigation bar and choose **Run History.** 
2. Choose the job run that has errored. 
3. In the **Run Summary** tab on the job’s **Run** page, expand the run step that failed. An :x: denotes the failed step. 
4. Examine the error message and determine how to fix it. After you have made your changes, save and commit them to your [Git repo](/docs/collaborate/git-version-control).
5. Return to your job’s **Run** page. In the upper right corner, click **Rerun** and choose **Rerun from start** or **Rerun from failure**.
    
    If you chose to rerun from the failure point, a **Rerun failed steps** modal opens. The modal lists the run steps that will be invoked: the failed step and any skipped steps. To confirm these run steps, click **Rerun from failure**. The job reruns from the failed command in the previously failed run. A banner at the top of the **Run Summary** tab captures this with the message, "This run resumed execution from last failed step".

<Lightbox src="/img/docs/deploy/native-retry.gif" width="70%" title="Example of the Rerun options in dbt Cloud"/>

## Related content
- [Retry a failed run for a job](/dbt-cloud/api-v2#/operations/Retry%20a%20failed%20run%20for%20a%20job) API endpoint
- [Run visibility](/docs/deploy/run-visibility)
- [Jobs](/docs/deploy/jobs)
- [Job commands](/docs/deploy/job-commands)