---
title: "Configuring Private Link for Azure Database for Postgres Flexible Server"
id: az-postgres-private-link
description: "Configuring Private Link for Azure Database for Postgres Flexible Server"
sidebar_label: "Private Link for Azure Database for Postgres Flexible Server"
---

import SetUpPages from '/snippets/_available-tiers-private-connection.md';
import CloudProviders from '/snippets/_private-connection-across-providers.md';

<SetUpPages features={'/snippets/_available-tiers-private-connection.md'}/>

The following steps walk you through the setup of a Private Link endpoint for Azure Database for Postgres Flexible Server in a <Constant name="cloud" /> multi-tenant environment.

<CloudProviders type='Azure Database' />

## Configure Azure Private Link

From your Azure portal:

1. Navigate to your Azure Database for Postgres Flexible Server.
2. From the server overview, click **JSON view**. 
3. Copy the value in the **Resource ID** field at the top of the pane.  
    The path format is: `/subscriptions/<subscription_uuid>/resourceGroups/<resource_group_name>/providers/Microsoft.DBforPostgreSQL/flexibleServers/<server_name>`.
4. Add the required information to the following template and submit your Azure Private Link request to [dbt Support](/docs/dbt-support#dbt-cloud-support): 
    ```
      Subject: New Azure Multi-Tenant Private Link Request
    - Type: Azure Database for Postgres Flexible Server
    - Postgres Flexible Server name:
    - Azure Database for Postgres Flexible Server resource ID:
    - dbt Azure multi-tenant environment (EMEA):
    - Azure Postgres server region (e.g., WestEurope, NorthEurope):
    ```
5. Once our support team confirms the endpoint has been created, navigate to the Azure Database for Postgres Flexible Server in the Azure Portal and browse to **Settings** > **Networking**. In the **Private Endpoints** section, highlight the `dbt` named option and select **Approve**. Confirm with Support that the connection has been approved so they can validate the connection and make it available for use in  <Constant name="cloud" />.


## Create connection in dbt

Once you've completed the setup in the Azure environment, you will be able to configure a private endpoint in <Constant name="cloud" />:

1. Navigate to **Settings** → **Create new project** → select **Postgres**. 
2. You will see two radio buttons: **Default Endpoint** and **PrivateLink Endpoint**. Select **PrivateLink Endpoint**. 
3. Select the private endpoint from the dropdown (this will automatically populate the hostname/account field).
4. Configure the remaining data platform details.
5. Test your connection and save it.
