---
title: "Build and view your docs with dbt Cloud"
id: "build-and-view-your-docs"
description: "Automatically generate project documentation as you run jobs."
pagination_next: null
meta:
  dev: Documentation
  customer: Explore 
---

<p style={{ color: '#808080', fontSize: '1.1em' }}>
dbt Cloud enables you to generate documentation for your project and data platform, rendering it as a website. The documentation is only updated with new information after a fully successful job run, ensuring accuracy and relevance.
</p>

Use [dbt Explorer](/docs/collaborate/explore-projects) to view your project's resources (such as models, tests, and metrics) and their lineage to gain a better understanding of its latest production state. Refer to [Documentation](/docs/collaborate/documentation) for more configuration details.

- dbt Explorer is only available on [Team or Enterprise plans](https://www.getdbt.com/pricing/)
- dbt Cloud developer plans can view project documentation using the legacy dbt Docs.

<Expandable alt_header="What is dbt Docs and why is it legacy?">

dbt Docs generates a website from your dbt project using the `dbt docs generate` command. It provides a central location to view your project's resources, such as models, tests, and metrics, and lineage  &mdash; and helps you understand the data in your warehouse. dbt Docs is currently available on developer plans.

The default documentation experience in dbt Cloud is dbt Explorer, which provides a richer and more interactive experience for understanding your project's resources and lineage. This shift makes dbt Docs a legacy documentation feature in dbt Cloud, and it's accessible through dbt Explorer.

</Expandable>

## Set up a documentation job

You can set up documentation for a job in dbt Cloud when you edit your job settings or create a new job. You need to configure the job to generate docs when it runs, then link that job to your project.

To set up a job to generate docs:

1. In the top left, click **Deploy** and select **Jobs**.
2. Create a new job or select an existing job and click **Settings**.
3. Under "Execution Settings," select **Generate docs on run**.
   <Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/documentation-job-execution-settings.png" width="65%" title="Setting up a job to generate documentation"/>

4. Click **Save**. Proceed to [configure project documentation](#configure-project-documentation) so your project generates the documentation when this job runs.

You can also add `dbt docs generate` to the list of commands in the job run steps. However, you can expect different outcomes when adding the command to the run steps compared to configuring a job selecting the **Generate docs on run** checkbox (shown in previous steps). 

Review the following options and outcomes:

| Options | Outcomes |
|--------| ------- |
| **Select checkbox** | Select the **Generate docs on run** checkbox to automatically generate updated project docs each time your job runs. If that particular step in your job fails, the job can still be successful if all subsequent steps are successful. |
| **Add as a run step** | Add `dbt docs generate` to the list of commands in the job run steps, in whatever order you prefer. If that particular step in your job fails, the job will fail and all subsequent steps will be skipped.   |

:::tip Tip &mdash; Documentation-only jobs 

To create and schedule documentation-only jobs at the end of your production jobs, add the `dbt compile` command in the **Commands** section.

:::

## Configure project documentation

You configure project documentation to generate documentation when the job you set up in the previous section runs. In the project settings, specify the job that generates documentation artifacts for that project. Once you configure this setting, subsequent runs of the job will automatically include a step to generate documentation.

1. Click the gear icon in the top right.
2. Select **Account Settings**.
3. Navigate to **Projects** and select the project that needs documentation.
4. Click **Edit**.
5. Under **Artifacts**, select the job that should generate docs when it runs.
   <Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/documentation-project-details.png" width="55%" title="Configuring project documentation"/>
6. Click **Save**.

## Documentation in development

To generate documentation in the dbt Cloud IDE, run the `dbt docs generate` command in the **Command Bar** in the dbt Cloud IDE. This command will generate the documentation for your dbt project as it exists in development in your IDE session.

<span>After generating your documentation, you can click <b>{frontMatter.meta.customer}</b> on the navigation.</span> This will take you to <a href="https://docs.getdbt.com/docs/collaborate/explore-projects">dbt Explorer</a>, where you can view your project's resources and their lineage.

<Lightbox src="/img/docs/dbt-cloud/explore-nav.jpg" width="90%" title="Access dbt Explorer from dbt Cloud by clicking Explore in the navigation."/>

**dbt Cloud developer plans**

After running `dbt docs generate` in the dbt Cloud IDE, click the **Book** icon above the file tree, to see the latest version of your documentation rendered in a new browser window.

## View documentation

<span>Once you set up a job to generate documentation for your project, you can click <b>{frontMatter.meta.customer}</b> in the navigation menu to open your project's documentation. This link will always help you find the most recent version of your project's documentation in dbt Cloud.</span><br /><br />

The [generated metadata](/docs/collaborate/explore-projects#generate-metadata) always shows the last fully successful run, which means that if you have any failed tasks, including tests, then you won't see changes reflected by this run. If you don't have a fully successful run, then you won't see any changes in dbt Explorer.

The dbt Cloud IDE makes it possible to view [documentation](/docs/collaborate/documentation)
for your dbt project while your code is still in development. With this workflow, you can inspect and verify what your project's generated documentation will look like before your changes are released to production.

<Lightbox src="/img/docs/dbt-cloud/access-explorer.gif" width="90%" title="Access dbt Explorer from dbt Cloud and view your project's resource." />

### dbt Docs for developer plans

<span>If you're on a dbt Cloud developer plan, you can view your project's documentation using the legacy dbt Docs. You can view documentation through the dbt Cloud IDE or using the <b>{frontMatter.meta.dev}</b> link:</span>

- In the dbt Cloud IDE, click the **Book** icon above the file tree in the editor to see the latest version of your documentation rendered in a new browser window.
- <span>In the dbt Cloud user interface, click <b>{frontMatter.meta.dev}</b> in the navigation to view your project's documentation.</span>
- <span>If you've ran a successful job run, you can view the latest version of your project's documentation by clicking <b>{frontMatter.meta.dev}</b> in the navigation.</span>

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/98c05c5-Screen_Shot_2019-02-08_at_9.18.22_PM.png" width="55%" title="Project documentation"/>
