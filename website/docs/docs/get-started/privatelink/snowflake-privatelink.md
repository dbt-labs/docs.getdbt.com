---
title: "Configuring Snowflake PrivateLink"
id: snowflake-privatelink
description: "Configuring PrivateLink for Snowflake"
sidebar_label: "PrivateLink for Snowflake"
---

The following steps will walk you through the setup of a Snowflake AWS PrivateLink endpoint in the dbt Cloud multi-tenant environment.

## Configure PrivateLink

1. Open a Support case with Snowflake to allow access from the dbt Cloud AWS account
- Snowflake prefers that the account owner opens the Support case directly, rather than dbt Labs acting on their behalf. For more information, refer to [Snowflake's knowledge base article](https://community.snowflake.com/s/article/HowtosetupPrivatelinktoSnowflakefromCloudServiceVendors)
- Provide them with your dbt Cloud account ID along with any other information requested in the article.
  - AWS account ID: `346425330055` - _NOTE: This account ID only applies to dbt Cloud Multi-Tenant environments. For Virtual Private/Single-Tenant account IDs please contact [Support](https://docs.getdbt.com/guides/legacy/getting-help#dbt-cloud-support)._
- You will need to have `ACCOUNTADMIN` access to the Snowflake instance to submit a Support request.

<Lightbox src="/img/docs/dbt-cloud/snowflakeprivatelink1.png" title="Open snowflake case"/>

2. After Snowflake has granted the requested access, run the Snowflake system function [SYSTEM$GET_PRIVATELINK_CONFIG](https://docs.snowflake.com/en/sql-reference/functions/system_get_privatelink_config.html) and copy the output

3. Add the required information to the template below, and submit your request to  [dbt Support](https://docs.getdbt.com/guides/legacy/getting-help#dbt-cloud-support):

```
Subject: New Multi-Tenant PrivateLink Request
- Type: Snowflake
- SYSTEM$GET_PRIVATELINK_CONFIG output:
- dbt Cloud multi-tenant environment (US, EMEA, AU):
```

dbt Labs will work on your behalf to complete the PrivateLink setup. Please allow 1-2 business days for this process to complete. Support will contact you when the endpoint is available. 

## Create Connection in dbt Cloud

Once dbt Cloud support completes the configuration, you can start creating new connections using PrivateLink. 

1. Navigate to **Settings** → **Create new project** → select **Snowflake**. 
2. You will see two radio buttons: **Public** and **Private.** Select **Private**. 
3. Select the private endpoint from the dropdown (this will automatically populate the hostname/account field).
4. Configure the remaining data platform details.
5. Test your connection and save it.