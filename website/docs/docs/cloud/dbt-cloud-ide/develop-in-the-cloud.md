---
title: "Develop in the IDE"
id: develop-in-the-cloud
description: "Develop, test, run, and build in the Cloud IDE. With the Cloud IDE, you can compile dbt code into SQL and run it against your database directly"
sidebar_label: Develop in the IDE
tags: [IDE]
---

The dbt Cloud integrated development environment (IDE) is a single interface for building, testing, running, and version-controlling dbt projects from your browser. With the Cloud IDE, you can compile dbt code into SQL and run it against your database directly. 

## Prerequisites

To develop in the Cloud IDE, make sure you have the following:

- A [dbt Cloud account](https://cloud.getdbt.com/) and [Developer seat license](/docs/cloud/manage-access/seats-and-users)
- A git repository set up and git provider must have `write` access enabled. See [Connecting your GitHub Account](/docs/cloud/git/connect-github) or [Importing a project by git URL](/docs/cloud/git/import-a-project-by-git-url) for detailed setup instructions
- A dbt project connected to a [data platform](/docs/cloud/connect-data-platform/about-connections)
- A [development environment and development credentials](#access-the-cloud-ide) set up
- The environment must be on dbt version 1.0 or higher

:::tip Disable ad blockers

To improve your experience using dbt Cloud, we suggest that you turn off ad blockers. This is because some project file names, such as `google_adwords.sql`, might resemble ad traffic and trigger ad blockers.

:::

## Develop in the Cloud IDE

The Cloud IDE is a powerful tool that can help streamline and govern your data platform development process. It offers a range of [editing features](/docs/cloud/dbt-cloud-ide/ide-user-interface#editing-features) that can help make your data platform development process faster and more efficient. Some of the editing features include:

- The IDE has syntax highlighting for SQL. This makes it easy to visually distinguish between different parts of your code. This helps prevent syntax errors and improve readability.
- Use the IDE built-in auto-completion, which suggests table names, arguments, and column names as you type. This saves time and reduces the likelihood of typos or errors in your code.
- The code [formatting and linting](/docs/cloud/dbt-cloud-ide/lint-format) tools allow you to standardize and fix your SQL code with ease. 
- The IDE has a range of navigation tools, making it easy to move around your code with ease. You can quickly jump to specific lines of code, find and replace text, and navigate between different files in your project. 
- Use the version control menu and features to version-control your code with just a few clicks. 

All of these [features](#cloud-ide-features) work together to create a powerful editing environment that can help you write and maintain high-quality SQL code in less time. Whether you're a seasoned developer or just starting out, the Cloud IDE has everything you need to be productive, collaborative, and efficient.

<Lightbox src="/img/docs/dbt-cloud/cloud-ide/ide-basic-layout.jpg" width="85%" title="The Cloud IDE layout includes version control on the upper left, files/folders on the left, editor on the right, and command/console at the bottom"/>

## Cloud IDE features

The dbt Cloud IDE comes with [tips](/docs/cloud/dbt-cloud-ide/dbt-cloud-tips) and [features](/docs/cloud/dbt-cloud-ide/ide-user-interface) that make it easier for you to develop, build, compile, run, and test data models. 

:::tip Stay informed

To stay informed on IDE updates, read [dbt Cloud IDE release notes](/tags/ide), or refer to the [IDE user interface](/docs/cloud/dbt-cloud-ide/ide-user-interface) for comprehensive definitions and terminology of user interface elements.

:::

| Feature  |  Info |
|---|---|
| **Keyboard shortcuts** | You can access a variety of [commands and actions](/docs/cloud/dbt-cloud-ide/dbt-cloud-tips#cloud-ide-keyboard-shortcuts) in the IDE by choosing the appropriate keyboard shortcut. This includes the command palette (Command-P or Control-P), which has common shortcuts and build commands to optimize your developer workflow. For example, you can build modified models or continue the build from the last failure point. |
| **File state indicators**  |  Ability to see when changes or actions have been made to the file. The indicators **M, D, A,** and **•** appear to the right of your file or folder name and indicate the actions performed: <br /> <br /> - Unsaved **(•)** &mdash; The IDE detects unsaved changes to your file/folder<br /> - Modification **(M)** &mdash; The IDE detects a modification of existing files/folders<br /> - Added **(A)** &mdash; The IDE detects added files<br/> - Deleted **(D)** &mdash; The IDE detects deleted files.
| **IDE version control** | The IDE version control section and git button allow you to apply the concept of [version control](/docs/collaborate/git/version-control-basics) to your project directly into the IDE. <br /><br /> - Create or change branches<br /> - Commit or revert individual files by right-clicking the edited file<br /> - [Resolve merge conflicts](/docs/collaborate/git/merge-conflicts)<br /> - Execute git commands using the git button <br /> - Link to the repo directly by clicking the branch name |
| **Project documentation** | Generate and view your [project documentation](/docs/collaborate/build-and-view-your-docs) for your dbt project in real-time. You can inspect and verify what your project's documentation will look like before you deploy your changes to production. |
| **Preview and Compile button** | You can run your code against your data platform by clicking the [**Preview**](/docs/cloud/dbt-cloud-ide/ide-user-interface#console-section). Use the [**Compile**](/docs/cloud/dbt-cloud-ide/ide-user-interface#console-section) button in the IDE to generate executable SQL, which occurs locally within dbt. |
| **Build, test, and run button**  | Build, test, and run your project with a button click or by using the Cloud IDE command bar.  
| **Command bar** | You can enter and run commands from the command bar at the bottom of the IDE. Use the [rich model selection syntax](/reference/node-selection/syntax) to execute [dbt commands](/reference/dbt-commands) directly within dbt Cloud. You can also view the history, status, and logs of previous runs by clicking History on the left of the bar.
| **Drag and drop**  | Drag and drop files located in the file explorer, and use the file breadcrumb on the top of the IDE for quick, linear navigation. Access adjacent files in the same file by right-clicking on the breadcrumb file.  
| **Organize tabs and files**  | - Move your tabs around to reorganize your work in the IDE <br /> - Right-click on a tab to view and select a list of actions, including duplicate files  <br /> - Close multiple, unsaved tabs to batch save your work <br /> - Double click files to rename files |
| **Find and replace** | - Press Command-F or Control-F to open the find-and-replace bar in the upper right corner of the current file in the IDE. The IDE highlights your search results in the current file and code outline<br /> - You can use the up and down arrows to see the match highlighted in the current file when there are multiple matches<br /> - Use the left arrow to replace the text with something else |
| **Multiple selections**  | You can make multiple selections for small and simultaneous edits. The below commands are a common way to add more cursors and allow you to insert cursors below or above with ease.<br /><br /> - Option-Command-Down arrow or Ctrl-Alt-Down arrow<br /> - Option-Command-Up arrow or Ctrl-Alt-Up arrow<br /> - Press Option and click on an area or Press Ctrl-Alt and click on an area<br /> 
| **Lint and Format** | [Lint and format](/docs/cloud/dbt-cloud-ide/lint-format) your files with a click of a button, powered by SQLFluff, sqlfmt, Prettier, and Black.
| **Git diff view**  | Ability to see what has been changed in a file before you make a pull request. 
| **dbt autocomplete**  |  New autocomplete features to help you develop faster:<br /><br />  - Use `ref` to autocomplete your model names<br /> - Use `source` to autocomplete your source name + table name<br /> - Use `macro` to autocomplete your arguments<br /> - Use `env var` to autocomplete env var<br /> - Start typing a hyphen (-) to use in-line autocomplete in a YAML file |
| **<Term id="dag" /> in the IDE** | You can see how models are used as building blocks from left to right to transform your data from raw sources into cleaned-up modular derived pieces and final outputs on the far right of the DAG. The default view is 2+model+2 (defaults to display 2 nodes away), however, you can change it to +model+ (full  <Term id="dag" />). Note the `--exclude` flag isn't supported. |
| **Status bar** | This area provides you with useful information about your IDE and project status. You also have additional options like enabling light or dark mode, restarting the IDE, or [recloning your repo](/docs/collaborate/git/version-control-basics).
| **Dark mode**  | From the status bar in the Cloud IDE, enable dark mode for a great viewing experience in low-light environments. 


### Start-up process

There are three start-up states when using or launching the Cloud IDE:

- **Creation start &mdash;** This is the state where you are starting the IDE for the first time. You can also view this as a *cold start* (see below), and you can expect this state to take longer because the git repository is being cloned.
- **Cold start &mdash;** This is the process of starting a new develop session, which will be available for you for three hours. The environment automatically turns off three hours after the last activity. This includes compile, preview, or any dbt invocation, however, it *does not* include editing and saving a file.
- **Hot start &mdash;** This is the state of resuming an existing or active develop session within three hours of the last activity.

### Work retention

The Cloud IDE needs explicit action to save your changes. There are three ways your work is stored:

- **Unsaved, local code &mdash;** The browser stores your code only in its local storage. In this state, you might need to commit any unsaved changes in order to switch branches or browsers. If you have saved and committed changes, you can access the "Change branch" option even if there are unsaved changes. But if you attempt to switch branches without saving changes, a warning message will appear, notifying you that you will lose any unsaved changes.
<Lightbox src="/img/docs/dbt-cloud/cloud-ide/ide-unsaved-modal.jpg" width="85%" title="If you attempt to switch branches without saving changes, a warning message will appear, telling you that you will lose your changes."/>

- **Saved but uncommitted code &mdash;** When you save a file, the data gets stored in durable, long-term storage, but isn't synced back to git. To switch branches using the **Change branch** option, you must "Commit and sync" or "Revert" changes. Changing branches isn't available for saved-but-uncommitted code. This is to ensure your uncommitted changes don't get lost.
- **Committed code &mdash;** This is stored in the branch with your git provider and you can check out other (remote) branches.

## Access the Cloud IDE

:::info📌

New to dbt? Check out our [quickstart guides](/quickstarts) to build your first dbt project in the Cloud IDE!

:::

In order to start experiencing the great features of the Cloud IDE, you need to first set up a [dbt Cloud development environment](/docs/dbt-cloud-environments). In the following steps, we outline how to set up developer credentials and access the IDE. If you're creating a new project, you will automatically configure this during the project setup. 

The IDE uses developer credentials to connect to your data platform. These developer credentials should be specific to your user and they should *not* be super user credentials or the same credentials that you use for your production deployment of dbt.

Set up your developer credentials:

1. Navigate to your **Credentials** under **Your Profile** settings, which you can access at `https://YOUR_ACCESS_URL/settings/profile#credentials`, replacing `YOUR_ACCESS_URL` with the [appropriate Access URL](/docs/cloud/about-cloud/regions-ip-addresses) for your region and plan.
2. Select the relevant project in the list.
3. Click **Edit** on the bottom right of the page.
4. Enter the details under **Development Credentials**.
5. Click **Save.**

<Lightbox src="/img/docs/dbt-cloud/refresh-ide/dev-credentials.jpg" width="85%" height="100" title="Configure developer credentials in your Profile"/>


6. Access the Cloud IDE by clicking **Develop** at the top of the page.
7. Initialize your project and familiarize yourself with the IDE and its delightful [features](#cloud-ide-features).

Nice job, you're ready to start developing and building models 🎉! 

## Build, compile, and run projects

You can *build*, *compile*, *run*, and *test* dbt projects using the command bar or **Build** button. Use the **Build** button to quickly build, run, or test the model you're working on. The Cloud IDE will update in real-time when you run models, tests, seeds, and operations. 

If a model or test fails, dbt Cloud makes it easy for you to view and download the run logs for your dbt invocations to fix the issue.

Use dbt's [rich model selection syntax](/reference/node-selection/syntax) to [run dbt commands](/reference/dbt-commands) directly within dbt Cloud.

<Lightbox src="/img/docs/dbt-cloud/refresh-ide/building.gif" width="85%" title="Preview, compile, or build your dbt project. Use the lineage tab to see your DAG."/>

## Build and view your project's docs

The dbt Cloud IDE makes it possible to [build and view](/docs/collaborate/build-and-view-your-docs#generating-documentation) documentation for your dbt project while your code is still in development. With this workflow, you can inspect and verify what your project's generated documentation will look like before your changes are released to production. 


## Related docs

- [dbt Cloud features](/docs/cloud/about-cloud/dbt-cloud-features)
- [IDE user interface](/docs/cloud/dbt-cloud-ide/ide-user-interface)
- [Version control basics](/docs/collaborate/git/version-control-basics)
- [dbt Commands](/reference/dbt-commands)
- [dbt Cloud IDE release notes](/tags/ide)

## Related questions

<FAQ path="Git/gitignore"/> <br />

<details>
  <summary>Is there a cost to using the Cloud IDE?</summary>
  <div>
    <div>Not at all! You can use dbt Cloud when you sign up for the <a href="https://www.getdbt.com/pricing/">Free Developer plan</a>, which comes with one developer seat. If you’d like to access more features or have more developer seats, you can upgrade your account to the Team or Enterprise plan. See <a href="https://www.getdbt.com/pricing/">dbt pricing plans</a> for more details. </div>
  </div>
</details>
<details>
  <summary>Can I be a contributor to dbt Cloud?</summary>
  <div>
    <div>Anyone can contribute to the dbt project. And whether it's a dbt package, a plugin, dbt-core, or this documentation site, contributing to the open-source code that supports the dbt ecosystem is a great way to level yourself up as a developer, and give back to the community. See <a href="https://docs.getdbt.com/community/resources/oss-expectations">Contributing</a> for details on what to expect when contributing to the dbt open source software (OSS). </div>
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
