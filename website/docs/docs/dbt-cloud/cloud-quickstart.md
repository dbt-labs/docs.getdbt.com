---
title: "dbt Cloud Quickstart"
id: "cloud-quickstart"
---


<Callout type="info" title="dbt Cloud">

The functionality documented here is available in dbt Cloud. Don't have an account? You can get started for free [here](https://www.getdbt.com/signup).

</Callout>

## Connect a repository

dbt Cloud plugs directly into your version control system (GitHub, GitLab, BitBucket, etc) to pull the latest version of your dbt project. To connect a repository to your dbt Cloud account, first navigate to the Repositories Page in the app sidebar. From the Repositories page, click the "New Repository" button to begin adding a new Repository.

If you've [installed the dbt Cloud application in your GitHub account](cloud-installing-the-github-application), then you will be able to select a repo from your GitHub org using this interface. If you're not using GitHub, or if you haven't installed the integration yet, you can optionally connect a git repository by [providing a git URL](cloud-import-a-project-by-git-url) from the "Git URL" tab.

<Lightbox src="/img/docs/dbt-cloud/a5e2b52-Screen_Shot_2019-01-31_at_4.14.45_PM.png" title="Adding a new repository from GitHub"/>

## Create a connection

dbt Cloud uses Connections to _connect_ to your database when running dbt jobs. Depending on the type of data warehouse you're using, you'll need to supply different configuration parameters.

To create a new Connection, click the Connections link in the left sidebar. From here, click the "New Connection" button to begin creating a new Connection. Next, pick your desired data warehouse type from the `type` dropdown.

After picking a data warehouse type, a form will be generated which you can populate with your warehouse's credentials. These credentials are encrypted at rest, and dbt Cloud never stores credentials in plaintext.

<Lightbox src="/img/docs/dbt-cloud/b070a02-Screen_Shot_2019-01-31_at_11.48.15_PM.png" title="An example connection for a Redshift data warehouse"/>

## Create an environment

Environments specify the information required to run dbt jobs for your project. For information about configuring a Development environment, see [creating a development environment](using-the-dbt-ide#creating-a-development-environment).

Scheduled dbt jobs can be configured in Deployment environments. These deployment environments must be configured with *deployment credentials*. Unlike Development credentials which run with the permissions of a human being, deployment credentials should be configured with a service account database user. We recommend configuring deployment environments to run as a user named `dbt_cloud` (or similar) in your database.

To create an Environment, navigate to the Environments page, and then click the "New Environment" button. On this page, you can specify the dbt version and custom branch (if applicable) that dbt Cloud should use to build your project. Additionally, the deployment credentials for the Environment can be configured on this page.

<Lightbox src="/img/docs/dbt-cloud/a7c5859-Screen_Shot_2019-01-31_at_11.54.32_PM.png" title="Creating a new connection"/>

## Create a new job

Now that dbt Cloud is able to clone your dbt repo and connect to your warehouse, you're ready to create a new job! To create a job, navigate to the Job page from the left sidebar, then click the "New Job" button. In the job creation interface, you can specify the environment that the job should use, as well as commands and configuration for your new job.

<Lightbox src="/img/docs/dbt-cloud/3af80f1-Screen_Shot_2019-02-01_at_9.51.54_AM.png" title="An example job definition"/>

Job schedules can be configured from the job creation interface. You can either schedule your job using the visual editor, or you can enter a custom cron syntax for your job.

<Lightbox src="/img/docs/dbt-cloud/b19ca51-Screen_Shot_2019-02-01_at_12.42.18_PM.png" title="Setting a job schedule"/>
