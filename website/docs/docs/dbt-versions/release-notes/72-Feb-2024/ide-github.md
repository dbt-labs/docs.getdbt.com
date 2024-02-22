---
title: "New: Edit in primary branch in IDE"
description: "February 2024: Edit access to the primary GitHub branch while in the IDE. This was previously a read-only feature."
sidebar_label: "New: Edit primary branch in IDE"
sidebar_position: 06
tags: [Feb-2024]
date: 2024-02-22
---

You can now edit the primary branch of your GitHub repo in the dbt Cloud IDE. The primary branch of GitHub has traditionally been _read-only_ in the IDE. This update changes the branch to _protected_ and allows direct edits. When a commit is made, dbt Cloud will prompt you to create a new branch. dbt Cloud will pre-populate the new branch name with the USERNAME-patch-#; however, you can edit the field with a custom branch name.

Previously, the primary branch was displayed as read-only:

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/read-only.png" width="90%" title="Old read-only experience"/>

Now, the branch is displayed with a lock icon to identify it as protected:

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/protected.png" width="90%" title="New protected experience"/>

When you make a commit while on the primary branch, a model window will open prompting you to create a new branch and enter a commit message:

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/create-new-branch.png" width="90%" title="Create new branch window"/>
