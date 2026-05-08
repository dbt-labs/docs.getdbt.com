---
title: "Configuring Private Link for Azure Database for Postgres Flexible Server"
id: azure-postgres
description: "Configuring Private Link for Azure Database for Postgres Flexible Server."
sidebar_label: "Azure Database for PostgreSQL Flexible Server"
---

import SetUpPages from '/snippets/_available-tiers-enterprise-plus.md';
import PrivateLinkSLA from '/snippets/_private-connection-SLA.md';
import CloudProviders from '/snippets/_private-connection-across-providers.md';

<SetUpPages features={'/snippets/_available-tiers-enterprise-plus.md'}/>

The following steps walk you through the setup of a Private Link endpoint for Azure Database for Postgres Flexible Server in a <Constant name="dbt" /> multi-tenant environment.

<CloudProviders type='Azure Database' />

## Configure Azure Private Link

From your Azure portal:

1. Navigate to your Azure Database for Postgres Flexible Server.
2. From the server overview, click **JSON view**. 
3. Copy the value in the **Resource ID** field at the top of the pane.  
    The path format is: `/subscriptions/<subscription_uuid>/resourceGroups/<resource_group_name>/providers/Microsoft.DBforPostgreSQL/flexibleServers/<server_name>`.
4. Add the required information to the following template and submit your Azure Private Link request to [dbt Support](mailto:support@getdbt.com):

   <Expandable alt_header="Support request email template" is_open={true}>

   ```text
   Subject: New Azure Multi-Tenant Private Link Request

   - Type: Azure Database for Postgres Flexible Server
   - dbt platform account URL:
   - Postgres Flexible Server name:
   - Azure Database for Postgres Flexible Server resource ID:
   - dbt Azure multi-tenant environment (US or EMEA):
   - Azure Postgres server region (for example, WestEurope, NorthEurope):
   ```

   </Expandable>

   <PrivateLinkSLA />

5. Once our Support team confirms the endpoint has been created, navigate to the Azure Database for Postgres Flexible Server in the Azure Portal and browse to **Settings** > **Networking**. In the **Private Endpoints** section, highlight the `dbt` named option and select **Approve**. Confirm with dbt Support that the connection has been approved so they can validate the connection and make it available for use in <Constant name="dbt" />.


## Create connection in dbt

Once you've completed the setup in the Azure environment, you can configure a private endpoint in <Constant name="dbt" />:

1. Navigate to **Settings** → **Create new project** → select **Postgres**. 
2. You will see two radio buttons: **Default Endpoint** and **PrivateLink Endpoint**. Select **PrivateLink Endpoint**. 
3. Select the private endpoint from the dropdown (this will automatically populate the hostname/account field).
4. Configure the remaining data platform details.
5. Test your connection and save it.
