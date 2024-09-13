---
title: Receiving an `authentication has expired` error when trying to run queries in the IDE.
description: "Reauthenticate warehouse when seeing `authentication has expired` error"
sidebar_label: 'Receiving `authentication has expired` error in the IDE'
---

If you see a `authentication has expired` error when you try to run queries in the dbt CLoud IDE, this means your [OAuth](/docs/cloud/manage-access/set-up-snowflake-oauth) connection between Snowflake and dbt Cloud has expired.

To fix this, you must reconnect the two tools.

Your Snowflake administrator can [configure](/docs/cloud/manage-access/set-up-snowflake-oauth#create-a-security-integration) the refresh tokens' validity, which has a maximum 90-day validity period.

To resolve the issue, complete the following steps:

1. Go to your **Profile settings** page, accessible from the navigation menu.
2. Navigate to **Credentials** and click on the project you're experiencing the issue with.
3. Under **Development credentials**, click the **Reconnect Snowflake Account** (green) button. This steps you through reauthentication using the SSO workflow. 

If you've tried these step and are still getting this error, please contact the Support team at support@getdbt.com for further assistance.
