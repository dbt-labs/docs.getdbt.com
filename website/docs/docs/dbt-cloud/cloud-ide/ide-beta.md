---
title: "Develop in the dbt Cloud IDE (beta)"
id: "ide-beta"
---



:::info Join our beta

If you’d like to try the dbt Cloud IDE for multi-tenant instances, please [sign up](https://docs.google.com/forms/d/e/1FAIpQLSdlU65gqTZPyGAUc16SkxqTc50NO9vdq_KGx1Mjm_4FB_97FA/viewform) to join the beta. To learn more about the beta features, you can read this documentation.

:::

## Overview

The dbt Cloud integrated development environment (IDE) is where you can build, test, run, and version control your dbt projects directly from your browser. The IDE is the fastest and most reliable way to deploy dbt, and provides a real-time editing and execution environment for your dbt project -- no command line use required.

To develop in dbt Cloud IDE (beta), you need to meet these requirements:


- Your dbt project must be compatible with dbt v0.15.0. The dbt IDE is powered by the [dbt-rpc](reference/commands/rpc) which was overhauled in dbt v0.15.0.
- You must have a [Developer License](/docs/collaborate/manage-access/seats-and-users).  
- Currently only multi-tenant instances of dbt Cloud can develop in the updated beta version of the Cloud IDE. Single-tenant instances will soon be able to opt into this Beta release.
- Your dbt repository (in dbt Cloud) must have `write` access enabled. See [Connecting your GitHub Account](/docs/collaborate/git/connect-github) and [Importing a project by git URL](/docs/collaborate/git/import-a-project-by-git-url) for detailed setup instructions.


The IDE is a single interface for building, testing, running, and version controlling dbt projects from your browser. Anyone can use the IDE, from new dbt developers to seasoned practitioners.


To use the dbt Cloud IDE, you need to log in with a dbt Cloud account and click  **Develop** at the top of the page.

You can refer to [Getting Started with dbt Cloud](/docs/get-started/getting-started/set-up-dbt-cloud) to quickly get set up and perform some key tasks. For more information, see the following articles:

- [What is dbt?](docs/introduction#what-else-can-dbt-do)
- [Building your first project](/docs/get-started/getting-started/building-your-first-project)
- [dbt Learn courses](https://courses.getdbt.com/collections)
- [Using Git](https://docs.github.com/en/github/getting-started-with-github/using-git)

**Is there a cost to using the dbt Cloud IDE?**

Not at all! You can use dbt Cloud when you sign up for the Free [Developer plan](https://www.getdbt.com/pricing/), which comes with one developer seat. If you’d like to access more features or have more developer seats, you can upgrade your account to the Team or Enterprise plan. See dbt [Pricing plans](https://www.getdbt.com/pricing/) for more details.

**Can I be a contributor to dbt Cloud?**

Anyone can contribute to the dbt project. And whether it's a dbt package, a plugin, dbt-core, or this documentation site, contributing to the open source code that supports the dbt ecosystem is a great way to level yourself up as a developer, and give back to the community. See [Contributing](/docs/contributing/oss-expectations) for details on what to expect when contributing to the dbt open source software (OSS).

**What is the difference between developing on the dbt Cloud IDE and on the CLI?**

There are two main ways to develop with dbt: using the web-based IDE in dbt Cloud or using the command-line interface (CLI) in dbt Core.

- **dbt Cloud IDE** - dbt Cloud is a Web-based application that allows you to develop dbt projects with the IDE, includes a purpose-built scheduler, and provides an easier way to share your dbt documentation with your team. The IDE is a faster and more reliable way to deploy your dbt models, and provides a real-time editing and execution environment for your dbt project.

- **dbt Core CLI** - The CLI uses [dbt Core](docs/introduction), an [open-source](https://github.com/dbt-labs/dbt) software that’s freely available. You can build your dbt project in a code editor, like Jetbrains or VSCode, and run dbt commands from the command line.

**What type of support is provided with dbt Cloud?**

The global dbt Support team is available to help dbt Cloud users by email or in-product live chat. Developer and Team accounts offer 24x5 support, while Enterprise customers have priority access and options for custom coverage.

If you have project-related or modeling questions, you can use our dedicated [Community Forum](/community/forum) to get help as well.

## dbt Cloud IDE features

With dbt Cloud IDE, you can:

- Write modular SQL models with `select` statements and the [`ref()`](/reference/dbt-jinja-functions/ref) function
- Test every model before deploying them to production
- Share the generated documentation of your models with all data stakeholders
- Deploy safely using development environments like how git-enabled version control enables collaboration and a return to previous states


**Find and replace**

Press Command-F or Ctrl-F to open the find and replace bar in the upper right corner of the current file in the IDE.  The IDE highlights your search results in the current file and code outline. You can use the up and down arrows to see the match highlighted in the current file when there are multiple matches. To replace the text with something else, use the left arrow.

**Search across files**

You can quickly search over all files in the IDE on your current project. To search, open the search bar by pressing Command-O or Ctrl-O to find text across all files in your current project. and write your file name. You can view the results under the search text, which are grouped into files containing the match. You can click on the results to view it in the IDE.

**Keyboard shortcuts**

There are default keyboard shortcuts that can help make development more productive and easier for everyone. Press Fn-F1 to view a list of all of them.

**Multiple selections**

You can make multiple selections for quick and simultaneous edits. The below commands are a common way to add more cursors and allow you to insert cursors below or above with ease.

- Option-Command-Down arrow
- Option-Command-Up arrow
- Press Option and click on an area

<Lightbox src="/img/docs/dbt-cloud/cloud-ide/multi-selector.gif" title="Multiple Selections"/>

**File explorer**

The File explorer on the left side of the IDE allows you to organize your project and manage your files and folders. Click the three dot menu associated with the file or folder to  create, rename, and delete it.  

**Drag and drop**

You can also drag and drop files located in the file explorer. Use the file breadcrumb on the top of the IDE for quick, linear navigation. You can access adjacent files in the same file by right clicking on the breadcrumb file.

<Lightbox src="/img/docs/dbt-cloud/cloud-ide/file-explorer.png" title="File Explorer"/>

**Organize tabs**

You can move your tabs around to reorganize your work in the IDE. You can also right click on a tab to view and select a list of actions to take.

<Lightbox src="/img/docs/dbt-cloud/cloud-ide/tab-options.png" title="Tab options"/>

## Development in the dbt Cloud IDE Beta

With the IDE, you can compile dbt code into SQL and run it against your database directly. It leverages the open-source [dbt-rpc](/reference/commands/rpc) plugin to intelligently recompile only the changes  in your project.

The dbt Cloud IDE Beta brings the startup and interaction time for dbt project development down from minutes to seconds.

In dbt, SQL files can contain Jinja, a lightweight templating language. Using Jinja in SQL provides a way to use control structures (e.g. `if` statements and `for` loops) in your queries. It also lets you share SQL code through `macros`.

You can invoke dbt commands, compile jinja into query, preview data from the warehouse, visualize a directed acyclic graph (DAG), and more.

**Hot and cold start**

You can launch the dbt Cloud IDE from a cold start or a hot start.

- **Cold start** -- The process of starting an IDE session for the first time. Cold starting the IDE can take about 30 seconds to load. Behind the scene, dbt is provisioning a dedicated server for you to build a dbt project. After this step finishes, the IDE is ready for use. In the meantime, dbt is also starting up the dbt-rpc container to interact with dbt-core. You don’t need to wait for this to finish before the IDE is ready for editing.

- **Hot start** -- The process of resuming an existing IDE session (within 3 hours of the last activity). Hot starting is faster and takes less than 3 seconds to load. This is because the environment is already available and you’re simply resuming your session.

dbt Labs closely monitors these two start modes as key performance metrics to help ensure consistent and reliable experiences.

**Work retention**

You must save your work to avoid losing it. The dbt Cloud IDE needs an explicit action to save your changes. There are three ways your work is stored:

- **Unsaved, local code** --  Any code you write is automatically  available from your browser’s storage. You can see your changes but will lose it if you switch branches or browsers (another device or browser).
- **Saved but uncommitted code** -- When you save a file, the data gets stored in your local storage (EFS storage). If you switch branches but don’t _commit_ your saved changes, you will lose your changes.
- **Committed code** -- Your git branch repository contains all your changes. You can check out other branches or switch browsers without losing your changes.


**Run projects**

You can also *build*, *run* *and test* dbt projects directly in the dbt IDE using our ‘Build’ feature. You can use dbt's [rich model selection syntax](https://docs.getdbt.com/reference/node-selection/syntax) to [run dbt commands](https://docs.getdbt.com/reference/dbt-commands) directly within dbt Cloud.

The IDE updates in real-time as models, tests, seeds, and operations are run. If a model or test fails, you can review  the logs to find and fix the issue.

<Lightbox src="/img/docs/dbt-cloud/cloud-ide/build.png" title="Building"/>

**Lineage tab**

The visual in the Lineage tab adds more context to your dependencies and directional flow.

You get to see how models are used as building blocks from left to right to transform your data from crude or normalized raw sources, into cleaned-up modular derived pieces, and finally into the final outputs on the far right of the DAG, ready to be used by the analyst in infinite combinations to present it in ways to help clients, customers, and organizations make better decisions.

You can access files in the lineage tab by double clicking on a particular model.

**Command bar + status**

You can enter and run commands from the command bar at the bottom of the IDE.  Use the [rich model selection syntax](/reference/node-selection/syntax) to [run dbt commands](/reference/dbt-commands) directly within dbt Cloud. You can also view the history, status, and logs of previous runs by clicking **History**.

:::info Note

For your convenience, dbt Cloud automatically includes ‘`dbt`’ as a prefix to your command so you don’t need to enter it. You can also type the ‘`dbt`’ prefix in your command.
:::


The status icon on the lower right corner of the IDE gives you an indicator of the health of your project. You can identify errors by clicking on the status icon for more details or by clicking **Restart the IDE**.

**Generating and viewing documentation**

To generate your project’s documentation (docs) in the IDE, enter `docs generate` or `dbt docs generate` in the command bar.  This command generates the docs for your dbt project as it currently exists in development.

After you generate a successful run, you can view your [documentation](https://docs.getdbt.com/docs/building-a-dbt-project/documentation) for your dbt project in real time. You can inspect and verify what your project's documentation will look like before you deploy your changes to production.

Click **View Docs** on top of the file explorer to see the latest version of your documentation rendered in a new browser window.

<Lightbox src="/img/docs/dbt-cloud/cloud-ide/view-docs.png" title="View Documentation"/>

## Version control basics

A [version control](https://en.wikipedia.org/wiki/Version_control) system allows you and your teammates to work collaboratively, safely, and simultaneously on a single project. Version control helps you track all the code changes made in the dbt Cloud IDE.

When you develop in the dbt Cloud IDE, you can leverage Git directly to version control your code from your browser. This means you can branch, commit, push, and pull code with a couple of clicks - no command line required!

You can create a separate branch to develop and make changes. The changes you make aren’t merged into the main branch unless it successfully passes tests. This helps keep the code organized and improves productivity by making the development process smooth.

<Lightbox src="/img/docs/dbt-cloud/cloud-ide/git-overview.png" title="Git overview"/>

:::info Note
To use version control, make sure you are connected to a Git repository in the IDE.
:::

**Common git terms**


| Name | Definition |
| --- | --- |
| Repository or repo | A repository is a directory that stores all the files, folders, and content needed for your project. You can think of this as an object database of the project, storing everything from the files themselves to the versions of those files, commits, and deletions. Repositories are not limited by user, and can be shared and copied.|
| Branch | A branch is a parallel version of a repository. It is contained within the repository, but does not affect the primary or main branch allowing you to work freely without disrupting the _live_ version. When you've made the changes you want to make, you can merge your branch back into the main branch to publish your changes |
| Checkout | The checkout command is used to create a new branch, change your current working branch to a different branch, or switch to a different version of a file from a different branch. |
| Commit | A commit is a user’s change to a file (or set of files). When you make a commit to save your work, Git creates a unique ID that allows you to keep a record of the specific changes committed along with who made them and when. Commits usually contain a commit message which is a brief description of what changes were made. |
| Main | The primary, base branch of all repositories. All committed and accepted changes should be on the Main (or master) branch. In the dbt Cloud IDE, the “Main” branch will be read-only. This is because any changes/edits to code cannot and should not be made directly in the base branch. A new branch should be created in order to make any changes to your project |
| Merge | Merge takes the changes from one branch and adds them into another (usually main) branch. These commits are usually first requested via pull request before being merged by a maintainer. |
| Pull Request | If someone has changed code on a separate branch of a project and wants it to be reviewed to add to the main branch, they can submit a pull request. Pull requests ask the repo maintainers to review the commits made, and then, if acceptable, merge the changes upstream. A pull happens when adding the changes to the main branch. |
| Push | A push updates a remote branch with the commits made to the current branch. You are literally “pushing” your changes onto the remote. |
| Remote | This is the version of a repository or branch that is hosted on a server. Remote versions can be connected to local clones so that changes can be synced. |


**The Git button in the IDE**

The git button in the dbt Cloud IDE allows you to apply the concept of version control to your project. This page provides descriptions of each git button command and what they do:

| Name | Actions |
| --- | --- |
| Abort merge | This option allows you to cancel a merge that had conflicts. Please note that all the changes will be reset, and this operation cannot be reverted, so make sure to commit or save all your changes before you start a merge. |
| Change branch | This option will allow you to change between branches (checkout).  |
| Commit and push | Committing is similar to saving any changes made within your repo. In the above situation, the changes being saved or committed are the initialization of the project. The required files and folders are being added. When you make changes to your code in the future, you'll need to commit them as well. This allows you to record what changes were made when they were made, and who made them. |
| Create new branch | This allows you to branch off of your base branch and edit your project. You’ll notice after initializing your project that the “main  branch will be read-only. This is because any changes to code cannot and should not be made directly in the base branch. A new branch should be created in order to make any changes to your project. |
| Initialize your project | This is done when first setting up your project. Initializing a project creates all required directories and files within an empty repository. Note: This option will not display if your repo isn't completely empty (i.e. includes a README file). Once you click **initialize your project** you'll want to click **commit** to finish setting up your project. |
| Open pull request | This allows you to open a pull request in Git for peers to review changes before merging into the base branch.|
| Pull changes from master/main | This option is available if you are on any local branch that is behind the remote version of the base branch or the remote version of the branch that you're currently on. |
| Pull from remote | This option is available if you’re on the local base branch and changes have recently been pushed to the remote version of the branch. As such, pulling in changes from the remote repo will allow you to pull in the most recent version of the base branch. |
| Reclone Your Repository | This allows you to reset your repository back to a fresh clone from your remote. You can use this option when you need to reclone your repo or if there are any git-related errors you’re experiencing in the dbt Cloud IDE. Reclone your repository is not available in the beta launch |
| Refresh git state | This enables you to pull new branches from a different remote branch to your local branch with just one command.  |
