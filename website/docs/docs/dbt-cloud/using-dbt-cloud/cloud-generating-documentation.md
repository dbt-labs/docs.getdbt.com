---
title: "Generating documentation"
id: "cloud-generating-documentation"
description: "Automatically generate project documentation as you run jobs."
---

## Enabling documentation

You can enable Documentation for a job in dbt Cloud when you edit your job settings or create a new job. Once you enable this setting, subsequent runs of the job will automatically include a step to generate documentation.

1. In the top left, click **Deploy** and select **Jobs**.
2. Select an existing job and click **Settings** or create a new job.
3. Under "Execution Settings," select **Generate docs on run**.
   <Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/568adab-Screen_Shot_2019-02-08_at_9.13.09_PM.png" title="Enabling docs generation in dbt Cloud"/>

4. Click **Save**.

## Viewing documentation

If you have a job set up to generate documentation for your project, then click **Documentation** in the top left. Your project's documentation should open. This link will always navigate you to the most recent version of your project's documentation in dbt Cloud.

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/98c05c5-Screen_Shot_2019-02-08_at_9.18.22_PM.png" title="Project documentation"/>

## Easy access

See [Building and Configuring Artifacts](artifacts) for more information on exposing links to the latest Documentation and Source Freshness reports to your team.