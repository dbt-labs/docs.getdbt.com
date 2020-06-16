---
title: "Source freshness"
id: "cloud-snapshotting-source-freshness"
---


:::info dbt Cloud

The functionality documented here is available in dbt Cloud. Don't have an account? You can get started for free [here](https://cloud.getdbt.com/signup).

:::

## Data Source Freshness

dbt Cloud provides a helpful interface around dbt's [source data freshness](using-sources#snapshotting-source-data-freshness) calculations. When a dbt Cloud job is configured to snapshot source data freshness, dbt Cloud will render a user interface showing you the state of the most recent snapshot. This interface is intended to help you determine if your source data freshness is meeting the SLAs that you've defined for your organization.

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/3c3c1ca-Screen_Shot_2019-03-21_at_11.05.28_AM.png" title="Data Sources in dbt Cloud"/>

### Enabling source freshness snapshots

To enable source freshness snapshots in dbt Cloud, add a `dbt source snapshot-freshness` step to one of your jobs, or create a new job to snapshot source freshness.

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/49a03cc-Screen_Shot_2019-03-06_at_10.24.15_AM.png" title="Adding a step to snapshot source freshness"/>

You can add `dbt source snapshot-freshness` anywhere in your list of run steps, but note that if your source data is out of date, this step will "fail', and subsequent steps will not run. dbt Cloud will trigger email notifications (if configured) based on the end state of this step.

If you *do not* want your models to run if your source data is out of date, then it could be a good idea to run `dbt source snapshot-freshness` as the first step in your job. Otherwise, we recommend adding `dbt source snapshot-freshness` as the last step in the job, or creating a separate job just for this task.

### Source freshness snapshot frequency
It's important that your freshness jobs run frequently enough to snapshot data latency in accordance with your SLAs. You can imagine that if you have a 1 hour SLA on a particular dataset, snapshotting the freshness of that table once daily would not be appropriate. As a good rule of thumb, you should run your source freshness jobs with at least double the frequency of your lowest SLA.  Here's an example table of some reasonable snapshot frequencies given typical SLAs:

| SLA | Snapshot Frequency |
| --- | ------------------ |
| 1 hour | 30 mins |
| 1 day | 12 hours |
| 1 week | About daily |
