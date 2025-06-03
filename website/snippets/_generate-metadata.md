## Generate metadata

<Constant name="explorer" /> uses the metadata provided by the [Discovery API](/docs/dbt-cloud-apis/discovery-api) to display the details about [the state of your dbt project](/docs/dbt-cloud-apis/project-state). The metadata that's available depends on the [deployment environment](/docs/deploy/deploy-environments) you've designated as _production_ or _staging_ in your <Constant name="cloud" /> project.

<Constant name="explorer" /> also allows you to ingest external metadata from Snowflake, giving you visibility into tables, views, and other resources that aren't defined in dbt with <Constant name="explorer" />.

## dbt metadata

If you're using a [hybrid project setup](/docs/deploy/hybrid-setup) and uploading artifacts from dbt Core, make sure to follow the [setup instructions](/docs/deploy/hybrid-setup#connect-project-in-dbt-cloud) to connect your project in <Constant name="cloud" />. This enables <Constant name="explorer" /> to access and display your metadata correctly.

- To ensure all metadata is available in <Constant name="explorer" />, run `dbt build` and `dbt docs generate` as part of your job in your production or staging environment. Running those two commands ensure all relevant metadata (like lineage, test results, documentation, and more) is available in dbt Explorer.
- <Constant name="explorer" /> automatically retrieves the metadata updates after each job run in the production or staging deployment environment so it always has the latest results for your project. This includes deploy and merge jobs.
    - Note that CI jobs don't update <Constant name="explorer" />. This is because they don't reflect the production state and don't provide the necessary metadata updates.
- To view a resource and its metadata, you must define the resource in your project and run a job in the production or staging environment.
- The resulting metadata depends on the [commands](/docs/deploy/job-commands) executed by the jobs.

Note that <Constant name="explorer" /> automatically deletes stale metadata after 3 months if no jobs were run to refresh it. To avoid this, make sure you schedule jobs to run more frequently than 3 months with the necessary commands.

| To view in <Constant name="explorer" /> | You must successfully run |
|---------------------|---------------------------|
| All metadata        |  [dbt build](/reference/commands/build), [dbt docs generate](/reference/commands/cmd-docs), and [dbt source freshness](/reference/commands/source#dbt-source-freshness) together as part of the same job in the environment
| Model lineage, details, or results | [dbt run](/reference/commands/run) or [dbt build](/reference/commands/build) on a given model within a job in the environment |
| Columns and statistics for models, sources, and snapshots| [dbt docs generate](/reference/commands/cmd-docs) within [a job](/docs/explore/build-and-view-your-docs) in the environment |
| Test results | [dbt test](/reference/commands/test) or [dbt build](/reference/commands/build) within a job in the environment |
| Source freshness results | [dbt source freshness](/reference/commands/source#dbt-source-freshness) within a job in the environment |
| Snapshot details | [dbt snapshot](/reference/commands/snapshot) or [dbt build](/reference/commands/build) within a job in the environment |
| Seed details | [dbt seed](/reference/commands/seed) or [dbt build](/reference/commands/build) within a job in the environment |

Richer and more timely metadata will become available as <Constant name="cloud" /> evolves.

