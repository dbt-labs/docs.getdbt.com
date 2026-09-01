---
title: "Run visibility"
description: "Monitor your jobs to make performance improvements."
tags: ["scheduler"]
availability: platform_login
---

You can view the history of your runs and the model timing dashboard to help identify where improvements can be made to jobs.


## Run history

The **Run history** dashboard in <Constant name="dbt" /> helps you monitor the health of your dbt project. It provides a detailed overview of all your project's job runs and empowers you with a variety of filters that enable you to focus on specific aspects. You can also use it to review recent runs, find errored runs, and track the progress of runs in progress. You can access it from the top navigation menu by clicking **Deploy** and then **Run history**. 

The dashboard displays your full run history, including job name, status, associated environment, job trigger, commit SHA, schema, and timing info. 

<Constant name="dbt" /> developers can access their run history for the last 365 days through the <Constant name="dbt" /> user interface (UI) and API.

dbt Labs limits self-service retrieval of run history metadata to 365 days to improve <Constant name="dbt" />'s performance.

<Lightbox src="/img/docs/dbt-platform/deployment/run-history.png" width="85%" title="Run history dashboard allows you to monitor the health of your dbt project and displays jobs, job status, environment, timing, and more."/>

## Job run details

From the **Run history** dashboard, select a run to view complete details about it. The job run details page displays job trigger, commit SHA, time spent in the scheduler queue, all the run steps and their [logs](#access-logs), [model timing](#model-timing), and more. 

Click **Rerun now** to rerun the job immediately. 

An example of a completed run with a configuration for a [job completion trigger](/docs/deploy/deploy-jobs#trigger-on-job-completion):

<Lightbox src="/img/docs/dbt-platform/deployment/example-job-details.png" width="65%" title="Example of run details" />

### Run summary tab

You can view and download in-progress and historical logs for your dbt runs. This makes it easier for you to debug errors more efficiently.

For in-progress steps, <Constant name="dbt_platform" /> only displays the tail of the log output &mdash; up to the last 1,000 lines or 0.5 MB, whichever comes first. This applies to both console and debug logs.
- When logs are truncated, a notice appears at the top of the log. Because only the tail is displayed, a resource that is still running may not appear in the logs until it completes and its output reaches the tail.
- When a step is complete, the full log is available. 

<VersionBlock lastVersion="1.99">

When a job on the <Constant name="core" /> engine finishes, selecting a step opens the **System logs**. At the top, a summary shows how many errors, warnings, deprecations, skips, and successes appear in that step’s output.

<Lightbox src="/img/docs/dbt-platform/deployment/system-logs.png" width="80%" title="System logs summary" />

:::note
Counts displayed in the system logs are produced with regular expression matching on the log text. This means you may see more errors or warnings than there are nodes with failures or warnings.

To verify the actual count, use the up and down buttons on each status to navigate to each matching line.
:::

</VersionBlock>

<VersionBlock firstVersion="2.0">

When a job on the <Constant name="fusion_engine" /> finishes, selecting a step displays a structured logs view showing the status of each resource. Nodes are classified into the following categories, and you can expand each node to view its log details:
- **Success**
- **Reused**
- **Failed**
- **Warning**
- **Running**
- **Skipped**
- **No-op**

For more information about each status, refer to [Fusion telemetry and observability](/reference/telemetry-observability#node-outcome).

<Lightbox src="/img/docs/dbt-platform/deployment/fusion-logs.png" width="80%" title="Structured logs in Fusion" />

</VersionBlock>

#### Downloading logs {#access-logs}

- To download logs for an individual step, select the step in the **Run summary** tab and click **Download** > **Download logs**. 
- Note that when viewing debug logs, the log output is truncated. To view and export all debug logs for an individual step, click **Download** > **Download all debug logs**.


- You can download OpenTelemetry (OTel) logs for <Constant name="fusion" /> job command steps as a Parquet file. The file contains structured step-level log data that you can query or inspect outside dbt.

To download it, go to the **Run summary** tab in the job, select a step and click **Download** > **Download OTel log** to export a Parquet file

This option only appears when the step emitted an OTel log artifact. Some steps, such as `dbt deps`, don't produce one. For analysis examples, refer to [Querying telemetry data](/reference/telemetry-observability#querying-telemetry-data).


<Lightbox src="/img/docs/dbt-platform/deployment/download-logs.png" width="85%" title="Download logs" />

#### Log size limits

dbt enforces cumulative log size limits on run endpoints. If a single step's logs or the total run logs exceed this limit, dbt omits the logs.

When dbt omits logs due to size, it displays a **Run logs are too large** banner and shows a message where the logs would usually appear. The run step also displays an **Unknown**  status.

You can still download omitted logs. If the log file is too large, the download may fail. If that happens, you can [reach out to support](mailto:support@getdbt.com).

### Lineage tab

View the lineage graph associated with the job run so you can better understand the dependencies and relationships of the resources in your project. To view a node's metadata directly in [<Constant name="catalog" />](/docs/explore/explore-projects), select it (double-click) from the graph. 

<Lightbox src="/img/docs/collaborate/dbt-explorer/explorer-from-lineage.gif" width="85%" title="Example of accessing dbt Catalog from the Lineage tab" />

### Model timing tab <Lifecycle status="self_service,managed,managed_plus" />

The **Model timing** tab displays the composition, order, and time each model takes in a job run. This helps you identify bottlenecks in your runs so you can investigate them and potentially make changes to improve performance. You can find it on the [job's run details](#job-run-details).

The tab includes the following sections:

- [Metric tiles](#metric-tiles)
- [Execution timeline](#execution-timeline)
- [Concurrency over time](#concurrency-over-time)
- [Resource details](#resource-details)

#### Metric tiles

Six metric tiles appear at the top of the tab:

- **Est. critical path**: The estimated duration of the longest chain of dependent models, and what percentage of total run time it represents.
- **Peak concurrency**: The maximum number of models running simultaneously, and at what point in the run it occurred.
- **Avg active models**: The average number of models active at any point over the run duration.
- **Longest model**: The duration and name of the slowest model in the run.
- **Wall clock**: The total elapsed time of the run.
- **Latest start**: The name and start time of the last model to start in the run.

<Lightbox src="/img/docs/dbt-platform/deployment/model-timing-metric-tiles.png" width="100%" title="Metric tiles showing key run statistics like estimated critical path, peak concurrency, longest model, and more." />

#### Execution timeline

A Gantt-style timeline of all resources in the run. Hover over bars to see details. You can customize the view using:

- **Group by**: Controls how resources are grouped in the timeline:
  - **Resource type**: Groups by node type: Model, Test, Snapshot, or Exposure.
  - **Folder**: Groups by the folder path of the resource in your project.
  - **Execution phase**: Groups resources into phases 0 through 4 based on execution start time &mdash; Phase 0 started earliest, while Phase 4 started latest.
  - **Thread**: Groups by the dbt execution thread that ran each resource. dbt uses multiple threads to run models in parallel; this view shows which thread handled which resources.
  - **No grouping**: Lists all resources without any grouping.
- **Highlight**: Changes how bars are colored to help you focus on what matters:
  - **Est. critical path**: Highlights resources on the estimated critical path by graying out all others.
  - **All equal**: Shows all bars in their resource type color with no additional emphasis. The legend shows the color for each type: Model, Test, Snapshot, and Exposure.
  - **By duration**: Grays out shorter-running resources and shows longer-running ones in color.
- **Search resources**: Filters the timeline to resources matching your search term.

<Lightbox src="/img/docs/dbt-platform/deployment/model-timing-timeline.png" width="100%" title="Execution timeline showing a Gantt-style view of all resources in the run" />

#### Concurrency over time

A stacked bar chart showing model activity over the run duration. Each bar is split into **Active models** and **Queued / ready**, so you can see how many models were running versus waiting at any point in time. It also displays the peak concurrency reached during the run.

<Lightbox src="/img/docs/dbt-platform/deployment/model-timing-concurrency.png" width="100%" title="Concurrency over time chart showing active models and queued/ready models throughout the run" />

#### Resource details

A paginated, searchable table listing all resources in the run. It includes the following columns:

- **Model**: The resource name.
- **Start**: The time the resource started.
- **End**: The time the resource finished.
- **Duration**: How long the resource took to run.
- **Execution phase**: A number from 0 to 4 indicating when the resource started relative to others in the run &mdash; Phase 0 started earliest, while Phase 4 started latest.
- **Est. critical path**: Whether the resource is on the estimated critical path.
- **Type**: The resource type (Model, Test, Snapshot, or Exposure), displayed as a color-coded badge.
- **Folder**: The folder path of the resource.

<Lightbox src="/img/docs/dbt-platform/deployment/model-timing-resource-details.png" width="100%" title="Resource details table showing each model's start time, end time, duration, execution phase, critical path status, type, and folder" />

### Artifacts tab

This provides a list of the artifacts generated by the job run. The files are saved and available for download.

<Lightbox src="/img/docs/dbt-platform/example-artifacts-tab.png" width="85%" title="Example of the Artifacts tab" />

### Compare tab <Lifecycle status="managed,managed_plus" />

The **Compare** tab is shown for [CI job runs](/docs/deploy/ci-jobs) with the **Run compare changes** setting enabled. It displays details about [the changes from the comparison dbt performed](/docs/deploy/advanced-ci#compare-changes) between what's in your production environment and the pull request. To help you better visualize the differences, <Constant name="dbt" /> highlights changes to your models in red (deletions) and green (inserts).

From the **Modified** section, you can view the following:

- **Overview**: High-level summary about the changes to the models such as the number of primary keys that were added or removed.
- **Primary keys**: Details about the changes to the records.
- **Modified rows**: Details about the modified rows. Click **Show full preview** to display all columns.
- **Columns**: Details about the changes to the columns.

To view the dependencies and relationships of the resources in your project more closely, click **View in <Constant name="catalog" />** to launch [<Constant name="catalog" />](/docs/explore/explore-projects). 


<DocCarousel slidesPerView={1}>

<Lightbox src="/img/docs/dbt-platform/example-ci-compare-changes-tab.png" width="55%" title="Example of the Compare tab" />

<Lightbox src="/img/docs/dbt-platform/advanced-ci-modified-rows.png" width="80%" title="Example of Modified rows tab which shows you details of the modified rows." />

</DocCarousel>
