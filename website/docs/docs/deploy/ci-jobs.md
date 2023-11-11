---
title: "Continuous integration jobs in dbt Cloud"
sidebar_label: "CI jobs"
description: "Learn how to create and set up CI checks to test code changes before deploying to production."
---

You can set up [continuous integration](/docs/deploy/continuous-integration) (CI) jobs to run when someone opens a new pull request (PR) in your dbt Git repository. By running and testing only _modified_ models, dbt Cloud ensures these jobs are as efficient and resource conscientious as possible on your data platform.


## Set up CI jobs {#set-up-ci-jobs}

dbt Labs recommends that you create your CI job in a dedicated dbt Cloud [deployment environment](/docs/deploy/deploy-environments#create-a-deployment-environment) that's connected to a staging database. Having a separate environment dedicated for CI will provide better isolation between your temporary CI schema builds and your production data builds. Additionally, sometimes teams need their CI jobs to be triggered when a PR is made to a branch other than main. If your team maintains a staging branch as part of your release process, having a separate environment will allow you to set a [custom branch](/faqs/environments/custom-branch-settings) and, accordingly, the CI job in that dedicated environment will be triggered only when PRs are made to the specified custom branch. To learn more, refer to [Get started with CI tests](/guides/set-up-ci).

### Prerequisites
- You have a dbt Cloud account.
- For the [Concurrent CI checks](/docs/deploy/continuous-integration#concurrent-ci-checks) and [Smart cancellation of stale builds](/docs/deploy/continuous-integration#smart-cancellation) features, your dbt Cloud account must be on the [Team or Enterprise plan](https://www.getdbt.com/pricing/).
- You must be connected using dbt Cloud’s native Git integration with [GitHub](/docs/cloud/git/connect-github), [GitLab](/docs/cloud/git/connect-gitlab), or [Azure DevOps](/docs/cloud/git/connect-azure-devops).
    - If you’re using GitLab, you must use a paid or self-hosted account which includes support for GitLab webhooks.
    - If you previously configured your dbt project by providing a generic git URL that clones using SSH, you must reconfigure the project to connect through dbt Cloud's native integration.


To make CI job creation easier, many options on the **CI job** page are set to default values that dbt Labs recommends that you use. If you don't want to use the defaults, you can change them.

1. On your deployment environment page, click **Create Job** > **Continuous Integration Job** to create a new CI job. 

2. Options in the **Job Description** section:
    - **Job Name** &mdash; Specify the name for this CI job.
    - **Environment** &mdash; By default, it’s set to the environment you created the CI job from.
    - **Triggered by pull requests** &mdash; By default, it’s enabled. Every time a developer opens up a pull request or pushes a commit to an existing pull request, this job will get triggered to run.
      - **Run on Draft Pull Request** &mdash; Enable this option if you want to also trigger the job to run every time a developer opens up a draft pull request or pushes a commit to that draft pull request. 

3. Options in the **Execution Settings** section:
    - **Commands** &mdash; By default, it includes the `dbt build --select state:modified+` command. This informs dbt Cloud to build only new or changed models and their downstream dependents. Importantly, state comparison can only happen when there is a deferred environment selected to compare state to. Click **Add command** to add more [commands](/docs/deploy/job-commands)  that you want to be invoked when this job runs.
    - **Compare changes against an environment (Deferral)** &mdash; By default, it’s set to the **Production** environment if you created one. This option allows dbt Cloud to check the state of the code in the PR against the code running in the deferred environment, so as to only check the modified code, instead of building the full table or the entire DAG.

    :::info
    Older versions of dbt Cloud only allow you to defer to a specific job instead of an environment. Deferral to a job compares state against the project code that was run in the deferred job's last successful run. While deferral to an environment is more efficient as dbt Cloud will compare against the project representation (which is stored in the `manifest.json`) of the last successful deploy job run that executed in the deferred environment. By considering _all_ [deploy jobs](/docs/deploy/deploy-jobs) that run in the deferred environment, dbt Cloud will get a more accurate, latest project representation state.
    :::

    - **Generate docs on run** &mdash; Enable this option if you want to [generate project docs](/docs/collaborate/build-and-view-your-docs) when this job runs. This option is disabled by default since most teams do not want to test doc generation on every CI check.

  <Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/create-ci-job.png" width="90%" title="Example of CI Job page in dbt Cloud UI"/>

4. (optional) Options in the **Advanced Settings** section: 
    - **Environment Variables** &mdash; Define [environment variables](/docs/build/environment-variables) to customize the behavior of your project when this CI job runs. You can specify that a CI job is running in a _Staging_ or _CI_ environment by setting an environment variable and modifying your project code to behave differently, depending on the context. It's common for teams to process only a subset of data for CI runs, using environment variables to branch logic in their dbt project code.
    - **Target Name** &mdash; Define the [target name](/docs/build/custom-target-names). Similar to **Environment Variables**, this option lets you customize the behavior of the project. You can use this option to specify that a CI job is running in a _Staging_ or _CI_ environment by setting the target name and modifying your project code to behave differently, depending on the context. 
    - **Run Timeout** &mdash; Cancel this CI job if the run time exceeds the timeout value. You can use this option to help ensure that a CI check doesn't consume too much of your warehouse resources.
    - **dbt Version** &mdash; By default, it’s set to inherit the [dbt version](/docs/dbt-versions/core) from the environment. dbt Labs strongly recommends that you don't change the default setting. This option to change the version at the job level is useful only when you upgrade a project to the next dbt version; otherwise, mismatched versions between the environment and job can lead to confusing behavior.
    - **Threads** &mdash; By default, it’s set to 4 [threads](/docs/core/connect-data-platform/connection-profiles#understanding-threads). Increase the thread count to increase model execution concurrency.
    - **Run source freshness** &mdash; Enable this option to invoke the `dbt source freshness` command before running this CI job. Refer to [Source freshness](/docs/deploy/source-freshness) for more details.

    <Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/ci-job-adv-settings.png" width="90%" title="Example of Advanced Settings on the CI Job page"/>


## Trigger a CI job with the API

If you're not using dbt Cloud’s native Git integration with [GitHub](/docs/cloud/git/connect-github), [GitLab](/docs/cloud/git/connect-gitlab), or [Azure DevOps](/docs/cloud/git/connect-azure-devops), you can use the [Administrative API](/docs/dbt-cloud-apis/admin-cloud-api) to trigger a CI job to run. However, dbt Cloud will not automatically delete the temporary schema for you. This is because automatic deletion relies on incoming webhooks from Git providers, which is only available through the native integrations.

### Prerequisites

- You have a dbt Cloud account.
- For the [Concurrent CI checks](/docs/deploy/continuous-integration#concurrent-ci-checks) and [Smart cancellation of stale builds](/docs/deploy/continuous-integration#smart-cancellation) features, your dbt Cloud account must be on the [Team or Enterprise plan](https://www.getdbt.com/pricing/).


1. Set up a CI job with the [Create Job](/dbt-cloud/api-v2#/operations/Create%20Job) API endpoint using `"job_type": ci` or from the [dbt Cloud UI](#set-up-ci-jobs).
1. Call the [Trigger Job Run](/dbt-cloud/api-v2#/operations/Trigger%20Job%20Run) API endpoint to trigger the CI job. You must include these fields to the payload:
   - Provide the pull request (PR) ID with one of these fields, even if you're using a different Git provider (like Bitbucket). This can make your code less human-readable but it will _not_ affect dbt functionality. 

      - `github_pull_request_id`
      - `gitlab_merge_request_id`
      - `azure_devops_pull_request_id` 
   - Provide the `git_sha` or `git_branch` to target the correct commit or branch to run the job against. 

## Example pull requests

The green checkmark means the dbt build and tests were successful. Clicking on the dbt Cloud section navigates you to the relevant CI run in dbt Cloud.

### GitHub pull request example

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/example-github-pr.png" width="70%" title="GitHub pull request example"/>

### GitLab pull request example

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/GitLab-Pipeline.png" width="70%" title="GitLab pull request"/>

### Azure DevOps pull request example

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/Enabling-CI/ADO CI Check.png" width="70%" title="Azure DevOps pull request"/>


## Troubleshooting

If you're experiencing any issues, review some of the common questions and answers below.

<details>
  <summary>Temporary schemas aren't dropping</summary>
  <div>
    <div>If your temporary schemas aren't dropping after a PR merges or closes, this typically indicates one of these issues:
      <ul>
        <li> You have overridden the <code>generate_schema_name</code> macro and it isn't using <code>dbt_cloud_pr_</code> as the prefix.<br></br><br></br> To resolve this, change your macro so that the temporary PR schema name contains the required prefix. For example:
    <br></br><br></br>
        ✅ Temporary PR schema name contains the prefix <code>dbt_cloud_pr_</code> (like <code>dbt_cloud_pr_123_456_marketing</code>). <br></br>
        ❌ Temporary PR schema name doesn't contain the prefix <code>dbt_cloud_pr_</code> (like <code>marketing</code>). <br></br>
        </li>
        <br/>
        <li>
          A macro is creating a schema but there are no dbt models writing to that schema. dbt Cloud doesn't drop temporary schemas that weren't written to as a result of running a dbt model.
        </li>
      </ul>
    </div>
  </div>
</details>
<details>
   <summary>Reconnecting your dbt project to use dbt Cloud's native integration with GitHub, GitLab, or Azure DevOps</summary>
   <div>
      <div>If your dbt project relies the generic git clone method that clones using SSH and deploy keys to connect to your dbt repo, you need to disconnect your repo and reconnect it using the native GitHub, GitLab, or Azure DevOps integration in order to enable dbt Cloud CI.<br></br><br></br>
      First, make sure you have the <a href="https://docs.getdbt.com/docs/cloud/git/connect-github">native GitHub authentication</a>, <a href="https://docs.getdbt.com/docs/cloud/git/connect-gitlab">native GitLab authentication</a>, or <a href="https://docs.getdbt.com/docs/cloud/git/connect-azure-devops">native Azure DevOps authentication</a> set up depending on which git provider you use. After you have gone through those steps, go to <strong>Account Settings</strong>, select <strong>Projects</strong> and click on the project you'd like to reconnect through native GitHub, GitLab, or Azure DevOps auth. Then click on the repository link.<br></br><br></br>
      
      Once you're in the repository page, select <strong>Edit</strong> and then <strong>Disconnect Repository</strong> at the bottom.<br></br>
         <Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/Enabling-CI/Disconnect-Repository.png" alt="Disconnect repo"/>
         <br></br>
         Confirm that you'd like to disconnect your repository. You should then see a new Configure a repository link in your old repository's place. Click through to the configuration page:<br></br>
         <Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/Enabling-CI/repo-config.png" alt="Configure repo"/>
         <br></br>
       
         Select the <b>GitHub</b>, <b>GitLab</b>, or <b>AzureDevOps</b> tab and reselect your repository. That should complete the setup of the project and enable you to set up a dbt Cloud CI job.</div>
   </div>
</details>
<details>
   <summary>Error messages that refer to schemas from previous PRs</summary>
   <div>
      <div>If you receive a schema-related error message referencing a <i>previous</i> PR, this is usually an indicator that you are not using a production job for your deferral and are instead using <i>self</i>.  If the prior PR has already been merged, the prior PR's schema may have been dropped by the time the CI job for the current PR is kicked off.<br></br> <br></br>
      
      To fix this issue, select a production job run to defer to instead of self.
      </div>
   </div>
</details>
<details>
   <summary>Production job runs failing at the <b>Clone Git Repository</b> step</summary>
   <div>
      <div>dbt Cloud can only check out commits that belong to the original repository. dbt Cloud <i>cannot</i> checkout commits that belong to a fork of that repository.<br></br><br></br>
      
      If you receive the following error message at the <b>Clone Git Repository</b> step of your job run:<br></br>
         <code>
         Error message:<br></br>
         Cloning into '/tmp/jobs/123456/target'...<br></br>
         Successfully cloned repository.<br></br>
         Checking out to e845be54e6dc72342d5a8f814c8b3316ee220312...<br></br>
         Failed to checkout to specified revision.<br></br>
         git checkout e845be54e6dc72342d5a8f814c8b3316ee220312<br></br>
         fatal: reference is not a tree: e845be54e6dc72342d5a8f814c8b3316ee220312<br></br>
         </code><br></br><br></br>
         
         Double-check that your PR isn't trying to merge using a commit that belongs to a fork of the repository attached to your dbt project.</div>
   </div>
</details>
<details>
   <summary>CI job not triggering for Virtual Private dbt users</summary>
   <div>
      <div>To trigger jobs on dbt Cloud using the <a href="https://docs.getdbt.com/docs/dbt-cloud-apis/admin-cloud-api">API</a>, your Git provider needs to connect to your dbt Cloud account.<br></br><br></br>
      
      If you're on a Virtual Private dbt Enterprise plan using security features like ingress PrivateLink or IP Allowlisting, registering CI hooks may not be available and can cause the job to fail silently.</div>
   </div>
</details>
