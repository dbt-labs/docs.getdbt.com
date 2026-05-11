---
title: "Configuring Snowflake and GCP Private Service Connect"
id: gcp-snowflake
description: "Configuring GCP Private Service Connect for Snowflake."
sidebar_label: "Snowflake"
---

# Configuring Snowflake Private Service Connect <Lifecycle status="managed_plus" />

import SetUpPages from '/snippets/_available-tiers-enterprise-plus.md';
import CloudProviders from '/snippets/_private-connection-across-providers.md';

<SetUpPages features={'/snippets/_available-tiers-enterprise-plus.md'}/>

The following steps walk you through the setup of a GCP Snowflake Private Service Connect (PSC) endpoint in a <Constant name="dbt" /> multi-tenant environment.

<CloudProviders type='Snowflake' />

:::warning

GCP Internal Stage PSC connections are not currently supported.

:::

## Configure GCP Private Service Connect

The dbt Labs GCP project has been pre-authorized for connections to Snowflake accounts. 

To configure Snowflake instances hosted on GCP for [Private Service Connect](https://cloud.google.com/vpc/docs/private-service-connect):

1. Run the Snowflake system function [SYSTEM$GET_PRIVATELINK_CONFIG](https://docs.snowflake.com/en/sql-reference/functions/system_get_privatelink_config.html) and copy the output.

2. Add the required information to the following template and submit your request to  [dbt Support](mailto:support@getdbt.com):

<Expandable alt_header="Support request email template" is_open={true}>

```text
Subject: New Multi-Tenant GCP PSC Request

- Type: Snowflake
- dbt platform account URL:
- SYSTEM$GET_PRIVATELINK_CONFIG output:
- *Use privatelink-account-url or regionless-privatelink-account-url?:
- dbt GCP multi-tenant environment:
```

</Expandable>
_*By default, <Constant name="dbt" /> will be configured to use `privatelink-account-url` from the provided [SYSTEM$GET_PRIVATELINK_CONFIG](https://docs.snowflake.com/en/sql-reference/functions/system_get_privatelink_config.html) as the PrivateLink endpoint. Upon request, `regionless-privatelink-account-url` can be used instead._


import PrivateLinkSLA from '/snippets/_private-connection-SLA.md';

<PrivateLinkSLA />

## Create connection in dbt

Once <Constant name="dbt" /> Support completes the configuration, you can start creating new connections using PrivateLink. 

1. Navigate to **Settings** → **Create new project** → select **Snowflake**. 
2. You will see two radio buttons: **Public** and **Private**. Select **Private**. 
3. Select the private endpoint from the dropdown (this automatically populates the hostname/account field).
4. Configure the remaining data platform details.
5. Test your connection and save it.

## Configuring network policies

If your organization uses [Snowflake Network Policies](https://docs.snowflake.com/en/user-guide/network-policies) to restrict access to your Snowflake account, you need to add a network rule for <Constant name="dbt" />. 

Request the **PSC connection ID** from [<Constant name="dbt" /> Support](mailto:support@getdbt.com) to use in a network rule. Snowflake supports [`GCPPSCID` as a network rule identifier type](https://docs.snowflake.com/en/sql-reference/sql/create-network-rule), and this is the recommended approach. A PSC connection ID uniquely identifies your organization's connection endpoint, whereas IP-based rules rely on CIDR ranges that may be shared across multiple dbt customers.

### Using the UI

Open the Snowflake UI and take the following steps:
1. Go to the **Security** tab.
2. Click on **Network Rules**.
3. Click on **Add Rule**.
4. Give the rule a name.
5. Select a database and schema where the rule will be stored. These selections are for permission settings and organizational purposes; they do not affect the rule itself.
6. Set the type to `GCPPSCID` and the mode to `Ingress`.
7. Enter the PSC connection ID provided by <Constant name="dbt" /> Support into the identifier box and press **Enter**.
8. Click **Create Network Rule**.
9. In the **Network Policy** tab, edit the policy you want to add the rule to. This could be your account-level policy or a policy specific to the users connecting from <Constant name="dbt" />.
10. Add the new rule to the allowed list and click **Update Network Policy**.

### Using SQL

For quick and automated setup of network rules via SQL in Snowflake, the following commands allow you to create and configure access rules for <Constant name="dbt" />. These SQL examples demonstrate how to add a network rule and update your network policy accordingly.

1. Create a new network rule with the following SQL:
```sql

CREATE NETWORK RULE allow_dbt_cloud_access
  MODE = INGRESS
  TYPE = GCPPSCID
  VALUE_LIST = ('<PSC_CONNECTION_ID>'); -- Replace with the PSC connection ID from dbt Support

```

2. Add the rule to a network policy with the following SQL:
```sql

ALTER NETWORK POLICY <network_policy_name>
  ADD ALLOWED_NETWORK_RULE_LIST =('allow_dbt_cloud_access');

```
