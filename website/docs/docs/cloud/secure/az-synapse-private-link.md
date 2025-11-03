---
title: "Configuring Private Link for Azure Synapse"
id: az-synapse-private-link
description: "Configuring Private Link for Azure Synapse"
sidebar_label: "Private Link for Azure Synapse"
---

import SetUpPages from '/snippets/_available-tiers-private-connection.md';
import CloudProviders from '/snippets/_private-connection-across-providers.md';

<SetUpPages features={'/snippets/_available-tiers-private-connection.md'}/>

The following steps walk you through the setup of a Private Link endpoint for Azure Synapse in a <Constant name="cloud" /> multi-tenant environment.

<CloudProviders type='Azure Synapse' />

## Configure Azure Private Link

From your Azure portal:

1. Navigate to your Azure Synapse workspace.
2. From the workspace overview, click **JSON view**. 
3. Copy the value in the **Resource ID** field at the top of the pane.  
    The path format is: `/subscriptions/<subscription_uuid>/resourceGroups/<resource_group_name>/providers/Microsoft.Synapse/workspaces/<workspace_name>`.
4. Add the required information to the following template and submit your Azure Private Link request to [dbt Support](/docs/dbt-support#dbt-cloud-support): 
    ```
      Subject: New Azure Multi-Tenant Private Link Request
    - Type: Azure Synapse
    - Server name:
    - Azure Synapse workspace resource ID:
    - dbt Azure multi-tenant environment (EMEA):
    - Azure Synapse workspace region (for example, WestEurope, NorthEurope):
    ```
5. Once our support team confirms the the endpoint has been created, navigate to the Azure Synapse workspace in the Azure Portal and browse to **Security** > **Private endpoint connections**. In the **Private endpoint connections** table, highlight the `dbt` named option and select **Approve**. Confirm with Support that the connection has been approved so they can validate the connection and make it available for use in  <Constant name="cloud" />.


## Create connection in dbt

Once you've completed the step above, you will be able to configure a private endpoint in <Constant name="cloud" />:

1. Navigate to **Settings** → **Create new project** → select **Synapse**. 
2. You will see two radio buttons: **Default Endpoint** and **PrivateLink Endpoint**. Select **PrivateLink Endpoint**. 
3. Select the private endpoint from the dropdown (this will automatically populate the hostname/account field).
4. Configure the remaining data platform details.
5. Test your connection and save it.
