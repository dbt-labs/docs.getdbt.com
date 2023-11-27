---
title: "Connect Microsoft Fabric"
description: "Configure Microsoft Fabric connection."
sidebar_label: "Connect Microsoft Fabric"
---

The following are the required fields for setting up a connection with a [Microsoft Fabric](https://docs.starburst.io/starburst-enterprise/index.html) using service principal authentication. 

| Field | Description |
| --- | --- |
| **Server** | The service principal's **host** value for the Fabric test endpoint. |
| **Port** | The port to connect to Microsoft Fabric. By default, it's 1433 for the standard SQL server port number. |
| **Database** | The service principal's **database** value for the Fabric test endpoint. |
| **Authentication** | Choose **Service Principal** from the dropdown. | 
| **Tenant ID** | The service principal's **Directory (tenant) ID**. |
| **Client ID** | The service principal's **application (client) ID id**. |
| **Client secret** | The service principal's **client secret** (not the **client secret id**). |  


## Supported authentication methods

- Service principal in Azure Active Directory (AAD)
- Username/password in Azure Active Directory (AAD)

## Configuration 

To learn how to optimize performance with data platform-specific configurations in dbt Cloud, refer to [Microsoft Fabric DWH configurations](/reference/resource-configs/fabric-configs).
