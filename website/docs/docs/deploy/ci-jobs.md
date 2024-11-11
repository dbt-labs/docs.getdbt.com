---
title: "Continuous integration jobs in dbt Cloud"
sidebar_label: "CI jobs"
description: "Learn how to create and set up CI checks to test code changes before deploying to production."
---

You can set up [continuous integration](/docs/deploy/continuous-integration) (CI) jobs to run when someone opens a new pull request (PR) in your dbt Git repository. By running and testing only _modified_ models, dbt Cloud ensures these jobs are as efficient and resource conscientious as possible on your data platform.

## Set up CI jobs {#set-up-ci-jobs}

dbt Labs recommends that you create your CI job in a dedicated dbt Cloud [deployment environment](/docs/deploy/deploy-environments#create-a-deployment-environment) that's connected to a staging database. Having a separate environment dedicated for CI will provide better isolation between your temporary CI schema builds and your production data builds. Additionally, sometimes teams need their CI jobs to be triggered when a PR is made to a branch other than main. If your team maintains a staging branch as part of your release process, having a separate environment will allow you to set a [custom branch](/faqs/Environments/custom-branch-settings) and, accordingly, the CI job in that dedicated environment will be triggered only when PRs are made to the specified custom branch. To learn more, refer to [Get started with CI tests](/guides/set-up-ci).

### Prerequisites
- You have a dbt Cloud account. 
- CI features:
   - For both the [concurrent CI checks](/docs/deploy/continuous-integration#concurrent-ci-checks) and [smart cancellation of stale builds](/docs/deploy/continuous-integration#smart-cancellation) features, your dbt Cloud account must be on the [Team or Enterprise plan](https://www.getdbt.com/pricing/).
   - The [SQL linting](/docs/deploy/continuous-integration#sql-linting) feature is currently available in [beta](/docs/dbt-versions/product-lifecycles#dbt-cloud) to a limited group of users and is gradually being rolled out. If you're in the beta, the **Linting** option is available for use. 
- [Advanced CI](/docs/deploy/advanced-ci) features:
   - For the [compare changes](/docs/deploy/advanced-ci#compare-changes) feature, your dbt Cloud account must be on the [Enterprise plan](https://www.getdbt.com/pricing/) and have enabled Advanced CI features. Please ask your [dbt Cloud administrator to enable](/docs/cloud/account-settings#account-access-to-advanced-ci-features) this feature for you. After enablement, the **dbt compare** option becomes available in the CI job settings.
- Set up a [connection with your Git provider](/docs/cloud/git/git-configuration-in-dbt-cloud). This integration lets dbt Cloud run jobs on your behalf for job triggering.
   - If you're using a native [GitLab](/docs/cloud/git/connect-gitlab) integration, you need a paid or self-hosted account that includes support for GitLab webhooks and [project access tokens](https://docs.gitlab.com/ee/user/project/settings/project_access_tokens.html). If you're using GitLab Free, merge requests will trigger CI jobs but CI job status updates (success or failure of the job) will not be reported back to GitLab.


To make CI job creation easier, many options on the **CI job** page are set to default values that dbt Labs recommends that you use. If you don't want to use the defaults, you can change them.

1. On your deployment environment page, click **Create job** > **Continuous integration job** to create a new CI job. 

2. Options in the **Job settings** section:
    - **Job name** &mdash; Specify the name for this CI job.
    - **Description** &mdash; Provide a description about the CI job.
    - **Environment** &mdash; By default, this will be set to the environment you created the CI job from. Use the dropdown to change the default setting. 

3. Options in the **Git trigger** section:
    - **Triggered by pull requests** &mdash; By default, it’s enabled. Every time a developer opens up a pull request or pushes a commit to an existing pull request, this job will get triggered to run.
      - **Run on draft pull request** &mdash; Enable this option if you want to also trigger the job to run every time a developer opens up a draft pull request or pushes a commit to that draft pull request. 

4. Options in the **Execution settings** section:
    - **Commands** &mdash; By default, this includes the `dbt build --select state:modified+` command. This informs dbt Cloud to build only new or changed models and their downstream dependents. Importantly, state comparison can only happen when there is a deferred environment selected to compare state to. Click **Add command** to add more [commands](/docs/deploy/job-commands)  that you want to be invoked when this job runs.
    - **Linting**<Lifecycle status="beta" /> &mdash; Enable this option for dbt to [lint the SQL files](/docs/deploy/continuous-integration#sql-linting) in your project as the first step in `dbt run`. If this check runs into an error, dbt can either **Stop running on error** or **Continue running on error**. 
    - **dbt compare**<Lifecycle status="enterprise" /> &mdash; Enable this option to compare the last applied state of the production environment (if one exists) with the latest changes from the pull request, and identify what those differences are. To enable record-level comparison and primary key analysis, you must add a [primary key constraint](/reference/resource-properties/constraints) or [uniqueness test](/reference/resource-properties/data-tests#unique). Otherwise, you'll receive a "Primary key missing" error message in dbt Cloud.
    
      To review the comparison report, navigate to the [Compare tab](/docs/deploy/run-visibility#compare-tab) in the job run's details. A summary of the report is also available from the pull request in your Git provider (see the [CI report example](#example-ci-report)). 
    - **Compare changes against an environment (Deferral)** &mdash; By default, it’s set to the **Production** environment if you created one. This option allows dbt Cloud to check the state of the code in the PR against the code running in the deferred environment, so as to only check the modified code, instead of building the full table or the entire DAG.

      :::info
      Older versions of dbt Cloud only allow you to defer to a specific job instead of an environment. Deferral to a job compares state against the project code that was run in the deferred job's last successful run. Deferral to an environment is more efficient as dbt Cloud will compare against the project representation (which is stored in the `manifest.json`) of the last successful deploy job run that executed in the deferred environment. By considering _all_ [deploy jobs](/docs/deploy/deploy-jobs) that run in the deferred environment, dbt Cloud will get a more accurate, latest project representation state.
      :::

    - **Run timeout** &mdash; Cancel the CI job if the run time exceeds the timeout value. You can use this option to help ensure that a CI check doesn't consume too much of your warehouse resources. If you enable the **dbt compare** option, the timeout value defaults to `3600` (one hour) to prevent long-running comparisons. 


5. (optional) Options in the **Advanced settings** section: 
    - **Environment variables** &mdash; Define [environment variables](/docs/build/environment-variables) to customize the behavior of your project when this CI job runs. You can specify that a CI job is running in a _Staging_ or _CI_ environment by setting an environment variable and modifying your project code to behave differently, depending on the context. It's common for teams to process only a subset of data for CI runs, using environment variables to branch logic in their dbt project code.
    - **Target name** &mdash; Define the [target name](/docs/build/custom-target-names). Similar to **Environment Variables**, this option lets you customize the behavior of the project. You can use this option to specify that a CI job is running in a _Staging_ or _CI_ environment by setting the target name and modifying your project code to behave differently, depending on the context. 
    - **dbt version** &mdash; By default, it’s set to inherit the [dbt version](/docs/dbt-versions/core) from the environment. dbt Labs strongly recommends that you don't change the default setting. This option to change the version at the job level is useful only when you upgrade a project to the next dbt version; otherwise, mismatched versions between the environment and job can lead to confusing behavior.
    - **Threads** &mdash; By default, it’s set to 4 [threads](/docs/core/connect-data-platform/connection-profiles#understanding-threads). Increase the thread count to increase model execution concurrency.
   - **Generate docs on run** &mdash; Enable this if you want to [generate project docs](/docs/collaborate/build-and-view-your-docs) when this job runs. This is disabled by default since testing doc generation on every CI check is not a recommended practice.
    - **Run source freshness** &mdash; Enable this option to invoke the `dbt source freshness` command before running this CI job. Refer to [Source freshness](/docs/deploy/source-freshness) for more details.

   <Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/create-ci-job.png" width="90%" title="Example of CI Job page in the dbt Cloud UI"/>

### Example of CI check in pull request {#example-ci-check}
The following is an example of a CI check in a GitHub pull request. The green checkmark means the dbt build and tests were successful. Clicking on the dbt Cloud section takes you to the relevant CI run in dbt Cloud.

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/example-github-pr.png" width="60%" title="Example of CI check in GitHub pull request"/>

### Example of CI report in pull request <Lifecycle status="preview" /> {#example-ci-report}
The following is an example of a CI report in a GitHub pull request, which is shown when the **dbt compare** option is enabled for the CI job. It displays a high-level summary of the models that changed from the pull request.

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/example-github-ci-report.png" width="75%" title="Example of CI report comment in GitHub pull request"/>

## Trigger a CI job with the API

If you're not using dbt Cloud’s native Git integration with [GitHub](/docs/cloud/git/connect-github), [GitLab](/docs/cloud/git/connect-gitlab), or [Azure DevOps](/docs/cloud/git/connect-azure-devops), you can use the [Administrative API](/docs/dbt-cloud-apis/admin-cloud-api) to trigger a CI job to run. However, dbt Cloud will not automatically delete the temporary schema for you. This is because automatic deletion relies on incoming webhooks from Git providers, which is only available through the native integrations.

### Prerequisites

- You have a dbt Cloud account.
- For the [Concurrent CI checks](/docs/deploy/continuous-integration#concurrent-ci-checks) and [Smart cancellation of stale builds](/docs/deploy/continuous-integration#smart-cancellation) features, your dbt Cloud account must be on the [Team or Enterprise plan](https://www.getdbt.com/pricing/).


1. Set up a CI job with the [Create Job](/dbt-cloud/api-v2#/operations/Create%20Job) API endpoint using `"job_type": ci` or from the [dbt Cloud UI](#set-up-ci-jobs).
1. Call the [Trigger Job Run](/dbt-cloud/api-v2#/operations/Trigger%20Job%20Run) API endpoint to trigger the CI job. You must include both of these fields to the payload:
   - Provide the pull request (PR) ID using one of these fields:

      - `github_pull_request_id`
      - `gitlab_merge_request_id`
      - `azure_devops_pull_request_id`
      - `non_native_pull_request_id` (for example, BitBucket)
   - Provide the `git_sha` or `git_branch` to target the correct commit or branch to run the job against. 

## Semantic validations in CI  <Lifecycle status="team,enterprise" />

Automatically test your semantic nodes (metrics, semantic models, and saved queries) during code reviews by adding warehouse validation checks in your CI job, guaranteeing that any code changes made to dbt models don't break these metrics. 

To do this, add the command `dbt sl validate --select state:modified+` in the CI job. This ensures the validation of modified semantic nodes and their downstream dependencies.

- Testing semantic nodes in a CI job supports deferral and selection of semantic nodes.
- It allows you to catch issues early in the development process and deliver high-quality data to your end users.
- Semantic validation executes an explain query in the data warehouse for semantic nodes to ensure the generated SQL will execute.
- For semantic nodes and models that aren't downstream of modified models, dbt Cloud defers to the production models

To learn how to set this up, refer to the following steps:

1. Navigate to the **Job setting** page and click **Edit**.
2. Add the `dbt sl validate --select state:modified+` command under **Commands** in the **Execution settings** section. The command uses state selection and deferral to run validation on any semantic nodes downstream of model changes. To reduce job times, we recommend only running CI on modified semantic models.
3. Click **Save** to save your changes.

There are additional commands and use cases described in the [next section](#use-cases), such as validating all semantic nodes, validating specific semantic nodes, and so on.

<Lightbox src="/img/docs/dbt-cloud/deployment/ci-dbt-sl-validate-downstream.jpg" width="90%" title="Validate semantic nodes downstream of model changes in your CI job." />

### Use cases

Use or combine different selectors or commands to validate semantic nodes in your CI job. Semantic validations in CI supports the following use cases:

<Expandable alt_header="Semantic nodes downstream of model changes (recommended)" > 

To validate semantic nodes that are downstream of a model change, add the two commands in your job **Execution settings** section:

```bash
dbt build --select state:modified+
dbt sl validate --select state:modified+
```

- The first command builds the modified models.
- The second command validates the semantic nodes downstream of the modified models.

Before running semantic validations, dbt Cloud must build the modified models. This process ensures that downstream semantic nodes are validated using the CI schema through the dbt Semantic Layer API. 

For semantic nodes and models that aren't downstream of modified models, dbt Cloud defers to the production models.

<Lightbox src="/img/docs/dbt-cloud/deployment/ci-dbt-sl-validate-downstream.jpg" width="90%" title="Validate semantic nodes downstream of model changes in your CI job." />

</Expandable>

<Expandable alt_header="Semantic nodes that are modified or affected by downstream modified nodes.">

To only validate modified semantic nodes, use the following command (with [state selection](/reference/node-selection/syntax#stateful-selection)):

```bash
dbt sl validate --select state:modified+
```

<Lightbox src="/img/docs/dbt-cloud/deployment/ci-dbt-sl-validate-modified.jpg" width="90%" title="Use state selection to validate modified metric definition models in your CI job." />

This will only validate semantic nodes. It will use the defer state set configured in your orchestration job, deferring to your production models.

</Expandable>

<Expandable alt_header="Select specific semantic nodes">

Use the selector syntax to select the _specific_ semantic node(s) you want to validate:

```bash
dbt sl validate --select metric:revenue
```

<Lightbox src="/img/docs/dbt-cloud/deployment/ci-dbt-sl-validate-select.jpg" width="90%" title="Use state selection to validate modified metric definition models in your CI job." />

In this example, the CI job will validate the selected `metric:revenue` semantic node. To select multiple semantic nodes, use the selector syntax: `dbt sl validate --select metric:revenue metric:customers`.

If you don't specify a selector, dbt Cloud will validate all semantic nodes in your project.

</Expandable>

<Expandable alt_header="Select all semantic nodes">

To validate _all_ semantic nodes in your project, add the following command to defer to your production schema when generating the warehouse validation queries:

   ```bash
   dbt sl validate
   ```

<Lightbox src="/img/docs/dbt-cloud/deployment/ci-dbt-sl-validate-all.jpg" width="90%" title="Validate all semantic nodes in your CI job by adding the command: 'dbt sl validate' in your job execution settings." />

</Expandable>

## Troubleshooting

<DetailsToggle alt_header="Temporary schemas aren't dropping">
If your temporary schemas aren't dropping after a PR merges or closes, this typically indicates one of these issues:
- You have overridden the <code>generate_schema_name</code> macro and it isn't using <code>dbt_cloud_pr_</code> as the prefix.

To resolve this, change your macro so that the temporary PR schema name contains the required prefix. For example:

- ✅ Temporary PR schema name contains the prefix <code>dbt_cloud_pr_</code> (like <code>dbt_cloud_pr_123_456_marketing</code>).
- ❌ Temporary PR schema name doesn't contain the prefix <code>dbt_cloud_pr_</code> (like <code>marketing</code>).

A macro is creating a schema but there are no dbt models writing to that schema. dbt Cloud doesn't drop temporary schemas that weren't written to as a result of running a dbt model.

</DetailsToggle>

<DetailsToggle alt_header="Error messages that refer to schemas from previous PRs">

If you receive a schema-related error message referencing a <i>previous</i> PR, this is usually an indicator that you are not using a production job for your deferral and are instead using <i>self</i>.  If the prior PR has already been merged, the prior PR's schema may have been dropped by the time the CI job for the current PR is kicked off.

To fix this issue, select a production job run to defer to instead of self.

</DetailsToggle>

<DetailsToggle alt_header="Production job runs failing at the 'Clone Git Repository step'">

dbt Cloud can only check out commits that belong to the original repository. dbt Cloud <i>cannot</i> checkout commits that belong to a fork of that repository.

If you receive the following error message at the **Clone Git Repository** step of your job run:

```
Error message:
Cloning into '/tmp/jobs/123456/target'...
Successfully cloned repository.
Checking out to e845be54e6dc72342d5a8f814c8b3316ee220312...>
Failed to checkout to specified revision.
git checkout e845be54e6dc72342d5a8f814c8b3316ee220312
fatal: reference is not a tree: e845be54e6dc72342d5a8f814c8b3316ee220312
```

Double-check that your PR isn't trying to merge using a commit that belongs to a fork of the repository attached to your dbt project.
</DetailsToggle>

<DetailsToggle alt_header="CI job not triggering for Virtual Private dbt users"> 

To trigger jobs on dbt Cloud using the [API](https://docs.getdbt.com/docs/dbt-cloud-apis/admin-cloud-api), your Git provider needs to connect to your dbt Cloud account.

If you're on a Virtual Private dbt Enterprise plan using security features like ingress PrivateLink or IP Allowlisting, registering CI hooks may not be available and can cause the job to fail silently.
</DetailsToggle>

<DetailsToggle alt_header="PR status for CI job stays in 'pending' in Azure DevOps after job run finishes">

When you start a CI job, the pull request status should show as `pending` while it waits for an update from dbt. Once the CI job finishes, dbt sends the status to Azure DevOps (ADO), and the status will change to either `succeeded` or `failed`. 

If the status doesn't get updated after the job runs, check if there are any git branch policies in place blocking ADO from receiving these updates. 

One potential issue is the **Reset conditions** under **Status checks** in the ADO repository branch policy. If you enable the **Reset status whenever there are new changes** checkbox (under **Reset conditions**), it can prevent dbt from updating ADO about your CI job run status.
You can find relevant information here:
- [Azure DevOps Services Status checks](https://learn.microsoft.com/en-us/azure/devops/repos/git/branch-policies?view=azure-devops&tabs=browser#status-checks)
- [Azure DevOps Services Pull Request Stuck Waiting on Status Update](https://support.hashicorp.com/hc/en-us/articles/18670331556627-Azure-DevOps-Services-Pull-Request-Stuck-Waiting-on-Status-Update-from-Terraform-Cloud-Enterprise-Run)
- [Pull request status](https://learn.microsoft.com/en-us/azure/devops/repos/git/pull-request-status?view=azure-devops#pull-request-status)

</DetailsToggle>
