---
title: "Configuring Snowflake and Azure Private Link"
id: snowflake-private-link
description: "Configuring Azure Private Link for Snowflake"
sidebar_label: "Azure Private Link for Snowflake"
---

import SetUpPages from '/snippets/_available-tiers-private-connection.md';
import CloudProviders from '/snippets/_private-connection-across-providers.md';

<SetUpPages features={'/snippets/_available-tiers-private-connection.md'}/>

The following steps walk you through the setup of an Azure-hosted Snowflake Private Link endpoint in a <Constant name="cloud" /> multi-tenant environment.

<CloudProviders type='Snowflake' />

:::note Snowflake OAuth with PrivateLink
Users connecting to Snowflake using [Snowflake OAuth](/docs/cloud/manage-access/set-up-snowflake-oauth) over an AWS PrivateLink connection from <Constant name="cloud" /> will also require access to a PrivateLink endpoint from their local workstation. Where possible, use [Snowflake External OAuth](/docs/cloud/manage-access/external-oauth) instead to bypass this limitation.

Snowflake docs:
>Currently, for any given Snowflake account, SSO works with only one account URL at a time: either the public account URL or the URL associated with the private connectivity service

- [Snowflake SSO with Private Connectivity](https://docs.snowflake.com/en/user-guide/admin-security-fed-auth-overview#label-sso-private-connectivity)
:::

## Configure Azure Private Link

To configure Snowflake instances hosted on Azure for [Private Link](https://learn.microsoft.com/en-us/azure/private-link/private-link-overview):

1. In your Snowflake account, run the following SQL statements and copy the output: 

```sql

USE ROLE ACCOUNTADMIN;
SYSTEM$GET_PRIVATELINK_CONFIG;

```

2. Add the required information to the following template and submit your request to  [dbt Support](https://docs.getdbt.com/docs/dbt-support#dbt-cloud-support): 

```
Subject: New Multi-Tenant Azure PrivateLink Request
- Type: Snowflake
- The output from SYSTEM$GET_PRIVATELINK_CONFIG:
  - Include the privatelink-pls-id
  - Enable Internal Stage Private Link? Y/N (If Y, output must include `privatelink-internal-stage`)
- dbt Azure multi-tenant environment: 
```

3. dbt Support will provide the `private endpoint resource_id` of our `private_endpoint` and the `CIDR` range for you to complete the [PrivateLink configuration](https://community.snowflake.com/s/article/HowtosetupPrivatelinktoSnowflakefromCloudServiceVendors) by contacting the Snowflake Support team. 


4. (Optional) If enabling an [Azure private endpoint for an Internal Stage](https://docs.snowflake.com/en/user-guide/private-internal-stages-azure), it will also provide the `resource_id` for the Internal Stage endpoint. 

As the Snowflake administrator, call the `SYSTEM$AUTHORIZE_STAGE_PRIVATELINK_ACCESS` function using the resource ID value as the function argument. This authorizes access to the Snowflake internal stage through the private endpoint. 

```sql

USE ROLE ACCOUNTADMIN;

-- Azure Private Link
SELECT SYSTEMS$AUTHORIZE_STAGE_PRIVATELINK_ACCESS ( `AZURE PRIVATE ENDPOINT RESOURCE ID` );

```

## Configuring Network Policies
If your organization uses [Snowflake Network Policies](https://docs.snowflake.com/en/user-guide/network-policies) to restrict access to your Snowflake account, you will need to add a network rule for <Constant name="cloud" />. 

### Find the endpoint Azure Link ID

Snowflake allows for finding the Azure Link ID of configured endpoints by running the `` command. The following can be used to better isolate the Link ID value and the associated endpoint resource name:

```sql

select
  value:linkIdentifier, REGEXP_SUBSTR(value: endpointId, '([^\/]+$)')
from
  table(
    flatten(
      input => parse_json(system$get_privatelink_authorized_endpoints())
    )
  );

```

### Using the UI

Open the Snowflake UI and take the following steps:
1. Go to the **Security** tab.
2. Click on **Network Rules**.
3. Click on **+ Network Rule**.
4. Give the rule a name.
5. Select a database and schema where the rule will be stored. These selections are for permission settings and organizational purposes; they do not affect the rule itself.
6. Set the type to `Azure Link ID` and the mode to `Ingress`.
7. In the identifier box, type the Azure Link ID obtained in the previous section and press **Enter**.
8. Click **Create Network Rule**.

<Lightbox src="/img/docs/dbt-cloud/snowflakeprivatelink2.png" title="Create Network Rule"/>

9. In the **Network Policy** tab, edit the policy to which you want to add the rule. This could be your account-level policy or one specific to the users connecting from <Constant name="cloud" />.


10. Add the new rule to the allowed list and click **Update Network Policy**.

<Lightbox src="/img/docs/dbt-cloud/snowflakeprivatelink3.png" title="Update Network Policy"/>

### Using SQL

For quick and automated setup of network rules via SQL in Snowflake, the following commands allow you to create and configure access rules for <Constant name="cloud" />. These SQL examples demonstrate how to add a network rule and update your network policy accordingly.

1. Create a new network rule with the following SQL:
```sql

CREATE NETWORK RULE allow_dbt_cloud_access
  MODE = INGRESS
  TYPE = AZURELINKID
  VALUE_LIST = ('<Azure Link ID>'); -- Replace '<Azure Link ID>' with the actual ID obtained above

```

2. Add the rule to a network policy with the following SQL:
```sql

ALTER NETWORK POLICY <network_policy_name>
  ADD ALLOWED_NETWORK_RULE_LIST =('allow_dbt_cloud_access');

```
