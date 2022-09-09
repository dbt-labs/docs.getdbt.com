---
title: I'm receiving a Runtime Error Could not find profile named 'user' error?
description: "Re-authorize your credentials on Profile Settings"
sidebar_label: '"Could not find profile named user" error in the IDE'
id: runtime-error-could-not-find-profile

---

If you're unable to access the IDE due to the below error message, we'll do our best to get you unstuck with the below steps! 

```shell
Running with dbt=0.21.0
Encountered an error while reading the project:
  ERROR: Runtime Error
  Could not find profile named 'user'
Runtime Error
  Could not run dbt'
```

Usually this errors indicates that there is an issue with missing/stale credentials/authentication. No worries, we have a few workarounds for you to try:

**In the IDE:**
If this is happening in the IDE, you'll want to navigate to the Profile settings where your development credentials are configured. Once you're there, you'll need to either re-enter or re-authorize your credentials in order to get around this error message.

**In a job:**
If this is happening in a job, it might be that you made some sort of change to the deployment environment in which the job is configured and did not re-enter your deployment credentials upon saving those changes. To fix this, you'll need to go back into the deployment environment settings, re-enter your credentials (either the private key/private key passphrase or the username and password), and kick off a new job run.

If you've tried the step above and are still experiencing this behavior - reach out to the Support team at support@getdbt.com and we'll be happy to help!
