---
title: "dbt Cloud features"
id: "dbt-cloud-features"
---

## dbt Cloud IDE

:::info 📌

The new Cloud IDE will be available for General Availability by end of October 2022. The new Cloud IDE and includes performance upgrades, ergonomics improvements, and some delightful enhancements! Review the [new Cloud IDE features](#ide-features) and check out [Nate's blog link](URL) to stay up to date with any new enhancements.

:::

The dbt Cloud [integrated development environment (IDE)](/docs/get-started/develop-in-the-cloud) allows you to build, test, run, and version control your dbt projects directly from your browser. The IDE is the fastest and most reliable way to deploy dbt, and provides a real-time editing and execution environment for your dbt project -- no command line required.  Anyone can use the IDE, from new dbt developers to seasoned practitioners.

With the Cloud IDE, you can:

- Write modular SQL models with `select` statements and the [`ref()`](/reference/dbt-jinja-functions/ref) function.
- Compile dbt code into SQL and execute it against your database directly.
- Test every model before deploying them to production.
- Generate and view documentation of your dbt project.
- Leverage [git and version-control your code](/docs/collaborate/git/version-control-basics) from your browser with a couple of clicks.
- Create and test Python models:
        * You can `compile` Python models to see what will ultimately get executed
        * You can see Python models in DAG in dbt version 1.3 and higher
- Compile Python models to see the full function that gets executed in the warehouse. You cannot preview python models currently.
- Visualize a directed acyclic graph (DAG), [and more](/docs/get-started/dbt-cloud-tips).

## IDE features
The dbt Cloud IDE comes with new features, including snappier performance and exciting enhancements to make it easy for you to develop, build, compile, run and test data models!  Check out the new features below to learn more:

- File state indicators
  * We have added file state indicators to make it clear when changes or actions have been made. The indicators **M, U,** and **•** appear to the right of your file or folder name and indicate the actions performed:
    *  Unsaved **(•)** &mdash; The IDE detects unsaved changes to your file/folder
    *  Modification **(M)** &mdash; The IDE detects a modification of existing files/folders have saved changes file or folder
    *  Untracked **(U)** &mdash; The IDE detects changes made to new files or renamed files

- Build, test, and run your project with a click of a button, or using the Cloud IDE command bar.

- Drag and drop
  * You can also drag and drop files located in the file explorer. Use the file breadcrumb on the top of the IDE for quick, linear
  navigation. You can access adjacent files in the same file by right clicking on the breadcrumb file.
  
- Organize tabs
  * You can move your tabs around to reorganize your work in the IDE. You can also right click on a tab to view and select a list of actions
  to take.

- Multiple selections
  * You can make multiple selections for quick and simultaneous edits. The below commands are a common way to add more cursors and allow you to insert
  cursors below or above with ease.

     * Option-Command-Down arrow
     * Option-Command-Up arrow
     * Press Option and click on an area

### Additional features coming soon
The exciting new features below will be made available to all users by November 2022 (Note: Cloud IDE beta users may have these features made available earlier). To stay up to date with any new features, check out our [what what](URL):

WILL MAKE A TABLE OUT OF THE BELOW SO PLEASE SEE THE BELOW AS A WIP

- Version control
   * Git diff view: Ability to see what has been changed in a file before you make a pull request
  
- IDE interaction
    * Formatting: Format your files with a click of a button, powered by [sqlfmt](http://sqlfmt.com/)
    * Autocomplete:
        * [not new] Snippet autocomplete: When you type __config, we drop in a snippet of code 
        * [not new] Text autocomplete: we should be able to reference/autofill anything that exists in the file
        * [new] dbt autocomplete: there are four types
            * ref --> autocomplete your model names
            * source --> autocomplete your source name + table name
            * macro --> autocomplete your arguments
            * env var --> autocomplete env var

## Related docs
- [dbt Cloud tips](/docs/get-started/dbt-cloud-tips)
- [Develop in the Cloud](docs/get-started/develop-in-the-cloud)
- [Guides](/docs/get-started/overview)
