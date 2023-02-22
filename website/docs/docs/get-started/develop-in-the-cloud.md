---
title: "Develop in Cloud"
id: develop-in-the-cloud
description: "Develop, test, run, and build in the Cloud IDE."
sidebar_label: Develop in Cloud
---

The dbt Cloud integrated development environment (IDE) is a single interface for building, testing, running, and version-controlling dbt projects from your browser. With the Cloud IDE, you can compile dbt code into SQL and run it against your database directly. The IDE leverages the open-source [dbt-rpc](/reference/commands/rpc) plugin to recompile only the changes made in your project.


With the Cloud IDE, you can:

- Write modular SQL models with select statements and the ref() function,
- Compile dbt code into SQL and execute it against your database directly,
- Test every model before deploying them to production,
- Generate and view documentation of your dbt project,
- Leverage git and version-control your code from your browser with a couple of clicks,
- Create and test Python models:
    * Compile Python models to see the full function that gets executed in your data platform
    * See Python models in DAG in dbt version 1.3 and higher
    * Currently, you can't preview python models
- Visualize a directed acyclic graph (DAG), and more.

<Lightbox src src="/img/docs/dbt-cloud/cloud-ide/cloud-ide-v2.jpg" title="The dbt Cloud IDE in dark mode"/>


## Prerequisites

To develop in the Cloud IDE, make sure you have the following:

