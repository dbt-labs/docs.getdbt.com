---
title: "Merge jobs in dbt Cloud"
sidebar_label: "Merge jobs"
description: "Learn how to trigger a dbt job run when a Git pull request merges."
---


You can set up a merge job to implement a continuous deployment (CD) workflow in dbt Cloud. The merge job triggers a dbt job to run when someone merges Git pull requests into production. This workflow creates a seamless development experience where changes made in code will automatically update production data. Also, you can use this workflow for running `dbt compile` to update your environment's manifest so subsequent CI job runs are more performant.

By using CD in dbt Cloud, you can take advantage of deferral to build only the edited model and any downstream changes. With merge jobs, state will be updated almost instantly, always giving the most up-to-date state information in [dbt Explorer](/docs/collaborate/explore-projects).

## Prerequisites
- You have a dbt Cloud account. 
- You have set up a [connection with your Git provider](/docs/cloud/git/git-configuration-in-dbt-cloud). This integration lets dbt Cloud run jobs on your behalf for job triggering.
   - If you're using a native [GitLab](/docs/cloud/git/connect-gitlab) integration, you need a paid or self-hosted account that includes support for GitLab webhooks and [project access tokens](https://docs.gitlab.com/ee/user/project/settings/project_access_tokens.html). If you're using GitLab Free, merge requests will trigger CI jobs but CI job status updates (success or failure of the job) will not be reported back to GitLab.
- For deferral (which is the default), make sure there has been at least one successful job run in the environment you defer to.

## Set up job trigger on Git merge {#set-up-merge-jobs}

1. On your deployment environment page, click **Create job** > **Merge job**. 
1. Options in the **Job settings** section:
    - **Job name** &mdash; Specify the name for the merge job.
    - **Description** &mdash; Provide a description about the job.
    - **Environment** &mdash; By default, it’s set to the environment you created the job from.
1. In the **Git trigger** section, the **Run on merge** option is enabled by default. Every time a PR merges (to a base
branch configured in the environment) in your Git repo, this job will get triggered to run. 
1. Options in the **Execution settings** section:
    - **Commands** &mdash; By default, it includes the `dbt build --select state:modified+` command. This informs dbt Cloud to build only new or changed models and their downstream dependents. Importantly, state comparison can only happen when there is a deferred environment selected to compare state to. Click **Add command** to add more [commands](/docs/deploy/job-commands) that you want to be invoked when this job runs.
    - **Compare changes against** &mdash; By default, it's set to compare changes against the environment you created the job from. This option allows dbt Cloud to check the state of the code in the PR against the code running in the deferred environment, so as to only check the modified code, instead of building the full table or the entire DAG. To change the default settings, you can select **No deferral**, **This job** for self-deferral, or choose a different environment. 
1. (optional) Options in the **Advanced settings** section: 
    - **Environment variables** &mdash; Define [environment variables](/docs/build/environment-variables) to customize the behavior of your project when this job runs.
    - **Target name** &mdash; Define the [target name](/docs/build/custom-target-names). Similar to environment variables, this option lets you customize the behavior of the project. 
    - **Run timeout** &mdash; Cancel this job if the run time exceeds the timeout value.
    - **dbt version** &mdash; By default, it’s set to inherit the [dbt version](/docs/dbt-versions/core) from the environment. dbt Labs strongly recommends that you don't change the default setting. This option to change the version at the job level is useful only when you upgrade a project to the next dbt version; otherwise, mismatched versions between the environment and job can lead to confusing behavior.
    - **Threads** &mdash; By default, it’s set to 4 [threads](/docs/core/connect-data-platform/connection-profiles#understanding-threads). Increase the thread count to increase model execution concurrency.

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/example-create-merge-job.png" title="Example of creating a merge job"/>

## Verify push events in Git

Merge jobs require push events so make sure they've been enabled in your Git provider, especially if you have an already-existing Git integration. However, for a new integration setup, you can skip this check since push events are typically enabled by default. 

<Expandable alt_header="GitHub example" >

The following is a GitHub example of when the push events are already set: 

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/example-github-push-events.png" title="Example of the Pushes option enabled in the GitHub settings"/>

</Expandable>

<Expandable alt_header="GitLab example" >

The following is a GitLab example of when the push events are already set:

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/example-gitlab-push-events.png" title="Example of the Push events option enabled in the GitLab settings"/>

</Expandable>

<Expandable alt_header="Azure DevOps example" >

The following is an example of creating a new **Code pushed** trigger in Azure DevOps. Create a new service hooks subscription when code pushed events haven't been set: 

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/example-azuredevops-new-event.png" title="Example of creating a new trigger to push events in Azure Devops"/>

</Expandable>
