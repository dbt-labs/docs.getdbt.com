---
title: "Run visibility"
description: "Monitor your jobs to make performance improvements."
tags: ["scheduler"]
---

You can view the history of your runs and the model timing dashboard to help identify where improvements can be made to jobs.


## Run history

The **Run History** dashboard in dbt Cloud helps you monitor the health of your dbt project. It provides a detailed overview of all of your project's job runs and empowers you with a variety of filters to help you focus on specific aspects. You can also use it to review recent runs, find errored runs, and track the progress of runs in progress. You can access it on the top navigation menu by clicking **Deploy** and then **Run History**. 

The dashboard displays your full run history, including job name, status, associated environment, job trigger, commit SHA, schema, and timing info. 

dbt Cloud developers can access their run history for the last 365 days through the dbt Cloud user interface (UI) and API.

We limit self-service retrieval of run history metadata to 365 days to improve dbt Cloud's performance. For more info on the run history retrieval change, refer to [Older run history retrieval change](/docs/dbt-versions/release-notes/May-2023/run-history-endpoint).

<Lightbox src="/img/docs/dbt-cloud/deployment/run-history.jpg" width="85%" title="Run History dashboard allows you to monitor the health of your dbt project and displays jobs, job status, environment, timing, and more."/>

## Access logs

You can view or download in-progress and historical logs for your dbt runs. This makes it easier for the team to debug errors more efficiently.

<Lightbox src="/img/docs/dbt-cloud/deployment/access-logs.gif" width="85%" title="Access logs for run steps" />

## Model timing 
> Available on [multi-tenant](/docs/cloud/about-cloud/access-regions-ip-addresses) dbt Cloud accounts on the [Team or Enterprise plans](https://www.getdbt.com/pricing/).

The model timing dashboard on dbt Cloud displays the composition, order, and time taken by each model in a job run. The visualization appears for successful jobs and highlights the top 1% of model durations. This helps you identify bottlenecks in your runs, so you can investigate them and potentially make changes to improve their performance. 

You can find the dashboard on the **Run Overview** page. 

<Lightbox src="/img/docs/dbt-cloud/model-timing.jpg" width="85%" title="The model timing tab displays the top 1% of model durations and visualizes model bottlenecks" />
