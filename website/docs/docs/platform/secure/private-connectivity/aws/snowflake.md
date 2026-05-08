---
title: "Configuring Snowflake and AWS PrivateLink"
id: aws-snowflake
description: "Configuring AWS PrivateLink for Snowflake."
sidebar_label: "Snowflake"
---

# Configuring Snowflake PrivateLink <Lifecycle status="managed_plus" />

import SetUpPages from '/snippets/_available-tiers-enterprise-plus.md';
import CloudProviders from '/snippets/_private-connection-across-providers.md';

<SetUpPages features={'/snippets/_available-tiers-enterprise-plus.md'}/>

The following steps walk you through the setup of an AWS-hosted Snowflake PrivateLink endpoint in a <Constant name="dbt" /> multi-tenant environment.

<CloudProviders type='Snowflake' />

import SnowflakeOauthWithPL from '/snippets/_snowflake-oauth-with-pl.md'; 

<SnowflakeOauthWithPL />

## Configure AWS PrivateLink

This section walks you through the setup of an AWS-hosted Snowflake PrivateLink endpoint in a <Constant name="dbt_platform" />. You can set up in two ways:
- [Self-serve private endpoints](#self-serve-private-endpoints): Self-serve configuration of Snowflake PrivateLink endpoints directly in <Constant name="dbt_platform" /> user interface. Currently in private beta. 
- [Support-led setup](#support-led-setup): Requires contacting dbt Support to configure Snowflake PrivateLink endpoints. Non-self service configuration of Snowflake PrivateLink endpoints. 

### Self-serve private endpoints <Lifecycle status="private_beta" />

:::note
Self-serve private endpoints are currently in private beta for Snowflake on AWS. To join the beta, please reach out to your account manager. 

This feature isn't available for Azure or GCP. If you don't see **Private endpoints** in your account settings, use the [Support-led setup](#support-led-setup) instead.
:::

This section walks you through the process of requesting a new Snowflake PrivateLink endpoint in <Constant name="dbt_platform" />. 

##### Prerequisites

- [Account admin](/docs/platform/manage-access/enterprise-permissions?version=2.0#account-admin) or [Project creator](/docs/platform/manage-access/enterprise-permissions?version=2.0#project-creator) permission sets in <Constant name="dbt_platform"/>. Users with an IT license can also create private endpoints.
- [Snowflake `ACCOUNTADMIN` permissions](https://docs.snowflake.com/en/user-guide/security-access-control-overview#system-defined-roles).

##### Before you begin

Before requesting a private endpoint, allowlist <Constant name="dbt" /> Labs' AWS account in Snowflake. This is a one-time setup per Snowflake account and is handled through a Snowflake support case, which can take time &mdash; complete it before starting the request flow.

1. Open a support case with Snowflake to allow access from the <Constant name="dbt" /> AWS account.
   - Snowflake prefers that the account owner opens the support case directly rather than dbt Labs acting on their behalf. For more information, refer to [Snowflake's knowledge base article](https://community.snowflake.com/s/article/HowtosetupPrivatelinktoSnowflakefromCloudServiceVendors).
   - Provide your <Constant name="dbt" /> account ID along with any other information requested in the article.
     - **AWS account ID**: `346425330055` &mdash; _Note: This account ID only applies to AWS <Constant name="dbt" /> multi-tenant environments. For AWS Virtual Private/Single-Tenant account IDs, contact [dbt Support](mailto:support@getdbt.com)._
2. Wait for Snowflake to confirm access has been granted before proceeding.

   <Lightbox src="/img/docs/dbt-platform/snowflakeprivatelink1.png" title="Open snowflake case"/>

#### Request a new private endpoint

After Snowflake confirms they've allowlisted <Constant name="dbt" /> Labs' AWS account in Snowflake, you can request a new private endpoint. Follow these steps to do so:

1. In <Constant name="dbt_platform" />, go to **Account settings → Integrations → Private endpoints**.
2. In the **Private endpoints** table, review your existing endpoints. The table shows all private endpoints in your account (including non-Snowflake ones) with the following details:
   - **Name**
   - **Connection type** (for example, Snowflake)
   - **URL**
   - **Connectivity status** (for example, **Success** or **Unknown**)
   - **Connections** — the number of <Constant name="dbt_platform" /> connections using the endpoint

   You can search by **Name** or **URL**. You can only _create_ new endpoints for Snowflake at this time. To delete an endpoint, contact [dbt Support](mailto:support@getdbt.com).

    <Lightbox src="/img/docs/dbt-platform/private-endpoint-page.png" title="Private endpoints table showing existing endpoints, connectivity status, and the Request new button"/>

3. To request a new endpoint, click **Request new**.
4. Under **Provider type**, confirm **Snowflake** is selected. Currently other endpoint providers aren't supported, contact [dbt Support](mailto:support@getdbt.com) if you need to connect to a different service.
5. Copy the SQL command in the **SQL command snippet** section.
6. Go to Snowflake and run the SQL command snippet you copied from <Constant name="dbt_platform" />: `SELECT SYSTEM$GET_PRIVATELINK_CONFIG();`
7. Copy the output from Snowflake and return to <Constant name="dbt_platform" /> to paste it into the **Snowflake output** field. If the output is correct, you'll see an inline **Output looks good** type message below the text box. If there's an error, review the message and make any updates as necessary.
8. Click **Submit request**.

    <Lightbox src="/img/docs/dbt-platform/private-endpoint-config.png" title="Endpoint request form showing Provider type, SQL command snippet, and Snowflake output fields"/>

9. After submission, a confirmation popup appears (for example, **Endpoint request submitted**). From the popup, you can request another endpoint or return to **Private endpoints** to track request status.
10. Proceed to the **Connections** page and following the steps in the [Create connection in dbt](#create-connection-in-dbt) section to configure PrivateLink. 
Once you configure PrivateLink on the **Connections** page, you'll see the new endpoint appear under **Private endpoints → Associated connections**.

:::note DNS propagation
If the connection test fails immediately after setup, this is expected &mdash; it doesn't mean something is wrong. DNS changes can take a few minutes to propagate. Wait a few minutes, then test again before contacting support.
:::

#### Duplicate endpoint requests

If you submit a request using a VPCE ID that matches an existing endpoint, <Constant name="dbt_platform"/> displays an **Endpoint already exists** popup with two options:

- **Reuse existing interface endpoint** (default, recommended) — Links the new private endpoint to an already-approved interface endpoint. Use this option when your VPCE is already approved to avoid duplicating infrastructure.
- **Create new interface endpoint** — Creates a new interface endpoint with its own network policy. Use this only if you need a distinct network policy configuration.

Select your preferred option and click **Confirm & Submit**.

  <Lightbox src="/img/docs/dbt-platform/endpoint-exists.png" width="70%" title="Endpoint already exists popup with options to create a new interface endpoint or re-use an existing one"/>

#### Troubleshooting and errors

If an endpoint request fails, <Constant name="dbt_platform"/> displays error details that are safe to share externally.

If you see a failure state without clear next steps, collect the request details (endpoint name, creation time, status, and the Snowflake output you provided) and contact [dbt Support](mailto:support@getdbt.com).

### Support-led setup {#support-led-setup}

If **Private endpoints** is not available in your account settings, configure Snowflake PrivateLink by following these steps and submitting a request to dbt Support.

To configure Snowflake instances hosted on AWS for [PrivateLink](https://aws.amazon.com/privatelink):

1. Open a support case with Snowflake to allow access from the <Constant name="dbt" /> AWS account.
   - Snowflake prefers that the account owner opens the support case directly rather than dbt Labs acting on their behalf. For more information, refer to [Snowflake's knowledge base article](https://community.snowflake.com/s/article/HowtosetupPrivatelinktoSnowflakefromCloudServiceVendors).
   - Provide them with your <Constant name="dbt" /> account ID along with any other information requested in the article.
     - **AWS account ID**: `346425330055` &mdash; _Note: This account ID only applies to AWS <Constant name="dbt" /> multi-tenant environments. For AWS Virtual Private/Single-Tenant account IDs, contact [dbt Support](mailto:support@getdbt.com)._
   - You need [Snowflake's `ACCOUNTADMIN` permissions](https://docs.snowflake.com/en/user-guide/security-access-control-overview#system-defined-roles).

<Lightbox src="/img/docs/dbt-platform/snowflakeprivatelink1.png" title="Open snowflake case"/>

2. After Snowflake has granted the requested access, run the Snowflake system function [SYSTEM$GET_PRIVATELINK_CONFIG](https://docs.snowflake.com/en/sql-reference/functions/system_get_privatelink_config.html) and copy the output.

3. Add the required information to the following template and submit your request to [dbt Support](mailto:support@getdbt.com):

<Expandable alt_header="Support request email template" is_open={true}>

```text
Subject: New Multi-Tenant (Azure or AWS) PrivateLink Request

- Type: Snowflake
- dbt platform account URL:
- SYSTEM$GET_PRIVATELINK_CONFIG output:
- *Use privatelink-account-url or regionless-privatelink-account-url?:
- **Create Internal Stage PrivateLink endpoint? (Y/N):
- dbt AWS multi-tenant environment (US, EMEA, AU, JP):
```

</Expandable>
_*By default, <Constant name="dbt" /> will be configured to use `privatelink-account-url` from the provided [SYSTEM$GET_PRIVATELINK_CONFIG](https://docs.snowflake.com/en/sql-reference/functions/system_get_privatelink_config.html) as the PrivateLink endpoint. Upon request, `regionless-privatelink-account-url` can be used instead._

_** Internal Stage PrivateLink must be [enabled on the Snowflake account](https://docs.snowflake.com/en/user-guide/private-internal-stages-aws#prerequisites) to use this feature_


import PrivateLinkSLA from '/snippets/_private-connection-SLA.md';

<PrivateLinkSLA />

## Create connection in dbt

Once <Constant name="dbt" /> Support completes the configuration, you can start creating new connections using PrivateLink. 

1. Navigate to **Settings** → **Create new project** → select **Snowflake**. 
2. You will see two radio buttons: **Public** and **Private**. Select **Private**. 
3. Select the private endpoint from the dropdown (this automatically populates the hostname/account field).
4. Configure the remaining data platform details.
5. Test your connection and save it.

## Configuring internal stage PrivateLink in <Constant name="dbt" />

If an Internal Stage PrivateLink endpoint has been provisioned, your dbt environments must be configured to use this endpoint instead of the account default set in Snowflake.

1. Obtain the Internal Stage PrivateLink endpoint DNS from dbt Support. For example, `*.vpce-012345678abcdefgh-4321dcba.s3.us-west-2.vpce.amazonaws.com`.
2. In the appropriate dbt project, navigate to **Orchestration** → **Environments**.
3. In any environment that should use the dbt Internal Stage PrivateLink endpoint, set an **Extended Attribute** similar to the following:
```
s3_stage_vpce_dns_name: '*.vpce-012345678abcdefgh-4321dcba.s3.us-west-2.vpce.amazonaws.com'
```
4. Save the changes.

<Lightbox src="/img/docs/dbt-platform/snowflake-internal-stage-dns.png" title="Internal Stage DNS"/>

## Configuring network policies
If your organization uses [Snowflake Network Policies](https://docs.snowflake.com/en/user-guide/network-policies) to restrict access to your Snowflake account, you need to add a network rule for <Constant name="dbt" />. 

You can request the VPCE IDs from [<Constant name="dbt" /> Support](mailto:support@getdbt.com), that you can use to create a network policy. If creating an endpoint for Internal Stage, the VPCE ID will be different from the VPCE ID of the main service endpoint.

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
7. Type the VPCE ID provided by <Constant name="dbt" /> Support into the identifier box and press **Enter**.
8. Click **Create Network Rule**.

<Lightbox src="/img/docs/dbt-platform/snowflakeprivatelink2.png" title="Create Network Rule"/>

9. In the **Network Policy** tab, edit the policy you want to add the rule to. This could be your account-level policy or a policy specific to the users connecting from <Constant name="dbt" />.

10. Add the new rule to the allowed list and click **Update Network Policy**.

<Lightbox src="/img/docs/dbt-platform/snowflakeprivatelink3.png" title="Update Network Policy"/>

### Using SQL

For quick and automated setup of network rules via SQL in Snowflake, the following commands allow you to create and configure access rules for <Constant name="dbt" />. These SQL examples demonstrate how to add a network rule and update your network policy accordingly.

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
