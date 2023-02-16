---
title: "Configuring Snowflake PrivateLink"
id: snowflake-privatelink
description: "Configuring PrivateLink for Snowflake"
sidebar_label: "Snowflake PrivateLink"
---

## Configure the Snowflake PrivateLink with AWS or Azure

To complete the PrivateLink connection between the dbt and your private networks, first contact dbt Labs support to obtain the AWS or Azure `resource ID`. 

A support case must then be created with Snowflake so they can grant access to dbt’s account or subscription. Snowflake teams prefer that customers open these support cases directly, rather than dbt Labs acting on your behalf. Please refer to [this article](https://community.snowflake.com/s/article/HowtosetupPrivatelinktoSnowflakefromCloudServiceVendors) for more information. Provide them with your dbt Cloud account ID along with any other information requested in the article. 

You need to have `ACCOUNTADMIN` access to the Snowflake instance to complete these steps.

<Lightbox src="/img/docs/dbt-cloud/snowflakeprivatelink1.png" title="Open snowflake case"/>

Run the SYSTEM$GET_PRIVATELINK_CONFIG as outlined [here](https://docs.snowflake.com/en/sql-reference/functions/system_get_privatelink_config.html) and provide the output to the dbt Labs support team. 

dbt Labs teams will then work behind the scenes to complete the PrivateLink setup. Please allow 24-48 hours for this process to be completed. Support will contact you when the service is available. 

## Configuring new endpoints with PrivateLink

Once support has completed the configuration, you can start creating new connections using PrivateLink. 

1. Navigate to settings → Create new project → select Redshift
2. You will see two radio buttons: **Public** and **Private.** Select Private 
3. Select the private endpoint from the dropdown (this will automatically populate the hostname/account field)
4. Configure the remaining DWH details 
5. Test your connection and save it
