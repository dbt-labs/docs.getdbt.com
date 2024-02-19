---
title: I'm receiving an `access_token` error when trying to run queries in the IDE.
description: "Reauthenticate warehouse when seeing `access_token` error"
sidebar_label: '`access_token` error in the IDE'
id: access_token_error

---

If you're seeing a Database Error labelled `access_token` when you try to run queries in the IDE, your OAuth connection between Snowflake and dbt Cloud has expired and you need to reconnect the two tools. The validity period for these refresh tokens is [configurable by your Snowflake administrator](/docs/cloud/manage-access/set-up-snowflake-oauth#create-a-security-integration), but cannot be longer than 90 days.

To resolve the issue, complete the following steps:

1. Go to your Profile settings page (accessible from the gear icon at the upper right corner of dbt Cloud)
2. Click on the correct warehouse connection under "Credentials"
3. Click the green "Reconnect Snowflake Account" button in the "Development Credentials" section. This drives you through reauthentication through the SSO flow. 

If you've tried the step above and are still experiencing this behavior, reach out to the Support team at support@getdbt.com for further assistance.
