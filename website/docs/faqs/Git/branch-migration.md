---
title: "Branches when changing Git providers or repositories"
sidebar_label: "Branches when changing providers or repositories"
id: "branches-when-changing-git-host"
hide_table_of_contents: true
description: "How Git branches and Studio IDE work are affected when you change providers, add a new remote, or update your dbt project connection."
tags: [Git]
---

People often ask whether their Git branch names and commit history carry over when they switch Git providers (for example, GitHub or GitLab), start using a new repository, or reconnect their project to a different remote.

Your branch names and history only appear on a new Git provider if you copied the entire repository with its history. If you only copied files or created a fresh repository, old branches do not show up. Work you saved in the [<Constant name="studio_ide" />](/docs/cloud/studio-ide/develop-in-studio) but have not pushed is separate and could be lost.

The following sections cover common scenarios, what to expect in each case, and what action to take to keep your branches and history intact:

<Expandable alt_header="Git provider migration">

If you fully migrate the same repository to a new provider (for example, using your provider’s import or mirror flow, or <Constant name="git" /> commands), your branches and history typically carry over.

If you only copy files, create a new repository with a single initial commit, or import only the default branch, other branches will not appear on the new remote until you push or import them.

For steps to reconnect in <Constant name="dbt" />, refer to [How to migrate git providers](/faqs/Git/git-migration).

</Expandable>

<Expandable alt_header="New repository">

Branches missing after creating a new repository?

When you create a brand-new repository, it starts with only the commits and branches that exist in that new remote. Branches from your previous repository do not appear automatically, even if the files look similar.

If you need earlier branches and commit history, migrate or mirror the original repository so the full commit history and branches are retained. If you continue with a newly created repository, push any branches you want to keep from your local clone.

For full-history moves, use the [Git provider migration](#git-provider-migration) approach rather than starting from a fresh repository.

</Expandable>

<Expandable alt_header="Project repository connection">

In the <Constant name="dbt_platform" />, the [<Constant name="studio_ide" />](/docs/cloud/studio-ide/develop-in-studio) does not keep its own separate copy of your full commit history and branches aside from <Constant name="git" />. The branches you see depend on the remote repository connected to the project.

Before you disconnect the repository integration in <Constant name="dbt_platform" /> or switch to a different remote, treat saved but uncommitted work as at risk and save and push all work. Changes that are not committed and synced (pushed) will not appear in your Git provider (for example, GitHub).

For disconnect steps, refer to [How to migrate git providers](/faqs/Git/git-migration).

Unsaved edits in the browser can also be lost. **Commit and sync** what you need to keep, or copy it outside the <Constant name="studio_ide" />. For information on how work is stored in the <Constant name="studio_ide" />, refer to [Work retention](/docs/cloud/studio-ide/develop-in-studio?version=1.12#about-the-start-up-process-and-work-retention).

:::tip Pre-cutover verification
To confirm branches and connectivity before switching over, create a separate project in the <Constant name="dbt_platform" /> pointed at the new repository, verify the branches you expect, then disconnect the old repository and remove the temporary project when finished.
:::

</Expandable>

<Expandable alt_header="From managed to self-hosted">

Exporting a project as a ZIP is a snapshot of files only and does not preserve your <Constant name="git" /> history or branches. To migrate properly and keep your full history, follow [Move from a managed repository to a self-hosted repository](/faqs/Git/managed-repo).

</Expandable>
