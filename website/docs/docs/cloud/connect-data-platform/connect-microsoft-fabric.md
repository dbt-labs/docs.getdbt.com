---
title: "Connect Microsoft Fabric"
description: "Configure Microsoft Fabric connection."
sidebar_label: "Connect Microsoft Fabric"
---

## Supported authentication methods
The two supported authentication methods are: 
- Azure Active Directory service principal
- Azure Active Directory password

SQL password (LDAP) is not supported in Microsoft Fabric Synapse Data Warehouse so you must use Azure Active Directory (Azure AD). This means that to use Microsoft Fabric in dbt Cloud, you will need at least one Azure AD service principal to connect dbt Cloud to Fabric, ideally one service principal for each user.

### Active Directory service principal 
The following are the required fields for setting up a connection with a [Microsoft Fabric](https://docs.starburst.io/starburst-enterprise/index.html) using Azure AD service principal authentication. 

| Field | Description |
| --- | --- |
| **Server** | The service principal's **host** value for the Fabric test endpoint. |
| **Port** | The port to connect to Microsoft Fabric. By default, it's 1433 for the standard SQL server port number. |
| **Database** | The service principal's **database** value for the Fabric test endpoint. |
| **Authentication** | Choose **Service Principal** from the dropdown. | 
| **Tenant ID** | The service principal's **Directory (tenant) ID**. |
| **Client ID** | The service principal's **application (client) ID id**. |
| **Client secret** | The service principal's **client secret** (not the **client secret id**). |  


### Active Directory password 

The following are the required fields for setting up a connection with a [Microsoft Fabric](https://docs.starburst.io/starburst-enterprise/index.html) using Azure AD password authentication. 

| Field | Description |
| --- | --- |
| **Server** | The server hostname. |
| **Port** | The server port. By default, it's 1433 for the standard SQL server port number. |
| **Database** | The database name. |
| **Authentication** | Choose **Active Directory Password** from the dropdown. | 
| **User** | The AD username. |
| **Password** | The AD username's password. |

## Configuration 

To learn how to optimize performance with data platform-specific configurations in dbt Cloud, refer to [Microsoft Fabric DWH configurations](/reference/resource-configs/fabric-configs).
