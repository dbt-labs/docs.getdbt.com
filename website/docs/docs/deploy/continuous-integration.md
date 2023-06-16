---
title: "Continuous integration in dbt Cloud"
sidebar_label: "Continuous integration"
description: "You can set up Slim continuous integration (CI) checks to test every single change prior to deploying the code to production just like in a software development workflow."
---

With the continuous integration (CI) workflow in dbt Cloud, you can set up automation that tests code changes by using [Slim CI jobs](/docs/deploy/slim-ci-jobs). dbt Cloud tracks the state of what’s running in your production environment so, when you run a Slim CI job, only the modified data assets in your pull request (PR) and their downstream dependencies are built and tested in a staging schema. You can also view the status of the CI checks (tests) directly from within the PR; this information is posted to your Git provider as soon as a Slim CI job completes. Additionally, the teams in your organization can enable settings with your Git provider that only allow PRs with successful CI checks be approved for merging.  

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/ci-workflow.png" width="90%" title="Workflow of continuous integration in dbt Cloud"/>

Using Slim CI helps:

- Provide increased confidence and assurances that project changes will work as expected in production.
- Reduce the time it takes to push code changes to production, through build and test automation, leading to better business outcomes.
- Allow organizations to make code changes in a standardized and governed way that ensure code quality without sacrificing speed.

## How Slim CI works

When you [set up Slim CI jobs](/docs/deploy/slim-ci-jobs#set-up-slim-ci-jobs), dbt Cloud listens for webhooks from your Git provider indicating that a new PR has been opened or updated with new commits. When dbt Cloud receives one of these webhooks, it enqueues a new run of the Slim CI job. If you want CI checks to run on each new commit, you need to mark your PR as **Ready for review** &mdash; draft PRs _don't_ trigger CI jobs. 

dbt Cloud builds and tests the models affected by the code change in a temporary schema, unique to the PR. This process ensures that the code builds without error and that it matches the expectations as defined by the project's dbt tests. The unique schema name follows the naming convention `dbt_cloud_pr_<job_id>_<pr_id>` (for example, `dbt_cloud_pr_1862_1704`) and can be found in the run details for the given run, as shown in the following image:

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/using_ci_dbt_cloud.png" width="90%"title="Viewing the temporary schema name for a run triggered by a PR"/>

When the Slim CI run completes, you can view the run status directly from within the pull request. dbt Cloud updates the pull request in GitHub, GitLab, or Azure DevOps with a status message indicating the results of the run. The status message states whether the models and tests ran successfully or not. 

dbt Cloud deletes the temporary schema from your <Term id="data-warehouse" /> when you close or merge the pull request. If your project has database or schema customization using the [generate_database_name](/docs/build/custom-databases#generate_database_name) or [generate_schema_name](/docs/build/custom-schemas#how-does-dbt-generate-a-models-schema-name) macros, dbt Cloud might not drop the temporary schema from your data warehouse. For more information, refer to [Temp PR schema limitations](#temp-pr-schema-limitations).

## Differences between Slim CI jobs and other deployment jobs

The [dbt Cloud scheduler](/docs/deploy/job-scheduler) executes Slim CI jobs differently from other deployment jobs in these important ways:

- **Concurrent CI checks** &mdash; Slim CI runs triggered by the same dbt Cloud Slim CI job execute concurrently (in parrallel), when appropriate
- **Smart cancellation of stale builds** &mdash; automatically cancels stale, in-flight Slim CI runs when there are new commits to the PR
- **Run slot treatment** &mdash; Slim CI runs don't consume a run slot

:::tip Join our beta
This functionality is currently in beta. If you're interested in joining our beta, please [contact us](mailto:support@getdbt.com) for access.

:::

### Concurrent CI checks

When you have teammates collaborating on the same dbt project creating pull requests on the same dbt repository, the same Slim CI job will get triggered. Since each run builds into a dedicated, temporary schema that’s tied to the pull request, dbt Cloud can safely execute Slim CI runs concurrently instead of sequentially (differing from what is done with deployment dbt Cloud jobs). Because no one needs to wait for a Slim CI run to finish before another one can start, with concurrent CI checks, your whole team can test and integrate dbt code faster.

Below describes the conditions when CI checks are run concurrently and when they’re not:  

- Slim CI runs with different PR numbers execute concurrently. 
- Slim CI runs with the _same_ PR number and _different_ commit SHAs execute serially because they’re building into the same schema. dbt Cloud will run the latest commit and cancel any older, stale commits. For details, refer to [Smart cancellation of stale builds](#smart-cancellation). 
- Slim CI runs with the same PR number and same commit SHA, but are from different dbt Cloud projects execute concurrently. This can happen when two CI jobs are set up in different dbt Cloud projects that share the same dbt repository.

### Smart cancellation of stale builds {#smart-cancellation}

When you push a new commit to a PR, dbt Cloud enqueues a new Slim CI run for the latest commit and cancels any Slim CI run that is (now) stale and still in flight. This can happen when you’re pushing new commits while a CI build is still in process and not yet done. By cancelling runs in a safe and deliberate way, dbt Cloud helps improve productivity and reduce data platform spend on wasteful CI runs.

### Run slot treatment

Your Slim CI runs don't consume run slots so a CI check will not block a production run.


