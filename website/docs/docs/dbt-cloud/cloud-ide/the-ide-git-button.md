---
title: "The IDE Git Button"
---

The git button in the IDE allows you to apply the concept of [version control](dbt-cloud/cloud-ide/the-dbt-ide#version-control) to your project. This page provides descriptions of each git button command and what they do.

**Initialize your project**: This is done when first setting up your project. Initializing a project will create all required directories and files within an empty repository. Note: This option will not display if your repo isn't completely empty (i.e. includes a README file).

<p align="center">
<Lightbox src="/img/docs/dbt-cloud/cloud-ide/initialize.png" />
</p>

Once you click "initialize your project" you'll see the following in your IDE. Click "commit" to finish setting up your project.

<p align="center">
<Lightbox src="/img/docs/dbt-cloud/cloud-ide/commit.png" />
</p>

**Commit**: Committing is similar to "saving" any changes made within your repo. In the above situation, the changes being saved or committed are the initialization of the project. The required files and folders are being added. When you make changes to your code in the future, you'll need to commit them as well. This allows you to record what changes were made, when they were made, and who made them.

<p align="center">
<Lightbox src="/img/docs/dbt-cloud/cloud-ide/create_new_branch.png" />
</p>

**Create new branch**: This allows you to branch off of your base branch and edit your project. You’ll notice after initializing your project that the “master” or “main” branch will be read-only. This is because any changes/edits to code cannot and should not be made directly in the base branch. A new branch should be created in order to make any changes to your project.

<p align="center">
<Lightbox src="/img/docs/dbt-cloud/cloud-ide/open_pr.png" />
</p>

**Check out a branch**: This allows you to swap off of your base branch and on to another branch. You’ll need to click on the arrow in the green Git button and select 'checkout branch'. You'll immediately have a pop up box appear in your dbt Cloud IDE and you can select an existing branch by clicking on the 'Branch Name' dropdown. Once you've selected the branch, click 'Checkout' and your newly-selected branch will be available in the dbt Cloud IDE.

<p align="center">
<Lightbox src=" ![pull](https://user-images.githubusercontent.com/89008547/152341799-2118d743-57b9-4244-8cd2-1b7730f7ec6f.png)/>
</p>
               
<p align="center">
<Lightbox src=" ![select_branch](https://user-images.githubusercontent.com/89008547/152341705-0a0e3ee1-45bf-408e-820c-046f39c01ec7.png)/>
</p>


**Open pull request**: This allows you to open a pull request in your git provider for peers to review changes before merging into the base branch.

<p align="center">
<Lightbox src="/img/docs/dbt-cloud/cloud-ide/pull_from_remote.png" />
</p>

**Pull changes from remote**: This option will be available if you’re on the local base branch and changes have recently been pushed to the remote version of the branch. As such, pulling in changes from the remote repo will allow you to pull in the most recent version of the base branch.

<p align="center">
<Lightbox src="/img/docs/dbt-cloud/cloud-ide/pull_from_master.png" />
</p>

**Pull changes from master/main**: This option will be available if you are on any local branch that is behind the remote version of the base branch or the remote version of the branch that you're currently on.
