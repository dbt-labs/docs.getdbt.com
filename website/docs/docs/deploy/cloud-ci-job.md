---
title: "dbt Cloud CI job"
id: "cloud-ci-job"
description: "You can enable continuous integration (CI) to test every single change prior to deploying the code to production just like in a software development workflow."
---


dbt Cloud makes it easy to test every single code change you make prior to deploying that new logic into production. Once you've connected your [GitHub account](/docs/collaborate/git/connect-github), [GitLab account](/docs/collaborate/git/connect-gitlab), or [Azure DevOps account](/docs/collaborate/git/connect-azure-devops), you can configure continuous integration (CI) jobs to run when someone opens a new pull request in your dbt repository. For more information, refer to [Configuring a webhook](#configuring-a-webhook).

Draft pull requests do _not_ trigger jobs. If you want jobs to run on each new commit, you need to mark your pull request as **Ready for review**.


:::info GitLab Compatibility

Only GitLab users with a paid or self-hosted GitLab account can use GitLab webhooks.

:::

:::info Common Errors
If you previously configured your dbt project by providing a generic git URL that clones using SSH, you need to [reconfigure the project](/docs/deploy/cloud-ci-job#reconnecting-your-dbt-project-to-use-dbt-clouds-native-integration-with-github-gitlab-or-azure-devops) to connect through dbt Cloud's native integration with GitHub, GitLab, or Azure DevOps instead.
:::

## Configuring continuous integration in dbt Cloud

When you set up a dbt Cloud CI job with a [webhook configured](#configuring-a-webhook), dbt Cloud will listen for webhooks from GitHub, GitLab, or Azure DevOps indicating that a new pull request has been opened or updated with new commits. When one of these webhooks is received, dbt Cloud will enqueue a new run of the CI job. 

Once you open a pull request, dbt Cloud builds the models affected by the code change in a temporary schema using the prefix `dbt_cloud_pr_`. dbt Cloud then  runs the tests for these models as a check. This process provides a staging environment where you can check the run status and builds resulting from the code associated with the pull request's commit. When the CI job completes, you can see the run status directly in the pull request. The CI job enables you to deploy new code to production with confidence. The unique schema name, your project ID, and pull request ID (`dbt_cloud_pr_1862_917`) can be found in the run details for the given run as shown in the following image:

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/using_ci_dbt_cloud.png" title="Viewing the temporary schema name for a run triggered by a PR"/>

After completing the dbt run, dbt Cloud will update the pull request in GitHub, GitLab, or Azure DevOps with a status message indicating the results of the run. The status message will state whether the models and tests ran successfully or not. You can enable a setting in your git provider that makes "successful pull request checks" a requirement to merge code. And finally, once the pull request is closed or merged, dbt Cloud will delete the temporary schema from your <Term id="data-warehouse" />.

dbt Cloud might not drop the temporary schema from your data warehouse if your project has database / schema customization using the [`generate_database_name`](/docs/build/custom-databases#generate_database_name) / [`generate_schema_name`](/docs/build/custom-schemas#how-does-dbt-generate-a-models-schema-name) macros. For more information, refer to [Temp PR schema limitations](/docs/deploy/cloud-ci-job#temp-pr-schema-limitations).

### Configuring a webhook

If you want dbt Cloud to run the job whenever a pull request or commit is made, you can set up a webhook. 

To set up a webhook:

1. Navigate to the **Triggers** section of the jobs settings page
2. Select **Webhooks**. 
3. Select **Run on Pull Requests?** as shown in the following image.

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/61536c9-Screen_Shot_2019-02-08_at_9.46.29_PM.png" title="Configuring webhooks for a dbt Cloud Job"/>


### GitHub pull request example

The green checkmark means the dbt builds and tests were successful. The _Details_ link shown here will navigate you to the relevant CI run in dbt Cloud.
<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/09c886f-Screen_Shot_2019-02-08_at_4.54.41_PM.png" title="GitHub pull request example"/>

### GitLab pull request example

The green checkmark means the dbt builds and tests were successful. Clicking the dbt Cloud pop up will navigate you to the relevant CI run in dbt Cloud.
<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/GitLab-Pipeline.png" title="GitLab pull request"/>

### Azure DevOps pull request example

The green checkmark means the dbt builds and tests were successful. Clicking on the dbt Cloud section navigates you to the relevant CI run in dbt Cloud.
<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/Enabling-CI/ADO CI Check.png" title="Azure DevOps pull request"/>

## Configuring a Slim CI job

Slim CI offers an alternative to running and testing all models in your project, even when you're only changed a couple of things. Slim CI can decrease the time it takes by running and testing only modified models, which can also reduce unnecessary resource usage on your warehouse/data platform.

These components distinguish a Slim CI job from a dbt CI job:

- Must defer to a production job.
- Commands need to have a `state:modified+` selector to build only new or changed models and their downstream dependents. Importantly, state comparison can only happen when there is a deferred job selected to compare state to. For more information, refer to [Defferral and state comparision](#deferral-and-state-comparison)
- Must be triggered by a pull request.

### Deferral and state comparison  

When creating a job in dbt Cloud, you can configure your **Execution Settings** to defer to a previous run state by using the dropdown menu to select which _production_ job you want to defer to.

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/ci-deferral.png" title="Jobs that run
on pull requests can select another job from the same project for deferral and comparison"/>

When a job is selected, dbt Cloud will look at the artifacts from that job's most recent successful run. dbt will then use those artifacts to determine the set of new and modified resources.

In your job commands, you can signal to dbt to run only on these modified resources and their children by including the `state:modified+` argument.

As example:

```
dbt build --select state:modified+
```

Because dbt Cloud manages deferral and state environment variables, there is no need to specify `--defer` or `--state` flags. **Note:** Both jobs need to be running dbt v0.18.0 or later.

To learn more about state comparison and deferral in dbt, read the docs on [state](/docs/deploy/about-state).

### Fresh rebuilds

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

Make the necessary changes to your project and double-check if the temporary PR schemas drop after a merge or close of the pull request. 

Note: dbt Cloud may not drop the temporary schema from your data warehouse if your project has database / schema customization via the [`generate_database_name`](/docs/build/custom-databases#generate_database_name) / [`generate_schema_name`](/docs/build/custom-schemas#how-does-dbt-generate-a-models-schema-name) macros. For more info, refer to [Temp PR schema limitations](/docs/deploy/cloud-ci-job#temp-pr-schema-limitations).

## Troubleshooting

If you're experiencing any issues, review some of the common questions and answers below.

<details>
   <summary>Reconnecting your dbt project to use dbt Cloud's native integration with GitHub, GitLab, or Azure DevOps</summary>
   <div>
      <div>If your dbt project relies the generic git clone method that clones using SSH and deploy keys to connect to your dbt repo, you need to disconnect your repo and reconnect it using the native GitHub, GitLab, or Azure DevOps integration in order to enable dbt Cloud Slim CI.<br></br><br></br>
      First, make sure you have the <a href="https://docs.getdbt.com/docs/collaborate/git/connect-github">native GitHub authentication</a>, <a href="https://docs.getdbt.com/docs/collaborate/git/connect-gitlab">native GitLab authentication</a>, or <a href="https://docs.getdbt.com/docs/collaborate/git/connect-azure-devops">native Azure DevOps authentication</a> set up depending on which git provider you use. After you have gone through those steps, go to <strong>Account Settings</strong>, select <strong>Projects</strong> and click on the project you'd like to reconnect through native GitHub, GitLab, or Azure DevOps auth. Then click on the repository link.<br></br><br></br>
      
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
      <div>If you receive a schema-related error message referencing a <i>previous</i> PR, this is usually an indicator that you are not using a production job for your deferral and are instead using <i>self</i>.  If the prior PR has already been merged, the prior PR's schema may have been dropped by the time the Slim CI job for the current PR is kicked off.<br></br><br></br>
      
      To fix this issue, select a production job run to defer to instead of self.
      </div>
   </div>
</details>
<details>
   <summary>Production job runs failing at the <b>Clone Git Repository</b> step</summary>
   <div>
      <div>dbt Cloud can only checkout commits that belong to the original repository. dbt Cloud _cannot_ checkout commits that belong to a fork of that repository.<br></br><br></br>
      
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

### Temp PR schema limitations

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
