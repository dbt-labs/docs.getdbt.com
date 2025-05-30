---
title: I'm receiving a git rev-list master error in the IDE?
description: "Primary branch not recognized"
sidebar_label: 'Receiving git rev-list master error in the IDE'
id: git-revlist-error
---

If you're unable to access the <Constant name="cloud_ide" /> due to the below error message, we'll do our best to get you unstuck with the below steps!

```shell
git rev-list master..origin/main --count
fatal: ambiguous argument 'master..origin/main': unknown revision or path not in the working tree.
Use '--' to separate paths from revisions, like this:
'git <command> [<revision>...] -- [<file>...]'
```

Usually this error indicates that the "main" branch name has changed or it is possible that <Constant name="cloud" /> was unable to determine what your primary branch was. No worries, we have a few workarounds for you to try:

**Workaround 1**
Take a look at your Environment Settings - If you **do not** have a custom branch filled in your Environment Settings:

1. Disconnect and reconnect your repository [connection](/docs/cloud/git/import-a-project-by-git-url) on your Project Settings page. This should then allow <Constant name="cloud" /> to pick up that the "main" branch is now called `main`.
2. In the Environment Settings, set the custom branch to 'master' and refresh the <Constant name="cloud_ide" />.

**Workaround 2**
Take a look at your Environment Settings - If you **do** have a custom branch filled in your Environment Settings:

1. Disconnecting and reconnecting your repository [connection](/docs/cloud/git/import-a-project-by-git-url) on your Project Settings page. This should then allow <Constant name="cloud" /> to pick up that the "main" branch is now called `main`.
2. In the Environment Settings, remove the custom branch and refresh the <Constant name="cloud_ide" />.

If you've tried the workarounds above and are still experiencing this behavior - reach out to the Support team at support@getdbt.com and we'll be happy to help!
