---
title: I'm seeing a Gitlab authentication out of date error loop
description: "GitLab and dbt deploy key mismatch "
sidebar_label: 'GitLab authentication out of date'
id: gitlab-authentication
---

If you're seeing a 'GitLab Authentication is out of date' 500 server error page - this usually occurs when the deploy key in the repository settings in both <Constant name="cloud" /> and GitLab do not match.

No worries - this is a current issue the dbt Labs team is working on and we have a few workarounds for you to try:

#### First workaround

1. Disconnect repo from project in <Constant name="cloud" />.
2. Go to Gitlab and click on Settings > Repository.
3. Under Repository Settings, remove/revoke active <Constant name="cloud" /> deploy tokens and deploy keys.
4. Attempt to reconnect your repository via <Constant name="cloud" />.
5. You would then need to check Gitlab to make sure that the new deploy key is added.
6. Once confirmed that it's added, refresh <Constant name="cloud" /> and try developing once again.

#### Second workaround

1. Keep repo in project as is -- don't disconnect.
2. Copy the deploy key generated in <Constant name="cloud" />.
3. Go to Gitlab and click on Settings > Repository.
4. Under Repository Settings, manually add to your Gitlab project deploy key repo (with `Grant write permissions` box checked).
5. Go back to <Constant name="cloud" />, refresh your page and try developing again.

If you've tried the workarounds above and are still experiencing this behavior - reach out to the Support team at support@getdbt.com and we'll be happy to help!
