---
title: "About the dbt Cloud IDE"
id: develop-in-the-cloud
description: "Develop, test, run, and build in the Cloud IDE. With the Cloud IDE, you can compile dbt code into SQL and run it against your database directly"
sidebar_label: About the IDE
tags: [IDE]
pagination_next: "docs/cloud/dbt-cloud-ide/ide-user-interface"
pagination_prev: null
---

The dbt Cloud integrated development environment (IDE) is a single web-based interface for building, testing, running, and version-controlling dbt projects. It compiles dbt code into SQL and executes it directly on your database. 

The dbt Cloud IDE offers several [keyboard shortcuts](/docs/cloud/dbt-cloud-ide/keyboard-shortcuts) and [editing features](/docs/cloud/dbt-cloud-ide/ide-user-interface#editing-features) for faster and efficient development and governance:

- Syntax highlighting for SQL &mdash; Makes it easy to distinguish different parts of your code, reducing syntax errors and enhancing readability.
- AI copilot &mdash; Use [dbt Copilot](/docs/cloud/dbt-copilot), a powerful AI engine that can generate documentation, tests, and semantic models for your dbt SQL models.
- Auto-completion &mdash; Suggests table names, arguments, and column names as you type, saving time and reducing typos.
- Code [formatting and linting](/docs/cloud/dbt-cloud-ide/lint-format) &mdash; Helps standardize and fix your SQL code effortlessly.
- Navigation tools &mdash; Easily move around your code, jump to specific lines, find and replace text, and navigate between project files.
- Version control &mdash; Manage code versions with a few clicks.
- Project documentation &mdash; Generate and view your [project documentation](#build-and-document-your-projects) for your dbt project in real-time.
- Build, test, and run button &mdash; Build, test, and run your project with a button click or by using the Cloud IDE command bar.  

These [features](#dbt-cloud-ide-features) create a powerful editing environment for efficient SQL coding, suitable for both experienced and beginner developers.

<DocCarousel slidesPerView={1}>

<Lightbox src="/img/docs/dbt-cloud/cloud-ide/ide-basic-layout.jpg" width="85%" title="The dbt Cloud IDE includes version control,files/folders, an editor, a command/console, and more."/>

<Lightbox src src="/img/docs/dbt-cloud/cloud-ide/cloud-ide-v2.jpg" width="85%" title="Enable dark mode for a great viewing experience in low-light environments."/>
</DocCarousel>

:::tip Disable ad blockers

To improve your experience using dbt Cloud, we suggest that you turn off ad blockers. This is because some project file names, such as `google_adwords.sql`, might resemble ad traffic and trigger ad blockers.

:::

## Prerequisites

- A [dbt Cloud account](https://www.getdbt.com/signup) and [Developer seat license](/docs/cloud/manage-access/seats-and-users)
- A git repository set up and git provider must have `write` access enabled. See [Connecting your GitHub Account](/docs/cloud/git/connect-github) or [Importing a project by git URL](/docs/cloud/git/import-a-project-by-git-url) for detailed setup instructions
- A dbt project connected to a [data platform](/docs/cloud/connect-data-platform/about-connections)
- A [development environment and development credentials](#get-started-with-the-cloud-ide) set up
- The environment must be on dbt version 1.0 or higher

## dbt Cloud IDE features

The dbt Cloud IDE comes with features that make it easier for you to develop, build, compile, run, and test data models. 

To understand how to navigate the IDE and its user interface elements, refer to the [IDE user interface](/docs/cloud/dbt-cloud-ide/ide-user-interface) page.

| Feature  |  Description |
|---|---|
| [**Keyboard shortcuts**](/docs/cloud/dbt-cloud-ide/keyboard-shortcuts) | You can access a variety of [commands and actions](/docs/cloud/dbt-cloud-ide/keyboard-shortcuts) in the IDE by choosing the appropriate keyboard shortcut. Use the shortcuts for common tasks like building modified models or resuming builds from the last failure. |
| **IDE version control** | The IDE version control section and git button allow you to apply the concept of [version control](/docs/collaborate/git/version-control-basics) to your project directly into the IDE. <br /><br /> - Create or change branches, execute git commands using the git button.<br /> - Commit or revert individual files by right-clicking the edited file<br /> - [Resolve merge conflicts](/docs/collaborate/git/merge-conflicts)<br /> - Link to the repo directly by clicking the branch name <br /> - Edit, format, or lint files and execute dbt commands in your primary protected branch, and commit to a new branch.<br /> - Use Git diff view to view what has been changed in a file before you make a pull request.<br /> - Use the **Prune branches** [button](/docs/cloud/dbt-cloud-ide/ide-user-interface#prune-branches-modal) (dbt v1.6 and higher) to delete local branches that have been deleted from the remote repository, keeping your branch management tidy.<br /> - Sign your [git commits](/docs/cloud/dbt-cloud-ide/git-commit-signing) to mark them as 'Verified'. <Lifecycle status="enterprise" /> |
| **Preview and Compile button** | You can [compile or preview](/docs/cloud/dbt-cloud-ide/ide-user-interface#console-section) code, a snippet of dbt code, or one of your dbt models after editing and saving. |
| [**dbt Copilot**](/docs/cloud/dbt-copilot) <Lifecycle status='beta' />| A powerful AI engine that can generate documentation, tests, and semantic models for your dbt SQL models. Available for dbt Cloud Enterprise plans. |
| **Build, test, and run button**  | Build, test, and run your project with a button click or by using the Cloud IDE command bar.  
| **Command bar** | You can enter and run commands from the command bar at the bottom of the IDE. Use the [rich model selection syntax](/reference/node-selection/syntax) to execute [dbt commands](/reference/dbt-commands) directly within dbt Cloud. You can also view the history, status, and logs of previous runs by clicking History on the left of the bar.
| **Drag and drop**  | Drag and drop files located in the file explorer, and use the file breadcrumb on the top of the IDE for quick, linear navigation. Access adjacent files in the same file by right-clicking on the breadcrumb file.  
| **Organize tabs and files**  | - Move your tabs around to reorganize your work in the IDE <br /> - Right-click on a tab to view and select a list of actions, including duplicate files  <br /> - Close multiple, unsaved tabs to batch save your work <br /> - Double click files to rename files |
| **Find and replace** | - Press Command-F or Control-F to open the find-and-replace bar in the upper right corner of the current file in the IDE. The IDE highlights your search results in the current file and code outline<br /> - You can use the up and down arrows to see the match highlighted in the current file when there are multiple matches<br /> - Use the left arrow to replace the text with something else |
| **Multiple selections**  | You can make multiple selections for small and simultaneous edits. The below commands are a common way to add more cursors and allow you to insert cursors below or above with ease.<br /><br /> - Option-Command-Down arrow or Ctrl-Alt-Down arrow<br /> - Option-Command-Up arrow or Ctrl-Alt-Up arrow<br /> - Press Option and click on an area or Press Ctrl-Alt and click on an area<br /> 
| **Lint and Format** | [Lint and format](/docs/cloud/dbt-cloud-ide/lint-format) your files with a click of a button, powered by SQLFluff, sqlfmt, Prettier, and Black.
| **dbt autocomplete**  |  Autocomplete features to help you develop faster:<br /><br />  - Use `ref` to autocomplete your model names<br /> - Use `source` to autocomplete your source name + table name<br /> - Use `macro` to autocomplete your arguments<br /> - Use `env var` to autocomplete env var<br /> - Start typing a hyphen (-) to use in-line autocomplete in a YAML filebr /> - Automatically create models from dbt sources with a click of a button.  |
| **<Term id="dag" /> in the IDE** | You can see how models are used as building blocks from left to right to transform your data from raw sources into cleaned-up modular derived pieces and final outputs on the far right of the DAG. The default view is 2+model+2 (defaults to display 2 nodes away), however, you can change it to +model+ (full  <Term id="dag" />). Note the `--exclude` flag isn't supported. |
| **Status bar** | This area provides you with useful information about your IDE and project status. You also have additional options like enabling light or dark mode, restarting the IDE, or [recloning your repo](/docs/collaborate/git/version-control-basics).
| **Dark mode**  | From the status bar in the Cloud IDE, enable dark mode for a great viewing experience in low-light environments. 


### Code generation

The dbt Cloud IDE comes with **CodeGenCodeLens**, a powerful feature that simplifies creating models from your sources with a click of a button. To use this feature, click on the  **Generate model** action next to each table in the source YAML file(s). It automatically creates a basic starting staging model for you to expand on. This feature helps streamline your workflow by automating the first steps of model generation.

### dbt YAML validation

Use dbt-jsonschema to validate dbt YAML files, helping you leverage the autocomplete and assistance capabilities of the dbt Cloud IDE. This also provides immediate feedback on YAML file structure and syntax, helping you make sure your project configurations meet the required standards.

## Get started with the Cloud IDE

In order to start experiencing the great features of the Cloud IDE, you need to first set up a [dbt Cloud development environment](/docs/dbt-cloud-environments). In the following steps, we outline how to set up developer credentials and access the IDE. If you're creating a new project, you will automatically configure this during the project setup. 

The IDE uses developer credentials to connect to your data platform. These developer credentials should be specific to your user and they should *not* be super user credentials or the same credentials that you use for your production deployment of dbt.

Set up your developer credentials:

1. Navigate to your **Credentials** under **Your Profile** settings, which you can access at `https://YOUR_ACCESS_URL/settings/profile#credentials`, replacing `YOUR_ACCESS_URL` with the [appropriate Access URL](/docs/cloud/about-cloud/access-regions-ip-addresses) for your region and plan.
2. Select the relevant project in the list.
3. Click **Edit** on the bottom right of the page.
4. Enter the details under **Development Credentials**.
5. Click **Save.**

<Lightbox src="/img/docs/dbt-cloud/refresh-ide/dev-credentials.jpg" width="85%" height="100" title="Configure developer credentials in your Profile"/>

6. Access the Cloud IDE by clicking **Develop** at the top of the page.
7. Initialize your project and familiarize yourself with the IDE and its delightful [features](#cloud-ide-features).

Nice job, you're ready to start developing and building models 🎉!  

### Considerations
- To improve your experience using dbt Cloud, we suggest that you turn off ad blockers. This is because some project file names, such as `google_adwords.sql`, might resemble ad traffic and trigger ad blockers.
- To preserve performance, there's a file size limitation for repositories over 6 GB. If you have a repo over 6 GB, please contact [dbt Support](mailto:support@getdbt.com) before running dbt Cloud.
- The IDE's idle session timeout is one hour.
- <Expandable alt_header="About the start up process and work retention">
  
  ### Start-up process
  There are three start-up states when using or launching the Cloud IDE:
  - **Creation start &mdash;** This is the state where you are starting the IDE for the first time. You can also view this as a *cold start* (see below), and you can expect this state to take longer because the git repository is being cloned.
  - **Cold start &mdash;** This is the process of starting a new develop session, which will be available for you for one hour. The environment automatically turns off one hour after the last activity. This includes compile, preview, or any dbt invocation, however, it *does not* include editing and saving a file.
  - **Hot start &mdash;** This is the state of resuming an existing or active develop session within one hour of the last activity.

  ### Work retention
  The Cloud IDE needs explicit action to save your changes. There are three ways your work is stored:

  - **Unsaved, local code &mdash;** The browser stores your code only in its local storage. In this state, you might need to commit any unsaved changes in order to switch branches or browsers. If you have saved and committed changes, you can access the "Change branch" option even if there are unsaved changes. But if you attempt to switch branches without saving changes, a warning message will appear, notifying you that you will lose any unsaved changes.

  <Lightbox src="/img/docs/dbt-cloud/cloud-ide/ide-unsaved-modal.jpg" width="85%" title="If you attempt to switch branches without saving changes, a warning message will appear, telling you that you will lose your changes."/>

  - **Saved but uncommitted code &mdash;** When you save a file, the data gets stored in durable, long-term storage, but isn't synced back to git. To switch branches using the **Change branch** option, you must "Commit and sync" or "Revert" changes. Changing branches isn't available for saved-but-uncommitted code. This is to ensure your uncommitted changes don't get lost.
  - **Committed code &mdash;** This is stored in the branch with your git provider and you can check out other (remote) branches.

  </Expandable>

## Build and document your projects

- **Build, compile, and run projects** &mdash; You can *build*, *compile*, *run*, and *test* dbt projects using the command bar or **Build** button. Use the **Build** button to quickly build, run, or test the model you're working on. The Cloud IDE will update in real time when you run models, tests, seeds, and operations.
  - If a model or test fails, dbt Cloud makes it easy for you to view and download the run logs for your dbt invocations to fix the issue.
  - Use dbt's [rich model selection syntax](/reference/node-selection/syntax) to [run dbt commands](/reference/dbt-commands) directly within dbt Cloud.
  - Starting from dbt v1.6, leverage [environments variables](/docs/build/environment-variables#special-environment-variables) to dynamically use the Git branch name. For example, using the branch name as a prefix for a development schema.
  - Run [MetricFlow commands](/docs/build/metricflow-commands) to create and manage metrics in your project with the [dbt Semantic Layer](/docs/use-dbt-semantic-layer/dbt-sl).

- **Generate your YAML configurations with dbt Copilot** <Lifecycle status="beta"/>  &mdash; [dbt Copilot](/docs/cloud/dbt-copilot) is a powerful artificial intelligence (AI) feature that helps automate development in dbt Cloud. It can generate documentation, tests, and semantic models for your dbt SQL models directly in the dbt Cloud IDE, with a click of a button, and helps you accomplish more in less time. Available for dbt Cloud Enterprise plans.

- **Build and view your project's docs** &mdash; The dbt Cloud IDE makes it possible to [build and view](/docs/collaborate/build-and-view-your-docs) documentation for your dbt project while your code is still in development. With this workflow, you can inspect and verify what your project's generated documentation will look like before your changes are released to production.


## Related docs

- [How we style our dbt projects](/best-practices/how-we-style/0-how-we-style-our-dbt-projects)
- [User interface](/docs/cloud/dbt-cloud-ide/ide-user-interface)
- [Version control basics](/docs/collaborate/git/version-control-basics)
- [dbt Commands](/reference/dbt-commands)

## FAQs

<DetailsToggle alt_header="Is there a cost to using the Cloud IDE?">
Not at all! You can use dbt Cloud when you sign up for the <a href="https://www.getdbt.com/pricing/">Free Developer plan</a>, which comes with one developer seat. If you’d like to access more features or have more developer seats, you can upgrade your account to the Team or Enterprise plan.<br />

Refer to <a href="https://www.getdbt.com/pricing/">dbt pricing plans</a> for more details.
</DetailsToggle>

<DetailsToggle alt_header="Can I be a contributor to dbt Cloud?">
As a proprietary product, dbt Cloud's source code isn't available for community contributions. If you want to build something in the dbt ecosystem, we encourage you to review [this article](/community/contributing/contributing-coding) about contributing to a dbt package, a plugin, dbt-core, or this documentation site. Participation in open-source is a great way to level yourself up as a developer, and give back to the community.
</DetailsToggle>

<DetailsToggle alt_header="What is the difference between developing on the dbt Cloud IDE, the dbt Cloud CLI, and dbt Core?">
You can develop dbt using the web-based IDE in dbt Cloud or on the command line interface using the dbt Cloud CLI or open-source dbt Core, all of which enable you to execute dbt commands. The key distinction between the dbt Cloud CLI and dbt Core is the dbt Cloud CLI is tailored for dbt Cloud's infrastructure and integrates with all its features:

- dbt Cloud IDE: <a href="https://docs.getdbt.com/docs/cloud/about-cloud/dbt-cloud-features">dbt Cloud</a> is a web-based application that allows you to develop dbt projects with the IDE, includes a purpose-built scheduler, and provides an easier way to share your dbt documentation with your team. The IDE is a faster and more reliable way to deploy your dbt models and provides a real-time editing and execution environment for your dbt project.

- dbt Cloud CLI: <a href="https://docs.getdbt.com/docs/cloud/cloud-cli-installation">The dbt Cloud CLI</a> allows you to run dbt commands against your dbt Cloud development environment from your local command line or code editor. It supports cross-project ref, speedier, lower-cost builds, automatic deferral of build artifacts, and more.

- dbt Core: dbt Core is an <a href="https://github.com/dbt-labs/dbt">open-sourced</a> software that’s freely available. You can build your dbt project in a code editor, and run dbt commands from the command line

</DetailsToggle>
