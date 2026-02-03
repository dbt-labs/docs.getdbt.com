---
title: "Connect Azure Synapse Analytics"
description: "Configure Azure Synapse Analytics connection."
sidebar_label: "Connect Azure Synapse Analytics"
---

# Connect Azure Synapse Analytics

## Supported authentication methods
The supported authentication methods are: 
- Microsoft Entra ID service principal
- Active Directory password
- SQL server authentication

### Microsoft Entra ID service principal 
The following are the required fields for setting up a connection with Azure Synapse Analytics using Microsoft Entra ID service principal authentication. 

| Field | Description |
| --- | --- |
| **Server** | The service principal's **Synapse host name** value (without the trailing string `, 1433`) for the Synapse test endpoint. |
| **Port** | The port to connect to Azure Synapse Analytics. You can use `1433` (the default), which is the standard SQL server port number. |
| **Database** | The service principal's **database** value for the Synapse test endpoint. |
| **Authentication** | Choose **Service Principal** from the dropdown. | 
| **Tenant ID** | The service principal's **Directory (tenant) ID**. |
| **Client ID** | The service principal's **application (client) ID id**. |
| **Client secret** | The service principal's **client secret** (not the **client secret id**). |  


### Active Directory password 

The following are the required fields for setting up a connection with Azure Synapse Analytics using Active Directory password authentication. 

| Field | Description |
| --- | --- |
| **Server** | The server hostname to connect to Azure Synapse Analytics. |
| **Port** | The server port. You can use `1433` (the default), which is the standard SQL server port number. |
| **Database** | The database name. |
| **Authentication** | Choose **Active Directory Password** from the dropdown. | 
| **User** | The AD username. |
| **Password** | The AD username's password. |


### SQL server authentication

The following are the required fields for setting up a connection with Azure Synapse Analytics using SQL server authentication. 

| Field | Description |
| --- | --- |
| **Server** | The server hostname or IP to connect to Azure Synapse Analytics. |
| **Port** | The server port. You can use `1433` (the default), which is the standard SQL server port number. |
| **Database** | The database name. |
| **Authentication** | Choose **SQL** from the dropdown. | 
| **User** | The username. |
| **Password** | The username's password. |


## Configuration 

To learn how to optimize performance with data platform-specific configurations in <Constant name="cloud" />, refer to [Microsoft Azure Synapse DWH configurations](/reference/resource-configs/azuresynapse-configs).
