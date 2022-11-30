---
title: "Develop in the Cloud"
id: develop-in-the-cloud
description: "Develop, test, run, and build in the Cloud IDE."
sidebar_label: Develop in the Cloud
---

<Snippet src="ide-ga-banner" />

The dbt Cloud integrated development environment (IDE) is a single interface for building, testing, running, and version-controlling dbt projects from your browser. With the Cloud IDE, you can compile dbt code into SQL and run it against your database directly.

The IDE leverages the open-source [dbt-rpc](/reference/commands/rpc) plugin to recompile only the changes made in your project.

## Prerequisites

To develop in the Cloud IDE, make sure you have the following:

- Your dbt project must be compatible with dbt version 0.15.0 or higher. The dbt IDE is powered by the [dbt-rpc](/reference/commands/rpc) which was overhauled in dbt v0.15.0
- You must have a [dbt Cloud account](https://cloud.getdbt.com/) and [Developer seat license](/docs/collaborate/manage-access/seats-and-users)
- You must have a git repository set up and your git provider must have `write` access enabled. See [Connecting your GitHub Account](/docs/collaborate/git/connect-github) and [Importing a project by git URL](/docs/collaborate/git/import-a-project-by-git-url) for detailed setup instructions
- Your dbt project must be connected to a [data platform](/docs/get-started/connect-your-database)
- You must have a [**development environment** and **development credentials**](#set-up-and-access-the-cloud-ide) set up
- The environment must be on dbt version 1.0 or higher

### Start up and work retention in the IDE

<table>
<tr><th>Start up process </th><th>Work retention</th></tr>
<tr><td>

There are three start-up states when using or launching the Cloud IDE:

- Creation start &mdash; This is the state where you are starting the IDE for the first time. You can also view this as a *cold start* (see below), and you can expect this state to take longer because the git repository is being cloned.
- Cold start &mdash; This is the process of starting a new develop session, which will be available for you for three hours. The environment automatically turns off three hours after the last activity with the rpc server. This includes compile, preview, or any dbt invocation, however, it *does not* include editing and saving a file.
- Hot start &mdash; This is the state of resuming an existing or active develop session within three hours of the last activity.


</td><td>


The Cloud IDE needs explicit action to save your changes. There are three ways your work is stored:

- Unsaved, local code &mdash; Any code you write is automatically available from your browser’s storage. You can see your changes but will lose them if you switch branches or browsers (another device or browser).
- Saved but uncommitted code &mdash; When you save a file, the data gets stored in your local storage (EFS storage). If you switch branches but don’t *commit* your saved changes, you will lose your changes.
- Committed code &mdash; This is stored in the branch with your git provider and you can check out other (remote) branches.


</td></tr> </table>

## Set up and access the Cloud IDE

:::info📌

New to dbt? Check out our [Getting Started guide](/docs/get-started/getting-started/overview) to build your first dbt project in the Cloud IDE!

:::

In order to start experiencing the great features of the Cloud IDE, you need to first set up your **Development environment** and **Development credentials.**

If you’re new to dbt, you will automatically add this during the project setup. However, if you have an existing dbt Cloud account, you may need to create a development environment and credentials manually to use the Cloud IDE.

Review the steps below to set up your development environment and credentials:


**Development environment**

1. Create a development environment and choose **Deploy** and then **Environments** from the top left. Click **Create Environment**.

<Lightbox src="/img/docs/dbt-cloud/refresh-ide/new-environment.png" width="100" height="100" title="Creating a new environment for the Analytics project"/>

2. Enter an environment name that would help you identify it among your other environments (for example, `Nate's Development Environment`).
3. Choose **Development** as the **Environment Type**.
4. You can also select which **dbt Version** to use at this time. For compatibility reasons, we recommend that you select the same dbt version that you plan to use in your deployment environment.
5. Click **Save** to finish creating your **Development environment**.


<Lightbox src="/img/docs/dbt-cloud/refresh-ide/new-environment-fields.png" width="100" height="100" title="Creating a development environment"/>


**Developer credentials**

The IDE uses developer credentials to connect to your data platform. These developer credentials should be specific to your user and they should *not* be super user credentials or the same credentials that you use for your production deployment of dbt.

Follow the below steps to set up your developer credentials:

1. Go to the [**Credentials**](https://cloud.getdbt.com/next/settings/profile#credentials) section.

2. Select the relevant project in the list.

3. Click **Edit** on the bottom right of the page

4. Enter your developer credentials and then click **Save.**

Great job, you should now be able to access the Cloud IDE by clicking **Develop** on the navigation to start developing!

<Lightbox src="/img/docs/dbt-cloud/refresh-ide/dev-credentials.png" width="100" height="100" title="Configure developer credentials in your Profile"/>

### Access the Cloud IDE

Now that you've set up your development environment and credentails, you should be able to access the Cloud IDE:

1. Log in with your [dbt Cloud account](https://cloud.getdbt.com/). If you don't have one, [sign up](https://www.getdbt.com/signup/) for an account for free.
2. Click **Develop** at the top of the page
3. Make sure you've already initialized your project
4. Start developing and use the image and guide below to familiarize yourself with the Cloud IDE and its [features](/docs/get-started/dbt-cloud-features#ide-features):

<Lightbox src="/img/docs/dbt-cloud/refresh-ide/refresh-ide.png" width="200" height="200" title="Cloud IDE overview"/>

| Number  | Feature  | Info  |
|---|---|---|
| 1.  | File Tree  | The file tree allows you to organize your project and manage your files and folders. Click the three-dot menu associated with the file or folder to create, rename, or delete it. Note: This function is unavailable if you’re on the **main** branch.   |
| 2.  | Editor  | This is where you edit your files. You can use the tab for each editor to position it exactly where you need it.  |
| 3.  | IDE git button  |  The git button in the IDE allows you to apply the concept of [version control](/docs/collaborate/git/version-control-basics) to your project and you can execute git commands directly in the IDE. |
| 4. | Command bar | You can enter and run commands from the command bar at the bottom of the IDE. Use the [rich model selection syntax](/reference/node-selection/syntax) to execute [dbt commands](/reference/dbt-commands) directly within dbt Cloud. You can also view the history, status, and logs of previous runs by clicking **History** on the left of the bar.
| 5. | Status bar | This area provides you with useful information about your IDE and project status. You also have additional options like restarting or [recloning your repo](/docs/collaborate/git/version-control-basics).|
| 6. | Preview <br></br>Compile <br></br>Build |  This is where you can preview, compile or build your dbt project, as well as see the results and the DAG. |
| 7. | Lineage tab | You can see how models are used as building blocks from left to right to transform your data from raw sources into cleaned-up modular derived pieces and final outputs on the far right of the DAG. You can access files in the **Lineage** tab by double-clicking on a particular model. Expand the DAG into fullscreen to view the DAG view differently. Note: The default view is `+model+`, however, you can change it to `2+model+2`. |
| 8. | Change branches and view documentation | Change branches in fewer clicks and focus on developing. You can generate and view your [documentation](/docs/collaborate/build-and-view-your-docs) for your dbt project in real time. You can inspect and verify what your project's documentation will look like before you deploy your changes to production.|
| 9. | File state indicators | The file state indicators will indicate and track any action or changed made in your project. The indicators **M, U, and  •** appear to the right of your file or folder name, and also under the **Changes** section. |
| 10. | Format button | This is where you can format your dbt project code. The new **Format** button formats your file and is powered by [sqlfmt](http://sqlfmt.com/).|

## Build, compile, and run projects

You can *build*, *compile*, *run* *, and test* dbt projects by using the command bar. The Cloud IDE will update in real time when you run models, tests, seeds, and operations.

If a model or test fails, you can review the logs to find and fix the issue.

You can also use dbt's [rich model selection syntax](/reference/node-selection/syntax) to [run dbt commands](/reference/dbt-commands) directly within dbt Cloud.

<Lightbox src="/img/docs/dbt-cloud/refresh-ide/building.gif" title="Preview, compile, or build your dbt project. Use the lineage tab to see your DAG."/>

 <Lightbox src="/img/docs/dbt-cloud/cloud-ide/build.png" title="Build, run and test your dbt project"/>

## Build and view your project's docs

The dbt Cloud IDE makes it possible to view documentation for your dbt project while your code is still in development. With this workflow, you can inspect and verify what your project's generated documentation will look like before your changes are released to production.

To generate your project’s documentation (docs) in the IDE, run `dbt docs generate` in the command bar. This command generates the docs for your dbt project as it currently exists in development.

After you generate a successful run, you can view your documentation for your dbt project in real time by clicking **View Docs** or the book icon above the file tree.

You can view the latest version of your documentation rendered in a new browser window, and inspect and verify what your project's documentation will look like before you deploy your changes to production.


## Related docs

- [What is dbt?](/docs/introduction#dbt-features)
- [dbt Learn courses](https://courses.getdbt.com/collections)
- [dbt Cloud features](/docs/get-started/dbt-cloud-features)
- [Version control basics](/docs/collaborate/git/version-control-basics)
- [dbt Commands](/reference/dbt-commands)


## Related questions

<details>
  <summary>Is there a cost to using the Cloud IDE?</summary>
  <div>
    <div>Not at all! You can use dbt Cloud when you sign up for the <a href="https://www.getdbt.com/pricing/">Free Developer plan</a>, which comes with one developer seat. If you’d like to access more features or have more developer seats, you can upgrade your account to the Team or Enterprise plan. See <a href="https://www.getdbt.com/pricing/">dbt pricing plans</a> for more details. </div>
  </div>
</details>
<details>
  <summary>Can I be a contributor to dbt Cloud?</summary>
  <div>
    <div>Anyone can contribute to the dbt project. And whether it's a dbt package, a plugin, dbt-core, or this documentation site, contributing to the open source code that supports the dbt ecosystem is a great way to level yourself up as a developer, and give back to the community. See <a href="https://docs.getdbt.com/docs/contributing/oss-expectations">Contributing</a> for details on what to expect when contributing to the dbt open source software (OSS). </div>
  </div>
</details>
<details>
  <summary>What is the difference between developing on the Cloud IDE and on the CLI?</summary>
  <div>
    <div>There are two main ways to develop with dbt: using the web-based IDE in dbt Cloud or using the command-line interface (CLI) in dbt Core: <br></br>
      <span>&mdash;</span>
      <b>dbt Cloud IDE</b> dbt Cloud is a web-based application that allows you to develop dbt projects with the IDE, includes a purpose-built scheduler, and provides an easier way to share your dbt documentation with your team. The IDE is a faster and more reliable way to deploy your dbt models and provides a real-time editing and execution environment for your dbt project. <br></br>
      <span>&mdash;</span>
      <b>dbt Core CLI</b> The command line interface (CLI) uses <a href="https://docs.getdbt.com/docs/introduction">dbt Core</a>, an <a href="https://github.com/dbt-labs/dbt">open-source</a> software that’s freely available. You can build your dbt project in a code editor, like Jetbrains or VSCode, and run dbt commands from the command line.
    </div>
  </div>
</details>
<details>
  <summary>What type of support is provided with dbt Cloud?</summary>
  <div>
    <div>The global dbt Support team is available to help dbt Cloud users by email or in-product live chat. Developer and Team accounts offer 24x5 support, while Enterprise customers have priority access and options for custom coverage. <br></br> If you have project-related or modeling questions, review <a href="https://docs.getdbt.com/docs/dbt-cloud/cloud-dbt-cloud-support">our Support page</a> or <a href="http://getdbt.slack.com/">dbt Community Slack</a> to get help as well. </div>
  </div>
</details>
