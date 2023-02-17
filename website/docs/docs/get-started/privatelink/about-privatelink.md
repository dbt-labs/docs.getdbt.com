---
title: "About PrivateLink"
id: about-privatelink
description: "Configuring PrivateLink for AWS"
sidebar_label: "About PrivateLink"
---
:::info 
This feature is currently in Private Preview, and these instructions are specific to dbt Cloud multi-tenant environments on AWS. 
:::

PrivateLink enables you to connect your data platform hosted on AWS to a dbt Cloud multi-tenant environment over the AWS backbone using the PrivateLink technology. PrivateLink allows dbt Cloud customers to meet security and compliance controls as it restricts information shared between dbt Cloud and the data platform from reaching the public internet. This feature is supported in most regions across NA, Europe, and Asia, but [contact us](https://www.getdbt.com/contact/) if you have questions about availability. 

To learn more, refer to the [AWS PrivateLink documentation](https://aws.amazon.com/privatelink/).

dbt Cloud supports these data platforms that you can use the AWS PrivateLink feature with: 

- Redshift
- Snowflake
- Databricks

## Configure PrivateLink

You need to contact the dbt Cloud support team to complete the integration. It is not a self-service feature at this time. Ensure that the subject contains "Multi-tenant PrivateLink" in some form. Please allow 1-2 business days for our teams to complete the setup on our side. 

### Set up

dbt provisions the infrastructure pieces to ensure there are PrivateLink endpoints for a given account. Enabling this ensures connections can be configured as _private_ and only communicates with the data platform over a PrivateLink. Once enabled, there are two available data platform connection types in dbt Cloud: public and private. 

Public connections are the classic connections that work today which communicate with the data warehouse over the public internet. Private connections are secured by PrivateLink and will always guarantee that all connections to the data platform are secured with AWS PrivateLink. dbt Cloud support configures the private endpoints on the backend once the infrastructure team provisions all the required services. Please contact them with your organization name and which instance it's hosted in (such as EMEA, NA, and AU).  

Provide the support team with the following information: 

- dbt Cloud Account ID
- Data platform (such as Snowflake and Redshift)
- PrivateLink name
- Number of endpoints &mdash; Typically you only need one but if you have multiple warehouses or projects that require their own PrivateLink, you may need multiple endpoints.
- Any additional information specific to your data platform. 

Instructions for configuring the various data platform providers are unique. The following guides outline the steps:

- [Redshift](/redshift-privatelink)
- [Snowflake](/snowflake-privatelink)
- [Databricks](/databricks-privatelink)

### Configure new endpoints with PrivateLink

Once dbt Cloud support completes the configuration, you can begin creating new connections using PrivateLink: 

1. Navigate to **Settings** → **Create new project** → select the supported data platform (Snowflake/Databricks/Redshift). 
2. Select **Private** for a private connection.
3. Select the private endpoint from the dropdown. When you do this, dbt Cloud automatically populates the hostname/account field.
4. Configure the remaining data platform details.
5. Test your connection and save it.
