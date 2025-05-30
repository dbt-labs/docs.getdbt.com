---
title: "Configuring Snowflake and AWS PrivateLink"
id: snowflake-privatelink
description: "Configuring AWS PrivateLink for Snowflake"
sidebar_label: "AWS PrivateLink for Snowflake"
---

# Configuring Snowflake PrivateLink <Lifecycle status="managed_plus" />

import SetUpPages from '/snippets/_available-tiers-private-connection.md';
import CloudProviders from '/snippets/_private-connection-across-providers.md';

<SetUpPages features={'/snippets/_available-tiers-private-connection.md'}/>

The following steps walk you through the setup of an AWS-hosted Snowflake PrivateLink endpoint in a <Constant name="cloud" /> multi-tenant environment.

<CloudProviders type='Snowflake' />

:::note Snowflake OAuth with PrivateLink
Users connecting to Snowflake using [Snowflake OAuth](/docs/cloud/manage-access/set-up-snowflake-oauth) over an AWS PrivateLink connection from <Constant name="cloud" /> will also require access to a PrivateLink endpoint from their local workstation. Where possible, use [Snowflake External OAuth](/docs/cloud/manage-access/external-oauth) instead to bypass this limitation.

Snowflake docs:
>Currently, for any given Snowflake account, SSO works with only one account URL at a time: either the public account URL or the URL associated with the private connectivity service

- [Snowflake SSO with Private Connectivity](https://docs.snowflake.com/en/user-guide/admin-security-fed-auth-overview#label-sso-private-connectivity)
:::

:::warning

AWS Internal Stage PrivateLink connections are not currently supported.

:::

## Configure AWS PrivateLink

To configure Snowflake instances hosted on AWS for [PrivateLink](https://aws.amazon.com/privatelink):

1. Open a support case with Snowflake to allow access from the <Constant name="cloud" /> AWS or Entra ID account.
- Snowflake prefers that the account owner opens the support case directly rather than dbt Labs acting on their behalf. For more information, refer to [Snowflake's knowledge base article](https://community.snowflake.com/s/article/HowtosetupPrivatelinktoSnowflakefromCloudServiceVendors).
- Provide them with your <Constant name="cloud" /> account ID along with any other information requested in the article.
  - **AWS account ID**: `346425330055` &mdash; _NOTE: This account ID only applies to AWS <Constant name="cloud" /> multi-tenant environments. For AWS Virtual Private/Single-Tenant account IDs, please contact [Support](/docs/dbt-support#dbt-cloud-support)._
- You will need to have `ACCOUNTADMIN` access to the Snowflake instance to submit a Support request.

<Lightbox src="/img/docs/dbt-cloud/snowflakeprivatelink1.png" title="Open snowflake case"/>

2. After Snowflake has granted the requested access, run the Snowflake system function [SYSTEM$GET_PRIVATELINK_CONFIG](https://docs.snowflake.com/en/sql-reference/functions/system_get_privatelink_config.html) and copy the output.

3. Add the required information to the following template and submit your request to  [dbt Support](/docs/dbt-support#dbt-cloud-support):

```
Subject: New Multi-Tenant (Azure or AWS) PrivateLink Request
- Type: Snowflake
- SYSTEM$GET_PRIVATELINK_CONFIG output:
- *Use privatelink-account-url or regionless-privatelink-account-url?: 
- <Constant name="cloud" /> multi-tenant environment 
    - AWS: US, EMEA, or AU
    - Azure: EMEA only
```
_*By default, <Constant name="cloud" /> will be configured to use `privatelink-account-url` from the provided [SYSTEM$GET_PRIVATELINK_CONFIG](https://docs.snowflake.com/en/sql-reference/functions/system_get_privatelink_config.html) as the PrivateLink endpoint. Upon request, `regionless-privatelink-account-url` can be used instead._


import PrivateLinkSLA from '/snippets/_private-connection-SLA.md';

<PrivateLinkSLA />

## Create Connection in dbt

Once <Constant name="cloud" /> support completes the configuration, you can start creating new connections using PrivateLink. 

1. Navigate to **Settings** → **Create new project** → select **Snowflake**. 
2. You will see two radio buttons: **Public** and **Private.** Select **Private**. 
3. Select the private endpoint from the dropdown (this will automatically populate the hostname/account field).
4. Configure the remaining data platform details.
5. Test your connection and save it.

## Configuring Network Policies
If your organization uses [Snowflake Network Policies](https://docs.snowflake.com/en/user-guide/network-policies) to restrict access to your Snowflake account, you will need to add a network rule for <Constant name="cloud" />. 

You can request the VPCE ID from [<Constant name="cloud" /> Support](mailto:support@getdbt.com), that you can use to create a network policy. 

### Using the UI

Open the Snowflake UI and take the following steps:
1. Go to the **Security** tab.
2. Click on **Network Rules**.
3. Click on **Add Rule**.
4. Give the rule a name.
5. Select a database and schema where the rule will be stored. These selections are for permission settings and organizational purposes; they do not affect the rule itself.
6. Set the type to `AWS VPCE ID` and the mode to `Ingress`.
7. Type the VPCE ID provided by <Constant name="cloud" /> Support into the identifier box and press **Enter**.
8. Click **Create Network Rule**.

<Lightbox src="/img/docs/dbt-cloud/snowflakeprivatelink2.png" title="Create Network Rule"/>

9. In the **Network Policy** tab, edit the policy you want to add the rule to. This could be your account-level policy or a policy specific to the users connecting from <Constant name="cloud" />.

10. Add the new rule to the allowed list and click **Update Network Policy**.

<Lightbox src="/img/docs/dbt-cloud/snowflakeprivatelink3.png" title="Update Network Policy"/>

### Using SQL

For quick and automated setup of network rules via SQL in Snowflake, the following commands allow you to create and configure access rules for <Constant name="cloud" />. These SQL examples demonstrate how to add a network rule and update your network policy accordingly.

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
