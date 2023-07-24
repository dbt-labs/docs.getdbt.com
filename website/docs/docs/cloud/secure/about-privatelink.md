---
title: "About PrivateLink"
id: about-privatelink
description: "Configuring PrivateLink for AWS"
sidebar_label: "About PrivateLink"
---
:::info 
This feature is currently in Private Preview, and these instructions are specific to dbt Cloud multi-tenant Enterprise tier environments hosted on AWS. 
:::

PrivateLink enables a private connection from any dbt Cloud Multi-Tenant environment to your data platform hosted on AWS using [AWS PrivateLink](https://aws.amazon.com/privatelink/) technology. PrivateLink allows dbt Cloud customers to meet security and compliance controls as it allows connectivity between dbt Cloud and your data platform without traversing the public internet. This feature is supported in most regions across NA, Europe, and Asia, but [contact us](https://www.getdbt.com/contact/) if you have questions about availability. 

### Cross-region PrivateLink

dbt Labs has a worldwide network of regional VPCs. These VPCs are specifically used to host PrivateLink VPC endpoints, which are connected to dbt Cloud instance environments. To ensure security, access to these endpoints is protected by security groups, network policies, and application connection safeguards. The connected services are also authenticated. Currently, we have multiple customers successfully connecting to their PrivateLink endpoints in different AWS regions within dbt Cloud.

### Configuring PrivateLink

dbt Cloud supports the following data platforms for use with the PrivateLink feature. Instructions for enabling PrivateLink for the various data platform providers are unique. The following guides will walk you through the necessary steps, including working with [dbt Support](https://docs.getdbt.com/community/resources/getting-help#dbt-cloud-support) to complete the connection in the dbt private network and setting up the endpoint in dbt Cloud.

- [Redshift](/docs/cloud/secure/redshift-privatelink)
- [Snowflake](/docs/cloud/secure/snowflake-privatelink)
- [Databricks](/docs/cloud/secure/databricks-privatelink)
