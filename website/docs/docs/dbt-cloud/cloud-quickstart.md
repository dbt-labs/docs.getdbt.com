---
title: "dbt Cloud Quickstart"
id: "cloud-quickstart"
---


:::info dbt Cloud

The functionality documented here is available in dbt Cloud. Don't have an account? You can get started for free [here](https://www.getdbt.com/signup).

:::

# Set Up A Project
When creating a new dbt Cloud account, you will be prompted to move through the Project setup flow. A project is made up of a Connection and Repository and can contain multiple Environments within it.

Let's get started!

## Create a connection

dbt Cloud uses this connection to _connect_ to your database when running jobs and transformation queries. Depending on the type of data warehouse you're using, you'll need to supply [different configuration parameters](connecting-your-database.md). dbt Cloud natively supports connections to Snowflake, BigQuery, Redshift, Apache Spark, Databricks, and Postgres.

After picking a data warehouse type, a form will be generated where you can populate your warehouse's credentials. These credentials are encrypted at rest, and dbt Cloud never stores credentials in plaintext.

<Lightbox src="/img/docs/dbt-cloud/dbt-quickstart-connection.png" title="An example connection for a Snowflake data warehouse"/>

## Connect a repository

dbt Cloud plugs directly into your version control system (GitHub, GitLab, BitBucket, etc) to pull the latest version of your dbt project.

If you've [installed the dbt Cloud application in your GitHub account](cloud-installing-the-github-application), then you will be able to select a repo from your GitHub org using this interface. If you're not using GitHub, or if you haven't installed the integration yet, you can optionally connect a git repository by [providing a git URL](cloud-import-a-project-by-git-url) from the "Git URL" tab.

You’ll find the “Managed” tab useful if you do not already have a git repository for your dbt project. With this option, you can let [dbt Cloud manage a repository](cloud-using-a-managed-repository) for you.

<Lightbox src="/img/docs/dbt-cloud/dbt-quickstart-repository.png" title="Adding a new repository from GitHub"/>


## Create an environment

Environments specify the information required to run dbt for your project. New dbt Cloud accounts will automatically be created with a Development environment during setup. For more information about configuring this Development environment, see [creating a development environment](using-the-dbt-ide#creating-a-development-environment).

Scheduled dbt jobs can be configured in Deployment environments. These deployment environments must be configured with deployment credentials. Unlike Development credentials which run with the permissions of a human being, deployment credentials should be configured with a service account database user. We recommend configuring deployment environments to run as a user named dbt_cloud (or similar) in your database.

To create an Environment, click the hamburger button in the upper left-hand corner of the Cloud UI and select Environments from the menu. You’ll then click the “New Environment” button where you can specify the dbt version and custom branch (if applicable) that dbt Cloud should use to build your project. Additionally, the deployment credentials for the Environment can be configured on this page.

<Lightbox src="/img/docs/dbt-cloud/dbt-quickstart-environment.png" title="Creating a new deployment environment"/>

## Create a new job

Now that dbt Cloud is able to clone your dbt repo and connect to your warehouse, you're ready to create a new job! To create a job, navigate to the Jobs page from the left sidebar, then click the "New Job" button. In the job creation interface, you can specify the environment that the job should use, as well as commands and configuration for your new job.

<Lightbox src="/img/docs/dbt-cloud/dbt-quickstart-new-job.png" title="An example job definition"/>

Job schedules can be configured from the job creation interface. You can either schedule your job using the visual editor, or you can enter a custom cron syntax for your job.

<Lightbox src="/img/docs/dbt-cloud/dbt-quickstart-new-job-schedule.png" title="Setting a job schedule"/>
