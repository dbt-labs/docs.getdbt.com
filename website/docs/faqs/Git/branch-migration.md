---
title: "Branches when changing Git hosts or repositories"
sidebar_label: "Branches when changing hosts or repositories"
id: "branches-when-changing-git-host"
hide_table_of_contents: true
description: "How Git branches and Studio IDE work are affected when you change providers, add a new remote, or update your dbt project connection."
tags: [Git]
---

People often ask whether their Git branch names and commit history carry over when they switch Git hosts, start using a new repository, or reconnect their project to a different remote.

Short answer: Remote branches live in the Git repository that your remote hosts. They are present only if that repository (including its refs) is what you moved or connected. Work that exists only in the [<Constant name="studio_ide" />](/docs/cloud/studio-ide/develop-in-studio) and is not committed and pushed is a separate concern.

<Expandable alt_header="Git host migration">

If you fully migrate the same repository to a new provider (for example, using your provider’s import or mirror flow, or <Constant name="git" /> commands that copy all refs), your branches and history typically carry over.

If you only copy files, create a new repository with a single initial commit, or import only the default branch, other branches will not appear on the new remote until you push or import them.

For steps to reconnect in <Constant name="dbt" />, refer to [How to migrate git providers](/faqs/Git/git-migration).

</Expandable>

<Expandable alt_header="New repository">

If you mean “we created a new repository and pushed—do the branches from our old repo show up there?” then no. A new remote only has what you push or import; branch names from the previous repository are not carried over automatically. To keep the same branches and history, [migrate the existing repository](#git-host-migration) instead of treating the new repo as a fresh start.

</Expandable>

<Expandable alt_header="Project repository connection">

In the <Constant name="dbt_platform" />, the [<Constant name="studio_ide" />](/docs/cloud/studio-ide/develop-in-studio) does not keep its own separate copy of your full branch graph aside from <Constant name="git" />. The branches you see depend on the remote repository connected to the project.

Before you use **Disconnect** on the repository or switch to a different remote, treat saved but uncommitted work as at risk: it is not on your <Constant name="git" /> host until you **Commit and sync** (push).

Unsaved edits in the browser can also be lost. **Commit and sync** what you need to keep, or copy it outside the <Constant name="studio_ide" />. For information on how work is stored in the <Constant name="studio_ide" />, refer to [Work retention](/docs/cloud/studio-ide/develop-in-studio#work-retention).

:::tip Pre-cutover verification
To confirm branches and connectivity before switching over, create a separate project in the <Constant name="dbt_platform" /> pointed at the new repository, verify the branches you expect, then disconnect the old repository and remove the temporary project when finished.
:::

</Expandable>

<Expandable alt_header="From managed to self-hosted">

A ZIP of the project is a snapshot of files, not a full <Constant name="git" /> migration. It does not replace copying history and all refs the way a mirror or full clone/push does. For the supported path from a managed repository, refer to [Move from a managed repository to a self-hosted repository](/faqs/Git/managed-repo).

</Expandable>
