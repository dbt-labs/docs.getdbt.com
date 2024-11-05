---
title: "Continuous integration in dbt Cloud"
sidebar_label: "Continuous integration"
description: "You can set up continuous integration (CI) checks to test every single change prior to deploying the code to production just like in a software development workflow."
pagination_next: "docs/deploy/advanced-ci"
---

To implement a continuous integration (CI) workflow in dbt Cloud, you can set up automation that tests code changes by running [CI jobs](/docs/deploy/ci-jobs) before merging to production. dbt Cloud tracks the state of what’s running in your production environment so, when you run a CI job, only the modified data assets in your pull request (PR) and their downstream dependencies are built and tested in a staging schema. You can also view the status of the CI checks (tests) directly from within the PR; this information is posted to your Git provider as soon as a CI job completes. Additionally, you can enable settings in your Git provider that allow PRs only with successful CI checks be approved for merging.  

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/ci-workflow.png" width="90%" title="Workflow of continuous integration in dbt Cloud"/>

Using CI helps:

- Provide increased confidence and assurances that project changes will work as expected in production.
- Reduce the time it takes to push code changes to production, through build and test automation, leading to better business outcomes.
- Allow organizations to make code changes in a standardized and governed way that ensure code quality without sacrificing speed.

## How CI works

When you [set up CI jobs](/docs/deploy/ci-jobs#set-up-ci-jobs), dbt Cloud listens for notification from your Git provider indicating that a new PR has been opened or updated with new commits. When dbt Cloud receives one of these notifications, it enqueues a new run of the CI job.

dbt Cloud builds and tests models, semantic models, metrics, and saved queries affected by the code change in a temporary schema, unique to the PR. This process ensures that the code builds without error and that it matches the expectations as defined by the project's dbt tests. The unique schema name follows the naming convention `dbt_cloud_pr_<job_id>_<pr_id>` (for example, `dbt_cloud_pr_1862_1704`) and can be found in the run details for the given run, as shown in the following image:

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/using_ci_dbt_cloud.png" width="90%"title="Viewing the temporary schema name for a run triggered by a PR"/>

When the CI run completes, you can view the run status directly from within the pull request. dbt Cloud updates the pull request in GitHub, GitLab, or Azure DevOps with a status message indicating the results of the run. The status message states whether the models and tests ran successfully or not. 

dbt Cloud deletes the temporary schema from your <Term id="data-warehouse" /> when you close or merge the pull request. If your project has schema customization using the [generate_schema_name](/docs/build/custom-schemas#how-does-dbt-generate-a-models-schema-name) macro, dbt Cloud might not drop the temporary schema from your data warehouse. For more information, refer to [Troubleshooting](/docs/deploy/ci-jobs#troubleshooting).

## Differences between CI jobs and other deployment jobs

The [dbt Cloud scheduler](/docs/deploy/job-scheduler) executes CI jobs differently from other deployment jobs in these important ways:

- **Concurrent CI checks** &mdash; CI runs triggered by the same dbt Cloud CI job execute concurrently (in parallel), when appropriate.
- **Smart cancellation of stale builds** &mdash; Automatically cancels stale, in-flight CI runs when there are new commits to the PR.
- **Run slot treatment** &mdash; CI runs don't consume a run slot.
- **SQL linting**<Lifecycle status="beta" /> &mdash; When enabled, automatically lints all SQL files in your project as a run step before your CI job builds.

### Concurrent CI checks

When you have teammates collaborating on the same dbt project creating pull requests on the same dbt repository, the same CI job will get triggered. Since each run builds into a dedicated, temporary schema that’s tied to the pull request, dbt Cloud can safely execute CI runs _concurrently_ instead of _sequentially_ (differing from what is done with deployment dbt Cloud jobs). Because no one needs to wait for one CI run to finish before another one can start, with concurrent CI checks, your whole team can test and integrate dbt code faster.

Below describes the conditions when CI checks are run concurrently and when they’re not:  

- CI runs with different PR numbers execute concurrently. 
- CI runs with the _same_ PR number and _different_ commit SHAs execute serially because they’re building into the same schema. dbt Cloud will run the latest commit and cancel any older, stale commits. For details, refer to [Smart cancellation of stale builds](#smart-cancellation). 
- CI runs with the same PR number and same commit SHA, originating from different dbt Cloud projects will execute jobs concurrently. This can happen when two CI jobs are set up in different dbt Cloud projects that share the same dbt repository.

### Smart cancellation of stale builds

When you push a new commit to a PR, dbt Cloud enqueues a new CI run for the latest commit and cancels any CI run that is (now) stale and still in flight. This can happen when you’re pushing new commits while a CI build is still in process and not yet done. By cancelling runs in a safe and deliberate way, dbt Cloud helps improve productivity and reduce data platform spend on wasteful CI runs.

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/example-smart-cancel-job.png" width="70%" title="Example of an automatically canceled run"/>

### Run slot treatment <Lifecycle status="team,enterprise" />

CI runs don't consume run slots. This guarantees a CI check will never block a production run.

### SQL linting <Lifecycle status="beta" />

When enabled for your CI job, dbt invokes [SQLFluff](https://sqlfluff.com/) which is a modular and configurable SQL linter that warns you of complex functions, syntax, formatting, and compilation errors. By default, it lints all the changed SQL files in your project (compared to the last deferred production state). 

If the linter runs into errors, you can specify whether dbt should stop running the job on error or continue running it on error. When failing jobs, it helps reduce compute costs by avoiding builds for pull requests that don't meet your SQL code quality CI check. 

You can use [SQLFluff Configuration Files](https://docs.sqlfluff.com/en/stable/configuration/setting_configuration.html#configuration-files) to override the default linting behavior in dbt. Create an `.sqlfluff` configuration file in your project, add your linting rules to it, and dbt Cloud will use them when linting. For complete details, refer to [Custom Usage](https://docs.sqlfluff.com/en/stable/gettingstarted.html#custom-usage) in the SQLFluff documentation. 
