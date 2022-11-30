---
title: "dbt Cloud CI job"
id: "cloud-ci-job"
description: "You can enable continuous integration (CI) to test every single change prior to deploying the code to production just like in a software development workflow."
---

## Overview

dbt Cloud makes it easy to test every single code change you make prior to deploying that new logic into production. Once you've connected your [GitHub account](/docs/collaborate/git/connect-github), [GitLab account](/docs/collaborate/git/connect-gitlab), or [Azure DevOps account](/docs/collaborate/git/connect-azure-devops), you can configure jobs to run when new pull requests are opened against your dbt repo.

dbt Cloud will build the models affected by the new pull request code change in a temp schema, which acts as a quasi-staging environment, and will also run the tests that you've written for these models as a check. When the continuous integration (CI) job completes, the run status will be shown directly in the pull request. This makes it possible to deploy new code to production with confidence.

:::info Draft Pull Requests

Jobs will _not_ be triggered by draft pull requests. If you would like jobs to run on each new commit, please mark your pull request as **Ready for review**.

:::

:::info GitLab Compatibility

GitLab Webhooks are available to only GitLab users who have a paid or self-hosted GitLab account.

:::

:::info Common Errors
If you previously configured your dbt project by providing a generic git URL that clones using SSH, you need to [reconfigure the project](/docs/deploy/cloud-ci-job#reconnecting-your-dbt-project-to-use-dbt-clouds-native-integration-with-github-gitlab-or-azure-devops) to connect through dbt Cloud's native integration with GitHub, GitLab, or Azure DevOps instead.
:::

## Understanding dbt Cloud Slim CI
When a [dbt Cloud CI job is set up](/docs/deploy/cloud-ci-job#configuring-a-dbt-cloud-ci-job), dbt Cloud will listen for webhooks from GitHub, GitLab, or Azure DevOps indicating that a new PR has been opened or updated with new commits. When one of these webhooks is received, dbt Cloud will enqueue a new run of the CI job. Crucially, this run will build into a temporary schema using the prefix `dbt_cloud_pr_`. This schema isolation acts as a quasi-staging environment, so that you can see the builds resulting from the code associated with the PR's commit sha. The unique schema name can be found in the run details for the given run, as shown below.

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/using_ci_dbt_cloud.png" title="Viewing the temporary schema name for a run triggered by a PR"/>

After completing the dbt run, dbt Cloud will update the pull request in GitHub, GitLab, or Azure DevOps with a status message indicating the results of the run. The status message will state whether the models and tests ran successfully or not. You can enable a setting in your git provider that makes "successful pull request checks" a requirement to merge code. And finally, once the pull request is closed or merged, dbt Cloud will delete the temporary schema from your <Term id="data-warehouse" />.

### GitHub pull request example

The green checkmark means the dbt builds and tests were successful. The *Details* link shown here will navigate you to the relevant CI run in dbt Cloud.
<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/09c886f-Screen_Shot_2019-02-08_at_4.54.41_PM.png" title="GitHub pull request example"/>

### GitLab pull request example

The green checkmark means the dbt builds and tests were successful. Clicking the dbt Cloud pop up will navigate you to the relevant CI run in dbt Cloud.
<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/GitLab-Pipeline.png" title="GitLab pull request"/>

### Azure DevOps pull request example

The green checkmark means the dbt builds and tests were successful. Clicking on the dbt Cloud section navigates you to the relevant CI run in dbt Cloud.
<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/Enabling-CI/ADO CI Check.png" title="Azure DevOps pull request"/>

## Configuring a dbt Cloud CI job

Setting up a CI job is very similiar to setting up a normal production job that runs on a schedule; however, a CI job has some noteable differences.

There are a few components that define a Slim CI job.
- The Slim CI job must defer to a production job.
- The Slim CI job commands need to have a `state:modified+` selector to build only new or changed models and their downstream dependents. Importantly, state comparison can only happen when there is a deferred job selected to compare state to.
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

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/61536c9-Screen_Shot_2019-02-08_at_9.46.29_PM.png" title="Configuring webhooks for a dbt Cloud Job"/>

This tells dbt Cloud to run the job whenever a pull request or commit is made, rather than on a schedule. Be sure to turn the schedule of the job off if you don't want it to also run on a time-based cadence.



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

More example commands in [Pro-tips for workflows](/guides/legacy/best-practices.md#pro-tips-for-workflows).

## Limitations

If your temporary PR schemas aren't dropping after a merge or close of the PR, it's likely due to the below scenarios. Open and review the toggles below for recommendations on how to resolve this:

<details>
  <summary>You used dbt Cloud environment variables in your connection settings page </summary>
  <div>
    <div>To resolve this, remove environment variables in your <a href="https://docs.getdbt.com/docs/dbt-cloud/using-dbt-cloud/cloud-environment-variables">connections settings</a>.</div>
  </div>
</details>
<details>
  <summary>You have an empty/blank default schema</summary>
  <div>
    <div>To change this, edit and fill in your default schema.</div>
  </div>
</details>
<details>
  <summary>You have overridden the <code>generate_schema_name</code> macro</summary>
  <div>
    <div>To resolve this, change your macro so that the temporary PR schema name contains the default prefix and review the guidance below:
    <br></br>
      • ✅ Temporary PR schema name contains the prefix <code>dbt_cloud_pr_</code> (like <code>dbt_cloud_pr_123_456_marketing</code>) <br></br>
      • ❌ Temporary PR schema name doesn't contain the prefix <code>dbt_cloud_pr_</code> (like <code>marketing</code>). <br></br>
    </div>
  </div>
</details>
<details>
  <summary>You have overridden the <code>generate_database_name</code> macro</summary>
  <div>
    <div>If you assume that the project's default connection is to a database named <code>analytics</code>, review the guidance below to resolve this:
      <br></br>
       • ✅ Database remains the same as the connection default (like <code>analytics</code>) <br></br>
       • ❌ Database has changed from the default connection (like <code>dev</code>). <br></br>
    </div>
  </div>
</details>


Make the necessary changes to your project and double-check if the temporary PR schemas drop after a merge or close of the PR.

## Troubleshooting

### Reconnecting your dbt project to use dbt Cloud's native integration with GitHub, GitLab, or Azure DevOps

If your dbt project relies the generic git clone method that clones using SSH and deploy keys to connect to your dbt repo, you need to disconnect your repo and reconnect it using the native GitHub, GitLab, or Azure DevOps integration in order to enable dbt Cloud Slim CI.

First, make sure you have the [native GitHub authentication](/docs/collaborate/git/connect-github), [native GitLab authentication](/docs/collaborate/git/connect-gitlab), or [native Azure DevOps authentication](/docs/collaborate/git/connect-azure-devops) set up depending on which git provider you use. After you have gone through those steps, head to **Account Settings**, select **Projects** and click on the project you'd like to reconnect through native GitHub, GitLab, or Azure DevOps auth. Then click on the repository link.

Once you're in the repository page, click **Edit** and then click **Disconnect Repository** at the bottom.
<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/Enabling-CI/Disconnect-Repository.png" title="Disconnect repo"/>

Confirm that you'd like to disconnect your repository. You should then see a new **Configure a repository** link in your old repository's place. Click through to the configuration page:

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/Enabling-CI/repo-config.png" title="Configure repo"/>

Select the **GitHub**, **GitLab**, or **AzureDevOps** tab and reselect your repository. That should complete the setup of the project and enable you to set up a dbt Cloud CI job.

### Error messages that refer to schemas from previous PRs

If you receive a schema-related error message referencing a *previous* PR, this is usually an indicator that you are not using a production job for your deferral and are instead using *self*.  If the prior PR has already been merged, the prior PR's schema may have been dropped by the time the Slim CI job for the current PR is kicked off.

To fix this issue, select a production job run to defer to instead of self.


### Production job runs failing at the **Clone Git Repository** step

dbt Cloud can only checkout commits that belong to the original repository. dbt Cloud _cannot_ checkout commits that belong to a fork of that repository.

If you receive the following error message at the **Clone Git Repository** step of your job run:

```
Error message:
Cloning into '/tmp/jobs/123456/target'...
Successfully cloned repository.
Checking out to e845be54e6dc72342d5a8f814c8b3316ee220312...
Failed to checkout to specified revision.
git checkout e845be54e6dc72342d5a8f814c8b3316ee220312
fatal: reference is not a tree: e845be54e6dc72342d5a8f814c8b3316ee220312
```

Double-check that your PR isn't trying to merge using a commit that belongs to a fork of the repository attached to your dbt project.
