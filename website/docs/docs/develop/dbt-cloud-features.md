---
title: "dbt Cloud features"
id: "dbt-cloud-features"
---

# dbt Cloud features

## **dbt Cloud IDE**

:::info 📌

The Cloud IDE refresh is now available for General Availability and includes performance upgrades, ergonomics improvements, and some delightful enhancements! Review the [new Cloud IDE features](docs/develop/dbt-cloud-features#new-cloud-ide-features) to learn more.

:::

The dbt Cloud [integrated development environment (IDE)](/docs/develop/develop-in-ide) allows you to build, test, run, and version control your dbt projects directly from your browser. The IDE is the fastest and most reliable way to deploy dbt, and provides a real-time editing and execution environment for your dbt project -- no command line required.  Anyone can use the IDE, from new dbt developers to seasoned practitioners.

With the Cloud IDE, you can:

- Write modular SQL models with `select` statements and the [`ref()`](/docs.getdbt.com/reference/dbt-jinja-functions/ref) function.
- Compile dbt code into SQL and execute it against your database directly.
- Test every model before deploying them to production.
- Generate and view documentation of your dbt project.
- Leverage [git and version-control your code](/docs/collaborate/git/version-control-basics) from your browser with a couple of clicks.
- Create and test Python models.
- Compile Python models to see the full function that gets executed in the warehouse. You cannot preview python models currently.
- Visualize a directed acyclic graph (DAG), [and more](/docs/develop/dbt-cloud-tips).

### IDE features
The dbt Cloud IDE comes with new features, including snappier performance and exciting enhancements to make it easy for you to develop, build, compile, run and test data models!  Check out the new features below to learn more:


- **Version control**
    - [NOT BUILT YET] Git diff view: Ability to see what has been changed in a file before you make a pull request
    - [NOT BUILT YET] Merge conflict: Improve ways to deal with merge conflict
- **IDE organization**
    - **File state indicators:** We have added file state indicators to make it clear when changes or actions have been made. The indicators **M, U, and •** appear to the right of your file or folder name and indicate the actions performed:
        - Unsaved **(•)** - The IDE detects unsaved changes to your file/folder
        - Modification **(M)** - The IDE detects a modification of existing files/folders have saved changes file or folder
        - Untracked **(U)** - The IDE detects changes made to new files or renamed files
- **IDE interaction**
    - The Cloud IDE now has built-in support for Python models. This means:
        - You can `compile` Python models to see what will ultimately get executed
        - You can see Python models in DAG in dbt version 1.3 and higher
    - Formatting: Ability to format your file powered by [sqlfmt](http://sqlfmt.com/)
    - [TESTING] Autocomplete:
        - [NEW] dbt autocomplete / intellisense: auto-fill model names in {{ ref ('model_name') }} or source or macro
        - Snippet autocomplete: when you type __config, we drop in a snippet of code
        - Text autocomplete: we should be able to reference/autofill anything that exists in the file
- [NOT BUILT YET] Dark mode for IDE

To stay up to date with any new features, check out our [what what](url)
