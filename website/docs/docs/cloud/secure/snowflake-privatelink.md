---
title: "Configuring Snowflake PrivateLink"
id: snowflake-privatelink
description: "Configuring PrivateLink for Snowflake"
sidebar_label: "PrivateLink for Snowflake"
---

import SetUpPages from '/snippets/_available-tiers-privatelink.md';
import CloudProviders from '/snippets/_privatelink-across-providers.md';

<SetUpPages features={'/snippets/_available-tiers-privatelink.md'}/>

The following steps walk you through the setup of a Snowflake AWS PrivateLink or Azure Private Link endpoint in a dbt Cloud multi-tenant environment.

<CloudProviders type='Snowflake' />

:::note Snowflake SSO with PrivateLink
Users connecting to Snowflake using SSO over a PrivateLink connection from dbt Cloud will also require access to a PrivateLink endpoint from their local workstation.

>Currently, for any given Snowflake account, SSO works with only one account URL at a time: either the public account URL or the URL associated with the private connectivity service.

- [Snowflake SSO with Private Connectivity](https://docs.snowflake.com/en/user-guide/admin-security-fed-auth-overview#label-sso-private-connectivity)
:::

## About private connectivity for Snowflake

dbt Cloud supports private connectivity for Snowflake using one of the following services:

- AWS [PrivateLink](#configure-aws-privatelink)
- Azure [Private Link](#configure-azure-private-link)

## Configure AWS PrivateLink

To configure Snowflake instances hosted on AWS for [PrivateLink](https://aws.amazon.com/privatelink):

1. Open a support case with Snowflake to allow access from the dbt Cloud AWS or Entra ID account.
- Snowflake prefers that the account owner opens the support case directly rather than dbt Labs acting on their behalf. For more information, refer to [Snowflake's knowledge base article](https://community.snowflake.com/s/article/HowtosetupPrivatelinktoSnowflakefromCloudServiceVendors).
- Provide them with your dbt Cloud account ID along with any other information requested in the article.
  - **AWS account ID**: `346425330055` &mdash; _NOTE: This account ID only applies to AWS dbt Cloud multi-tenant environments. For AWS Virtual Private/Single-Tenant account IDs, please contact [Support](https://docs.getdbt.com/docs/dbt-support#dbt-cloud-support)._
- You will need to have `ACCOUNTADMIN` access to the Snowflake instance to submit a Support request.

<Lightbox src="/img/docs/dbt-cloud/snowflakeprivatelink1.png" title="Open snowflake case"/>

2. After Snowflake has granted the requested access, run the Snowflake system function [SYSTEM$GET_PRIVATELINK_CONFIG](https://docs.snowflake.com/en/sql-reference/functions/system_get_privatelink_config.html) and copy the output.

3. Add the required information to the following template and submit your request to  [dbt Support](https://docs.getdbt.com/docs/dbt-support#dbt-cloud-support):

```
Subject: New Multi-Tenant (Azure or AWS) PrivateLink Request
- Type: Snowflake
- SYSTEM$GET_PRIVATELINK_CONFIG output:
- *Use privatelink-account-url or regionless-privatelink-account-url?: 
- dbt Cloud multi-tenant environment 
    - AWS: US, EMEA, or AU
    - Azure: EMEA only
```
_*By default dbt Cloud will be configured to use `privatelink-account-url` from the provided [SYSTEM$GET_PRIVATELINK_CONFIG](https://docs.snowflake.com/en/sql-reference/functions/system_get_privatelink_config.html) as the PrivateLink endpoint. Upon request, `regionless-privatelink-account-url` can be used instead._


import PrivateLinkSLA from '/snippets/_PrivateLink-SLA.md';

<PrivateLinkSLA />

## Configure Azure Private Link

To configure Snowflake instances hosted on Azure for [Private Link](https://learn.microsoft.com/en-us/azure/private-link/private-link-overview):

1. In your Snowflake account, run the following SQL statements and copy the output: 

```sql

USE ROLE ACCOUNTADMIN;
SYSTEM$GET_PRIVATELINK_CONFIG;

```


2. Add the required information to the following template and submit your request to  [dbt Support](https://docs.getdbt.com/docs/dbt-support#dbt-cloud-support): 

```
Subject: New Multi-Tenant (Azure or AWS) PrivateLink Request
- Type: Snowflake
- The output from SYSTEM$GET_PRIVATELINK_CONFIG:
  - Include the privatelink-pls-id
- dbt Cloud Azure multi-tenant environment: 
```

3. dbt Support will provide the `private endpoint resource_id` of our `private_endpoint` and the `CIDR` range for you to complete the [PrivateLink configuration](https://community.snowflake.com/s/article/HowtosetupPrivatelinktoSnowflakefromCloudServiceVendors) by contacting the Snowflake Support team. 

## Create Connection in dbt Cloud

Once dbt Cloud support completes the configuration, you can start creating new connections using PrivateLink. 

1. Navigate to **Settings** → **Create new project** → select **Snowflake**. 
2. You will see two radio buttons: **Public** and **Private.** Select **Private**. 
3. Select the private endpoint from the dropdown (this will automatically populate the hostname/account field).
4. Configure the remaining data platform details.
5. Test your connection and save it.

## Enable the connection in Snowflake

To complete the setup, follow the remaining steps from the Snowflake setup guides. The instructions vary based on the platform:

- [Snowflake AWS PrivateLink](https://docs.snowflake.com/en/user-guide/admin-security-privatelink)
- [Snowflake Azure Private Link](https://docs.snowflake.com/en/user-guide/privatelink-azure)

There are some nuances for each connection and you will need a Snowflake administrator. As the Snowflake administrator, call the `SYSTEM$AUTHORIZE_STAGE_PRIVATELINK_ACCESS` function using the privateEndpointResourceID value as the function argument. This authorizes access to the Snowflake internal stage through the private endpoint. 

```sql

USE ROLE ACCOUNTADMIN;

-- AWS PrivateLink
SELECT SYSTEMS$AUTHORIZE_STATE_PRIVATELINK_ACCESS ( `AWS VPC ID` );

-- Azure Private Link
SELECT SYSTEMS$AUTHORIZE_STATE_PRIVATELINK_ACCESS ( `AZURE PRIVATE ENDPOINT RESOURCE ID` );

```

## Configuring Network Policies
If your organization uses [Snowflake Network Policies](https://docs.snowflake.com/en/user-guide/network-policies) to restrict access to your Snowflake account, you will need to add a network rule for dbt Cloud. 

You can request the VPCE ID from [dbt Cloud Support](mailto:support@getdbt.com), that you can use to create a network policy. 

### Using the UI

Open the Snowflake UI and take the following steps:
1. Go to the **Security** tab.
2. Click on **Network Rules**.
3. Click on **Add Rule**.
4. Give the rule a name.
5. Select a database and schema where the rule will be stored. These selections are for permission settings and organizational purposes; they do not affect the rule itself.
6. Set the type to `AWS VPCE ID` and the mode to `Ingress`.
7. Type the VPCE ID provided by dbt Cloud Support into the identifier box and press **Enter**.
8. Click **Create Network Rule**.

<Lightbox src="/img/docs/dbt-cloud/snowflakeprivatelink2.png" title="Create Network Rule"/>

9. In the **Network Policy** tab, edit the policy you want to add the rule to. This could be your account-level policy or a policy specific to the users connecting from dbt Cloud.


10. Add the new rule to the allowed list and click **Update Network Policy**.

<Lightbox src="/img/docs/dbt-cloud/snowflakeprivatelink3.png" title="Update Network Policy"/>

### Using SQL

For quick and automated setup of network rules via SQL in Snowflake, the following commands allow you to create and configure access rules for dbt Cloud. These SQL examples demonstrate how to add a network rule and update your network policy accordingly.

1. Create a new network rule with the following SQL:
```sql

CREATE NETWORK RULE allow_dbt_cloud_access
  MODE = INGRESS
  TYPE = AWSVPCEID
  VALUE_LIST = ('<VPCE_ID>'); -- Replace '<VPCE_ID>' with the actual ID provided

```

2. Add the rule to a network policy with the following SQL:
```sql

ALTER NETWORK POLICY <network_policy_name>
  ADD ALLOWED_NETWORK_RULE_LIST =('allow_dbt_cloud_access');

```
