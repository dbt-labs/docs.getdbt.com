---
title: "Enhancement: Edit in primary git branch in IDE"
description: "February 2024: Edit directly on your primary git branch and commit those changes to a new branch when ready. This was previously a read-only feature." 
sidebar_label: "Enhancement: Edit primary git branch in IDE"
sidebar_position: 06
tags: [Feb-2024]
date: 2024-02-22
---

You can now edit, format, or lint files and execute dbt commands directly in your primary git branch in the [dbt Cloud IDE](/docs/cloud/dbt-cloud-ide/develop-in-the-cloud).  This enhancement is available across various repositories: native integrations, imported git URLs, and managed repos.

The primary branch of the connected git repo has traditionally been _read-only_ in the IDE. This update changes the branch to _protected_ and allows direct edits. When a commit is made, dbt Cloud will prompt you to create a new branch. dbt Cloud will pre-populate the new branch name with the GIT_USERNAME-patch-#; however, you can edit the field with a custom branch name.

Previously, the primary branch was displayed as read-only, but now the branch is displayed with a lock icon to indentify it as protected:

<DocCarousel slidesPerView={1}>

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/read-only.png" width="75%" title="Previous read-only experience"/>

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/protected.png" width="75%" title="New protected experience"/>

</DocCarousel>

When you make a commit while on the primary branch, a modal window will open prompting you to create a new branch and enter a commit message:

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/create-new-branch.png" width="75%" title="Create new branch window"/>
