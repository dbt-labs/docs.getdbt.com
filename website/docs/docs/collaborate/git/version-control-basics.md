---
title: "Version control basics"
id: version-control-basics
description: "Leverage Git to version control your code."
sidebar_label: "Version control basics"
---

# Version control basics

:::info 📌 

To use version control, make sure you are connected to a Git repository in the Cloud IDE. To use version control, make sure you are connected to a Git repository in the IDE.

:::

A [version control](https://en.wikipedia.org/wiki/Version_control) system allows you and your teammates to work collaboratively, safely, and simultaneously on a single project. Version control helps you track all the code changes made in the [Cloud IDE](/docs/develop/develop-in-the-cloud).

When you develop in the Cloud IDE, you can leverage Git directly to version control your code from your browser. This means you can branch, commit, push, and pull code with a couple of clicks - no command line required!

You can create a separate branch to develop and make changes. The changes you make aren’t merged into the main branch unless it successfully passes tests. This helps keep the code organized and improves productivity by making the development process smooth.

![Git overview](https://docs.getdbt.com/img/docs/dbt-cloud/cloud-ide/git-overview.png)

## Git overview

Check out some common git terms below that you might encounter when developing:

| Name | Definition |
| --- | --- |
| Repository or repo | A repository is a directory that stores all the files, folders, and content needed for your project. You can think of this as an object database of the project, storing everything from the files themselves to the versions of those files, commits, and deletions. Repositories are not limited by user and can be shared and copied. |
| Branch | A branch is a parallel version of a repository. It is contained within the repository but does not affect the primary or main branch allowing you to work freely without disrupting the live version. When you've made the changes you want to make, you can merge your branch back into the main branch to publish your changes |
| Checkout | The `checkout` command is used to create a new branch, change your current working branch to a different branch, or switch to a different version of a file from a different branch. |
| Commit | A commit is a user’s change to a file (or set of files). When you make a commit to save your work, Git creates a unique ID that allows you to keep a record of the specific changes committed along with who made them and when. Commits usually contain a commit message which is a brief description of what changes were made. |
| main | The primary, base branch of all repositories. All committed and accepted changes should be on the main branch. In the Cloud IDE, the main branch is read-only. This is because any changes/edits to code cannot and should not be made directly in the base branch. A new branch should be created in order to make any changes to your project |
| Merge | Merge takes the changes from one branch and adds them into another (usually main) branch. These commits are usually first requested via pull request before being merged by a maintainer. |
| Pull Request | If someone has changed code on a separate branch of a project and wants it to be reviewed to add to the main branch, they can submit a pull request. Pull requests ask the repo maintainers to review the commits made, and then, if acceptable, merge the changes upstream. A pull happens when adding the changes to the main branch. |
| Push | A `push` updates a remote branch with the commits made to the current branch. You are literally _pushing_ your changes into the remote. |
| Remote | This is the version of a repository or branch that is hosted on a server. Remote versions can be connected to local clones so that changes can be synced. |


## The git button in the Cloud IDE

You can perform git tasks with the git button in the Cloud IDE. The following are descriptions of each git button command and what they do:


| Name | Actions |
| --- | --- |
| Abort merge | This option allows you to cancel a merge that had conflicts. Be careful with this action because all changes will be reset and this operation can't be reverted, so make sure to commit or save all your changes before you start a merge. |
| Change branch | This option allows you to change between branches (checkout). |
| Commit and push | Committing is similar to saving any changes made within your repo. In the above situation, the changes being saved or committed are the initialization of the project. The required files and folders are being added. When you make changes to your code in the future, you'll need to commit them as well. This allows you to record what changes were made when they were made, and who made them. |
| Create new branch | This allows you to branch off of your base branch and edit your project. You’ll notice after initializing your project that the main branch will be read-only. This is because any changes to code cannot and should not be made directly in the base branch. A new branch should be created in order to make any changes to your project. |
| Initialize your project | This is done when first setting up your project. Initializing a project creates all required directories and files within an empty repository by using the dbt starter project. <br></br> Note: This option will not display if your repo isn't completely empty (i.e. includes a README file). <br></br> Once you click **Initialize your project**, click **Commit** to finish setting up your project. |
| Open pull request | This allows you to open a pull request in Git for peers to review changes before merging into the base branch. |
| Pull changes from master/main | This option is available if you are on any local branch that is behind the remote version of the base branch or the remote version of the branch that you're currently on. |
| Pull from remote | This option is available if you’re on the local base branch and changes have recently been pushed to the remote version of the branch. As such, pulling in changes from the remote repo will allow you to pull in the most recent version of the base branch. |
| Reclone Your Repository | Reclone your repository directly from the dbt IDE and your browser. You can reset your repository back to a fresh clone from your remote, you will want to click on the bottom right-hand side green **Ready** text, then click on the **Reclone Repo** selection.  |
| Refresh git state | This enables you to pull new branches from a different remote branch to your local branch with just one command. |


## Merge conflicts

Merge conflicts often occur when multiple users are concurrently making edits to the same section in the same file. This makes it difficult for Git to determine which change should be kept. 

Refer to [resolve merge conflicts](/docs/collaborate/git/resolve-merge-conflicts) to learn how to resolve merge conflicts.

## The .gitignore file

dbt Labs recommends that you exclude files so they're not tracked by Git and won't slow down your dbt project. 

You can do this with a special file named [.gitignore](https://github.com/dbt-labs/dbt-starter-project/blob/main/.gitignore) which is automatically included in your dbt project after you initialize it in dbt Cloud.  The `.gitignore` file must be placed at the root of your dbt project.
