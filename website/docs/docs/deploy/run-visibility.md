---
title: "Run visibility"
description: "Monitor your jobs to make performance improvements."
tags: ["scheduler"]
---

You can view the history of your runs and the model timing dashboard to help identify where improvements can be made to jobs.


## Run history

The **Run history** dashboard in dbt Cloud helps you monitor the health of your dbt project. It provides a detailed overview of all of your project's job runs and empowers you with a variety of filters to help you focus on specific aspects. You can also use it to review recent runs, find errored runs, and track the progress of runs in progress. You can access it from the top navigation menu by clicking **Deploy** and then **Run history**. 

The dashboard displays your full run history, including job name, status, associated environment, job trigger, commit SHA, schema, and timing info. 

dbt Cloud developers can access their run history for the last 365 days through the dbt Cloud user interface (UI) and API.

dbt Labs limits self-service retrieval of run history metadata to 365 days to improve dbt Cloud's performance.

<Lightbox src="/img/docs/dbt-cloud/deployment/run-history.png" width="85%" title="Run history dashboard allows you to monitor the health of your dbt project and displays jobs, job status, environment, timing, and more."/>

## Job run details

From the **Run history** dashboard, select a run to view complete details about it. The job run details page displays job trigger, commit SHA, time spent in the scheduler queue, all the run steps and their [logs](#access-logs), [model timing](#model-timing), and more. 

Click **Rerun now** to rerun the job immediately. 

An example of a completed run with a configuration for a [job completion trigger](/docs/deploy/deploy-jobs#trigger-on-job-completion):

<Lightbox src="/img/docs/dbt-cloud/deployment/example-job-details.png" width="65%" title="Example of run details" />

### Run summary tab

You can view or download in-progress and historical access logs for your dbt runs. This makes it easier for the team to debug errors more efficiently.

<Lightbox src="/img/docs/dbt-cloud/deployment/access-logs.gif" width="85%" title="Access logs for run steps" />

### Lineage tab

[PLACEHOLDER STUB for content]

### Model timing tab <Lifecycle status="team,enterprise" /> 

The **Model timing** tab displays the composition, order, and time taken by each model in a job run. The visualization appears for successful jobs and highlights the top 1% of model durations. This helps you identify bottlenecks in your runs, so you can investigate them and potentially make changes to improve their performance. 

You can find the dashboard on the [job's run details](#job-run-details). 

<Lightbox src="/img/docs/dbt-cloud/model-timing.png" width="85%" title="The Model timing tab displays the top 1% of model durations and visualizes model bottlenecks" />

### Artifacts tab

[PLACEHOLDER STUB for content]

### Compare tab

[PLACEHOLDER STUB for content]

LOREM IPSOM add content about the different tabs, tables, Explorer link, etc