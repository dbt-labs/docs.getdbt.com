---
title: "Retry your dbt jobs" 
sidebar_label: "Retry jobs"
description: "Rerun your errored jobs from start or the failure point."
---

If your dbt job run completed with a status of `result:error` , you can rerun it from start or from the point of failure in dbt Cloud.

## Prerequisites

- You have a [dbt Cloud account](https://www.getdbt.com/signup).
- You must be using [dbt version](/docs/dbt-versions/upgrade-core-in-cloud) 1.6 or newer.
- There does not exist a more recent run of the job that completed successfully. The latest status of the run is `error`.
    - The job command that failed in the run must be one that supports the [retry command](/reference/commands/retry).

## Rerun an errored job

1. Select **Deploy** from the top navigation bar and choose **Run History.** 
2. Choose the job run that has errored. 
3. In the **Run Summary** tab on the job’s **Run** page, expand the run step that failed. It’s denoted by an :x:. 
4. Examine the error message and determine how to fix it. After you have made your changes, save and commit them to your [Git repo](/docs/collaborate/git-version-control).
5. Go back to your job’s **Run** page. In the upper right corner, click **Rerun** and choose **Rerun from start** or **Rerun from failure**.
    
    If you choose to rerun from the failure point, a **Rerun failed steps** modal will appear. It lists the run steps it will invoke which will include the failed step and the steps it previously wasn’t able to invoke (skipped steps). To confirm, click **Rerun from failure**. The job reruns from the failed command in the previously failed run. This is denoted at the top of the **Run Summary** tab by a message "This run resumed execution from last failed step".

<Lightbox src="/img/docs/deploy/native-retry.gif" width="70%" title="Example of the Rerun options in the dbt Cloud"/>

## Related content

- [Run visibility](/docs/deploy/run-visibility)
- [Jobs](/docs/deploy/jobs)
- [Job commands](/docs/deploy/job-commands)