---
title: Reconnecting to Snowflake OAuth after authentication expires
description: "The `authentication has expired` error happens because Snowflake requires tools to renew their OAuth connection at least every 90 days."
sidebar_label: 'Reconnecting to Snowflake OAuth after authentication expires'
---

When you use [OAuth](/docs/cloud/manage-access/set-up-snowflake-oauth) to connect Snowflake to the dbt platform, <Constant name="cloud" /> stores an refresh token so that your development credentials are usable from tools like the <Constant name="cloud_ide" /> and the dbt Semantic Layer.

If you see a `authentication has expired` error when you try to run queries, you must renew your connection between Snowflake and the dbt platform.

To resolve the issue, complete the following steps:

1. Go to your **Profile settings** page, accessible from the navigation menu.
2. Navigate to **Credentials** and click on the project you're experiencing the issue with.
3. Under **Development credentials**, click the **Reconnect Snowflake Account** button. This steps you through reauthentication using the SSO workflow.

Your Snowflake administrator can [configure the refresh token validity period](/docs/cloud/manage-access/set-up-snowflake-oauth#create-a-security-integration), up to the maximum 90 days.

If you've tried these step and are still getting this error, please contact the Support team at support@getdbt.com for further assistance.
