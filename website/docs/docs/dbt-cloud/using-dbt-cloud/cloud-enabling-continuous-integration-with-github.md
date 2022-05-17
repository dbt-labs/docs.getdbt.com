---
title: "Enabling CI"
id: "cloud-enabling-continuous-integration"
description: "You can enable CI to test every single change prior to deploying the code to production just like in a software development workflow."
---

## Overview

dbt Cloud makes it easy to test every single change you make prior to deploying that code into production. Once you've [connected your GitHub account](cloud-installing-the-github-application) or [your GitLab account](connecting-gitlab), you can configure jobs to run when new Pull Requests (referred to as Merge Requests in GitLab) are opened against your dbt repo. When these jobs complete, their statuses will be shown directly in the Pull Request. This makes it possible to deploy new code to production with confidence.

:::info Draft Pull Requests

Jobs will _not_ be triggered by draft Pull Requests. If you would like jobs to run on each new commit, please mark your Pull Request as `Ready for review`.

:::

:::info GitLab Webhooks Compatability and Availability 

If you previously configured your dbt project by providing a GitLab git URL, you need to reconfigure the repository to connect through [native GitLab authentication](connecting-gitlab), as we cannot enable webhooks for your project through SSH.

GitLab Webhooks are available to only GitLab users who have a paid or self-hosted GitLab account.

:::

GitHub Example:
<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/09c886f-Screen_Shot_2019-02-08_at_4.54.41_PM.png" title="The green checkmark means this PR is ready to be merged. The 'details' link shown here will navigate you to the relevant run in dbt Cloud."/>

GitLab Example:
<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/GitLab-Pipeline.png" title="The green checkmark means this MR is ready to be merged. The 'dbt Cloud' pop up shown here will navigate you to the relevant run in dbt Cloud."/>

## Enabling Continuous Integration (CI)

To enable runs on Pull Requests, navigate to the Job Settings page for the relevant job. In the "Triggers" section of the page, switch to the "Webhooks" tab, and then click the checkbox next to `RUN ON PULL REQUESTS?` as shown below.

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/61536c9-Screen_Shot_2019-02-08_at_9.46.29_PM.png" title=""/>


## Understanding CI in dbt Cloud

When Pull Request builds are enabled, dbt Cloud will listen for webhooks from GitHub or GitLab indicating that a new PR has been opened or updated with new commits. When one of these webhooks is received, dbt Cloud will enqueue a new run of the specified job. Crucially, this run will be configured to build into a special, [temporary schema](building-models/using-custom-schemas) using the prefix `dbt_cloud`. The name of these temporary schemas will be unique for each PR, and is shown in the Run Details page for the given run. This temporary schema will allow you to inspect the relations built by dbt Cloud, directly in your data warehouse.

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/using_ci_dbt_cloud.png" title="Viewing the temporary schema name for a run triggered by a PR"/>

When the run is complete, dbt Cloud will update the PR in GitHub or MR in GitLab with a status message indicating the results of the run. Once the PR is closed or merged, dbt Cloud will delete the temporary schema from your data warehouse.

## Slim CI

With Slim CI, you don't have to rebuild and test all your models. You can instruct dbt Cloud to run jobs on only modified or new resources.

When creating or editing a job in dbt Cloud, you can set your execution settings to defer to a previous run state. Use the drop menu to select which **production** job you want to defer to. 

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/ci-deferral.png" title="Jobs that run
on pull requests can select another job from the same project for deferral and comparison"/>

When a job is selected, dbt Cloud will surface the artifacts from that job's most recent successful run. dbt will then use those artifacts to determine the set of new and modified resources. In your job commands, you can signal to dbt to run only on these modified resources and their children by including the `state:modified+` argument. 

As example:

```
dbt seed --select state:modified+
dbt run --select state:modified+
dbt test --select state:modified+
```

Because dbt Cloud manages deferral and state environment variables, there is no need to specify `--defer` or `--state` flags. **Note:** Both jobs need to be running dbt v0.18.0 or newer.


To learn more about state comparison and deferral in dbt, read the docs on [state](understanding-state).

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

### Reconnecting your dbt project to use a native GitHub or GitLab repo 

If your dbt project relies on a Git URL and SSH to connect to your GitHub or GitLab repo, you need to disconnect your repo and reconnect it with native Github or GitLab auth in order to enable webhooks. 

First, make sure you have [native GitHub authentication](cloud-installing-the-github-application) or [native GitLab authentication](connecting-gitlab) set up. After you have gone through those steps, head to `Account Settings` -> `Projects` and click on the project you'd like to reconnect through native GitHub or GitLab auth. Then click on the repository link. 

Once you're in the repository page, you can click the `Edit` button and then the `Disconnect Repository` button at the bottom.
<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/Enabling-CI/Disconnect-Repository.png" title="Disconnect repo"/>

Confirm that you'd like to disconnect your repository. You should then see a new `Configure a repository` link in your old repository's place. Click through to the configuration page, which will look like this:

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/Enabling-CI/repo-config.png" title="Configure repo"/>

Select the `GitHub` or `GitLab` tab and reselect your repository. That should complete the setup and enable you to use webhooks in your jobs configuration.

### Error messages that refer to schemas from previous PRs

If you receive a schema-related error message referencing a *previous* PR, this is usually an indicator that you are not using a production job for your deferral and are instead using *self*.  If the prior PR has already been merged, the prior PR's schema may have been dropped by the time the Slim CI job for the current PR is kicked off.

To fix this issue, select a production job run to defer to instead of self.
