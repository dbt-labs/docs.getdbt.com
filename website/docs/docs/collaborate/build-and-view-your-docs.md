---
title: "Build and view your docs with dbt Cloud"
id: "build-and-view-your-docs"
description: "Automatically generate project documentation as you run jobs."
pagination_next: null
---

<p style={{ color: '#808080', fontSize: '1.1em' }}>
dbt Cloud enables you to generate documentation for your project and data platform, rendering it as a website. The documentation is only updated with new information after a fully successful job run, ensuring accuracy and relevance.
</p>

The default documentation experience in dbt Cloud is [dbt Explorer](/docs/collaborate/explore-projects), available on [Team or Enterprise plans](https://www.getdbt.com/pricing/). Use [dbt Explorer](/docs/collaborate/explore-projects) to view your project's resources (such as models, tests, and metrics) and their lineage to gain a better understanding of its latest production state.

Refer to [documentation](/docs/build/documentation) for more configuration details.

This shift makes [dbt Docs](#dbt-docs) a legacy documentation feature in dbt Cloud. dbt Docs is still accessible and offers basic documentation, but it doesn't offer the same speed, metadata, or visibility as dbt Explorer. dbt Docs is available to dbt Cloud developer plans or dbt Core users.

## Set up a documentation job

dbt Explorer uses the [metadata](/docs/collaborate/explore-projects#generate-metadata) generated after each job run in the production or staging environment, ensuring it always has the latest project results. To view richer metadata, you can set up documentation for a job in dbt Cloud when you edit your job settings or create a new job.

Configure the job to [generate metadata](/docs/collaborate/explore-projects#generate-metadata) when it runs. If you want to view column and statistics for models, sources, and snapshots in dbt Explorer, then this step is necessary.

To set up a job to generate docs:

1. In the top left, click **Deploy** and select **Jobs**.
2. Create a new job or select an existing job and click **Settings**.
3. Under **Execution Settings**, select **Generate docs on run** and click **Save**.
   <Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/documentation-job-execution-settings.png" width="65%" title="Setting up a job to generate documentation"/>

*Note, for dbt Docs users you need to configure the job to generate docs when it runs, then link that job to your project. Proceed to [configure project documentation](#configure-project-documentation) so your project generates the documentation when this job runs.*

You can also add the [`dbt docs generate` command](/reference/commands/cmd-docs) to the list of commands in the job run steps. However, you can expect different outcomes when adding the command to the run steps compared to configuring a job selecting the **Generate docs on run** checkbox. 

Review the following options and outcomes:

| Options | Outcomes |
|--------| ------- |
| **Select checkbox** | Select the **Generate docs on run** checkbox to automatically generate updated project docs each time your job runs. If that particular step in your job fails, the job can still be successful if all subsequent steps are successful. |
| **Add as a run step** | Add `dbt docs generate` to the list of commands in the job run steps, in whatever order you prefer. If that particular step in your job fails, the job will fail and all subsequent steps will be skipped.   |

:::tip Tip &mdash; Documentation-only jobs 

To create and schedule documentation-only jobs at the end of your production jobs, add the `dbt compile` command in the **Commands** section.

:::

## dbt Docs

dbt Docs, available on developer plans or dbt Core users, is a legacy feature that generates a website from your dbt project using the `dbt docs generate` command. It provides a central location to view your project's resources, such as models, tests, and metrics, and lineage  &mdash; and helps you understand the data in your warehouse.

:::tip Use dbt Explorer for a richer documentation experience
For a  richer and more interactive experience, try out [dbt Explorer](/docs/collaborate/explore-projects), available on [Team or Enterprise plans](https://www.getdbt.com/pricing/). It includes map layers of your DAG, keyword search, interacts with the IDE, model performance, project recommendations, and more.
:::

### Configure project documentation

You configure project documentation to generate documentation when the job you set up in the previous section runs. In the project settings, specify the job that generates documentation artifacts for that project. Once you configure this setting, subsequent runs of the job will automatically include a step to generate documentation.

1. Click the gear icon in the top right.
2. Select **Account Settings**.
3. Navigate to **Projects** and select the project that needs documentation.
4. Click **Edit**.
5. Under **Artifacts**, select the job that should generate docs when it runs and click **Save**.
   <Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/documentation-project-details.png" width="55%" title="Configuring project documentation"/>

### Generating documentation

To generate documentation in the dbt Cloud IDE, run the `dbt docs generate` command in the **Command Bar** in the dbt Cloud IDE. This command will generate the documentation for your dbt project as it exists in development in your IDE session.

After generating your documentation, you can click **Explore** in the navigation. This will take you to <a href="https://docs.getdbt.com/docs/collaborate/explore-projects">dbt Explorer</a>, where you can view your project's resources and their lineage.

<Lightbox src="/img/docs/dbt-cloud/explore-nav.jpg" width="90%" title="Access dbt Explorer from dbt Cloud by clicking Explore in the navigation."/>

After running `dbt docs generate` in the dbt Cloud IDE, click the icon above the file tree, to see the latest version of your documentation rendered in a new browser window.

### View documentation

Once you set up a job to generate documentation for your project, you can click **Explore** in the navigation and then click on **dbt Docs**. Your project's documentation should open. This link will always help you find the most recent version of your project's documentation in dbt Cloud.

These generated docs always show the last fully successful run, which means that if you have any failed tasks, including tests, then you will not see changes to the docs by this run. If you don't see a fully successful run, then you won't see any changes to the documentation.

The dbt Cloud IDE makes it possible to view [documentation](/docs/build/documentation) for your dbt project while your code is still in development. With this workflow, you can inspect and verify what your project's generated documentation will look like before your changes are released to production.

## Related docs
- [Documentation](/docs/build/documentation)
- [dbt Explorer](/docs/collaborate/explore-projects)
