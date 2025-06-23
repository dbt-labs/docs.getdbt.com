---
title: GitLab token refresh message
description: "Learn how to resolve GitLab token refresh messages during your CI jobs"
sidebar_label: 'GitLab token refresh message'
id: gitlab-token-refresh
---

When you connect <Constant name="cloud" /> to a GitLab repository, GitLab automatically creates a [project access token](https://docs.gitlab.com/ee/user/project/settings/project_access_tokens.html) in your GitLab repository in the background. This sends the job run status back to Gitlab using the <Constant name="cloud" /> API for CI jobs. 

By default, the project access token follows a naming pattern: `dbt token for GitLab project: <project_id>`. If you have multiple tokens in your repository, look for one that follows this pattern to identify the correct token used by <Constant name="cloud" />.

If you're receiving a "Refresh token" message, don't worry &mdash; <Constant name="cloud" /> automatically refreshes this project access token for you, which means you never have to manually rotate it.

If you still experience any token refresh errors, please try disconnecting and reconnecting the repository in your <Constant name="cloud" /> project to refresh the token. 

For any issues, please reach out to the Support team at support@getdbt.com and we'll be happy to help!
