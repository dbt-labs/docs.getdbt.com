---
title: "Develop in the new Cloud IDE Beta"
id: "ide-beta"
---



:::info Join our Beta

If you’d like to try the Beta dbt Cloud IDE for multi-tenant instances, please [sign up](https://docs.google.com/forms/d/e/1FAIpQLSdlU65gqTZPyGAUc16SkxqTc50NO9vdq_KGx1Mjm_4FB_97FA/viewform) to join the beta. To learn more about the beta, you can read this documentation.

:::


## Overview

The dbt Cloud integrated development environment (IDE) is where you can build, test, run, and version control your dbt projects directly from your browser. The IDE is the fastest and most reliable way to deploy dbt, and provides a real-time editing and execution environment for your dbt project -- no command line use required.

To develop in the dbt Cloud IDE, you need to meet these requirements:


- Your dbt project must be compatible with dbt v0.15.0. The dbt IDE is powered by the [dbt-rpc](https://github.com/dbt-labs/docs.getdbt.com/blob/beta-ide-refresh/website/docs/docs/dbt-cloud/cloud-ide/reference/commands/rpc) which was overhauled in dbt v0.15.0.
- You must have a [Developer License](dbt-cloud/access-control/cloud-seats-and-users) and have a multi-tenant instance.
- Your dbt repository (in dbt Cloud) must have write access enabled. See [Connecting your GitHub Account](docs/dbt-cloud/cloud-configuring-dbt-cloud/cloud-installing-the-github-application) and [Importing a project by git URL](docs/dbt-cloud/cloud-configuring-dbt-cloud/cloud-import-a-project-by-git-url) for detailed setup instructions.


The IDE is a single interface for building, testing, running, and version controlling dbt projects from your browser. Anyone can use the IDE, from new dbt developers to seasoned practitioners.


To use the dbt Cloud IDE, you need to log in with a dbt Cloud account and click  ‘**Develop**’ at the top of the page.

You can refer to [Getting Started with dbt Cloud](https://docs.getdbt.com/guides/getting-started) to quickly get set up and perform some key tasks. For more information, see the following articles.

- [What is dbt?](docs/introduction#what-else-can-dbt-do)
- [Building your first project](guides/getting-started/building-your-first-project)
- [dbt Learn courses](https://courses.getdbt.com/collections)
- [Using Git](https://docs.github.com/en/github/getting-started-with-github/using-git)

**Is there a cost to using the dbt Cloud IDE cost?** 

Not at all! You can use dbt Cloud when you sign up for the Free [Developer plan](https://www.getdbt.com/pricing/), which comes with one developer seat. If you’d like to access more features or have more developer seats, you can upgrade your account to the Team or Enterprise plan. See dbt [Pricing plans](https://www.getdbt.com/pricing/) for more details.

**How can I contribute to dbt Cloud?** 

We’d love for you to contribute! And whether it's a dbt package, a plugin, `dbt-core`, or this very documentation site, contributing to the open source code that supports the dbt ecosystem is a great way to level yourself up as a developer, and give back to the community. Our [Contributing](https://docs.getdbt.com/docs/contributing/oss-expectations) page provides more detail on what to expect when contributing to dbt open source software (OSS). 

**What is the difference between developing on the dbt Cloud IDE and on the CLI?**

There are two main ways to develop with dbt: using the web-based IDE in dbt Cloud or using the command line interface (CLI) in dbt Core.

**dbt Cloud IDE** - dbt Cloud is an application that allows you to develop dbt projects with the IDE, includes a purpose-built scheduler, and is an easy way to share dbt documentation with your team. You can build, test, run and version control your dbt projects directly from your browser. The IDE is the fastest and most reliable way to deploy dbt, and provides a real-time editing and execution environment for your dbt project

**dbt Core CLI** - The CLI uses [dbt Core](docs/introduction), an [open-source](https://github.com/dbt-labs/dbt) software that’s free to use. You can build your dbt project in a code editor, like Jetbrains or VSCode, and execute dbt commands using a terminal program. 

**What type of support is provided?** 

The global dbt Support team is happy to help and available to dbt Cloud customers by email or in-product live chat. 

If you have project-related or modeling questions, our dedicated [GitHub Discussions](https://docs.getdbt.com/docs/contributing/long-lived-discussions-guidelines) or [dbt Community Slack](http://getdbt.slack.com) are great resources to use as well.

## dbt Cloud IDE Features

The dbt Cloud IDE includes robust features to:

- Write modular SQL models with SELECT statements and the `ref()` function– dbt handles the chore of dependency management,
- Test every model prior to production, and share dynamically generated documentation with all data stakeholders,
- Deploy safely using dev environments. Git-enabled version control enables collaboration and a return to previous states.

**File and Replace** 

You can quickly find text and replace it in the file you have opened. Press ⌘F to open the Find and Replace widget in the IDE, and the search results will be highlighted in the editor and code outline. If there is more than one matched result in the currently opened file, you can press up and down arrows to head to the next or previous result in the widget.

**Search across files** 

You can quickly search over all files in the IDE on your current project. To search, press ⌘O and write your file name. The results will quickly appear in the results box under the search text and are grouped into files containing the search term.  You can click on one of the results to view it in the IDE.

**Keyboard shortcuts** 

The IDE has a robust selection of default keyboard shortcuts to make development more productive and easier for everyone. Press `fn + F1` on your keyboard to bring up a menu of the IDE shortcuts. 

**Multiple selections** 

The IDE supports multiple selections for quick and simultaneous edits. The below commands are a common way to add more cursors and allow you to insert cursors below or above with ease.

- **⌥⌘↓,**
- **⌥⌘↑,**
- **⌥ +** click on the area

<Lightbox src=“/img/docs/dbt-cloud/cloud-ide/multi-selector.gif” title="Multiple Selections"/>

**File Explorer** 

The IDE has a File Explorer, which allows you to organize your project and manage your files/folders. You can create, edit or delete files/folders by clicking the 3 dots in the File explorer section. You can also drag and drop files with ease and use the file breadcrumb for quick, linear navigation.

<Lightbox src=“/img/docs/dbt-cloud/cloud-ide/file-explorer.png” title=“File Explorer”/>

## Development in the dbt Cloud IDE

Developing in the IDE means you can compile dbt code into SQL and execute it against your database directly. The IDE leverages the open-source [dbt-rpc](https://docs.getdbt.com/reference/commands/rpc) to intelligently recompile only the parts of your project that have changed. This brings the cycle time for dbt project development down from minutes to seconds.

In dbt, SQL files can contain Jinja, a lightweight templating language. Using Jinja in SQL provides a way to use control structures (e.g. `if` statements and `for` loops) in your queries. It also enables repeated SQL to be shared through `macros`.

You can invoke dbt commands, compile jinja into query, preview data from warehouse, visualize a directed acyclic graph (DAG), and more!

**Hot and Cold Start**

There are two different types of startup processes for the IDE:

- **Cold start:** The process of accessing the IDE for the first time (in 3 hours). Cold starting the IDE can take about 30 seconds for load time. Behind the scene, dbt is provisioning a dedicated server for you to build a dbt project. After this step finishes, the IDE is ready for use. In the meantime, dbt is also starting up the dbt-rpc container to interact with dbt-core. You don’t need to wait for this to finish before the IDE is ready for edit.
- **Hot start:** The process of resuming an existing IDE session (within 3 hours of the last activity). Hot starting the IDE is much faster and takes less than 3 seconds for load time. The is because the environment is already available, and you’re simply resuming the session there.

These two startup processes are key performance metrics dbt Labs monitor to ensure consistent and reliable experiences.

**Work Retention**

The dbt Cloud IDE needs an explicit action to save your changes. There are three ways your work is stored:

1. **Unsaved, local code:** Any code you write will automatically be available in your browser storage. 
    
    So that means if you refresh the IDE → exit and come back → restart the development pod:
    
    1. You should be able to see your work.
    2. If you switch a branch, you will lose this work (with a warning).
    3. If you switch a browser (another laptop or browser), you will lose this work.
2. **Saved but uncommitted code:** This is treated like a local branch and when you save a file, the data gets stored in your "local" storage (EFS storage). Once you have saved code in the dbt Cloud IDE, you cannot switch to another branch:
    1. If you switch a branch, you will lose this work (with a warning).
3. **Committed code:** This is stored in the branch with git provider:
    1. You should be able to check out other (remote) branches without losing work

**Run Projects**

In addition to compiling and executing SQL, you can also *run* *and test* dbt projects directly in the dbt IDE using our ‘Build’ feature. You can use dbt's [rich model selection syntax](https://docs.getdbt.com/reference/node-selection/syntax) to [run dbt commands](https://docs.getdbt.com/reference/dbt-commands) directly in your browser, bringing convenience and control right to your fingertips. 

The IDE updates in real-time as models, tests, seeds, and operations are run. If a model or test fails, you can dig into the logs to find and fix the issue.

<Lightbox src=“/img/docs/dbt-cloud/using-dbt-cloud/cloud-ide/build.png” title=“Building”/>

**Lineage Tab**

When you develop in the IDE, the lineage tab visual adds more context to dependencies and directional flow. You get insight into how models are used as building blocks from left to right to transform your data from crude or normalized raw sources, into cleaned-up modular derived pieces, and finally into the final outputs on the far right of the DAG, ready to be used by the analyst in infinite combinations to present it in ways to help clients, customers, and organizations make better decisions.

**Command bar + Status** 

To type in commands and execute your code, you can use the command bar at the bottom of the IDE. Use dbt's [rich model selection syntax](https://docs.getdbt.com/reference/node-selection/syntax) to [run dbt commands](https://docs.getdbt.com/reference/dbt-commands) directly in your browser, bringing convenience and control right to your fingertips.  You can give it a try in your project and type `dbt run`, click **Enter.**

You can also view the history, status, and logs of previous runs by clicking the ‘History’ button to expand your options.

<Lightbox src="/img/docs/dbt-cloud/cloud-ide/command_bar.png" title="Command Bar"/>
          
The status icon on the bottom-right side of the IDE gives you an indicator of the health of your project. You can instantly identify any errors by clicking on the status icon to open up more details or Restart the IDE.

**Generating and Viewing documentation** 

To generate documentation (docs) in the IDE, type `docs generate` in the Command Bar in the IDE. This command will generate the docs for your dbt project as it exists in development in your IDE session. 

:::info Don’t worry about typing `dbt` at the start of your command. The IDE will automatically include the prefix ‘`dbt`’, allowing you to only type in the necessary command.
:::

Once you generate a successful run,  the dbt Cloud IDE makes it possible to view [documentation](https://docs.getdbt.com/docs/building-a-dbt-project/documentation) for your dbt project while your code is still in development. With this workflow, you can inspect and verify what your project's generated documentation will look like before your changes are released to production.

In the IDE, you can click the "View Docs" button on top of the File Explorer to see the latest version of your documentation rendered in a new browser window.

<Lightbox src="/img/docs/dbt-cloud/cloud-ide/view-docs.png" title="View Documentation"/>

## Version control in the dbt Cloud IDE

A [version control](https://en.wikipedia.org/wiki/Version_control) system allows you and your teammates to work collaboratively, safely, and simultaneously on a single project. Version control helps you track all the code changes made in the dbt Cloud IDE. 

When you develop in the dbt Cloud IDE, you can leverage Git directly to version control your code from your browser. This means you can branch, commit, push, and pull code with a couple of clicks - no command line required!

You can create a separate branch to develop and make changes. The changes aren’t merged into the main branch (master branch) unless it’s analyzed and tested, and as soon as it’s good to go the changes made can be merged to the main branch. This helps keep the code organized and improves productivity by making the development process smooth. It can be visualized as:

<Lightbox src="/img/docs/dbt-cloud/cloud-ide/git-overview.png" title="Git overview"/>

:::info In order to use version control when you Develop in the IDE, the project needs to be connected to a repository.
:::

**Common Git Terminology**

If you’re new to Git, familiarize yourself with common [Git terminology](https://docs.github.com/en/get-started/quickstart/github-glossary) used.

| Name | Definition |
| --- | --- |
| Repository or “repo” | A repository is a directory that stores all the files, folders, and content needed for your project. You can think of this as an object database of the project, storing everything from the files themselves to the versions of those files, commits, and deletions. Repositories are not limited by user, and can be shared and copied. |
| Branch | A branch is a parallel version of a repository. It is contained within the repository, but does not affect the primary or main branch allowing you to work freely without disrupting the "live" version. When you've made the changes you want to make, you can merge your branch back into the main branch to publish your changes. |
| Checkout | The checkout command is used to create a new branch, change your current working branch to a different branch, or switch to a different version of a file from a different branch. |
| Commit | A commit is a user’s change to a file (or set of files). When you make a commit to save your work, Git creates a unique ID that allows you to keep a record of the specific changes committed along with who made them and when. Commits usually contain a commit message which is a brief description of what changes were made. |
| Main | The primary, base branch of all repositories. All committed and accepted changes should be on the Main (or master) branch.  In the dbt Cloud IDE, the “Main” branch will be read-only. This is because any changes/edits to code cannot and should not be made directly in the base branch. A new branch should be created in order to make any changes to your project. |
| Merge | Merge takes the changes from one branch and adds them into another (usually main) branch. These commits are usually first requested via pull request before being merged by a maintainer. |
| Pull Request | If someone has changed code on a separate branch of a project and wants it to be reviewed to add to the main branch, they can submit a pull request. Pull requests ask the repo maintainers to review the commits made, and then, if acceptable, merge the changes upstream. A pull happens when adding the changes to the main branch. |
| Push | A push updates a remote branch with the commits made to the current branch. You are literally “pushing” your changes onto the remote. |
| Remote | This is the version of a repository or branch that is hosted on a server. Remote versions can be connected to local clones so that changes can be synced. |


**dbt Cloud Git IDE Button**

The git button in the dbt Cloud IDE allows you to apply the concept of version control to your project. This page provides descriptions of each git button command and what they do:

| Name | Actions |
| --- | --- |
| Abort merge | This option allows you to cancel a merge that had conflicts. Please note that all the changes will be reset, and this operation cannot be reverted, so make sure to commit or save all your changes before you start a merge. |
| Change branch | This option will allow you to change between branches (checkout)  |
| Commit and push | Committing is similar to "saving" any changes made within your repo. In the above situation, the changes being saved or committed are the initialization of the project. The required files and folders are being added. When you make changes to your code in the future, you'll need to commit them as well. This allows you to record what changes were made when they were made, and who made them. |
| Create new branch | This allows you to branch off of your base branch and edit your project. You’ll notice after initializing your project that the “master” or “main” branch will be read-only. This is because any changes/edits to code cannot and should not be made directly in the base branch. A new branch should be created in order to make any changes to your project. |
| Initialize your project | This is done when first setting up your project. Initializing a project will create all required directories and files within an empty repository. Note: This option will not display if your repo isn't completely empty (i.e. includes a README file). Once you click "initialize your project" you'll want to click "commit" to finish setting up your project. |
| Open pull request | This allows you to open a pull request in your git provider for peers to review changes before merging into the base branch. |
| Pull changes from master/main | This option will be available if you are on any local branch that is behind the remote version of the base branch or the remote version of the branch that you're currently on. |
| Pull from remote | This option will be available if you’re on the local base branch and changes have recently been pushed to the remote version of the branch. As such, pulling in changes from the remote repo will allow you to pull in the most recent version of the base branch. |
| Reclone Your Repository | This allows you to reset your repository back to a fresh clone from your remote. You can use this option when you need to reclone your repo or if there are any git-related errors you’re experiencing in the dbt Cloud IDE. |
| Refresh git state | This enables you to pull new branches from a different remote branch to your local branch with just one command.   |
