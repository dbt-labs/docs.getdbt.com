---
title: How can I fix my .gitignore file?
description: "Use these instructions to fix your gitignore file"
sidebar_label: 'How to fix your .gitignore file'
id: gitignore
---

A gitignore file specifies which files Git should intentionally ignore. You can identify these files in your project by their italics formatting.

If you can't revert changes, check out a branch, or click commit &mdash; this is usually do to your project missing a [.gitignore](https://github.com/dbt-labs/dbt-starter-project/blob/main/.gitignore) file OR your gitignore file doesn't contain the necessary content inside the folder.

To fix this, complete the following steps:

1. In the dbt Cloud IDE, add the following [.gitignore contents](https://github.com/dbt-labs/dbt-starter-project/blob/main/.gitignore) in your dbt project `.gitignore` file:
```bash
target/
dbt_packages/
logs/
# legacy -- renamed to dbt_packages in dbt v1
dbt_modules/
```
2. Save your changes but _don't commit_
3. Restart the IDE by clicking on the three dots next to the **IDE Status button** on the lower right of the IDE.

<Lightbox src="/img/docs/dbt-cloud/cloud-ide/restart-ide.jpg" width="50%" title="Restart the IDE by clicking the three dots on the lower right or click on the Status bar" />

4. Select **Restart IDE**.
5. Go back to your dbt project and delete the following files or folders if you have them:
    * `target`, `dbt_modules`, `dbt_packages`, `logs`
6. **Save** and then **Commit and sync** your changes.
7. Restart the IDE again.
8. Create a pull request (PR) under the **Version Control** menu to integrate your new changes.
9.  Merge the PR on your git provider page.
10. Switch to your main branch and click on **Pull from remote** to pull in all the changes you made to your main branch. You can verify the changes by making sure the files/folders in the .gitignore file are in italics. 

<Lightbox src="/img/docs/dbt-cloud/cloud-ide/gitignore-italics.jpg" width="50%" title="A dbt project on the main branch that has properly configured gitignore folders (highlighted in italics)."/>

For more info, refer to this [detailed video](https://www.loom.com/share/9b3b8e2b617f41a8bad76ec7e42dd014) for additional guidance. 
