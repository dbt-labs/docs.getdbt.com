---
title: Errors importing a repository on dbt Cloud project set up
description: "Errors importing a repository on dbt Cloud project set up"
sidebar_label: 'Errors importing a repository on dbt Cloud project set up'
id: error-importing-repo
---

If you don't see your repository listed, double-check that:
- Your repository is in a Gitlab group you have access to. dbt Cloud will not read repos associated with a user.

If you do see your repository listed, but are unable to import the repository successfully, double-check that:
- You are a maintainer of that repository. Only users with maintainer permissions can set up repository connections.

If you imported a repository using the dbt Cloud native integration with GitLab, you should be able to see if the clone strategy is using a `deploy_token`. If it's relying on an SSH key, this means the repository was not set up using the native GitLab integration, but rather using the generic git clone option. The repository must be reconnected in order to get the benefits described above.
