---
title: "Develop in the Cloud"
id: develop-in-the-cloud
description: "Develop, test, run, and build in the Cloud IDE."
sidebar_label: Develop in the Cloud
---

The dbt Cloud integrated development environment (IDE) is a single interface for building, testing, running, and version-controlling dbt projects from your browser. With the Cloud IDE, you can compile dbt code into SQL and run it against your database directly. The IDE leverages the open-source [dbt-rpc](/reference/commands/rpc) plugin to recompile only the changes made in your project.

With the Cloud IDE, you can:

- Write modular SQL models with select statements and the ref() function,
- Compile dbt code into SQL and execute it against your database directly,
- Test every model before deploying them to production,
- Generate and view documentation of your dbt project,
- Leverage git and version-control your code from your browser with a couple of clicks,
- Create and test Python models:
  * You can compile Python models to see the full function that gets executed in your data platform,
  * You can see Python models in DAG in dbt version 1.3 and higher,
- You can't preview python models, currently,
- Visualize a directed acyclic graph (DAG), and more.

## Prerequisites

To develop in the Cloud IDE, make sure you have the following:

- Your dbt project must be compatible with dbt version 0.15.0 or higher. The dbt IDE is powered by the [dbt-rpc](/reference/commands/rpc) which was overhauled in dbt v0.15.0
- You must have a [dbt Cloud account](https://cloud.getdbt.com/) and [Developer seat license](/docs/collaborate/manage-access/seats-and-users)
- You must have a git repository set up and your git provider must have `write` access enabled. See [Connecting your GitHub Account](/docs/collaborate/git/connect-github) and [Importing a project by git URL](/docs/collaborate/git/import-a-project-by-git-url) for detailed setup instructions
- Your dbt project must be connected to a [data platform](/docs/get-started/connect-your-database)
- You must have a [**development environment** and **development credentials**](#set-up-and-access-the-cloud-ide) set up
- The environment must be on dbt version 1.0 or higher

## Cloud IDE features

The dbt Cloud IDE comes with features that make it easier for you to develop, build, compile, run and test data models.

| Feature  |  Info |
|---|---|
| **File state indicators**  |  Ability to see when changes or actions have been made to the file. The indicators **M, D, A,** and **•** appear to the right of your file or folder name and indicate the actions performed: <br /> <br /> - Unsaved **(•)** &mdash; The IDE detects unsaved changes to your file/folder<br /> - Modification **(M)** &mdash; The IDE detects a modification of existing files/folders<br /> - Added **(A)** &mdash; The IDE detects added files<br/> - Deleted **(D)** &mdash; The IDE detects deleted files.
| **IDE git button** | The git button in the IDE allows you to apply the concept of [version control](/docs/collaborate/git/version-control-basics) to your project. You can create or change branches, and execute git commands directly in the IDE. |
| **Documentation** | You can generate and view your [project documentation](/docs/collaborate/build-and-view-your-docs) for your dbt project in real time. You can inspect and verify what your project's documentation will look like before you deploy your changes to production. |
| **Build, test, and run button**  | Build, test, and run your project with a button click or by using the Cloud IDE command bar.  
| **Command bar** | You can enter and run commands from the command bar at the bottom of the IDE. Use the [rich model selection syntax](/reference/node-selection/syntax) to execute [dbt commands](/reference/dbt-commands) directly within dbt Cloud. You can also view the history, status, and logs of previous runs by clicking History on the left of the bar.
| **Drag and drop**  | Drag and drop files located in the file explorer, and use the file breadcrumb on the top of the IDE for quick, linear navigation. Access adjacent files in the same file by right clicking on the breadcrumb file.  
| **Organize tabs**  | You can: <br /> - Move your tabs around to reorganize your work in the IDE <br /> - Right-click on a tab to view and select a list of actions to take <br /> - Close multiple, unsaved tabs to batch save your work
| **Find and replace** | Press Command-F or Control-F to open the find-and-replace bar in the upper right corner of the current file in the IDE. The IDE highlights your search results in the current file and code outline. You can use the up and down arrows to see the match highlighted in the current file when there are multiple matches. To replace the text with something else, use the left arrow. |
| **Multiple selections**  | You can make multiple selections for small and simultaneous edits. The below commands are a common way to add more cursors and allow you to insert cursors below or above with ease.<br /><br /> - Option-Command-Down arrow or Ctrl-Alt-Down arrow<br /> - Option-Command-Up arrow or Ctrl-Alt-Up arrow<br /> - Press Option and click on an area or Press Ctrl-Alt and click on an area<br /> 
| **Formatting** | Format your files with a click of a button, powered by [sqlfmt](http://sqlfmt.com/). 
| **Git diff view**  | Ability to see what has been changed in a file before you make a pull request. 
| **dbt autocomplete**  |  There are four new types of autocomplete features to help you develop faster:<br />  - Use `ref` to autocomplete your model names<br /> - Use `source` to autocomplete your source name + table name<br /> - Use `macro` to autocomplete your arguments<br /> - Use `env var` to autocomplete env var 
| **Dark mode**  | Use dark mode in the Cloud IDE for a great viewing experience in low-light environments. 
| **DAG in the IDE** | You can see how models are used as building blocks from left to right to transform your data from raw sources into cleaned-up modular derived pieces and final outputs on the far right of the DAG. Double-click a node in the directed acyclic graph (DAG) to open that file in a new tab. Expand the DAG and use node selection syntax (select or exclude) to view a subset of your DAG. Note: The default view is +model+, however, you can change it to 2+model+2.  |
| **Status bar** | This area provides you with useful information about your IDE and project status. You also have additional options like restarting or [recloning your repo](/docs/collaborate/git/version-control-basics).

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

## Set up the Cloud IDE

:::info📌

New to dbt? Check out our [Getting Started guide](/docs/get-started/getting-started/overview) to build your first dbt project in the Cloud IDE!

:::

In order to start experiencing the great features of the Cloud IDE, you need to first set up your **Development environment** and **Development credentials.**

If you’re new to dbt, you will automatically add this during the project setup. However, if you have an existing dbt Cloud account, you may need to create a development environment and credentials manually to use the Cloud IDE.

Review the steps below to set up your development environment and credentials:

### Development environment

1. Create a development environment and choose **Deploy** and then **Environments** from the top left. Click **Create Environment**.

<Lightbox src="/img/docs/dbt-cloud/refresh-ide/new-environment.png" width="100" height="100" title="Creating a new environment for the Analytics project"/>

2. Enter an environment name that would help you identify it among your other environments (for example, `Nate's Development Environment`).
3. Choose **Development** as the **Environment Type**.
4. You can also select which **dbt Version** to use at this time. For compatibility reasons, we recommend that you select the same dbt version that you plan to use in your deployment environment.
5. Click **Save** to finish creating your **Development environment**.


<Lightbox src="/img/docs/dbt-cloud/refresh-ide/new-environment-fields.png" width="100" height="100" title="Creating a development environment"/>


### Developer credentials

The IDE uses developer credentials to connect to your data platform. These developer credentials should be specific to your user and they should *not* be super user credentials or the same credentials that you use for your production deployment of dbt.

Follow the below steps to set up your developer credentials:

1. Go to the [**Credentials**](https://cloud.getdbt.com/next/settings/profile#credentials) section.
2. Select the relevant project in the list.
3. Click **Edit** on the bottom right of the page
4. Enter your developer credentials and then click **Save.**

Great job, you should now be able to access the Cloud IDE by clicking **Develop** on the navigation to start developing!

<Lightbox src="/img/docs/dbt-cloud/refresh-ide/dev-credentials.png" width="100" height="100" title="Configure developer credentials in your Profile"/>

## Access the Cloud IDE

Now that you've set up your development environment and credentails, you should be able to access the Cloud IDE:

1. Log in with your [dbt Cloud account](https://cloud.getdbt.com/). If you don't have one, [sign up](https://www.getdbt.com/signup/) for an account for free.
2. Click **Develop** at the top of the page
3. Make sure you've already initialized your project
4. You're ready to start developing and [building models](https://docs.getdbt.com/docs/get-started/getting-started/building-your-first-project/build-your-first-models)!

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


## dbt Cloud IDE tips

### IDE Keyboard shortcuts

There are default keyboard shortcuts that can help make development more productive and easier for everyone.

- Command-O or Control-O to select a file to open
- Command-P or Control-P to see command palette
- Hold Option-click-on-an-area to select multiple lines and perform a multi-edit. You can also press Command-E to perform this operation on the command line.
- Press Fn-F1 to view a list of the other editor shortcuts
-  Command-Enter or Control-Enter to Preview your code
- Command-Shift-Enter or Control-Shift-Enter to Compile
- Highlight a portion of code and use the above shortcuts to Preview or Compile code
- Enter two underscores (__) in the IDE to reveal a list of dbt functions

### Package tips

- Use the [dbt_codegen](https://hub.getdbt.com/dbt-labs/codegen/latest/) package to help you generate YML files for your models and sources and SQL files for your staging models.
- The [dbt_utils](https://hub.getdbt.com/dbt-labs/dbt_utils/latest/) package contains macros useful for daily development. For example, `date_spine` generates a table with all dates between the ones provided as parameters.
- The [dbt_project_evaluator](https://hub.getdbt.com/dbt-labs/dbt_project_evaluator/latest) package compares your dbt project against a list of our best practices and provides suggestions and guidelines on how to update your models.
- The [dbt_expectations](https://hub.getdbt.com/calogica/dbt_expectations/latest) package contains many tests beyond those built into dbt Core.
- The [dbt_audit_helper](https://hub.getdbt.com/#:~:text=adwords-,audit_helper,-codegen) package lets you compare the output of 2 queries. Use it when refactoring existing logic to ensure that the new results are identical.
- The [dbt_artifacts](https://hub.getdbt.com/brooklyn-data/dbt_artifacts/latest) package saves information about your dbt runs directly to your data platform so that you can track the performance of models over time.
- The [dbt_meta_testing](https://hub.getdbt.com/tnightengale/dbt_meta_testing/latest) package checks that your dbt project is sufficiently tested and documented.

### Advanced tips

- Use your folder structure as your primary selector method. `dbt build --select marts.marketing` is simpler and more resilient than relying on tagging every model.
- Think about jobs in terms of build cadences and SLAs. Run models that have hourly, daily, or weekly build cadences together.
- Use the [where config](/docs/reference/resource-configs/where) for tests to test an assertion on a subset of records.
- [store_failures](/docs/reference/resource-configs/store_failures) lets you examine records that cause tests to fail, so you can either repair the data or change the test as needed.
- Use [severity](/docs/reference/resource-configs/severity) thresholds to set an acceptable number of failures for a test.
- Use [incremental_strategy](/docs/build/incremental-models#about-incremental_strategy) in your incremental model config to implement the most effective behavior depending on the volume of your data and reliability of your unique keys.
- Set `vars` in your `dbt_project.yml` to define global defaults for certain conditions, which you can then override using the `--vars` flag in your commands.
- Use [for loops](/docs/get-started/learning-more/using-jinja#use-a-for-loop-in-models-for-repeated-sql) in Jinja to [DRY](https://docs.getdbt.com/terms/dry) up repetitive logic, such as selecting a series of columns that all require the same transformations and naming patterns to be applied.
- Instead of relying on post-hooks, use the [grants config](/docs/reference/resource-configs/grants) to apply permission grants in the warehouse resiliently.
- Define [source-freshness](/docs/build/sources#snapshotting-source-data-freshness) thresholds on your sources to avoid running transformations on data that has already been processed.
- Use the `+` operator on the left of a model `dbt build --select +model_name` to run a model and all of its upstream dependencies. Use the `+` operator on the right of the model `dbt build --select model_name+` to run a model and everything downstream that depends on it.
- Use `dir_name` to run all models in a package or directory.
- Use the `@` operator on the left of a model in a non-state-aware CI setup to test it. This operator runs all of a selection’s parents and children, and also runs the parents of its children, which in a fresh CI schema will likely not exist yet.
- Use the [--exclude flag](/docs/reference/node-selection/exclude) to remove a subset of models out of a selection.
- Use [state and deferral](/docs/deploy/cloud-ci-job#deferral-and-state-comparison) to create a slim CI setup.
- Use the [--full-refresh](/docs/reference/commands/run#refresh-incremental-models) flag to rebuild an incremental model from scratch.
- Use [seeds](/docs/build/seeds) to create manual lookup tables, like zip codes to states or marketing UTMs to campaigns. `dbt seed` will build these from CSVs into your warehouse and make them `ref` able in your models.
- Use [target.name](/docs/build/custom-schemas#an-alternative-pattern-for-generating-schema-names) to pivot logic based on what environment you’re using. For example, to build into a single development schema while developing, but use multiple schemas in production.

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
