---
title: Why can't I checkout a branch or create a new branch?
description: "Add or fill in gitignore file"
sidebar_label: 'Unable to checkout or create branch'
id: gitignore
---

If you're finding yourself unable to revert changes, check out a branch or click commit - this is usually do to your project missing a [.gitignore](https://github.com/dbt-labs/dbt-starter-project/blob/main/.gitignore) file OR your gitignore file doesn't contain the necessary content inside the folder.

This is what causes that 'commit' git action button to display. No worries though - to fix this, you'll need to complete the following steps in order:

1. In the Cloud IDE, add the missing .gitignore file or contents to your project. You'll want to make sure the .gitignore file includes the following:

    ```shell
    target/
    dbt_modules/
    dbt_packages/
    logs/
    ```

2. Once you've added that, make sure to save and commit.

3. Navigate to the same branch in your remote repository (which can be accessed directly through your git provider's web interface) and delete the logs, target, and dbt_modules/dbt_packages folders.

4. Go back into the Cloud IDE and reclone your repository. This can be done by clicking on the green "ready" in the bottom right corner of the IDE (next to the command bar), and then clicking the orange "reclone repo" button in the pop up.
