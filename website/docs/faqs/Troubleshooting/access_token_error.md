---
title: I'm receiving an `access_token` error when trying to run queries in the IDE.
description: "Reauthenticate warehouse when seeing `access_token` error"
sidebar_label: 'Receiving `access_token` error in the IDE'
id: access_token_error

---

If you're seeing a database error labeled `access_token` when you try to run queries in the IDE, this means your [OAuth](/docs/cloud/manage-access/set-up-snowflake-oauth) connection between Snowflake and dbt Cloud has expired.

To fix this, you'll need to re-connect the two tools.

Your Snowflake administrator can [configure](/docs/cloud/manage-access/set-up-snowflake-oauth#create-a-security-integration) the refresh tokens' validity, which has a maximum 90-day validity period.

To resolve the issue, complete the following steps:

1. Go to your **Profile settings** page (accessible from the gear icon at the upper right corner of dbt Cloud).
2. Click on the correct warehouse connection under **Credentials**.
3. Click the green **Reconnect Snowflake Account** button in the **Development Credentials** section. This drives you through reauthentication through the SSO flow. 

If you've tried the step above and are still experiencing this behavior, reach out to the Support team at support@getdbt.com for further assistance.
