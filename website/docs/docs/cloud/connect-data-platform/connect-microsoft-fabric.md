---
title: "Connect Microsoft Fabric"
description: "Configure Microsoft Fabric connection."
sidebar_label: "Connect Microsoft Fabric"
---

## Supported authentication methods
The supported authentication methods are: 
- Microsoft Entra service principal
- Microsoft Entra password

SQL password (LDAP) is not supported in Microsoft Fabric Data Warehouse so you must use Microsoft Entra ID. This means that to use [Microsoft Fabric](https://www.microsoft.com/en-us/microsoft-fabric) in <Constant name="cloud" />, you will need at least one Microsoft Entra service principal to connect <Constant name="cloud" /> to Fabric, ideally one service principal for each user.

### Microsoft Entra service principal 
The following are the required fields for setting up a connection with a Microsoft Fabric using Microsoft Entra service principal authentication. 

| Field | Description |
| --- | --- |
| **Server** | The service principal's **host** value for the Fabric test endpoint. |
| **Port** | The port to connect to Microsoft Fabric. You can use `1433` (the default), which is the standard SQL server port number. |
| **Database** | The service principal's **database** value for the Fabric test endpoint. |
| **Authentication** | Choose **Service Principal** from the dropdown. | 
| **Tenant ID** | The service principal's **Directory (tenant) ID**. |
| **Client ID** | The service principal's **application (client) ID id**. |
| **Client secret** | The service principal's **client secret** (not the **client secret id**). |  


### Microsoft Entra password 

The following are the required fields for setting up a connection with a Microsoft Fabric using Microsoft Entra password authentication. 

| Field | Description |
| --- | --- |
| **Server** | The server hostname to connect to Microsoft Fabric. |
| **Port** | The server port. You can use `1433` (the default), which is the standard SQL server port number. |
| **Database** | The database name. |
| **Authentication** | Choose **Active Directory Password** from the dropdown. | 
| **User** | The Microsoft Entra username. |
| **Password** | The Microsoft Entra password. |

## Configuration 

To learn how to optimize performance with data platform-specific configurations in <Constant name="cloud" />, refer to [Microsoft Fabric Data Warehouse configurations](/reference/resource-configs/fabric-configs).
