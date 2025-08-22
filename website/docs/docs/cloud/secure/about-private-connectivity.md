---
title: "About private connectivity"
id: about-private-connectivity
description: "Configuring private connections"
sidebar_label: "About private connectivity"
---

import SetUpPages from '/snippets/_available-tiers-private-connection.md';
import PrivateLinkHostnameWarning from '/snippets/_private-connection-hostname-restriction.md';
import CloudProviders from '/snippets/_private-connection-across-providers.md';
import PrivateConnectivityMatrix from '/snippets/_private-connectivity-matrix.md';

<SetUpPages features={'/snippets/_available-tiers-private-connection.md'}/>

Private connections enables secure communication from any <Constant name="cloud" /> environment to your data platform hosted on a cloud provider, such as [AWS](https://aws.amazon.com/privatelink/) or [Azure](https://azure.microsoft.com/en-us/products/private-link), using that provider’s private connection technology. Private connections allow <Constant name="cloud" /> customers to meet security and compliance controls as it allows connectivity between <Constant name="cloud" /> and your data platform without traversing the public internet. This feature is supported in most regions across North America, Europe, and Asia, but [contact us](https://www.getdbt.com/contact/) if you have questions about availability.

<CloudProviders type='a data platform' />

<PrivateConnectivityMatrix/>

### Cross-region private connections

dbt Labs has globally connected private networks specifically used to host private endpoints, which are connected to <Constant name="cloud" /> instance environments. This connectivity allows for <Constant name="cloud" /> environments to connect to any supported region from any <Constant name="cloud" /> instance within the same cloud provider network. To ensure security, access to these endpoints is protected by security groups, network policies, and application connection safeguards, in addition to the authentication and authorization mechanisms provided by each of the connected platforms.

### Configuring private connections

<Constant name="cloud" /> supports the following data platforms for use with the private connections feature. Instructions for enabling private connections for the various data platform providers are unique. The following guides will walk you through the necessary steps, including working with [dbt Support](/community/resources/getting-help#dbt-cloud-support) to complete the connection in the dbt private network and setting up the endpoint in <Constant name="cloud" />.

#### AWS
- [Snowflake](/docs/cloud/secure/snowflake-privatelink)
- [Databricks](/docs/cloud/secure/databricks-privatelink)
- [Redshift](/docs/cloud/secure/redshift-privatelink)
- [Postgres](/docs/cloud/secure/postgres-privatelink)
- [VCS](/docs/cloud/secure/vcs-privatelink)

#### Azure
- [Snowflake](/docs/cloud/secure/snowflake-private-link)
- [Databricks](/docs/cloud/secure/databricks-private-link)
- [Database for Postgres Flexible Server](/docs/cloud/secure/az-postgres-private-link)
- [Synapse](/docs/cloud/secure/az-synapse-private-link)

#### GCP
- [Snowflake](/docs/cloud/secure/snowflake-psc)

<PrivateLinkHostnameWarning features={'/snippets/_private-connection-hostname-restriction.md'}/>
