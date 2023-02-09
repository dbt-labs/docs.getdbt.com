---
title: "About PrivateLinks"
id: about-private-link
description: "Configuring PrivateLinks for AWS"
sidebar_label: "About PrivateLinks"
---

## What is PrivateLink?

PrivateLink enables you to connect your data warehouse (DWH) hosted on AWS, in any region, to dbt Cloud multi-tenant over the AWS backbone using the PrivateLink technology. PrivateLink allows dbt Cloud customers to meet security and compliance controls as it restricts information shared between dbt Cloud and the DWH from reaching the public internet. You can read more about AWS PrivateLink technology [here](https://aws.amazon.com/privatelink/).

The initial release of support for AWS PrivateLink features integration with the following data warehouse providers:

- Redshift
- Snowflake
- Databricks

## Configuring PrivateLink

Customers on all supported platforms will have to contact the dbt support team to complete the integration. It is not a self-service feature at this time. Ensure that the subject contains "Multi-tenant PrivateLink" in some form. Please allow 24-48 hours for our teams to complete the setup on our side. 

### Setup

dbt will provision the infrastructure pieces to ensure there are PrivateLink endpoints for a given account. Enabling this will ensure connections can be configured as “private” and will only communicate with the DWH over a PrivateLink. Once enabled, there will be two available DWH connection types in dbt Cloud: public and private. 

Public connections are the classic connections that work today which communicate with the data warehouse over the public internet. Private connections are secured by PrivateLink and will always guarantee that all connections to the DWH are secured via AWS PrivateLink. Private endpoints are configured by dbt support on the backend once the infrastructure team provisions all the required services. Reach out to them with your organization name and which instance it's hosted in (EMEA, NA, AU).  

Provide the support team with the following information: 

1. dbt Cloud Account ID
2. Data Warehouse (Snowflake, Redshift, etc)
3. PrivateLink Name
4. Number of Endpoints - Most customers need one but if you have multiple warehouses or projects that require their own PrivateLink, you may need multiple endpoints.
5. Any additional information specific to your DWH. See the setup guides for more information.

Instructions for configuring the various DWH providers are unique. The following guides outline the steps:

- [Databricks](/databricks-privatelink)
- [Redshift](/redshift-privatelink)
- [Snowflake](/snowflake-privatelink)

### Configuring new endpoints with PrivateLink

Once support has completed the configuration, you can start creating new connections using PrivateLink. 

1. Navigate to settings → Create new project → select the supported DWH (Snowflake/Databricks/Redshift) 
2. You will see two radio buttons: **Public** and **Private.** Select Private 
3. Select the private endpoint from the dropdown (this will automatically populate the hostname/account field)
4. Configure the remaining DWH details 
5. Test your connection and save it