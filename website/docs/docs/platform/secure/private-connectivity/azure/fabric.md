---
title: "Configuring Private Link for Microsoft Fabric"
id: azure-fabric
description: "Configuring Azure Private Link for Microsoft Fabric."
sidebar_label: "Microsoft Fabric"
---

import SetUpPages from '/snippets/_available-tiers-private-connection.md';
import CloudProviders from '/snippets/_private-connection-across-providers.md';

<SetUpPages features={'/snippets/_available-tiers-private-connection.md'}/>

The following steps walk you through the setup of a Private Link endpoint for Microsoft Fabric in a <Constant name="dbt" /> multi-tenant environment.

<CloudProviders type='Microsoft Fabric' />

:::note Workspace-level Private Link
Microsoft Fabric offers two private connectivity models. Only **workspace-level Private Link** supports cross-tenant connections and is compatible with <Constant name="dbt" />. Tenant-level Private Link is designed for intra-organization access and does not support connections from external services like <Constant name="dbt" />.
:::

## Prerequisites

Before configuring Private Link, complete the following steps in your Microsoft Fabric environment:

### 1. Enable the workspace-level Private Link tenant setting

A Fabric Administrator must enable workspace-level private link for your tenant before it can be configured on individual workspaces.

1. Open the [Microsoft Fabric Admin portal](https://app.fabric.microsoft.com/admin-portal).
2. Navigate to **Tenant settings**.
3. Search for **Configure workspace-level inbound network rules** and expand the setting.
4. Toggle the setting to **Enabled**.
5. Click **Apply**.

### 2. Configure your workspace network settings

1. Open your Fabric workspace in the [Microsoft Fabric portal](https://app.fabric.microsoft.com).
2. Navigate to **Workspace settings** → **Inbound networking**.
3. Select **Allow connections from selected networks and workspace level private links**.
4. Click **Save**.

:::caution Restricting inbound access may block your own access
When you select this option, only connections from approved IP addresses and workspace-level private links are allowed. If you or your team need to continue accessing this workspace from the Fabric portal, add your organization's public IP addresses before saving. Consult your network administrator if you are unsure which IP ranges to include.

If you get locked out, a Fabric Administrator can restore access by navigating to the [Admin portal](https://app.fabric.microsoft.com/admin-portal) → **Tenant settings** → **Advanced networking** → **Configure workspace-level inbound network rules** and toggling the setting to **Disabled**. This reverts all workspaces to their previous network configuration.
:::

### 3. Register the Microsoft.Fabric resource provider

The `Microsoft.Fabric` resource provider must be registered in your Azure subscription before you can create Fabric Private Link resources.

1. In the [Azure portal](https://portal.azure.com), navigate to your **Subscription** → **Settings** → **Resource providers**.
2. Search for `Microsoft.Fabric`.
3. Select it and click **Re-register**. Wait for the status to change to **Registered**.

### 4. Create the Private Link Service resource

Fabric workspace-level Private Link uses a dedicated Azure resource (`Microsoft.Fabric/privateLinkServicesForFabric`) to expose your workspace as a private endpoint target. This resource is not available in the Azure portal marketplace, so you must deploy it using a custom template.

1. Find your Fabric workspace ID from the workspace URL: `https://app.fabric.microsoft.com/groups/<workspace-id>`. Find your Microsoft Entra Directory (tenant) ID from the [Azure portal](https://portal.azure.com) → **Microsoft Entra ID** → **Overview** → **Tenant ID**. This is the same Directory (tenant) ID used for service principal authentication.
2. In the [Azure portal](https://portal.azure.com), search for **Deploy a custom template** and select it.
3. Click **Build your own template in the editor**.
4. Paste the following template into the editor. Replace `<workspace-name>`, `<workspace-id>`, and `<tenant-id>` (your Microsoft Entra Directory (tenant) ID) with your values, then click **Save**:

   ```json
   {
     "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
     "contentVersion": "1.0.0.0",
     "resources": [
       {
         "type": "Microsoft.Fabric/privateLinkServicesForFabric",
         "apiVersion": "2024-06-01",
         "name": "<workspace-name>-pls",
         "location": "global",
         "properties": {
           "tenantId": "<tenant-id>",
           "workspaceId": "<workspace-id>"
         }
       }
     ]
   }
   ```

5. Select your **Subscription** and **Resource group**, then click **Review + create** → **Create**.
6. Once the deployment completes, navigate to your **resource group** and select **Manage view** → **Show hidden types** to reveal the Private Link Service resource. Click the resource to open it and copy the **Resource ID** from the overview page. You will need the Resource ID to submit your Private Link request.

   The Resource ID path format is:
   `/subscriptions/<subscription_id>/resourceGroups/<resource_group>/providers/Microsoft.Fabric/privateLinkServicesForFabric/<name>`


## Submit a Private Link request to dbt

Add the required information to the following template and submit your Azure Private Link request to [dbt Support](mailto:support@getdbt.com):

<Expandable alt_header="Support request email template" is_open={true}>

```text
Subject: New Azure Multi-Tenant Private Link Request

- Type: Microsoft Fabric
- dbt platform account URL:
- Fabric workspace name:
- Fabric Private Link Service resource ID:
  /subscriptions/<subscription_id>/resourceGroups/<resource_group>/providers/Microsoft.Fabric/privateLinkServicesForFabric/<name>
- dbt Azure multi-tenant environment (EMEA):
- Azure region of your Fabric workspace (for example, centralus, westeurope):
```

</Expandable>

## Approve the Private Link connection

Once dbt Support confirms the private endpoint has been created on our side:

1. In the [Azure portal](https://portal.azure.com), search for **Private Link** and select it.
2. Under the **Private Link** section in the sidebar, select **Pending connections**.
3. Select the connection from <Constant name="dbt" /> (the name will contain `dbt`).
4. Click **Approve**.
5. Confirm with dbt Support that the connection has been approved so they can validate it and make it available in <Constant name="dbt" />.

## Create connection in dbt

Once dbt Support confirms the endpoint is available, configure the connection in <Constant name="dbt" />:

1. Navigate to **Settings** → **Create new project** → select **Microsoft Fabric**.
2. You will see two radio buttons: **Default Endpoint** and **PrivateLink Endpoint**. Select **PrivateLink Endpoint**.
3. Select the private endpoint from the dropdown. This will populate the **Server** field with the private SQL hostname provided by dbt Support.
4. Configure the remaining connection details:

   | Field | Value |
   |-------|-------|
   | **Port** | `1433` |
   | **Database** | Your Fabric warehouse name |
   | **Authentication** | Service Principal |
   | **Tenant ID** | Your Microsoft Entra Directory (tenant) ID |
   | **Client ID** | Your service principal's application (client) ID |
   | **Client secret** | Your service principal's client secret |

   :::note Service principal requirements
   The service principal must be added as a **Member** or **Contributor** on the Fabric workspace. In the Fabric Admin portal, **Service principals can use Fabric APIs** must also be enabled under **Tenant settings** → **Developer settings**.
   :::

5. Test your connection and save it.
