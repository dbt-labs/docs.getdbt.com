---
title: "Version control in the dbt Cloud IDE"
id: version-control-ide
---

A [version control](https://en.wikipedia.org/wiki/Version_control) system allows you and your teammates to work collaboratively, safely, and simultaneously on a single project. Version control helps you track all the code changes made in the dbt Cloud IDE. 

When you develop in the dbt Cloud IDE, you can leverage Git directly to version control your code from your browser. This means you can branch, commit, push, and pull code with a couple of clicks - no command line required!

You can create a separate branch to develop and make changes. The changes aren’t merged into the main branch (master branch) unless it’s analyzed and tested, and as soon as it’s good to go the changes made can be merged to the main branch. This helps keep the code organized and improves productivity by making the development process smooth. It can be visualized as:

<p align="center">
<Lightbox src="/img/docs/dbt-cloud/cloud-ide/git-overview.png" title: "Git Workflow />
</p>
                                                                       
::: info Note: In order to use version control when you Develop in the IDE, the project needs to be connected to a repository. 
:::
                                                                       
**dbt Cloud Git IDE Button**
The git button in the IDE allows you to apply the concept of version control to your project. This page provides descriptions of each git button command and what they do:

| Name | Actions |
| --- | --- |
| Repository | It can be thought of as a database of changes. It contains all the edits and historical versions (snapshots) of the project. |
| Initialize your project | This is done when first setting up your project. Initializing a project will create all required directories and files within an empty repository. Note: This option will not display if your repo isn't completely empty (i.e. includes a README file).Once you click "initialize your project" you'll see the following in your IDE. Click "commit" to finish setting up your project. |
| Commit and push | Committing is similar to "saving" any changes made within your repo. In the above situation, the changes being saved or committed are the initialization of the project. The required files and folders are being added. When you make changes to your code in the future, you'll need to commit them as well. This allows you to record what changes were made when they were made, and who made them. |
| Pull changes from master/main | This option will be available if you are on any local branch that is behind the remote version of the base branch or the remote version of the branch that you're currently on. |
| Create new branch | This allows you to branch off of your base branch and edit your project. You’ll notice after initializing your project that the “master” or “main” branch will be read-only. This is because any changes/edits to code cannot and should not be made directly in the base branch. A new branch should be created in order to make any changes to your project. |
| Open pull request | This allows you to open a pull request in your git provider for peers to review changes before merging into the base branch. |
| Pull from remote | This option will be available if you’re on the local base branch and changes have recently been pushed to the remote version of the branch. As such, pulling in changes from the remote repo will allow you to pull in the most recent version of the base branch. |
| Change branch | This option will allow you to change between branches (checkout)  |
| Refresh git state | This enables you to pull new branches from a different remote branch to your local branch with just one command.   |
| Abort merge | This option allows you to cancel a merge that had conflicts. Please note that all the changes will be reset, and this operation cannot be reverted, so make sure to commit or save all your changes before you start a merge. |
| Reclone Your Repository | This allows you to reset your repository back to a fresh clone from your remote. You can use this option when you need to reclone your repo or if there are any git-related errors you’re experiencing in the dbt Cloud IDE. |
