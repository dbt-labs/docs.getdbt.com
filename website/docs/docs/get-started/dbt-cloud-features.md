---
title: "dbt Cloud features"
id: "dbt-cloud-features"
---


:::info Join our Cloud IDE beta

Learn about what you can do with our [Cloud IDE beta](/docs/docs/get-started/develop-in-the-cloud#develop-in-the-cloud-ide-beta). Please [submit your expression of interest](https://docs.google.com/forms/d/e/1FAIpQLSdlU65gqTZPyGAUc16SkxqTc50NO9vdq_KGx1Mjm_4FB_97FA/viewform) to join our Cloud IDE beta group.

:::

The dbt Cloud [integrated development environment (IDE)](/docs/get-started/develop-in-the-cloud) allows you to build, test, run, and version control your dbt projects directly from your browser. The IDE is the fastest and most reliable way to deploy dbt, and provides a real-time editing and execution environment for your dbt project &mdash; no command line required. Anyone can use the IDE, from new dbt developers to seasoned practitioners.

With the Cloud IDE, you can:

- Write modular SQL models with select statements and the [ref()](/reference/dbt-jinja-functions/ref).
- Compile dbt code into SQL and execute it against your database directly.
- Test every model before deploying them to production.
- Generate and view documentation of your dbt project.
- Leverage [git and version-control your code](/docs/collaborate/git/version-control-basics) from your browser with a couple of clicks.
- Visualize a directed acyclic graph (DAG), [and more](/docs/get-started/dbt-cloud-tips)
- Use dark mode when you develop in the Cloud IDE.


### IDE features
The dbt Cloud IDE includes features that make it easier for you to develop, build, compile, run, and test your data models. Check out some of the features below to learn more:

**Find and replace**

Press Command-F or Ctrl-F to open the find and replace bar in the upper right corner of the current file in the IDE. The IDE highlights your search results in the current file and code outline. You can use the up and down arrows to see the match highlighted in the current file when there are multiple matches. To replace the text with something else, use the left arrow.

**Search across files**

You can quickly search over all files in the IDE on your current project. To search, open the search bar by pressing Command-O or Ctrl-O to find text across all files in your current project. and write your file name. You can view the results under the search text, which are grouped into files containing the match. You can click on the results to view it in the IDE.

**Keyboard shortcuts**

There are default keyboard shortcuts that can help make development more productive and easier for everyone. Press Fn-F1 to view a list of all of them.

**File explorer**

The File explorer on the left side of the IDE allows you to organize your project and manage your files and folders. Click the three dot menu associated with the file or folder to create, rename, and delete it.

### Features available in the Cloud IDE beta

**Format files**

Format your files with a click of a button, powered by [sqlfmt](http://sqlfmt.com/).

**File state indicators**

We have added file state indicators to make it clear when changes or actions have been made. The indicators M, U, and • appear to the right of your file or folder name and indicate the actions performed:
   * Unsaved (•) &mdash; The IDE detects unsaved changes to your file/folder
  * Modification (M) &mdash; The IDE detects a modification of existing files/folders have saved changes file or folder
  * Untracked (U) &mdash; The IDE detects changes made to new files or renamed files
  
**Build, test, and run code**

Build, test, and run your project with a click of a button, or using the Cloud IDE command bar.

**Drag and drop**

You can also drag and drop files located in the file explorer. Use the file breadcrumb on the top of the IDE for quick, linear navigation. You can access adjacent files in the same file by right clicking on the breadcrumb file.

**Organize tabs**

You can move your tabs around to reorganize your work in the IDE. You can also right click on a tab to view and select a list of actions to take.

**Multiple selections**

You can make multiple selections for quick and simultaneous edits. The below commands are a common way to add more cursors and allow you to insert cursors below or above with ease.

  * Option-Command-Down arrow
  * Option-Command-Up arrow
  * Press Option and click on an area

## Related docs
- [dbt Cloud tips](/docs/get-started/dbt-cloud-tips)
- [Develop in the Cloud](docs/get-started/develop-in-the-cloud)
- [Guides](/docs/get-started/getting-started/overview)
