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

Private connections enables secure communication from any <Constant name="cloud" /> environment to your data platform hosted on a cloud provider, such as [AWS](https://aws.amazon.com/privatelink/) or [Azure](https://azure.microsoft.com/en-us/products/private-link), using that provider's private connection technology. Private connections allow <Constant name="cloud" /> customers to meet security and compliance controls as it allows connectivity between <Constant name="cloud" /> and your data platform without traversing the public internet. This feature is supported in most regions across North America, Europe, and Asia, but [contact us](https://www.getdbt.com/contact/) if you have questions about availability.

<CloudProviders type='a data platform' />

<PrivateConnectivityMatrix/>

---

## Setting up private connectivity

### Cross-region private connections

dbt Labs has globally connected private networks specifically used to host private endpoints, which are connected to <Constant name="cloud" /> instance environments. This connectivity allows for <Constant name="cloud" /> environments to connect to any supported region from any <Constant name="cloud" /> instance within the same cloud provider network. To ensure security, access to these endpoints is protected by security groups, network policies, and application connection safeguards, in addition to the authentication and authorization mechanisms provided by each of the connected platforms.

:::note GCP regional considerations
Some GCP services, such as BigQuery, may have regional restrictions for Private Service Connect endpoints. Refer to [Google's Private Service Connect documentation](https://cloud.google.com/vpc/docs/private-service-connect) for service-specific regional availability.
:::

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
- [Self-hosted services](/docs/cloud/secure/az-self-hosted-private-link)

#### GCP
- [Snowflake](/docs/cloud/secure/snowflake-psc)
- [BigQuery](/docs/cloud/secure/bigquery-psc)
- [Self-hosted services](/docs/cloud/secure/gcp-self-hosted-psc)

<PrivateLinkHostnameWarning features={'/snippets/_private-connection-hostname-restriction.md'}/>

---

## Terminology

### Parties

<table>
  <thead>
    <tr>
      <th>Term</th>
      <th>Definition</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Consumer</strong></td>
      <td>The party that creates a private endpoint to connect to a service. The consumer initiates the connection.</td>
    </tr>
    <tr>
      <td><strong>Service producer</strong></td>
      <td>The party that provisions and manages the service that the consumer connects to. The service producer publishes a resource ID that the consumer uses to finalize and establish the connection.</td>
    </tr>
  </tbody>
</table>

### Provisioning models

These models describe who acts as the **service producer** (the party that provisions the service that dbt Cloud connects to or that you connect to).

<table>
  <thead>
    <tr>
      <th>Term</th>
      <th>Definition</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Native</strong></td>
      <td>The cloud platform (AWS, Azure, GCP) is the service producer for its own services (Redshift, Synapse, BigQuery). You obtain the resource ID from the cloud platform and share it with dbt; dbt is the consumer and creates the private endpoint.</td>
    </tr>
    <tr>
      <td><strong>Vendor</strong></td>
      <td>A third-party vendor (Snowflake, Databricks, Teradata) is the service producer. You obtain the resource ID from the vendor and share it with dbt; dbt is the consumer and creates the private endpoint.</td>
    </tr>
    <tr>
      <td><strong>Customer-provisioned</strong></td>
      <td>You are the service producer. You generate your own resource ID (endpoint service name, alias, or service attachment URI) and share it with dbt; dbt is the consumer and creates the private endpoint.</td>
    </tr>
    <tr>
      <td><strong>dbt-provisioned</strong></td>
      <td>dbt is the service producer. You are the consumer and create the private endpoint in your environment to connect to dbt Cloud. This applies only to connections TO dbt Cloud.</td>
    </tr>
  </tbody>
</table>
