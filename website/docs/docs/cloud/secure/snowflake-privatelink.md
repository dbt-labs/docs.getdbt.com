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

import SnowflakeOauthWithPL from '/snippets/_snowflake-oauth-with-pl.md'; 

<SnowflakeOauthWithPL />

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
- **Create Internal Stage PrivateLink endpoint? (Y/N): 
- dbt AWS multi-tenant environment (US, EMEA, AU):
```
_*By default, <Constant name="cloud" /> will be configured to use `privatelink-account-url` from the provided [SYSTEM$GET_PRIVATELINK_CONFIG](https://docs.snowflake.com/en/sql-reference/functions/system_get_privatelink_config.html) as the PrivateLink endpoint. Upon request, `regionless-privatelink-account-url` can be used instead._

_** Internal Stage PrivateLink must be [enabled on the Snowflake account](https://docs.snowflake.com/en/user-guide/private-internal-stages-aws#prerequisites) to use this feature_


import PrivateLinkSLA from '/snippets/_private-connection-SLA.md';

<PrivateLinkSLA />

## Create Connection in dbt

Once <Constant name="cloud" /> support completes the configuration, you can start creating new connections using PrivateLink. 

1. Navigate to **Settings** → **Create new project** → select **Snowflake**. 
2. You will see two radio buttons: **Public** and **Private.** Select **Private**. 
3. Select the private endpoint from the dropdown (this will automatically populate the hostname/account field).
4. Configure the remaining data platform details.
5. Test your connection and save it.

## Configuring Internal Stage PrivateLink in <Constant name="cloud" />

If an Internal Stage PrivateLink endpoint has been provisioned, your dbt environments must be configured to use this endpoint instead of the account default set in Snowflake.

1. Obtain the Internal Stage PrivateLink endpoint DNS from dbt Support. For example, `*.vpce-012345678abcdefgh-4321dcba.s3.us-west-2.vpce.amazonaws.com`.
2. In the appropriate dbt project, navigate to **Orchestration** → **Environments**.
3. In any environment that should use the dbt Internal Stage PrivateLink endpoint, set an **Extended Attribute** similar to the following:
```
s3_stage_vpce_dns_name: '*.vpce-012345678abcdefgh-4321dcba.s3.us-west-2.vpce.amazonaws.com'
```
4. Save the changes

<Lightbox src="/img/docs/dbt-cloud/snowflake-internal-stage-dns.png" title="Internal Stage DNS"/>

## Configuring Network Policies
If your organization uses [Snowflake Network Policies](https://docs.snowflake.com/en/user-guide/network-policies) to restrict access to your Snowflake account, you will need to add a network rule for <Constant name="cloud" />. 

You can request the VPCE IDs from [<Constant name="cloud" /> Support](mailto:support@getdbt.com), that you can use to create a network policy. If creating an endpoint for Internal Stage, the VPCE ID will be different from the VPCE ID of the main service endpoint.

:::note Network Policy for Snowflake Internal Stage PrivateLink
For guidance on protecting both the Snowflake service and Internal Stage consult the Snowflake [network policies](https://docs.snowflake.com/en/user-guide/network-policies#strategies-for-protecting-both-service-and-internal-stage) and [network rules](https://docs.snowflake.com/en/user-guide/network-rules#incoming-requests) docs. 

:::

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
