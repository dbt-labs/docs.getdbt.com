---
title: "Legacy dbt Docs"
description: "Automatically generate project documentation as you run jobs with the legacy dbt Docs."
pagination_next: null
---

<p style={{ color: '#808080', fontSize: '1.1em' }}>
dbt Docs is a legacy feature that enables you to generate documentation for your project and data platform, rendering it as a website. The documentation is only updated with new information after a fully successful job run, ensuring accuracy and relevance.
</p>

The default documentation experience in dbt Cloud is [dbt Explorer](/docs/collaborate/explore-projects), available on [Team or Enterprise plans](https://www.getdbt.com/pricing/), which provides a richer and more interactive experience for understanding your project's resources and lineage. This shift makes dbt Docs a legacy documentation feature in dbt Cloud, and is accessible through dbt Explorer.

This document guides you on how to use dbt Docs to generate a static website from your dbt project using the `dbt docs generate` command. It provides a point-in-time view of your project's resources, such as models, tests, and metrics, and lineage  &mdash; and helps you understand the data in your warehouse. dbt Docs is currently available on developer plans or dbt Core users.

Refer to [Documentation](/docs/build/documentation) for more configuration details.

## Set up a documentation job

You can set up documentation for a job in dbt Cloud when you edit your job settings or create a new job. You need to configure the job to generate docs when it runs, then link that job to your project. This step is necessary to view column and statistics for models, sources, and snapshots in dbt Explorer.

import SetUpDocsJob from '/snippets/_docs-setup-doc-job.md';

<SetUpDocsJob/>

Proceed to [configure project documentation](#configure-project-documentation) so your project generates the documentation when this job runs.

## Configure project documentation

You configure project documentation to generate documentation when the job you set up in the previous section runs. In the project settings, specify the job that generates documentation artifacts for that project. Once you configure this setting, subsequent runs of the job will automatically include a step to generate documentation.

1. Click the gear icon in the top right.
2. Select **Account Settings**.
3. Navigate to **Projects** and select the project that needs documentation.
4. Click **Edit**.
5. Under **Artifacts**, select the job that should generate docs when it runs.
   <Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/documentation-project-details.png" width="55%" title="Configuring project documentation"/>
6. Click **Save**.

## Generating documentation

To generate documentation in the [dbt Cloud IDE](/docs/cloud/dbt-cloud-ide/develop-in-the-cloud) run the `dbt docs generate` command in the **Command Bar** in the dbt Cloud IDE. This command will generate documentation for your dbt project as it exists in development in your IDE session.

After generating your documentation, you can click the icon above the file tree, to see the latest version of your documentation rendered in a new browser window.

## View documentation

:::tip Use dbt Explorer for a richer documentation experience
For a  richer and more interactive experience for understanding your project's resources and lineage, try out [dbt Explorer](/docs/collaborate/explore-projects), available on [Team or Enterprise plans](https://www.getdbt.com/pricing/).

It includes map layers of your DAG, keyword search, interacts with the IDE, model performance, project recommendations, and more.
:::

Once you set up a job to generate [documentation](/docs/build/documentation) for your project, you can view documentation in the following ways:

- In the dbt Cloud IDE, click the icon above the file tree in the editor to see the latest version of your documentation rendered in a new browser window. View your documentation for your dbt project while your code is still in development. With this workflow, you can inspect and verify what your project's generated documentation will look like before your changes are released to production.
- In the dbt Cloud user interface, click **Documentation** in the navigation to view your project's documentation. This link will always help you find the most recent version of your project's documentation in dbt Cloud.
- If you've ran a successful job run, you can view the latest version of your project's documentation by clicking **Documentation** in the navigation.
  
  These generated docs always show the last fully successful run, which means that if you have any failed tasks, including tests, then you will not see changes to the docs by this run. If you don't see a fully successful run, then you won't see any changes to the documentation.

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/98c05c5-Screen_Shot_2019-02-08_at_9.18.22_PM.png" width="55%" title="Access your project documentation by clicking 'Documentation in the navigation menu."/>

## Related docs
- [Documentation](/docs/build/documentation)
- [dbt Explorer](/docs/collaborate/explore-projects)
