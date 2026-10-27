---
title: Reconnecting to Snowflake OAuth after authentication expires
description: "Reconnect Snowflake OAuth when you get the authentication has expired error, and check your security integration if it keeps coming back."
sidebar_label: 'Reconnecting to Snowflake OAuth after authentication expires'
---

When you connect Snowflake to <Constant name="dbt_platform"/> using [OAuth](/docs/platform/manage-access/set-up-snowflake-oauth), <Constant name="dbt" /> stores a refresh token. This allows your user credentials to be reused in the <Constant name="studio_ide" />, and in <Constant name="semantic_layer" /> queries made with a personal access token, without needing to reconnect each time.

If you get `This error occurs when authentication has expired` when you try to run queries, you must reconnect Snowflake and the <Constant name="dbt_platform"/>.

To resolve the issue, complete the following steps:

1. Go to **Your profile**, accessible from the navigation menu.
2. Navigate to **Credentials** and then choose the project where you're experiencing the issue.
3. Under **User credentials**, click the **Reconnect Snowflake Account** button. This reconnects you through your SSO workflow.

Your Snowflake administrator can [configure the refresh token validity period](/docs/platform/manage-access/set-up-snowflake-oauth#create-a-security-integration). Snowflake's default is 90 days.

If reconnecting works but the next command fails with the same error, or you get `http status: 400` on `/oauth/token-request`, ask your Snowflake administrator to check whether `OAUTH_SINGLE_USE_REFRESH_TOKENS_REQUIRED` is `TRUE` on the security integration. It needs to be `FALSE`, because <Constant name="dbt" /> doesn't currently store the replacement token Snowflake issues when it's on. After they change it, click **Reconnect Snowflake Account** again. For the admin steps, refer to [Authentication has expired after authorizing](/docs/platform/manage-access/set-up-snowflake-oauth#authentication-has-expired-after-authorizing).

If you've tried these steps and are still getting this error, please contact the Support team at support@getdbt.com for further assistance.
