---
title: "Source freshness"
id: "source-freshness"
description: "Validate that data freshness meets expectations and alert if stale."
---

## Data Source Freshness

dbt Cloud provides a helpful interface around dbt's [source data freshness](/docs/build/sources#snapshotting-source-data-freshness) calculations. When a dbt Cloud job is configured to snapshot source data freshness, dbt Cloud will render a user interface showing you the state of the most recent snapshot. This interface is intended to help you determine if your source data freshness is meeting the SLAs that you've defined for your organization.

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/data-sources-next.png" title="Data Sources in dbt Cloud"/>

### Enabling source freshness snapshots

First, make sure to configure your sources to [snapshot freshness information](/docs/build/sources#snapshotting-source-data-freshness).

<Changelog>

  - **v0.21.0:** Renamed `dbt source snapshot-freshness` to `dbt source freshness`. If using an older version of dbt, the command is `snapshot-freshness`.  
  To have dbt Cloud display data source freshness as a rendered user interface, you will still need to use the pre-v0.21 syntax of `dbt source snapshot-freshness`.

</Changelog>

Then, to enable source freshness snapshots in dbt Cloud, add a `dbt source freshness` step to one of your jobs, or create a new job to snapshot source freshness. **Note:** If you're using an older version of dbt Core (before v0.21), you'll need to use the old name of this command instead: `dbt source snapshot-freshness`. See [`source` command docs](commands/source) for details.

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/job-step-source-freshness.png" title="Adding a step to snapshot source freshness"/>

You can add `dbt source freshness` anywhere in your list of run steps, but note that if your source data is out of date, this step will "fail', and subsequent steps will not run. dbt Cloud will trigger email notifications (if configured) based on the end state of this step.

If you *do not* want your models to run if your source data is out of date, then it could be a good idea to run `dbt source freshness` as the first step in your job. Otherwise, we recommend adding `dbt source freshness` as the last step in the job, or creating a separate job just for this task.

Another option is to select the source freshness checkbox in your execution settings when you configure a job on dbt cloud. Selecting this checkbox will run `dbt source freshness` as the first step in your job, but it will not break subsequent steps if it fails. If you wanted your job dedicated *exclusively* to running freshness checks, you still need to include at least one placeholder step, such as `dbt compile`.

Remember that `dbt build` does _not_ include source freshness checks when it builds and tests resources in your DAG. As such, here's a common pattern for defining jobs:
- `dbt build` as the run step
- check box for generating docs
- check box for source freshness

<Lightbox src="/img/docs/dbt-cloud/select-source-freshness.png" title="Selecting source freshness"/>

### Source freshness snapshot frequency
It's important that your freshness jobs run frequently enough to snapshot data latency in accordance with your SLAs. You can imagine that if you have a 1 hour SLA on a particular dataset, snapshotting the freshness of that <Term id="table" /> once daily would not be appropriate. As a good rule of thumb, you should run your source freshness jobs with at least double the frequency of your lowest SLA.  Here's an example table of some reasonable snapshot frequencies given typical SLAs:

| SLA | Snapshot Frequency |
| --- | ------------------ |
| 1 hour | 30 mins |
| 1 day | 12 hours |
| 1 week | About daily |

## Further reading

For more on exposing links to the latest documentation and sharing source freshness reports to your team, see [Building and configuring artifacts](artifacts).
