---
title: "dbt Cloud features"
id: "dbt-cloud-features"
---

## dbt Cloud IDE

:::info Beta Feature
The revamped dbt Cloud IDE is now in beta! Check out the [IDE features](docs/dbt-cloud/cloud-ide/ide-beta), and [submit your expression of interest](https://docs.google.com/forms/d/e/1FAIpQLSdlU65gqTZPyGAUc16SkxqTc50NO9vdq_KGx1Mjm_4FB_97FA/viewform) to join the new Cloud IDE Beta group.

:::


The dbt Cloud [integrated development environment (IDE)](/docs/develop/develop-in-the cloud) allows you to build, test, run, and version control your dbt projects directly from your browser. The IDE is the fastest and most reliable way to deploy dbt, and provides a real-time editing and execution environment for your dbt project -- no command line required.  Anyone can use the IDE, from new dbt developers to seasoned practitioners.


## IDE features
The dbt Cloud IDE comes with new features, including snappier performance and exciting enhancements to make it easy for you to develop, build, compile, run and test data models!  Check out the new features below to learn more:

- Write modular SQL models with `select` statements and the [`ref()`](/docs.getdbt.com/reference/dbt-jinja-functions/ref) function.
- Compile dbt code into SQL and execute it against your database directly.
- Test every model before deploying them to production.
- Generate and view documentation of your dbt project.
- Leverage [git and version-control your code](/docs/collaborate/git/version-control-basics) from your browser with a couple of clicks.
- Visualize a directed acyclic graph (DAG), [and more](/docs/develop/dbt-cloud-tips)
- Use dark mode when you develop in the Cloud IDE

**Features available in the Cloud IDE beta**
  * Format: Format your files with a click of a button, powered by [sqlfmt](http://sqlfmt.com/)
  * File state indicators: We have added file state indicators to make it clear when changes or actions have been made. The indicators **M, U, and •** appear to the right of your file or folder name and indicate the actions performed:
       *  Unsaved **(•)** - The IDE detects unsaved changes to your file/folder
       *  Modification **(M)** - The IDE detects a modification of existing files/folders have saved changes file or folder
       *  Untracked **(U)** - The IDE detects changes made to new files or renamed files
  * Build, test and run your project with a click of a button, or using the Cloud IDE command bar.

