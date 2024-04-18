---
title: "Merge jobs in dbt Cloud"
sidebar_label: "Merge jobs"
description: "Learn how to trigger a dbt job run when a Git pull request merges."
---

# Merge jobs in dbt Cloud <Lifecycle status="beta" />

You can set up a merge job to implement a continuous development (CD) workflow in dbt Cloud. The merge job triggers a dbt job to run when someone merges Git pull requests into production. This creates a seamless development experience where changes made in code will automatically update production data. 

By using CD in dbt Cloud, you can take advantage of deferral to build only the edited model and any downstream changes. With merge jobs, state will be updated almost instantly, always giving the most up-to-date state information in [dbt Explorer](/docs/collaborate/explore-projects).

## Prerequisites
- You have a dbt Cloud account. 
- You have access to the beta release for this functionality. 

## Set up job trigger on Git merge {#set-up-merge-jobs}

1. On your deployment environment page, click **Create Job** > **Merge Job**. 
1. Options in the **Job settings** section:
    - **Job name** &mdash; Specify the name for the merge job.
    - **Description** &mdash; Provide a descripion about the job. 
    - **Environment** &mdash; By default, it’s set to the environment you created the job from.
1. In the **Git trigger** section, the **Run on merge** option is enabled by default. Every time a PR merges (to the main branch) in your Git repo, this job will get triggered to run. 
1. Options in the **Execution settings** section:
    - **Commands** &mdash; By default, it includes the `dbt build --select state:modified+` command. This informs dbt Cloud to build only new or changed models and their downstream dependents. Importantly, state comparison can only happen when there is a deferred environment selected to compare state to. Click **Add command** to add more [commands](/docs/deploy/job-commands) that you want to be invoked when this job runs.
    - **Compare changes against an environment (Deferral)** &mdash; By default, it's set to the environment you created the job from. This option allows dbt Cloud to check the state of the code in the PR against the code running in the deferred environment, so as to only check the modified code, instead of building the full table or the entire DAG.
1. (optional) Options in the **Advanced settings** section: 
    - **Environment variables** &mdash; Define [environment variables](/docs/build/environment-variables) to customize the behavior of your project when this job runs.
    - **Target name** &mdash; Define the [target name](/docs/build/custom-target-names). Similar to **Environment Variables**, this option lets you customize the behavior of the project. 
    - **Run timeout** &mdash; Cancel this job if the run time exceeds the timeout value.
    - **dbt version** &mdash; By default, it’s set to inherit the [dbt version](/docs/dbt-versions/core) from the environment. dbt Labs strongly recommends that you don't change the default setting. This option to change the version at the job level is useful only when you upgrade a project to the next dbt version; otherwise, mismatched versions between the environment and job can lead to confusing behavior.
    - **Threads** &mdash; By default, it’s set to 4 [threads](/docs/core/connect-data-platform/connection-profiles#understanding-threads). Increase the thread count to increase model execution concurrency.
    - **Run source freshness** &mdash; Enable this option to invoke the `dbt source freshness` command before running this job. Refer to [Source freshness](/docs/deploy/source-freshness) for more details.

## Example 

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/example-create-merge-job.png" width="90%" title="Example of creating a merge job"/>