---
title: "Enabling Continuous Integration (CI)"
id: "cloud-enabling-continuous-integration"
description: "You can enable CI to test every single change prior to deploying the code to production just like in a software development workflow."
---

## Overview

dbt Cloud makes it easy to test every single code change you make prior to deploying that new logic into production. Once you've connected your [GitHub account](cloud-installing-the-github-application), [GitLab account](connecting-gitlab), or [Azure DevOps account](connecting-azure-devops), you can configure jobs to run when new pull requests are opened against your dbt repo. 

dbt Cloud will build the models affected by the new pull request code change in a temp schema, which acts as a quasi-staging environment, and will also run the tests that you've written for these models as a check. When the CI job completes, the run status will be shown directly in the pull request. This makes it possible to deploy new code to production with confidence.

:::info Draft Pull Requests

Jobs will _not_ be triggered by draft pull requests. If you would like jobs to run on each new commit, please mark your pull request as **Ready for review**.

:::

:::info GitLab Compatability

GitLab Webhooks are available to only GitLab users who have a paid or self-hosted GitLab account.

:::

:::info Common Errors
If you previously configured your dbt project by providing a generic git URL that clones using SSH, you need to [reconfigure the project](cloud-enabling-continuous-integration#reconnecting-your-dbt-project-to-use-dbt-clouds-native-integration-with-github-gitlab-or-azure-devops) to connect through dbt Cloud's native integration with GitHub, GitLab, or Azure DevOps instead.
:::

## Understanding dbt Cloud Slim CI 
When a [dbt Cloud CI job is set up](cloud-enabling-continuous-integration#configuring-a-dbt-cloud-ci-job), dbt Cloud will listen for webhooks from GitHub, GitLab, or Azure DevOps indicating that a new PR has been opened or updated with new commits. When one of these webhooks is received, dbt Cloud will enqueue a new run of the CI job. Crucially, this run will build into a temporary schema using the prefix `dbt_cloud_pr_`. This schema isolation acts as a quasi-staging environment, so that you can see the builds resulting from the code associated with the PR's commit sha. The unique schema name can be found in the run details for the given run, as shown below.

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/using_ci_dbt_cloud.png" title="Viewing the temporary schema name for a run triggered by a PR"/>

When the run is complete, dbt Cloud will update the PR in GitHub, GitLab, or Azure DevOps with a status message indicating the results of the run, letting you know if the models and tests ran successfully or not. And finally, once the pull request is closed or merged, dbt Cloud will delete the temporary schema from your data warehouse.

GitHub Example:
<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/09c886f-Screen_Shot_2019-02-08_at_4.54.41_PM.png" title="The green checkmark means the dbt builds and tests were successful. The 'details' link shown here will navigate you to the relevant CI run in dbt Cloud."/>

GitLab Example:
<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/GitLab-Pipeline.png" title="The green checkmark means the dbt builds and tests were successful. The 'dbt Cloud' pop up shown here will navigate you to the relevant CI run in dbt Cloud."/>

Azure DevOps Example:
<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/Enabling-CI/ADO CI.png" title="The green checkmark means the dbt builds and tests were successful. The pipeline link will navigate you to the relevant CI run in dbt Cloud."/>

## Configuring a dbt Cloud CI job

Setting up a CI job is very similiar to setting up a normal production job that runs on a schedule; however, a CI job has some noteable differences.

There are a few components that define a Slim CI job.
- The Slim CI job must defer to a production job.
- The Slim CI job commands need to have a `state:modified+` selector to build only new or changed models and their downstream dependents. Importantly, state comparison can only happen when there is a deferred job seleted to compare state to.
- The Slim CI job must be triggered by pull request.

#### Deferral and State Comparison  

When creating a job in dbt Cloud, you can set your execution settings to defer to a previous run state. Use the dropdown menu to select which *production* job you want to defer to. 

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/ci-deferral.png" title="Jobs that run
on pull requests can select another job from the same project for deferral and comparison"/>

When a job is selected, dbt Cloud will look at the artifacts from that job's most recent successful run. dbt will then use those artifacts to determine the set of new and modified resources. 

In your job commands, you can signal to dbt to run only on these modified resources and their children by including the `state:modified+` argument. 

As example:

```
dbt build --select state:modified+
```

Because dbt Cloud manages deferral and state environment variables, there is no need to specify `--defer` or `--state` flags. **Note:** Both jobs need to be running dbt v0.18.0 or later.


To learn more about state comparison and deferral in dbt, read the docs on [state](understanding-state).

#### Using a webhook trigger 

In the **Triggers** section of the jobs settings, switch to the **Webhooks** tab, and then check the box next to **Run on Pull Requests?** as shown below.

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/61536c9-Screen_Shot_2019-02-08_at_9.46.29_PM.png" title=""/>

This will instruct dbt Cloud to run the job whenever a pull request or commit is made, rather than on a schedule. Be sure to turn the schedule of the job off if you don't want it to also run on a time-based cadence.



## Fresh Rebuilds

As an extension of the Slim CI feature, dbt Cloud can rerun and retest only the things that are fresher compared to a previous run.

<VersionBlock lastVersion="1.0">

Only supported by v1.1 or newer.

</VersionBlock>

<VersionBlock firstVersion="1.1">

Only supported by v1.1 or newer.

:::caution Experimental functionality
The `source_status` selection is experimental and subject to change. During this time, ongoing improvements may limit this feature’s availability and cause breaking changes to its functionality.
:::

When a job is selected, dbt Cloud will surface the artifacts from that job's most recent successful run. dbt will then use those artifacts to determine the set of fresh sources. In your job commands, you can signal to dbt to run and test only on these fresher sources and their children by including the `source_status:fresher+` argument. This requires both previous and current state to have the `sources.json` artifact be available. Or plainly said, both job states need to run `dbt source freshness`.

As example:
```bash
# Command step order
dbt source freshness
dbt build --select source_status:fresher+
```
</VersionBlock>

More example commands in [Pro-tips for workflows](/docs/guides/best-practices.md#pro-tips-for-workflows).

## Troubleshooting

### Reconnecting your dbt project to use dbt Cloud's native integration with GitHub, GitLab, or Azure DevOps

If your dbt project relies the generic git clone method that clones using SSH and deploy keys to connect to your dbt repo, you need to disconnect your repo and reconnect it using the native GitHub, GitLab, or Azure DevOps integration in order to enable dbt Cloud Slim CI. 

First, make sure you have the [native GitHub authentication](cloud-installing-the-github-application), [native GitLab authentication](connecting-gitlab), or [native Azure DevOps authentication](connecting-azure-devops) set up depending on which git provider you use. After you have gone through those steps, head to **Account Settings**, select **Projects** and click on the project you'd like to reconnect through native GitHub, GitLab, or Azure DevOps auth. Then click on the repository link. 

Once you're in the repository page, you can click the **Edit** button and then the **Disconnect Repository** button at the bottom.
<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/Enabling-CI/Disconnect-Repository.png" title="Disconnect repo"/>

Confirm that you'd like to disconnect your repository. You should then see a new **Configure a repository** link in your old repository's place. Click through to the configuration page:

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/Enabling-CI/repo-config.png" title="Configure repo"/>

Select the **GitHub**, **GitLab**, or **AzureDevOps** tab and reselect your repository. That should complete the setup of the project and enable you to set up a dbt Cloud CI job.

### Error messages that refer to schemas from previous PRs

If you receive a schema-related error message referencing a *previous* PR, this is usually an indicator that you are not using a production job for your deferral and are instead using *self*.  If the prior PR has already been merged, the prior PR's schema may have been dropped by the time the Slim CI job for the current PR is kicked off.

To fix this issue, select a production job run to defer to instead of self.
