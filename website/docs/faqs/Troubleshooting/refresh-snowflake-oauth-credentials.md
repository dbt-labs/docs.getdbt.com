---
title: Reconnecting to Snowflake OAuth after authentication expires
description: "The `authentication has expired` error happens because Snowflake requires tools to renew their OAuth connection at least every 90 days."
sidebar_label: 'Reconnecting to Snowflake OAuth after authentication expires'
---

When you connect Snowflake to <Constant name="dbt_platform"/> using [OAuth](/docs/platform/manage-access/set-up-snowflake-oauth), dbt stores a refresh token. This allows your development credentials to remain usable in tools like the <Constant name="studio_ide" /> and the dbt Semantic Layer without needing to re-authenticate each time.

If you see an `authentication has expired` error when you try to run queries, you must renew your connection between Snowflake and the <Constant name="dbt_platform"/>.

To resolve the issue, complete the following steps:

1. Go to your **Profile settings** page, accessible from the navigation menu.
2. Navigate to **Credentials** and then choose the project where you're experiencing the issue.
3. Under **Development credentials**, click the **Reconnect Snowflake Account** button. This will guide you through re-authenticating using your SSO workflow.

Your Snowflake administrator can [configure the refresh token validity period](/docs/platform/manage-access/set-up-snowflake-oauth#create-a-security-integration), up to the maximum 90 days.

If you've tried these step and are still getting this error, please contact the Support team at support@getdbt.com for further assistance.
