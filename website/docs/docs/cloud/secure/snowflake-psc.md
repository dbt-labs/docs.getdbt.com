---
title: "Configuring Snowflake and GCP Private Service Connect"
id: snowflake-psc
description: "Configuring GCP Private Service Connect for Snowflake"
sidebar_label: "GCP Private Service Connect for Snowflake"
---

# Configuring Snowflake Private Service Connect <Lifecycle status="managed_plus" />

import SetUpPages from '/snippets/_available-tiers-private-connection.md';
import CloudProviders from '/snippets/_private-connection-across-providers.md';

<SetUpPages features={'/snippets/_available-tiers-private-connection.md'}/>

The following steps walk you through the setup of a GCP Snowflake Private Service Connect (PSC) endpoint in a <Constant name="cloud" /> multi-tenant environment.

<CloudProviders type='Snowflake' />

:::warning

GCP Internal Stage PSC connections are not currently supported.

:::

## Configure GCP Private Service Connect

To configure Snowflake instances hosted on GCP for [Private Service Connect](https://cloud.google.com/vpc/docs/private-service-connect):

1. Follow the steps in the [Authorize Private Service Connect for your account](https://docs.snowflake.com/en/user-guide/private-service-connect-google#authorize-private-service-connect-for-your-account) section in the Snowflake Documentation to allow for PSC connectivity from the dbt GCP project. Use `dbt-cloud-prod-psc` as the project ID in the `AUTHORIZE_PRIVATELINK` step, replacing `<access_token>` with the token retrieved in the previous step.

```
USE ROLE ACCOUNTADMIN;

SELECT SYSTEM$AUTHORIZE_PRIVATELINK (
 'dbt-cloud-prod-psc',
 '<access_token>' 
);
```

2. After access has been granted, run the Snowflake system function [SYSTEM$GET_PRIVATELINK_CONFIG](https://docs.snowflake.com/en/sql-reference/functions/system_get_privatelink_config.html) and copy the output.

3. Add the required information to the following template and submit your request to  [dbt Support](/docs/dbt-support#dbt-cloud-support):

```
Subject: New Multi-Tenant GCP PSC Request
- Type: Snowflake
- SYSTEM$GET_PRIVATELINK_CONFIG output:
- *Use privatelink-account-url or regionless-privatelink-account-url?: 
- dbt GCP multi-tenant environment:
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

You can request the CIDR range from [<Constant name="cloud" /> Support](mailto:support@getdbt.com), that you can use to create a network policy. 

### Using the UI

Open the Snowflake UI and take the following steps:
1. Go to the **Security** tab.
2. Click on **Network Rules**.
3. Click on **Add Rule**.
4. Give the rule a name.
5. Select a database and schema where the rule will be stored. These selections are for permission settings and organizational purposes; they do not affect the rule itself.
6. Set the type to `IPV4` and the mode to `Ingress`.
7. Type the CIDR range provided by <Constant name="cloud" /> Support into the identifier box and press **Enter**.
8. Click **Create Network Rule**.
9. In the **Network Policy** tab, edit the policy you want to add the rule to. This could be your account-level policy or a policy specific to the users connecting from <Constant name="cloud" />.
10. Add the new rule to the allowed list and click **Update Network Policy**.

### Using SQL

For quick and automated setup of network rules via SQL in Snowflake, the following commands allow you to create and configure access rules for <Constant name="cloud" />. These SQL examples demonstrate how to add a network rule and update your network policy accordingly.

1. Create a new network rule with the following SQL:
```sql

CREATE NETWORK RULE allow_dbt_cloud_access
  MODE = INGRESS
  TYPE = IPV4
  VALUE_LIST = ('<CIDR_RANGE>'); -- Replace '<CIDR_RANGE>' with the actual CIDR provided

```

2. Add the rule to a network policy with the following SQL:
```sql

ALTER NETWORK POLICY <network_policy_name>
  ADD ALLOWED_NETWORK_RULE_LIST =('allow_dbt_cloud_access');

```
