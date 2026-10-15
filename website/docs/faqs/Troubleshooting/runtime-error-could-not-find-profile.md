---
title: I'm receiving a Runtime Error Could not find profile named 'user' error?
description: "Re-authorize your credentials in Your profile"
sidebar_label: 'Could not find profile named user"error in the IDE'
id: runtime-error-could-not-find-profile

---

If you're unable to access the <Constant name="studio_ide" /> due to the below error message, we'll do our best to get you unstuck with the below steps! 

```shell
Running with dbt=1.9.0
Encountered an error while reading the project:
  ERROR: Runtime Error
  Could not find profile named 'user'
Runtime Error
  Could not run dbt'
```

Usually this errors indicates that there is an issue with missing/stale credentials/authentication. No worries, we have a few workarounds for you to try:

**In the <Constant name="studio_ide" />:**
Click your account name in the bottom left, select **Your profile**, then go to **Credentials**. Re-enter or re-authorize your credentials to resolve the error.

**In a job:**
This can happen if you changed the deployment environment and didn't re-enter your deployment credentials when saving. Go back to the deployment environment settings, re-enter your credentials (private key/passphrase or username and password), and kick off a new job run.

If you've tried the step above and are still experiencing this behavior - reach out to the Support team at support@getdbt.com and we'll be happy to help!
