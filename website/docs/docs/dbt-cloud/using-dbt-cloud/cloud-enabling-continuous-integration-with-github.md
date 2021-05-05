---
title: "Enabling CI"
id: "cloud-enabling-continuous-integration-with-github"
---

## Overview

dbt Cloud makes it easy to test every single change you make prior to deploying that code into production. Once you've [connected your GitHub account](cloud-installing-the-github-application), you can configure jobs to run when new Pull Requests are opened against your dbt repo. When these jobs complete, their statuses will be shown directly in the Pull Request. This makes it possible to deploy new code to production with confidence.

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/09c886f-Screen_Shot_2019-02-08_at_4.54.41_PM.png" title="The green checkmark means this PR is ready to be merged. The 'details' link shown here will navigate you to the relevant run in dbt Cloud."/>

## Enabling Continuous Integration (CI)

To enable runs on Pull Requests, navigate to the Job Settings page for the relevant job. In the "Triggers" section of the page, switch to the "Webhooks" tab, and then click the checkbox labeled "run on pull requests?" as shown below.

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/61536c9-Screen_Shot_2019-02-08_at_9.46.29_PM.png" title=""/>


## Understanding CI in dbt Cloud

When Pull Request builds are enabled, dbt Cloud will listen for webhooks from GitHub indicating that a new PR has been opened or updated with new commits. When one of these webhooks is received, dbt Cloud will enqueue a new run of the specified job. Crucially, this run will be configured to build into a special, [temporary schema](building-models/using-custom-schemas) using the prefix `dbt_cloud`. The name of these temporary schemas will be unique for each PR, and is shown in the Run Details page for the given run.

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/using_ci_dbt_cloud.png" title="Viewing the temporary schema name for a run triggered by a PR"/>

When the run is complete, dbt Cloud will update the PR in GitHub with a status message indicating the results of the run. The temporary schema created for the run will remain in your warehouse until the PR is closed, allowing you to inspect the relations built by dbt Cloud. Once the PR is closed, dbt Cloud will delete the temporary schema.

## Defer to a Production Job

:::info [β] Preview Feature
This is a preview feature in dbt Cloud that depends on net-new functionality in  dbt v0.18.0. If you would like to enable this feature in your dbt Cloud account, please contact support.
:::

If a job is selected, dbt Cloud will surface the artifacts from its most recent successful run. dbt will then use those artifacts to determine the set of new and modified resources. Your job definition can include steps like:

```
dbt seed --select state:modified+
dbt run --models state:modified+
dbt test --models state:modified+
```

Because dbt Cloud manages deferral and state environment variables, there is no need to specify `--defer` or `--state` flags. **Note:** Both jobs need to be running dbt v0.18.0 or newer.

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/ci-deferral.png" title="Jobs that run
on pull requests may select &quot;self&quot; or another job from the same project for deferral and comparison"/>

To learn more about state comparison and deferral in dbt, read the docs on [state](understanding-state).
