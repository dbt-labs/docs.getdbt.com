---
title: "Configuring Databricks and Azure Private Link"
id: databricks-private-link
description: "Configuring Azure Private Link for Databricks"
sidebar_label: "Azure Private Link for Databricks"
pagination_next: null
---

import SetUpPages from '/snippets/_available-tiers-private-connection.md';
import CloudProviders from '/snippets/_private-connection-across-providers.md';

<SetUpPages features={'/snippets/_available-tiers-private-connection.md'}/>

The following steps will walk you through the setup of a Databricks Azure Private Link endpoint in the <Constant name="cloud" /> multi-tenant environment.

<CloudProviders type='Databricks'/>

## Configure Azure Private Link

1. Navigate to your Azure Databricks workspace. 
    The path format is: `/subscriptions/<subscription_uuid>/resourceGroups/<resource_group_name>/providers/Microsoft.Databricks/workspaces/<workspace_name>`.
2. From the workspace overview, click **JSON view**. 
3. Copy the value in the `resource_id` field.  
4. Add the required information to the following template and submit your Azure Private Link request to [dbt Support](/docs/dbt-support#dbt-cloud-support): 
    ```
      Subject: New Azure Multi-Tenant Private Link Request
    - Type: Databricks
    - Databricks instance name:
    - Azure Databricks Workspace URL (e.g. adb-################.##.azuredatabricks.net)
    - Databricks Azure resource ID:
    - <Constant name="cloud" /> multi-tenant environment: EMEA
    - Azure region: Region that hosts your Databricks workspace (like, WestEurope, NorthEurope)
    ```
5. Once our Support team confirms the resources are available in the Azure portal, navigate to the Azure Databricks Workspace and browse to **Networking** > **Private Endpoint Connections**. Then, highlight the `dbt` named option and select **Approve**.


## Create connection in dbt

Once you've completed the setup in the Databricks environment, you will be able to configure a private endpoint in <Constant name="cloud" />:

1. Navigate to **Settings** → **Create new project** → select **Databricks**. 
2. You will see two radio buttons: **Public** and **Private.** Select **Private**. 
3. Select the private endpoint from the dropdown (this will automatically populate the hostname/account field).
4. Configure the remaining data platform details.
5. Test your connection and save it.
