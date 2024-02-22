---
title: "New: Edit in primary branch in IDE"
description: "February 2024: Edit access to the primary GitHub branch while in the IDE. This was previously a read-only feature."
sidebar_label: "New: Edit primary branch in IDE"
sidebar_position: 06
tags: [Feb-2024]
date: 2024-02-21
---

You can now edit the primary branch of your GitHub repo in the dbt Cloud IDE. The primary branch of GitHub has traditionally been _read-only_ in the IDE. This update changes the branch to _protected_ and allows direct edits to be made. When a commit is made, dbt Cloud will prompt the developer to create a new branch. dbt Cloud will pre-populate the new branch name with the _username_-patch-#, however, the user can edit the field with a custom branch name.

The old experience was read-only:

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/read-only.png" width="90%" title="Old read-only experience"/>

Now the branch is displayed with a lock icon to identify it as a protected branch:

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/protected.png" width="90%" title="New protected experience"/>

When a developer makes a commit to the branch, they receive a prompt that warns them that it is a protected branch, with the option to cancel the commit or create a new branch:

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/commit-popup.png" width="90%" title="Protected branch pop-up window"/>

When the user chooses **Create new branch**, they are presented with the window where they can enter the branch name and commit message:

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/create-new-branch.png" width="90%" title="Create new branch window"/>