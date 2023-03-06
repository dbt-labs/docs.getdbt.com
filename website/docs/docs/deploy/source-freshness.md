---
title: "Source freshness"
id: "source-freshness"
description: "Validate that data freshness meets expectations and alert if stale."
---

dbt Cloud provides a helpful interface around dbt's [source data freshness](/docs/build/sources#snapshotting-source-data-freshness) calculations. When a dbt Cloud job is configured to snapshot source data freshness, dbt Cloud will render a user interface showing you the state of the most recent snapshot. This interface is intended to help you determine if your source data freshness is meeting the service level agreement (SLA) that you've defined for your organization.

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/data-sources-next.png" title="Data Sources in dbt Cloud"/>

### Enabling source freshness snapshots

[`dbt build`](reference/commands/build) does _not_ include source freshness checks when building and testing resources in your DAG. Instead, you can use one of these common patterns for defining jobs:
- Add `dbt build` to the run step to run models, tests, and so on. 
- Select the **Generate docs on run** checkbox to automatically [generate project docs](/docs/collaborate/build-and-view-your-docs#set-up-a-documentation-job).
- Select the **Run on source freshness** checkbox to enable [source freshness](#checkbox) as the first to step of the job. 

<Lightbox src="/img/docs/dbt-cloud/select-source-freshness.png" title="Selecting source freshness"/>

To enable source freshness snapshots, firstly make sure to configure your sources to [snapshot freshness information](/docs/build/sources#snapshotting-source-data-freshness). You can add source freshness to the list of commands in the job run steps or enable the checkbox. However, you can expect different outcomes when you configure a job by selecting the **Run source freshness** checkbox compared to adding the command to the run steps.

Review the following options and outcomes:

| Options | Outcomes |
|--------| ------- |
|  **Select checkbox <a id="checkbox"></a>** | The **Run source freshness** checkbox in your **Execution Settings** will run `dbt source freshness` as the first step in your job and won't break subsequent steps if it fails. If you wanted your job dedicated *exclusively* to running freshness checks, you still need to include at least one placeholder step, such as `dbt compile`. |
| **Add as a run step** | Add the `dbt source freshness` command to a job anywhere in your list of run steps. However, if your source data is out of date &mdash; this step will "fail', and subsequent steps will not run. dbt Cloud will trigger email notifications (if configured) based on the end state of this step. <br /><br /> You can create a new job to snapshot source freshness. <br /><br /> If you *do not* want your models to run if your source data is out of date, then it could be a good idea to run `dbt source freshness` as the first step in your job. Otherwise, we recommend adding `dbt source freshness` as the last step in the job, or creating a separate job just for this task.  |


<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/job-step-source-freshness.png" title="Adding a step to snapshot source freshness"/>


### Source freshness snapshot frequency
It's important that your freshness jobs run frequently enough to snapshot data latency in accordance with your SLAs. You can imagine that if you have a 1 hour SLA on a particular dataset, snapshotting the freshness of that <Term id="table" /> once daily would not be appropriate. As a good rule of thumb, you should run your source freshness jobs with at least double the frequency of your lowest SLA.  Here's an example table of some reasonable snapshot frequencies given typical SLAs:

| SLA | Snapshot Frequency |
| --- | ------------------ |
| 1 hour | 30 mins |
| 1 day | 12 hours |
| 1 week | About daily |

## Further reading

For more on exposing links to the latest documentation and sharing source freshness reports to your team, see [Building and configuring artifacts](/docs/deploy/artifacts).
