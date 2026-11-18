## Generate metadata

<Constant name="catalog" /> uses the metadata provided by the [Discovery API](/docs/dbt-apis/discovery-api) to display the details about [the state of your dbt project](/docs/dbt-apis/project-state). The metadata that's available depends on the [deployment environment](/docs/deploy/deploy-environments) you've designated as _production_ or _staging_ in your <Constant name="dbt" /> project.

## dbt metadata

If you're using a [hybrid project setup](/docs/deploy/hybrid-setup) and uploading artifacts from dbt v1, make sure to follow the [setup instructions](/docs/deploy/hybrid-setup#connect-project-in-dbt-cloud) to connect your project in <Constant name="dbt" />. This enables <Constant name="catalog" /> to access and display your metadata correctly.

- <VersionBlock lastVersion="1.99">To ensure all metadata is available in <Constant name="catalog" />, run `dbt build` and `dbt docs generate` as part of a deploy or merge job in your production or staging environment. Running these two commands ensures all relevant metadata (like lineage, test results, documentation, and more) is available in <Constant name="catalog" />.</VersionBlock><VersionBlock firstVersion="2.0">To ensure all metadata is available in <Constant name="catalog" />, run `dbt build` as part of a deploy or merge job in your production or staging environment. Deploy and merge jobs running v2 refresh catalog metadata automatically, so you don't need a `dbt docs generate` step.</VersionBlock>
- <Constant name="catalog" /> shows the [applied state](/docs/dbt-apis/project-state) from the [Discovery API](/docs/dbt-apis/discovery-api). [Deploy jobs](/docs/deploy/deploy-jobs) and [merge jobs](/docs/deploy/merge-jobs) update that state, so <Constant name="catalog" /> shows their latest run. A deploy job can run on a schedule or when you start it.
- A [CI job](/docs/deploy/ci-jobs) can succeed without updating the applied state, so <Constant name="catalog" /> does not show that run. A successful CI run is not the latest state in <Constant name="catalog" />.
- To view a resource and its metadata, you must define the resource in your project and run a job in the production or staging environment.
- The resulting metadata depends on the [commands](/docs/deploy/job-commands) executed by the jobs.

### When dbt creates model metadata

dbt populates a model's metadata in <Constant name="catalog" /> when both of the following conditions are met:
- The model is defined in your dbt project (it exists in the manifest).
- The model appears in the `run_results` of a [`dbt build`](/reference/commands/build), [`dbt run`](/reference/commands/run), or [`dbt clone`](/reference/commands/clone) command, regardless of the run's success or failure status.<VersionBlock lastVersion="1.99"> Note that `dbt docs generate` alone does not create model entries in <Constant name="catalog" />. It provides supplementary metadata like column details and descriptions for models that already exist.</VersionBlock>

### When dbt removes model metadata

dbt removes a model's metadata from <Constant name="catalog" /> in these two cases:

- **Model removed from project**: If a model is deleted from your dbt project (and therefore no longer exists in the manifest), its metadata is removed after a subsequent job run in which the model is no longer included.
- **Environment inactivity**: If an environment has had no job runs in the past 3 months, all metadata for that environment is purged. To prevent this, schedule jobs to run at least once every 3 months.

<VersionBlock lastVersion="1.99">

| To view in <Constant name="catalog" /> | You must successfully run |
|---------------------|---------------------------|
| All metadata        | [dbt build](/reference/commands/build), [dbt docs generate](/reference/commands/cmd-docs), and [dbt source freshness](/reference/commands/source#freshness) together as part of the same job in the environment |
| Model lineage, details, or results | [dbt run](/reference/commands/run) or [dbt build](/reference/commands/build) on a given model within a job in the environment |
| Columns and statistics for models, sources, and snapshots| [dbt docs generate](/reference/commands/cmd-docs) within [a job](/docs/explore/build-and-view-your-docs) in the environment |
| Data test results | [dbt test](/reference/commands/test) or [dbt build](/reference/commands/build) within a job in the environment |
| Unit test results | [dbt test](/reference/commands/test) or [dbt build](/reference/commands/build) within a job in the environment. Unit tests are typically run in development or CI environments, so their results rarely appear in production <Constant name="catalog" />. |
| Source freshness results | [dbt source freshness](/reference/commands/source#freshness) within a job in the environment |
| Snapshot details | [dbt snapshot](/reference/commands/snapshot) or [dbt build](/reference/commands/build) within a job in the environment |
| Seed details | [dbt seed](/reference/commands/seed) or [dbt build](/reference/commands/build) within a job in the environment |

</VersionBlock>

<VersionBlock firstVersion="2.0">

| To view in <Constant name="catalog" /> | You must successfully run |
|---------------------|---------------------------|
| All metadata        | [dbt build](/reference/commands/build) and [dbt source freshness](/reference/commands/source#freshness) together as part of the same job in the environment |
| Model lineage, details, or results | [dbt run](/reference/commands/run) or [dbt build](/reference/commands/build) on a given model within a job in the environment |
| Columns and statistics for models, sources, and snapshots| Any [job](/docs/explore/build-and-view-your-docs) run in the environment. Jobs running v2 refresh catalog metadata automatically. |
| Data test results | [dbt test](/reference/commands/test) or [dbt build](/reference/commands/build) within a job in the environment |
| Unit test results | [dbt test](/reference/commands/test) or [dbt build](/reference/commands/build) within a job in the environment. Unit tests are typically run in development or CI environments, so their results rarely appear in production <Constant name="catalog" />. |
| Source freshness results | [dbt source freshness](/reference/commands/source#freshness) within a job in the environment |
| Snapshot details | [dbt snapshot](/reference/commands/snapshot) or [dbt build](/reference/commands/build) within a job in the environment |
| Seed details | [dbt seed](/reference/commands/seed) or [dbt build](/reference/commands/build) within a job in the environment |

</VersionBlock>