- Your dbt project must be compatible with dbt version 0.15.0 or higher. The dbt IDE is powered by the [dbt-rpc](/reference/commands/rpc) which was overhauled in dbt v0.15.0
- A [dbt Cloud account](https://cloud.getdbt.com/) and [Developer seat license](/docs/collaborate/manage-access/seats-and-users)
- A git repository set up and git provider must have `write` access enabled. See [Connecting your GitHub Account](/docs/collaborate/git/connect-github) or [Importing a project by git URL](/docs/collaborate/git/import-a-project-by-git-url) for detailed setup instructions
- A dbt project connected to a [data platform](/docs/get-started/connect-your-database)
- Set up a [development environment and development credentials](#access-the-cloud-ide)
- The environment must be on dbt version 1.0 or higher

## Cloud IDE features

The dbt Cloud IDE comes with [tips](/docs/get-started/dbt-cloud-tips) and features that make it easier for you to develop, build, compile, run, and test data models.

| Feature  |  Info |
|---|---|
| **Keyboard shortcuts** | You can access a variety of [commands and actions](/docs/get-started/dbt-cloud-tips#cloud-ide-keyboard-shortcuts) in the IDE by choosing the appropriate keyboard shortcut. |
| **File state indicators**  |  Ability to see when changes or actions have been made to the file. The indicators **M, D, A,** and **•** appear to the right of your file or folder name and indicate the actions performed: <br /> <br /> - Unsaved **(•)** &mdash; The IDE detects unsaved changes to your file/folder<br /> - Modification **(M)** &mdash; The IDE detects a modification of existing files/folders<br /> - Added **(A)** &mdash; The IDE detects added files<br/> - Deleted **(D)** &mdash; The IDE detects deleted files.
| **IDE git button** | The git button in the IDE allows you to apply the concept of [version control](/docs/collaborate/git/version-control-basics) to your project. You can create or change branches, [resolve merge conflicts](/docs/collaborate/git/merge-conflicts), and execute git commands directly in the IDE. |
| **Documentation** | You can generate and view your [project documentation](/docs/collaborate/build-and-view-your-docs) for your dbt project in real-time. You can inspect and verify what your project's documentation will look like before you deploy your changes to production. |
| **Build, test, and run button**  | Build, test, and run your project with a button click or by using the Cloud IDE command bar.  
| **Command bar** | You can enter and run commands from the command bar at the bottom of the IDE. Use the [rich model selection syntax](/reference/node-selection/syntax) to execute [dbt commands](/reference/dbt-commands) directly within dbt Cloud. You can also view the history, status, and logs of previous runs by clicking History on the left of the bar.
| **Drag and drop**  | Drag and drop files located in the file explorer, and use the file breadcrumb on the top of the IDE for quick, linear navigation. Access adjacent files in the same file by right-clicking on the breadcrumb file.  
| **Organize tabs**  | You can: <br /> - Move your tabs around to reorganize your work in the IDE <br /> - Right-click on a tab to view and select a list of actions to take <br /> - Close multiple, unsaved tabs to batch save your work
| **Find and replace** | Press Command-F or Control-F to open the find-and-replace bar in the upper right corner of the current file in the IDE. The IDE highlights your search results in the current file and code outline. You can use the up and down arrows to see the match highlighted in the current file when there are multiple matches. To replace the text with something else, use the left arrow. |
| **Multiple selections**  | You can make multiple selections for small and simultaneous edits. The below commands are a common way to add more cursors and allow you to insert cursors below or above with ease.<br /><br /> - Option-Command-Down arrow or Ctrl-Alt-Down arrow<br /> - Option-Command-Up arrow or Ctrl-Alt-Up arrow<br /> - Press Option and click on an area or Press Ctrl-Alt and click on an area<br /> 
| **Formatting** | Format your files with a click of a button, powered by [sqlfmt](http://sqlfmt.com/). 
| **Git diff view**  | Ability to see what has been changed in a file before you make a pull request. 
| **dbt autocomplete**  |  There are four new types of autocomplete features to help you develop faster:<br />  - Use `ref` to autocomplete your model names<br /> - Use `source` to autocomplete your source name + table name<br /> - Use `macro` to autocomplete your arguments<br /> - Use `env var` to autocomplete env var 
| **DAG in the IDE** | You can see how models are used as building blocks from left to right to transform your data from raw sources into cleaned-up modular derived pieces and final outputs on the far right of the DAG. Double-click a node in the directed acyclic graph (DAG) to open that file in a new tab. Expand the DAG and use node selection syntax (select or exclude) to view a subset of your DAG. Note: The default view is +model+, however, you can change it to 2+model+2.  |
| **Status bar** | This area provides you with useful information about your IDE and project status. You also have additional options like enabling light or dark mode, restarting the IDE, or [recloning your repo](/docs/collaborate/git/version-control-basics).
| **Dark mode**  | Use dark mode in the Cloud IDE for a great viewing experience in low-light environments. 


**Start up process**

There are three start-up states when using or launching the Cloud IDE:

- Creation start &mdash; This is the state where you are starting the IDE for the first time. You can also view this as a *cold start* (see below), and you can expect this state to take longer because the git repository is being cloned.
- Cold start &mdash; This is the process of starting a new develop session, which will be available for you for three hours. The environment automatically turns off three hours after the last activity with the rpc server. This includes compile, preview, or any dbt invocation, however, it *does not* include editing and saving a file.
- Hot start &mdash; This is the state of resuming an existing or active develop session within three hours of the last activity.

**Work retention**

The Cloud IDE needs explicit action to save your changes. There are three ways your work is stored:

- Unsaved, local code &mdash; Any code you write is automatically available from your browser’s storage. You can see your changes but will lose them if you switch branches or browsers (another device or browser).
- Saved but uncommitted code &mdash; When you save a file, the data gets stored in your local storage (EFS storage). If you switch branches but don’t *commit* your saved changes, you will lose your changes.
- Committed code &mdash; This is stored in the branch with your git provider and you can check out other (remote) branches.

## Access the Cloud IDE

:::info📌

New to dbt? Check out our [quickstart guide](/docs/quickstarts/overview) to build your first dbt project in the Cloud IDE!

:::

In order to start experiencing the great features of the Cloud IDE, you need to first set up a [dbt Cloud development environment](/docs/collaborate/environments/dbt-cloud-environments). In the following steps, we outline how to set up developer credentials and access the IDE. If you're creating a new project, you will automatically configure this during the project setup. 

The IDE uses developer credentials to connect to your data platform. These developer credentials should be specific to your user and they should *not* be super user credentials or the same credentials that you use for your production deployment of dbt.

Set up your developer credentials:

1. Navigate to your **Credentials** under **Your Profile** settings, which you can access at `https://YOUR_ACCESS_URL/settings/profile#credentials`, replacing `YOUR_ACCESS_URL` with the [appropriate Access URL](/docs/deploy/regions-ip-addresses) for your region and plan.
2. Select the relevant project in the list.
3. Click **Edit** on the bottom right of the page.
4. Enter the details under **Development Credentials**.
5. Click **Save.**

<Lightbox src="/img/docs/dbt-cloud/refresh-ide/dev-credentials.jpg" width="100" height="100" title="Configure developer credentials in your Profile"/>


6. Access the Cloud IDE by clicking **Develop** at the top of the page.
7. Initialize your project and familiarize yourself with the IDE and its delightful [features](#cloud-ide-features).

Nice job, you're ready to start developing and building models 🎉! 

## Build, compile, and run projects

You can *build*, *compile*, *run*, and *test* dbt projects using the command bar or **Build** button. Use the **Build** button to quickly build, run, or test the model you're working on. The Cloud IDE will update in real-time when you run models, tests, seeds, and operations. 

If a model or test fails, dbt Cloud makes it easy for you to view and download the run logs for your dbt invocations to fix the issue.

Use dbt's [rich model selection syntax](/reference/node-selection/syntax) to [run dbt commands](/reference/dbt-commands) directly within dbt Cloud.

<Lightbox src="/img/docs/dbt-cloud/refresh-ide/building.gif" title="Preview, compile, or build your dbt project. Use the lineage tab to see your DAG."/>

## Build and view your project's docs

The dbt Cloud IDE makes it possible to [build and view](/docs/collaborate/build-and-view-your-docs#generating-documentation) documentation for your dbt project while your code is still in development. With this workflow, you can inspect and verify what your project's generated documentation will look like before your changes are released to production. 


## Related docs

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
    <div>Anyone can contribute to the dbt project. And whether it's a dbt package, a plugin, dbt-core, or this documentation site, contributing to the open source code that supports the dbt ecosystem is a great way to level yourself up as a developer, and give back to the community. See <a href="https://docs.getdbt.com/community/resources/oss-expectations">Contributing</a> for details on what to expect when contributing to the dbt open source software (OSS). </div>
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
