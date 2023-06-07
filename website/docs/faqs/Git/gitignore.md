---
title: How can I fix my .gitignore file?
description: "Use these instructions to fix your gitignore file"
sidebar_label: 'How to fix your .gitignore file'
id: gitignore
---

A `.gitignore` file specifies which files git should intentionally ignore or 'do not track'. dbt Cloud indicates untrackec files in the project file explorer pane by putting the file or folder name in *italics*.

If the dbt Cloud IDE is having problems reverting changes, checking out or creating a new branch, or never offers to open a pull request after a successfull commit &mdash; There is typically a problem with the [.gitignore](https://github.com/dbt-labs/dbt-starter-project/blob/main/.gitignore) file.  It is either missing OR it doesn't contain the necessary entries for the proper function of dbt Cloud.

### Steps when using the dbt Cloud IDE to fix a broken .gitignore:

> NOTE: Simply adding the correct entries to the `.gitignore` file will not 'untrack' folders and files that git has started tracking:  It will only prevent new files or folders from becoming tracked.  As a result, it will be necessary to first fix the `.gitignore` file, then perform some additional git operations to untrack any incorrect files or folders.

<VersionBlock firstVersion="1.5">

1. Launch the Cloud IDE into the project that is being fixed, by selecting **Develop** on the menu bar.
2. Check to see if a `.gitignore` file exists at the root of your dbt project folder.  Create a new file if it does not.
3. Open the new or existing '.gitignore` file, and add the following entries.  Here is a link to a [sample dbt .gitignore file.](https://github.com/dbt-labs/dbt-starter-project/blob/main/.gitignore).
> NOTE: These can go anywhere in the file, as long as they are on separate lines.  The lines as shown are wildcards that will include all nested files and folders. Do NOT append a trailing '*'.  See [these git docs](https://git-scm.com/docs/gitignore) for more information on `.gitignore` syntax.
```bash
target/
dbt_packages/
logs/
# legacy -- renamed to dbt_packages in dbt v1
dbt_modules/
```
3. Save the changes but _don't commit_.
4. Restart the IDE by clicking on the three dots next to the **IDE Status button** on the lower right corner of the IDE screen, then selecting **Restart IDE**.

<Lightbox src="/img/docs/dbt-cloud/cloud-ide/restart-ide.jpg" width="50%" title="Restart the IDE by clicking the three dots on the lower right or click on the Status bar" />

5. Once the IDE restarts, delete the following files or folders from the file explorer pane (if they exist).  No data will be lost.:
    * `target`, `dbt_modules`, `dbt_packages`, `logs`
6. **Save** and then **Commit and sync** the changes.
7. Restart the IDE again using the same procedure as step 3.
8. Once the IDE restarts, use the 'Create a pull request' (PR) button under the **Version Control** menu to start the process of integrating the changes.
9. When the git provider's website opens to a page with the new PR, follow the necessary steps to compelete and merge the PR into the main branch of that repository.
> NOTE: The 'main' branch might also be called 'master', 'dev', 'qa', 'prod' or something else depending on the organizational naming conventions.  The goal is to merge these changes into the root branch that all other development branches are created from.
10. Return to the dbt Cloud IDE.
11. Use the 'Change Branch' button, to switch to the main branch of the project.
12. Once the branch has changed, click the **Pull from remote** button to pull in all the changes. You can verify the changes by making sure the files/folders in the .gitignore file are in italics. 

<Lightbox src="/img/docs/dbt-cloud/cloud-ide/gitignore-italics.jpg" width="50%" title="A dbt project on the main branch that has properly configured gitignore folders (highlighted in italics)."/>

### Steps to use the git providers web interface to fix a broken .gitignore:
   
Sometimes it is necessary to use the git providers web interface to fix a broken `.gitignore` file. While the exact sequence of clicks will be different for each provider, the overall steps are the same.

There are two options available for this method, depending on if it is possible to directly edit the main branch, or if it is necessary to create a pull request to make the changes.

#### OPTION A: Steps if the main branch can be directly edited:
   
When permissions allow it, it is possible to edit the `.gitignore` directly on the main branch of your repo.  In that case, here are the steps:

1. Open the repo web interface.
2. Switch to the main branch, and the root directory of your dbt project.
3. Find the `.gitignore` file.  Create a blank one if it doesn't exist.
4. Edit the file in the web interface, adding the following entries:
```bash
target/
dbt_packages/
logs/
# legacy -- renamed to dbt_packages in dbt v1
dbt_modules/
```
5. Commit (save) the file.
6. Delete the following folders from the dbt project root, if they exist.  No data or code will be lost.
```bash
target/
dbt_packages/
logs/
# legacy -- renamed to dbt_packages in dbt v1
dbt_modules/
```
7. Commit (save) the deletions to the main branch.
8. Switch to the dbt Cloud IDE, and open the project that is being fixed.
9. Navigate to the "three dots" menu in the bottom right corner of the screen, and select "reclone repo".  **NOTE: Any changes that are saved but uncommited will be lost, so be sure to copy any changed code that is desirable to keep, to a temporary location outside of dbt Cloud.** 
10. Once the repo is recloned, open the `.gitignore` file in the branch you are working in.  If the new changes are not included, it will be necessary to merge in the latest commits from the main branch, into the branch you are working on.
11. After verifying that the `.gitignore` file contains the correct entries, verify in the IDE file explorer that the folder names are in *italics*.  This will indicate that the `.gitignore` is correctly configured, and that the folders are un-tracked.
12. Proceed with development!


#### OPTION B: Steps if it is necessary to create and merge a branch to correct the main branch (the main branch cannot be edited directly):
   
If it is not possible to edit the `.gitignore` directly on the main branch of your repo, follow these steps:

1. Open the repo web interface.
2. Switch to an existing development branch, or create a new branch just for these changes (often faster and cleaner). 
3. Find the `.gitignore` file.  Create a blank one if it doesn't exist.
4. Edit the file in the web interface, adding the following entries:
```bash
target/
dbt_packages/
logs/
# legacy -- renamed to dbt_packages in dbt v1
dbt_modules/
```
5. Commit (save) the file.
6. Delete the following folders from the dbt project root, if they exist.  No data or code will be lost.
```bash
target/
dbt_packages/
logs/
# legacy -- renamed to dbt_packages in dbt v1
dbt_modules/
```
7. Commit (save) the deleted folders.
8. Open a merge request using the git provider web interface.  The merge request should be attempting to merge the changes into the 'main' branch that all development branches are created from.
9. Follow the necessary procedures to get the branch approved and merged into the 'main' branch.  It is ok to delete the branch after the merge is complete. 
10. Once the merge is complete, switch to the dbt Cloud IDE, and open the project that is being fixed.
11. Navigate to the "three dots" menu in the bottom right corner of the screen, and select "reclone repo".  **NOTE: Any changes that are saved but uncommited will be lost, so be sure to copy any changed code that is desirable to keep, to a temporary location outside of dbt Cloud.** 
12. Once the repo is recloned, open the `.gitignore` file in the branch you are working in.  If the new changes are not included, it will be necessary to merge in the latest commits from the main branch, into the branch you are working on.
13. After verifying that the `.gitignore` file contains the correct entries, verify in the IDE file explorer that the folder names are in *italics*.  This will indicate that the `.gitignore` is correctly configured, and that the folders are un-tracked.
14. Proceed with development!
    
</VersionBlock> 

<VersionBlock lastVersion="1.4">

1. Launch the Cloud IDE into the project that is being fixed, by selecting **Develop** on the menu bar.
2. Check to see if a `.gitignore` file exists at the root of your dbt project folder.  Create a new file if it does not.
3. Open the new or existing '.gitignore` file, and add the following entries.  Here is a link to a [sample dbt .gitignore file.](https://github.com/dbt-labs/dbt-starter-project/blob/main/.gitignore).
> NOTE: These can go anywhere in the file, as long as they are on separate lines.  The lines as shown are wildcards that will include all nested files and folders. Do NOT append a trailing '*'.  See [these git docs](https://git-scm.com/docs/gitignore) for more information on `.gitignore` syntax.
```bash
target/
dbt_packages/
logs/
# legacy -- renamed to dbt_packages in dbt v1
dbt_modules/
```
3. Save the changes but _don't commit_.
4. Restart the IDE by clicking on the three dots next to the **IDE Status button** on the lower right corner of the IDE screen, then selecting **Restart IDE**.

<Lightbox src="/img/docs/dbt-cloud/cloud-ide/restart-ide.jpg" width="50%" title="Restart the IDE by clicking the three dots on the lower right or click on the Status bar" />

5. Once the IDE restarts, delete the following files or folders from the file explorer pane (if they exist).  No data will be lost.:
    * `target`, `dbt_modules`, `dbt_packages`, `logs`
6. **Save** and then **Commit and sync** the changes.
7. Restart the IDE again using the same procedure as step 3.
8. Once the IDE restarts, use the 'Create a pull request' (PR) button under the **Version Control** menu to start the process of integrating the changes.
9. When the git provider's website opens to a page with the new PR, follow the necessary steps to compelete and merge the PR into the main branch of that repository.
> NOTE: The 'main' branch might also be called 'master', 'dev', 'qa', 'prod' or something else depending on the organizational naming conventions.  The goal is to merge these changes into the root branch that all other development branches are created from.
10. Return to the dbt Cloud IDE.
11. Use the 'Change Branch' button, to switch to the main branch of the project.
12. Once the branch has changed, click the **Pull from remote** button to pull in all the changes. You can verify the changes by making sure the files/folders in the .gitignore file are in italics. 

<Lightbox src="/img/docs/dbt-cloud/cloud-ide/gitignore-italics.jpg" width="50%" title="A dbt project on the main branch that has properly configured gitignore folders (highlighted in italics)."/>

### Steps to use the git providers web interface to fix a broken .gitignore:
   
Sometimes it is necessary to use the git providers web interface to fix a broken `.gitignore` file. While the exact sequence of clicks will be different for each provider, the overall steps are the same.

There are two options available for this method, depending on if it is possible to directly edit the main branch, or if it is necessary to create a pull request to make the changes.

#### OPTION A: Steps if the main branch can be directly edited:
   
When permissions allow it, it is possible to edit the `.gitignore` directly on the main branch of your repo.  In that case, here are the steps:

1. Open the repo web interface.
2. Switch to the main branch, and the root directory of your dbt project.
3. Find the `.gitignore` file.  Create a blank one if it doesn't exist.
4. Edit the file in the web interface, adding the following entries:
```bash
target/
dbt_packages/
logs/
# legacy -- renamed to dbt_packages in dbt v1
dbt_modules/
```
5. Commit (save) the file.
6. Delete the following folders from the dbt project root, if they exist.  No data or code will be lost.
```bash
target/
dbt_packages/
logs/
# legacy -- renamed to dbt_packages in dbt v1
dbt_modules/
```
7. Commit (save) the deletions to the main branch.
8. Switch to the dbt Cloud IDE, and open the project that is being fixed.
9. Navigate to the "three dots" menu in the bottom right corner of the screen, and select "reclone repo".  **NOTE: Any changes that are saved but uncommited will be lost, so be sure to copy any changed code that is desirable to keep, to a temporary location outside of dbt Cloud.** 
10. Once the repo is recloned, open the `.gitignore` file in the branch you are working in.  If the new changes are not included, it will be necessary to merge in the latest commits from the main branch, into the branch you are working on.
11. After verifying that the `.gitignore` file contains the correct entries, verify in the IDE file explorer that the folder names are in *italics*.  This will indicate that the `.gitignore` is correctly configured, and that the folders are un-tracked.
12. Proceed with development!


#### OPTION B: Steps if it is necessary to create and merge a branch to correct the main branch (the main branch cannot be edited directly):
   
If it is not possible to edit the `.gitignore` directly on the main branch of your repo, follow these steps:

1. Open the repo web interface.
2. Switch to an existing development branch, or create a new branch just for these changes (often faster and cleaner). 
3. Find the `.gitignore` file.  Create a blank one if it doesn't exist.
4. Edit the file in the web interface, adding the following entries:
```bash
target/
dbt_packages/
logs/
# legacy -- renamed to dbt_packages in dbt v1
dbt_modules/
```
5. Commit (save) the file.
6. Delete the following folders from the dbt project root, if they exist.  No data or code will be lost.
```bash
target/
dbt_packages/
logs/
# legacy -- renamed to dbt_packages in dbt v1
dbt_modules/
```
7. Commit (save) the deleted folders.
8. Open a merge request using the git provider web interface.  The merge request should be attempting to merge the changes into the 'main' branch that all development branches are created from.
9. Follow the necessary procedures to get the branch approved and merged into the 'main' branch.  It is ok to delete the branch after the merge is complete. 
10. Once the merge is complete, switch to the dbt Cloud IDE, and open the project that is being fixed.
11. Navigate to the "three dots" menu in the bottom right corner of the screen, and select "reclone repo".  **NOTE: Any changes that are saved but uncommited will be lost, so be sure to copy any changed code that is desirable to keep, to a temporary location outside of dbt Cloud.** 
12. Once the repo is recloned, open the `.gitignore` file in the branch you are working in.  If the new changes are not included, it will be necessary to merge in the latest commits from the main branch, into the branch you are working on.
13. After verifying that the `.gitignore` file contains the correct entries, verify in the IDE file explorer that the folder names are in *italics*.  This will indicate that the `.gitignore` is correctly configured, and that the folders are un-tracked.
14. Proceed with development!

</VersionBlock> 

For more info, refer to this [detailed video](https://www.loom.com/share/9b3b8e2b617f41a8bad76ec7e42dd014) for additional guidance. 
