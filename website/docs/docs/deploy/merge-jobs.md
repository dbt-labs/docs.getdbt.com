---
title: "Merge jobs in dbt Cloud"
sidebar_label: "Merge jobs"
description: "Learn how to trigger a dbt job run when a Git pull request merges."
---

# Merge jobs in dbt Cloud <Lifecycle status="beta" />

To implement a continuous development (CD) workflow in dbt Cloud, you can set up merge jobs that triggers a dbt job to run when Git pull requests are merged into production. This creates a seamless development experience where changes made in code will automatically update production data. 

By using CD in dbt Cloud, you can take advantage of deferral to build only the edited model and any downstream changes. With merge jobs, state will be updated almost instantly, always giving the most up-to-date state information in [dbt Explorer](/docs/collaborate/explore-projects).

## Prerequisites
- You have a dbt Cloud account. 
- You have access to the beta release for this functionality. 

## Set up job trigger on Git merge {#set-up-merge-jobs}

1. On your deployment environment page, click **Create Job** > **Merge Job**. 
1. Options in the **Job settings** section:
    - **Job name** &mdash; Specify the name for the merge job.
    - **Description** &mdash; Provide a descripion about the job. 
    - **Environment** &mdash; By default, it’s set to your production environment.
1. In the **Git trigger** section, the **Run on merge** option is enabled by default. Every time a PR merges (to the main branch) in your Git repo, this job will get triggered to run. 
1. In the **Execution settings** section, add the dbt commands that you want to invoke when this job runs. By default, it includes the `dbt build --select state:modified+` command. This informs dbt Cloud to build only new or changed models and their downstream dependents. For more [commands](/docs/deploy/job-commands), click **Add command**.
1. (optional) Options in the **Advanced settings** section: 
    - **Environment variables** &mdash; Define [environment variables](/docs/build/environment-variables) to customize the behavior of your project when this job runs.
    - **Target name** &mdash; Define the [target name](/docs/build/custom-target-names). Similar to **Environment Variables**, this option lets you customize the behavior of the project. 
    - **Run timeout** &mdash; Cancel this job if the run time exceeds the timeout value.
    - **dbt version** &mdash; By default, it’s set to inherit the [dbt version](/docs/dbt-versions/core) from the environment. dbt Labs strongly recommends that you don't change the default setting. This option to change the version at the job level is useful only when you upgrade a project to the next dbt version; otherwise, mismatched versions between the environment and job can lead to confusing behavior.
    - **Threads** &mdash; By default, it’s set to 4 [threads](/docs/core/connect-data-platform/connection-profiles#understanding-threads). Increase the thread count to increase model execution concurrency.

## Example 

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/example-create-merge-job.png" width="90%" title="Example of creating a merge job"/>