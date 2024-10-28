---
title: "About PrivateLink"
id: about-privatelink
description: "Configuring PrivateLink for AWS"
sidebar_label: "About PrivateLink"
---

import SetUpPages from '/snippets/_available-tiers-privatelink.md';
import PrivateLinkHostnameWarning from '/snippets/_privatelink-hostname-restriction.md';
import CloudProviders from '/snippets/_privatelink-across-providers.md';

<SetUpPages features={'/snippets/_available-tiers-privatelink.md'}/>

PrivateLink enables a private connection from any dbt Cloud Multi-Tenant environment to your data platform hosted on a cloud provider, such as [AWS](https://aws.amazon.com/privatelink/) or [Azure](https://azure.microsoft.com/en-us/products/private-link), using that provider’s PrivateLink technology. PrivateLink allows dbt Cloud customers to meet security and compliance controls as it allows connectivity between dbt Cloud and your data platform without traversing the public internet. This feature is supported in most regions across NA, Europe, and Asia, but [contact us](https://www.getdbt.com/contact/) if you have questions about availability.

<CloudProviders type='a data platform' />

### Cross-region PrivateLink

dbt Labs has a worldwide network of regional VPCs. These VPCs are specifically used to host PrivateLink VPC endpoints, which are connected to dbt Cloud instance environments. To ensure security, access to these endpoints is protected by security groups, network policies, and application connection safeguards. The connected services are also authenticated. Currently, we have multiple customers successfully connecting to their PrivateLink endpoints in different AWS regions within dbt Cloud.

### Configuring PrivateLink

dbt Cloud supports the following data platforms for use with the PrivateLink feature. Instructions for enabling PrivateLink for the various data platform providers are unique. The following guides will walk you through the necessary steps, including working with [dbt Support](https://docs.getdbt.com/community/resources/getting-help#dbt-cloud-support) to complete the connection in the dbt private network and setting up the endpoint in dbt Cloud.

- [Snowflake](/docs/cloud/secure/snowflake-privatelink)
- [Databricks](/docs/cloud/secure/databricks-privatelink)
- [Redshift](/docs/cloud/secure/redshift-privatelink)
- [Postgres](/docs/cloud/secure/postgres-privatelink)
- [VCS](/docs/cloud/secure/vcs-privatelink)

<PrivateLinkHostnameWarning features={'/snippets/_privatelink-hostname-restriction.md'}/>
