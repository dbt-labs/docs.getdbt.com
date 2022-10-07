---
title: "dbt Cloud features"
id: "dbt-cloud-features"
---

# dbt Cloud features

## **dbt Cloud IDE**

The dbt Cloud [integrated development environment (IDE)](/docs/develop/develop-in-ide) is where you can build, test, run, and version control your dbt projects directly from your browser. The IDE is the fastest and most reliable way to deploy dbt, and provides a real-time editing and execution environment for your dbt project -- no command line required.  Anyone can use the IDE, from new dbt developers to seasoned practitioners.

With the Cloud IDE, you can:

- Write modular SQL models with `select` statements and the [`ref()`](/docs.getdbt.com/reference/dbt-jinja-functions/ref) function.
- Compile dbt code into SQL and execute it against your database directly.
- Test every model before deploying them to production.
- Generate and view documentation of your dbt project.
- Leverage [git and version-control your code](/docs/collaborate/git/version-control-basics) from your browser with a couple of clicks.
- Create and test Python models.
- Compile Python models to see the full function that gets executed in the warehouse. You cannot preview python models currently.
- Visualize a directed acyclic graph (DAG), [and more](/docs/develop/dbt-cloud-tips).

## New Cloud IDE features

- **Version control**
    - [NOT BUILT YET] Git diff view: Ability to see what has been changed in a file before you make a pull request
    - [NOT BUILT YET] Merge conflict: Improve ways to deal with merge conflict
- **IDE organization**
    - **File state indicators:** The indicators **M, U, and •** appear to the right of your file or folder name. They indicate the action performed:
        - Unsaved (**•)** - The IDE detects unsaved changes to your file/folder
        - Modification (**M)** - The IDE detects a modification of existing files/folders have saved changes file or folder
        - Untracked (**U)** - The IDE detects changes made to new files or renamed files
- **IDE interaction**
    - Support for Python models
        - You can `compile` Python models to see what will ultimately get executed
        - You can see Python models in DAG in dbt version 1.3 and higher
    - [TESTING] Formatting: Ability to format your file powered by [sqlfmt](http://sqlfmt.com/)
    - [TESTING] Autocomplete:
        - [NEW] dbt autocomplete / intellisense: auto-fill model names in {{ ref ('model_name') }} or source or macro
        - snippet autocomplete: when you type __config, we drop in a snippet of code
        - text autocomplete: we should be able to reference/autofill anything that exists in the file
- [NOT BUILT YET] Dark mode for IDE


<!--- 
The dbt Integrated Development Environment (IDE) provides a realtime editing and execution environment for your dbt project. In the dbt IDE, you can write, run, test, and version control the code in your dbt project from your browser -- no command line use required.

**Prerequisites**:

You must have a dbt Cloud account to use the IDE. Consult the guide on [using the dbt IDE](using-the-dbt-ide). Don't have an account? You can get started for free [here](https://www.getdbt.com/signup).

## Compiling and Running SQL

In the dbt IDE, you can compile dbt code into SQL and execute it against your database directly. The IDE leverages the open-source [dbt server](rpc) to intelligently recompile only the parts of your project that have changed. This brings the cycle time for dbt project development down from minutes to seconds.

<Lightbox src="/img/docs/dbt-cloud/d6a75a5-Screen_Shot_2019-11-05_at_9.04.02_PM.png" title="Executing dbt SQL in the browser"/>

## Running Projects

In addition to compiling and executing SQL, you can also *run* dbt projects in the dbt IDE. Use dbt's [rich model selection syntax](node-selection/syntax) to [run dbt commands](dbt-commands) directly in your browser.

The dbt IDE updates in real-time as models, tests, seeds, and operations are run. If a model or tests fails, you can dig into the logs to find and fix the issue.

<Lightbox src="/img/docs/dbt-cloud/50e939e-Screen_Shot_2019-11-05_at_9.08.38_PM.png" title="Running jobs and viewing results in the dbt IDE"/>

## Version Control

Leverage git directly from the dbt IDE to version control your code from your browser. You can branch, commit, push, and pull code with a couple of clicks - no command line required.

<Lightbox src="/img/docs/dbt-cloud/8959807-Screen_Shot_2019-11-05_at_9.15.46_PM.png" title="Creating a new git branch in the IDE"/>

## Dark mode
As Ben Franklin once said:

> In matters of principle, stand like a rock; in matters of taste, swim with the current.

<Lightbox src="/img/docs/dbt-cloud/7adcb15-Screen_Shot_2019-11-05_at_9.35.48_PM.png" title="Now with 205% more Dark"/> ---> 
