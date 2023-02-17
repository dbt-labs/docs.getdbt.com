---
title: "Configuring Snowflake PrivateLink"
id: snowflake-privatelink
description: "Configuring PrivateLink for Snowflake"
sidebar_label: "PrivateLink for Snowflake"
---


To complete the PrivateLink connection between the dbt and your private networks, first contact dbt Labs support to obtain the AWS or Azure `resource ID`. 

Then, you must open a support case with Snowflake so they can grant access to dbt’s account or subscription. Snowflake teams prefer that you open these support cases directly, rather than dbt Labs acting on your behalf. For more information, you can refer to [Snowflake's article about setting up](https://community.snowflake.com/s/article/HowtosetupPrivatelinktoSnowflakefromCloudServiceVendors). Provide them with your dbt Cloud account ID along with any other information requested in the article. 

You need to have `ACCOUNTADMIN` access to the Snowflake instance to complete these steps.

<Lightbox src="/img/docs/dbt-cloud/snowflakeprivatelink1.png" title="Open snowflake case"/>

Run the Snowflake system function [SYSTEM$GET_PRIVATELINK_CONFIG](https://docs.snowflake.com/en/sql-reference/functions/system_get_privatelink_config.html) and provide the output to the dbt Labs support team. 

dbt Labs will work on your behalf to complete the PrivateLink setup. Please allow 1-2 business days for this process to complete. Support will contact you when the service is available. 

## Configure new endpoints with PrivateLink

Once dbt Cloud support completes the configuration, you can start creating new connections using PrivateLink. 

1. Navigate to settings → Create new project → select Redshift
2. You will see two radio buttons: **Public** and **Private.** Select **Private**. 
3. Select the private endpoint from the dropdown (this will automatically populate the hostname/account field)
4. Configure the remaining DWH details.
5. Test your connection and save it.
