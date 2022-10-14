---
title: "Build and view your docs with dbt Cloud"
id: "build-and-view-your-docs"
description: "Automatically generate project documentation as you run jobs."
---

dbt enables you to generate documentation for your project and data warehouse, and renders the documentation in a website. For more information, see [Documentation](/docs/building-a-dbt-project/documentation).

## Set up a documentation job

You can set up documentation for a job in dbt Cloud when you edit your job settings or create a new job. You need to configure the job to generate docs when it runs, then link that job to your project.

To set up a job to generate docs:

1. In the top left, click **Deploy** and select **Jobs**.
2. Create a new job or select an existing job and click **Settings**.
3. Under "Execution Settings," select **Generate docs on run**.
   <Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/documentation-job-execution-settings.png" title="Setting up a job to generate documentation"/>

4. Click **Save**. Proceed to [configure project documentation](#configure-project-documentation) so your project generates the documentation when this job runs.


## Configure project documentation

You configure project documentation to generate documentation when the job you set up in the previous section runs. In the project settings, specify the job that generates documentation artifacts for that project. Once you configure this setting, subsequent runs of the job will automatically include a step to generate documentation.

1. Click the gear icon in the top right.
2. Select **Projects** and click the project that needs documentation.
3. Click **Edit**.
4. Under "Artifacts," select the job that should generate docs when it runs.
   <Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/documentation-project-details.png" title="Configuring project documentation"/>
5. Click **Save**.

## Generating documentation

To generate documentation in the IDE, run the `dbt docs generate` command in the
Command Bar in the IDE. This command will generate the Docs for your dbt project as it exists in development in your IDE session.

<Lightbox src="/img/docs/dbt-cloud/dbt-docs-generate-command.png" title="dbt docs generate"/>

After generating your documentation, you can click the "view docs" button to see the latest version of your documentation rendered in a new browser window.

<Lightbox src="/img/docs/dbt-cloud/View-docs-in-IDE.png" title="View docs in the IDE"/>

## Viewing documentation

Once you set up a job to generate documentation for your project, you can click **Documentation** in the top left. Your project's documentation should open. This link will always navigate you to the most recent version of your project's documentation in dbt Cloud.

The dbt Cloud IDE makes it possible to view [documentation](/docs/collaborate/documentation)
for your dbt project while your code is still in development. With this workflow, you can inspect and verify what your project's generated documentation will look like before your changes are released to production.

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/98c05c5-Screen_Shot_2019-02-08_at_9.18.22_PM.png" title="Project documentation"/>
