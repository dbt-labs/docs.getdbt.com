---
title: "Develop in the Cloud"
id: develop-in-the-cloud
description: "Develop, test, run, and build in the Cloud IDE."
sidebar_label: "Develop in the Cloud"
---

The dbt Cloud integrated development environment (IDE) is a single interface for building, testing, running, and version-controlling dbt projects from your browser. With the Cloud IDE, you can compile dbt code into SQL and run it against your database directly.

The IDE leverages the open-source [dbt-rpc](/docs/reference/commands/rpc) plugin to recompile only the changes made in your project.

## Prerequisites

To develop in the Cloud IDE, make sure you have the following:

- Your dbt project must be compatible with dbt version 0.15.0 or higher. The dbt IDE is powered by the [dbt-rpc](/docs/reference/commands/rpc) which was overhauled in dbt v0.15.0
- You must have a [dbt Cloud account](https://cloud.getdbt.com/) and [Developer seat license](/docs/dbt-cloud/access-control/cloud-seats-and-users)
- You must have a git repository set up and your git provider must have `write` access enabled. See [Connecting your GitHub Account](/docs/dbt-cloud/cloud-configuring-dbt-cloud/cloud-installing-the-github-application) and [Importing a project by git URL](/docs/dbt-cloud/cloud-configuring-dbt-cloud/cloud-import-a-project-by-git-url) for detailed setup instructions
- Your dbt project must be connected to a [data platform](/docs/dbt-cloud/cloud-configuring-dbt-cloud/connecting-your-database)
- You must have a [**development environment** and **development credentials**](/docs/develop/develop-in-the-cloud#set-up-and-access-the-cloud-ide) set up
- The environment must be on dbt version 1.0 or higher


## Set up and access the Cloud IDE

:::info📌 

New to dbt? Check out our [Getting Started guide](/docs/guides/getting-started) to build your first dbt project in the Cloud IDE!

:::

In order to start experiencing the great features of the Cloud IDE, you need to first set up your **Development environment** and **Development credentials.** 

If you’re new to dbt, you will automatically add this during the project setup. However, if you have an existing dbt Cloud account, you may need to create a development environment and credentials manually to use the Cloud IDE. 

Review the steps below to set up your development environment and credentials:


**Development environment**

1. Create a development environment and choose **Deploy** and then **Environments** from the top left. Click **Create Environment**.

<Lightbox src="/img/docs/dbt-cloud/cloud-ide/new-environment.png" title="Creating a new environment for the Analytics project"/>

2. Enter an environment name that would help you identify it among your other environments (for example, `Nate's Development Environment`). 
3. Choose **Development** as the **Environment Type**. 
4. You can also select which **dbt Version** to use at this time. For compatibility reasons, we recommend that you select the same dbt version that you plan to use in your deployment environment. 
5. Click **Save** to finish creating your **Development environment**.


<Lightbox src="/img/docs/dbt-cloud/cloud-ide/create-new.png" title="Creating a development environment"/>


**Developer credentials**

The IDE uses developer credentials to connect to your data platform. These developer credentials should be specific to your user and they should *not* be super user credentials or the same credentials that you use for your production deployment of dbt. 

Follow the below steps to set up your developer credentials:

1. Go to the [**Credentials**](https://cloud.getdbt.com/next/settings/profile#credentials) section. 

2. Select the relevant project in the list. 

3. Click **Edit** on the bottom right of the page

4. Enter your developer credentials and then click **Save.** 

Great job, you should now be able to access the Cloud IDE by clicking **Develop** on the navigation to start developing! 

<Lightbox src="/img/docs/dbt-cloud/cloud-ide/credentials.png" title="Configure developer credentials in your Profile"/>

### Access the Cloud IDE

Now that you've set up your development environment and credentails, you should be able to access the Cloud IDE:

1. Log in with your [dbt Cloud account](https://cloud.getdbt.com/). If you don't have one, [sign up](https://www.getdbt.com/signup/) for an account for free.
2. Click **Develop** at the top of the page
3. Make sure you've already initialized your project
4. Start developing and familiarize yourself with the IDE!


## Build, compile, and run projects

You can *build*, *compile*, *run* *, and test* dbt projects by using the command bar. The Cloud IDE will update in real-time when you run models, tests, seeds, and operations. 

If a model or test fails, you can review the logs to find and fix the issue.

You can also use dbt's [rich model selection syntax](/docs.getdbt.com/reference/node-selection/syntax) to [run dbt commands](/docs/reference/dbt-commands) directly within dbt Cloud.

## Build and view your project's docs 

The dbt Cloud IDE makes it possible to view documentation for your dbt project while your code is still in development. With this workflow, you can inspect and verify what your project's generated documentation will look like before your changes are released to production.

To generate your project’s documentation (docs) in the IDE, run `dbt docs generate` in the command bar. This command generates the docs for your dbt project as it currently exists in development.

After you generate a successful run, you can view your documentation for your dbt project in real time by clicking **View Docs** or the **Book** icon on above the file tree. 

You can view the latest version of your documentation rendered in a new browser window, and inspect and verify what your project's documentation will look like before you deploy your changes to production.


## Develop in the Cloud IDE (beta)

:::info Join our beta


If you’d like to try the dbt Cloud IDE beta, available for multi-tenant instances, please [sign up](https://docs.google.com/forms/d/e/1FAIpQLSdlU65gqTZPyGAUc16SkxqTc50NO9vdq_KGx1Mjm_4FB_97FA/viewform) to join the beta. To learn more about the beta features, you can read this section.

:::

### Prerequisites

To develop in dbt Cloud IDE (beta), you need to meet these requirements:

- Your dbt project must be compatible with dbt v0.15.0. The dbt IDE is powered by the [dbt-rpc](/reference/commands/rpc) which was overhauled in dbt v0.15.0
- You must have a [Developer License](/docs/dbt-cloud/access-control/cloud-seats-and-users)
- - Your dbt project must be connected to a [data platform](/docs/dbt-cloud/cloud-configuring-dbt-cloud/connecting-your-database)
- You must have a [development environment and development credentials](/docs/develop/develop-in-the-cloud#set-up-the-cloud-ide) set up
- The environment must be on dbt version 1.0 or higher
- Currently only multi-tenant instances of dbt Cloud can develop in the updated beta version of the Cloud IDE
    * Single-tenant instances will soon be able to opt into this Beta release.
- Your dbt repository (in dbt Cloud) must have write access enabled
    * See [Connecting your GitHub Account](/docs/dbt-cloud/cloud-configuring-dbt-cloud/cloud-installing-the-github-application) and [Importing a project by git URL](/docs/dbt-cloud/cloud-configuring-dbt-cloud/cloud-import-a-project-by-git-url) for detailed setup instructions


The dbt Cloud IDE beta brings the startup and interaction time for dbt project development down from minutes to seconds, includes reliable performance and delightful enhancements to help you develop more efficiently!

### Start up and work retention

<table>
<tr><th>Start up process </th><th>Work retention</th></tr>
<tr><td>

There are three start-up states when using or launching the Cloud IDE:
    
- Creation start - This is the state in which you start the IDE for the first time. You can also view this as a *cold start* (see below), and you can expect this state to take longer because the git repository is being cloned.
- Cold start - This is the process of starting a new develop session, which will be available for you for three hours. The environment automatically turns off three hours after the last activity with the rpc server. This includes compile, preview, or any dbt invocation, however, it *does not* include editing and saving a file.
- Hot start -  This is the state of resuming an existing or active develop session within 3 hours of the last activity. 
    

</td><td>
    

The Cloud IDE needs explicit action to save your changes and there are three ways your work is stored:

- Unsaved, local code - Any code you write is automatically available from your browser’s storage. You can see your changes but will lose them if you switch branches or browsers (another device or browser).
- Saved but uncommitted code - When you save a file, the data gets stored in your local storage (EFS storage). If you switch branches but don’t *commit* your saved changes, you will lose your changes.
- Committed code - This is stored in the branch with git provider and you are able to check out other (remote) branches. 


</td></tr> </table>

### New Cloud IDE beta features

**Format**
You can format/preview/compile or build your dbt project, as well as see the DAG. The new **Format** button formats your file and is powered by [sqlfmt](http://sqlfmt.com/).

**Multiple selections** 

You can make multiple selections for quick and simultaneous edits. The below commands are a common way to add more cursors and allow you to insert cursors below or above with ease.

- Option-Command-Down arrow
- Option-Command-Up arrow
- Press Option and click on an area

<Lightbox src="/img/docs/dbt-cloud/cloud-ide/multi-selector.gif" title="Multiple Selections"/>

**Drag and drop** 

You can also drag and drop files located in the file explorer. Use the file breadcrumb on the top of the IDE for quick, linear navigation. You can access adjacent files in the same file by right clicking on the breadcrumb file.

<Lightbox src="/img/docs/dbt-cloud/cloud-ide/file-explorer.png" title="File Explorer"/> 

**Organize tabs**

You can move your tabs around to reorganize your work in the IDE. You can also right click on a tab to view and select a list of actions to take.

<Lightbox src="/img/docs/dbt-cloud/cloud-ide/tab-options.png" title="Tab options"/>

**Run projects**

You can also *build*, *run* *and test* dbt projects directly in the Cloud IDE with a click of a button, using the ‘Build’ feature. You can also use dbt's [rich model selection syntax](https://docs.getdbt.com/reference/node-selection/syntax) to [run dbt commands](https://docs.getdbt.com/reference/dbt-commands) directly within dbt Cloud.

The IDE updates in real-time as models, tests, seeds, and operations are run. If a model or test fails, you can review  the logs to find and fix the issue.

<Lightbox src="/img/docs/dbt-cloud/cloud-ide/build.png" title="Building"/>

**Lineage tab**

The visual in the Lineage tab adds more context to your dependencies and directional flow. 

You get to see how models are used as building blocks from left to right to transform your data from crude or normalized raw sources, into cleaned-up modular derived pieces, and finally into the final outputs on the far right of the DAG, ready to be used by the analyst in infinite combinations to present it in ways to help clients, customers, and organizations make better decisions.

You can access files in the lineage tab by double clicking on a particular model.

**Command bar + status** 

You can enter and run commands from the command bar at the bottom of the IDE.  Use the [rich model selection syntax](https://docs.getdbt.com/reference/node-selection/syntax) to [run dbt commands](https://docs.getdbt.com/reference/dbt-commands) directly within dbt Cloud. You can also view the history, status, and logs of previous runs by clicking **History**. 

The status icon on the lower right corner of the IDE gives you an indicator of the health of your project. You can identify errors by clicking on the status icon for more details or by clicking **Restart the IDE**.

**File state indicators** 

The file state indicators to make it clear when changes or actions have been made. The indicators **M**, **U**, and **•** appear to the right of your file or folder name and indicate the actions performed:

- Unsaved (•) - The IDE detects unsaved changes to your file/folder
- Modification (M) - The IDE detects a modification of existing files/folders have saved changes file or folder
- Untracked (U) - The IDE detects changes made to new files or renamed files


## Related docs

- [What is dbt?](/docs/introduction#dbt-features)
- [dbt Learn courses](https://courses.getdbt.com/collections)
- [dbt Cloud features](/docs/develop/dbt-cloud-features)
- [Version control basics](/docs/collaborate/git/version-control-basics)
- [dbt Commands](/docs/reference/dbt-commands)


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
