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

### Configuring PrivateLink

dbt Cloud supports the following data platforms for use with the PrivateLink feature. Instructions for enabling PrivateLink for the various data platform providers are unique. The following guides will walk you through the necessary steps, including working with [dbt Support](https://docs.getdbt.com/guides/legacy/getting-help#dbt-cloud-support) to complete the connection in the dbt private network and setting up the endpoint in dbt Cloud.

- [Redshift](/redshift-privatelink)
- [Snowflake](/snowflake-privatelink)
- [Databricks](/databricks-privatelink)
